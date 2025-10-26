# Mock Wallet Balance System - Implementation Guide

## Overview
Added mock wallet balance system for demo purposes. Each user starts with **10,000 XLM** when they connect a wallet.

## How It Works

### 1. Initial Balance
When a user connects any wallet (Create/Import/Read-Only):
- Automatically initializes with **10,000 XLM**
- Balance stored in `localStorage` under `stellarpledge_wallet_balances`
- Keyed by wallet's public key

### 2. Balance Updates
**When Pledging:**
- Amount deducted from funder's balance
- Balance updates immediately in UI
- Event dispatched to update all components

**When Campaign Succeeds** (Future):
- Pledged funds transfer to creator's wallet
- Funders receive reward tokens
- All balances update automatically

### 3. Real-Time Updates
- Balance changes trigger `balance-update` event
- WalletDashboard listens and updates display
- Works across multiple tabs

## Files Modified

### Core Files
1. **`/utils/mockWalletBalance.js`** (NEW)
   - Balance management functions
   - Initialize, get, set, deduct, add, transfer
   - Global `window.walletBalance` API

2. **`/context/WalletContext.js`**
   - Import mock balance utilities
   - Initialize balance on wallet connection
   - Listen for balance-update events
   - Load balance shows mock value

3. **`/components/Wallet/WalletDashboard.js`**
   - Updated getXLMBalance() to handle number format
   - Displays mock balance correctly

4. **`/pages/CampaignDetail.jsx`**
   - Import deductBalance function
   - Deduct pledge amount from wallet
   - Store funder's public key in pledge
   - Proper error handling

5. **`/App.js`**
   - Import mockWalletBalance utility
   - Make globally available

## Debug Commands

### Check Balance
```javascript
// Get current user's balance
window.walletBalance.getAll()

// Get specific wallet balance
window.walletBalance.get("GXXXXX...")
```

### Set Balance
```javascript
// Give user 5000 XLM
window.walletBalance.set("GXXXXX...", 5000)

// Initialize new wallet with 10000 XLM
window.walletBalance.init("GXXXXX...", 10000)
```

### Transfer Funds
```javascript
// Transfer 1000 XLM from one wallet to another
window.walletBalance.transfer("fromPublicKey", "toPublicKey", 1000)
```

### Reset Everything
```javascript
// Clear all balances
window.walletBalance.reset()
```

## Testing Scenario

### Setup
1. Open browser console
2. Run: `window.setupDemoUsers()`
3. Open 3 tabs

### Tab 1 - Alice (Creator)
```
Login: alice@example.com / alice123
Connect Wallet → Initial balance: 10,000 XLM
Create Campaign: 6000 XLM goal
```

### Tab 2 - Bob (Funder)
```
Login: bob@example.com / bob123
Connect Wallet → Initial balance: 10,000 XLM
Pledge 2000 XLM → New balance: 8,000 XLM
```

### Tab 3 - Charlie (Funder)
```
Login: charlie@example.com / charlie123
Connect Wallet → Initial balance: 10,000 XLM
Pledge 4000 XLM → New balance: 6,000 XLM
```

### Verify Balances
```javascript
// Check all balances
window.walletBalance.getAll()
```

## Data Structure

### localStorage Keys
```javascript
{
  "stellarpledge_wallet_balances": {
    "GXXXXX...": 10000,  // Alice's wallet
    "GYYYYYY...": 8000,   // Bob's wallet (after 2000 pledge)
    "GZZZZZ...": 6000     // Charlie's wallet (after 4000 pledge)
  }
}
```

### Campaign Pledge Object
```javascript
{
  id: 1234567890,
  funderId: "user-123",
  funderName: "Bob",
  funderPublicKey: "GYYYYYY...",  // NEW: Store for fund transfers
  amount: 2000,
  timestamp: "2025-10-26T...",
  earnedReward: false
}
```

## Future Enhancements

### Campaign Approval Flow
When creator accepts campaign funds:
```javascript
// Transfer all pledges to creator
campaign.pledges.forEach(pledge => {
  window.walletBalance.transfer(
    pledge.funderPublicKey,
    campaign.creatorPublicKey,
    pledge.amount
  );
});
```

### Refund Flow
When creator declines or campaign fails:
```javascript
// Refund all pledges
campaign.pledges.forEach(pledge => {
  window.walletBalance.add(
    pledge.funderPublicKey,
    pledge.amount
  );
});
```

## Balance Validation

### Pledge Validation
```javascript
const currentBalance = getBalance(publicKey);
if (amount > currentBalance) {
  throw new Error("Insufficient balance");
}
```

### Balance Display
- Header shows balance: "10,000.00 XLM"
- Updates in real-time after pledge
- Works across all tabs

## Event System

### Balance Update Event
```javascript
window.dispatchEvent(new CustomEvent('balance-update', { 
  detail: { publicKey, balance: newBalance } 
}));
```

### Listeners
- WalletContext: Updates balance state
- WalletDashboard: Refreshes display
- Campaign pages: Can react to changes

## Production Considerations

⚠️ **Current Implementation (Demo Only)**
- Balances stored in localStorage
- No actual Stellar transactions
- No network validation
- Easy to manipulate in console

🔒 **Production Requirements**
- Integrate with Stellar Horizon API
- Real transaction signing
- Network fee calculation
- Proper error handling
- Transaction history
- Multi-signature support

## Troubleshooting

### Balance Shows 0
```javascript
// Check if balance is initialized
window.walletBalance.getAll()

// Initialize manually
const publicKey = "GXXXXX...";
window.walletBalance.init(publicKey, 10000)

// Reload page
```

### Balance Not Updating
```javascript
// Check wallet connection
window.walletBalance.get(publicKey)

// Force update
window.dispatchEvent(new Event('balance-update'))
```

### Multiple Tabs Issues
- Each tab maintains its own React state
- localStorage shared across tabs
- Events only fire within same tab
- Refresh other tabs to see changes

## Summary

✅ **Implemented:**
- Mock balance system (10,000 XLM per wallet)
- Balance deduction on pledge
- Real-time UI updates
- Debug commands
- Multi-tab support

⏳ **Todo:**
- Campaign approval → transfer funds to creator
- Campaign refund → return funds to backers
- Transaction history
- Balance validation on backend

The system is now ready for demonstration! Users can pledge with their mock balances and see real-time updates. 🚀
