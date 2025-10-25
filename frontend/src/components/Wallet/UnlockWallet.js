/**
 * Unlock Wallet Component
 * Prompts user to enter password to unlock wallet for signing transactions
 */

import React, { useState } from "react";
import { useWallet } from "../../context/WalletContext";

const UnlockWallet = ({ onSuccess }) => {
  const { unlockWallet, isLoading, error, walletName } = useWallet();
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const handleUnlock = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!password) {
      setLocalError("Password is required");
      return;
    }

    try {
      await unlockWallet(password);
      setPassword("");
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setLocalError(err.message || "Failed to unlock wallet. Wrong password?");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <div className="text-5xl mb-3">🔒</div>
        <h2 className="text-2xl font-bold text-gray-800">Wallet Locked</h2>
        <p className="text-gray-600 mt-2">
          Enter your password to unlock <strong>{walletName || "your wallet"}</strong>
        </p>
      </div>

      <form onSubmit={handleUnlock} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
        >
          {isLoading ? "Unlocking..." : "🔓 Unlock Wallet"}
        </button>
      </form>

      {(localError || error) && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {localError || error}
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-gray-700">
        <p>
          <strong>💡 Tip:</strong> Your password is used to encrypt your secret key locally. 
          We never send your password anywhere.
        </p>
      </div>
    </div>
  );
};

export default UnlockWallet;
