/**
 * REAL Funded Demo Accounts for StellarPledge
 * These accounts are FUNDED on Stellar Testnet and can be used for REAL transactions
 * 
 * ⚠️ IMPORTANT: These are TESTNET accounts only. Secret keys are exposed for demo purposes.
 * NEVER expose secret keys for mainnet accounts!
 */

export const FUNDED_DEMO_ACCOUNTS = {
  ALICE: {
    // Alice - The Creator (Film Director)
    name: 'Alice',
    email: 'alice@example.com',
    role: 'creator',
    publicKey: 'GDMT3KZ3Q4S5YKPBCI7BGJB5H3ST7GF2IFRJVU34WEIE5UX5NZTW5FTF',
    secretKey: 'SAH6ZOC6X4PVOHU7NQQ25KVWI2AGAHALTXI3N7UF4DLYUYJAJF22I7IF',
    balance: 9999.4180146, // Real balance on testnet as of Oct 25, 2025
    description: 'Film director raising funds for "Chronos Echo" sci-fi short film',
    stellarExpert: 'https://stellar.expert/explorer/testnet/account/GDMT3KZ3Q4S5YKPBCI7BGJB5H3ST7GF2IFRJVU34WEIE5UX5NZTW5FTF',
    funded: true
  },
  BOB: {
    // Bob - The Small Backer (Student)
    name: 'Bob',
    email: 'bob@example.com',
    role: 'funder',
    publicKey: 'GD4I6Y3FQW3PTNQAVP223YOFLHE66GTORJRGD55FWPZXI5SNCPU6NZNX',
    secretKey: null, // ADD BOB'S SECRET KEY HERE: 'SXXXXXX...'
    description: 'Student who supports creators with modest contributions',
    stellarExpert: 'https://stellar.expert/explorer/testnet/account/GD4I6Y3FQW3PTNQAVP223YOFLHE66GTORJRGD55FWPZXI5SNCPU6NZNX',
    typicalPledge: 100,
    funded: false // Change to true after adding secret key
  },
  CHARLIE: {
    // Charlie - The High Backer (Investor)
    name: 'Charlie',
    email: 'charlie@example.com',
    role: 'funder',
    publicKey: 'GC4GCLLQEERQXIHNYITVQINGT54UK3ZPHR5ACC6QKS2TKVS4YL3X7YVP',
    secretKey: null, // ADD CHARLIE'S SECRET KEY HERE: 'SXXXXXX...'
    description: 'Investor who makes substantial pledges and receives perk rewards',
    stellarExpert: 'https://stellar.expert/explorer/testnet/account/GC4GCLLQEERQXIHNYITVQINGT54UK3ZPHR5ACC6QKS2TKVS4YL3X7YVP',
    typicalPledge: 500,
    funded: false // Change to true after adding secret key
  }
};

/**
 * Check if we can query real balances from Horizon
 * This will be used to determine if we should use real or mock balances
 */
export const canUseRealBalances = () => {
  // Check if Alice's account has secret key (fully set up)
  return FUNDED_DEMO_ACCOUNTS.ALICE.funded && 
         FUNDED_DEMO_ACCOUNTS.ALICE.secretKey !== null;
};

/**
 * Setup demo users with REAL funded accounts
 * This will import the funded wallets instead of creating new ones
 */
export const setupRealDemoUsers = async () => {
  console.log('🚀 Setting up REAL funded demo accounts...');
  
  const users = [];
  
  // Create user accounts for authentication
  for (const [key, account] of Object.entries(FUNDED_DEMO_ACCOUNTS)) {
    if (account.funded && account.secretKey) {
      users.push({
        id: key.toLowerCase(),
        name: account.name,
        email: account.email,
        password: `${key.toLowerCase()}123`, // alice123, bob123, charlie123
        role: account.role,
        publicKey: account.publicKey,
        secretKey: account.secretKey,
        realBalance: account.balance,
        createdAt: new Date().toISOString()
      });
      
      console.log(`✅ ${account.name} (${account.role}): ${account.publicKey}`);
      console.log(`   Balance: ${account.balance} XLM (REAL)`);
      console.log(`   View: ${account.stellarExpert}`);
    } else {
      console.warn(`⚠️ ${account.name}: Secret key not available, skipping real wallet import`);
    }
  }
  
  if (users.length === 0) {
    console.error('❌ No funded accounts available with secret keys!');
    return false;
  }
  
  // Save to localStorage
  localStorage.setItem('stellarpledge_users', JSON.stringify(users));
  localStorage.setItem('stellarpledge_use_real_balances', 'true');
  
  console.log(`\n✅ Setup complete! ${users.length} funded account(s) ready.`);
  console.log('\n📝 Login credentials:');
  users.forEach(user => {
    console.log(`   ${user.name}: ${user.email} / ${user.password}`);
  });
  
  console.log('\n🌐 To use real blockchain balances:');
  console.log('   1. Login with one of the accounts above');
  console.log('   2. Connect wallet using "Import Existing Wallet"');
  console.log('   3. Enter the secret key from the account file');
  console.log('   4. Balance will be fetched from Stellar Horizon!');
  
  return true;
};

/**
 * Get real balance from Stellar Horizon for a public key
 */
export const getRealBalance = async (publicKey) => {
  try {
    const StellarSDK = await import('@stellar/stellar-sdk');
    const server = new StellarSDK.Horizon.Server('https://horizon-testnet.stellar.org');
    
    const account = await server.loadAccount(publicKey);
    const nativeBalance = account.balances.find(b => b.asset_type === 'native');
    
    if (nativeBalance) {
      const balance = parseFloat(nativeBalance.balance);
      console.log(`💰 Real balance for ${publicKey}: ${balance} XLM`);
      return balance;
    }
    
    return 0;
  } catch (error) {
    console.error('Error fetching real balance:', error);
    // Fallback to mock balance
    const mockBalance = localStorage.getItem('stellarpledge_wallet_balances');
    if (mockBalance) {
      const balances = JSON.parse(mockBalance);
      return balances[publicKey] || 10000;
    }
    return 10000;
  }
};

// Make available globally for console access
if (typeof window !== 'undefined') {
  window.setupRealDemoUsers = setupRealDemoUsers;
  window.FUNDED_DEMO_ACCOUNTS = FUNDED_DEMO_ACCOUNTS;
  window.getRealBalance = getRealBalance;
  
  console.log('🌟 Real demo accounts loaded!');
  console.log('   window.setupRealDemoUsers() - Setup with FUNDED testnet accounts');
  console.log('   window.FUNDED_DEMO_ACCOUNTS - View account details');
  console.log('   window.getRealBalance(publicKey) - Fetch real balance from Horizon');
}
