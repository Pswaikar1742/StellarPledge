/**
 * Soroban Smart Contract Interaction Layer
 * Centralized module for all blockchain operations
 */

import {
  Contract,
  SorobanRpc,
  TransactionBuilder,
  Networks,
  BASE_FEE,
  nativeToScVal,
  Address,
  scValToNative,
  xdr,
} from "@stellar/stellar-sdk";
import WalletService from "../../services/WalletService";
import { CONTRACT_ADDRESS, NETWORK_CONFIG, TX_TIMEOUT, TX_POLL_INTERVAL } from "../../constants/constants";

// Initialize Soroban RPC provider
const provider = new SorobanRpc.Server(NETWORK_CONFIG.RPC_URL, { allowHttp: true });

/**
 * Type Converters - Convert JavaScript values to Soroban ScVal format
 */

// Convert Address string to ScVal
export const addressToScVal = (address) => new Address(address).toScVal();

// Convert string to ScVal
export const stringToScVal = (value) => nativeToScVal(value, { type: "string" });

// Convert number to u64 ScVal
export const numberToU64 = (value) => nativeToScVal(value, { type: "u64" });

// Convert number to u128 ScVal
export const numberToU128 = (value) => nativeToScVal(value, { type: "u128" });

// Convert number to i128 ScVal
export const numberToI128 = (value) => nativeToScVal(value, { type: "i128" });

// Create Option<Address> ScVal
export const optionAddressToScVal = (address) => {
  if (address) {
    // Some variant with Address
    return xdr.ScVal.scvOption(new Address(address).toScVal());
  } else {
    // None variant
    return xdr.ScVal.scvOption(undefined);
  }
};

/**
 * Core Contract Interaction Helper
 * Handles transaction building, simulation, signing, and submission
 * 
 * @param {string} caller - Public key of transaction signer
 * @param {string} functionName - Smart contract function to call
 * @param {Array|null} params - Function parameters as ScVal array
 * @returns {Promise<any>} Function return value
 */
