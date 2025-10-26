# How Transactions Appear on Stellar.Expert

## Overview

Stellar.Expert is the **blockchain explorer** for Stellar network. All transactions from StellarPledge are **publicly visible and verifiable** on Stellar.Expert when using real funded accounts.

**Explorer URL**: https://stellar.expert/explorer/testnet

---

## Understanding Stellar.Expert

### What is Stellar.Expert?

Stellar.Expert is like "Google for Stellar blockchain":
- 🔍 Search accounts, transactions, contracts
- 📊 View balances and operations
- 📈 Track transaction history
- 🔗 Verify smart contract interactions
- 🌐 Real-time blockchain data

**Think of it as**: Block Explorer (like Etherscan for Ethereum)

---

## Account View

### Accessing Your Account

**URL Format**:
```
https://stellar.expert/explorer/testnet/account/{PUBLIC_KEY}
```

### Alice's Account Example

**Public Key**: `GDMT3KZ3Q4S5YKPBCI7BGJB5H3ST7GF2IFRJVU34WEIE5UX5NZTW5FTF`

**Full URL**:
```
https://stellar.expert/explorer/testnet/account/GDMT3KZ3Q4S5YKPBCI7BGJB5H3ST7GF2IFRJVU34WEIE5UX5NZTW5FTF
```

### What You See

#### 1. Account Overview
```
┌─────────────────────────────────────────────────────────┐
│  Account: GDMT3K...NZTW5FTF                             │
│  Balance: 9,999.4180146 XLM                             │
│  Sequence: 147573720588288                              │
│  Created: Oct 24, 2025                                  │
│  Last Activity: Oct 25, 2025 15:30 UTC                  │
└─────────────────────────────────────────────────────────┘
```

#### 2. Balances Tab
```
┌─────────────────────────────────────────────────────────┐
│  Asset         Balance          Trust Line  Issuer      │
│  ─────────────────────────────────────────────────────── │
│  XLM (native)  9,999.4180146                            │
│  PERK          5              ✓         GISSU...        │
└─────────────────────────────────────────────────────────┘
```

**What This Shows**:
- Native XLM balance (testnet)
- Any reward tokens received from perks
- Trust lines (authorized assets)

---

#### 3. Operations Tab

**Shows every action** taken by the account:

```
┌──────────────────────────────────────────────────────────────────┐
│  Date/Time           Type              Amount    From/To          │
│  ──────────────────────────────────────────────────────────────── │
│  Oct 25, 15:30 UTC   Invoke Contract   -         Contract: CD4... │
│  Oct 25, 15:25 UTC   Payment           -100 XLM  To: GD4I6Y...   │
│  Oct 25, 15:20 UTC   Create Account    +10000 XLM From: Friendbot│
│  Oct 24, 10:00 UTC   Account Created   -         -               │
└──────────────────────────────────────────────────────────────────┘
```

**Operation Types in StellarPledge**:
- `Account Created` - Initial account setup
- `Payment` - XLM transfers (pledges)
- `Invoke Contract` - Smart contract calls
- `Trust` - Authorize reward tokens
- `Change Trust` - Update trust lines

---

## Transaction View

### What is a Transaction?

A **transaction** is a group of one or more **operations** executed together on the blockchain.

### Transaction URL Format
```
https://stellar.expert/explorer/testnet/tx/{TRANSACTION_HASH}
```

### Example Transaction: Campaign Creation

**Hash**: `abc123...def456` (64-character hex)

**Full URL**:
```
https://stellar.expert/explorer/testnet/tx/abc123...def456
```

### Transaction Details View

```
┌─────────────────────────────────────────────────────────────────┐
│  Transaction: abc123...def456                                   │
│  ───────────────────────────────────────────────────────────────│
│  Status: ✅ Success                                             │
│  Ledger: 147,583                                                │
│  Timestamp: Oct 25, 2025 15:30:45 UTC                           │
│  Source Account: GDMT3K...NZTW5FTF (Alice)                      │
│  Fee: 0.00001 XLM                                               │
│  Memo: -                                                        │
│  ───────────────────────────────────────────────────────────────│
│  Operations (1):                                                │
│    1. Invoke Contract                                           │
│       Contract: CD4L4M...NRTJXY                                 │
│       Function: create_campaign                                 │
│       Parameters:                                               │
│         • creator: GDMT3K...NZTW5FTF                            │
│         • goal: 10000000000 stroops (1,000 XLM)                 │
│         • deadline: 1735228800 (Dec 26, 2025)                   │
│         • perk_threshold: 5000000000 (500 XLM)                  │
│         • perk_asset: CTOKEN...                                 │
│         • perk_amount: 1000000 (1 token)                        │
│       Return Value: 0 (Campaign ID)                             │
└─────────────────────────────────────────────────────────────────┘
```

