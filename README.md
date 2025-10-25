# StellarPledge: The Automated Creator Economy Protocol

**A decentralized crowdfunding platform on the Stellar network with standalone wallet, automated perk distribution, and zero Freighter dependency.**

Built for the Stellar Build-a-thon 🚀

---

## 🎯 What's New: Standalone Wallet System

**No Freighter Required!** StellarPledge now includes a fully integrated wallet system:

- **🆕 Create New Wallet** - Generate Stellar keypair directly in-app
- **📥 Import Existing Wallet** - Use your secret key (S...)
- **👁️ Connect Read-Only** - View campaigns with just public key (G...)
- **🔒 Secure Encryption** - Password-protected local storage
- **💼 Complete Control** - Manage everything without browser extensions

**[Read Standalone Wallet Documentation →](./docs/STANDALONE-WALLET.md)**

---

## 🚀 The Problem

Traditional crowdfunding platforms are centralized, slow, and expensive. They take significant fees and act as a trusted middleman, creating a barrier between creators and their communities. Reward distribution is manual, error-prone, and can take months.

---

## ✨ Our Solution: StellarPledge

StellarPledge is a **trustless, open-source protocol** that leverages Soroban smart contracts to act as an automated escrow. By integrating Stellar's native asset issuance, we've transformed crowdfunding into an **automated creator economy**.

### 🎁 Core Innovation: Automated On-Chain Perks

When a backer pledges enough to meet the perk threshold, the smart contract **automatically** triggers a cross-contract call to transfer reward tokens (any Stellar Classic Asset) to the backer - all in one atomic transaction!

**Example:**
```
Alice creates campaign: 10,000 XLM goal, 500 XLM perk threshold → 1 FILMCREDIT token reward
Bob pledges 100 XLM → No perk (below threshold)
Charlie pledges 500 XLM → 🎉 INSTANT: Gets 1 FILMCREDIT automatically!
```

**Result:** Two operations in ONE transaction:
1. 500 XLM → Campaign escrow
2. 1 FILMCREDIT → Charlie's wallet (automatic!)

---

## 🏆 Key Features

### Decentralized Escrow
All funds are held securely on-chain in the Soroban smart contract. No intermediaries, no platform control.

### Instantaneous Settlements
Payouts and refunds are processed in ~5 seconds via Stellar's fast consensus.

### Micro-Pledge Capable
Near-zero fees on the Stellar network enable community micro-funding. Support creators with any amount.

### Automated On-Chain Perks
**Our core innovation!** Smart contract automatically rewards backers with custom asset tokens (collectibles, access tokens, NFTs) when they meet pledge thresholds.

### Three Perk Modes
- **Automatic:** Smart contract handles distribution (recommended)
- **Manual:** Creator distributes rewards later
- **No Perks:** Simple crowdfunding only

### Transparent & Trustless
- Every transaction viewable on Stellar Expert
- Open-source smart contract code
- No platform fees
- Provable on-chain ownership

---

## 🛠️ Technology Stack

- **Blockchain:** Stellar Testnet (Soroban)
- **Smart Contract:** Rust + Soroban SDK 20.5.0
- **Frontend:** React 19.2.0 + TailwindCSS 3.4.18
- **Wallet Integration:** Freighter API 2.0.0
- **SDK:** Stellar SDK 11.3.0

### Smart Contract Architecture

```rust
// Automated perk distribution logic
if let Some(perk) = &campaign.perk {
    if total_backer_pledge >= perk.threshold {
        // Cross-contract call to Stellar Asset Contract
        let perk_token_client = token::Client::new(&env, &perk.asset_address);
        perk_token_client.transfer(&campaign.creator, &backer, &perk.amount);
        log!("✅ Perk transferred automatically!");
    }
}
```

**Key Innovation:** Cross-contract calls enable automatic token transfers without manual intervention.

---

## 🎬 Live Demo

**Deployed Smart Contract:**
- Network: Stellar Testnet
- Address: `CD4L4MPVSJ3RLAUYQ3ID2M75VWVVMDFBTESJIY4UULFFN33X2KNRTJXY`
- Explorer: [View on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CD4L4MPVSJ3RLAUYQ3ID2M75VWVVMDFBTESJIY4UULFFN33X2KNRTJXY)

