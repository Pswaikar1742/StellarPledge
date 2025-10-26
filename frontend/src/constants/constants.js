// StellarPledge Configuration Constants - TESTNET ONLY

export const CONTRACT_ADDRESS = 'CD4L4MPVSJ3RLAUYQ3ID2M75VWVVMDFBTESJIY4UULFFN33X2KNRTJXY';

// Network Configuration - TESTNET ONLY
export const NETWORK_CONFIG = {
  NETWORK_PASSPHRASE: 'Test SDF Network ; September 2015',
  RPC_URL: 'https://soroban-testnet.stellar.org',
  HORIZON_URL: 'https://horizon-testnet.stellar.org',
  FRIENDBOT_URL: 'https://friendbot.stellar.org',
  NETWORK: 'TESTNET'
};

// Native XLM Token Address on Stellar (SAC - Stellar Asset Contract)
export const NATIVE_XLM_ADDRESS = 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC';

// Demo Accounts for Testing (TESTNET ONLY - For Hackathon Demo)
export const DEMO_ACCOUNTS = {
  ALICE: {
    name: 'Alice (Creator - Film Director)',
    publicKey: 'GDMT3KZ3Q4S5YKPBCI7BGJB5H3ST7GF2IFRJVU34WEIE5UX5NZTW5FTF',
    role: 'Creator',
    description: 'Film director raising funds for "Chronos Echo" sci-fi short film',
    stellarExpert: 'https://stellar.expert/explorer/testnet/account/GDMT3KZ3Q4S5YKPBCI7BGJB5H3ST7GF2IFRJVU34WEIE5UX5NZTW5FTF',
    balance: '9,999 XLM'
  },
  BOB: {
    name: 'Bob (Student Backer)',
    publicKey: 'GD4I6Y3FQW3PTNQAVP223YOFLHE66GTORJRGD55FWPZXI5SNCPU6NZNX',
    role: 'Small Backer',
    description: 'Student who supports creators with modest contributions',
    stellarExpert: 'https://stellar.expert/explorer/testnet/account/GD4I6Y3FQW3PTNQAVP223YOFLHE66GTORJRGD55FWPZXI5SNCPU6NZNX',
    typicalPledge: '100 XLM'
  },
  CHARLIE: {
    name: 'Charlie (Investor)',
    publicKey: 'GC4GCLLQEERQXIHNYITVQINGT54UK3ZPHR5ACC6QKS2TKVS4YL3X7YVP',
    role: 'High Backer',
    description: 'Investor who makes substantial pledges and receives perk rewards',
    stellarExpert: 'https://stellar.expert/explorer/testnet/account/GC4GCLLQEERQXIHNYITVQINGT54UK3ZPHR5ACC6QKS2TKVS4YL3X7YVP',
    typicalPledge: '500+ XLM'
  }
};

// Campaign States
export const CAMPAIGN_STATES = {
  ACTIVE: 'Active',
  SUCCESSFUL: 'Successful',
  FAILED: 'Failed',
};

// Transaction Timeouts
export const TX_TIMEOUT = 30; // seconds
export const TX_POLL_INTERVAL = 100; // milliseconds

// UI Constants
export const STROOPS_PER_XLM = 10000000;
export const DEFAULT_DECIMALS = 7;
