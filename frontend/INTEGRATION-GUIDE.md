# 🎨 StellarPledge Frontend Integration API

## 📋 Overview

This document provides complete integration instructions for the UI developer. The entire backend is ready and can be consumed through simple React hooks and contexts.

---

## 🔌 Available Contexts

### 1. **WalletContext** - Manages Freighter wallet connection

```javascript
import { useWallet } from './context/WalletContext';

const Component = () => {
  const {
    publicKey,              // string: User's public key (e.g., "GDMT3K...")
    isConnected,            // boolean: Is wallet connected?
    isFreighterInstalled,   // boolean: Is Freighter extension installed?
    isLoading,              // boolean: Is wallet operation in progress?
    error,                  // string | null: Error message
    connectWallet,          // function: () => Promise<string>
    disconnectWallet,       // function: () => void
  } = useWallet();
  
  return (
    <button onClick={connectWallet}>
      {isConnected ? `Connected: ${publicKey}` : 'Connect Wallet'}
    </button>
  );
};
```

### 2. **CampaignContext** - Manages campaign data and operations

```javascript
import { useCampaign } from './context/CampaignContext';

const Component = () => {
  const {
    campaigns,                    // Array<Campaign>: All loaded campaigns
    currentCampaign,              // Campaign | null: Currently selected campaign
    isLoading,                    // boolean: Is operation in progress?
    error,                        // string | null: Error message
    loadCampaign,                 // function: (id) => Promise<Campaign>
    loadAllCampaigns,             // function: (maxCampaigns?) => Promise<Array<Campaign>>
    handleCreateCampaign,         // function: (goal, hours, perk?) => Promise<number>
    handlePledge,                 // function: (id, amount) => Promise<boolean>
    handleClaimFunds,             // function: (id) => Promise<boolean>
    handleWithdrawRefund,         // function: (id) => Promise<boolean>
    getUserCreatedCampaigns,      // function: () => Array<Campaign>
    getUserBackedCampaigns,       // function: () => Array<Campaign>
    setCurrentCampaign,           // function: (campaign) => void
  } = useCampaign();
};
```

---

## 🎣 Custom Hooks (Recommended)

### **useCreateCampaign** - For campaign creation forms

```javascript
import { useCreateCampaign } from './hooks/useCampaignHooks';

const CreateCampaignForm = () => {
  const { create, isCreating, error } = useCreateCampaign();
  
  const handleSubmit = async (formData) => {
    // Optional perk configuration
    const perk = formData.enablePerk ? {
      threshold: formData.perkThreshold,  // XLM amount (e.g., 500)
      assetAddress: formData.assetAddress, // Token contract address
      amount: formData.perkAmount,         // Token amount (e.g., 1000000 = 1 token with 6 decimals)
    } : null;
    
    try {
      const campaignId = await create(
        formData.goal,          // Goal in XLM (e.g., 1000)
        formData.deadlineHours, // Hours until deadline (e.g., 24)
        perk                    // Optional perk config
      );
      
      console.log('Campaign created with ID:', campaignId);
    } catch (err) {
      console.error('Failed:', err.message);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Your UI components */}
      <button disabled={isCreating}>
        {isCreating ? 'Creating...' : 'Create Campaign'}
      </button>
      {error && <span className="error">{error}</span>}
    </form>
  );
};
```

### **usePledge** - For pledge/backing functionality

```javascript
import { usePledge } from './hooks/useCampaignHooks';

const PledgeButton = ({ campaignId }) => {
  const { makePledge, isPledging, error } = usePledge();
  
  const handlePledge = async () => {
    try {
      await makePledge(campaignId, 500); // Pledge 500 XLM
      alert('Pledge successful! 🎉');
    } catch (err) {
      alert('Pledge failed: ' + err.message);
    }
  };
  
  return (
    <button onClick={handlePledge} disabled={isPledging}>
      {isPledging ? 'Processing...' : 'Pledge 500 XLM'}
    </button>
  );
};
```

### **useCampaignList** - For displaying all campaigns

