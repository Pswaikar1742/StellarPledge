# 🔧 StellarPledge Troubleshooting Guide

## Common Errors and Solutions

### ❌ Error: "Failed to create campaign: Request failed with status code 400"

**Cause:** This error occurs when trying to submit a Soroban smart contract transaction without proper simulation and preparation.

**Solution:** ✅ **FIXED!** The app now:
1. Simulates the transaction first using `server.simulateTransaction()`
2. Prepares the transaction with correct resource fees using `SorobanRpc.assembleTransaction()`
3. Then signs and submits the prepared transaction

**What was changed:**
- Added transaction simulation before submission
- Added transaction assembly with simulation results
- Improved error messages to show detailed Horizon response codes

---

### 🔍 Other Common Issues

#### 1. **"Please connect your wallet first"**
- **Solution:** Enter your Stellar testnet secret key (starts with `S...`) in the wallet connection field
- Get a testnet account at: https://laboratory.stellar.org/#account-creator?network=test

#### 2. **"Failed to connect wallet. Check your secret key..."**
- **Solution:** 
  - Verify your secret key is correct
  - Ensure the account exists on Stellar Testnet (not Mainnet)
  - Check that the account is funded with at least 1 XLM

#### 3. **"Failed to load campaigns"**
- **Solution:**
  - This is normal if no campaigns exist yet
  - Create your first campaign to test the system
  - Refresh the page and try again

#### 4. **Transaction takes too long / Times out**
- **Solution:**
  - Wait 5-10 seconds for Stellar network confirmation
  - Check your internet connection
  - Verify the testnet is operational at: https://status.stellar.org/

#### 5. **"Simulation failed" errors**
- **Possible causes:**
  - Insufficient XLM balance
  - Invalid campaign parameters (goal must be > 0, deadline in future)
  - Network connectivity issues
- **Solution:**
  - Check browser console (F12) for detailed error logs
  - Ensure you have at least 10 XLM for testing
  - Verify campaign parameters are valid

---

## 🔬 Debugging Tips

### View Detailed Logs
1. Open browser Developer Tools (F12)
2. Go to **Console** tab
3. Look for error messages and transaction details

### Check Transaction Status
1. Copy the transaction hash from console logs
2. Visit: https://stellar.expert/explorer/testnet
3. Search for your transaction to see full details

### Verify Contract Deployment
- Contract Address: `CBBHYAHLF4FJWFMIX4ZZTGVWVL3M452TI4REVYJ64U6WGOKR2VFWOBO7`
- Explorer: https://stellar.expert/explorer/testnet/contract/CBBHYAHLF4FJWFMIX4ZZTGVWVL3M452TI4REVYJ64U6WGOKR2VFWOBO7

### Test Account Requirements
- Minimum balance: **2 XLM** (for base reserve + fees)
- Recommended: **10+ XLM** for comfortable testing
- Network: **Testnet** (not Mainnet!)

---

## 📊 Expected Behavior

### Creating a Campaign
1. Enter funding goal (e.g., 100000 stroops = 100 XLM)
2. Enter deadline in hours (e.g., 500 hours)
3. Click "Create Campaign"
4. See "Creating campaign..." message
5. Transaction simulates (2-3 seconds)
6. Transaction submits (2-5 seconds)
7. See "Campaign created successfully!" message
8. Campaign appears in the list below

### Making a Pledge
1. Click on a campaign card
2. Enter pledge amount
3. Click "Pledge Now"
4. Transaction processes (5-10 seconds)
5. See success message
6. Campaign updates with new pledge amount

---

## 🆘 Still Having Issues?

### Quick Fixes to Try
1. **Hard refresh the page:** `Ctrl + Shift + R` (or `Cmd + Shift + R` on Mac)
2. **Clear browser cache** and reload
3. **Try a different browser** (Chrome, Firefox, Edge)
4. **Check testnet status:** https://status.stellar.org/

### Get Help
- Check console logs for specific error messages
- Verify your account has sufficient XLM balance
- Ensure you're using Testnet (not Mainnet) accounts
- Double-check the contract address matches: `CBBHYAHLF4FJWFMIX4ZZTGVWVL3M452TI4REVYJ64U6WGOKR2VFWOBO7`

### Testnet Resources
- **Account Creator:** https://laboratory.stellar.org/#account-creator?network=test
- **Transaction Builder:** https://laboratory.stellar.org/#txbuilder
- **Explorer:** https://stellar.expert/explorer/testnet
- **Horizon API:** https://horizon-testnet.stellar.org

---

## ✅ Verification Checklist

Before reporting an issue, verify:
- [ ] Using a Testnet account (not Mainnet)
- [ ] Account has at least 10 XLM balance
- [ ] Browser console shows no CORS or network errors
- [ ] Using latest version of the code (git pull)
- [ ] stellar-sdk is loaded (check browser console)
- [ ] No ad blockers interfering with requests

---

## 🎯 Success Indicators

You'll know everything is working when:
- ✅ Wallet connects and shows your balance
- ✅ "Create Campaign" section becomes visible
- ✅ Campaign creation completes in under 15 seconds
- ✅ Created campaigns appear in the list
- ✅ You can click campaigns to view details
- ✅ Console logs show successful transaction hashes

---

**Last Updated:** October 25, 2025  
**Version:** 1.1 (with simulation fix)
