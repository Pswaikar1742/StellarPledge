# 🎬 StellarPledge Complete Workflow Guide

## Overview
This document outlines the complete, step-by-step workflows for Alice (Creator) and Bob/Charlie (Backers) using the StellarPledge platform on **Stellar Testnet**.

---

## 🎭 Alice's Workflow: The Creator's Journey

### **Goal:** Raise 10,000 XLM for "Chronos Echo" sci-fi short film

### Phase 1: Pre-Launch Preparation (One-Time Setup)

#### Step 1: Get a Wallet
1. **Install Freighter Wallet**
   - Visit: https://www.freighter.app/
   - Install browser extension (Chrome/Firefox/Brave)
   - Create new wallet OR import existing

2. **Switch to Testnet**
   - Open Freighter
   - Click Settings → Network → Select "Testnet"
   - ⚠️ **CRITICAL:** Always verify "Testnet" is selected

3. **Import Demo Account**
   - Click "Import existing wallet"
   - Enter Alice's secret key: `SAH6ZOC6X4PVOHU7NQQ25KVWI2AGAHALTXI3N7UF4DLYUYJAJF22I7IF`
   - Public Key: `GDMT3KZ3Q4S5YKPBCI7BGJB5H3ST7GF2IFRJVU34WEIE5UX5NZTW5FTF`
   - Verify balance: ~9,999 XLM

#### Step 2: Create the FILMCREDIT Perk Token

**Option A: Using Stellar Laboratory (Recommended)**

1. **Navigate to Stellar Laboratory**
   - URL: https://laboratory.stellar.org/
   - Switch to "Testnet" at the top

2. **Create Asset**
   - Go to "Build Transaction" tab
   - Source Account: Paste Alice's public key
   - Operation Type: "Change Trust"
   - Asset: Custom
     - Asset Code: `FILMCREDIT`
     - Issuer: Alice's public key
     - Limit: 100 (total supply)
   
3. **Sign and Submit**
   - Copy transaction XDR
   - Go to "Sign Transaction" tab
   - Paste XDR, add Alice's secret key
   - Go to "Submit Transaction" tab
   - Submit to network

4. **Issue Tokens**
   - Return to "Build Transaction"
   - Operation: "Payment"
   - Destination: Alice's public key
   - Asset: FILMCREDIT (custom)
   - Amount: 100
   - Sign and submit

5. **Get Contract Address**
   ```bash
   soroban contract asset deploy \
     --asset FILMCREDIT:GDMT3KZ3Q4S5YKPBCI7BGJB5H3ST7GF2IFRJVU34WEIE5UX5NZTW5FTF \
     --source alice \
     --network testnet
   ```
   - Save the returned contract address

**Option B: Using StellarPledge UI (Future Feature)**
- One-click "Create Perk Token" button
- Enter token details
- Automatic deployment

### Phase 2: Launching the Campaign

#### Step 1: Visit StellarPledge Platform
- URL: https://localhost:3001 (or production URL)
- Connect Freighter wallet
- Verify Alice's account is connected

#### Step 2: Start Campaign Creation
1. Click **"Start Your Campaign"** button
2. Fill out the campaign form:

**Basic Information:**
```
Campaign Title: Chronos Echo - A Sci-Fi Short Film
Description: A mind-bending short film about time loops and parallel dimensions
Funding Goal: 10000 XLM
Campaign Duration: 30 days
```

**Perk Configuration (Innovative Feature):**

**Option 1: Enable Automated Perks** ✨
```
☑️ Add Automated Perk
Perk Threshold: 500 XLM
Perk Asset: FILMCREDIT
Perk Contract Address: [Paste from Step 2]
Perk Amount: 1 token (per qualifying backer)
Perk Mode: AUTOMATIC (Smart contract handles distribution)
```

**Option 2: Manual Rewards**
```
☐ Add Automated Perk
☑️ I will manually reward backers later
Reward Description: Behind-the-scenes access and premiere tickets
```

**Option 3: No Perks**
```
☐ Add Automated Perk
☐ Manual rewards
(Simple crowdfunding only)
```

#### Step 3: Review and Launch
1. **Preview Campaign**
   - Review all details
   - Check perk configuration
   - Verify wallet address

