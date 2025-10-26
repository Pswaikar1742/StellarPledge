/**
 * Campaign Context Provider
 * Global state management for campaigns data
 * Inspired by CratePass's context pattern
 */

import React, { createContext, useState, useContext, useCallback } from "react";
import { getCampaign, createCampaign, pledge, claimFunds, withdrawRefund } from "../components/Soroban/Soroban";
import { useWallet } from "./WalletContext";
import { NATIVE_XLM_ADDRESS } from "../constants/constants";

const CampaignContext = createContext();

export const useCampaign = () => {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error("useCampaign must be used within CampaignProvider");
  }
  return context;
};

export const CampaignProvider = ({ children }) => {
  const { publicKey } = useWallet();
  const [campaigns, setCampaigns] = useState([]);
  const [currentCampaign, setCurrentCampaign] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Load a single campaign by ID (MOCK MODE - from localStorage)
   */
  const loadCampaign = useCallback(async (campaignId) => {
    setIsLoading(true);
    setError(null);

    try {
      const storedCampaigns = JSON.parse(localStorage.getItem("stellarpledge_campaigns") || "[]");
      const campaign = storedCampaigns.find(c => c.id === campaignId);
      
      if (campaign) {
        setCurrentCampaign(campaign);
        console.log("✅ Campaign loaded (MOCK):", campaign);
        return campaign;
      }
      return null;
    } catch (err) {
      console.error("Load campaign error:", err);
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Load all campaigns (MOCK MODE - from localStorage)
   */
  const loadAllCampaigns = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Load from localStorage instead of blockchain
      const storedCampaigns = JSON.parse(localStorage.getItem("stellarpledge_campaigns") || "[]");
      
      // Check deadlines and update status
      const now = Date.now();
      storedCampaigns.forEach(campaign => {
        if (campaign.status === 'active' && now > campaign.deadline) {
          if (campaign.pledged >= campaign.goal) {
            campaign.status = 'pending_approval';
          } else {
            campaign.status = 'failed';
          }
        }
      });
      
      localStorage.setItem("stellarpledge_campaigns", JSON.stringify(storedCampaigns));
      
      setCampaigns(storedCampaigns);
      console.log(`✅ Loaded ${storedCampaigns.length} campaigns (MOCK)`);
      return storedCampaigns;
    } catch (err) {
      console.error("Load all campaigns error:", err);
      setError(err.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Create a new campaign (MOCK MODE - Frontend only)
   * Blockchain call happens only on "Complete Campaign"
   */
  const handleCreateCampaign = useCallback(async (goal, deadlineHours, perk = null, campaignData = {}) => {
    if (!publicKey) {
      throw new Error("Wallet not connected");
    }

    setIsLoading(true);
    setError(null);

    try {
      // ✅ MOCK MODE: Create campaign in localStorage (no blockchain call)
      const storedCampaigns = JSON.parse(localStorage.getItem("stellarpledge_campaigns") || "[]");
      const campaignId = storedCampaigns.length; // Simple ID generation
      
      const deadline = Date.now() + (deadlineHours * 60 * 60 * 1000);
      
      const newCampaign = {
        id: campaignId,
        creator: publicKey,
        title: campaignData.title || `Campaign ${campaignId}`,
        description: campaignData.description || '',
        goal: parseFloat(goal),
        pledged: 0,
        backers: 0,
        deadline: deadline,
        status: 'active',
        rewardTier: perk ? {
          minAmount: perk.threshold,
          tokenName: campaignData.tokenName || 'TOKEN',
          tokenCode: campaignData.tokenCode || 'TKN',
          tokenSupply: campaignData.tokenSupply || 0
        } : null,
        perkConfig: perk,
        pledgesList: [],
        createdAt: Date.now(),
        onBlockchain: false // Flag to track if deployed to blockchain
      };
      
      storedCampaigns.push(newCampaign);
      localStorage.setItem("stellarpledge_campaigns", JSON.stringify(storedCampaigns));

      console.log("✅ Campaign created (MOCK):", campaignId);
      
      return campaignId;
    } catch (err) {
      console.error("Create campaign error:", err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [publicKey]);

  /**
   * Make a pledge to a campaign (MOCK MODE - Frontend only)
   */
  const handlePledge = useCallback(async (campaignId, amount) => {
    if (!publicKey) {
      throw new Error("Wallet not connected");
    }

    setIsLoading(true);
    setError(null);

    try {
      // ✅ MOCK MODE: Update campaign in localStorage
      const storedCampaigns = JSON.parse(localStorage.getItem("stellarpledge_campaigns") || "[]");
      const campaign = storedCampaigns.find(c => c.id === campaignId);
      
      if (!campaign) {
        throw new Error("Campaign not found");
      }
      
      // Update campaign
      campaign.pledged = (campaign.pledged || 0) + parseFloat(amount);
      campaign.backers = (campaign.backers || 0) + 1;
      
      // Add to pledges list
      if (!campaign.pledgesList) campaign.pledgesList = [];
      campaign.pledgesList.push({
        backer: publicKey,
        amount: parseFloat(amount),
        timestamp: Date.now()
      });
      
      // Update status if goal reached
      if (campaign.pledged >= campaign.goal) {
        campaign.status = 'pending_approval'; // Waiting for creator to complete
      }
      
      // Save back
      storedCampaigns[campaignId] = campaign;
      localStorage.setItem("stellarpledge_campaigns", JSON.stringify(storedCampaigns));

      // Store pledge in user's pledge history
      const storedPledges = JSON.parse(localStorage.getItem(`stellarpledge_pledges_${publicKey}`) || "[]");
      storedPledges.push({ campaignId, amount, timestamp: Date.now() });
      localStorage.setItem(`stellarpledge_pledges_${publicKey}`, JSON.stringify(storedPledges));

      console.log("✅ Pledge successful (MOCK):", campaignId, amount);
      
      return true;
    } catch (err) {
      console.error("Pledge error:", err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [publicKey]);

  /**
   * Complete Campaign - Deploy to blockchain and claim funds
   * THIS is where the blockchain transaction happens!
   */
  const handleCompleteCampaign = useCallback(async (campaignId) => {
    if (!publicKey) {
      throw new Error("Wallet not connected");
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get campaign from localStorage
      const storedCampaigns = JSON.parse(localStorage.getItem("stellarpledge_campaigns") || "[]");
      const campaign = storedCampaigns.find(c => c.id === campaignId);
      
      if (!campaign) {
        throw new Error("Campaign not found");
      }
      
      if (campaign.status !== 'pending_approval') {
        throw new Error("Campaign must reach its goal first");
      }
      
      // 🚀 NOW deploy to blockchain
      console.log("🚀 Deploying campaign to Stellar blockchain...");
      
      const deadlineHours = Math.max(1, Math.floor((campaign.deadline - Date.now()) / (1000 * 60 * 60)));
      const blockchainCampaignId = await createCampaign(
        publicKey,
        campaign.goal,
        deadlineHours,
        campaign.perkConfig
      );
      
      console.log(`✅ Campaign deployed to blockchain! ID: ${blockchainCampaignId}`);
      
      // Update campaign status
      campaign.status = 'successful';
      campaign.onBlockchain = true;
      campaign.blockchainId = blockchainCampaignId;
      
      storedCampaigns[campaignId] = campaign;
      localStorage.setItem("stellarpledge_campaigns", JSON.stringify(storedCampaigns));
      
      return blockchainCampaignId;
    } catch (err) {
      console.error("Complete campaign error:", err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [publicKey]);

  /**
   * Claim funds from successful campaign (MOCK MODE)
   */
  const handleClaimFunds = useCallback(async (campaignId) => {
    if (!publicKey) {
      throw new Error("Wallet not connected");
    }

    setIsLoading(true);
    setError(null);

    try {
      // For now, just update status in localStorage
      // In production, this would call claimFunds(publicKey, campaignId, NATIVE_XLM_ADDRESS)
      const storedCampaigns = JSON.parse(localStorage.getItem("stellarpledge_campaigns") || "[]");
      const campaign = storedCampaigns.find(c => c.id === campaignId);
      
      if (campaign) {
        campaign.status = 'successful';
        storedCampaigns[campaignId] = campaign;
        localStorage.setItem("stellarpledge_campaigns", JSON.stringify(storedCampaigns));
      }
      
      console.log("✅ Funds claimed (MOCK):", campaignId);
      
      return true;
    } catch (err) {
      console.error("Claim funds error:", err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [publicKey]);

  /**
   * Withdraw refund from failed campaign
   */
  const handleWithdrawRefund = useCallback(async (campaignId) => {
    if (!publicKey) {
      throw new Error("Wallet not connected");
    }

    setIsLoading(true);
    setError(null);

    try {
      await withdrawRefund(publicKey, campaignId, NATIVE_XLM_ADDRESS);
      console.log("✅ Refund withdrawn:", campaignId);
      
      // Reload campaign to get updated state
      await loadCampaign(campaignId);
      
      return true;
    } catch (err) {
      console.error("Withdraw refund error:", err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, loadCampaign]);

  /**
   * Get user's created campaigns
   */
  const getUserCreatedCampaigns = useCallback(() => {
    return campaigns.filter(c => c.creator === publicKey);
  }, [campaigns, publicKey]);

  /**
   * Get campaigns user has backed
   */
  const getUserBackedCampaigns = useCallback(() => {
    const pledges = JSON.parse(localStorage.getItem(`stellarpledge_pledges_${publicKey}`) || "[]");
    const backedIds = pledges.map(p => p.campaignId);
    return campaigns.filter(c => backedIds.includes(c.id));
  }, [campaigns, publicKey]);

  const value = {
    campaigns,
    currentCampaign,
    isLoading,
    error,
    loadCampaign,
    loadAllCampaigns,
    handleCreateCampaign,
    handlePledge,
    handleClaimFunds,
    handleCompleteCampaign, // NEW: Deploy to blockchain
    handleWithdrawRefund,
    getUserCreatedCampaigns,
    getUserBackedCampaigns,
    setCurrentCampaign,
  };

  return <CampaignContext.Provider value={value}>{children}</CampaignContext.Provider>;
};

export default CampaignContext;
