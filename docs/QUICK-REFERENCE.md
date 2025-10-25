# 🚀 StellarPledge - Quick Reference

## 📂 Project Overview
**StellarPledge** - Automated creator economy platform with on-chain perks powered by Stellar blockchain.

---

## 📖 Documentation (1000+ lines)

### Start Here
1. **`README.md`** (454 lines) - Complete project guide
   - Quick start
   - Demo flow
   - Smart contract API
   - Development guides

2. **`PROJECT-STATUS.md`** (291 lines) - Current status
   - What's complete
   - What's pending
   - Next steps
   - Metrics

3. **`CONSOLIDATION-SUMMARY.md`** (295 lines) - Cleanup details
   - What changed
   - What was deleted
   - Verification steps

4. **`frontend/INTEGRATION-GUIDE.md`** - UI developer API
   - All React hooks
   - Code examples
   - Data types

---

## 🎯 Quick Commands

### Start Development
```bash
cd frontend
npm install
npm start  # Opens https://localhost:3001
```

### Build Smart Contract
```bash
cd smart-contract
cargo build --target wasm32-unknown-unknown --release
```

### Deploy Contract
```bash
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/stellar_pledge_contract.wasm \
  --source-account <SECRET_KEY> \
  --rpc-url https://soroban-testnet.stellar.org \
  --network-passphrase "Test SDF Network ; September 2015"
```

---

## 🔗 Key Links

### Deployed Contract
- **Address:** `CD4L4MPVSJ3RLAUYQ3ID2M75VWVVMDFBTESJIY4UULFFN33X2KNRTJXY`
- **Explorer:** https://stellar.expert/explorer/testnet/contract/CD4L4MPVSJ3RLAUYQ3ID2M75VWVVMDFBTESJIY4UULFFN33X2KNRTJXY

### Local Dev
- **Frontend:** https://localhost:3001
- **Network:** Stellar Testnet

### Resources
- **Stellar Docs:** https://soroban.stellar.org/
- **Freighter Wallet:** https://www.freighter.app/
- **Stellar Lab:** https://laboratory.stellar.org/

---

## 📊 Project Status

```
✅ Smart Contract:     100% Complete (Deployed)
✅ Backend Logic:      100% Complete  
✅ Wallet Integration: 100% Complete (Freighter)
✅ State Management:   100% Complete (React Context)
✅ Custom Hooks:       100% Complete (10+ hooks)
✅ Documentation:      100% Complete (1000+ lines)
⏳ UI Components:      Awaiting Frontend Developer
⏳ Asset Creation:     Manual CLI step required
⏳ Demo Testing:       Blocked by UI & asset
```

---

## 🎨 For Frontend Developers

### Available Hooks
```javascript
// Wallet
useWallet()

// Campaign Operations  
useCreateCampaign()
usePledge()
useClaimFunds()

// Data Queries
useCampaignList()
useCampaignDetail(id)
useCampaignProgress(campaign)
useCampaignDeadline(campaign)

// Perk Features
usePerkCheck(campaign, amount)

// User Data
useIsCreator(campaign)
useMyCampaigns()
useMyPledges()
```

### Example Usage
```javascript
import { useWallet } from './context/WalletContext';
import { useCreateCampaign } from './hooks/useCampaignHooks';

function CreateForm() {
  const { publicKey } = useWallet();
  const { create, isCreating } = useCreateCampaign();
  
  const handleSubmit = async () => {
    const perk = {
      threshold: 500,
      assetAddress: 'FILMCREDIT_CONTRACT_ADDRESS',
      amount: 1000000
    };
    
    await create(1000, 24, perk);
  };
  
  return <button onClick={handleSubmit}>Create Campaign</button>;
}
```

**Full API:** See `/frontend/INTEGRATION-GUIDE.md`

---

## 🎬 Demo Flow (5 Minutes)

### 1. Setup (1 min)
- Install Freighter wallet extension
- Create 3 testnet accounts: Alice, Bob, Charlie
- Fund with Friendbot (10,000 XLM each)

### 2. Create Asset (1 min)
```bash
# Create FILMCREDIT token
stellar asset create --code FILMCREDIT --issuer <ALICE_KEY>
```

### 3. Create Campaign (1 min)
- Alice creates: 1000 XLM goal, 500 XLM perk threshold, 1 FILMCREDIT reward

### 4. Pledges (1 min)
- Bob pledges 100 XLM → No perk
- Charlie pledges 500 XLM → 🎉 Automatic FILMCREDIT transfer!

### 5. Verify & Claim (1 min)
- Check stellar.expert: Two operations in one transaction
- Alice claims 600 XLM

---

## 🏆 Key Innovation

### Automated On-Chain Perks
Traditional crowdfunding: Creator manually sends rewards weeks later  
**StellarPledge:** Instant, automatic token transfer via cross-contract call

```rust
// Smart contract automatically checks threshold
if total_backer_pledge >= perk.threshold {
    // Cross-contract call to Stellar Asset Contract
    perk_token_client.transfer(&creator, &backer, &amount);
    log!("🎉 Perk transferred automatically!");
}
```

---

## 📁 File Structure

```
StellarPledge/
├── README.md                       # 📖 Main documentation (454 lines)
├── PROJECT-STATUS.md               # 📊 Current status (291 lines)
├── CONSOLIDATION-SUMMARY.md        # 🔄 Cleanup details (295 lines)
├── QUICK-REFERENCE.md              # ⚡ This file
│
├── smart-contract/                 # Soroban contract
│   └── src/lib.rs                 # Automated perk logic
│
└── frontend/                       # React app
    ├── src/
    │   ├── components/
    │   │   ├── Soroban/           # Contract interaction
    │   │   └── Shared/            # Wallet abstraction
    │   ├── context/               # State management
    │   ├── hooks/                 # Custom hooks
    │   └── constants/             # Configuration
    └── INTEGRATION-GUIDE.md        # 🎨 UI developer API
```

---

## ✅ Cleanup Complete

All old versions removed:
- ❌ frontend-old/ deleted
- ❌ Ref/ deleted
- ❌ 9 duplicate .md files consolidated
- ✅ All "2.0" references removed
- ✅ Professional v1.0.0 naming

---

## 🚀 Next Steps

1. **UI Developer:** Read `INTEGRATION-GUIDE.md` → Build components
2. **Demo Prep:** Create FILMCREDIT asset → Test flow
3. **Presentation:** Use README.md demo script

---

**🌟 Ready to revolutionize creator economy on Stellar! 🌟**

*For complete details, see README.md*
