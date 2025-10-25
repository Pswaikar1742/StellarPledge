# 🎬 StellarPledge Live Demo Guide

## 📋 Pre-Demo Checklist

### Before Your Presentation:

1. **Create Test Accounts**
   - [ ] Go to https://laboratory.stellar.org/#account-creator?network=test
   - [ ] Create Account 1 (Creator) - Save secret key
   - [ ] Create Account 2 (Backer) - Save secret key
   - [ ] Fund both accounts with Friendbot (10,000 XLM each)

2. **Test the Application**
   - [ ] Run `./run-demo.sh` from project root
   - [ ] Open http://127.0.0.1:3000
   - [ ] Test wallet connection with Account 1
   - [ ] Verify you can see the interface

3. **Have Ready:**
   - [ ] Both secret keys in a text file (for quick copy-paste)
   - [ ] Browser window open at http://127.0.0.1:3000
   - [ ] This guide open for reference

---

## 🎯 Demo Flow (5 Minutes)

### **MINUTE 1: Introduction (30 seconds)**

**Say:**
> "Hi everyone! I'm presenting StellarPledge - a fully decentralized crowdfunding platform built on Stellar blockchain. Unlike Kickstarter or GoFundMe, there's no central authority. The smart contract IS the escrow agent."

**Show:**
- The application homepage
- Point to the contract address at the bottom

---

### **MINUTE 2: The Technology (45 seconds)**

**Say:**
> "We built this with Soroban smart contracts in Rust for the backend, and pure vanilla JavaScript on the frontend - no React, no frameworks. This demonstrates the power of Stellar's SDK."

**Show:**
- Open developer tools (F12)
- Show the console (clean, no framework overhead)
- Mention: "All transactions happen directly on Stellar Testnet"

---

### **MINUTE 3: Create a Campaign (60 seconds)**

**Action Steps:**
1. **Connect Wallet (Creator)**
   ```
   Paste Secret Key: [ACCOUNT 1 SECRET KEY]
   Click "Connect Wallet"
   ```

2. **Create Campaign**
   ```
   Funding Goal: 100
   Deadline: 1 (hour)
   Click "Create Campaign"
   ```

**Say while waiting:**
> "The smart contract is now storing this campaign on-chain. The goal is 100 XLM, and we have 1 hour to reach it. If we reach the goal, I can claim the funds. If not, backers get automatic refunds."

3. **Show the Result**
   - Point to the campaign card that appears
   - Show the progress bar (0%)
   - Show the deadline

---

### **MINUTE 4: The Happy Path - Successful Campaign (90 seconds)**

**Action Steps:**

1. **Switch to Backer**
   ```
   Click "Disconnect"
   Connect with Account 2 secret key
   ```

**Say:**
> "Now I'm a different user - a backer who wants to support this campaign."

2. **Make First Pledge**
   ```
   Click "Refresh Campaigns"
   Click on the campaign card
   Enter Pledge Amount: 60
   Click "Pledge Now"
   ```

**Say while processing:**
> "The smart contract is transferring 60 XLM from my wallet to the contract's secure vault. This is all happening on-chain with no intermediary."

3. **Show Progress**
   - Point to progress bar (now 60%)
   - Show the updated pledged amount

4. **Complete the Campaign**
   ```
   Enter Pledge Amount: 40
   Click "Pledge Now"
   ```

**Say:**
> "Now we've reached 100 XLM - the campaign is successful! Watch the status change..."

5. **Claim Funds (Switch to Creator)**
   ```
   Click "Disconnect"
   Connect with Account 1 (creator)
   Click "Refresh Campaigns"
   Click on the campaign
   Click "Claim Funds"
   ```

**Say:**
> "As the creator, I can now claim all the funds. The smart contract automatically transfers 100 XLM to my wallet. No waiting, no middleman, no fees to a platform!"

6. **Show Balance Increase**
   - Point to wallet balance increasing by 100 XLM

---

### **MINUTE 5: The Safety Net - Failed Campaign (60 seconds)**

**Action Steps:**

1. **Create a Short Campaign (as Creator)**
   ```
   Funding Goal: 200
   Deadline: 0.02 (about 1 minute)
   Click "Create Campaign"
   ```

**Say:**
> "Now let me show what happens when a campaign fails. I'm creating one with a very short deadline..."

2. **Pledge as Backer (Not Enough)**
   ```
   Disconnect and connect as Account 2
   Refresh and click the new campaign
   Pledge: 50 (not enough to reach 200 goal)
   ```

**Say:**
> "I'm pledging 50 XLM, but the goal is 200. Let's wait for the deadline..."

3. **Wait for Deadline (~30 seconds)**
   - While waiting, scroll through other campaigns
   - Show the countdown

4. **Withdraw Refund**
   ```
   Refresh the page
   Click on the failed campaign
   Status should show "Failed"
   Click "Withdraw Refund"
   ```

**Say:**
> "The deadline passed and we didn't reach the goal. The contract automatically marks it as failed. Now I can withdraw my 50 XLM refund - it's completely trustless!"

5. **Show Balance Restored**
   - Point to balance returning to original amount

---

## 🎤 Closing Statement (15 seconds)

**Say:**
> "That's StellarPledge - a fully functional, decentralized crowdfunding platform where code is law. No central authority, instant settlements, and complete transparency. All built on Stellar's powerful blockchain. Thank you!"

---

## 🆘 Troubleshooting During Demo

### If wallet won't connect:
- Check secret key starts with 'S'
- Verify account was funded with Friendbot
- Refresh the page and try again

### If transaction fails:
- Say: "Sometimes testnet can be slow, let me try again"
- Check you have enough balance
- Refresh and retry

### If campaigns don't load:
- Click "Refresh Campaigns"
- Say: "We're querying the blockchain for all campaigns"
- Check browser console for errors

### If server is not running:
```bash
cd /home/psw/Projects/StellarPledge
./run-demo.sh
```

---

## 📝 Q&A Preparation

**Q: How is this different from Kickstarter?**
A: Kickstarter is centralized - they control the funds and take fees. StellarPledge uses a smart contract as the escrow, so it's trustless and has no fees.

**Q: Can you use tokens other than XLM?**
A: The architecture supports any Stellar token, but for this MVP we focused on native XLM.

**Q: How do you handle disputes?**
A: The code is the law - if the goal is met by deadline, creator gets funds. If not, automatic refunds. No disputes needed!

**Q: Is this production-ready?**
A: This is a working MVP on testnet. For production, we'd add proper wallet integration (like Freighter), more testing, and security audits.

**Q: How much did this cost to deploy?**
A: On Stellar testnet, it's free! On mainnet, deployment costs are minimal compared to other chains.

---

## 🎯 Key Points to Emphasize

1. **Trustless** - No central authority controls the funds
2. **Fast** - Transactions settle in 3-5 seconds on Stellar
3. **Low Cost** - Minimal fees compared to traditional platforms
4. **Transparent** - All transactions visible on the blockchain
5. **Automatic** - Smart contract handles all logic

---

## 📸 Screenshots to Have Ready

Consider having these screenshots prepared in case of technical issues:

1. Successful campaign creation
2. Pledge transaction in progress
3. Completed campaign with 100% funding
4. Claim funds button and success
5. Failed campaign with refund option

---

**Good luck with your demo! 🚀⭐**