```javascript
import { useCampaignList } from './hooks/useCampaignHooks';

const CampaignList = () => {
  const { campaigns, loading, refresh } = useCampaignList();
  
  if (loading) return <div>Loading campaigns...</div>;
  
  return (
    <div>
      <button onClick={refresh}>Refresh</button>
      {campaigns.map(campaign => (
        <div key={campaign.id}>
          <h3>Campaign #{campaign.id}</h3>
          <p>Goal: {campaign.goal} XLM</p>
          <p>Pledged: {campaign.pledged} XLM</p>
          <p>Deadline: {new Date(campaign.deadline * 1000).toLocaleString()}</p>
          <p>State: {campaign.state}</p>
          
          {/* Show perk badge if campaign has perk */}
          {campaign.perk && (
            <div className="perk-badge">
              🎁 Perk: {campaign.perk.threshold} XLM → {campaign.perk.amount} tokens
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
```

### **usePerkCheck** - Check if pledge qualifies for perk

```javascript
import { usePerkCheck } from './hooks/useCampaignHooks';

const PerkIndicator = ({ campaign, userPledgeAmount }) => {
  const { qualifies, perkInfo } = usePerkCheck(campaign, userPledgeAmount);
  
  if (!perkInfo) return null; // No perk configured
  
  return (
    <div className={qualifies ? 'perk-eligible' : 'perk-ineligible'}>
      {qualifies ? (
        <span>✅ You qualify for the perk!</span>
      ) : (
        <span>
          Pledge {perkInfo.threshold} XLM or more to get {perkInfo.amount} tokens!
        </span>
      )}
    </div>
  );
};
```

### **useCampaignProgress** - Calculate campaign progress

```javascript
import { useCampaignProgress } from './hooks/useCampaignHooks';

const ProgressBar = ({ campaign }) => {
  const { percentage, remaining, isSuccessful } = useCampaignProgress(campaign);
  
  return (
    <div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
      </div>
      <p>{percentage}% funded</p>
      <p>{remaining} XLM remaining</p>
      {isSuccessful && <span className="success-badge">🎯 Goal Reached!</span>}
    </div>
  );
};
```

### **useCampaignDeadline** - Real-time countdown

```javascript
import { useCampaignDeadline } from './hooks/useCampaignHooks';

const Countdown = ({ campaign }) => {
  const { isExpired, timeRemaining, formattedTime } = useCampaignDeadline(campaign);
  
  return (
    <div className={isExpired ? 'expired' : 'active'}>
      {isExpired ? (
        <span>⏰ Campaign Ended</span>
      ) : (
        <span>⏳ {formattedTime} remaining</span>
      )}
    </div>
  );
};
```

### **useMyCampaigns** - Get user's created campaigns

```javascript
import { useMyCampaigns } from './hooks/useCampaignHooks';

const MyCreatedCampaigns = () => {
  const { myCampaigns, loading } = useMyCampaigns();
  
  if (loading) return <div>Loading...</div>;
  if (myCampaigns.length === 0) return <div>No campaigns created yet</div>;
  
  return (
    <div>
      <h2>My Campaigns</h2>
      {myCampaigns.map(campaign => (
        <CampaignCard key={campaign.id} campaign={campaign} />
      ))}
    </div>
  );
};
```

### **useMyPledges** - Get campaigns user has backed

```javascript
import { useMyPledges } from './hooks/useCampaignHooks';

const MyBackedCampaigns = () => {
  const { backedCampaigns, loading } = useMyPledges();
  
  if (loading) return <div>Loading...</div>;
  if (backedCampaigns.length === 0) return <div>No pledges yet</div>;
  
  return (
    <div>
      <h2>Campaigns I Backed</h2>
      {backedCampaigns.map(campaign => (
        <CampaignCard key={campaign.id} campaign={campaign} />
      ))}
    </div>
  );
};
```

---

## 📊 Data Types

### **Campaign Object**

```typescript
type Campaign = {
  id: number;                   // Campaign ID
  creator: string;              // Creator's public key
  goal: number;                 // Funding goal in XLM
  pledged: number;              // Amount pledged so far in XLM
  deadline: number;             // Unix timestamp
  state: 'Active' | 'Successful' | 'Failed';
  backers: Array<{              // Array of backers
    address: string;
    amount: number;
  }>;
  perk: {                       // Optional perk configuration
    threshold: number;          // Minimum XLM to earn perk
    asset_address: string;      // Perk token contract address
    amount: number;             // Number of tokens to transfer
  } | null;
};
```

