/**
 * Wallet Context Provider
 * Global state management for wallet connection and user data
 */

import React, { createContext, useState, useContext, useEffect } from "react";
import { checkConnection, retrievePublicKey, isInstalled } from "../components/Shared/Freighter";

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within WalletProvider");
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const [publicKey, setPublicKey] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isFreighterInstalled, setIsFreighterInstalled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if Freighter is installed on mount
  useEffect(() => {
    const checkFreighter = async () => {
      const installed = await isInstalled();
      setIsFreighterInstalled(installed);
    };
    checkFreighter();
  }, []);

  /**
   * Connect to Freighter wallet
   */
  const connectWallet = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check if Freighter is installed
      if (!isFreighterInstalled) {
        throw new Error("Freighter wallet is not installed. Please install it from freighter.app");
      }

      // Check connection
      const allowed = await checkConnection();
      if (!allowed) {
        throw new Error("Connection to Freighter was denied. Please try again.");
      }

      // Get public key
      const pubKey = await retrievePublicKey();
      setPublicKey(pubKey);
      setIsConnected(true);

      // Store in localStorage for persistence
      localStorage.setItem("stellarpledge_wallet", pubKey);

      console.log("✅ Wallet connected:", pubKey);
      return pubKey;
    } catch (err) {
      console.error("Wallet connection failed:", err);
      setError(err.message);
      setIsConnected(false);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Disconnect wallet
   */
  const disconnectWallet = () => {
    setPublicKey("");
    setIsConnected(false);
    localStorage.removeItem("stellarpledge_wallet");
    console.log("👋 Wallet disconnected");
  };

  /**
   * Try to restore wallet connection from localStorage
   */
  useEffect(() => {
    const savedWallet = localStorage.getItem("stellarpledge_wallet");
    if (savedWallet && isFreighterInstalled) {
      // Auto-reconnect
      checkConnection().then((allowed) => {
        if (allowed) {
          setPublicKey(savedWallet);
          setIsConnected(true);
          console.log("🔄 Wallet auto-reconnected:", savedWallet);
        }
      });
    }
  }, [isFreighterInstalled]);

  const value = {
    publicKey,
    isConnected,
    isFreighterInstalled,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

export default WalletContext;
