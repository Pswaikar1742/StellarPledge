/**
 * Freighter Wallet Integration Layer
 * Abstracts Freighter wallet operations for easy wallet management
 */

import {
  requestAccess,
  signTransaction,
  setAllowed,
  isConnected as freighterIsConnected,
} from "@stellar/freighter-api";

/**
 * Check if Freighter wallet is installed and connected
 * @returns {Promise<boolean>} True if wallet is accessible
 */
export async function checkConnection() {
  try {
    const isAllowed = await setAllowed();
    if (isAllowed) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Freighter connection check failed:", error);
    return false;
  }
}

/**
 * Check if Freighter extension is installed in browser
 * @returns {Promise<boolean>} True if Freighter is installed
 */
export async function isInstalled() {
  try {
    return await freighterIsConnected();
  } catch (error) {
    return false;
  }
}

/**
 * Request access to user's wallet and retrieve public key
 * @returns {Promise<string>} Public key of connected wallet
 * @throws {Error} If access is denied or Freighter not available
 */
export async function retrievePublicKey() {
  try {
    const publicKey = await requestAccess();
    return publicKey;
  } catch (error) {
    console.error("Failed to retrieve public key:", error);
    throw new Error("Failed to connect to Freighter wallet. Make sure it's installed and unlocked.");
  }
}

/**
 * Sign a transaction using Freighter wallet
 * @param {string} xdr - Transaction XDR to sign
 * @param {string} network - Network passphrase ('TESTNET' or 'PUBLIC')
 * @param {string} signWith - Public key of the account to sign with
 * @returns {Promise<string>} Signed transaction XDR
 * @throws {Error} If signing fails
 */
export async function userSignTransaction(xdr, network, signWith) {
  try {
    const signedTransaction = await signTransaction(xdr, {
      network,
      accountToSign: signWith,
    });
    return signedTransaction;
  } catch (error) {
    console.error("Transaction signing failed:", error);
    throw new Error("User rejected transaction or signing failed.");
  }
}

/**
 * Helper to format public key for display
 * @param {string} publicKey - Full public key
 * @returns {string} Formatted key (e.g., "GDMT...5FTF")
 */
export function formatPublicKey(publicKey) {
  if (!publicKey || publicKey.length < 10) return "";
  return `${publicKey.substring(0, 4)}...${publicKey.substring(publicKey.length - 4)}`;
}

export default {
  checkConnection,
  isInstalled,
  retrievePublicKey,
  userSignTransaction,
  formatPublicKey,
};
