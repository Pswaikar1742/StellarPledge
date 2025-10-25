// Error Handling Utilities for StellarPledge

/**
 * Centralized error handling system
 * Provides user-friendly messages and recovery suggestions
 */

// Error Categories
export const ErrorCategory = {
  NETWORK: 'network',
  WALLET: 'wallet',
  CONTRACT: 'contract',
  USER_INPUT: 'user_input',
  BLOCKCHAIN: 'blockchain',
  UNKNOWN: 'unknown'
};

// Error Severity
export const ErrorSeverity = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  CRITICAL: 'critical'
};

/**
 * Custom Error Classes
 */
export class StellarPledgeError extends Error {
  constructor(message, category, severity = ErrorSeverity.ERROR, userMessage = null, recovery = null) {
    super(message);
    this.name = 'StellarPledgeError';
    this.category = category;
    this.severity = severity;
    this.userMessage = userMessage || message;
    this.recovery = recovery;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Parse and categorize errors from various sources
 */
export function parseError(error) {
  // Network errors
  if (error.message?.includes('fetch') || error.message?.includes('network')) {
    return new StellarPledgeError(
      error.message,
      ErrorCategory.NETWORK,
      ErrorSeverity.WARNING,
      'Network connection issue. Please check your internet and try again.',
      { action: 'retry', maxRetries: 3, delay: 2000 }
    );
  }

  // Freighter wallet errors
  if (error.message?.includes('Freighter') || error.message?.includes('User declined')) {
    return new StellarPledgeError(
      error.message,
      ErrorCategory.WALLET,
      ErrorSeverity.INFO,
      'Transaction cancelled. You can try again whenever you\'re ready.',
      { action: 'user_cancelled', showRetry: true }
    );
  }

  // Insufficient balance
  if (error.message?.includes('insufficient') || error.message?.includes('balance')) {
    return new StellarPledgeError(
      error.message,
      ErrorCategory.USER_INPUT,
      ErrorSeverity.WARNING,
      'Insufficient XLM balance. Please check your wallet balance and try a smaller amount.',
      { action: 'check_balance', showFundingLink: true }
    );
  }

  // Smart contract errors
  if (error.message?.includes('contract') || error.message?.includes('invoke')) {
    return new StellarPledgeError(
      error.message,
      ErrorCategory.CONTRACT,
      ErrorSeverity.ERROR,
      'Smart contract error. This campaign may have ended or been claimed.',
      { action: 'refresh', showSupportLink: true }
    );
  }

  // Transaction timeout
  if (error.message?.includes('timeout') || error.message?.includes('timed out')) {
    return new StellarPledgeError(
      error.message,
      ErrorCategory.BLOCKCHAIN,
      ErrorSeverity.WARNING,
      'Transaction is taking longer than expected. It may still complete. Check your wallet history.',
      { action: 'wait_and_check', showExplorerLink: true }
    );
  }

  // Deadline passed
  if (error.message?.includes('deadline')) {
    return new StellarPledgeError(
      error.message,
      ErrorCategory.CONTRACT,
      ErrorSeverity.INFO,
      'This campaign has ended. You can only pledge to active campaigns.',
      { action: 'browse_active', redirectTo: '/campaigns' }
    );
  }

  // Already claimed
  if (error.message?.includes('already claimed')) {
    return new StellarPledgeError(
      error.message,
      ErrorCategory.CONTRACT,
      ErrorSeverity.INFO,
      'This campaign has already been claimed by the creator.',
      { action: 'view_history', showTransactionHash: true }
    );
  }

  // Campaign not found
  if (error.message?.includes('not found') || error.message?.includes('404')) {
    return new StellarPledgeError(
      error.message,
      ErrorCategory.USER_INPUT,
      ErrorSeverity.WARNING,
      'Campaign not found. It may have been deleted or the ID is incorrect.',
      { action: 'browse_campaigns', redirectTo: '/campaigns' }
    );
  }

  // Wrong network
  if (error.message?.includes('network') && error.message?.includes('mainnet')) {
    return new StellarPledgeError(
      error.message,
      ErrorCategory.WALLET,
      ErrorSeverity.CRITICAL,
      '⚠️ WRONG NETWORK! Please switch Freighter to TESTNET in settings.',
      { action: 'switch_network', blockActions: true }
    );
  }

  // Generic error
  return new StellarPledgeError(
    error.message || 'An unexpected error occurred',
    ErrorCategory.UNKNOWN,
    ErrorSeverity.ERROR,
    'Something went wrong. Please try again or contact support if the issue persists.',
    { action: 'retry', showSupportLink: true }
  );
}

/**
 * Error Logger - sends errors to console and optional analytics
 */
export function logError(error, context = {}) {
  const errorData = {
    message: error.message,
    category: error.category,
    severity: error.severity,
    userMessage: error.userMessage,
    recovery: error.recovery,
    timestamp: error.timestamp,
    context,
    stack: error.stack
  };

  // Console logging based on severity
  switch (error.severity) {
    case ErrorSeverity.CRITICAL:
      console.error('🔴 CRITICAL ERROR:', errorData);
      break;
    case ErrorSeverity.ERROR:
      console.error('❌ ERROR:', errorData);
      break;
    case ErrorSeverity.WARNING:
      console.warn('⚠️ WARNING:', errorData);
      break;
    case ErrorSeverity.INFO:
      console.info('ℹ️ INFO:', errorData);
      break;
    default:
      console.log('📝 LOG:', errorData);
  }

  // Optional: Send to analytics service
  // if (window.analytics) {
  //   window.analytics.track('Error Occurred', errorData);
  // }

  return errorData;
}

/**
 * Retry mechanism for transient errors
 */
export async function retryOperation(operation, maxRetries = 3, delay = 2000) {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}/${maxRetries}...`);
      return await operation();
    } catch (error) {
      lastError = error;
      console.warn(`Attempt ${attempt} failed:`, error.message);

      if (attempt < maxRetries) {
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 1.5; // Exponential backoff
      }
    }
  }

  throw new StellarPledgeError(
    `Operation failed after ${maxRetries} attempts`,
    ErrorCategory.NETWORK,
    ErrorSeverity.ERROR,
    `Failed after ${maxRetries} attempts. Please check your connection and try again.`,
    { action: 'manual_retry', lastError: lastError.message }
  );
}

/**
 * Validate user input before blockchain operations
 */
export function validatePledgeAmount(amount, userBalance, minPledge = 1) {
  const errors = [];

  // Check if amount is a valid number
  if (!amount || isNaN(amount)) {
    errors.push({
      field: 'amount',
      message: 'Please enter a valid amount',
      severity: ErrorSeverity.ERROR
    });
  }

  // Check minimum pledge
  if (amount < minPledge) {
    errors.push({
      field: 'amount',
      message: `Minimum pledge is ${minPledge} XLM`,
      severity: ErrorSeverity.WARNING
    });
  }

  // Check user balance (include fees)
  const requiredBalance = parseFloat(amount) + 0.5; // 0.5 XLM buffer for fees
  if (userBalance < requiredBalance) {
    errors.push({
      field: 'balance',
      message: `Insufficient balance. You need ${requiredBalance} XLM (including fees). Current balance: ${userBalance} XLM`,
      severity: ErrorSeverity.ERROR
    });
  }

  return errors;
}

/**
 * Validate campaign creation data
 */
export function validateCampaignData(campaignData) {
  const errors = [];

  // Validate goal
  if (!campaignData.goal || campaignData.goal < 1) {
    errors.push({
      field: 'goal',
      message: 'Funding goal must be at least 1 XLM',
      severity: ErrorSeverity.ERROR
    });
  }

  // Validate deadline
  if (!campaignData.deadline || campaignData.deadline < 1) {
    errors.push({
      field: 'deadline',
      message: 'Campaign duration must be at least 1 hour',
      severity: ErrorSeverity.ERROR
    });
  }

  // Validate perk configuration
  if (campaignData.hasPerk) {
    if (!campaignData.perkThreshold || campaignData.perkThreshold < 1) {
      errors.push({
        field: 'perkThreshold',
        message: 'Perk threshold must be at least 1 XLM',
        severity: ErrorSeverity.ERROR
      });
    }

    if (campaignData.perkThreshold > campaignData.goal) {
      errors.push({
        field: 'perkThreshold',
        message: 'Perk threshold cannot exceed funding goal',
        severity: ErrorSeverity.WARNING
      });
    }

    if (!campaignData.perkAssetAddress || campaignData.perkAssetAddress.length < 56) {
      errors.push({
        field: 'perkAssetAddress',
        message: 'Please enter a valid Stellar asset contract address',
        severity: ErrorSeverity.ERROR
      });
    }

    if (!campaignData.perkAmount || campaignData.perkAmount < 1) {
      errors.push({
        field: 'perkAmount',
        message: 'Perk amount must be at least 1 unit',
        severity: ErrorSeverity.ERROR
      });
    }
  }

  return errors;
}

/**
 * Network health check
 */
export async function checkNetworkHealth(rpcUrl) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getHealth'
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      return { healthy: true, latency: response.headers.get('X-Response-Time') };
    }

    return { healthy: false, reason: 'Unhealthy response' };
  } catch (error) {
    return { healthy: false, reason: error.message };
  }
}

/**
 * Detect Freighter wallet
 */
export async function checkFreighterInstalled() {
  if (typeof window.freighter === 'undefined') {
    throw new StellarPledgeError(
      'Freighter wallet not detected',
      ErrorCategory.WALLET,
      ErrorSeverity.CRITICAL,
      'Freighter wallet is not installed. Please install it to use StellarPledge.',
      {
        action: 'install_freighter',
        installUrl: 'https://www.freighter.app/',
        blockActions: true
      }
    );
  }

  return true;
}

/**
 * Check if user is on correct network (Testnet)
 */
export async function checkNetworkType() {
  try {
    const network = await window.freighter.getNetwork();
    
    if (network !== 'TESTNET') {
      throw new StellarPledgeError(
        'Wrong network detected',
        ErrorCategory.WALLET,
        ErrorSeverity.CRITICAL,
        '⚠️ CRITICAL: You are on MAINNET! Please switch Freighter to TESTNET.',
        {
          action: 'switch_to_testnet',
          blockActions: true,
          steps: [
            '1. Open Freighter extension',
            '2. Click Settings',
            '3. Select Network → Testnet',
            '4. Refresh this page'
          ]
        }
      );
    }

    return true;
  } catch (error) {
    if (error instanceof StellarPledgeError) throw error;
    
    // If we can't check network, warn but don't block
    console.warn('Could not verify network type:', error);
    return false;
  }
}

/**
 * User-friendly error messages mapping
 */
export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: 'Please connect your Freighter wallet first',
  TRANSACTION_REJECTED: 'Transaction was cancelled. You can try again.',
  INSUFFICIENT_BALANCE: 'You don\'t have enough XLM for this transaction',
  CAMPAIGN_ENDED: 'This campaign has ended and is no longer accepting pledges',
  CAMPAIGN_NOT_FOUND: 'Campaign not found. Please check the campaign ID',
  ALREADY_CLAIMED: 'This campaign has already been claimed',
  NOT_CREATOR: 'Only the campaign creator can perform this action',
  DEADLINE_PASSED: 'The deadline for this campaign has passed',
  GOAL_NOT_MET: 'Campaign goal was not met. Refunds are available.',
  NETWORK_ERROR: 'Network error. Please check your connection and try again',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again or contact support'
};

/**
 * Create user-friendly error notification
 */
export function createErrorNotification(error) {
  const parsedError = error instanceof StellarPledgeError ? error : parseError(error);

  return {
    title: getErrorTitle(parsedError.category),
    message: parsedError.userMessage,
    severity: parsedError.severity,
    recovery: parsedError.recovery,
    timestamp: parsedError.timestamp,
    icon: getErrorIcon(parsedError.severity),
    duration: getErrorDuration(parsedError.severity),
    actions: getErrorActions(parsedError.recovery)
  };
}

function getErrorTitle(category) {
  const titles = {
    [ErrorCategory.NETWORK]: 'Network Issue',
    [ErrorCategory.WALLET]: 'Wallet Issue',
    [ErrorCategory.CONTRACT]: 'Smart Contract Issue',
    [ErrorCategory.USER_INPUT]: 'Input Error',
    [ErrorCategory.BLOCKCHAIN]: 'Blockchain Issue',
    [ErrorCategory.UNKNOWN]: 'Error'
  };
  return titles[category] || 'Error';
}

function getErrorIcon(severity) {
  const icons = {
    [ErrorSeverity.INFO]: 'ℹ️',
    [ErrorSeverity.WARNING]: '⚠️',
    [ErrorSeverity.ERROR]: '❌',
    [ErrorSeverity.CRITICAL]: '🔴'
  };
  return icons[severity] || '❌';
}

function getErrorDuration(severity) {
  const durations = {
    [ErrorSeverity.INFO]: 3000,
    [ErrorSeverity.WARNING]: 5000,
    [ErrorSeverity.ERROR]: 7000,
    [ErrorSeverity.CRITICAL]: 0 // Don't auto-dismiss critical errors
  };
  return durations[severity] || 5000;
}

function getErrorActions(recovery) {
  if (!recovery) return [];

  const actions = [];

  if (recovery.action === 'retry' || recovery.showRetry) {
    actions.push({ label: 'Retry', action: 'retry', primary: true });
  }

  if (recovery.showSupportLink) {
    actions.push({ label: 'Contact Support', action: 'support', link: '/support' });
  }

  if (recovery.showExplorerLink) {
    actions.push({ label: 'View on Explorer', action: 'explorer', external: true });
  }

  if (recovery.showFundingLink) {
    actions.push({ label: 'Get Testnet XLM', action: 'fund', external: true });
  }

  if (recovery.redirectTo) {
    actions.push({ label: 'Browse Campaigns', action: 'redirect', link: recovery.redirectTo });
  }

  return actions;
}

export default {
  parseError,
  logError,
  retryOperation,
  validatePledgeAmount,
  validateCampaignData,
  checkNetworkHealth,
  checkFreighterInstalled,
  checkNetworkType,
  createErrorNotification,
  ErrorCategory,
  ErrorSeverity,
  StellarPledgeError,
  ERROR_MESSAGES
};
