import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Heart, TrendingUp, Award, Wallet as WalletIcon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import CampaignCard from '../components/CampaignCard';
import { useWallet } from '../context/WalletContext';
import { useCampaign } from '../context/CampaignContext';

const FunderDashboard = () => {
  const navigate = useNavigate();
  const { isConnected, publicKey } = useWallet();
  const { loadAllCampaigns, campaigns, getUserBackedCampaigns, isLoading } = useCampaign();
  const [currentUser, setCurrentUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [myPledges, setMyPledges] = useState([]);
  const [displayCampaigns, setDisplayCampaigns] = useState([]);
  const [backedCampaigns, setBackedCampaigns] = useState([]);

  useEffect(() => {
    const loadUserData = async () => {
      const user = JSON.parse(localStorage.getItem('stellarpledge_current_user'));
      if (!user) {
        navigate('/login');
        return;
      }
      
      // Check if user is a funder
      if (user.role !== 'funder') {
        navigate('/creator-dashboard');
        return;
      }
      
      setCurrentUser(user);

      // Load campaigns from blockchain
      if (publicKey) {
        await loadAllCampaigns();
      }
    };

    loadUserData();
  }, [navigate, publicKey, loadAllCampaigns]);

  useEffect(() => {
    // Get user's backed campaigns from blockchain
    if (campaigns && campaigns.length > 0 && publicKey) {
      const backed = getUserBackedCampaigns();
      
      // Transform for display
      const transformedBacked = backed.map(campaign => {
        const uiData = JSON.parse(localStorage.getItem(`campaign_ui_${campaign.id}`) || '{}');
        const now = Math.floor(Date.now() / 1000);
        const daysLeft = Math.floor((campaign.deadline - now) / 86400);
        const backers = Object.keys(campaign.backers || {}).length;
        
        // Get pledge amount for this user
        const userPledgeAmount = campaign.backers[publicKey] 
          ? Number(campaign.backers[publicKey]) / 10000000 
          : 0;
        
        const hasReward = campaign.perk && userPledgeAmount >= (Number(campaign.perk.threshold) / 10000000);
        
        return {
          id: campaign.id,
          campaignId: campaign.id,
          campaignTitle: uiData.title || `Campaign ${campaign.id}`,
          amount: userPledgeAmount,
          hasReward,
          tokenCode: uiData.perkTokenCode || 'REWARD'
        };
      });
      
      setBackedCampaigns(backed);
      setMyPledges(transformedBacked);

      // Transform all campaigns for display
      const transformed = campaigns
        .filter(c => c.status === 0) // Only active campaigns (status 0)
        .map(campaign => {
          const uiData = JSON.parse(localStorage.getItem(`campaign_ui_${campaign.id}`) || '{}');
          const now = Math.floor(Date.now() / 1000);
          const daysLeft = Math.floor((campaign.deadline - now) / 86400);
          const backers = Object.keys(campaign.backers || {}).length;
          
          return {
            id: campaign.id,
            title: uiData.title || `Campaign ${campaign.id}`,
            description: uiData.description || 'No description available',
            pledged: Number(campaign.pledged) / 10000000,
            goal: Number(campaign.goal) / 10000000,
            backers,
            daysLeft: Math.max(0, daysLeft),
            status: 'active'
          };
        });
      
      setDisplayCampaigns(transformed);
    }
  }, [campaigns, publicKey, getUserBackedCampaigns]);

  const handleConnectWallet = () => {
    // Trigger wallet connection modal from header
    const connectButton = document.getElementById('connect-wallet-button');
    if (connectButton) {
      connectButton.click();
    }
  };

  const filteredCampaigns = displayCampaigns.filter(campaign =>
    campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campaign.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    {
      label: "Campaigns Backed",
      value: myPledges.length,
      icon: Heart,
      color: "text-accent"
    },
    {
      label: "Total Pledged",
      value: `${myPledges.reduce((sum, p) => sum + p.amount, 0)} XLM`,
      icon: TrendingUp,
      color: "text-accent"
    },
    {
      label: "Rewards Earned",
      value: myPledges.filter(p => p.hasReward).length,
      icon: Award,
      color: "text-yellow-500"
    }
  ];

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Discover & Fund Projects
          </h1>
          <p className="text-muted-foreground text-lg">
            Welcome back, {currentUser.name}! Support innovative projects and earn exclusive rewards.
          </p>
        </motion.div>

        {/* Wallet Connection Alert */}
        {!isConnected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 bg-accent/10 border-2 border-accent rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <WalletIcon className="w-12 h-12 text-accent" />
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-1">
                    Connect Your Wallet
                  </h3>
                  <p className="text-muted-foreground">
                    You need to connect your Stellar wallet to fund campaigns and earn rewards
                  </p>
                </div>
              </div>
              <Button
                onClick={handleConnectWallet}
                className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold"
              >
                <WalletIcon className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            </div>
          </motion.div>
        )}

        {/* Stats Grid */}
        {myPledges.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <p className="text-3xl font-bold text-foreground mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg"
            />
          </div>
        </motion.div>

        {/* Active Campaigns Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Active Campaigns ({filteredCampaigns.length})
          </h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading campaigns from blockchain...</p>
              </div>
            </div>
          ) : filteredCampaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCampaigns.map((campaign, index) => (
                <CampaignCard key={campaign.id} campaign={campaign} index={index} />
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-2xl p-12 border border-border text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                No Campaigns Found
              </h3>
              <p className="text-muted-foreground">
                {searchQuery ? 'Try adjusting your search query' : 'No active campaigns available yet'}
              </p>
            </div>
          )}
        </motion.div>

        {/* My Pledges Section */}
        {myPledges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">
              My Backed Campaigns
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {myPledges.map((pledge, index) => (
                <motion.div
                  key={pledge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-2xl p-6 border border-border shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {pledge.campaignTitle}
                      </h3>
                      <p className="text-muted-foreground">
                        Pledged: {pledge.amount} XLM
                      </p>
                    </div>
                    {pledge.hasReward && (
                      <div className="bg-accent/20 text-accent px-4 py-2 rounded-lg font-semibold">
                        🎁 Reward Earned
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FunderDashboard;
