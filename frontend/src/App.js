import React from 'react';
import './App.css';
import { WalletProvider, useWallet } from './context/WalletContext';
import { CampaignProvider } from './context/CampaignContext';
import WalletConnect from './components/Wallet/WalletConnect';
import WalletDashboard from './components/Wallet/WalletDashboard';
import UnlockWallet from './components/Wallet/UnlockWallet';

/**
 * Main App Component with Standalone Wallet Integration
 */
function AppContent() {
  const { isConnected, isLocked } = useWallet();

  return (
    <div className="App">
      <header className="App-header">
        <h1>🌟 StellarPledge</h1>
        <p>Automated Creator Economy on Stellar</p>
        <p className="subtitle">
          Standalone Wallet - No Freighter Required!
        </p>
      </header>

      <main className="App-main">
        {/* Show wallet connection if not connected */}
        {!isConnected && (
          <div className="wallet-section">
            <WalletConnect />
          </div>
        )}

        {/* Show unlock screen if connected but locked */}
        {isConnected && isLocked && (
          <div className="wallet-section">
            <UnlockWallet />
          </div>
        )}

        {/* Show dashboard and app content when connected and unlocked */}
        {isConnected && !isLocked && (
          <div className="connected-content">
            <div className="wallet-dashboard-section">
              <WalletDashboard />
            </div>

            <section className="status-section">
              <h2>✅ System Status: Ready for Testing</h2>
              <ul className="status-list">
                <li>✅ Smart Contract Deployed with Perk System</li>
                <li>✅ Standalone Wallet Integration Complete</li>
                <li>✅ Soroban.js Contract Layer Ready</li>
                <li>✅ React Context Providers Active</li>
                <li>✅ Create/Import/Read-Only Modes Working</li>
                <li>⏳ Campaign UI Components Coming Next</li>
              </ul>
            </section>

            <section className="test-info">
              <h2>🧪 Testing Instructions</h2>
              <div className="test-steps">
                <h3>Test 1: Create New Wallet</h3>
                <ol>
                  <li>Click "Create New Wallet"</li>
                  <li>Enter wallet name and password (min 8 chars)</li>
                  <li>Save your secret key from backup screen!</li>
                  <li>Wallet ready to use</li>
                </ol>

                <h3>Test 2: Import Demo Account (Alice)</h3>
                <ol>
                  <li>Get secret key from: demo-accounts/Alice.txt</li>
                  <li>Click "Import Existing Wallet"</li>
                  <li>Paste Alice's secret key</li>
                  <li>Set password and import</li>
                  <li>Should show ~9,999 XLM balance</li>
                </ol>

                <h3>Test 3: Read-Only Connection (Charlie)</h3>
                <ol>
                  <li>Charlie's public key: GC4GCLLQEERQXIHNYITVQINGT54UK3ZPHR5ACC6QKS2TKVS4YL3X7YVP</li>
                  <li>Click "Connect Read-Only"</li>
                  <li>Paste public key</li>
                  <li>Can view but not sign transactions</li>
                </ol>

                <h3>Test 4: Lock/Unlock</h3>
                <ol>
                  <li>Click "Lock" button in dashboard</li>
                  <li>Wallet locks (keypair cleared from memory)</li>
                  <li>Enter password to unlock</li>
                  <li>Ready to sign again</li>
                </ol>
              </div>
            </section>

            <section className="contract-info">
              <h2>📝 Contract Details</h2>
              <p><strong>Address:</strong> CD4L4MPVSJ3RLAUYQ3ID2M75VWVVMDFBTESJIY4UULFFN33X2KNRTJXY</p>
              <p><strong>Network:</strong> Stellar Testnet</p>
              <p><strong>Features:</strong></p>
              <ul>
                <li>Automated Perk Distribution via Cross-Contract Calls</li>
                <li>Configurable Threshold-Based Rewards</li>
                <li>Support for Any Stellar Classic Asset</li>
                <li>Secure Escrow with Success/Fail States</li>
              </ul>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <WalletProvider>
      <CampaignProvider>
        <AppContent />
      </CampaignProvider>
    </WalletProvider>
  );
}

export default App;