### What Each Field Means

| Field | Explanation |
|-------|-------------|
| **Hash** | Unique transaction identifier |
| **Status** | ✅ Success or ❌ Failed |
| **Ledger** | Blockchain block number |
| **Timestamp** | Exact time of confirmation |
| **Source Account** | Who sent the transaction |
| **Fee** | Cost to process (0.00001 XLM typical) |
| **Operations** | Actions performed |
| **Return Value** | Smart contract output |

---

## Smart Contract View

### Contract Address

**StellarPledge Contract**:
```
CD4L4MPVSJ3RLAUYQ3ID2M75VWVVMDFBTESJIY4UULFFN33X2KNRTJXY
```

**Full URL**:
```
https://stellar.expert/explorer/testnet/contract/CD4L4MPVSJ3RLAUYQ3ID2M75VWVVMDFBTESJIY4UULFFN33X2KNRTJXY
```

### Contract Overview

```
┌─────────────────────────────────────────────────────────────────┐
│  Contract: CD4L4M...NRTJXY                                      │
│  ───────────────────────────────────────────────────────────────│
│  Type: Soroban Smart Contract                                   │
│  Deployed: Oct 20, 2025                                         │
│  Deployer: GALICE...                                            │
│  Total Invocations: 1,234                                       │
│  ───────────────────────────────────────────────────────────────│
│  Recent Invocations:                                            │
│    • create_campaign (45 calls)                                 │
│    • pledge (890 calls)                                         │
│    • get_campaign (250 calls)                                   │
│    • claim_funds (30 calls)                                     │
│    • withdraw_refund (19 calls)                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Demo Workflow: How Transactions Appear

### Scenario: Alice Creates Campaign, Bob Pledges

#### Step 1: Alice Creates Campaign

**Action in App**:
```
Alice fills form:
  Title: "Chronos Echo Film"
  Goal: 1,000 XLM
  Deadline: 30 days
  Perk: 500 XLM → 1 FILM token
  