---

## 🎯 Demo Flow Implementation

### **Alice Creates Campaign with Perk**

```javascript
// In CreateCampaignForm component
const perk = {
  threshold: 500,                                           // 500 XLM minimum
  assetAddress: 'FILMCREDIT_TOKEN_CONTRACT_ADDRESS',        // FILMCREDIT asset
  amount: 1000000,                                          // 1 token (6 decimals)
};

await create(1000, 24, perk); // 1000 XLM goal, 24 hours, with perk
```

### **Bob Pledges (No Perk)**

```javascript
// Bob pledges 100 XLM - below threshold, no perk triggered
await makePledge(campaignId, 100);
```

### **Charlie Pledges (GETS PERK!)**

```javascript
// Charlie pledges 500 XLM - meets threshold, automatic perk transfer!
await makePledge(campaignId, 500);

// Smart contract automatically:
// 1. Accepts 500 XLM from Charlie → Contract
// 2. Transfers 1 FILMCREDIT from Alice → Charlie
// 3. Marks campaign as Successful (600/1000 XLM)
```

### **Alice Claims Funds**

```javascript
// Campaign is successful, Alice claims total funds
await handleClaimFunds(campaignId);
// Alice receives 600 XLM (Bob's 100 + Charlie's 500)
```

---

## ⚙️ Configuration

All configuration is in `/src/constants/constants.js`:

```javascript
export const CONTRACT_ADDRESS = 'CD4L4MPVSJ3RLAUYQ3ID2M75VWVVMDFBTESJIY4UULFFN33X2KNRTJXY';
export const NATIVE_XLM_ADDRESS = 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC';
export const NETWORK_CONFIG = {
  NETWORK_PASSPHRASE: 'Test SDF Network ; September 2015',
  RPC_URL: 'https://soroban-testnet.stellar.org',
  HORIZON_URL: 'https://horizon-testnet.stellar.org',
};
```

---

## 🚀 Getting Started

### 1. Install Dependencies (Already Done)

```bash
cd frontend
npm install
```

### 2. Start Development Server

```bash
npm start
```

### 3. Configure HTTPS (Required for Freighter)

Update `package.json`:

```json
{
  "scripts": {
    "start": "HTTPS=true react-scripts start"
  }
}
```

### 4. Import and Use Contexts

Wrap your app with providers (Already done in App.js):

```javascript
import { WalletProvider } from './context/WalletContext';
import { CampaignProvider } from './context/CampaignContext';

<WalletProvider>
  <CampaignProvider>
    {/* Your UI components */}
  </CampaignProvider>
</WalletProvider>
```

---

## 📝 Notes for UI Developer

1. **All backend logic is complete** - Just focus on UI/UX
2. **Use the custom hooks** - They handle all state management
3. **Freighter wallet is integrated** - Users sign transactions securely
4. **Transaction polling is handled** - You get success/error callbacks
5. **LocalStorage persistence** - Wallet reconnects automatically
6. **Error handling is built-in** - Just display the error messages

---

## 🎨 Recommended UI Structure

```
Components to Create:
├── Header.js           - Wallet connection button
├── CampaignCard.js     - Campaign preview card with perk badge
├── CampaignList.js     - Grid of all campaigns
├── CreateForm.js       - Campaign creation with perk toggle
├── PledgeModal.js      - Pledge amount input with perk preview
├── ProgressBar.js      - Visual progress indicator
├── Countdown.js        - Deadline countdown timer
├── ClaimButton.js      - For successful campaign creators
└── RefundButton.js     - For backers of failed campaigns
```

---

## ✅ Backend Checklist

- [x] Smart contract deployed with perk system
- [x] Freighter wallet integration
- [x] Soroban.js contract layer
- [x] WalletContext provider
- [x] CampaignContext provider
- [x] 10+ custom React hooks
- [x] Type converters for Soroban
- [x] Transaction polling
- [x] Error handling
- [x] LocalStorage persistence
- [x] Integration documentation

**Status: 100% Ready for UI Integration** 🎉

---

**Contract Address:** `CD4L4MPVSJ3RLAUYQ3ID2M75VWVVMDFBTESJIY4UULFFN33X2KNRTJXY`  
**Network:** Stellar Testnet  
**Last Updated:** October 25, 2025
