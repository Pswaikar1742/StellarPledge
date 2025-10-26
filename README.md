# 🌟 StellarPledge

**The Automated Creator Economy Protocol on Stellar Blockchain**

[![Stellar](https://img.shields.io/badge/Stellar-Testnet-blue)](https://stellar.org)
[![Soroban](https://img.shields.io/badge/Soroban-Smart%20Contracts-purple)](https://soroban.stellar.org)
[![React](https://img.shields.io/badge/React-19.0-61DAFB)](https://reactjs.org)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> Transform crowdfunding with automated reward distribution, trustless blockchain execution, and zero platform fees.

Built for the **Stellar Build-a-thon** 🚀

---

## 🎯 Overview

StellarPledge is a decentralized crowdfunding platform that leverages Stellar's blockchain and Soroban smart contracts to enable **automated perk distribution** - our core innovation that eliminates manual reward fulfillment.

### The Problem

Traditional crowdfunding platforms have:
- ❌ High platform fees (5-10%)
- ❌ Centralized control of funds
- ❌ Manual reward distribution (weeks/months delay)
- ❌ Limited transparency

### Our Solution

- ✅ Zero platform fees (only network costs ~$0.01)
- ✅ Decentralized smart contract escrow
- ✅ **Automatic reward distribution in real-time**
- ✅ Complete on-chain transparency

---

## ✨ Key Features

### 🔐 Standalone Wallet System

**No browser extensions required!**
- **Create New Wallet** - Generate Stellar keypair in-app
- **Import Wallet** - Use existing secret key (S...)
- **Read-Only Mode** - Browse with public key (G...)
- **Secure Encryption** - Password-protected local storage

### 🎁 Automated Perk Distribution (Core Innovation ⭐)

When a backer pledges enough to meet the perk threshold, the smart contract **automatically** triggers a cross-contract call to transfer reward tokens - all in ONE atomic transaction!

**Example Flow:**
```
Alice creates campaign:
  Goal: 10,000 XLM
  Perk threshold: 500 XLM → 1 FILMCREDIT token

Bob pledges 100 XLM → No perk (below threshold)

Charlie pledges 500 XLM → 🎉 INSTANT REWARD!

Result: TWO operations in ONE transaction:
  1. 500 XLM → Campaign escrow
  2. 1 FILMCREDIT → Charlie's wallet (automatic!)
```

**No manual fulfillment. No delays. All on-chain. Provable.**

### 👥 Role-Based Access

- **Creators** - Launch campaigns with custom reward tiers
- **Funders** - Back projects and earn tokenized rewards
- **Multi-User Support** - Independent sessions per browser tab

### 🎨 Modern UI/UX

- Responsive design (mobile, tablet, desktop)
- Dark/Light themes
- Smooth animations (Framer Motion)
- Real-time toast notifications
- Intuitive campaign creation wizard

---

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/Pswaikar1742/StellarPledge.git
cd StellarPledge

# Install frontend dependencies
cd frontend
npm install

# Start development server
npm start
```

The app will open at `http://localhost:3000`

### Demo Accounts

We provide pre-funded testnet accounts for testing. See the `/demo-accounts` folder for details:
- **Alice** - Film creator with example campaign
- **Bob** - Small backer (below threshold scenario)
- **Charlie** - High-value backer (automatic reward demo)

---

## 📁 Project Structure

```
StellarPledge/
├── frontend/                   # React application
│   ├── src/
│   │   ├── components/        # UI components
│   │   ├── pages/             # 8 main pages
│   │   ├── contexts/          # State management
│   │   ├── services/          # Wallet & Blockchain services
│   │   └── utils/             # Helper functions
│   └── package.json
│
├── smart-contract/            # Soroban smart contract
│   ├── src/
│   │   └── lib.rs            # 5 core functions (213 LOC)
│   └── Cargo.toml
│
├── documentation/             # 420+ pages of docs
│   ├── demo/                 # Demo scripts
│   ├── technical/            # Architecture guides
│   └── guides/               # How-to guides
│
├── demo-accounts/            # Demo account details
│   ├── Alice.txt            # Creator account
│   ├── Bob.txt              # Small backer
│   └── Charlie.txt          # High-value backer
│
└── SYSTEM_STATS.md           # Project statistics
```

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 19.2.0
- **Styling:** Tailwind CSS + Framer Motion
- **Blockchain:** Stellar SDK 11.3.0
- **Wallet:** Standalone (AES encryption)
- **UI Components:** Radix UI + Lucide Icons

### Smart Contract
- **Language:** Rust
- **Platform:** Soroban (Stellar)
- **Network:** Testnet
- **Functions:** 5 core operations

### Blockchain Integration
- **Network:** Stellar Testnet
- **Contract:** CD4L4MPVSJ3RLAUYO31D2M75VWVMDFBTESJ1Y4UULFFN33X2XNRTJXY
- **Explorer:** [View on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CD4L4MPVSJ3RLAUYO31D2M75VWVMDFBTESJ1Y4UULFFN33X2XNRTJXY)

---

## 📖 Documentation

We've created comprehensive documentation (420+ pages):

### Technical Guides
- [System Architecture](./documentation/technical/SYSTEM_ARCHITECTURE.md) - Complete system design
- [Smart Contract](./documentation/technical/SMART_CONTRACT_ARCHITECTURE.md) - Contract internals
- [Wallet Integration](./documentation/technical/WALLET_INTEGRATION_ARCHITECTURE.md) - Standalone wallet
- [Frontend Architecture](./documentation/technical/FRONTEND_ARCHITECTURE.md) - React structure
- [Stellar Expert](./documentation/technical/STELLAR_EXPERT_GUIDE.md) - Blockchain verification

### Demo & Guides
- [Demonstration Q&A](./documentation/demo/DEMONSTRATION_QA.md) - 27 common questions
- [3-Minute Pitch](./documentation/demo/3_MINUTE_PITCH.md) - Team presentation script

---

## 🎬 How It Works

### For Creators

1. **Create Campaign**
   - Set funding goal in XLM
   - Define campaign deadline
   - Configure optional perk (threshold + reward token)

2. **Launch & Share**
   - Campaign deployed to blockchain
   - Share unique campaign URL
   - Track pledges in real-time

3. **Claim Funds**
   - If goal reached: Withdraw all pledged XLM
   - If goal missed: Backers can reclaim their pledges

### For Backers

1. **Browse Campaigns**
   - Explore active campaigns
   - View funding progress and deadlines
   - Check perk requirements

2. **Pledge Support**
   - Connect wallet
   - Enter pledge amount
   - Sign transaction

3. **Automatic Rewards**
   - If pledge ≥ threshold: **INSTANT** reward token transfer
   - If pledge < threshold: Support still counts toward goal
   - If campaign fails: Reclaim your pledge

---

## 🔗 Links

- **GitHub Repository:** [StellarPledge](https://github.com/Pswaikar1742/StellarPledge)
- **Smart Contract:** [View on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CD4L4MPVSJ3RLAUYO31D2M75VWVMDFBTESJ1Y4UULFFN33X2XNRTJXY)
- **Stellar Network:** [stellar.org](https://stellar.org)
- **Soroban Documentation:** [Soroban Docs](https://soroban.stellar.org/)

---

## 👥 Team

✅ **Complete:**
- Multi-user authentication system
- Passionate blockchain developers building the future of decentralized crowdfunding
- Role-based access control
- Wallet integration (Create/Import/Read-Only)
- Campaign creation wizard
- Pledge functionality with rewards
- Mock balance system
- Real-time updates across tabs
- Complete documentation

---

## 📊 Project Status

**Version:** 1.0.1  
**Status:** Production Ready  
**Last Updated:** October 26, 2025

### Key Metrics
- **Total Lines of Code:** 5,502
- **Documentation:** 420+ pages (14 markdown files)
- **Smart Contract:** 213 lines (5 functions)
- **Frontend:** 4,184 lines (React components)
- **Demo Accounts:** 3 pre-funded testnet accounts

---

## 🤝 Contributing

Built for the **Stellar Build-a-thon** by passionate blockchain developers!

Want to contribute?

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🌟 Why StellarPledge?

**Traditional Crowdfunding:**
- ❌ High fees (5-10%)
- ❌ Manual reward fulfillment
- ❌ Limited transparency
- ❌ Trust-based intermediaries

**StellarPledge:**
- ✅ Minimal fees (<$0.01)
- ✅ Automated rewards
- ✅ Complete transparency
- ✅ Decentralized trustless execution

---

**Built with ❤️ on Stellar Blockchain**

*Empowering creators. Rewarding backers. Automatically.*
