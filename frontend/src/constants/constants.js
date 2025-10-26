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
    secretKey: 'SAH6ZOC6X4PVOHU7NQQ25KVWI2AGAHALTXI3N7UF4DLYUYJAJF22I7IF',
    role: 'Creator',
    description: 'Film director raising funds for "Chronos Echo" sci-fi short film',
    stellarExpert: 'https://stellar.expert/explorer/testnet/account/GDMT3KZ3Q4S5YKPBCI7BGJB5H3ST7GF2IFRJVU34WEIE5UX5NZTW5FTF',
    balance: '9,999 XLM'
  },
  BOB: {
    name: 'Bob (Student Backer)',
    publicKey: 'GAY4ASCS7CPNVH4OVSRO75V7NDRP4DDAF22V5SR3DLPP2WKI2Y3FRVNA',
    secretKey: 'SBJLYDJEBTRRQ3FPBOGQFLL6ZILZMZJGFVC7BIHTKJQJ4MAKT6ZNRX7C',
    role: 'Small Backer',
    description: 'Student who supports creators with modest contributions',
    stellarExpert: 'https://stellar.expert/explorer/testnet/account/GAY4ASCS7CPNVH4OVSRO75V7NDRP4DDAF22V5SR3DLPP2WKI2Y3FRVNA',
    typicalPledge: '100 XLM'
  },
  CHARLIE: {
    name: 'Charlie (Investor)',
    publicKey: 'GDQUP4JVL64U6GSPR6GN2T2UQG4JBYCCYH7B6XYCHBTHO5DLMY5H4PLB',
    secretKey: 'SC5QCVV6JUP3UYB7IOOMCUBHXI7RXYYZXIM2QPZQNFAWRYAUPCMO3E2O',
    role: 'High Backer',
    description: 'Investor who makes substantial pledges and receives perk rewards',
    stellarExpert: 'https://stellar.expert/explorer/testnet/account/GDQUP4JVL64U6GSPR6GN2T2UQG4JBYCCYH7B6XYCHBTHO5DLMY5H4PLB',
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
