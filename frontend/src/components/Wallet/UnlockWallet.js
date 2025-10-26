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
    <div className="max-w-md mx-auto p-8 bg-card rounded-2xl shadow-2xl border border-border">
      <div className="text-center mb-6">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Wallet Locked</h2>
        <p className="text-muted-foreground">
          Enter your password to unlock
        </p>
        <p className="text-sm font-semibold text-accent mt-2">
          {walletName || "Imported Wallet"}
        </p>
      </div>

      <form onSubmit={handleUnlock} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
            autoFocus
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="animate-spin">⏳</span>
              Unlocking...
            </>
          ) : (
            <>
              <span>🔓</span>
              Unlock Wallet
            </>
          )}
        </button>
      </form>

      {(localError || error) && (
        <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-lg text-sm">
          {localError || error}
        </div>
      )}

      <div className="mt-6 p-4 bg-secondary rounded-lg text-sm">
        <p className="text-muted-foreground flex items-start gap-2">
          <span>💡</span>
          <span>
            <strong>Tip:</strong> Your password is used to encrypt your secret key locally. 
            We never send your password anywhere.
          </span>
        </p>
      </div>
    </div>
  );
};

export default UnlockWallet;
