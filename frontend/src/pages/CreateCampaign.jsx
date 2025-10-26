import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Target, Calendar, Gift } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useWallet } from '../context/WalletContext';
import { useCampaign } from '../context/CampaignContext';

const CreateCampaign = () => {
  const navigate = useNavigate();
  const { isConnected, publicKey } = useWallet();
  const { handleCreateCampaign, isLoading: contractLoading } = useCampaign();
  const [currentUser, setCurrentUser] = useState(null);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goal: '',
    duration: '',
    rewardTier: '',
    tokenName: '',
    tokenCode: '',
    tokenSupply: ''
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('stellarpledge_current_user'));
    if (!user || user.role !== 'creator') {
      navigate('/');
      return;
    }
    setCurrentUser(user);

    if (!isConnected) {
      navigate('/creator-dashboard');
    }
  }, [navigate, isConnected]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    if (step === 1) {
      navigate('/creator-dashboard');
    } else {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (!publicKey) {
      alert('Please connect your wallet first');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Parse form data
      const goal = parseFloat(formData.goal);
      const deadlineHours = parseInt(formData.duration) * 24; // convert days to hours
      
      // Optional perk configuration
      const perk = formData.rewardTier ? {
        threshold: parseFloat(formData.rewardTier),
        assetAddress: null, // No perk tokens for now (can add later)
        amount: 0
      } : null;
      
      // Campaign UI data
      const campaignData = {
        title: formData.title,
        description: formData.description,
        tokenName: formData.tokenName,
        tokenCode: formData.tokenCode,
        tokenSupply: parseInt(formData.tokenSupply) || 0
      };
      
      console.log('✅ Creating campaign (MOCK MODE)...');
      console.log('Goal:', goal, 'XLM');
      console.log('Duration:', deadlineHours, 'hours');
      console.log('Perk threshold:', perk?.threshold || 'None');
      
      // ✅ Create campaign in MOCK MODE (no blockchain call yet)
      const campaignId = await handleCreateCampaign(goal, deadlineHours, perk, campaignData);
      
      console.log(`✅ Campaign created (MOCK)! ID: ${campaignId}`);
      
      alert(`Campaign created successfully! ID: ${campaignId}\n\nYou can see it in your Creator Dashboard.\nOnce the goal is reached, you can complete the campaign to deploy it on blockchain!`);
      
      // Navigate to dashboard
      navigate('/creator-dashboard');
      
    } catch (error) {
      console.error("❌ Campaign creation failed:", error);
      alert("Failed to create campaign: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="outline"
            onClick={handleBack}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Create New Campaign
          </h1>
          <p className="text-muted-foreground">
            Step {step} of 3: {step === 1 ? 'Basic Info' : step === 2 ? 'Funding Goal' : 'Reward Tier'}
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Progress</span>
            <span className="text-sm font-semibold text-accent">{Math.round((step / 3) * 100)}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(step / 3) * 100}%` }}
              className="h-full bg-accent"
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Form */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-card rounded-2xl p-8 border border-border shadow-2xl"
        >
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Campaign Basics</h2>
                  <p className="text-sm text-muted-foreground">Tell us about your project</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Campaign Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g., Revolutionary DeFi Protocol"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Describe your project and what you plan to build..."
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full min-h-[120px] px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-foreground resize-none"
                  required
                />
              </div>

              <Button
                onClick={handleNext}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-bold"
                disabled={!formData.title || !formData.description}
              >
                Continue
              </Button>
            </div>
          )}

          {/* Step 2: Funding Goal */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <Target className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Funding Goal</h2>
                  <p className="text-sm text-muted-foreground">Set your target and timeline</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal">Funding Goal (XLM)</Label>
                <Input
                  id="goal"
                  name="goal"
                  type="number"
                  placeholder="e.g., 6000"
                  value={formData.goal}
                  onChange={handleChange}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  How much do you need to raise to complete your project?
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Campaign Duration (Days)</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  placeholder="e.g., 30"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  How long will your campaign run?
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 font-bold"
                  disabled={!formData.goal || !formData.duration}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Reward Tier */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <Gift className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Reward Tier</h2>
                  <p className="text-sm text-muted-foreground">Offer special perks to backers</p>
                </div>
              </div>

              <div className="bg-secondary/50 rounded-xl p-4 mb-6">
                <p className="text-sm text-muted-foreground">
                  💡 <strong>Tip:</strong> We'll create a custom token for you automatically! 
                  Backers who pledge above your reward tier will receive this exclusive token.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rewardTier">Minimum Pledge for Reward (XLM)</Label>
                <Input
                  id="rewardTier"
                  name="rewardTier"
                  type="number"
                  placeholder="e.g., 3000"
                  value={formData.rewardTier}
                  onChange={handleChange}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Backers who pledge this amount or more will receive your reward token
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tokenName">Reward Token Name</Label>
                <Input
                  id="tokenName"
                  name="tokenName"
                  placeholder="e.g., Founder's Token"
                  value={formData.tokenName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tokenCode">Token Code (Max 12 characters)</Label>
                <Input
                  id="tokenCode"
                  name="tokenCode"
                  placeholder="e.g., FOUNDER"
                  value={formData.tokenCode}
                  onChange={handleChange}
                  maxLength={12}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  A short code to identify your token (like a ticker symbol)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tokenSupply">Total Token Supply</Label>
                <Input
                  id="tokenSupply"
                  name="tokenSupply"
                  type="number"
                  placeholder="e.g., 100"
                  value={formData.tokenSupply}
                  onChange={handleChange}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  How many reward tokens do you want to create?
                </p>
              </div>

              {/* Preview */}
              {formData.rewardTier && formData.tokenName && formData.tokenCode && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-accent/10 border-2 border-accent rounded-xl p-6"
                >
                  <h3 className="text-lg font-bold text-foreground mb-2">Reward Preview</h3>
                  <p className="text-muted-foreground">
                    ✨ Pledge <strong className="text-accent">{formData.rewardTier} XLM</strong> or more 
                    to receive <strong className="text-accent">1 {formData.tokenCode}</strong> token 
                    ({formData.tokenName})
                  </p>
                </motion.div>
              )}

              <div className="flex gap-4">
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 font-bold"
                  disabled={!formData.rewardTier || !formData.tokenName || !formData.tokenCode || !formData.tokenSupply || isSubmitting || contractLoading}
                >
                  {isSubmitting || contractLoading ? 'Creating on Blockchain...' : 'Launch Campaign 🚀'}
                </Button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <p className="text-xs text-muted-foreground">
            🔒 Your campaign will be deployed to Stellar testnet with smart contract escrow
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateCampaign;
