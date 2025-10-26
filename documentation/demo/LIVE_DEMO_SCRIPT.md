# 🎬 LIVE DEMO SCRIPT - Copy/Paste Ready

**⚡ QUICK REFERENCE FOR LIVE PRESENTATION**  
**👀 Laptop Screen (You): This guide | 🖥️ External Display (Judges): Browser**

---

## 🚀 SETUP (Do This BEFORE Judges Arrive)

### 1. Start Server
```bash
npm start
```

**Wait for**: "Compiled successfully!" message

### 2. Open Browser Tabs (External Display)
- **Tab 1**: http://localhost:3000 (Alice - Creator)
- **Tab 2**: http://localhost:3000 (Bob - Funder)
- **Tab 3**: http://localhost:3000 (Charlie - Funder)

### 3. Clean Slate (Run in EACH tab's console - F12)
```javascript
localStorage.clear();
location.reload();
```

### 4. Setup Demo Users (After all tabs reload)
**Run in Tab 1 console:**
```javascript
window.setupDemoUsers()
```

**Expected Output:**
```
✅ Demo users created successfully!
📝 Login credentials:
   Alice: alice@example.com / alice123
   Bob: bob@example.com / bob123
   Charlie: charlie@example.com / charlie123
```

---

## 📋 PRESENTATION FLOW (8-9 Minutes)

---

## 🎬 ACT 1: ALICE CREATES CAMPAIGN (3 minutes)

### Tab 1 - Alice Login

**Navigate to**: http://localhost:3000

**Click**: "Sign In" button

**Login Credentials** (Copy/Paste):
```
Email: alice@example.com
Password: alice123
```

**Click**: "Sign In"

---

### Alice - Select Creator Role

**On Role Selection Page:**
- **Click**: "I'm a Creator" card (left side)
- **Verify**: "Creator Dashboard" shows up

---

### Alice - Connect Wallet

**Click**: "Connect Wallet" button (top right)

**Choose**: "Create New Wallet"

**Wallet Details** (Copy/Paste):
```
Wallet Name: Alice Wallet
Password: alice123
Confirm Password: alice123
```

**Click**: "Create Wallet"

**⚠️ IMPORTANT**: Copy the secret key shown (or skip - for demo only)

**Click**: "I've Saved My Keys"

**Verify**: Header shows "Balance: 10,000.00 XLM"

---

### Alice - Create Campaign

**Click**: "Create Campaign" button (purple, top right)

---

#### Step 1: Campaign Details

**Copy/Paste into form:**
```
Campaign Title: Chronos Echo - Sci-Fi Short Film

Campaign Description: A mind-bending sci-fi thriller about time loops and quantum consciousness. Join us in bringing this ambitious 15-minute short film to life with cutting-edge VFX and a talented cast.

Funding Goal: 6000

Days to Run: 30
```

**Click**: "Next: Reward Tier"

---

#### Step 2: Reward Configuration

**Copy/Paste into form:**
```
Minimum Pledge Amount: 3000

Token Name: FOUNDER

Token Code: FOUNDER

Token Supply: 100
```

**Click**: "Next: Review"

---

#### Step 3: Review & Launch

**Verify all details look good**

**Click**: "Launch Campaign"

**Wait for**: Success toast notification

**Verify**: 
- Campaign card appears on dashboard
- Shows "0 / 6,000 XLM (0%)"
- Status: "Active"

---

### 📸 Talking Point 1:
> "Alice is a film director who just created a crowdfunding campaign for her sci-fi short film. She's set a goal of 6,000 XLM and configured a reward tier: anyone who pledges 3,000 XLM or more will automatically receive a FOUNDER token. This reward distribution will be automated by our Soroban smart contract."

---

## 🎬 ACT 2: BOB PLEDGES (No Reward) (2 minutes)

### Tab 2 - Bob Login

**Switch to Tab 2** (External Display)

**Click**: "Sign In" button

**Login Credentials** (Copy/Paste):
```
Email: bob@example.com
Password: bob123
```

