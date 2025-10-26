# 🧪 StellarPledge Complete Testing Guide

## ✅ System Status

**Application Running:** https://localhost:3000  
**Network:** Stellar Testnet  
**Smart Contract:** CD4L4MPVSJ3RLAUYQ3ID2M75VWVVMDFBTESJIY4UULFFN33X2KNRTJXY  
**Standalone Wallet:** ✅ Fully Integrated  

---

## 📋 Pre-Test Checklist

- [x] Smart contract deployed on testnet
- [x] Frontend running on https://localhost:3000
- [x] Standalone wallet components integrated
- [x] Demo accounts ready (Alice, Bob, Charlie)
- [x] Error handling system implemented
- [x] WalletService with encryption ready
- [ ] Open browser to https://localhost:3000
- [ ] Have demo account credentials ready

---

## 🎯 Test Scenarios

### Test 1: Create New Wallet 🆕

**Objective:** Test wallet creation with password encryption

**Steps:**
1. Open https://localhost:3000
2. Click **"Create New Wallet"**
3. Enter:
   - Wallet Name: `Test Wallet`
   - Password: `testpassword123`
   - Confirm Password: `testpassword123`
4. Click **"Create Wallet"**

**Expected Results:**
- ✅ New keypair generated
- ✅ Backup screen shows public key (G...)
- ✅ Backup screen shows secret key (S...)
- ✅ Warning to save secret key
- ✅ Copy buttons work
- ✅ After confirmation, shows WalletDashboard
- ✅ Balance shows 0 XLM (unfunded account)

**Test Cases:**
- [ ] Password less than 8 chars → Error message
- [ ] Passwords don't match → Error message
- [ ] Copy public key → Clipboard works
- [ ] Copy secret key → Clipboard works
- [ ] Show/Hide secret key → Toggles visibility

---

### Test 2: Import Alice's Wallet (Creator) 📥

**Objective:** Test wallet import with existing account

**Alice's Credentials:**
```
Public Key: GDMT3KZ3Q4S5YKPBCI7BGJB5H3ST7GF2IFRJVU34WEIE5UX5NZTW5FTF
Secret Key: SAH6ZOC6X4PVOHU7NQQ25KVWI2AGAHALTXI3N7UF4DLYUYJAJF22I7IF
Expected Balance: ~9,999 XLM
```

**Steps:**
1. If wallet connected, disconnect it first
2. Click **"Import Existing Wallet"**
3. Enter:
   - Secret Key: `SAH6ZOC6X4PVOHU7NQQ25KVWI2AGAHALTXI3N7UF4DLYUYJAJF22I7IF`
   - Password: `alice123`
   - Wallet Name: `Alice (Film Director)`
4. Click **"Import Wallet"**

**Expected Results:**
- ✅ Secret key validated
- ✅ Account verified on blockchain
- ✅ Success message appears
- ✅ WalletDashboard shows:
  - Name: Alice (Film Director) 📥
  - Public Key: GDMT...5FTF
  - Balance: ~9,999 XLM
  - Status: Ready to Sign ✅
  - Network: TESTNET

**Test Cases:**
- [ ] Invalid secret key → Error: "Invalid secret key format"
- [ ] Wrong format (not starting with S) → Error message
- [ ] Account verified on blockchain → Success
- [ ] Balance loaded correctly → ~9,999 XLM

---

### Test 3: Connect Read-Only (Charlie) 👁️

**Objective:** Test read-only mode for viewing

**Charlie's Public Key:**
```
GC4GCLLQEERQXIHNYITVQINGT54UK3ZPHR5ACC6QKS2TKVS4YL3X7YVP
```

**Steps:**
1. Disconnect current wallet
2. Click **"Connect Read-Only"**
3. Enter:
   - Public Key: `GC4GCLLQEERQXIHNYITVQINGT54UK3ZPHR5ACC6QKS2TKVS4YL3X7YVP`
   - Wallet Name: `Charlie (Read-Only)`
4. Click **"Connect"**

