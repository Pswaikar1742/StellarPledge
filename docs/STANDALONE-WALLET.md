# StellarPledge Standalone Wallet System

## Overview

StellarPledge now features a **fully integrated standalone wallet system** that eliminates the dependency on Freighter browser extension. Users can create, import, or connect wallets directly within the StellarPledge UI.

## Architecture Changes

### What Changed?

1. **Removed Freighter Dependency**
   - No longer requires Freighter browser extension
   - All wallet operations handled in-app
   - Direct integration with Stellar SDK

2. **New Components**
   - `WalletService.js` - Core wallet management service
   - `WalletConnect.js` - Unified wallet connection UI
   - `WalletDashboard.js` - Connected wallet display
   - `UnlockWallet.js` - Password prompt for locked wallets

3. **Updated Components**
   - `WalletContext.js` - Now uses `WalletService` instead of Freighter
   - `Soroban.js` - Signs transactions using `WalletService`

---

## Three Connection Modes

### 1. Create New Wallet 🆕

**Best for:** New users, hackathon demo accounts

**Process:**
1. User enters wallet name (optional) and password
2. System generates new Stellar keypair
3. Secret key is encrypted with password and stored locally
4. User receives:
   - Public key (address)
   - Secret key (for backup)
   - Recovery mnemonic phrase

**Security:**
- Secret key encrypted using password-based XOR encryption
- Stored only in browser's localStorage
- Never sent to any server

**Example Code:**
```javascript
import { useWallet } from './context/WalletContext';

function CreateWalletButton() {
  const { createWallet } = useWallet();
  
  const handleCreate = async () => {
    const result = await createWallet("My Wallet", "secure_password");
    console.log("Created:", result.publicKey);
    alert(`Save your secret key: ${result.secretKey}`);
  };
  
  return <button onClick={handleCreate}>Create Wallet</button>;
}
```

---

### 2. Import Existing Wallet 📥

**Best for:** Users with existing Stellar accounts, returning users

**Process:**
1. User enters their secret key (starts with `S`)
2. User sets a password to encrypt the key locally
3. System validates the secret key format
4. Checks if account exists on blockchain
5. Secret key encrypted and stored

**Security:**
- Original secret key validated before storage
- Encrypted with user's chosen password
- Account verification against Horizon API

**Example Code:**
```javascript
const { importWallet } = useWallet();

const handleImport = async (secretKey, password) => {
  try {
    const result = await importWallet(secretKey, password, "Imported Wallet");
    console.log("Imported:", result.publicKey);
  } catch (error) {
    console.error("Import failed:", error);
  }
};
```

---

### 3. Connect Read-Only 👁️

**Best for:** Viewing campaigns, checking balances, monitoring accounts

**Process:**
1. User enters public key (starts with `G`)
2. System validates public key format
3. Verifies account exists on blockchain
4. Connects without signing capability

**Limitations:**
- Cannot sign transactions
- Cannot create campaigns, pledge, or claim funds
- Can only view data

**Example Code:**
```javascript
const { connectReadOnly } = useWallet();

const handleConnect = async (publicKey) => {
  const result = await connectReadOnly(publicKey, "Watch Wallet");
  console.log("Connected read-only:", result.publicKey);
};
```

---

## Wallet Service API

### Core Methods

#### `createWallet(walletName, password)`
Creates a new Stellar wallet.

**Parameters:**
- `walletName` (string) - Optional display name
- `password` (string) - Min 8 characters, used for encryption

**Returns:**
```javascript
{
  publicKey: "G...",     // Public address
  secretKey: "S...",     // Secret key (backup immediately!)
  mnemonic: "word1 word2 ...", // Recovery phrase
  success: true
}
```

---

#### `importWallet(secretKey, password, walletName)`
Imports existing wallet from secret key.

**Parameters:**
- `secretKey` (string) - Stellar secret key (starts with S)
- `password` (string) - Encryption password
- `walletName` (string) - Optional display name

**Returns:**
```javascript
{
  publicKey: "G...",
  success: true
}
```

---

#### `connectReadOnly(publicKey, walletName)`
Connects wallet in read-only mode.

**Parameters:**
- `publicKey` (string) - Stellar public key (starts with G)
- `walletName` (string) - Optional display name

**Returns:**
```javascript
{
  publicKey: "G...",
  success: true,
  readonly: true
}
```

---

#### `unlockWallet(password)`
Unlocks a locked wallet for signing.

**Parameters:**
- `password` (string) - User's password

**Returns:** `boolean` - Success status

---

#### `lockWallet()`
Locks wallet (clears keypair from memory).

---

#### `disconnectWallet()`
Completely disconnects and clears all wallet data.

---

#### `signTransaction(transaction)`
Signs a Stellar transaction.

**Parameters:**
- `transaction` (Transaction) - Stellar SDK transaction object

**Returns:** Signed transaction

**Throws:** Error if wallet is locked or read-only

---

#### `getBalance(publicKey?)`
Fetches account balance from blockchain.

**Parameters:**
- `publicKey` (string, optional) - Defaults to current wallet

