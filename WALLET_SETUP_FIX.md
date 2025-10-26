# 🔧 Wallet Setup Fix Guide

## Problem

You're seeing **"Account not found"** errors because Alice created a NEW wallet instead of importing her funded testnet wallet.

### Error in Console:
```
Account not found: GA5F6LEDNT3JPTC4L4JVYC2X1D17J6AMP13JJJJ2JZVMZKEQS0QLWXAD
```

### Why This Happens:
- Alice clicked "Create New Wallet" which generated a random new Stellar keypair
- This new account has NO XLM balance and doesn't exist on the blockchain
- Alice needs to use her **FUNDED testnet account** instead

---

## ✅ Solution: Import Alice's Funded Wallet

### Step 1: Clear Current Wallet (IMPORTANT!)

1. Open browser console (F12)
2. Run:
```javascript
localStorage.clear();
location.reload();
```

### Step 2: Login as Alice

1. Go to `http://localhost:3000`
2. Login with:
   - Email: `alice@example.com`
   - Password: `alice123`
   - Role: **Creator**

### Step 3: Import Alice's FUNDED Wallet

When you see the wallet connection screen, click **"Import Existing Wallet"** and enter:

**Alice's Secret Key:**
```
SAH6ZOC6X4PVOHU7NQQ25KVWI2AGAHALTXI3N7UF4DLYUYJAJF22I7IF
```

**Password (to encrypt the key):**
```
alice123
```

### Step 4: Verify Connection

After importing, you should see:
- ✅ Public Key: `GDMT3KZ3Q4S5YKPBCI7BGJB5H3ST7GF2IFRJVU34WEIE5UX5NZTW5FTF`
- ✅ Balance: ~1000 XLM
- ✅ Network: Testnet

---

## 📋 All Funded Demo Accounts

### Alice (Creator)
```
Secret Key: SAH6ZOC6X4PVOHU7NQQ25KVWI2AGAHALTXI3N7UF4DLYUYJAJF22I7IF
Public Key: GDMT3KZ3Q4S5YKPBCI7BGJB5H3ST7GF2IFRJVU34WEIE5UX5NZTW5FTF
Balance: 1,000 XLM
```

### Bob (Funder)
```
Secret Key: SCSKUYSJ3DVI4WIP76D3DKPDEZFBHGHIWZGAFV7VGUV2BPD3OWG37L24
Public Key: GBRQJC25TYCXJVPMGAHW6NRTMJXVWIVSBKDYFQGQWBMQ6QDUBHICJRYP
Balance: 1,000 XLM
```

### Charlie (Funder)
```
Secret Key: SC46VIQ2MJGK5VXBH6T3QFFGW7F3RBMKKCUEXWQ3SDWVH4YM3H7N5GCJ
Public Key: GAVXZJQIXJZF2XZTHKYDTQXHFEXGZKZLSF2ZPX2VDVLWQE7ZVKGBTVNM
Balance: 1,000 XLM
```

---

## 🚫 Common Mistakes to Avoid

### ❌ DON'T: Create New Wallets
When you click "Create New Wallet", you get a random keypair that:
- Has 0 XLM balance
- Doesn't exist on the blockchain
- Can't interact with smart contracts

### ✅ DO: Import Funded Wallets
Always use "Import Existing Wallet" with the secret keys from `demo-accounts/` folder.

---

## 🔍 How to Verify Your Wallet is Correct

After connecting, check your public key matches:

**Alice should have:**
- Public Key: `GDMT3K...W5FTF`
- NOT: `GA5F6L...QLWXAD` (this is a new unfunded account)

**Check on Stellar Expert:**
https://stellar.expert/explorer/testnet/account/GDMT3KZ3Q4S5YKPBCI7BGJB5H3ST7GF2IFRJVU34WEIE5UX5NZTW5FTF

You should see:
- ✅ Account exists
- ✅ Has XLM balance
- ✅ Transaction history

---

## 🎯 Quick Test After Setup

1. **Alice** should see her balance (~1000 XLM)
2. Click "Create Campaign"
3. Fill in campaign details:
   - Title: Test Campaign
   - Goal: 100 XLM
   - Deadline: Tomorrow
4. Submit → Should work without "Account not found" error!

---

## 🆘 Still Having Issues?

### Clear Everything and Start Fresh:
```javascript
// In browser console (F12)
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### Verify Funded Accounts on Stellar Expert:
- [Alice's Account](https://stellar.expert/explorer/testnet/account/GDMT3KZ3Q4S5YKPBCI7BGJB5H3ST7GF2IFRJVU34WEIE5UX5NZTW5FTF)
- [Bob's Account](https://stellar.expert/explorer/testnet/account/GBRQJC25TYCXJVPMGAHW6NRTMJXVWIVSBKDYFQGQWBMQ6QDUBHICJRYP)
- [Charlie's Account](https://stellar.expert/explorer/testnet/account/GAVXZJQIXJZF2XZTHKYDTQXHFEXGZKZLSF2ZPX2VDVLWQE7ZVKGBTVNM)

All three accounts should show as funded and active on Stellar Testnet.

---

**Remember:** Always use "Import Existing Wallet" with the provided secret keys, never "Create New Wallet" for demos! 🔑
