/**
 * Standalone Wallet Service
 * Handles wallet creation, import, and signing WITHOUT Freighter dependency
 * Users can create new wallets or import existing ones using secret keys
 */

import * as StellarSDK from "@stellar/stellar-sdk";
import { NETWORK_CONFIG } from "../constants/constants";

/**
 * Wallet Storage Keys
 */
const STORAGE_KEYS = {
  WALLET_TYPE: "stellarpledge_wallet_type", // 'imported' or 'created' or 'readonly'
  PUBLIC_KEY: "stellarpledge_public_key",
  ENCRYPTED_SECRET: "stellarpledge_encrypted_secret", // Never store unencrypted!
  WALLET_NAME: "stellarpledge_wallet_name",
};

/**
 * Simple encryption/decryption using user password
 * NOTE: This is basic encryption. For production, use stronger encryption libraries
 */
class SimpleEncryption {
  static encrypt(text, password) {
    try {
      // XOR-based encryption (basic, for demo purposes)
      const encrypted = text.split('').map((char, i) => {
        const keyChar = password.charCodeAt(i % password.length);
        return String.fromCharCode(char.charCodeAt(0) ^ keyChar);
      }).join('');
      return btoa(encrypted); // Base64 encode
    } catch (error) {
      throw new Error("Encryption failed: " + error.message);
    }
  }

  static decrypt(encrypted, password) {
    try {
      const decoded = atob(encrypted); // Base64 decode
      const decrypted = decoded.split('').map((char, i) => {
        const keyChar = password.charCodeAt(i % password.length);
        return String.fromCharCode(char.charCodeAt(0) ^ keyChar);
      }).join('');
      return decrypted;
    } catch (error) {
      throw new Error("Decryption failed: " + error.message);
    }
  }
}

/**
 * Wallet Service Class
 */
class WalletService {
  constructor() {
    this.keypair = null;
    this.publicKey = null;
    this.walletType = null;
    this.server = new StellarSDK.Horizon.Server(NETWORK_CONFIG.HORIZON_URL);
  }