2. **Approve Transaction**
   - Click "Launch Campaign"
   - Freighter popup appears
   - Shows: `create_campaign` function call
   - Gas estimate: ~0.1 XLM
   - Click "Approve"

3. **Confirmation**
   - Transaction confirms in ~5 seconds
   - Redirected to live campaign page
   - Campaign ID assigned (e.g., Campaign #0)
   - Shareable URL generated

### Phase 3: Monitoring Campaign

#### Real-Time Dashboard
Alice sees:
- **Progress Bar:** 0/10,000 XLM (0%)
- **Time Remaining:** 30 days, 0 hours
- **Total Backers:** 0
- **Perk Status:** 0 perks distributed
- **Campaign URL:** Share button

#### Activity Feed
- "Bob pledged 100 XLM" (+1%)
- "Charlie pledged 500 XLM - PERK DISTRIBUTED! 🎉" (+5%)
- Real-time updates
- Push notifications (optional)

### Phase 4: Campaign Outcome

#### **Scenario A: SUCCESSFUL Campaign** ✅

**Conditions:**
- Total pledged ≥ 10,000 XLM
- Before deadline expires

**What Happens:**
1. **Automatic Status Update**
   - Banner: "🎉 Campaign Successful!"
   - Progress bar: 100%+ (green)
   - "Claim Funds" button appears (Alice only)

2. **Claim Process**
   - Click "Claim Funds"
   - Freighter popup
     - Shows: `claim_funds` function
     - Amount: 10,000+ XLM
     - Destination: Alice's wallet
   - Approve transaction
   - Funds transferred instantly

3. **Post-Campaign**
   - Campaign marked as "Claimed"
   - Transaction hash provided
   - View on Stellar Expert
   - Thank backers message

**Smart Contract Guarantees:**
- ✅ Only Alice (creator) can claim
- ✅ Can only claim once
- ✅ Must meet goal + deadline
- ✅ All perks automatically distributed during pledges

#### **Scenario B: FAILED Campaign** ❌

**Conditions:**
- Total pledged < 10,000 XLM
- Deadline has passed

**What Happens:**
1. **Automatic Status Update**
   - Banner: "Campaign Unsuccessful"
   - Final amount displayed (e.g., 8,000/10,000 XLM)
   - No "Claim" button for Alice

2. **Alice's Actions**
   - No action required
   - Cannot claim funds
   - Backers handle own refunds

3. **Smart Contract Guarantees:**
   - ✅ Alice cannot access funds
   - ✅ All pledges locked for backer refunds
   - ✅ Perks remain with Alice (can reclaim)

---

## 👨‍🎓 Bob's Workflow: The Student Backer

### **Goal:** Support Alice's film with a modest contribution

### Phase 1: Setup

#### Step 1: Get Wallet
1. Install Freighter extension
2. Switch to Testnet
3. Import Bob's account:
   - Public Key: `GD4I6Y3FQW3PTNQAVP223YOFLHE66GTORJRGD55FWPZXI5SNCPU6NZNX`
   - (Secret key from Stellar Lab or Friendbot)

4. Verify testnet balance

### Phase 2: Discovery and Pledging

#### Step 1: Browse Campaigns
1. Visit StellarPledge homepage
2. See featured campaigns gallery
3. Alice's "Chronos Echo" catches his eye

#### Step 2: Campaign Review
Campaign page shows:
```
┌─────────────────────────────────────┐
│ Chronos Echo - A Sci-Fi Short Film │
│ by Alice (GDMT3KZ...W5FTF)         │
├─────────────────────────────────────┤
│ Goal: 10,000 XLM                    │
│ Raised: 0 XLM (0%)                  │
│ Time Left: 29 days, 23 hours        │
├─────────────────────────────────────┤
│ ✨ PERK ALERT!                       │
│ Pledge 500+ XLM → Get 1 FILMCREDIT │
│ (Automatic on-chain distribution)   │
└─────────────────────────────────────┘
```

#### Step 3: Make Pledge
1. **Enter Amount**
   - Bob decides: 100 XLM (student budget)
   - Sees notice: "Below perk threshold (500 XLM)"
   - Understands: No perk, but supporting the project

2. **Click "Pledge Now"**

3. **Freighter Security Review**
   ```
   ┌────────────────────────────────┐
   │ Confirm Transaction            │
   ├────────────────────────────────┤
   │ From: Bob's Wallet             │
   │ To: StellarPledge Contract     │
   │ Amount: 100 XLM                │
   │ Function: pledge()             │
   │ Campaign: #0                   │
   ├────────────────────────────────┤
   │ ⚠️ TESTNET Transaction         │
   │ ✅ Funds go to secure escrow   │
   └────────────────────────────────┘
   ```

4. **Approve**
   - Transaction confirms in 5 seconds
   - Page updates immediately
   - Bob's name in backer list
   - Progress: 100/10,000 XLM (1%)

### Phase 3: Campaign Outcome

#### **If Successful** ✅
- Bob feels satisfaction
- His 100 XLM helped fund the film
- Gets backer recognition on campaign page
- May receive project updates from Alice

#### **If Failed** ❌

1. **Notification**
   - "Campaign did not meet goal"
   - "Your refund is available"

2. **Withdraw Refund**
   - Visit campaign page
   - "Withdraw My Refund" button visible
   - Click button

3. **Freighter Approval**
   ```
   ┌────────────────────────────────┐
   │ Confirm Refund Withdrawal      │
   ├────────────────────────────────┤
   │ From: StellarPledge Contract   │
   │ To: Bob's Wallet               │
   │ Amount: 100 XLM (full refund)  │
   │ Function: withdraw_refund()    │
   └────────────────────────────────┘
   ```

4. **Instant Refund**
   - 100 XLM back in wallet
   - No fees deducted
   - No need to contact support
   - Automated by smart contract

---

## 💼 Charlie's Workflow: The Investor

### **Goal:** Make substantial pledge and receive automated perk

### Phase 1: Setup
Same as Bob, but with Charlie's account:
- Public Key: `GC4GCLLQEERQXIHNYITVQINGT54UK3ZPHR5ACC6QKS2TKVS4YL3X7YVP`

### Phase 2: High-Value Pledge

#### Step 1: Review Campaign
Charlie notices:
- Professional project
- Clear funding goal
- **Automated perk at 500 XLM**
- On-chain proof of reward

#### Step 2: Make Strategic Pledge
1. **Enter Amount: 500 XLM**
2. **Perk Preview Shows:**
   ```
   ┌────────────────────────────────┐
   │ 🎁 YOU QUALIFY FOR PERK!        │
   ├────────────────────────────────┤
   │ Pledge: 500 XLM                │
   │ Threshold: 500 XLM ✅           │
   │                                 │
   │ You will automatically receive: │
   │ • 1 FILMCREDIT token           │
   │ • Instant on-chain transfer    │
   │ • Provable ownership           │
   └────────────────────────────────┘
   ```

3. **Click "Pledge Now"**

4. **Freighter Shows TWO Operations:**
   ```
   ┌────────────────────────────────┐
   │ Confirm Multi-Operation TX     │
   ├────────────────────────────────┤
   │ Operation 1: Payment           │
   │   500 XLM → Contract Escrow    │
   │                                 │
   │ Operation 2: Token Transfer    │
   │   1 FILMCREDIT → Your Wallet   │
   │   (Automatic from Alice)       │
   ├────────────────────────────────┤
   │ ⚡ Cross-Contract Call Magic!   │
   └────────────────────────────────┘
   ```

5. **Approve**
   - Both operations execute atomically
   - If one fails, both revert
   - Charlie gets BOTH:
     - Campaign backer status
     - FILMCREDIT token ownership

### Phase 3: Verify Perk Receipt

#### On StellarPledge:
- Campaign page shows: "Charlie backed 500 XLM 🎁"
- Perk badge next to Charlie's name

#### On Stellar Expert:
1. Visit: https://stellar.expert/explorer/testnet/account/GC4GCLLQ...
2. Assets tab shows: "1 FILMCREDIT"
3. Transaction history shows the transfer
4. Proof of ownership on-chain

#### In Freighter Wallet:
- Assets list shows FILMCREDIT balance
- Can transfer, hold, or trade later

---

## 🛡️ Error Handling & Edge Cases

### Network Errors
**Problem:** RPC timeout or Horizon unavailable  
**Solution:**
- Automatic retry (3 attempts)
- Fallback RPC URLs
- User notification: "Network issue, retrying..."
- Transaction state preserved

### Insufficient Balance
**Problem:** User tries to pledge more than balance  
**Solution:**
- Pre-flight balance check
- Error before Freighter popup
- Message: "Insufficient balance. You have X XLM, need Y XLM (including fees)"

### Freighter Not Installed
**Problem:** User clicks "Connect Wallet" without Freighter  
**Solution:**
- Detect extension absence
- Show modal: "Install Freighter Wallet"
- Direct link to freighter.app
- Instructions for installation

### Wrong Network
**Problem:** Freighter set to Mainnet instead of Testnet  
**Solution:**
- Detect network mismatch
- Block all transactions
- Prominent warning banner
- Instructions to switch network

### Campaign Already Claimed
**Problem:** Alice tries to claim twice  
**Solution:**
- Smart contract reverts
- UI shows: "Already claimed on [date]"
- Transaction hash of original claim

### Perk Token Not Trusted
**Problem:** Backer hasn't established trustline  
**Solution:**
- Auto-create trustline transaction
- Ask user approval first
- Combine with pledge transaction
- Clear explanation provided

### Deadline Passed During Pledge
**Problem:** User pledges as deadline expires  
**Solution:**
- Pre-flight deadline check
- Warning if < 1 hour remaining
- Transaction may fail gracefully
- Refund instructions provided

### Campaign Not Found
**Problem:** Invalid campaign ID in URL  
**Solution:**
- Check campaign existence
- 404 page with suggestions
- Link back to browse page

---

## 🎯 Testing Checklist for Hackathon

### Alice (Creator) Tests
- [ ] Connect wallet (Alice's account)
- [ ] Create FILMCREDIT token
- [ ] Launch campaign with automatic perk
- [ ] Launch campaign without perk
- [ ] Monitor real-time progress
- [ ] Claim successful campaign
- [ ] Verify failed campaign (cannot claim)
- [ ] Check transaction on Stellar Expert

### Bob (Small Backer) Tests
- [ ] Connect wallet (Bob's account)
- [ ] Browse campaigns
- [ ] Pledge below perk threshold (100 XLM)
- [ ] Verify pledge recorded
- [ ] Withdraw refund from failed campaign
- [ ] Verify refund received

### Charlie (High Backer) Tests
- [ ] Connect wallet (Charlie's account)
- [ ] Pledge above threshold (500 XLM)
- [ ] Verify AUTOMATIC perk transfer
- [ ] Check FILMCREDIT in wallet
- [ ] Verify on Stellar Expert (2 operations)
- [ ] Test perk badge on campaign page

### Edge Case Tests
- [ ] Pledge with insufficient balance (should fail gracefully)
- [ ] Connect wrong network (should warn)
- [ ] Freighter not installed (should guide)
- [ ] Campaign deadline passed (should block pledge)
- [ ] Double claim attempt (should prevent)
- [ ] Network timeout (should retry)
- [ ] Invalid campaign ID (should 404)

---

## 📊 Success Metrics

### For Hackathon Judges
1. **Zero Failed Transactions**
   - All operations complete successfully
   - Proper error handling prevents failures

2. **Clear User Journey**
   - No confusion at any step
   - Tooltips and help text throughout

3. **Transaction Transparency**
   - Every TX viewable on Stellar Expert
   - Clear gas estimates
   - Security prompts in Freighter

4. **Innovation Showcase**
   - Automatic perk distribution working
   - Cross-contract calls visible
   - On-chain proof of rewards

5. **Professional UX**
   - Loading states
   - Success/error messages
   - Responsive design
   - Accessibility features

---

## 🚀 Quick Demo Script (5 Minutes)

**Minute 1:** Alice creates campaign with perk  
**Minute 2:** Bob pledges 100 XLM (no perk)  
**Minute 3:** Charlie pledges 500 XLM (PERK MAGIC! 🎉)  
**Minute 4:** Show Stellar Expert (2 operations in 1 TX)  
**Minute 5:** Alice claims funds  

**Wow Factor:** Live demo of automatic token transfer!

---

**💫 StellarPledge: Where Creators Meet Their Community On-Chain 💫**
