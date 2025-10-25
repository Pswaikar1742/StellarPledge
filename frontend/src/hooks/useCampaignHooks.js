/**
 * Custom React Hooks for StellarPledge
 * Easy-to-use hooks for UI components
 * Inspired by CratePass's useContext pattern
 */

import { useState, useEffect } from "react";
import { useWallet } from "../context/WalletContext";
import { useCampaign } from "../context/CampaignContext";

/**
 * Hook for creating campaigns
 * Usage in UI: const { create, isCreating, error } = useCreateCampaign();
 */
export const useCreateCampaign = () => {
  const { handleCreateCampaign } = useCampaign();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);

  const create = async (goal, deadlineHours, perk = null) => {
    setIsCreating(true);
    setError(null);
    try {
      const campaignId = await handleCreateCampaign(goal, deadlineHours, perk);
      setIsCreating(false);
      return campaignId;
    } catch (err) {
      setError(err.message);
      setIsCreating(false);
      throw err;
    }
  };

  return { create, isCreating, error };
};

/**
 * Hook for making pledges
 * Usage in UI: const { makePledge, isPledging, error } = usePledge();
 */
export const usePledge = () => {
  const { handlePledge } = useCampaign();
  const [isPledging, setIsPledging] = useState(false);
  const [error, setError] = useState(null);

  const makePledge = async (campaignId, amount) => {
    setIsPledging(true);
    setError(null);
    try {
      await handlePledge(campaignId, amount);
      setIsPledging(false);
      return true;
    } catch (err) {
      setError(err.message);
      setIsPledging(false);
      throw err;
    }
  };

  return { makePledge, isPledging, error };
};

/**
 * Hook for claiming funds
 * Usage in UI: const { claim, isClaiming, error } = useClaimFunds();
 */
export const useClaimFunds = () => {
  const { handleClaimFunds } = useCampaign();
  const [isClaiming, setIsClaiming] = useState(false);
  const [error, setError] = useState(null);

  const claim = async (campaignId) => {
    setIsClaiming(true);
    setError(null);
    try {
      await handleClaimFunds(campaignId);
      setIsClaiming(false);
      return true;
    } catch (err) {
      setError(err.message);
      setIsClaiming(false);
      throw err;
    }
  };

  return { claim, isClaiming, error };
};

/**
 * Hook for campaign list with auto-refresh
 * Usage in UI: const { campaigns, loading, refresh } = useCampaignList();
 */
export const useCampaignList = (autoLoad = true) => {
  const { campaigns, loadAllCampaigns, isLoading } = useCampaign();
  const { publicKey } = useWallet();

  useEffect(() => {
    if (autoLoad && publicKey) {
      loadAllCampaigns();
    }
  }, [autoLoad, publicKey, loadAllCampaigns]);

  return {
    campaigns,
    loading: isLoading,
    refresh: loadAllCampaigns,
  };
};

/**
 * Hook for single campaign with auto-load
 * Usage in UI: const { campaign, loading, refresh } = useCampaignDetail(campaignId);
 */
export const useCampaignDetail = (campaignId) => {
  const { currentCampaign, loadCampaign, isLoading } = useCampaign();

  useEffect(() => {
    if (campaignId !== null && campaignId !== undefined) {
      loadCampaign(campaignId);
    }
  }, [campaignId, loadCampaign]);

  return {
    campaign: currentCampaign,
    loading: isLoading,
    refresh: () => loadCampaign(campaignId),
  };
};

/**
 * Hook for checking if user is campaign creator
 * Usage in UI: const isCreator = useIsCreator(campaign);
 */
export const useIsCreator = (campaign) => {
  const { publicKey } = useWallet();
  
  if (!campaign || !publicKey) return false;
  return campaign.creator === publicKey;
};

/**
 * Hook for checking if campaign qualifies for perk
 * Usage in UI: const { qualifies, perkInfo } = usePerkCheck(campaign, pledgeAmount);
 */
export const usePerkCheck = (campaign, pledgeAmount) => {
  if (!campaign || !campaign.perk) {
    return { qualifies: false, perkInfo: null };
  }

  const qualifies = pledgeAmount >= campaign.perk.threshold;

  return {
    qualifies,
    perkInfo: {
      threshold: campaign.perk.threshold,
      amount: campaign.perk.amount,
      assetAddress: campaign.perk.asset_address,
    },
  };
};

/**
 * Hook for campaign progress calculation
 * Usage in UI: const { percentage, remaining, isSuccessful } = useCampaignProgress(campaign);
 */
export const useCampaignProgress = (campaign) => {
  if (!campaign) {
    return { percentage: 0, remaining: 0, isSuccessful: false };
  }

  const percentage = Math.min((campaign.pledged / campaign.goal) * 100, 100);
  const remaining = Math.max(campaign.goal - campaign.pledged, 0);
  const isSuccessful = campaign.pledged >= campaign.goal;

  return {
    percentage: percentage.toFixed(2),
    remaining: remaining.toFixed(2),
    isSuccessful,
  };
};

/**
 * Hook for campaign deadline status
 * Usage in UI: const { isExpired, timeRemaining, formattedTime } = useCampaignDeadline(campaign);
 */
export const useCampaignDeadline = (campaign) => {
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    if (!campaign) return;

    const updateTime = () => {
      const now = Math.floor(Date.now() / 1000);
      const remaining = campaign.deadline - now;
      setTimeRemaining(Math.max(remaining, 0));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [campaign]);

  const isExpired = timeRemaining === 0;
  
  const formatTime = (seconds) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return {
    isExpired,
    timeRemaining,
    formattedTime: formatTime(timeRemaining),
  };
};

/**
 * Hook for user's created campaigns
 * Usage in UI: const { myCampaigns, loading } = useMyCampaigns();
 */
export const useMyCampaigns = () => {
  const { getUserCreatedCampaigns, isLoading } = useCampaign();
  const { publicKey } = useWallet();

  return {
    myCampaigns: publicKey ? getUserCreatedCampaigns() : [],
    loading: isLoading,
  };
};

/**
 * Hook for user's backed campaigns
 * Usage in UI: const { backedCampaigns, loading } = useMyPledges();
 */
export const useMyPledges = () => {
  const { getUserBackedCampaigns, isLoading } = useCampaign();
  const { publicKey } = useWallet();

  return {
    backedCampaigns: publicKey ? getUserBackedCampaigns() : [],
    loading: isLoading,
  };
};

export default {
  useCreateCampaign,
  usePledge,
  useClaimFunds,
  useCampaignList,
  useCampaignDetail,
  useIsCreator,
  usePerkCheck,
  useCampaignProgress,
  useCampaignDeadline,
  useMyCampaigns,
  useMyPledges,
};