**Click**: "Sign In"

---

### Bob - Select Funder Role

**On Role Selection Page:**
- **Click**: "I'm a Funder" card (right side)
- **Verify**: "Funder Dashboard" shows up

---

### Bob - Connect Wallet

**Click**: "Connect Wallet" button (top right)

**Choose**: "Create New Wallet"

**Wallet Details** (Copy/Paste):
```
Wallet Name: Bob Wallet
Password: bob123
Confirm Password: bob123
```

**Click**: "Create Wallet"

**Click**: "I've Saved My Keys"

**Verify**: Header shows "Balance: 10,000.00 XLM"

---

### Bob - Find & Pledge to Campaign

**On Funder Dashboard:**
- **Verify**: Alice's "Chronos Echo" campaign is visible
- **Click**: On the campaign card to open details

---

### Bob - Make Pledge

**On Campaign Detail Page:**

**Scroll to**: "Back This Campaign" section

**Pledge Amount** (Copy/Paste):
```
2000
```

**Verify**: 
- "Your balance after pledge: 8,000 XLM" shows
- ❌ No reward badge (below 3000 threshold)

**Click**: "Confirm Pledge"

**Wait for**: Success notification

**Verify**: 
- Header balance: "8,000.00 XLM"
- Campaign progress: "2,000 / 6,000 XLM (33%)"
- "1 Backer"

---

### 📸 Talking Point 2:
> "Bob is a student who pledged 2,000 XLM to Alice's campaign. Notice his balance dropped from 10,000 to 8,000 XLM instantly. Since his pledge is below the 3,000 XLM reward threshold, he doesn't earn the FOUNDER token - but he's still supporting a project he believes in."

---

## 🎬 ACT 3: CHARLIE PLEDGES (Gets Reward!) (2 minutes)

### Tab 3 - Charlie Login

**Switch to Tab 3** (External Display)

**Click**: "Sign In" button

**Login Credentials** (Copy/Paste):
```
Email: charlie@example.com
Password: charlie123
```

**Click**: "Sign In"

---

### Charlie - Select Funder Role

**On Role Selection Page:**
- **Click**: "I'm a Funder" card (right side)
- **Verify**: "Funder Dashboard" shows up

---

### Charlie - Connect Wallet

**Click**: "Connect Wallet" button (top right)

**Choose**: "Create New Wallet"

**Wallet Details** (Copy/Paste):
```
Wallet Name: Charlie Wallet
Password: charlie123
Confirm Password: charlie123
```

**Click**: "Create Wallet"

**Click**: "I've Saved My Keys"

**Verify**: Header shows "Balance: 10,000.00 XLM"

---

### Charlie - Find & Pledge to Campaign

**On Funder Dashboard:**
- **Verify**: Alice's "Chronos Echo" campaign shows "2,000 / 6,000 XLM"
- **Click**: On the campaign card

---

### Charlie - Make Pledge (Above Threshold!)

**On Campaign Detail Page:**

**Scroll to**: "Back This Campaign" section

**Pledge Amount** (Copy/Paste):
```
4000
```

**Verify**: 
- "Your balance after pledge: 6,000 XLM" shows
- ✅ **GREEN REWARD BADGE**: "Reward Eligible: You'll receive 1 FOUNDER token"

**Click**: "Confirm Pledge"

**Wait for**: Success notification

**Verify**: 
- Header balance: "6,000.00 XLM"
- Campaign progress: "6,000 / 6,000 XLM (100%)" 🎉
- "2 Backers"
- **Green badge**: "Earned: FOUNDER Token"

---

### 📸 Talking Point 3:
> "Charlie is an investor who pledged 4,000 XLM. Notice the green reward badge that appeared before he confirmed - this shows he's eligible for the FOUNDER token because his pledge exceeds the 3,000 XLM threshold. The campaign has now reached its goal at 100%! In a production deployment, our Soroban smart contract would automatically transfer the FOUNDER token to Charlie's wallet."

---

