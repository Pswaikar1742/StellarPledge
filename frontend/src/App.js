import React from 'react';
import './App.css';
import { WalletProvider } from './context/WalletContext';
import { CampaignProvider } from './context/CampaignContext';

/**
 * Main App Component
 * Wraps application with Context Providers
 * 
 * UI components will be added here by frontend developer
 */
function App() {
  return (
    <WalletProvider>
      <CampaignProvider>
        <div className="App">
          <header className="App-header">
            <h1>🌟 StellarPledge</h1>
            <p>Automated Creator Economy on Stellar</p>
            <p className="subtitle">
              Backend Ready - Waiting for UI Integration
            </p>
          </header>

          <main className="App-main">
            <section className="status-section">
              <h2>✅ Backend Status: Ready</h2>
              <ul className="status-list">
                <li>✅ Smart Contract Deployed with Perk System</li>
                <li>✅ Freighter Wallet Integration Ready</li>
                <li>✅ Soroban.js Contract Layer Complete</li>
                <li>✅ React Context Providers Ready</li>
                <li>✅ Custom Hooks for UI Available</li>
                <li>⏳ Awaiting UI Components from Frontend Team</li>
              </ul>
            </section>

            <section className="integration-guide">
              <h2>🔌 Integration Guide for Frontend Developer</h2>
              
              <div className="code-block">
                <h3>1. Use Wallet Context:</h3>
                <pre>{`import { useWallet } from './context/WalletContext';

const MyComponent = () => {
  const { publicKey, isConnected, connectWallet } = useWallet();
  
  return (
    <button onClick={connectWallet}>
      {isConnected ? publicKey : 'Connect Wallet'}
    </button>
  );
};`}</pre>
              </div>

              <div className="code-block">
                <h3>2. Create Campaign:</h3>
                <pre>{`import { useCreateCampaign } from './hooks/useCampaignHooks';

const CreateForm = () => {
  const { create, isCreating } = useCreateCampaign();
  
  const handleSubmit = async () => {
    const perk = {
      threshold: 500,  // 500 XLM minimum
      assetAddress: 'ASSET_CONTRACT_ADDRESS',
      amount: 1000000  // 1 token (with 6 decimals)
    };
    
    await create(1000, 24, perk);  // 1000 XLM goal, 24 hours
  };
  
  return <button onClick={handleSubmit}>Create</button>;
};`}</pre>
              </div>

              <div className="code-block">
                <h3>3. Display Campaigns:</h3>
                <pre>{`import { useCampaignList } from './hooks/useCampaignHooks';

const CampaignList = () => {
  const { campaigns, loading, refresh } = useCampaignList();
  
  if (loading) return <div>Loading...</div>;
  
  return campaigns.map(campaign => (
    <div key={campaign.id}>
      <h3>Goal: {campaign.goal} XLM</h3>
      <p>Pledged: {campaign.pledged} XLM</p>
      {campaign.perk && (
        <span>🎁 Perk: {campaign.perk.threshold} XLM</span>
      )}
    </div>
  ));
};`}</pre>
              </div>

              <div className="code-block">
                <h3>4. Make Pledge:</h3>
                <pre>{`import { usePledge, usePerkCheck } from './hooks/useCampaignHooks';

const PledgeButton = ({ campaign }) => {
  const { makePledge, isPledging } = usePledge();
  const { qualifies, perkInfo } = usePerkCheck(campaign, 500);
  
  const handlePledge = async () => {
    await makePledge(campaign.id, 500);  // Pledge 500 XLM
  };
  
  return (
    <div>
      {qualifies && <span>🎁 You'll get the perk!</span>}
      <button onClick={handlePledge} disabled={isPledging}>
        Pledge
      </button>
    </div>
  );
};`}</pre>
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
          </main>
        </div>
      </CampaignProvider>
    </WalletProvider>
  );
}

export default App;