**Expected Results:**
- ✅ Public key validated
- ✅ Account verified on blockchain
- ✅ WalletDashboard shows:
  - Name: Charlie (Read-Only) 👁️
  - Status badge: Read-Only
  - Balance visible
  - No "Lock" button (read-only can't sign)
  - Only "Disconnect" button

**Test Cases:**
- [ ] Invalid public key → Error message
- [ ] Wrong format (not starting with G) → Error
- [ ] Account not found → Error: "Account not found on blockchain"
- [ ] Read-only badge visible → ✅
- [ ] Cannot attempt to sign transactions

---

### Test 4: Lock/Unlock Wallet 🔒

**Objective:** Test security with lock/unlock functionality

**Steps:**
1. Import Alice's wallet (if not already)
2. Verify wallet is unlocked (shows "Ready to Sign")
3. Click **"Lock"** button in WalletDashboard
4. Observe wallet locks
5. Try to perform any action requiring signature
6. UnlockWallet screen appears
7. Enter password: `alice123`
8. Click **"Unlock Wallet"**

**Expected Results:**
- ✅ Lock button works
- ✅ Wallet status changes to "Locked" 🔒
- ✅ Keypair cleared from memory
- ✅ Still shows public key and balance
- ✅ UnlockWallet prompt appears
- ✅ Correct password unlocks wallet
- ✅ Wrong password shows error
- ✅ After unlock: "Ready to Sign" ✅

**Test Cases:**
- [ ] Lock wallet → Keypair cleared
- [ ] Try wrong password → Error message
- [ ] Try correct password → Unlocks successfully
- [ ] Public key still visible when locked
- [ ] Balance still visible when locked
- [ ] Cannot sign when locked

---

### Test 5: Wallet Persistence 💾

**Objective:** Test localStorage persistence

**Steps:**
1. Import Alice's wallet
2. Note the wallet is connected
3. Refresh the page (F5)
4. Observe wallet state

**Expected Results:**
- ✅ Wallet still connected after refresh
- ✅ Public key restored
- ✅ Wallet type restored
- ✅ Wallet name restored
- ✅ Wallet is locked (requires password)
- ✅ After unlock, balance reloads

**Test Cases:**
- [ ] Public key persisted → ✅
- [ ] Wallet type persisted → "imported"
- [ ] Wallet locked after refresh → Secure
- [ ] Balance reloads after unlock → ✅

---

### Test 6: Disconnect Wallet 👋

**Objective:** Test complete wallet disconnection

**Steps:**
1. Connect any wallet
2. Click **"Disconnect"** button
3. Observe state change

**Expected Results:**
- ✅ Returns to WalletConnect screen
- ✅ Three options visible: Create, Import, Read-Only
- ✅ localStorage cleared
- ✅ Wallet state reset
- ✅ No wallet info visible

**Test Cases:**
- [ ] Disconnect clears state → ✅
- [ ] localStorage cleared → No wallet data
- [ ] Returns to connection screen → ✅
- [ ] Can connect new wallet → ✅

---

### Test 7: Switch Between Wallets 🔄

**Objective:** Test switching between different accounts

**Steps:**
1. Import Alice's wallet
2. Note balance (~9,999 XLM)
3. Disconnect
4. Import Bob's wallet
   - Secret Key: (from demo-accounts/Bob.txt)
   - Password: `bob123`
5. Note different balance
6. Disconnect
7. Connect Charlie read-only

**Expected Results:**
- ✅ Each wallet shows correct public key
- ✅ Each wallet shows correct balance
- ✅ Wallet types correct (imported/read-only)
- ✅ No data leak between wallets
- ✅ Clean switch every time

---

### Test 8: Balance Display 💰

**Objective:** Test real-time balance queries

**Steps:**
1. Import Alice's wallet
2. Check balance displayed in WalletDashboard
3. Click balance refresh (if available)
4. Verify balance matches Stellar Expert

**Expected Results:**
- ✅ Balance loads automatically on connect
- ✅ Shows XLM balance prominently
- ✅ Balance formatted correctly (2 decimals)
- ✅ Matches Stellar Expert balance
- ✅ Updates after transactions (when implemented)

**Verify on Stellar Expert:**
https://stellar.expert/explorer/testnet/account/GDMT3KZ3Q4S5YKPBCI7BGJB5H3ST7GF2IFRJVU34WEIE5UX5NZTW5FTF

---

### Test 9: Error Handling ⚠️

**Objective:** Test error scenarios

**Test Cases:**

**9.1: Invalid Secret Key**
- Input: `INVALID_SECRET_KEY`
- Expected: "Invalid secret key format"

**9.2: Invalid Public Key**
- Input: `INVALID_PUBLIC_KEY`
- Expected: "Invalid public key format"

**9.3: Unfunded Account (Create Wallet)**
- Create new wallet
- Expected: Balance shows 0 XLM

**9.4: Network Issues**
- Disconnect internet
- Try to connect wallet
- Expected: Network error message

**9.5: Wrong Password**
- Lock wallet
- Enter wrong password
- Expected: "Failed to unlock wallet. Wrong password?"

**9.6: Password Too Short**
- Create/Import with password < 8 chars
- Expected: "Password must be at least 8 characters"

---

### Test 10: UI/UX Testing 🎨

**Objective:** Test user interface and experience

**Test Cases:**

**10.1: Responsive Design**
- [ ] Desktop view (1920x1080) → Looks good
- [ ] Tablet view (768px) → Responsive
- [ ] Mobile view (375px) → Mobile-friendly

**10.2: Button States**
- [ ] Buttons show loading state
- [ ] Buttons disabled when processing
- [ ] Success/error feedback visible
- [ ] Hover states work

**10.3: Forms**
- [ ] Input fields have labels
- [ ] Placeholders are helpful
- [ ] Required fields marked
- [ ] Validation messages clear
- [ ] Tab order logical

**10.4: Copy to Clipboard**
- [ ] Copy public key → Works
- [ ] Copy secret key → Works
- [ ] Feedback after copy → "Copied!"

---

## 🚀 Next Steps: Campaign Testing (Coming Soon)

Once campaign UI is built, test:

1. **Create Campaign (Alice)**
   - Goal: 1,000 XLM
   - Deadline: 30 days
   - Perk: 1 FILMCREDIT for 500+ XLM

2. **Make Pledge (Bob)**
   - Pledge 100 XLM
   - Below perk threshold
   - No automatic reward

3. **Make Pledge with Perk (Charlie)**
   - Pledge 500 XLM
   - Meets perk threshold
   - Automatic FILMCREDIT reward

4. **Claim Funds (Alice)**
   - Campaign successful
   - Claim funds
   - Verify balance increase

---

## 📊 Test Results Tracking

### Test Execution Summary

| Test # | Test Name | Status | Notes |
|--------|-----------|--------|-------|
| 1 | Create New Wallet | ⏳ | Run manually |
| 2 | Import Alice | ⏳ | Run manually |
| 3 | Read-Only Charlie | ⏳ | Run manually |
| 4 | Lock/Unlock | ⏳ | Run manually |
| 5 | Persistence | ⏳ | Run manually |
| 6 | Disconnect | ⏳ | Run manually |
| 7 | Switch Wallets | ⏳ | Run manually |
| 8 | Balance Display | ⏳ | Run manually |
| 9 | Error Handling | ⏳ | Run manually |
| 10 | UI/UX | ⏳ | Run manually |

**Legend:**
- ⏳ Pending
- ✅ Passed
- ❌ Failed
- ⚠️ Partial

---

## 🐛 Known Issues

**Current:**
- None yet (first test run)

**To Address:**
- Campaign UI not yet built
- Pledge flow not yet implemented
- Need to create FILMCREDIT asset
- Need to test complete demo flow

---

## 📝 Testing Checklist

### Pre-Test Setup
- [ ] Frontend running at https://localhost:3000
- [ ] Browser open and ready
- [ ] Demo account credentials accessible
- [ ] Stellar Expert open for verification

### Core Wallet Tests
- [ ] Test 1: Create New Wallet
- [ ] Test 2: Import Alice's Wallet
- [ ] Test 3: Connect Read-Only (Charlie)
- [ ] Test 4: Lock/Unlock Wallet
- [ ] Test 5: Wallet Persistence
- [ ] Test 6: Disconnect Wallet
- [ ] Test 7: Switch Between Wallets
- [ ] Test 8: Balance Display
- [ ] Test 9: Error Handling
- [ ] Test 10: UI/UX Testing

### Documentation
- [ ] Take screenshots of each test
- [ ] Note any bugs or issues
- [ ] Document edge cases
- [ ] Update test results table

---

## 🎯 Success Criteria

✅ **System is ready for hackathon demo if:**

1. All three connection modes work flawlessly
2. Wallet persistence works across refreshes
3. Lock/unlock functions properly
4. Balance queries work correctly
5. Error handling is comprehensive
6. UI is responsive and user-friendly
7. No console errors (except warnings)
8. Can switch between wallets smoothly
9. Read-only mode prevents signing
10. Password encryption works securely

---

## 📞 Support

**If you encounter issues:**

1. Check browser console (F12) for errors
2. Verify network connection
3. Check Stellar Expert for account status
4. Review error messages carefully
5. Consult documentation:
   - `docs/STANDALONE-WALLET.md`
   - `docs/STANDALONE-WALLET-QUICKSTART.md`
   - `docs/STANDALONE-WALLET-IMPLEMENTATION.md`

---

## 🎊 Ready to Test!

**Application URL:** https://localhost:3000

**Start Testing Now:**
1. Open browser to https://localhost:3000
2. Follow Test 1: Create New Wallet
3. Work through all 10 test scenarios
4. Document results
5. Report any issues

**Good luck with testing! 🚀**
