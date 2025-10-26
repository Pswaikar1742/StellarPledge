# StellarPledge Demo Guide

## Quick Setup for Multi-Tab Testing

### Option 1: Use Pre-configured Demo Users (Recommended)

1. Open the browser console (F12)
2. Run: `window.setupDemoUsers()`
3. This creates three users:
   - **Alice** (Creator): `alice@example.com` / `alice123`
   - **Bob** (Funder): `bob@example.com` / `bob123`
   - **Charlie** (Funder): `charlie@example.com` / `charlie123`

### Option 2: Use Your Existing Test Accounts

Your existing test accounts are already set up:
- **Shreyas**: `shreyasmudholkar12345@gmail.com` / `Shreyas` (Creator)
- **Ali**: `ali@gmail.com` / password (Funder)
- **PSW**: `psw@gmail.com` / password (Funder)

## Multi-Tab Demo Workflow

### Tab 1: Alice (Creator) - Create Campaign

1. **Open Tab 1** at `http://localhost:3000`
2. Click "Sign In" → Login as Alice
   - Email: `alice@example.com`
   - Password: `alice123`
3. Click "Connect Wallet" → Choose any wallet option
4. Click "Create New Campaign"
5. **Step 1**: Campaign Details
   - Title: "Alice's DeFi Protocol"
   - Description: "Revolutionary decentralized finance platform"
6. **Step 2**: Funding Goal
   - Goal: `6000` XLM
   - Duration: `30` days
7. **Step 3**: Reward Tier
   - Minimum pledge: `3000` XLM
   - Token name: "Founder Token"
   - Token code: "FOUNDER"
   - Token supply: `100`
8. Click "Launch Campaign"

### Tab 2: Bob (Funder) - Pledge Below Threshold

1. **Open NEW Tab** at `http://localhost:3000`
2. Click "Sign In" → Login as Bob
   - Email: `bob@example.com`
   - Password: `bob123`
3. Click "Connect Wallet"
4. Find Alice's campaign in the dashboard
5. Click "View Details"
6. Enter pledge amount: `2000` XLM
   - ❌ Should NOT see "You'll earn the reward token!" badge
7. Click "Pledge Now"
8. ✅ Success: "You pledged 2000 XLM. Thank you for your support!"

### Tab 3: Charlie (Funder) - Pledge Above Threshold

1. **Open NEW Tab** at `http://localhost:3000`
2. Click "Sign In" → Login as Charlie
   - Email: `charlie@example.com`
   - Password: `charlie123`
3. Click "Connect Wallet"
4. Find Alice's campaign (should show 2000/6000 XLM from Bob's pledge)
5. Click "View Details"
6. Enter pledge amount: `4000` XLM
   - ✅ Should see green "You'll earn the reward token!" badge
7. Click "Pledge Now"
8. ✅ Success: "You pledged 4000 XLM and earned 1 FOUNDER token!"

### Verification

**Go back to Tab 1 (Alice's dashboard):**
- Campaign should show:
  - Progress: 6000/6000 XLM (100%)
  - Status: "Pending Your Approval" badge
  - 2 backers

**Check Tab 2 (Bob's dashboard):**
- Stats should show:
  - Campaigns Backed: 1
  - Total Pledged: 2000 XLM
  - Rewards Earned: 0

**Check Tab 3 (Charlie's dashboard):**
- Stats should show:
  - Campaigns Backed: 1
  - Total Pledged: 4000 XLM
  - Rewards Earned: 1 (FOUNDER token)

## Features Implemented

✅ **Multi-tab support**: Each tab can have different user sessions
✅ **Real-time updates**: Changes reflect across components
✅ **Wallet connection per user**: Each user can connect their own wallet
✅ **Role-based routing**: Creators and Funders see different dashboards
✅ **Reward tier system**: Automatic token distribution based on pledge amount
✅ **Goal tracking**: Campaign status updates when goal is reached
✅ **Persistent data**: All data stored in localStorage

## Troubleshooting

### Issue: "Wallet Locked" screen appears
**Solution**: Click "Unlock Wallet" or logout and login again

### Issue: User menu not showing after login
**Solution**: Refresh the page or check browser console for errors

### Issue: Campaign not updating after pledge
**Solution**: Check the browser console for errors, try refreshing the page

### Issue: Can't connect wallet
**Solution**: Make sure you're logged in first. The wallet connection button only appears for authenticated users.

## localStorage Keys Used

- `stellarpledge_users`: Array of all registered users
- `stellarpledge_current_user`: Current logged-in user session
- `stellarpledge_campaigns`: Array of all campaigns with pledges
- `stellar-wallet`: Wallet data (encrypted)

## Tips

1. **Clear data**: To reset everything, open console and run:
   ```javascript
   localStorage.clear()
   location.reload()
   ```

2. **View all campaigns**: Run in console:
   ```javascript
   JSON.parse(localStorage.getItem('stellarpledge_campaigns'))
   ```

3. **View all users**: Run in console:
   ```javascript
   JSON.parse(localStorage.getItem('stellarpledge_users'))
   ```

4. **Switch accounts quickly**: Just logout and login with different credentials - each tab is independent!