**Returns:**
```javascript
{
  publicKey: "G...",
  balances: [
    {
      asset_type: "native",
      asset_code: "XLM",
      balance: "9999.0000000"
    }
  ],
  sequence: "123456789"
}
```

---

## Security Model

### Encryption

**Method:** Password-based XOR encryption (basic)

**Note:** This is a demo implementation. For production, use:
- AES-256 encryption
- PBKDF2 key derivation
- Secure random salt generation

**Current Implementation:**
```javascript
class SimpleEncryption {
  static encrypt(text, password) {
    const encrypted = text.split('').map((char, i) => {
      const keyChar = password.charCodeAt(i % password.length);
      return String.fromCharCode(char.charCodeAt(0) ^ keyChar);
    }).join('');
    return btoa(encrypted);
  }
  
  static decrypt(encrypted, password) {
    const decoded = atob(encrypted);
    return decoded.split('').map((char, i) => {
      const keyChar = password.charCodeAt(i % password.length);
      return String.fromCharCode(char.charCodeAt(0) ^ keyChar);
    }).join('');
  }
}
```

---

### Storage

**Location:** Browser localStorage

**Keys:**
- `stellarpledge_wallet_type` - "created", "imported", or "readonly"
- `stellarpledge_public_key` - Public address
- `stellarpledge_encrypted_secret` - Encrypted secret key (not for read-only)
- `stellarpledge_wallet_name` - Display name

**Security Considerations:**
- localStorage is origin-specific
- Secret keys never stored in plain text
- Read-only wallets have no secret key stored
- Data cleared on disconnect

---

### Password Requirements

- Minimum 8 characters
- Used for local encryption only
- Never sent to any server
- Required for created/imported wallets
- Not required for read-only mode

---

## Integration with Smart Contracts

### Transaction Signing Flow

**Before (with Freighter):**
```javascript
// 1. Build transaction
// 2. Convert to XDR
// 3. Send XDR to Freighter extension
// 4. User approves in extension popup
// 5. Receive signed XDR
// 6. Rebuild transaction from XDR
// 7. Submit to blockchain
```

**Now (Standalone):**
```javascript
// 1. Build transaction
// 2. Prepare transaction (simulate)
// 3. Sign directly with WalletService
// 4. Submit to blockchain
```

**Simplified Code:**
```javascript
// In Soroban.js
const preparedTx = await provider.prepareTransaction(transaction);
const signedTx = await WalletService.signTransaction(preparedTx);
const result = await provider.sendTransaction(signedTx);
```

---

## Usage Examples

### Complete Campaign Creation Flow

```javascript
import { useWallet } from './context/WalletContext';
import { createCampaign } from './components/Soroban/Soroban';

function CreateCampaignForm() {
  const { publicKey, isLocked, isReadOnly, unlockWallet } = useWallet();
  
  const handleCreateCampaign = async () => {
    // Check wallet status
    if (!publicKey) {
      alert("Please connect wallet first");
      return;
    }
    
    if (isReadOnly) {
      alert("Cannot sign transactions in read-only mode");
      return;
    }
    
    if (isLocked) {
      const password = prompt("Enter password to unlock wallet:");
      await unlockWallet(password);
    }
    
    // Create campaign
    try {
      const campaignId = await createCampaign(
        publicKey,
        1000, // goal in XLM
        720,  // 720 hours (30 days)
        {
          threshold: 500,
          assetAddress: "FILMCREDIT_ADDRESS",
          amount: 100
        }
      );
      
      alert(`Campaign ${campaignId} created!`);
    } catch (error) {
      console.error("Campaign creation failed:", error);
    }
  };
  
  return <button onClick={handleCreateCampaign}>Create Campaign</button>;
}
```

---

### Pledge with Balance Check

```javascript
import { useWallet } from './context/WalletContext';
import { pledge } from './components/Soroban/Soroban';
import { NATIVE_XLM_ADDRESS } from './constants/constants';

function PledgeButton({ campaignId, amount }) {
  const { publicKey, balance, loadBalance, isLocked, unlockWallet } = useWallet();
  
  const handlePledge = async () => {
    // Load latest balance
    await loadBalance();
    
    // Check balance
    const xlmBalance = balance.balances.find(b => b.asset_code === "XLM");
    if (parseFloat(xlmBalance.balance) < amount) {
      alert("Insufficient balance!");
      return;
    }
    
    // Unlock if needed
    if (isLocked) {
      const password = prompt("Enter password:");
      await unlockWallet(password);
    }
    
    // Make pledge
    try {
      await pledge(publicKey, campaignId, amount, NATIVE_XLM_ADDRESS);
      alert(`Pledged ${amount} XLM successfully!`);
      await loadBalance(); // Refresh balance
    } catch (error) {
      console.error("Pledge failed:", error);
    }
  };
  
  return <button onClick={handlePledge}>Pledge {amount} XLM</button>;
}
```

---

## UI Component Integration

### Main App Layout

