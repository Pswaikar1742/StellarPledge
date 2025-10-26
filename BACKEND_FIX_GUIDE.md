# 🔧 Backend Integration Fix - Connect UI to Soroban Smart Contract

## 🚨 Current Problem

The frontend is currently using **localStorage only** and NOT calling the actual Soroban smart contract. This means:
- ❌ No real blockchain transactions
- ❌ Campaigns don't appear on stellar.expert
- ❌ "Failed" status because contract isn't initialized
- ❌ View Details button doesn't work (no real campaign data)

## ✅ Solution Overview

We need to integrate the existing Soroban.js functions into the campaign creation and pledge flow.

---

## 🔑 Updated Demo Accounts (Now Correct!)

### Alice (Creator)
- **Public**: `GDMT3KZ3Q4S5YKPBCI7BGJB5H3ST7GF2IFRJVU34WEIE5UX5NZTW5FTF`
- **Secret**: `SAH6ZOC6X4PVOHU7NQQ25KVWI2AGAHALTXI3N7UF4DLYUYJAJF22I7IF`
- **Balance**: 1,000 XLM (reduced from 9,999 for demo)
- **Role**: Creates campaigns

### Bob (Student Backer)
- **Public**: `GAY4ASCS7CPNVH4OVSRO75V7NDRP4DDAF22V5SR3DLPP2WKI2Y3FRVNA`
- **Secret**: `SBJLYDJEBTRRQ3FPBOGQFLL6ZILZMZJGFVC7BIHTKJQJ4MAKT6ZNRX7C`
- **Balance**: 10,000 XLM (funded)
- **Role**: Pledges 2,000 XLM (below threshold)

### Charlie (Investor)
- **Public**: `GDQUP4JVL64U6GSPR6GN2T2UQG4JBYCCYH7B6XYCHBTHO5DLMY5H4PLB`
- **Secret**: `SC5QCVV6JUP3UYB7IOOMCUBHXI7RXYYZXIM2QPZQNFAWRYAUPCMO3E2O`
- **Balance**: 10,000 XLM (funded)
- **Role**: Pledges 4,000 XLM (above 3,000 threshold → gets reward!)

---

## 📝 Required Changes

### 1. Fix `CreateCampaign.jsx`

**Current Code** (lines 84-92):
```javascript
const handleSubmit = () => {
  // Get existing campaigns
  const campaigns = JSON.parse(localStorage.getItem('stellarpledge_campaigns') || '[]');
  
  // Create new campaign (localStorage only - WRONG!)
  const newCampaign = {
    id: Date.now(),
    // ... rest of localStorage logic
  };
  
  campaigns.push(newCampaign);
  localStorage.setItem('stellarpledge_campaigns', JSON.stringify(campaigns));
}
```

**Should Be**:
```javascript
import { useCampaign } from '../context/CampaignContext';

const CreateCampaign = () => {
  const { handleCreateCampaign, isLoading } = useCampaign();
  
  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      
      // Parse form data
      const goal = parseFloat(formData.goal);
      const deadlineHours = parseInt(formData.duration) * 24; // convert days to hours
      
      // Optional perk configuration
      const perk = formData.rewardTier ? {
        threshold: parseFloat(formData.rewardTier),
        assetAddress: null, // We'll add perk tokens later
        amount: parseInt(formData.tokenSupply || 1)
      } : null;
      
      // 🚀 CALL SMART CONTRACT via CampaignContext
      const campaignId = await handleCreateCampaign(goal, deadlineHours, perk);
      
      console.log(`✅ Campaign created on blockchain! ID: ${campaignId}`);
      
      // Store additional UI data in localStorage (title, description, images)
      const uiData = {
        campaignId,
        title: formData.title,
        description: formData.description,
        creatorName: currentUser.name,
        createdAt: new Date().toISOString()
      };
      
      const storedUI = JSON.parse(localStorage.getItem('stellarpledge_campaign_ui') || '{}');
      storedUI[campaignId] = uiData;
      localStorage.setItem('stellarpledge_campaign_ui', JSON.stringify(storedUI));
      
      // Navigate to dashboard
      navigate('/creator-dashboard');
      
    } catch (error) {
      console.error("Campaign creation failed:", error);
      alert("Failed to create campaign: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };
}
```

