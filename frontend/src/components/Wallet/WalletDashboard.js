/**
 * Wallet Dashboard Component
 * Shows connected wallet info, balance, and management options
 */

import React, { useEffect } from "react";
import { useWallet } from "../../context/WalletContext";

const WalletDashboard = () => {
  const {
    publicKey,
    isConnected,
    walletType,
    walletName,
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
  }, [isConnected, isLocked]);

  if (!isConnected) {
    return null;
  }

  const formatPublicKey = (key) => {
    return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
  };

  const getXLMBalance = () => {
    if (!balance || !balance.balances) return "0";
    const xlmBalance = balance.balances.find(b => b.asset_code === "XLM");
    return xlmBalance ? parseFloat(xlmBalance.balance).toFixed(2) : "0";
  };

  const getWalletTypeLabel = () => {
    switch (walletType) {
      case "created":
        return "Created Wallet";
      case "imported":
        return "Imported Wallet";
      case "readonly":
        return "Read-Only";
      default:
        return "Unknown";
    }
  };

  const getWalletTypeIcon = () => {
    switch (walletType) {
      case "created":
        return "🆕";
      case "imported":
        return "📥";
      case "readonly":
        return "👁️";
      default:
        return "💼";
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(publicKey);
    alert("Public key copied to clipboard!");
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">
            {getWalletTypeIcon()} {walletName || "My Wallet"}
          </h3>
          <span className="text-sm text-gray-600">{getWalletTypeLabel()}</span>
        </div>
        
        <div className="flex gap-2">
          {!isReadOnly && !isLocked && (
            <button
              onClick={lockWallet}
              className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
              title="Lock Wallet"
            >
              🔒 Lock
            </button>
          )}
          <button
            onClick={disconnectWallet}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
            title="Disconnect"
          >
            Disconnect
          </button>
        </div>
      </div>

      {/* Public Key */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <label className="block text-xs font-medium text-gray-600 mb-1">Public Key</label>
        <div className="flex items-center justify-between">
          <span className="text-sm font-mono text-gray-800">
            {formatPublicKey(publicKey)}
          </span>
          <button
            onClick={copyToClipboard}
            className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Balance */}
      <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <label className="block text-xs font-medium text-gray-600 mb-1">Balance</label>
        <div className="text-2xl font-bold text-gray-800">
          {getXLMBalance()} <span className="text-lg text-gray-600">XLM</span>
        </div>
        {balance && balance.balances && balance.balances.length > 1 && (
          <button
            onClick={loadBalance}
            className="mt-2 text-xs text-blue-600 hover:underline"
          >
            View All Assets
          </button>
        )}
      </div>

      {/* Status Badges */}
      <div className="flex flex-wrap gap-2">
        {isLocked && (
          <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
            🔒 Locked
          </span>
        )}
        {isReadOnly && (
          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
            👁️ Read-Only
          </span>
        )}
        {!isLocked && !isReadOnly && (
          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
            ✅ Ready to Sign
          </span>
        )}
      </div>

      {/* Network Info */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>Network:</span>
          <span className="font-medium text-orange-600">TESTNET</span>
        </div>
      </div>
    </div>
  );
};

export default WalletDashboard;
