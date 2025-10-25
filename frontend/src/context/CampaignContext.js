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
   * Load a single campaign by ID
   */
  const loadCampaign = useCallback(async (campaignId) => {
    if (!publicKey) {
      setError("Wallet not connected");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const campaign = await getCampaign(publicKey, campaignId);
      if (campaign) {
        setCurrentCampaign(campaign);
        console.log("✅ Campaign loaded:", campaign);
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
  }, [publicKey]);

  /**
   * Load all campaigns (iterate through IDs)
   * Similar to CratePass's fetchAllPassStatus pattern
   */
  const loadAllCampaigns = useCallback(async (maxCampaigns = 50) => {
    if (!publicKey) {
      setError("Wallet not connected");
      return [];
    }

    setIsLoading(true);
    setError(null);

    try {
      const loadedCampaigns = [];
      let notFoundCount = 0;
      const maxNotFound = 5; // Stop after 5 consecutive not found

      for (let i = 0; i < maxCampaigns && notFoundCount < maxNotFound; i++) {
        try {
          const campaign = await getCampaign(publicKey, i);
          if (campaign) {
            loadedCampaigns.push(campaign);
            notFoundCount = 0;
          } else {
            notFoundCount++;
          }
        } catch (err) {
          notFoundCount++;
        }
      }

      setCampaigns(loadedCampaigns);
      console.log(`✅ Loaded ${loadedCampaigns.length} campaigns`);
      return loadedCampaigns;
    } catch (err) {
      console.error("Load all campaigns error:", err);
      setError(err.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [publicKey]);

  /**
   * Create a new campaign
   * Matches CratePass's createPass pattern
   */
  const handleCreateCampaign = useCallback(async (goal, deadlineHours, perk = null) => {
    if (!publicKey) {
      throw new Error("Wallet not connected");
    }

    setIsLoading(true);
    setError(null);

    try {
      const campaignId = await createCampaign(publicKey, goal, deadlineHours, perk);
      
      // Store campaign ID in localStorage (like CratePass does)
      const storedCampaigns = JSON.parse(localStorage.getItem("stellarpledge_campaigns") || "[]");
      storedCampaigns.push(campaignId);
      localStorage.setItem("stellarpledge_campaigns", JSON.stringify(storedCampaigns));

      console.log("✅ Campaign created:", campaignId);
      
      // Reload campaigns list
      await loadAllCampaigns();
      
      return campaignId;
    } catch (err) {
      console.error("Create campaign error:", err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, loadAllCampaigns]);

  /**
   * Make a pledge to a campaign
   * Matches CratePass's approvePass/expirePass pattern
   */
  const handlePledge = useCallback(async (campaignId, amount) => {
    if (!publicKey) {
      throw new Error("Wallet not connected");
    }

    setIsLoading(true);
    setError(null);

    try {
      await pledge(publicKey, campaignId, amount, NATIVE_XLM_ADDRESS);
      
      // Store pledge in localStorage
      const storedPledges = JSON.parse(localStorage.getItem(`stellarpledge_pledges_${publicKey}`) || "[]");
      storedPledges.push({ campaignId, amount, timestamp: Date.now() });
      localStorage.setItem(`stellarpledge_pledges_${publicKey}`, JSON.stringify(storedPledges));

      console.log("✅ Pledge successful:", campaignId, amount);
      
      // Reload campaign to get updated state
      await loadCampaign(campaignId);
      
      return true;
    } catch (err) {
      console.error("Pledge error:", err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, loadCampaign]);

  /**
   * Claim funds from successful campaign
   */
  const handleClaimFunds = useCallback(async (campaignId) => {
    if (!publicKey) {
      throw new Error("Wallet not connected");
    }

    setIsLoading(true);
    setError(null);

    try {
      await claimFunds(publicKey, campaignId, NATIVE_XLM_ADDRESS);
      console.log("✅ Funds claimed:", campaignId);
      
      // Reload campaign to get updated state
      await loadCampaign(campaignId);
      
      return true;
    } catch (err) {
      console.error("Claim funds error:", err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, loadCampaign]);

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
    handleWithdrawRefund,
    getUserCreatedCampaigns,
    getUserBackedCampaigns,
    setCurrentCampaign,
  };

  return <CampaignContext.Provider value={value}>{children}</CampaignContext.Provider>;
};

export default CampaignContext;