---

### 2. Fix `CampaignDetail.jsx` - Make Pledge Actually Work

**Current Problem**: Pledge button probably only updates localStorage

**Should Call Smart Contract**:
```javascript
import { useCampaign } from '../context/CampaignContext';

const CampaignDetail = () => {
  const { currentCampaign, handlePledge, isLoading, loadCampaign } = useCampaign();
  const [pledgeAmount, setPledgeAmount] = useState('');
  
  // Load campaign from blockchain when component mounts
  useEffect(() => {
    const campaignId = /* get from URL params */;
    loadCampaign(campaignId);
  }, []);
  
  const handleMakePledge = async () => {
    try {
      const amount = parseFloat(pledgeAmount);
      
      if (amount <= 0) {
        alert("Please enter a valid amount");
        return;
      }
      
      // 🚀 CALL SMART CONTRACT
      await handlePledge(currentCampaign.id, amount);
      
      console.log("✅ Pledge successful! Check stellar.expert for transaction");
      
      // Reload campaign to get updated state
      await loadCampaign(currentCampaign.id);
      
      // Show success message
      alert(`Successfully pledged ${amount} XLM!`);
      
    } catch (error) {
      console.error("Pledge failed:", error);
      alert("Pledge failed: " + error.message);
    }
  };
}
```

---

### 3. Fix `CreatorDashboard.jsx` - Load Real Campaigns

**Current Code** (lines 35-37):
```javascript
// Load user's campaigns from localStorage (WRONG!)
const allCampaigns = JSON.parse(localStorage.getItem('stellarpledge_campaigns') || '[]');
const userCampaigns = allCampaigns.filter(c => c.creatorId === user.id);
```

**Should Be**:
```javascript
import { useCampaign } from '../context/CampaignContext';

const CreatorDashboard = () => {
  const { campaigns, loadAllCampaigns, getUserCreatedCampaigns, isLoading } = useCampaign();
  const [userCampaigns, setUserCampaigns] = useState([]);
  
  useEffect(() => {
    const loadData = async () => {
      // 🚀 LOAD FROM BLOCKCHAIN
      await loadAllCampaigns();
      
      // Filter user's campaigns
      const myCampaigns = getUserCreatedCampaigns();
      setUserCampaigns(myCampaigns);
      
      // Enhance with UI data from localStorage
      const uiData = JSON.parse(localStorage.getItem('stellarpledge_campaign_ui') || '{}');
      const enhanced = myCampaigns.map(campaign => ({
        ...campaign,
        title: uiData[campaign.id]?.title || 'Untitled Campaign',
        description: uiData[campaign.id]?.description || '',
        creatorName: uiData[campaign.id]?.creatorName || 'Anonymous'
      }));
      
      setUserCampaigns(enhanced);
    };
    
    loadData();
  }, []);
}
```

---

### 4. Fix "View Details" Button

The button should navigate with the campaign ID:

```javascript
const handleViewDetails = (campaignId) => {
  navigate(`/campaign/${campaignId}`);
};

// In render:
<Button onClick={() => handleViewDetails(campaign.id)}>
  View Details
</Button>
```

---

## 🎯 Critical Integration Points

### A. WalletService Must Sign Transactions

The `WalletService.signTransaction()` function needs to:
1. Get the user's secret key from encrypted storage
2. Decrypt it with their password
3. Sign the transaction with Stellar SDK
4. Return signed transaction

**Check file**: `frontend/src/services/WalletService.js`

### B. Contract Address Must Be Correct

**Current contract**: `CD4L4MPVSJ3RLAUYQ3ID2M75VWVVMDFBTESJIY4UULFFN33X2KNRTJXY`

Verify this is deployed and working on testnet.

### C. Native XLM Token Address

**Current**: `CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC`

This is the Stellar Asset Contract (SAC) address for native XLM on testnet.

---

## 🧪 Testing Flow

### Step 1: Alice Creates Campaign
1. Login as Alice
2. Create campaign:
   - Goal: 6,000 XLM
   - Duration: 30 days
   - Perk threshold: 3,000 XLM