[Submit] → Transaction sent
```

**What Appears on Stellar.Expert**:

1. **Alice's Account Page**:
   ```
   New Operation:
   Oct 25, 15:30 UTC - Invoke Contract
   Contract: CD4L4M...
   Function: create_campaign
   Fee: -0.00001 XLM
   ```

2. **Transaction Page**:
   ```
   Status: ✅ Success
   Operations:
     1. Invoke Contract: create_campaign
        Return Value: 0 (Campaign ID)
   ```

3. **Alice's Balance**:
   ```
   Before: 10,000.0000000 XLM
   After:   9,999.9999900 XLM  (paid 0.00001 XLM fee)
   ```

---

#### Step 2: Bob Makes 100 XLM Pledge

**Action in App**:
```
Bob views Campaign #0
Enters pledge: 100 XLM
[Confirm Pledge] → Transaction sent
```

**What Appears on Stellar.Expert**:

1. **Bob's Account Page**:
   ```
   New Operations (2):
   Oct 25, 15:35 UTC - Invoke Contract
     Contract: CD4L4M...
     Function: pledge
     
   Oct 25, 15:35 UTC - Payment
     Amount: -100 XLM
     To: CD4L4M... (Contract)
   ```

2. **Transaction Page**:
   ```
   Status: ✅ Success
   Source: GD4I6Y... (Bob)
   
   Operations:
     1. Invoke Contract: pledge
        Parameters:
          • backer: GD4I6Y... (Bob)
          • campaign_id: 0
          • amount: 1000000000 stroops
          • token_address: CDLZFC... (XLM)
     
     2. Payment (automatic)
        From: GD4I6Y... (Bob)
        To: CD4L4M... (Contract)
        Amount: 100 XLM
   ```

3. **Balance Changes**:
   ```
   Bob's Balance:
     Before: 10,000 XLM
     After:   9,900 XLM  (pledged 100 XLM)
   
   Contract's Balance:
     Before: 0 XLM
     After: 100 XLM  (holding Bob's pledge in escrow)
   ```

---

#### Step 3: Charlie Makes 500 XLM Pledge (Triggers Perk!)

**Action in App**:
```
Charlie pledges 500 XLM to Campaign #0
[Confirm Pledge] → Transaction sent
```

**What Appears on Stellar.Expert**:

1. **Charlie's Account Page**:
   ```
   New Operations (3):
   Oct 25, 15:40 UTC - Invoke Contract
     Contract: CD4L4M...
     Function: pledge
     
   Oct 25, 15:40 UTC - Payment
     Amount: -500 XLM
     To: CD4L4M... (Contract)
     
   Oct 25, 15:40 UTC - Payment  🎁 PERK RECEIVED
     Amount: +1 FILM
     From: GDMT3K... (Alice - Creator)
   ```

2. **Transaction Page**:
   ```
   Status: ✅ Success
   
   Operations:
     1. Invoke Contract: pledge
        (automated perk distribution triggered!)
     
     2. Payment: Pledge
        From: GC4GCL... (Charlie)
        To: CD4L4M... (Contract)
        Amount: 500 XLM
     
     3. Payment: Perk Reward  🎁
        From: GDMT3K... (Alice)
        To: GC4GCL... (Charlie)
        Amount: 1 FILM token
   ```

3. **Balance Changes**:
   ```
   Charlie's Balances:
     XLM:  10,000 → 9,500 XLM  (pledged)
     FILM: 0 → 1 FILM token     (perk received!)
   
   Contract's Balance:
     100 XLM (Bob) + 500 XLM (Charlie) = 600 XLM total
   ```

**Key Observation**: 
The **perk transfer happens AUTOMATICALLY** in the same transaction as the pledge! No manual distribution needed!

---

#### Step 4: Campaign Reaches Goal, Alice Claims Funds

**Action in App**:
```
Campaign reaches 1,000 XLM goal
Status changes to: Successful ✅

Alice clicks [Claim Funds]
```

**What Appears on Stellar.Expert**:

1. **Alice's Account Page**:
   ```
   New Operations (2):
   Oct 25, 16:00 UTC - Invoke Contract
     Contract: CD4L4M...
     Function: claim_funds
     
   Oct 25, 16:00 UTC - Payment
     Amount: +1,000 XLM
     From: CD4L4M... (Contract)
   ```

2. **Transaction Page**:
   ```
   Status: ✅ Success
   
   Operations:
     1. Invoke Contract: claim_funds
        Parameters:
          • creator: GDMT3K... (Alice)
          • campaign_id: 0
          • token_address: CDLZFC...
     
     2. Payment (automatic)
        From: CD4L4M... (Contract)
        To: GDMT3K... (Alice)
        Amount: 1,000 XLM
   ```

3. **Final Balances**:
   ```
   Alice's Balance:
     Before: 9,999.9999900 XLM
     After: 10,999.9999800 XLM  (gained 1,000 XLM - fees)
   
   Contract's Balance:
     Before: 1,000 XLM
     After: 0 XLM  (released to Alice)
   ```

---

## Verifying Transactions in Demo

### Demo Script Integration

**During Your Presentation**:

1. **Open Browser Side-by-Side**:
   - Left screen: StellarPledge app
   - Right screen: stellar.expert

2. **Show Account Before**:
   ```
   https://stellar.expert/explorer/testnet/account/GDMT3K...
   Balance: 9,999.42 XLM
   Operations: 5
   ```

3. **Perform Action in App**:
   ```
   Alice creates campaign with 1,000 XLM goal
   ```

4. **Refresh Stellar.Expert**:
   ```
   New operation appears immediately!
   Balance: 9,999.41999 XLM (paid fee)
   Operations: 6  ← Increased!
   ```

5. **Click Transaction Hash**:
   ```
   Show full transaction details
   Point out contract invocation
   Highlight return value (campaign ID)
   ```

---

## Understanding Operations vs Transactions

### Key Difference

**Transaction**:
- Container for 1+ operations
- Has fee, signature, hash
- Atomic (all succeed or all fail)

**Operation**:
- Individual action within transaction
- Types: Payment, Invoke Contract, Trust, etc.
- Executed in sequence

### Example: Pledge Transaction

```
Transaction abc123...
├── Operation 1: Invoke Contract (pledge function)
├── Operation 2: Payment (100 XLM to contract)
└── Operation 3: Payment (1 FILM token to backer) [if perk triggered]
```

All 3 operations execute together or none execute!

---

## Reading Blockchain Data

### Using Horizon API Directly

**Balance Query**:
```bash
curl https://horizon-testnet.stellar.org/accounts/GDMT3KZ3Q4S5YKPBCI7BGJB5H3ST7GF2IFRJVU34WEIE5UX5NZTW5FTF
```

**Response**:
```json
{
  "id": "GDMT3KZ3Q4S5YKPBCI7BGJB5H3ST7GF2IFRJVU34WEIE5UX5NZTW5FTF",
  "account_id": "GDMT3K...",
  "sequence": "147573720588288",
  "balances": [
    {
      "balance": "9999.4180146",
      "asset_type": "native"
    }
  ]
}
```

---

## Demo Tips for Presentation

### 🎯 Best Practices

1. **Pre-Load stellar.expert**:
   ```
   Open all account pages in tabs:
   • Alice's account
   • Bob's account
   • Charlie's account
   • Contract page
   ```

2. **Use Refresh Strategy**:
   ```
   After each app action:
   1. Wait 2-3 seconds
   2. Refresh stellar.expert tab
   3. Point out new operation
   4. Show balance change
   ```

3. **Highlight Key Points**:
   ```
   ✅ "See? The transaction appeared on blockchain!"
   ✅ "Notice the perk transfer in the same transaction"
   ✅ "Contract holds funds in escrow - transparent!"
   ✅ "All data is public and verifiable"
   ```

4. **Prepare Talking Points**:
   ```
   • "This is proof our app uses real blockchain"
   • "Any judge can verify these transactions"
   • "Data persists forever on Stellar"
   • "Contract address is public and auditable"
   ```

---

## Common Questions & Answers

### Q: Why do transactions cost fees?

**A**: Stellar charges small fees (0.00001 XLM) to prevent spam and compensate validators. Think of it like gas fees, but much cheaper!

---

### Q: Can I see smart contract code on stellar.expert?

**A**: Smart contracts deployed as WASM are visible, but not in human-readable form. You'd need to:
1. Download WASM binary
2. Decompile to WAT (WebAssembly Text)
3. Or refer to original Rust source code

**For Demo**: Share your GitHub repo with Rust source code.

---

### Q: What if transaction fails?

**A**: Failed transactions still appear on stellar.expert with ❌ Failed status. You can see:
- Error code
- Failed operation
- Fee still charged (network processed attempt)

---

### Q: How long until transactions appear?

**A**: Stellar has **5-second finality**:
- Transaction submitted → Appears in ~2-5 seconds
- Much faster than Ethereum (15+ seconds)
- Refresh stellar.expert after 3 seconds

---

## Summary

Stellar.Expert provides:

1. ✅ **Account Tracking** - Balances, history, operations
2. ✅ **Transaction Verification** - View exact parameters
3. ✅ **Contract Monitoring** - See all contract calls
4. ✅ **Real-time Updates** - 5-second blockchain finality
5. ✅ **Public Transparency** - Anyone can verify
6. ✅ **Demo Proof** - Show judges real blockchain usage

**Demo Integration**:
- Open stellar.expert alongside your app
- Perform actions in app
- Show immediate blockchain updates
- Prove transactions are real

**This makes your demo POWERFUL**: You're not just showing a UI, you're showing **real blockchain transactions** that judges can verify themselves!

---

## Quick Reference URLs

| Resource | URL |
|----------|-----|
| **Alice's Account** | https://stellar.expert/explorer/testnet/account/GDMT3KZ3Q4S5YKPBCI7BGJB5H3ST7GF2IFRJVU34WEIE5UX5NZTW5FTF |
| **Bob's Account** | https://stellar.expert/explorer/testnet/account/GD4I6Y3FQW3PTNQAVP223YOFLHE66GTORJRGD55FWPZXI5SNCPU6NZNX |
| **Charlie's Account** | https://stellar.expert/explorer/testnet/account/GC4GCLLQEERQXIHNYITVQINGT54UK3ZPHR5ACC6QKS2TKVS4YL3X7YVP |
| **Contract** | https://stellar.expert/explorer/testnet/contract/CD4L4MPVSJ3RLAUYQ3ID2M75VWVVMDFBTESJIY4UULFFN33X2KNRTJXY |
| **Horizon API** | https://horizon-testnet.stellar.org |
| **Soroban RPC** | https://soroban-testnet.stellar.org |
