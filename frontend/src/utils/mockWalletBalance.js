/**
 * Mock Wallet Balance Management for Demo
 * Since we're not using real Stellar testnet, we'll simulate wallet balances
 */

const BALANCE_STORAGE_KEY = 'stellarpledge_wallet_balances';

/**
 * Initialize wallet balance for a user
 * @param {string} publicKey - User's wallet public key
 * @param {number} amount - Initial balance (default: 10000 XLM)
 */
export const initializeBalance = (publicKey, amount = 10000) => {
  if (!publicKey) return;
  
  const balances = JSON.parse(localStorage.getItem(BALANCE_STORAGE_KEY) || '{}');
  
  // Only initialize if not already set
  if (!balances[publicKey]) {
    balances[publicKey] = amount;
    localStorage.setItem(BALANCE_STORAGE_KEY, JSON.stringify(balances));
    console.log(`💰 Initialized balance for ${publicKey}: ${amount} XLM`);
  }
  
  return balances[publicKey];
};

/**
 * Get wallet balance
 * @param {string} publicKey - User's wallet public key
 * @returns {number} Balance in XLM
 */
export const getBalance = (publicKey) => {
  if (!publicKey) return 0;
  
  const balances = JSON.parse(localStorage.getItem(BALANCE_STORAGE_KEY) || '{}');
  return balances[publicKey] || 0;
};

/**
 * Update wallet balance
 * @param {string} publicKey - User's wallet public key
 * @param {number} newBalance - New balance amount
 */
export const setBalance = (publicKey, newBalance) => {
  if (!publicKey) return;
  
  const balances = JSON.parse(localStorage.getItem(BALANCE_STORAGE_KEY) || '{}');
  balances[publicKey] = newBalance;
  localStorage.setItem(BALANCE_STORAGE_KEY, JSON.stringify(balances));
  
  console.log(`💰 Updated balance for ${publicKey}: ${newBalance} XLM`);
  
  // Dispatch event to notify components
  window.dispatchEvent(new CustomEvent('balance-update', { 
    detail: { publicKey, balance: newBalance } 
  }));
  
  return newBalance;
};

/**
 * Deduct amount from wallet (for pledges)
 * @param {string} publicKey - User's wallet public key
 * @param {number} amount - Amount to deduct
 * @returns {number} New balance
 */
export const deductBalance = (publicKey, amount) => {
  if (!publicKey || amount <= 0) return getBalance(publicKey);
  
  const currentBalance = getBalance(publicKey);
  
  if (currentBalance < amount) {
    throw new Error(`Insufficient balance. You have ${currentBalance} XLM but tried to pledge ${amount} XLM`);
  }
  
  const newBalance = currentBalance - amount;
  return setBalance(publicKey, newBalance);
};

/**
 * Add amount to wallet (for receiving funds)
 * @param {string} publicKey - User's wallet public key
 * @param {number} amount - Amount to add
 * @returns {number} New balance
 */
export const addBalance = (publicKey, amount) => {
  if (!publicKey || amount <= 0) return getBalance(publicKey);
  
  const currentBalance = getBalance(publicKey);
  const newBalance = currentBalance + amount;
  return setBalance(publicKey, newBalance);
};

/**
 * Transfer funds from one wallet to another
 * @param {string} fromPublicKey - Sender's public key
 * @param {string} toPublicKey - Receiver's public key
 * @param {number} amount - Amount to transfer
 */
export const transferFunds = (fromPublicKey, toPublicKey, amount) => {
  if (!fromPublicKey || !toPublicKey || amount <= 0) {
    throw new Error('Invalid transfer parameters');
  }
  
  // Deduct from sender
  deductBalance(fromPublicKey, amount);
  
  // Add to receiver
  addBalance(toPublicKey, amount);
  
  console.log(`💸 Transferred ${amount} XLM from ${fromPublicKey} to ${toPublicKey}`);
};

/**
 * Get all balances (for debugging)
 */
export const getAllBalances = () => {
  return JSON.parse(localStorage.getItem(BALANCE_STORAGE_KEY) || '{}');
};

/**
 * Reset all balances (for testing)
 */
export const resetAllBalances = () => {
  localStorage.removeItem(BALANCE_STORAGE_KEY);
  console.log('🔄 All balances reset');
};

// Make functions available globally for debugging
if (typeof window !== 'undefined') {
  window.walletBalance = {
    get: getBalance,
    set: setBalance,
    init: initializeBalance,
    deduct: deductBalance,
    add: addBalance,
    transfer: transferFunds,
    getAll: getAllBalances,
    reset: resetAllBalances
  };
}