3. **Expected**: Transaction appears on [Alice's stellar.expert](https://stellar.expert/explorer/testnet/account/GDMT3KZ3Q4S5YKPBCI7BGJB5H3ST7GF2IFRJVU34WEIE5UX5NZTW5FTF)
4. **Campaign ID returned**: e.g., `0` (first campaign)

### Step 2: Bob Pledges (Below Threshold)
1. Login as Bob
2. Browse campaigns, find Alice's
3. Pledge 2,000 XLM
4. **Expected**:
   - Transaction on [Bob's stellar.expert](https://stellar.expert/explorer/testnet/account/GAY4ASCS7CPNVH4OVSRO75V7NDRP4DDAF22V5SR3DLPP2WKI2Y3FRVNA)
   - 2,000 XLM transferred to contract
   - NO perk token (below 3,000 threshold)
   - Campaign shows: 2,000 / 6,000 XLM (33%)

### Step 3: Charlie Pledges (Above Threshold!)
1. Login as Charlie
2. Find Alice's campaign
3. Pledge 4,000 XLM
4. **Expected**:
   - Transaction on [Charlie's stellar.expert](https://stellar.expert/explorer/testnet/account/GDQUP4JVL64U6GSPR6GN2T2UQG4JBYCCYH7B6XYCHBTHO5DLMY5H4PLB)
   - 🎉 **TWO OPERATIONS in ONE transaction**:
     1. 4,000 XLM → Contract
     2. Perk tokens → Charlie (automatic!)
   - Campaign shows: 6,000 / 6,000 XLM (100%)
   - Status changes to "Successful"

### Step 4: Alice Claims Funds
1. Login as Alice
2. View campaign details
3. Click "Claim Funds"
4. **Expected**:
   - Transaction on Alice's stellar.expert
   - 6,000 XLM transferred from contract to Alice
   - Campaign status remains "Successful"

---

## 🔍 Debugging Tips

### Check Console Logs
The Soroban.js module has extensive logging:
- `📡 Simulating create_campaign...`
- `✍️  Signing create_campaign...`
- `🚀 Submitting create_campaign...`
- `⏳ Waiting for create_campaign confirmation...`
- `✅ create_campaign successful!`

### Check stellar.expert
Every transaction should be visible:
1. Go to account page (e.g., Alice's)
2. Click "History" tab
3. Look for:
   - Contract invocations (`invoke`)
   - Payments (`payment`)
   - Cross-contract calls (multiple operations)

### Check Browser DevTools
1. Open Network tab
2. Filter by "soroban-testnet.stellar.org"
3. Check for RPC calls:
   - `getAccount`
   - `prepareTransaction`
   - `sendTransaction`
   - `getTransaction`

---

## 🚀 Implementation Priority

1. **HIGH**: Fix `CreateCampaign.jsx` to call smart contract
2. **HIGH**: Fix `CampaignDetail.jsx` pledge function
3. **MEDIUM**: Fix dashboard to load from blockchain
4. **MEDIUM**: Fix "View Details" navigation
5. **LOW**: Add better error handling and loading states

---

## 📦 Files to Modify

1. `/frontend/src/pages/CreateCampaign.jsx` - Lines 84-92 (handleSubmit)
2. `/frontend/src/pages/CampaignDetail.jsx` - Pledge button handler
3. `/frontend/src/pages/CreatorDashboard.jsx` - Lines 35-37 (loadUserData)
4. `/frontend/src/pages/FunderDashboard.jsx` - Similar to CreatorDashboard
5. `/frontend/src/constants/constants.js` - ✅ Already updated with correct accounts

---

## ✅ Expected Result

After these fixes:
- ✅ Campaigns created → Appear on stellar.expert immediately
- ✅ Pledges made → Transaction visible on blockchain
- ✅ Campaign status → Reflects real blockchain state
- ✅ "View Details" → Works with real campaign data
- ✅ Perk distribution → Automatic when threshold met
- ✅ Dashboard stats → Show actual blockchain data

---

**Ready to implement? Start with CreateCampaign.jsx and work through the list!** 🚀
