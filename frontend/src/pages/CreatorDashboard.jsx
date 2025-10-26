import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, TrendingUp, Clock, CheckCircle, Wallet as WalletIcon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useWallet } from '../context/WalletContext';

const CreatorDashboard = () => {
  const navigate = useNavigate();
  const { isConnected } = useWallet();
  const [currentUser, setCurrentUser] = useState(null);
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    // Check if user is logged in
    const loadUserData = () => {
      const user = JSON.parse(localStorage.getItem('stellarpledge_current_user'));
      if (!user) {
        navigate('/login');
        return;
      }
      
      // Check if user is a creator
      if (user.role !== 'creator') {
        navigate('/funder-dashboard');
        return;
      }
      
      setCurrentUser(user);

      // Load user's campaigns from localStorage
      const allCampaigns = JSON.parse(localStorage.getItem('stellarpledge_campaigns') || '[]');
      const userCampaigns = allCampaigns.filter(c => c.creatorId === user.id);
      setCampaigns(userCampaigns);
    };

    loadUserData();

    // Listen for user updates
    window.addEventListener('user-login', loadUserData);
    
    return () => {
      window.removeEventListener('user-login', loadUserData);
    };
  }, [navigate]);

  const handleConnectWallet = () => {
    // Trigger wallet connection modal from header
    const connectButton = document.getElementById('connect-wallet-button');
    if (connectButton) {
      connectButton.click();
    }
  };

  const stats = [
    {
      label: "Active Campaigns",
      value: campaigns.filter(c => c.status === 'active').length,
      icon: TrendingUp,
      color: "text-accent"
    },
    {
      label: "Pending Approval",
      value: campaigns.filter(c => c.status === 'pending').length,
      icon: Clock,
      color: "text-yellow-500"
    },
    {
      label: "Successful",
      value: campaigns.filter(c => c.status === 'successful').length,
      icon: CheckCircle,
      color: "text-green-500"
    },
    {
      label: "Total Raised",
      value: `${campaigns.reduce((sum, c) => sum + c.pledged, 0)} XLM`,
      icon: TrendingUp,
      color: "text-accent"
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
            Creator Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Welcome back, {currentUser.name}! Manage your campaigns and track your success.
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
                    You need to connect your Stellar wallet to create and manage campaigns
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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

        {/* Create Campaign Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8 flex items-center justify-between"
        >
          <h2 className="text-2xl font-bold text-foreground">My Campaigns</h2>
          <Button
            onClick={() => navigate('/create-campaign')}
            className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold"
            disabled={!isConnected}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Campaign
          </Button>
        </motion.div>

        {/* Campaigns List */}
        {campaigns.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {campaigns.map((campaign, index) => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {campaign.title}
                    </h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      campaign.status === 'active' ? 'bg-accent/20 text-accent' :
                      campaign.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                      campaign.status === 'successful' ? 'bg-green-500/20 text-green-500' :
                      'bg-red-500/20 text-red-500'
                    }`}>
                      {campaign.status === 'active' ? '🔥 Active' :
                       campaign.status === 'pending' ? '⏳ Pending' :
                       campaign.status === 'successful' ? '✅ Successful' :
                       '❌ Failed'}
                    </span>
                  </div>
                  <Button variant="outline">View Details</Button>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="text-foreground font-semibold">
                      {Math.round((campaign.pledged / campaign.goal) * 100)}%
                    </span>
                  </div>
                  <div className="h-3 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(campaign.pledged / campaign.goal) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-accent rounded-full"
                    />
                  </div>
                </div>

                {/* Campaign Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {campaign.pledged.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      of {campaign.goal.toLocaleString()} XLM
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {campaign.backers}
                    </p>
                    <p className="text-xs text-muted-foreground">Backers</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {campaign.daysLeft}
                    </p>
                    <p className="text-xs text-muted-foreground">Days Left</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-card rounded-2xl p-12 border border-border text-center"
          >
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              No Campaigns Yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Create your first campaign to start raising funds for your project
            </p>
            <Button
              onClick={() => navigate('/create-campaign')}
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold"
              disabled={!isConnected}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Campaign
            </Button>
            {!isConnected && (
              <p className="text-sm text-muted-foreground mt-4">
                Connect your wallet first to create campaigns
              </p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CreatorDashboard;