export async function contractInt(caller, functionName, params = null) {
  try {
    // Step 1: Get account from blockchain
    const sourceAccount = await provider.getAccount(caller);
    
    // Step 2: Build contract operation
    const contract = new Contract(CONTRACT_ADDRESS);
    const operation = params && params.length > 0
      ? contract.call(functionName, ...params)
      : contract.call(functionName);

    // Step 3: Build transaction
    let transaction = new TransactionBuilder(sourceAccount, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(operation)
      .setTimeout(TX_TIMEOUT)
      .build();

    // Step 4: Simulate transaction (prepare)
    console.log(`📡 Simulating ${functionName}...`);
    let preparedTransaction = await provider.prepareTransaction(transaction);

    // Step 5: Sign transaction with standalone wallet
    console.log(`✍️  Signing ${functionName}...`);
    let signedTransaction = await WalletService.signTransaction(preparedTransaction);

    // Step 6: Submit transaction
    console.log(`🚀 Submitting ${functionName}...`);
    let sendResponse = await provider.sendTransaction(signedTransaction);

    if (sendResponse.errorResult) {
      throw new Error(`Transaction failed: ${JSON.stringify(sendResponse.errorResult)}`);
    }

    // Step 7: Poll for transaction result
    if (sendResponse.status === "PENDING") {
      console.log(`⏳ Waiting for ${functionName} confirmation...`);
      let txResponse = await provider.getTransaction(sendResponse.hash);

      // Keep polling until transaction is found
      while (txResponse.status === "NOT_FOUND") {
        await new Promise((resolve) => setTimeout(resolve, TX_POLL_INTERVAL));
        txResponse = await provider.getTransaction(sendResponse.hash);
      }

      // Check final status
      if (txResponse.status === "SUCCESS") {
        console.log(`✅ ${functionName} successful!`);
        
        // Return value if available
        if (txResponse.returnValue) {
          return txResponse.returnValue;
        }
        return true;
      } else {
        throw new Error(`Transaction failed with status: ${txResponse.status}`);
      }
    }

    return true;
  } catch (error) {
    console.error(`❌ ${functionName} failed:`, error);
    throw error;
  }
}

/**
 * Campaign Management Functions
 */

/**
 * Create a new crowdfunding campaign
 * @param {string} creator - Creator's public key
 * @param {number} goal - Funding goal in XLM
 * @param {number} deadlineHours - Hours until deadline
 * @param {Object} perk - Optional perk configuration
 * @returns {Promise<number>} Campaign ID
 */
export async function createCampaign(creator, goal, deadlineHours, perk = null) {
  try {
    const deadline = Math.floor(Date.now() / 1000) + (deadlineHours * 3600);
    const goalStroops = Math.floor(goal * 10000000);

    let params = [
      addressToScVal(creator),
      numberToU128(goalStroops),
      numberToU64(deadline),
    ];

    // Add perk parameters
    if (perk && perk.threshold > 0) {
      params.push(numberToU128(Math.floor(perk.threshold * 10000000))); // threshold in stroops
      // For Option<Address>, use proper Option variant
      params.push(optionAddressToScVal(perk.assetAddress));
      params.push(numberToI128(perk.amount || 1000000)); // perk token amount (default 1 token with 6 decimals)
    } else {
      params.push(numberToU128(0)); // No perk threshold
      // For Option<Address>, explicitly pass None variant
      params.push(optionAddressToScVal(null));
      params.push(numberToI128(0)); // No amount
    }

    const result = await contractInt(creator, "create_campaign", params);
    
    // Parse campaign ID from result
    const campaignId = Number(scValToNative(result));
    console.log(`✅ Campaign ${campaignId} created!`);
    
    return campaignId;
  } catch (error) {
    console.error("Create campaign error:", error);
    throw new Error("Failed to create campaign: " + error.message);
  }
}

/**
 * Make a pledge to a campaign
 * @param {string} backer - Backer's public key
 * @param {number} campaignId - Campaign ID
 * @param {number} amount - Pledge amount in XLM
 * @param {string} tokenAddress - XLM token address
 * @returns {Promise<boolean>} Success status
 */
export async function pledge(backer, campaignId, amount, tokenAddress) {
  try {
    const amountStroops = Math.floor(amount * 10000000);

    const params = [
      addressToScVal(backer),
      numberToU64(campaignId),
      numberToU128(amountStroops),
      addressToScVal(tokenAddress),
    ];

    await contractInt(backer, "pledge", params);
    console.log(`✅ Pledged ${amount} XLM to campaign ${campaignId}`);
    
    return true;
  } catch (error) {
    console.error("Pledge error:", error);
    throw new Error("Failed to pledge: " + error.message);
  }
}

/**
 * Claim funds from successful campaign
 * @param {string} creator - Creator's public key
 * @param {number} campaignId - Campaign ID
 * @param {string} tokenAddress - XLM token address
 * @returns {Promise<boolean>} Success status
 */
export async function claimFunds(creator, campaignId, tokenAddress) {
  try {
    const params = [
      addressToScVal(creator),
      numberToU64(campaignId),
      addressToScVal(tokenAddress),
    ];

    await contractInt(creator, "claim_funds", params);
    console.log(`✅ Funds claimed from campaign ${campaignId}`);
    
    return true;
  } catch (error) {
    console.error("Claim funds error:", error);
    throw new Error("Failed to claim funds: " + error.message);
  }
}

/**
 * Withdraw refund from failed campaign
 * @param {string} backer - Backer's public key
 * @param {number} campaignId - Campaign ID
 * @param {string} tokenAddress - XLM token address
 * @returns {Promise<boolean>} Success status
 */
export async function withdrawRefund(backer, campaignId, tokenAddress) {
  try {
    const params = [
      addressToScVal(backer),
      numberToU64(campaignId),
      addressToScVal(tokenAddress),
    ];

    await contractInt(backer, "withdraw_refund", params);
    console.log(`✅ Refund withdrawn from campaign ${campaignId}`);
    
    return true;
  } catch (error) {
    console.error("Withdraw refund error:", error);
    throw new Error("Failed to withdraw refund: " + error.message);
  }
}

/**
 * Get campaign details
 * @param {string} caller - Any public key
 * @param {number} campaignId - Campaign ID
 * @returns {Promise<Object>} Campaign data
 */
export async function getCampaign(caller, campaignId) {
  try {
    const params = [numberToU64(campaignId)];
    
    const result = await contractInt(caller, "get_campaign", params);
    const campaign = scValToNative(result);
    
    return {
      id: campaignId,
      creator: campaign.creator,
      goal: Number(campaign.goal) / 10000000, // Convert stroops to XLM
      pledged: Number(campaign.pledged) / 10000000,
      deadline: Number(campaign.deadline),
      state: campaign.state,
      backers: campaign.backers || [],
      perk: campaign.perk || null,
    };
  } catch (error) {
    console.error("Get campaign error:", error);
    return null;
  }
}

export default {
  createCampaign,
  pledge,
  claimFunds,
  withdrawRefund,
  getCampaign,
  contractInt,
};
