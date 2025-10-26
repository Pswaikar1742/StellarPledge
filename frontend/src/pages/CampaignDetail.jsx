import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Gift } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useWallet } from '../context/WalletContext';
import { useToast } from '../components/ui/use-toast';
import { deductBalance } from '../utils/mockWalletBalance';

const CampaignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isConnected, balance, publicKey } = useWallet();
  const { toast } = useToast();
  const [campaign, setCampaign] = useState(null);
  const [pledgeAmount, setPledgeAmount] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Load user
    const user = JSON.parse(localStorage.getItem('stellarpledge_current_user'));
    setCurrentUser(user);

    // Load campaign from localStorage
    const campaigns = JSON.parse(localStorage.getItem('stellarpledge_campaigns') || '[]');
    const foundCampaign = campaigns.find(c => c.id === parseInt(id));
    
    if (foundCampaign) {
      setCampaign(foundCampaign);
    } else {
      navigate('/');
    }
  }, [id, navigate]);

  const handlePledge = () => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to make a pledge",
        variant: "destructive"
      });
      return;
    }

    if (!currentUser) {
      toast({
        title: "Not Logged In",
        description: "Please log in to make a pledge",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    const amount = parseFloat(pledgeAmount);
    
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid pledge amount",
        variant: "destructive"
      });
      return;
    }

    // Check balance using mock wallet balance
    const currentBalance = parseFloat(balance) || 0;
    if (amount > currentBalance) {
      toast({
        title: "Insufficient Balance",
        description: `You only have ${currentBalance} XLM`,
        variant: "destructive"
      });
      return;
    }

    try {
      // Deduct balance from wallet
      deductBalance(publicKey, amount);

      // Update campaign with new pledge
      const campaigns = JSON.parse(localStorage.getItem('stellarpledge_campaigns') || '[]');
      const campaignIndex = campaigns.findIndex(c => c.id === campaign.id);
      
      if (campaignIndex !== -1) {
        // Add pledge
        const newPledge = {
          id: Date.now(),
          funderId: currentUser.id,
          funderName: currentUser.name,
          funderPublicKey: publicKey,
          amount: amount,
          timestamp: new Date().toISOString(),
          earnedReward: amount >= campaign.rewardTier.minAmount
        };

        campaigns[campaignIndex].pledges = campaigns[campaignIndex].pledges || [];
        campaigns[campaignIndex].pledges.push(newPledge);
        campaigns[campaignIndex].pledged += amount;
        campaigns[campaignIndex].backers = campaigns[campaignIndex].pledges.length;

        // Check if goal is met
        if (campaigns[campaignIndex].pledged >= campaigns[campaignIndex].goal) {
          campaigns[campaignIndex].status = 'pending_approval';
        }

        localStorage.setItem('stellarpledge_campaigns', JSON.stringify(campaigns));
        
        // Dispatch event to update dashboards
        window.dispatchEvent(new Event('pledge-update'));
        
        // Update local state
        setCampaign(campaigns[campaignIndex]);
        setPledgeAmount('');

        // Show success message
        const earnedReward = amount >= campaign.rewardTier.minAmount;
        toast({
          title: "Pledge Successful! 🎉",
          description: earnedReward 
            ? `You pledged ${amount} XLM and earned 1 ${campaign.rewardTier.tokenCode} token!`
            : `You pledged ${amount} XLM. Thank you for your support!`
        });
      }
    } catch (error) {
      toast({
        title: "Pledge Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (!campaign) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const progress = (campaign.pledged / campaign.goal) * 100;
  const willEarnReward = parseFloat(pledgeAmount) >= campaign.rewardTier.minAmount;

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Campaigns
        </Button>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl font-bold text-foreground mb-4">
                {campaign.title}
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {campaign.description}
              </p>
            </motion.div>

            {/* Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-2xl p-6 border border-border"
            >
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Campaign Progress</span>
                <span className="text-accent font-semibold">
                  {progress.toFixed(1)}%
                </span>
              </div>
              <div className="h-4 bg-secondary rounded-full overflow-hidden mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-accent"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-3xl font-bold text-foreground">
                    {campaign.pledged.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    of {campaign.goal.toLocaleString()} XLM
                  </p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">
                    {campaign.backers}
                  </p>
                  <p className="text-sm text-muted-foreground">Backers</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">
                    {campaign.daysLeft}
                  </p>
                  <p className="text-sm text-muted-foreground">Days Left</p>
                </div>
              </div>
            </motion.div>

            {/* Reward Tier */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-accent/10 border-2 border-accent rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Gift className="w-8 h-8 text-accent" />
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    ✨ Special Reward Available!
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Exclusive token for top backers
                  </p>
                </div>
              </div>
              <p className="text-foreground">
                Pledge <strong className="text-accent">{campaign.rewardTier.minAmount} XLM</strong> or more 
                to receive <strong className="text-accent">1 {campaign.rewardTier.tokenCode}</strong> token 
                ({campaign.rewardTier.tokenName})
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                This on-chain collectible is delivered to your wallet instantly upon pledging.
              </p>
            </motion.div>
          </div>

          {/* Pledge Card */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card rounded-2xl p-6 border border-border sticky top-24"
            >
              <h3 className="text-xl font-bold text-foreground mb-4">
                Back This Campaign
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pledge">Pledge Amount (XLM)</Label>
                  <Input
                    id="pledge"
                    type="number"
                    placeholder="Enter amount"
                    value={pledgeAmount}
                    onChange={(e) => setPledgeAmount(e.target.value)}
                    disabled={!isConnected}
                  />
                  {isConnected && balance && (
                    <p className="text-xs text-muted-foreground">
                      Your balance: {balance} XLM
                    </p>
                  )}
                </div>

                {willEarnReward && pledgeAmount && (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-accent/20 border border-accent rounded-lg p-3"
                  >
                    <p className="text-sm text-accent font-semibold flex items-center gap-2">
                      <Gift className="w-4 h-4" />
                      You'll earn the reward token!
                    </p>
                  </motion.div>
                )}

                <Button
                  onClick={handlePledge}
                  disabled={!isConnected || !pledgeAmount}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-bold"
                >
                  {!isConnected ? 'Connect Wallet First' : 'Pledge Now'}
                </Button>

                {!isConnected && (
                  <p className="text-xs text-center text-muted-foreground">
                    Connect your wallet to make a pledge
                  </p>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <h4 className="font-semibold text-foreground mb-3">Campaign Creator</h4>
                <p className="text-sm text-muted-foreground">
                  {campaign.creatorName}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetail;
