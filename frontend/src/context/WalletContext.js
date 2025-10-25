/**
 * Wallet Context Provider - STANDALONE VERSION
 * Global state management for wallet connection WITHOUT Freighter dependency
 * Supports: Create wallet, Import wallet, Connect read-only
 */

import React, { createContext, useState, useContext, useEffect } from "react";
import WalletService from "../services/WalletService";

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
  const [walletType, setWalletType] = useState(null); // 'created', 'imported', 'readonly'
  const [walletName, setWalletName] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [balance, setBalance] = useState(null);

  /**
   * Check for stored wallet on mount
   */
  useEffect(() => {
    const storedWallet = WalletService.checkStoredWallet();
    if (storedWallet) {
      setPublicKey(storedWallet.publicKey);
      setWalletType(storedWallet.walletType);
      setWalletName(storedWallet.walletName || "My Wallet");
      setIsLocked(storedWallet.needsUnlock);
      setIsReadOnly(storedWallet.walletType === "readonly");
      setIsConnected(true);
      
      console.log("🔄 Wallet detected:", storedWallet);
      
      // Auto-load balance for read-only wallets
      if (storedWallet.walletType === "readonly") {
        loadBalance(storedWallet.publicKey);
      }
    }
  }, []);

  /**
   * Create a new wallet
   * @param {string} walletName - Name for the wallet
   * @param {string} password - Password to encrypt secret key
   * @returns {Object} { publicKey, secretKey, mnemonic }
   */
  const createWallet = async (walletName, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await WalletService.createWallet(walletName, password);
      
      setPublicKey(result.publicKey);
      setWalletType("created");
      setWalletName(walletName);
      setIsConnected(true);
      setIsLocked(false);
      setIsReadOnly(false);

      console.log("✅ Wallet created:", result.publicKey);
      
      // Load balance
      await loadBalance();

      return result; // Return secret key & mnemonic for backup
    } catch (err) {
      console.error("Create wallet failed:", err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Import existing wallet using secret key
   * @param {string} secretKey - Stellar secret key (S...)
   * @param {string} password - Password to encrypt secret key
   * @param {string} walletName - Optional name
   * @returns {Object} { publicKey }
   */
  const importWallet = async (secretKey, password, walletName = "Imported Wallet") => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await WalletService.importWallet(secretKey, password, walletName);
      
      setPublicKey(result.publicKey);
      setWalletType("imported");
      setWalletName(walletName);
      setIsConnected(true);
      setIsLocked(false);
      setIsReadOnly(false);

      console.log("✅ Wallet imported:", result.publicKey);
      
      // Load balance
      await loadBalance();

      return result;
    } catch (err) {
      console.error("Import wallet failed:", err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Connect read-only wallet using public key
   * @param {string} publicKey - Stellar public key (G...)
   * @param {string} walletName - Optional name
   * @returns {Object} { publicKey, readonly: true }
   */
  const connectReadOnly = async (publicKey, walletName = "Read-Only Wallet") => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await WalletService.connectReadOnly(publicKey, walletName);
      
      setPublicKey(result.publicKey);
      setWalletType("readonly");
      setWalletName(walletName);
      setIsConnected(true);
      setIsLocked(false);
      setIsReadOnly(true);

      console.log("✅ Connected read-only:", result.publicKey);
      
      // Load balance
      await loadBalance();

      return result;
    } catch (err) {
      console.error("Connect read-only failed:", err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Unlock wallet with password
   * @param {string} password - User's password
   */
  const unlockWallet = async (password) => {
    setIsLoading(true);
    setError(null);

    try {
      await WalletService.unlockWallet(password);
      setIsLocked(false);
      
      console.log("🔓 Wallet unlocked");
      
      // Load balance
      await loadBalance();

      return true;
    } catch (err) {
      console.error("Unlock wallet failed:", err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Lock wallet (clears keypair from memory)
   */
  const lockWallet = () => {
    WalletService.lockWallet();
    setIsLocked(true);
    console.log("🔒 Wallet locked");
  };

  /**
   * Disconnect wallet completely
   */
  const disconnectWallet = () => {
    WalletService.disconnectWallet();
    setPublicKey("");
    setIsConnected(false);
    setWalletType(null);
    setWalletName("");
    setIsLocked(false);
    setIsReadOnly(false);
    setBalance(null);
    setError(null);
    console.log("� Wallet disconnected");
  };

  /**
   * Load account balance
   */
  const loadBalance = async (pubKey = null) => {
    try {
      const balanceData = await WalletService.getBalance(pubKey);
      setBalance(balanceData);
      return balanceData;
    } catch (err) {
      console.error("Load balance failed:", err);
      // Don't throw, balance loading is not critical
      return null;
    }
  };

  /**
   * Get wallet info
   */
  const getWalletInfo = () => {
    return WalletService.getWalletInfo();
  };

  const value = {
    // State
    publicKey,
    isConnected,
    walletType,
    walletName,
    isLocked,
    isReadOnly,
    isLoading,
    error,
    balance,
    
    // Actions
    createWallet,
    importWallet,
    connectReadOnly,
    unlockWallet,
    lockWallet,
    disconnectWallet,
    loadBalance,
    getWalletInfo,
    
    // Service reference for advanced usage
    walletService: WalletService,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

export default WalletContext;
