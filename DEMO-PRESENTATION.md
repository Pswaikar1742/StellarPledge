# 🎬 StellarPledge - Demo Mode Guide

## Quick Start for Judges Presentation

### Starting the Demo

1. **Start the Server:**
   ```bash
   ./run-demo.sh
   ```

2. **Open Demo Mode:**
   - Navigate to: **http://127.0.0.1:3000/demo.html**
   - (Note: Use `demo.html` not `index.html`)

---

## The Happy Path Story

### 🎭 Characters

| Character | Role | Public Address |
|-----------|------|----------------|
| **👩‍🎨 Alice** | Creator/Filmmaker | `GDMT3KZ3Q4S5YKPBCI7BGJB5H3ST7GF2IFRJVU34WEIE5UX5NZTW5FTF` |
| **👨‍💼 Bob** | First Backer | `GDBNXWAFUIAGNIU5G67ANOLNMHG7OB4L5X7NJXGYHL2HWEEGXCP4ATVM` |
| **👨‍🚀 Charlie** | Hero Backer | `GD4I6Y3FQW3PTNQAVP223YOFLHE66GTORJRGD55FWPZXI5SNCPU6NZNX` |

---

## 🎯 The 4-Step Demo Flow

### Step 1: The Launch 🚀
**Actor:** Alice  
**Action:** Creates campaign  
**Details:**
- Goal: 250 XLM
- Deadline: 720 hours (30 days)

**What to Say to Judges:**
> "Alice is an independent filmmaker who wants to fund her new project. She comes to StellarPledge and creates a campaign with a goal of 250 XLM. Notice how the smart contract is deployed on Stellar's blockchain, ensuring transparency and security."

**Click:** ▶ Execute: Alice Creates Campaign

**Expected Result:** 
- ✅ Campaign #0 created
- Status: Active
- Progress: 0/250 XLM (0%)

---

### Step 2: The First Pledge 💰
**Actor:** Bob  
**Action:** Pledges 100 XLM  

**What to Say to Judges:**
> "Now Bob, a fan of Alice's work, discovers the campaign. He loves the concept and decides to support it with a pledge of 100 XLM. Watch as the smart contract instantly updates the campaign status."

**Click:** ▶ Execute: Bob Pledges 100 XLM

**Expected Result:**
- ✅ Pledge successful
- Progress: 100/250 XLM (40%)
- Bob is now listed as a backer

---

### Step 3: The Decisive Pledge 🎯
**Actor:** Charlie  
**Action:** Pledges 150 XLM (reaching the goal!)  

**What to Say to Judges:**
> "The campaign is close! Charlie sees that Alice is just 150 XLM away from her goal. He decides to make the decisive pledge that will push the campaign to success. This is where the magic happens..."

**Click:** ▶ Execute: Charlie Pledges 150 XLM

**Expected Result:**
- 🎉 **GOAL REACHED!**
- Progress: 250/250 XLM (100%)
- Status changes to: ✅ **Successful**
- Smart contract automatically unlocks funds

---

### Step 4: The Payoff 🎉
**Actor:** Alice (returns)  
**Action:** Claims her funds  

**What to Say to Judges:**
> "Success! Because the campaign reached its goal, the smart contract has automatically marked it as successful and unlocked the funds. Alice can now claim her entire 250 XLM instantly—with ZERO platform fees. No waiting periods, no payment processors, no middlemen."

**Click:** ▶ Execute: Alice Claims 250 XLM

**Expected Result:**
- 🎊 Funds claimed successfully
- Alice receives full 250 XLM
- Transaction complete on Stellar blockchain

---

## 💡 Key Points to Emphasize

### During the Demo, Highlight:

1. **Blockchain Transparency**
   - Every transaction is recorded on Stellar Testnet
   - Anyone can verify the contract and transactions
   - Contract address visible in footer

