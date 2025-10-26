# 🎯 Pre-Demo Checklist - StellarPledge

## ⚡ Quick Start (5 Minutes Before Demo)

### 1. Server Setup
```bash
cd /home/psw/Projects/StellarPledge/frontend
npm start
```
✅ Wait for: "webpack compiled successfully"
✅ Browser opens at: http://localhost:3000

### 2. Clean Browser State
**Open Browser Console (F12)** and run:
```javascript
localStorage.clear();
location.reload();
```

### 3. Load Demo Accounts
**After page reloads, open console again (F12)** and run:
```javascript
window.setupDemoUsers()
```

**Expected Output:**
```
✅ Demo users created!
Alice (Creator): alice@example.com / alice123
Bob (Funder): bob@example.com / bob123
Charlie (Funder): charlie@example.com / charlie123
```

### 4. Verify Homepage
✅ Logo and "StellarPledge" visible  
✅ "Sign In" and "Get Started" buttons visible  
✅ Hero section with "Fund the Future, Decentralized."  
✅ Features section visible  
✅ Theme toggle works (click sun/moon icon)  
✅ No console errors

---

## 📱 Tab Setup for Demo

### Open 3 Browser Tabs
1. **Tab 1:** http://localhost:3000 → Alice (Creator)
2. **Tab 2:** http://localhost:3000 → Bob (Funder)
3. **Tab 3:** http://localhost:3000 → Charlie (Funder)

---

## 🎬 Demo Flow (8-9 Minutes)

### ACT 1: Alice Creates Campaign (3 minutes)
**Tab 1:**
- [ ] Login: alice@example.com / alice123
- [ ] Connect wallet (create new: "Alice's Wallet" / password123)
- [ ] Verify balance: 10,000 XLM
- [ ] Create campaign:
  - Title: "Alice's DeFi Protocol"
  - Description: "Revolutionary DeFi platform"
  - Goal: 6000 XLM, 30 days
  - Reward: 3000 XLM = 1 FOUNDER token
- [ ] Campaign appears on dashboard
- [ ] Status: Active, 0/6000 XLM, 0 backers

### ACT 2: Bob Pledges (2 minutes)
**Tab 2:**
- [ ] Login: bob@example.com / bob123
- [ ] Select "Fund Projects" role
- [ ] Connect wallet (create new: "Bob's Wallet" / password123)
- [ ] Verify balance: 10,000 XLM
- [ ] Find Alice's campaign
- [ ] View details
- [ ] Pledge 2000 XLM
- [ ] ❌ No reward badge (below threshold)
- [ ] Success toast appears
- [ ] Balance: 8,000 XLM
- [ ] Campaign: 2000/6000 XLM, 1 backer

### ACT 3: Charlie Pledges (2 minutes)
**Tab 3:**
- [ ] Login: charlie@example.com / charlie123
- [ ] Select "Fund Projects" role
- [ ] Connect wallet (create new: "Charlie's Wallet" / password123)
- [ ] Verify balance: 10,000 XLM
- [ ] Find Alice's campaign (shows 2000/6000)
- [ ] View details
- [ ] Pledge 4000 XLM
- [ ] ✅ Green reward badge appears!
- [ ] Success toast: "earned 1 FOUNDER token!"
- [ ] Balance: 6,000 XLM
- [ ] Campaign: 6000/6000 XLM (100%), 2 backers

### ACT 4: Alice Verifies (1 minute)
**Tab 1:**
- [ ] Refresh or click "Creator Dashboard"
- [ ] Campaign status: "Pending Approval"
- [ ] Stats: 2 backers, 6000 XLM raised
- [ ] Progress bar: 100% complete

---

## 🔍 Visual Verification Points

### Header (All Pages)
- [ ] Logo visible (rocket icon + "StellarPledge")
- [ ] Authentication buttons work
- [ ] Wallet balance displays correctly
- [ ] User menu shows name
- [ ] Theme toggle functional
- [ ] Responsive on different screen sizes