  /**
   * Create a new Stellar wallet
   * @param {string} walletName - Optional name for the wallet
   * @param {string} password - Password to encrypt secret key
   * @returns {Object} { publicKey, secretKey, mnemonic }
   */
  async createWallet(walletName = "My Wallet", password) {
    try {
      if (!password || password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      // Generate new keypair
      const keypair = StellarSDK.Keypair.random();
      const publicKey = keypair.publicKey();
      const secretKey = keypair.secret();

      // Generate mnemonic for backup (optional)
      const mnemonic = this._generateMnemonic();

      // Encrypt and store secret key
      const encryptedSecret = SimpleEncryption.encrypt(secretKey, password);
      
      // Store wallet data
      localStorage.setItem(STORAGE_KEYS.WALLET_TYPE, "created");
      localStorage.setItem(STORAGE_KEYS.PUBLIC_KEY, publicKey);
      localStorage.setItem(STORAGE_KEYS.ENCRYPTED_SECRET, encryptedSecret);
      localStorage.setItem(STORAGE_KEYS.WALLET_NAME, walletName);

      // Set instance variables
      this.keypair = keypair;
      this.publicKey = publicKey;
      this.walletType = "created";

      console.log("✅ New wallet created:", publicKey);

      return {
        publicKey,
        secretKey, // Return once for user to backup
        mnemonic,
        success: true,
      };
    } catch (error) {
      console.error("Create wallet error:", error);
      throw new Error("Failed to create wallet: " + error.message);
    }
  }

  /**
   * Import existing wallet using secret key
   * @param {string} secretKey - Stellar secret key (starts with S)
   * @param {string} password - Password to encrypt secret key
   * @param {string} walletName - Optional name for the wallet
   * @returns {Object} { publicKey, success }
   */
  async importWallet(secretKey, password, walletName = "Imported Wallet") {
    try {
      if (!password || password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      if (!secretKey || !secretKey.startsWith("S")) {
        throw new Error("Invalid secret key format. Must start with 'S'");
      }

      // Validate secret key
      let keypair;
      try {
        keypair = StellarSDK.Keypair.fromSecret(secretKey);
      } catch (error) {
        throw new Error("Invalid secret key: " + error.message);
      }

      const publicKey = keypair.publicKey();

      // Verify account exists on network (optional check)
      try {
        await this.server.loadAccount(publicKey);
        console.log("✅ Account verified on blockchain");
      } catch (error) {
        console.warn("⚠️  Account not found on blockchain (unfunded account)");
      }

      // Encrypt and store secret key
      const encryptedSecret = SimpleEncryption.encrypt(secretKey, password);
      
      localStorage.setItem(STORAGE_KEYS.WALLET_TYPE, "imported");
      localStorage.setItem(STORAGE_KEYS.PUBLIC_KEY, publicKey);
      localStorage.setItem(STORAGE_KEYS.ENCRYPTED_SECRET, encryptedSecret);
      localStorage.setItem(STORAGE_KEYS.WALLET_NAME, walletName);

      // Set instance variables
      this.keypair = keypair;
      this.publicKey = publicKey;
      this.walletType = "imported";

      console.log("✅ Wallet imported:", publicKey);

      return {
        publicKey,
        success: true,
      };
    } catch (error) {
      console.error("Import wallet error:", error);
      throw new Error("Failed to import wallet: " + error.message);
    }
  }

  /**
   * Connect read-only using just public key
   * @param {string} publicKey - Stellar public key (starts with G)
   * @param {string} walletName - Optional name
   * @returns {Object} { publicKey, success, readonly: true }
   */
  async connectReadOnly(publicKey, walletName = "Read-Only Wallet") {
    try {
      if (!publicKey || !publicKey.startsWith("G")) {
        throw new Error("Invalid public key format. Must start with 'G'");
      }

      // Validate public key format
      try {
        StellarSDK.StrKey.decodeEd25519PublicKey(publicKey);
      } catch (error) {
        throw new Error("Invalid public key: " + error.message);
      }

      // Verify account exists on network
      try {
        await this.server.loadAccount(publicKey);
        console.log("✅ Account verified on blockchain");
      } catch (error) {
        throw new Error("Account not found on blockchain. Make sure the address is correct and funded.");
      }

      // Store as read-only wallet (no secret key)
      localStorage.setItem(STORAGE_KEYS.WALLET_TYPE, "readonly");
      localStorage.setItem(STORAGE_KEYS.PUBLIC_KEY, publicKey);
      localStorage.setItem(STORAGE_KEYS.WALLET_NAME, walletName);
      localStorage.removeItem(STORAGE_KEYS.ENCRYPTED_SECRET); // No secret for read-only

      // Set instance variables
      this.keypair = null; // No signing capability
      this.publicKey = publicKey;
      this.walletType = "readonly";

      console.log("✅ Connected read-only:", publicKey);

      return {
        publicKey,
        success: true,
        readonly: true,
      };
    } catch (error) {
      console.error("Connect read-only error:", error);
      throw new Error("Failed to connect: " + error.message);
    }
  }

  /**
   * Unlock wallet (decrypt secret key with password)
   * @param {string} password - User's password
   * @returns {boolean} Success status
   */
  async unlockWallet(password) {
    try {
      const encryptedSecret = localStorage.getItem(STORAGE_KEYS.ENCRYPTED_SECRET);
      const publicKey = localStorage.getItem(STORAGE_KEYS.PUBLIC_KEY);
      const walletType = localStorage.getItem(STORAGE_KEYS.WALLET_TYPE);

      if (!publicKey) {
        throw new Error("No wallet found. Please create or import a wallet first.");
      }

      if (walletType === "readonly") {
        // Read-only wallet, no secret key
        this.publicKey = publicKey;
        this.walletType = "readonly";
        this.keypair = null;
        return true;
      }

      if (!encryptedSecret) {
        throw new Error("Wallet data corrupted. No secret key found.");
      }

      // Decrypt secret key
      const secretKey = SimpleEncryption.decrypt(encryptedSecret, password);
      
      // Recreate keypair
      this.keypair = StellarSDK.Keypair.fromSecret(secretKey);
      this.publicKey = publicKey;
      this.walletType = walletType;

      console.log("🔓 Wallet unlocked:", publicKey);
      return true;
    } catch (error) {
      console.error("Unlock wallet error:", error);
      throw new Error("Failed to unlock wallet. Wrong password?");
    }
  }

  /**
   * Lock wallet (clear keypair from memory)
   */
  lockWallet() {
    this.keypair = null;
    console.log("🔒 Wallet locked");
  }

  /**
   * Disconnect wallet (clear all data)
   */
  disconnectWallet() {
    localStorage.removeItem(STORAGE_KEYS.WALLET_TYPE);
    localStorage.removeItem(STORAGE_KEYS.PUBLIC_KEY);
    localStorage.removeItem(STORAGE_KEYS.ENCRYPTED_SECRET);
    localStorage.removeItem(STORAGE_KEYS.WALLET_NAME);
    
    this.keypair = null;
    this.publicKey = null;
    this.walletType = null;

    console.log("👋 Wallet disconnected");
  }

  /**
   * Sign transaction using stored keypair
   * @param {Transaction} transaction - Stellar transaction to sign
   * @returns {Transaction} Signed transaction
   */
  async signTransaction(transaction) {
    try {
      if (!this.keypair) {
        throw new Error("Wallet is locked or read-only. Cannot sign transactions.");
      }

      transaction.sign(this.keypair);
      console.log("✍️  Transaction signed");
      return transaction;
    } catch (error) {
      console.error("Sign transaction error:", error);
      throw new Error("Failed to sign transaction: " + error.message);
    }
  }

  /**
   * Get account balance
   * @param {string} publicKey - Optional, uses current wallet if not provided
   * @returns {Object} Balance information
   */
  async getBalance(publicKey = null) {
    try {
      const address = publicKey || this.publicKey;
      if (!address) {
        throw new Error("No wallet connected");
      }

      const account = await this.server.loadAccount(address);
      
      const balances = account.balances.map(balance => ({
        asset_type: balance.asset_type,
        asset_code: balance.asset_code || "XLM",
        asset_issuer: balance.asset_issuer || null,
        balance: balance.balance,
      }));

      return {
        publicKey: address,
        balances,
        sequence: account.sequence,
      };
    } catch (error) {
      console.error("Get balance error:", error);
      throw new Error("Failed to fetch balance: " + error.message);
    }
  }

  /**
   * Check if wallet exists in storage
   * @returns {Object|null} Wallet info or null
   */
  static checkStoredWallet() {
    const publicKey = localStorage.getItem(STORAGE_KEYS.PUBLIC_KEY);
    const walletType = localStorage.getItem(STORAGE_KEYS.WALLET_TYPE);
    const walletName = localStorage.getItem(STORAGE_KEYS.WALLET_NAME);

    if (publicKey) {
      return {
        publicKey,
        walletType,
        walletName,
        needsUnlock: walletType !== "readonly",
      };
    }
    return null;
  }

  /**
   * Get current wallet info
   * @returns {Object} Current wallet data
   */
  getWalletInfo() {
    return {
      publicKey: this.publicKey,
      walletType: this.walletType,
      isLocked: !this.keypair && this.walletType !== "readonly",
      isReadOnly: this.walletType === "readonly",
      walletName: localStorage.getItem(STORAGE_KEYS.WALLET_NAME),
    };
  }

  /**
   * Helper: Generate mnemonic phrase (for backup)
   * @private
   */
  _generateMnemonic() {
    const words = [
      "stellar", "pledge", "campaign", "blockchain", "crypto", "wallet",
      "funding", "reward", "creator", "backer", "testnet", "secure"
    ];
    
    // Simple random mnemonic (in production, use BIP39)
    const mnemonic = [];
    for (let i = 0; i < 12; i++) {
      mnemonic.push(words[Math.floor(Math.random() * words.length)]);
    }
    
    return mnemonic.join(" ");
  }
}

// Export singleton instance
export default new WalletService();