```javascript
import { useWallet } from './context/WalletContext';
import WalletConnect from './components/Wallet/WalletConnect';
import WalletDashboard from './components/Wallet/WalletDashboard';
import UnlockWallet from './components/Wallet/UnlockWallet';

function App() {
  const { isConnected, isLocked } = useWallet();
  
  return (
    <div>
      {!isConnected && <WalletConnect />}
      {isConnected && !isLocked && <WalletDashboard />}
      {isConnected && isLocked && <UnlockWallet />}
      
      {isConnected && !isLocked && (
        <CampaignList />
      )}
    </div>
  );
}
```

---

## Testing with Demo Accounts

### Alice (Creator)

Use Alice's secret key to import her wallet:

```javascript
// In demo-accounts/Alice.txt
Secret Key: [Alice's secret key from demo-accounts/Alice.txt]
Public Key: GDMT3KZ3Q4S5YKPBCI7BGJB5H3ST7GF2IFRJVU34WEIE5UX5NZTW5FTF
```

**Test Flow:**
1. Import Alice's wallet
2. Create campaign with FILMCREDIT perk
3. Set goal 1000 XLM, threshold 500 XLM
4. Deadline 30 days

### Bob (Student)

Import Bob's wallet and make small pledge:

```javascript
// Pledge 100 XLM to Alice's campaign
await pledge(bobPublicKey, campaignId, 100, NATIVE_XLM_ADDRESS);
```

### Charlie (Investor)

Connect Charlie read-only to view, then import to pledge:

```javascript
// First: Connect read-only to view campaigns
await connectReadOnly("GC4GCLLQEERQXIHNYITVQINGT54UK3ZPHR5ACC6QKS2TKVS4YL3X7YVP");

// Then: Import with secret key to pledge 500 XLM (gets perk!)
await importWallet(charlieSecretKey, "password");
await pledge(charliePublicKey, campaignId, 500, NATIVE_XLM_ADDRESS);
```

---

## Migration from Freighter

### For Existing Users

If users previously connected with Freighter:

1. **Disconnect Freighter wallet** (if connected)
2. **Choose import option** in StellarPledge
3. **Enter secret key** from Freighter wallet
4. **Set local password**
5. **Continue using same account**

### Code Changes

**Old (Freighter):**
```javascript
import { requestAccess, signTransaction } from '@stellar/freighter-api';

const publicKey = await requestAccess();
const signedXDR = await signTransaction(xdr, "TESTNET", publicKey);
```

**New (Standalone):**
```javascript
import WalletService from './services/WalletService';

await WalletService.importWallet(secretKey, password);
const signedTx = await WalletService.signTransaction(transaction);
```

---

## Best Practices

### 1. Always Show Backup Warning

When creating wallets, prominently display:
- Secret key (one-time display)
- Recovery mnemonic
- Warning about loss of funds if lost

### 2. Password Strength

Enforce strong passwords:
- Minimum 8 characters
- Recommend 12+ characters
- Mix of letters, numbers, symbols

### 3. Balance Checks

Always check balance before transactions:
```javascript
await loadBalance();
if (balance < requiredAmount + fees) {
  throw new Error("Insufficient balance");
}
```

### 4. Lock Wallet After Inactivity

Implement auto-lock after 15 minutes:
```javascript
let inactivityTimer;

const resetTimer = () => {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    lockWallet();
  }, 15 * 60 * 1000); // 15 minutes
};
```

### 5. Clear Sensitive Data

Clear password fields immediately:
```javascript
const handleSubmit = async (password) => {
  await unlockWallet(password);
  password = null; // Clear from memory
  passwordInput.value = ""; // Clear from DOM
};
```

---

## Troubleshooting

### "Wallet is locked or read-only. Cannot sign transactions."

**Solution:** Unlock wallet with password or switch from read-only mode.

### "Invalid secret key format. Must start with 'S'"

**Solution:** Ensure secret key is correct format (56 characters, starts with S).

### "Account not found on blockchain"

**Solution:** Account needs to be funded. Use Friendbot for testnet:
```javascript
await fetch(`https://friendbot.stellar.org?addr=${publicKey}`);
```

### "Failed to unlock wallet. Wrong password?"

**Solution:** User entered wrong password. Password cannot be recovered.

---

## Future Enhancements

1. **Hardware Wallet Support**
   - Ledger integration
   - Trezor support

2. **Multi-Signature Wallets**
   - Support for accounts requiring multiple signatures

3. **Biometric Authentication**
   - Fingerprint unlock
   - Face ID support

4. **Transaction History**
   - View past transactions
   - Export to CSV

5. **Enhanced Encryption**
   - AES-256-GCM
   - PBKDF2 with salt
   - Secure key derivation

6. **Backup & Restore**
   - Export encrypted wallet
   - Import from backup file
   - BIP39 mnemonic support

---

## Summary

✅ **No Freighter dependency** - Fully standalone  
✅ **Three connection modes** - Create, Import, Read-Only  
✅ **Secure local storage** - Encrypted secret keys  
✅ **Direct Stellar SDK integration** - Native signing  
✅ **Balance checking** - Real-time Horizon queries  
✅ **Lock/Unlock functionality** - Session security  
✅ **Testnet enforced** - Safe for demo and development  

**Ready for hackathon demo!** 🚀