2. **Zero Platform Fees**
   - Traditional platforms take 5-10%
   - StellarPledge: 0% platform fee
   - Only minimal Stellar network fees (fractions of a cent)

3. **Instant Settlement**
   - No waiting for payment processors
   - Funds transfer immediately upon claiming
   - Powered by Stellar's 3-5 second finality

4. **Smart Contract Automation**
   - Campaign state automatically updated
   - Funds locked until goal reached
   - Refunds automatic if campaign fails

5. **Decentralized & Trustless**
   - No central authority
   - Code is law (open source)
   - Users maintain custody of funds

---

## 🔧 Technical Details (For Q&A)

### Smart Contract Functions Used:

1. **`create_campaign(creator, goal, deadline)`**
   - Creates new campaign with parameters
   - Returns campaign ID

2. **`pledge(backer, campaign_id, amount, token)`**
   - Transfers funds to contract
   - Updates campaign state
   - Automatically marks successful when goal reached

3. **`claim_funds(creator, campaign_id, token)`**
   - Only callable by creator
   - Only works if campaign successful
   - Transfers full amount to creator

4. **`get_campaign(campaign_id)`**
   - Read-only query
   - Returns all campaign details
   - Used for UI updates

### Technology Stack:

- **Blockchain:** Stellar Testnet
- **Smart Contracts:** Soroban (Rust)
- **Frontend:** Vanilla JavaScript + Stellar SDK
- **Token:** Native XLM (Stellar Lumens)

### Network Details:

- **Contract Address:** `CBBHYAHLF4FJWFMIX4ZZTGVWVL3M452TI4REVYJ64U6WGOKR2VFWOBO7`
- **Network:** Testnet
- **Explorer:** https://stellar.expert/explorer/testnet

---

## 🎬 Presentation Tips

### Timing (5 minutes total):

- **Introduction (30 sec):** Problem statement & solution
- **Step 1 (60 sec):** Alice creates campaign
- **Step 2 (60 sec):** Bob pledges
- **Step 3 (60 sec):** Charlie pledges & goal reached
- **Step 4 (60 sec):** Alice claims funds
- **Wrap-up (60 sec):** Key benefits & Q&A

### If Something Goes Wrong:

1. **Transaction Timeout:**
   - "This is testnet, sometimes it takes a moment..."
   - Wait 10-15 seconds
   - Check browser console for errors

2. **Simulation Fails:**
   - Refresh the page
   - Re-run from current step
   - Have backup screenshots ready

3. **Network Issues:**
   - Have a pre-recorded video backup
   - Walk through screenshots
   - Show the code instead

---

## 📸 Backup Materials

### Have Ready:

- [ ] Screenshots of each step completed
- [ ] Browser console showing successful transactions
- [ ] Stellar Explorer showing contract
- [ ] Code walkthrough slides

### Important URLs:

- **Demo:** http://127.0.0.1:3000/demo.html
- **Contract Explorer:** https://stellar.expert/explorer/testnet/contract/CBBHYAHLF4FJWFMIX4ZZTGVWVL3M452TI4REVYJ64U6WGOKR2VFWOBO7
- **GitHub Repo:** https://github.com/Pswaikar1742/StellarPledge

---

## ✅ Pre-Demo Checklist

Before presenting:

- [ ] Server is running (`./run-demo.sh`)
- [ ] Demo page loads at http://127.0.0.1:3000/demo.html
- [ ] All three accounts have sufficient XLM (check balances)
- [ ] Browser console is open (F12) for transparency
- [ ] Network connection is stable
- [ ] Backup materials are ready

---

## 🎯 Closing Statement

> "StellarPledge demonstrates how blockchain technology can revolutionize crowdfunding by eliminating middlemen, reducing fees to near-zero, and providing instant, transparent transactions. Built on Stellar's fast and efficient blockchain, this is the future of decentralized fundraising."

---

**Good luck with your presentation! 🚀**

*For troubleshooting, see: TROUBLESHOOTING.md*
