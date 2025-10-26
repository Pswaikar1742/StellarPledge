import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { WalletProvider } from './context/WalletContext';
import { CampaignProvider } from './context/CampaignContext';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from './components/ui/toaster';
import Header from './components/Header';
import CampaignGallery from './pages/CampaignGallery';
import CampaignDetail from './pages/CampaignDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import RoleSelection from './pages/RoleSelection';
import CreatorDashboard from './pages/CreatorDashboard';
import FunderDashboard from './pages/FunderDashboard';
import CreateCampaign from './pages/CreateCampaign';
import UnlockWallet from './components/Wallet/UnlockWallet';
import { useWallet } from './context/WalletContext';
import './utils/setupDemoUsers'; // Make setupDemoUsers available globally
import './utils/mockWalletBalance'; // Make wallet balance utilities available globally
import './utils/realDemoAccounts'; // Make REAL funded demo accounts available globally

/**
 * Error Boundary Component
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-destructive text-destructive-foreground flex items-center justify-center p-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">⚠️ Something went wrong</h1>
            <p className="text-xl mb-8">Error: {this.state.error?.message}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-4 bg-background text-foreground rounded-lg font-bold hover:opacity-90 transition-opacity"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Main App Content with Wallet State Management
 */
function AppContent() {
  const { isConnected, isLocked } = useWallet();

  // Show unlock screen if wallet is locked
  if (isConnected && isLocked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <UnlockWallet />
      </div>
    );
  }

  // Show main app with header and content
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Routes>
        <Route path="/" element={<CampaignGallery />} />
        <Route path="/campaign/:id" element={<CampaignDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route path="/creator-dashboard" element={<CreatorDashboard />} />
        <Route path="/funder-dashboard" element={<FunderDashboard />} />
        <Route path="/create-campaign" element={<CreateCampaign />} />
      </Routes>
      <Toaster />
    </div>
  );
}

/**
 * Root App Component with Providers
 */
function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider defaultTheme="light" storageKey="stellarpledge-theme">
          <WalletProvider>
            <CampaignProvider>
              <AppContent />
            </CampaignProvider>
          </WalletProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
