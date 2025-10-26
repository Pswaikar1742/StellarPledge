import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck, Globe, GitCommit, Award, HeartHandshake } from 'lucide-react';
import CampaignCard from '../components/CampaignCard';
import Footer from '../components/Footer';
import { useCampaign } from '../context/CampaignContext';
import { useWallet } from '../context/WalletContext';

const CampaignGallery = () => {
  const { loadAllCampaigns, campaigns, isLoading } = useCampaign();
  const { publicKey } = useWallet();
  const [displayCampaigns, setDisplayCampaigns] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      if (publicKey) {
        await loadAllCampaigns();
      }
    };

    loadData();
  }, [publicKey, loadAllCampaigns]);

  useEffect(() => {
    // Transform blockchain campaigns for display
    if (campaigns && campaigns.length > 0) {
      const transformed = campaigns.map(campaign => {
        // Get UI metadata from localStorage
        const uiData = JSON.parse(localStorage.getItem(`campaign_ui_${campaign.id}`) || '{}');
        
        // Calculate days left
        const now = Math.floor(Date.now() / 1000);
        const daysLeft = Math.floor((campaign.deadline - now) / 86400);
        
        // Count backers
        const backers = Object.keys(campaign.backers || {}).length;
        
        return {
          id: campaign.id,
          title: uiData.title || `Campaign ${campaign.id}`,
          description: uiData.description || 'No description available',
          pledged: Number(campaign.pledged) / 10000000, // Convert stroops to XLM
          goal: Number(campaign.goal) / 10000000,
          backers,
          daysLeft: Math.max(0, daysLeft)
        };
      });
      
      setDisplayCampaigns(transformed);
    }
  }, [campaigns]);

  const featureVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="bg-background text-foreground">
      <main>
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-4">
              Fund the Future, <span className="text-accent">Decentralized.</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              StellarPledge is a fully transparent crowdfunding platform built on the Stellar network, empowering creators and backers with security and efficiency.
            </p>
          </motion.div>
        </section>

        {/* What We Are Section */}
        <section className="py-20 bg-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h3 className="text-3xl md:text-4xl font-bold mb-6">What is StellarPledge?</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We are a launchpad for innovation, where great ideas get the funding they deserve without intermediaries. By leveraging the power of Stellar smart contracts, we ensure that all pledges are held securely in escrow.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Funds are only released to creators when the campaign goal is met, and backers can easily claim a refund if it's not. It's crowdfunding, reimagined for a trustless world.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="p-4"
            >
              <img 
                className="rounded-2xl shadow-2xl" 
                alt="Abstract blockchain network graphic" 
                src="https://images.unsplash.com/photo-1639322537231-2f206e06af84?w=800&h=600&fit=crop" 
              />
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-16">A Simple, Secure Process</h3>
            <div className="grid md:grid-cols-3 gap-10">
              <motion.div 
                variants={featureVariants} 
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true }} 
                transition={{ duration: 0.5, delay: 0.1 }} 
                className="flex flex-col items-center"
              >
                <div className="bg-accent p-5 rounded-full mb-5">
                  <Award className="w-8 h-8 text-accent-foreground" />
                </div>
                <h4 className="text-2xl font-bold mb-2">1. Create</h4>
                <p className="text-muted-foreground">Launch your campaign and share your vision with the world.</p>
              </motion.div>
              <motion.div 
                variants={featureVariants} 
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true }} 
                transition={{ duration: 0.5, delay: 0.3 }} 
                className="flex flex-col items-center"
              >
                <div className="bg-accent p-5 rounded-full mb-5">
                  <HeartHandshake className="w-8 h-8 text-accent-foreground" />
                </div>
                <h4 className="text-2xl font-bold mb-2">2. Fund</h4>
                <p className="text-muted-foreground">Backers pledge support directly, with funds held in a secure smart contract.</p>
              </motion.div>
              <motion.div 
                variants={featureVariants} 
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true }} 
                transition={{ duration: 0.5, delay: 0.5 }} 
                className="flex flex-col items-center"
              >
                <div className="bg-accent p-5 rounded-full mb-5">
                  <GitCommit className="w-8 h-8 text-accent-foreground" />
                </div>
                <h4 className="text-2xl font-bold mb-2">3. Achieve</h4>
                <p className="text-muted-foreground">Creators claim funds upon success, or backers withdraw if the goal isn't met.</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Why Stellar Section */}
        <section className="py-20 bg-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-16">
              Why Build on <span className="text-accent">Stellar</span>?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              <motion.div 
                variants={featureVariants} 
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true }} 
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Zap className="w-10 h-10 text-accent mx-auto mb-4" />
                <h4 className="text-xl font-bold mb-2">Blazing Speed</h4>
                <p className="text-muted-foreground">Transactions confirm in seconds, not minutes.</p>
              </motion.div>
              <motion.div 
                variants={featureVariants} 
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true }} 
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Globe className="w-10 h-10 text-accent mx-auto mb-4" />
                <h4 className="text-xl font-bold mb-2">Low Costs</h4>
                <p className="text-muted-foreground">Fraction-of-a-cent fees make micro-pledges possible.</p>
              </motion.div>
              <motion.div 
                variants={featureVariants} 
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true }} 
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <ShieldCheck className="w-10 h-10 text-accent mx-auto mb-4" />
                <h4 className="text-xl font-bold mb-2">Proven Security</h4>
                <p className="text-muted-foreground">Built on a robust and battle-tested blockchain network.</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Active Campaigns Section */}
        <section id="campaigns" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Explore Active Campaigns
              </h3>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Discover groundbreaking projects you can support today.
              </p>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading campaigns from blockchain...</p>
                </div>
              </div>
            ) : displayCampaigns.length > 0 ? (
              <div id="campaign-list" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayCampaigns.map((campaign, index) => (
                  <CampaignCard 
                    key={campaign.id} 
                    campaign={campaign} 
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-card rounded-2xl p-12 border border-border text-center">
                <div className="text-6xl mb-4">🚀</div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  No Active Campaigns Yet
                </h3>
                <p className="text-muted-foreground">
                  Be the first to create a campaign and launch your vision!
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CampaignGallery;
