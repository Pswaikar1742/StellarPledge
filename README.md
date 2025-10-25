# ⭐ StellarPledge - Decentralized Crowdfunding on Stellar

A fully functional, trustless crowdfunding platform built on the Stellar blockchain using Soroban smart contracts.

**Built for Stellar Build-a-thon**

## 🎯 Project Overview

StellarPledge is a decentralized alternative to traditional crowdfunding platforms. All funds are managed by a Soroban smart contract, eliminating the need for intermediaries.

### Core Features
- **Create Campaigns:** Set funding goals and deadlines
- **Pledge Funds:** Back campaigns with XLM
- **Automatic Execution:** 
  - If goal is met → Creator can claim funds
  - If goal fails → Backers get automatic refunds

## 🏗️ Technology Stack

- **Blockchain:** Stellar Testnet
- **Smart Contract:** Soroban (Rust)
- **Frontend:** Vanilla HTML, CSS, JavaScript
- **SDK:** Stellar SDK for JavaScript

## 📁 Project Structure

```
StellarPledge/
├── smart-contract/          # Soroban smart contract
│   ├── Cargo.toml
│   └── src/
│       └── lib.rs
│
└── frontend/                # Web interface
    ├── index.html
    ├── style.css
    ├── app.js
    └── package.json
```

## 🚀 Quick Start Guide

### Prerequisites

- Node.js and npm installed
- A web browser

### Step 1: Clone the Repository

```bash
git clone https://github.com/Pswaikar1742/StellarPledge.git
cd StellarPledge
```

### Step 2: Install Frontend Dependencies

```bash
cd frontend
npm install
```

### Step 3: Start the Local Server

```bash
npx http-server -p 3000
```

The application will be available at: **http://127.0.0.1:3000**

### Step 4: Open in Browser

Open your web browser and navigate to: **http://127.0.0.1:3000**

## 🎮 Complete Demo Walkthrough

### Part 1: Setup Your Testnet Account

1. **Generate a Testnet Account:**
   - Go to: https://laboratory.stellar.org/#account-creator?network=test
   - Click **"Generate keypair"**
   - Click **"Fund account with Friendbot"** (gives you 10,000 XLM testnet tokens)
   - **SAVE YOUR SECRET KEY** (starts with `S...`)

2. **Create a Second Account (for testing as a backer):**
   - Repeat the process above
   - You'll need at least 2 accounts to demonstrate the full flow

### Part 2: Connect Your Wallet

1. In the StellarPledge app, find the "Connect Your Wallet" section
2. Paste your **Secret Key** (starts with `S...`)
3. Click **"Connect Wallet"**
4. You should see:
   - Your public address (starts with `G...`)
   - Your balance (should show ~10,000 XLM)

### Part 3: Create a Campaign (as Creator)

1. Scroll to **"Create a Campaign"** section
2. Enter details:
   - **Funding Goal:** `100` (XLM)
   - **Deadline:** `1` (hours from now)
3. Click **"Create Campaign"**
4. Wait for the transaction to complete (~5 seconds)
5. The campaign will appear in the "Active Campaigns" list

### Part 4: Pledge to a Campaign (as Backer)

1. **Disconnect** your current wallet
2. **Connect** with your second testnet account (the backer)
3. Click **"Refresh Campaigns"** to see all campaigns
4. Click on the campaign card you just created
5. In the campaign detail view:
   - Enter pledge amount: `50` (XLM)
   - Click **"Pledge Now"**
6. Transaction will process and update the campaign progress

### Part 5: Demonstrate Success Flow

1. Pledge more funds to reach the goal (100 XLM total)
2. Once the goal is reached, the campaign state changes to "Successful"
3. **Disconnect** and reconnect as the **creator**
4. View the campaign details
5. Click **"Claim Funds"**
6. The creator receives all pledged funds!

### Part 6: Demonstrate Failure Flow

1. Create another campaign with a **short deadline** (e.g., 0.01 hours = 36 seconds)
2. Have the backer pledge some amount (but NOT enough to reach the goal)
3. Wait for the deadline to pass
4. The campaign state changes to "Failed"
5. As the **backer**, click **"Withdraw Refund"**
6. The backer gets their money back!

## 🔗 Deployed Smart Contract

- **Network:** Stellar Testnet
- **Contract Address:** `CBBHYAHLF4FJWFMIX4ZZTGVWVL3M452TI4REVYJ64U6WGOKR2VFWOBO7`
- **Explorer:** [View on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CBBHYAHLF4FJWFMIX4ZZTGVWVL3M452TI4REVYJ64U6WGOKR2VFWOBO7)

## 📋 Smart Contract Functions

1. **create_campaign** - Create a new crowdfunding campaign
2. **pledge** - Make a pledge to an active campaign
3. **claim_funds** - Creator claims funds from successful campaign
4. **withdraw_refund** - Backer withdraws refund from failed campaign
5. **get_campaign** - Retrieve campaign details

## 🛠️ Development

### Building the Smart Contract

```bash
cd smart-contract
soroban contract build
```

### Deploying to Testnet

```bash
# Generate and fund an account
soroban keys generate deployer --network testnet
soroban keys fund deployer --network testnet

# Deploy the contract
soroban contract deploy \
  --wasm target/wasm32v1-none/release/stellar_pledge_contract.wasm \
  --source deployer \
  --network testnet
```

## 🎥 5-Minute Hackathon Demo Script

### Minute 1: Introduction
- "StellarPledge is a trustless crowdfunding platform on Stellar"
- "No middleman, no fees - the smart contract is the escrow"

### Minute 2: Show the Tech
- Open the app, show the clean UI
- Connect wallet (have this ready beforehand)
- Point out: "Pure vanilla JavaScript, no frameworks"

### Minute 3: Create Campaign
- Create a campaign with 100 XLM goal
- "The contract stores all data on-chain"

### Minute 4: The Happy Path
- Switch to backer account
- Make a pledge
- Show the progress bar updating in real-time
- Complete the funding
- Switch back to creator
- Claim the funds
- "Fully automated by the smart contract"

### Minute 5: The Safety Net
- Show a failed campaign
- Withdraw refund as backer
- "If goals aren't met, everyone gets their money back automatically"

## 🔐 Security Note

⚠️ **This is a testnet demonstration project!** 

For production:
- Never expose secret keys in the browser
- Implement proper wallet integration (Freighter, etc.)
- Add comprehensive testing
- Conduct security audits

## 👥 Team

Built during the Stellar Build-a-thon!

---

**Happy Pledging! ⭐**