### Homepage (/)
- [ ] Hero section animation plays
- [ ] "Fund the Future, Decentralized." heading
- [ ] Feature cards visible with icons
- [ ] Blockchain animation (cubes)
- [ ] "Get Started" button navigates to /register

### Login Page (/login)
- [ ] Form centered
- [ ] Email and password inputs
- [ ] Eye icon toggles password visibility
- [ ] "Sign In" button works
- [ ] "Create account" link → /register
- [ ] Error messages display for invalid credentials

### Register Page (/register)
- [ ] Name, email, password, confirm password fields
- [ ] Password validation (min 6 chars)
- [ ] Email uniqueness check
- [ ] Success → redirects to role selection
- [ ] "Sign in" link → /login

### Role Selection (/role-selection)
- [ ] Two cards: Creator and Funder
- [ ] Icons: Sparkles (Creator), Heart (Funder)
- [ ] Card highlights on selection
- [ ] Checkmark appears on selected card
- [ ] "Continue" button enabled after selection
- [ ] Redirects to correct dashboard

### Creator Dashboard (/creator-dashboard)
- [ ] Stats cards: Active, Pending, Successful, Total raised
- [ ] Icons display correctly
- [ ] "Create New Campaign" button
- [ ] Campaign cards with progress bars
- [ ] Status badges (Active, Pending)
- [ ] Empty state if no campaigns

### Funder Dashboard (/funder-dashboard)
- [ ] Stats cards: Backed, Pledged, Rewards earned
- [ ] Search bar functional
- [ ] Campaign grid layout
- [ ] Campaign cards clickable
- [ ] "My Backed Campaigns" section
- [ ] Shows user's pledges after backing

### Create Campaign (/create-campaign)
- [ ] Step 1: Title and description fields
- [ ] Step 2: Goal and duration inputs
- [ ] Step 3: Reward tier configuration
- [ ] Progress bar updates (33%, 66%, 100%)
- [ ] Icons: Sparkles, Target, Gift
- [ ] Form validation works
- [ ] Live preview in step 3
- [ ] "Launch Campaign" creates campaign
- [ ] Redirects to creator dashboard

### Campaign Detail (/campaign/:id)
- [ ] Campaign title and description
- [ ] Progress bar with animation
- [ ] Stats grid: Pledged, Backers, Days left
- [ ] Reward tier highlight box (green border, gift icon)
- [ ] Pledge form in sidebar
- [ ] Balance display
- [ ] Amount input validation
- [ ] Green badge when amount >= threshold
- [ ] "Pledge Now" button works
- [ ] Success toast with reward status
- [ ] Balance updates after pledge
- [ ] Campaign progress updates

### Wallet Connection Modal
- [ ] Three options: Create, Import, Read-Only
- [ ] Close button (X) works
- [ ] Create: Name and password fields
- [ ] Secret key display after creation
- [ ] "I've Saved My Secret Key" button
- [ ] Wallet connects successfully
- [ ] Modal closes after connection

### Wallet Dashboard (Header)
- [ ] Balance displays: "X,XXX.XX XLM"
- [ ] Wallet address shortened (GXXX...XXXX)
- [ ] Click to copy address
- [ ] Lock button (for non-read-only)
- [ ] Disconnect button
- [ ] Tooltips on hover

---

## 🐛 Pre-Demo Bug Check

### Test Each Flow
- [ ] Registration → Login → Role selection works
- [ ] Wallet creation shows secret key
- [ ] Wallet connection updates header
- [ ] Balance initializes to 10,000 XLM
- [ ] Campaign creation wizard completes
- [ ] Pledge deducts from balance
- [ ] Reward badge appears correctly
- [ ] Goal completion changes status
- [ ] Multi-tab sessions work independently

### Browser Console Check
- [ ] No red errors
- [ ] Only expected logs (balance updates, etc.)
- [ ] Debug commands available

### Responsive Design
- [ ] Test on laptop screen (1920x1080)
- [ ] Test on smaller screen (1366x768)
- [ ] Sidebar not overlapping content
- [ ] Mobile menu works (if applicable)

---

## 🎤 Presentation Script

