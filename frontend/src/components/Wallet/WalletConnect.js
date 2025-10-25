/**
 * Wallet Connect Component
 * Unified interface for creating, importing, or connecting to wallets
 */

import React, { useState } from "react";
import { useWallet } from "../../context/WalletContext";

const WalletConnect = () => {
  const { createWallet, importWallet, connectReadOnly, isLoading, error } = useWallet();
  
  const [mode, setMode] = useState("options"); // 'options', 'create', 'import', 'readonly'
  const [formData, setFormData] = useState({
    walletName: "",
    password: "",
    confirmPassword: "",
    secretKey: "",
    publicKey: "",
  });
  const [backupData, setBackupData] = useState(null);
  const [showSecret, setShowSecret] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateWallet = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    if (formData.password.length < 8) {
      alert("Password must be at least 8 characters long!");
      return;
    }

    try {
      const result = await createWallet(formData.walletName || "My Wallet", formData.password);
      setBackupData(result);
      setMode("backup");
    } catch (err) {
      console.error("Create wallet error:", err);
    }
  };

  const handleImportWallet = async (e) => {
    e.preventDefault();

    if (formData.password.length < 8) {
      alert("Password must be at least 8 characters long!");
      return;
    }

    if (!formData.secretKey.startsWith("S")) {
      alert("Invalid secret key! Must start with 'S'");
      return;
    }

    try {
      await importWallet(formData.secretKey, formData.password, formData.walletName || "Imported Wallet");
      setMode("success");
    } catch (err) {
      console.error("Import wallet error:", err);
    }
  };

  const handleConnectReadOnly = async (e) => {
    e.preventDefault();

    if (!formData.publicKey.startsWith("G")) {
      alert("Invalid public key! Must start with 'G'");
      return;
    }

    try {
      await connectReadOnly(formData.publicKey, formData.walletName || "Read-Only Wallet");
      setMode("success");
    } catch (err) {
      console.error("Connect read-only error:", err);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  // Options Screen
  if (mode === "options") {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Connect Wallet</h2>
        
        <div className="space-y-4">
          <button
            onClick={() => setMode("create")}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            🆕 Create New Wallet
          </button>

          <button
            onClick={() => setMode("import")}
            className="w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            📥 Import Existing Wallet
          </button>

          <button
            onClick={() => setMode("readonly")}
            className="w-full py-3 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            👁️ Connect Read-Only
          </button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Note:</strong> StellarPledge is a standalone wallet. You don't need Freighter extension!
          </p>
        </div>
      </div>
    );
  }

  // Create Wallet Screen
  if (mode === "create") {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <button onClick={() => setMode("options")} className="mb-4 text-blue-600 hover:underline">
          ← Back
        </button>

        <h2 className="text-2xl font-bold mb-6">Create New Wallet</h2>

        <form onSubmit={handleCreateWallet} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Wallet Name (Optional)</label>
            <input
              type="text"
              name="walletName"
              value={formData.walletName}
              onChange={handleInputChange}
              placeholder="My Stellar Wallet"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              minLength={8}
              placeholder="Min 8 characters"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              minLength={8}
              placeholder="Re-enter password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            {isLoading ? "Creating..." : "Create Wallet"}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-gray-700">
            ⚠️ <strong>Important:</strong> Your password encrypts your secret key. Store it safely!
          </p>
        </div>
      </div>
    );
  }

  // Backup Screen (after creating wallet)
  if (mode === "backup" && backupData) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-green-600">✅ Wallet Created!</h2>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <label className="block text-sm font-medium mb-2">Public Key (Address)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={backupData.publicKey}
                readOnly
                className="flex-1 px-4 py-2 bg-white border rounded-lg"
              />
              <button
                onClick={() => copyToClipboard(backupData.publicKey)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Copy
              </button>
            </div>
          </div>

          <div className="p-4 bg-red-50 rounded-lg border-2 border-red-300">
            <label className="block text-sm font-medium mb-2 text-red-700">
              🔐 Secret Key (BACKUP THIS NOW!)
            </label>
            <div className="flex gap-2">
              <input
                type={showSecret ? "text" : "password"}
                value={backupData.secretKey}
                readOnly
                className="flex-1 px-4 py-2 bg-white border rounded-lg font-mono text-sm"
              />
              <button
                onClick={() => setShowSecret(!showSecret)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                {showSecret ? "Hide" : "Show"}
              </button>
              <button
                onClick={() => copyToClipboard(backupData.secretKey)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Copy
              </button>
            </div>
            <p className="mt-2 text-sm text-red-700">
              ⚠️ <strong>CRITICAL:</strong> Save this secret key! You'll need it to recover your wallet. Never share it!
            </p>
          </div>

          {backupData.mnemonic && (
            <div className="p-4 bg-yellow-50 rounded-lg">
              <label className="block text-sm font-medium mb-2">Recovery Phrase</label>
              <p className="text-sm bg-white p-3 rounded border">
                {backupData.mnemonic}
              </p>
            </div>
          )}
        </div>

        <button
          onClick={() => {
            setBackupData(null);
            setMode("success");
          }}
          className="mt-6 w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          I've Saved My Secret Key - Continue
        </button>
      </div>
    );
  }

  // Import Wallet Screen
  if (mode === "import") {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <button onClick={() => setMode("options")} className="mb-4 text-blue-600 hover:underline">
          ← Back
        </button>

        <h2 className="text-2xl font-bold mb-6">Import Wallet</h2>

        <form onSubmit={handleImportWallet} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Secret Key *</label>
            <input
              type="password"
              name="secretKey"
              value={formData.secretKey}
              onChange={handleInputChange}
              required
              placeholder="S... (starts with S)"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 font-mono"
            />
            <p className="mt-1 text-sm text-gray-600">Your Stellar secret key (starts with S)</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Wallet Name (Optional)</label>
            <input
              type="text"
              name="walletName"
              value={formData.walletName}
              onChange={handleInputChange}
              placeholder="Imported Wallet"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              minLength={8}
              placeholder="Min 8 characters"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
            <p className="mt-1 text-sm text-gray-600">This encrypts your secret key locally</p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition"
          >
            {isLoading ? "Importing..." : "Import Wallet"}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}
      </div>
    );
  }

  // Read-Only Connect Screen
  if (mode === "readonly") {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <button onClick={() => setMode("options")} className="mb-4 text-blue-600 hover:underline">
          ← Back
        </button>

        <h2 className="text-2xl font-bold mb-6">Connect Read-Only</h2>

        <form onSubmit={handleConnectReadOnly} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Public Key (Address) *</label>
            <input
              type="text"
              name="publicKey"
              value={formData.publicKey}
              onChange={handleInputChange}
              required
              placeholder="G... (starts with G)"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 font-mono"
            />
            <p className="mt-1 text-sm text-gray-600">Your Stellar public address (starts with G)</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Wallet Name (Optional)</label>
            <input
              type="text"
              name="walletName"
              value={formData.walletName}
              onChange={handleInputChange}
              placeholder="Read-Only Wallet"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 transition"
          >
            {isLoading ? "Connecting..." : "Connect"}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-gray-700">
            ℹ️ <strong>Read-Only Mode:</strong> You can view campaigns and balances but cannot sign transactions.
          </p>
        </div>
      </div>
    );
  }

  // Success Screen
  if (mode === "success") {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-bold mb-4 text-green-600">Connected Successfully!</h2>
        <p className="text-gray-700">Your wallet is now connected to StellarPledge.</p>
      </div>
    );
  }

  return null;
};

export default WalletConnect;