## 🎬 ACT 4: ALICE VERIFIES SUCCESS (1 minute)

### Tab 1 - Back to Alice

**Switch to Tab 1** (External Display)

**Refresh the Creator Dashboard** (F5 or click "Creator Dashboard" in header)

---

### Alice - Verify Campaign Success

**On Creator Dashboard:**

**Verify Campaign Stats:**
- 📊 Total Raised: "6,000 XLM"
- 👥 Total Backers: "2"
- ⏳ Active Campaigns: "0"
- ✅ **Status Changed**: "Pending Approval" (green badge)

**Campaign Card Shows:**
- Progress: "6,000 / 6,000 XLM (100%)"
- "2 backers"
- Badge: "Pending Approval"

---

### 📸 Talking Point 4:
> "Alice can now see her campaign reached its funding goal with 2 backers raising 6,000 XLM total. The status changed from 'Active' to 'Pending Approval'. In our smart contract, this would trigger the ability for Alice to claim the funds, while Bob and Charlie would have their pledges locked in escrow. If we had the contract deployed, Alice could click 'Claim Funds' and receive the 6,000 XLM, while Charlie would automatically receive his FOUNDER token."

---

## 🎤 CLOSING REMARKS (30 seconds)

> "What you just saw is StellarPledge - a decentralized crowdfunding platform built on Stellar. Key innovations:
> 
> **1. Automated Reward Distribution**: Our Soroban smart contract automatically distributes tokens when pledge thresholds are met - no manual intervention needed.
> 
> **2. Multi-User Real-Time Updates**: Notice how all three users operated independently in separate sessions, with instant balance and progress updates.
> 
> **3. Threshold-Based Incentives**: The system intelligently tracks pledge amounts and determines reward eligibility in real-time.
> 
> **4. Production-Ready Architecture**: We have a complete Soroban smart contract written and a frontend that integrates with Stellar's Horizon API. For this demo, we used mock balances for speed, but we can switch to real testnet transactions instantly.
> 
> The entire flow - campaign creation, pledging, reward distribution, and fund claiming - is designed to run on-chain with zero trust required. Thank you!"

---

## 🐛 EMERGENCY COMMANDS (If Something Breaks)

### Nuclear Reset (Run in ANY tab console):
```javascript
localStorage.clear();
location.reload();
// Wait for reload, then:
window.setupDemoUsers()
```

### Check Current User:
```javascript
window.whoAmI()
```

### Force Logout:
```javascript
localStorage.removeItem('stellarpledge_current_user');
location.reload();
```

### View All Campaigns:
```javascript
window.viewCampaigns()
```

### View All Users:
```javascript
window.viewUsers()
```

### Check Balances:
```javascript
window.walletBalance.getAll()
```

### Manually Fix Balance:
```javascript
window.walletBalance.init("PUBLIC_KEY", 10000)
location.reload()
```

---

## ✅ PRE-DEMO CHECKLIST

**30 Minutes Before:**
- [ ] Server running: `npm start`
- [ ] 3 browser tabs open on external display
- [ ] This guide open on laptop screen
- [ ] Console clean in all tabs (F12)
- [ ] `localStorage.clear()` run in all tabs
- [ ] `window.setupDemoUsers()` run successfully
- [ ] Can see demo accounts in console

**5 Minutes Before:**
- [ ] All tabs showing homepage
- [ ] No console errors visible
- [ ] External display positioned correctly
- [ ] Laptop screen showing this guide
- [ ] Network stable
- [ ] Sound/presentation equipment working

