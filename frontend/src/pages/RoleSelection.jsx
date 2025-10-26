import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Rocket, Sparkles, Heart, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';

const RoleSelection = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('stellarpledge_current_user'));
    if (!user) {
      navigate('/login');
      return;
    }
    setCurrentUser(user);

    // Check if user already has a role selected
    if (user.role) {
      navigate(user.role === 'creator' ? '/creator-dashboard' : '/funder-dashboard');
    }
  }, [navigate]);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (!selectedRole) return;

    // Update user role in localStorage
    const updatedUser = { ...currentUser, role: selectedRole };
    localStorage.setItem('stellarpledge_current_user', JSON.stringify(updatedUser));

    // Update in users array
    const users = JSON.parse(localStorage.getItem('stellarpledge_users') || '[]');
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
      users[userIndex].role = selectedRole;
      localStorage.setItem('stellarpledge_users', JSON.stringify(users));
    }

    // Dispatch custom event to update Header
    window.dispatchEvent(new Event('user-login'));

    // Redirect based on role
    navigate(selectedRole === 'creator' ? '/creator-dashboard' : '/funder-dashboard');
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-5xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <Rocket className="w-12 h-12 text-accent" />
            <h1 className="text-4xl font-bold text-foreground">StellarPledge</h1>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Welcome, {currentUser.name}! 👋
          </h2>
          <p className="text-xl text-muted-foreground">
            What would you like to do today?
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Creator Option */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onClick={() => handleRoleSelect('creator')}
            className={`relative cursor-pointer group`}
          >
            <div className={`bg-card rounded-3xl p-8 border-2 transition-all duration-300 h-full
              ${selectedRole === 'creator' 
                ? 'border-accent shadow-2xl scale-105' 
                : 'border-border hover:border-accent/50 hover:shadow-xl'}`}
            >
              <div className="flex flex-col items-center text-center space-y-6">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all
                  ${selectedRole === 'creator' ? 'bg-accent' : 'bg-secondary group-hover:bg-accent/20'}`}
                >
                  <Sparkles className={`w-12 h-12 transition-colors
                    ${selectedRole === 'creator' ? 'text-accent-foreground' : 'text-accent'}`} />
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    🚀 Create a Campaign
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Launch your project and raise funds from the community. 
                    Set goals, create reward tiers, and bring your vision to life.
                  </p>
                </div>

                <div className="w-full space-y-3 text-left">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-accent text-sm">✓</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Create unlimited campaigns
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-accent text-sm">✓</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Offer custom reward tokens to backers
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-accent text-sm">✓</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Accept or decline funding with full control
                    </p>
                  </div>
                </div>

                {selectedRole === 'creator' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                      <span className="text-accent-foreground text-xl">✓</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Funder Option */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onClick={() => handleRoleSelect('funder')}
            className={`relative cursor-pointer group`}
          >
            <div className={`bg-card rounded-3xl p-8 border-2 transition-all duration-300 h-full
              ${selectedRole === 'funder' 
                ? 'border-accent shadow-2xl scale-105' 
                : 'border-border hover:border-accent/50 hover:shadow-xl'}`}
            >
              <div className="flex flex-col items-center text-center space-y-6">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all
                  ${selectedRole === 'funder' ? 'bg-accent' : 'bg-secondary group-hover:bg-accent/20'}`}
                >
                  <Heart className={`w-12 h-12 transition-colors
                    ${selectedRole === 'funder' ? 'text-accent-foreground' : 'text-accent'}`} />
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    🔍 Fund Projects
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Discover innovative projects and support creators. 
                    Earn exclusive rewards and be part of something amazing.
                  </p>
                </div>

                <div className="w-full space-y-3 text-left">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-accent text-sm">✓</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Browse and support unlimited projects
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-accent text-sm">✓</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Earn exclusive reward tokens instantly
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-accent text-sm">✓</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Safe funds with smart contract escrow
                    </p>
                  </div>
                </div>

                {selectedRole === 'funder' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                      <span className="text-accent-foreground text-xl">✓</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <Button
            onClick={handleContinue}
            disabled={!selectedRole}
            className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold px-12 py-6 text-lg rounded-xl disabled:opacity-50"
          >
            Continue <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            You can always switch roles later in your profile settings
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default RoleSelection;