**Frontend Application:**
- URL: `https://localhost:3001` (local dev)
- Status: Backend 100% complete, UI in development

### Demo Flow (5 Minutes)

1. **Alice (Creator)** creates campaign: 10,000 XLM goal, 500 XLM perk threshold
2. **Bob (Student)** pledges 100 XLM → No perk (below threshold)
3. **Charlie (Investor)** pledges 500 XLM → 🎉 **Automatic FILMCREDIT transfer!**
4. View on Stellar Expert: Two operations in one transaction
5. Alice claims 600 XLM when goal met

**Wow Factor:** Live cross-contract call with on-chain proof!

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16+) and npm
- **Freighter Wallet** browser extension ([Install here](https://www.freighter.app/))
- Stellar testnet account with XLM ([Get from Friendbot](https://laboratory.stellar.org/#account-creator?network=test))

### Installation

```bash
# Clone the repository
git clone https://github.com/Pswaikar1742/StellarPledge.git
cd StellarPledge

# Install frontend dependencies
cd frontend
npm install

# Start the development server (HTTPS required for Freighter)
npm start
```

The application will open at: **https://localhost:3001**

### Build Smart Contract

```bash
cd smart-contract
cargo build --target wasm32-unknown-unknown --release

# Optimize (optional)
soroban contract optimize --wasm target/wasm32-unknown-unknown/release/stellar_pledge_contract.wasm
```

---

## 📋 Project Structure

```
StellarPledge/
├── README.md                    # This file
├── docs/                        # Complete documentation
│   ├── COMPLETE-WORKFLOW.md     # Step-by-step user journeys
│   ├── IMPLEMENTATION-SUMMARY.md # Technical implementation details
│   ├── PROJECT-STATUS.md        # Current status & roadmap
│   └── QUICK-REFERENCE.md       # Quick start guide
├── demo-accounts/               # Demo account details
│   ├── Alice.txt                # Creator account
│   ├── Bob.txt                  # Small backer
│   └── Charlie.txt              # High backer
├── smart-contract/              # Soroban smart contract
│   ├── Cargo.toml
│   └── src/
│       └── lib.rs               # Automated perk distribution logic
└── frontend/                    # React application
    ├── src/
    │   ├── components/          # UI components
    │   ├── context/             # State management
    │   ├── hooks/               # Custom React hooks
    │   ├── utils/               # Error handling, validation
    │   └── constants/           # Configuration
    ├── INTEGRATION-GUIDE.md     # Frontend API documentation
    └── package.json
```

---

## 🎮 How It Works

### For Creators

### For Creators

**Setup (One-Time)**
1. Install Freighter wallet → Switch to Testnet
2. Create your custom perk token (e.g., FILMCREDIT)
3. Deploy asset contract to Stellar

**Launch Campaign**
1. Visit StellarPledge → Connect wallet
2. Click "Create Campaign"
3. Set goal, deadline, and optional perk threshold
4. Choose perk mode: Automatic, Manual, or None
5. Approve transaction → Campaign goes live!

**Outcome**
- ✅ **Success:** Claim all funds when goal met
- ❌ **Failed:** Backers get automatic refunds

### For Backers

**Browse & Pledge**
1. Install Freighter → Switch to Testnet
2. Browse active campaigns
3. Select campaign → Enter pledge amount
4. See perk preview if you qualify
5. Approve transaction → Done!

**Automated Perks**
- Pledge ≥ threshold → Get perk token instantly
- All in one atomic transaction
- On-chain proof of ownership

**Refunds**
- Campaign fails → Withdraw refund button appears
- One click → Instant refund
- No manual process required

---

## 🎯 Use Cases

### 🎬 Film Production
Campaign: Fund indie film  
Perk: Early screening ticket NFT at 1000 XLM

### 🎵 Music Albums
Campaign: Record new album  
Perk: Exclusive track token at 500 XLM

### 🎮 Game Development
Campaign: Build indie game  
Perk: In-game currency at 2000 XLM

### 📚 Book Publishing
Campaign: Publish novel  
Perk: Signed digital copy at 200 XLM

---

## 🔐 Security Features

- ✅ **Smart Contract Escrow** - Funds locked until goal met
- ✅ **Freighter Integration** - No private keys in browser
- ✅ **Transaction Simulation** - Preview before signing
- ✅ **Automatic Refunds** - Failed campaigns return funds
- ✅ **TESTNET Enforcement** - Demo safety guaranteed
- ✅ **Comprehensive Error Handling** - 15+ scenarios covered

⚠️ **Note:** This is a testnet demonstration. Production deployment requires security audit.

---

## 📊 Project Status

```
✅ Smart Contract:     100% Complete (Deployed)
✅ Backend Logic:      100% Complete
✅ Wallet Integration: 100% Complete
✅ Error Handling:     100% Complete
✅ Documentation:      100% Complete (60KB+)
⏳ UI Components:      In Development
⏳ Demo Testing:       Pending asset creation
```

**Current Phase:** Backend complete, UI implementation in progress

---

## 📚 Documentation

All comprehensive documentation is in the `/docs` folder:

- **[COMPLETE-WORKFLOW.md](docs/COMPLETE-WORKFLOW.md)** - Step-by-step user journeys for Alice, Bob, and Charlie
- **[IMPLEMENTATION-SUMMARY.md](docs/IMPLEMENTATION-SUMMARY.md)** - Technical implementation details and testing
- **[PROJECT-STATUS.md](docs/PROJECT-STATUS.md)** - Current status, metrics, and roadmap
- **[QUICK-REFERENCE.md](docs/QUICK-REFERENCE.md)** - Quick commands and links

**Frontend Integration:**
- **[frontend/INTEGRATION-GUIDE.md](frontend/INTEGRATION-GUIDE.md)** - Complete API documentation for developers

---

## 🤝 Contributing

Built for the **Stellar Build-a-thon**!

Want to contribute?
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🔗 Links

- **Repository:** [GitHub - StellarPledge](https://github.com/Pswaikar1742/StellarPledge)
- **Smart Contract:** [View on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CD4L4MPVSJ3RLAUYQ3ID2M75VWVVMDFBTESJIY4UULFFN33X2KNRTJXY)
- **Stellar Documentation:** [Soroban Docs](https://soroban.stellar.org/)
- **Freighter Wallet:** [freighter.app](https://www.freighter.app/)

---

## 👥 Team

Passionate blockchain developers building the future of creator economy on Stellar!

---

**🌟 StellarPledge: Where Creators Meet Their Community On-Chain 🌟**

*Last Updated: October 25, 2025*

1. **Install Freighter Wallet:**
   - Add the [Freighter extension](https://www.freighter.app/) to your browser
   - Create or import a wallet
   - Switch to **Testnet** network in Freighter settings

2. **Fund Your Account:**
   - Go to [Stellar Laboratory](https://laboratory.stellar.org/#account-creator?network=test)
   - Click "Generate keypair" → "Fund account with Friendbot"
   - You'll receive 10,000 XLM testnet tokens
   - Repeat for 2-3 accounts (Alice, Bob, Charlie)

### Demo: Automated Perk Distribution

#### Step 1: Create FILMCREDIT Asset (Alice)

```bash
# Create a custom Stellar asset for perk rewards
# Note: This will be integrated into the UI in production
```

#### Step 2: Alice Creates Campaign with Perk

1. Open **https://localhost:3001**
2. Click **"Connect Wallet"** → Approve in Freighter
3. Navigate to **"Create Campaign"**
4. Fill in:
   - **Goal:** 1000 XLM
   - **Deadline:** 24 hours
   - **Enable Perk:** ✅
   - **Perk Threshold:** 500 XLM
   - **Reward Token:** FILMCREDIT contract address
   - **Reward Amount:** 1 token
5. Click **"Create"** → Sign transaction in Freighter

#### Step 3: Bob Pledges (No Perk)

1. Disconnect Alice's wallet
2. Connect **Bob's wallet** via Freighter
3. Click on Alice's campaign
4. Pledge **100 XLM**
5. Sign transaction
6. **Result:** Campaign shows 100/1000 XLM (10% funded) - No perk transferred

#### Step 4: Charlie Pledges (Perk Triggered! 🎉)

1. Disconnect Bob's wallet
2. Connect **Charlie's wallet** via Freighter
3. Click on Alice's campaign
4. Pledge **500 XLM**
5. Sign transaction
6. **Magic Happens:** Two transfers in ONE transaction:
   - ✅ 500 XLM → Campaign escrow
   - ✅ 1 FILMCREDIT → Charlie (automatic!)

#### Step 5: Verify on Block Explorer

```
Visit: https://stellar.expert/explorer/testnet/tx/[TRANSACTION_HASH]

You'll see TWO operations:
1. XLM payment: Charlie → Contract
2. FILMCREDIT transfer: Alice → Charlie (automated by contract!)
```

#### Step 6: Alice Claims Funds

1. Campaign now shows 600/1000 XLM (60% funded, SUCCESSFUL)
2. Connect **Alice's wallet**
3. Click **"Claim Funds"**
4. Alice receives **600 XLM** (Bob's 100 + Charlie's 500)

---

## 🔗 Deployed Smart Contract

- **Network:** Stellar Testnet
- **Contract Address:** `CD4L4MPVSJ3RLAUYQ3ID2M75VWVVMDFBTESJIY4UULFFN33X2KNRTJXY`
- **Explorer:** [View on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CD4L4MPVSJ3RLAUYQ3ID2M75VWVVMDFBTESJIY4UULFFN33X2KNRTJXY)

---

## 📋 Smart Contract API

### Core Functions

```rust
// Create a new campaign with optional perk
create_campaign(
    creator: Address,
    goal: u128,
    deadline: u64,
    perk: Option<PerkConfig>  // NEW: Automated perk system
) -> u32

// Pledge to a campaign (automatic perk check)
pledge(
    campaign_id: u32,
    backer: Address,
    amount: u128
)

// Creator claims funds from successful campaign
claim_funds(campaign_id: u32, creator: Address)

// Backer withdraws refund from failed campaign
withdraw_refund(campaign_id: u32, backer: Address)

// Get campaign details
get_campaign(campaign_id: u32) -> Campaign
```

### PerkConfig Structure

```rust
pub struct PerkConfig {
    pub threshold: u128,        // Minimum pledge to qualify
    pub asset_address: Address, // Stellar Asset Contract address
    pub amount: i128,          // Reward amount (in stroops)
}
```

### Automated Perk Logic

```rust
// Inside pledge() function
if let Some(perk) = &campaign.perk {
    if total_backer_pledge >= perk.threshold {
        // Cross-contract call to Stellar Asset Contract
        let perk_token_client = token::Client::new(&env, &perk.asset_address);
        perk_token_client.transfer(&campaign.creator, &backer, &perk.amount);
        log!(&env, "✅ Perk transferred automatically!");
    }
}
```

---

## 🎨 Frontend Integration

### Custom React Hooks (Complete Backend API)

The frontend provides 10+ custom hooks for easy integration:

```javascript
// Wallet Management
const { publicKey, connectWallet, disconnectWallet } = useWallet();

// Campaign Operations
const { create, isCreating } = useCreateCampaign();
const { makePledge, isPledging } = usePledge();
const { handleClaimFunds } = useClaimFunds();

// Data Queries
const { campaigns, loading } = useCampaignList();
const { campaign } = useCampaignDetail(campaignId);
const { percentage, remaining } = useCampaignProgress(campaign);

// Perk Features
const { qualifies, perkInfo } = usePerkCheck(campaign, pledgeAmount);
const isCreator = useIsCreator(campaign);

// User Data
const { myCampaigns } = useMyCampaigns();
const { myPledges } = useMyPledges();
```

### Complete Documentation

See `/frontend/INTEGRATION-GUIDE.md` for:
- ✅ Complete hook documentation
- ✅ Data type definitions
- ✅ Code examples
- ✅ Error handling patterns
- ✅ Demo implementation guide

---

## 🛠️ Development

### Build Smart Contract

```bash
cd smart-contract
cargo build --target wasm32-unknown-unknown --release
soroban contract optimize --wasm target/wasm32-unknown-unknown/release/stellar_pledge_contract.wasm
```

### Deploy to Testnet

```bash
# Deploy contract
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/stellar_pledge_contract.wasm \
  --source-account <YOUR_SECRET_KEY> \
  --rpc-url https://soroban-testnet.stellar.org \
  --network-passphrase "Test SDF Network ; September 2015"
```

### Run Frontend Dev Server

```bash
cd frontend
npm start  # Starts HTTPS server on port 3001
```

---

## 🎯 Key Innovations

### 1. Automated Perk Distribution ⭐

**Traditional crowdfunding:** Creator manually sends rewards weeks/months later  
**StellarPledge:** Instant, automatic token transfer when threshold met

### 2. Cross-Contract Calls

Smart contract interacts with Stellar Asset Contract to transfer tokens:

```rust
let perk_token_client = token::Client::new(&env, &perk.asset_address);
perk_token_client.transfer(&creator, &backer, &amount);
```

### 3. Any Stellar Asset as Reward

- Movie premiere tickets (FILMCREDIT)
- Music album NFTs (ALBUM001)
- Game currency (GAMECOIN)
- Exclusive memberships (VIPPASS)

### 4. Production-Ready Architecture

- Clean separation: Smart contract ↔ Soroban.js ↔ React Contexts ↔ Custom Hooks
- Modular, testable, maintainable
- TypeScript-ready data structures
- Comprehensive error handling

---

## 🔐 Security Features

- ✅ **Freighter Wallet Integration** - No private keys in browser
- ✅ **Transaction Simulation** - Preview before signing
- ✅ **Smart Contract Escrow** - Funds locked until goal met
- ✅ **Automatic Refunds** - Failed campaigns return funds
- ✅ **Time-Based Logic** - Deadline enforcement on-chain
- ✅ **State Validation** - Prevent double-claims/withdrawals

⚠️ **Testnet Note:** This is a demonstration on Stellar Testnet. For production deployment, conduct thorough security audits.

---

## 📊 Project Status

```
✅ Smart Contract:     100% Complete (Deployed)
✅ Backend Logic:      100% Complete  
✅ Wallet Integration: 100% Complete (Freighter)
✅ State Management:   100% Complete (React Context)
✅ Custom Hooks:       100% Complete (10+ hooks)
✅ Documentation:      100% Complete
⏳ UI Components:      In Development
⏳ Asset Creation:     Manual (CLI) - UI integration planned
```

---

## 🎥 Hackathon Presentation

### 5-Minute Demo Script

**Minute 1:** Introduction
- "StellarPledge automates creator rewards using Stellar blockchain"
- Show the problem: Manual reward distribution is slow and error-prone

**Minute 2:** The Innovation
- Explain cross-contract calls to Stellar Asset Contract
- Show the code: Automatic perk transfer logic

**Minute 3:** Live Demo - Campaign Creation
- Alice creates campaign with 500 XLM perk threshold
- Show perk configuration UI

**Minute 4:** Live Demo - Automatic Perk
- Bob pledges 100 XLM (no perk)
- Charlie pledges 500 XLM (perk triggers!)
- Show block explorer: Two transfers in one transaction

**Minute 5:** Impact & Future
- Creator economy enabler: Musicians, filmmakers, game developers
- Any Stellar asset as reward
- Zero trust required - all automated on-chain

---

## 🌐 Use Cases

### 🎬 Film Production
- **Campaign:** Fund indie film with 5000 XLM goal
- **Perk:** Early screening ticket NFT at 1000 XLM pledge

### 🎵 Music Album
- **Campaign:** Record album with 2000 XLM goal
- **Perk:** Exclusive track token at 500 XLM pledge

### 🎮 Game Development
- **Campaign:** Build game with 10000 XLM goal
- **Perk:** In-game currency at 2000 XLM pledge

### 📚 Book Publishing
- **Campaign:** Publish book with 1000 XLM goal
- **Perk:** Signed digital copy at 200 XLM pledge

---

## 👥 Contributing

Built for the **Stellar Build-a-thon** by passionate blockchain developers!

Want to contribute?
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🔗 Links

- **Repository:** [GitHub - StellarPledge](https://github.com/Pswaikar1742/StellarPledge)
- **Smart Contract Explorer:** [View on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CD4L4MPVSJ3RLAUYQ3ID2M75VWVVMDFBTESJIY4UULFFN33X2KNRTJXY)
- **Stellar Documentation:** [Soroban Docs](https://soroban.stellar.org/)
- **Freighter Wallet:** [freighter.app](https://www.freighter.app/)

---

**🌟 Building the Future of Creator Economy on Stellar 🌟**

*Last Updated: October 25, 2025*