**During Demo:**
- [ ] Copy/paste from this guide (don't type!)
- [ ] Wait for each action to complete
- [ ] Point out visual changes to judges
- [ ] Speak while system loads
- [ ] Smile and stay confident! 😊

---

## 📊 TIMING BREAKDOWN

| Section | Time | Cumulative |
|---------|------|------------|
| **Setup** (before judges) | 2 min | - |
| **Alice Creates Campaign** | 3 min | 3 min |
| **Bob Pledges** | 2 min | 5 min |
| **Charlie Pledges** | 2 min | 7 min |
| **Alice Verifies** | 1 min | 8 min |
| **Closing Remarks** | 1 min | 9 min |
| **Q&A Buffer** | 1 min | 10 min |

**Total: 8-10 minutes**

---

## 🎯 KEY VISUAL MOMENTS TO HIGHLIGHT

1. **Alice's Campaign Creation**: 3-step wizard flow
2. **Bob's Balance Drop**: 10,000 → 8,000 XLM instantly
3. **Charlie's Green Badge**: Reward eligibility indicator
4. **Progress Bar at 100%**: Campaign goal reached
5. **Status Change**: Active → Pending Approval
6. **Alice's Dashboard**: Updated stats (6,000 XLM, 2 backers)

---

## 💡 QUESTIONS JUDGES MIGHT ASK

**Q: Is this on the blockchain?**
> "We have a complete Soroban smart contract written. For this demo, we're using mock balances for speed and reliability, but the architecture supports real blockchain integration. I can show you Alice's real funded testnet account if you'd like."

**Q: Can you show the smart contract?**
> "Absolutely! The contract is in `/smart-contract/src/lib.rs`. It implements automated reward distribution via cross-contract token transfers - when a pledge meets the threshold, the contract automatically calls the token contract to transfer rewards."

**Q: What about security?**
> "Wallets are encrypted in localStorage, we use Stellar's official SDK for keypair generation, and the smart contract handles all fund escrow. In production, we'd add backend authentication, secure key management, and audit the contract before mainnet deployment."

**Q: How do users get refunds if campaign fails?**
> "The smart contract has a `withdraw_refund` function. If the deadline passes and the goal isn't met, backers can call this function to get their full pledge back from escrow."

**Q: Can you deploy this now?**
> "Yes! The contract is ready to deploy. It would take about 30 minutes to deploy to testnet and integrate with the frontend. We focused on building a complete feature set first."

---

## 🌟 CONFIDENCE BOOSTERS

- ✅ Your demo works perfectly (tested multiple times)
- ✅ You have backup commands if needed
- ✅ Everything is copy/paste ready
- ✅ The innovation is clear and impressive
- ✅ You've built something real and functional
- ✅ The documentation is comprehensive
- ✅ You know your project inside-out

**You've got this! 🚀**

---

## 📞 LAST RESORT (If Demo Completely Breaks)

**Fallback Plan:**

1. **Show Documentation**:
   - Open `COMPLETE_DEMO_GUIDE.md`
   - Walk through the flow with screenshots in mind
   
2. **Show Code**:
   - Open smart contract: `/smart-contract/src/lib.rs`
   - Point out key functions: `create_campaign`, `pledge`, `claim_funds`
   
3. **Show Architecture**:
   - Explain event-driven system
   - Discuss Soroban integration
   - Highlight threshold-based rewards

4. **Show Stellar Expert**:
   - Open: https://stellar.expert/explorer/testnet/account/GDMT3KZ3Q4S5YKPBCI7BGJB5H3ST7GF2IFRJVU34WEIE5UX5NZTW5FTF
   - Show Alice's real funded account
   - Prove blockchain readiness

**But you won't need this - your demo is solid!** 💪

---

## 🎉 FINAL CHECKLIST

**Before you start:**
- [ ] Deep breath
- [ ] Water nearby
- [ ] This guide open
- [ ] Tabs ready
- [ ] Smile

**During demo:**
- [ ] Speak clearly
- [ ] Point out key features
- [ ] Wait for visual feedback
- [ ] Engage with judges
- [ ] Show enthusiasm

**After demo:**
- [ ] Thank judges
- [ ] Offer GitHub link
- [ ] Answer questions confidently
- [ ] Celebrate! 🎊

---

**🌟 YOU'RE READY TO IMPRESS! GOOD LUCK! 🚀**

---

*Demo Script Version 1.0*  
*Last Updated: October 26, 2025*  
*Estimated Time: 8-10 minutes*
