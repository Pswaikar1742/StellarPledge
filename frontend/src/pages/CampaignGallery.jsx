import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck, Globe, GitCommit, Award, HeartHandshake } from 'lucide-react';
import CampaignCard from '../components/CampaignCard';
import Footer from '../components/Footer';

const CampaignGallery = () => {
  const mockCampaigns = [
    {
      id: 1,
      title: "Revolutionary DeFi Protocol",
      description: "Building the next generation of decentralized finance infrastructure on Stellar blockchain.",
      pledged: 5000,
      goal: 10000,
      backers: 42,
      daysLeft: 15
    },
    {
      id: 2,
      title: "Green Energy NFT Marketplace",
      description: "Tokenizing renewable energy credits to accelerate the transition to sustainable power.",
      pledged: 8500,
      goal: 15000,
      backers: 67,
      daysLeft: 8
    },
    {
      id: 3,
      title: "Decentralized Education Platform",
      description: "Empowering learners worldwide with blockchain-verified credentials and peer-to-peer learning.",
      pledged: 3200,
      goal: 8000,
      backers: 28,
      daysLeft: 22
    }
  ];

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
            <div id="campaign-list" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mockCampaigns.map((campaign, index) => (
                <CampaignCard 
                  key={campaign.id} 
                  campaign={campaign} 
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CampaignGallery;
