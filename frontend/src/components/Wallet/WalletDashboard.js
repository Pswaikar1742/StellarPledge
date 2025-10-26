/**
 * Wallet Dashboard Component - Compact Header Version
 * Shows connected wallet info, balance, and management options
 */

import React, { useEffect } from "react";
import { useWallet } from "../../context/WalletContext";
import { Button } from "../ui/button";
import { Lock, LogOut } from "lucide-react";

const WalletDashboard = () => {
  const {
    publicKey,
    isConnected,
    isLocked,
    isReadOnly,
    balance,
    disconnectWallet,
    lockWallet,
    loadBalance,
  } = useWallet();

  useEffect(() => {
    if (isConnected && !isLocked) {
      loadBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, isLocked]);

  if (!isConnected) {
    return null;
  }

  const formatPublicKey = (key) => {
    return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
  };

  const getXLMBalance = () => {
    // Balance is now a simple number from mock wallet
    if (balance === null || balance === undefined) return "0";
    return typeof balance === 'number' ? balance.toFixed(2) : "0";
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(publicKey);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Balance Display */}
      <div className="hidden md:flex items-center gap-2 bg-secondary px-4 py-2 rounded-lg">
        <span className="text-sm text-muted-foreground">Balance:</span>
        <span className="text-sm font-bold text-accent">{getXLMBalance()} XLM</span>
      </div>

      {/* Address */}
      <button
        onClick={handleCopyAddress}
        className="hidden sm:flex items-center gap-2 bg-secondary px-4 py-2 rounded-lg hover:bg-secondary/80 transition-colors"
        title="Click to copy address"
      >
        <span className="text-sm font-mono text-muted-foreground">
          {formatPublicKey(publicKey)}
        </span>
        {isReadOnly && (
          <span className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">
            Read-Only
          </span>
        )}
      </button>

      {/* Lock Button (only for non-read-only) */}
      {!isReadOnly && (
        <Button
          variant="outline"
          size="icon"
          onClick={lockWallet}
          title="Lock Wallet"
        >
          <Lock className="w-4 h-4" />
        </Button>
      )}

      {/* Disconnect Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={disconnectWallet}
        title="Disconnect Wallet"
      >
        <LogOut className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default WalletDashboard;