### Opening (30 seconds)
> "Hello! I'm presenting StellarPledge, a decentralized crowdfunding platform built on the Stellar blockchain. It allows creators to launch campaigns with programmable reward tiers, while funders can back projects and earn tokenized rewards. Everything is secured through smart contracts and wallet authentication."

### During Demo
**While logging in as Alice:**
> "First, let's see how a creator like Alice can launch a campaign. After logging in and connecting her Stellar wallet, she has 10,000 XLM to get started."

**While creating campaign:**
> "Alice sets up her DeFi protocol campaign with a 6,000 XLM goal and creates a reward tier - anyone pledging 3,000 XLM or more receives a FOUNDER token, a programmable asset on Stellar."

**While Bob pledges:**
> "Now Bob, a funder, discovers Alice's campaign. He pledges 2,000 XLM - notice there's no reward badge because he's below the threshold. His balance immediately updates from 10,000 to 8,000 XLM."

**While Charlie pledges:**
> "Here's where it gets interesting. Charlie pledges 4,000 XLM - notice the green badge indicating he'll earn the reward token. This crosses the campaign goal, and Charlie receives his FOUNDER token."

**Back to Alice:**
> "Finally, Alice sees her campaign has reached the goal and is now pending her approval. She can see both backers and the total 6,000 XLM raised."

### Closing (30 seconds)
> "StellarPledge demonstrates several key blockchain features: multi-signature wallets, real-time transaction processing, programmable asset issuance, and decentralized fund management. All while maintaining an intuitive user experience."

---

## 🚨 Emergency Troubleshooting

### If something breaks during demo:

**Balance shows 0:**
```javascript
window.walletBalance.init("GXXX...", 10000)
location.reload()
```

**User not logged in:**
```javascript
window.whoAmI() // Check current user
// If null, login again
```

**Campaign not showing:**
```javascript
window.viewCampaigns() // Verify it exists
location.reload() // Refresh page
```

**Pledge button disabled:**
- Check wallet connected (balance visible in header)
- Check amount is valid number
- Check amount <= balance

**Console errors:**
- Press F5 to refresh
- Clear console (right-click → Clear console)
- Continue with demo

**Nuclear option:**
```javascript
localStorage.clear()
location.reload()
window.setupDemoUsers()
// Start over from Act 1
```

---

## ✅ Final Checklist (Before Judges)

### Technical
- [ ] Server running (no errors)
- [ ] Browser console clear
- [ ] Demo users loaded
- [ ] All 3 tabs open
- [ ] Theme set to preferred (light/dark)
- [ ] Screen sharing ready
- [ ] Zoom level comfortable (100%)

### Presentation
- [ ] Demo script reviewed
- [ ] Timing practiced (under 10 minutes)
- [ ] Backup plan ready
- [ ] Questions anticipated
- [ ] Features highlighted list ready
- [ ] Technical details memo ready

### Documentation
- [ ] COMPLETE_DEMO_GUIDE.md open in editor
- [ ] This checklist open
- [ ] README.md accessible
- [ ] GitHub repo link ready

---

## 💡 Confidence Boosters

### You Have:
✅ A fully functional crowdfunding platform  
✅ Real-time multi-user support  
✅ Blockchain wallet integration  
✅ Beautiful, responsive UI  
✅ Automatic reward distribution  
✅ Complete test scenario  
✅ Comprehensive documentation

### Remember:
- Practice makes perfect - run through the demo 2-3 times
- Have fun! Your excitement is contagious
- The judges want to see innovation, not perfection
- Your technical implementation is solid
- The demo flow is straightforward
- You've got this! 🚀

---

## 📊 Success Metrics

### Demo is successful when:
✅ All 3 users complete their workflows  
✅ Balances update correctly  
✅ Campaign reaches 100% goal  
✅ Reward badge appears for Charlie  
✅ No visible errors  
✅ Judges understand the concept  
✅ Q&A answered confidently

---

## 🎉 You're Ready!

**Time to shine! Good luck with your presentation!**

Remember: You've built something amazing. The technology works. The demo is solid. Trust your preparation and enjoy showing off your hard work!

🚀 **GO GET 'EM!** 🚀
