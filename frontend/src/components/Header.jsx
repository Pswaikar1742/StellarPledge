import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Sun, Moon, Wallet, User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from './ThemeProvider';
import { Button } from './ui/button';
import { useWallet } from '../context/WalletContext';
import WalletConnect from './Wallet/WalletConnect';
import WalletDashboard from './Wallet/WalletDashboard';

const Header = () => {
  const { theme, setTheme } = useTheme();
  const { isConnected } = useWallet();
  const navigate = useNavigate();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check for logged in user on mount and when localStorage changes
    const checkUser = () => {
      const user = JSON.parse(localStorage.getItem('stellarpledge_current_user'));
      setCurrentUser(user);
    };

    checkUser();

    // Listen for storage events (when user logs in/out in same window)
    window.addEventListener('storage', checkUser);
    
    // Listen for custom event for same-tab updates
    window.addEventListener('user-login', checkUser);
    window.addEventListener('user-logout', checkUser);

    return () => {
      window.removeEventListener('storage', checkUser);
      window.removeEventListener('user-login', checkUser);
      window.removeEventListener('user-logout', checkUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('stellarpledge_current_user');
    setCurrentUser(null);
    
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new Event('user-logout'));
    
    navigate('/');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      <header className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link to="/" className="flex items-center gap-3">
                <Rocket className="w-8 h-8 text-accent" />
                <h1 className="text-2xl font-bold text-foreground">StellarPledge</h1>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center gap-2"
            >
              {currentUser ? (
                <>
                  {/* Logged in - show wallet connection */}
                  {isConnected ? (
                    <WalletDashboard />
                  ) : (
                    <Button
                      id="connect-wallet-button"
                      onClick={() => setShowWalletModal(true)}
                      className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold"
                    >
                      <Wallet className="w-4 h-4 mr-2" />
                      Connect Wallet
                    </Button>
                  )}
                  
                  {/* User menu */}
                  <div className="flex items-center gap-2 ml-2">
                    <Link 
                      to={currentUser.role === 'creator' ? '/creator-dashboard' : '/funder-dashboard'}
                      className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary transition-colors"
                    >
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{currentUser.name}</span>
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleLogout}
                      title="Logout"
                    >
                      <LogOut className="h-[1.2rem] w-[1.2rem]" />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {/* Not logged in - show login/register buttons */}
                  <Link to="/login">
                    <Button variant="outline" className="font-semibold">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
              
              <Button
                id="theme-toggle-button"
                variant="outline"
                size="icon"
                onClick={toggleTheme}
              >
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </motion.div>
          </div>
        </nav>
      </header>

      {/* Wallet Connect Modal - only show if user is logged in */}
      {showWalletModal && !isConnected && currentUser && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="relative max-w-2xl w-full mx-4">
            <button
              onClick={() => setShowWalletModal(false)}
              className="absolute -top-4 -right-4 z-10 bg-accent text-accent-foreground rounded-full w-10 h-10 flex items-center justify-center hover:bg-accent/90"
            >
              ✕
            </button>
            <WalletConnect />
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
