// StellarPledge - Frontend Application
// Complete MVP implementation with Stellar SDK integration

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
    // Your deployed contract address
    CONTRACT_ADDRESS: 'CBBHYAHLF4FJWFMIX4ZZTGVWVL3M452TI4REVYJ64U6WGOKR2VFWOBO7',
    
    // Network configuration
    NETWORK_PASSPHRASE: StellarSdk.Networks.TESTNET,
    HORIZON_URL: 'https://horizon-testnet.stellar.org',
    
    // Native XLM asset
    NATIVE_ASSET: StellarSdk.Asset.native(),
};

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

const state = {
    wallet: null,
    keypair: null,
    campaigns: [],
    currentCampaignId: null,
};

// ============================================================================
// STELLAR SDK SETUP
// ============================================================================

const server = new StellarSdk.Horizon.Server(CONFIG.HORIZON_URL);

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Set up event listeners
    document.getElementById('connect-wallet-btn').addEventListener('click', connectWallet);
    document.getElementById('disconnect-wallet-btn').addEventListener('click', disconnectWallet);
    document.getElementById('create-campaign-form').addEventListener('submit', handleCreateCampaign);
    document.getElementById('refresh-campaigns-btn').addEventListener('click', loadCampaigns);
    document.getElementById('back-to-list-btn').addEventListener('click', showCampaignsList);
    
    // Display contract address
    document.getElementById('contract-address').textContent = CONFIG.CONTRACT_ADDRESS;
    
    showMessage('Welcome to StellarPledge! Connect your wallet to get started.', 'info');
}

// ============================================================================
// WALLET MANAGEMENT
// ============================================================================

async function connectWallet() {
    const secretKey = document.getElementById('secret-key-input').value.trim();
    
    if (!secretKey) {
        showMessage('Please enter your secret key', 'error');
        return;
    }
    
    try {
        // Validate and create keypair
        const keypair = StellarSdk.Keypair.fromSecret(secretKey);
        const publicKey = keypair.publicKey();
        
        // Load account to verify it exists
        const account = await server.loadAccount(publicKey);
        
        // Get balance
        const xlmBalance = account.balances.find(b => b.asset_type === 'native');
        
        // Update state
        state.keypair = keypair;
        state.wallet = {
            publicKey: publicKey,
            balance: xlmBalance ? xlmBalance.balance : '0',
        };
        
        // Update UI
        document.getElementById('wallet-address').textContent = publicKey;
        document.getElementById('wallet-balance').textContent = parseFloat(state.wallet.balance).toFixed(2);
        document.getElementById('wallet-section').querySelector('.wallet-input').classList.add('hidden');
        document.getElementById('wallet-info').classList.remove('hidden');
        document.getElementById('create-campaign-section').classList.remove('hidden');
        
        showMessage('Wallet connected successfully!', 'success');
        
        // Load campaigns
        await loadCampaigns();
        
    } catch (error) {
        console.error('Wallet connection error:', error);
        showMessage('Failed to connect wallet. Check your secret key and ensure the account exists on Testnet.', 'error');
    }
}

function disconnectWallet() {
    state.keypair = null;
    state.wallet = null;
    state.campaigns = [];
    
    document.getElementById('secret-key-input').value = '';
    document.getElementById('wallet-section').querySelector('.wallet-input').classList.remove('hidden');
    document.getElementById('wallet-info').classList.add('hidden');
    document.getElementById('create-campaign-section').classList.add('hidden');
    document.getElementById('campaigns-list').innerHTML = '<p class="empty-state">No campaigns found. Create one to get started!</p>';
    document.getElementById('campaign-count').textContent = '0';
    
    showMessage('Wallet disconnected', 'info');
}

// ============================================================================
// CAMPAIGN CREATION
// ============================================================================

async function handleCreateCampaign(event) {
    event.preventDefault();
    
    if (!state.keypair) {
        showMessage('Please connect your wallet first', 'error');
        return;
    }
    
    const goal = parseFloat(document.getElementById('campaign-goal').value);
    const deadlineHours = parseInt(document.getElementById('campaign-deadline').value);
    
    if (goal <= 0 || deadlineHours <= 0) {
        showMessage('Please enter valid goal and deadline values', 'error');
        return;
    }
    
    try {
        showMessage('Creating campaign...', 'info');
        
        // Calculate deadline as Unix timestamp
        const deadline = Math.floor(Date.now() / 1000) + (deadlineHours * 3600);
        
        // Convert goal to stroops (1 XLM = 10,000,000 stroops)
        const goalInStroops = Math.floor(goal * 10000000);
        
        // Load the account
        const account = await server.loadAccount(state.keypair.publicKey());
        
        // Build the transaction
        const contract = new StellarSdk.Contract(CONFIG.CONTRACT_ADDRESS);
        
        let transaction = new StellarSdk.TransactionBuilder(account, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: CONFIG.NETWORK_PASSPHRASE,
        })
            .addOperation(contract.call(
                'create_campaign',
                StellarSdk.nativeToScVal(state.keypair.publicKey(), { type: 'address' }),
                StellarSdk.nativeToScVal(goalInStroops, { type: 'u128' }),
                StellarSdk.nativeToScVal(deadline, { type: 'u64' })
            ))
            .setTimeout(180)
            .build();
        
        // Simulate the transaction to get the correct resource fees
        console.log('Simulating transaction...');
        const simulated = await server.simulateTransaction(transaction);
        
        if (StellarSdk.SorobanRpc.Api.isSimulationSuccess(simulated)) {
            // Prepare the transaction with the simulation results
            transaction = StellarSdk.SorobanRpc.assembleTransaction(
                transaction,
                simulated
            ).build();
        } else {
            throw new Error('Simulation failed: ' + JSON.stringify(simulated));
        }
        
        // Sign the prepared transaction
        transaction.sign(state.keypair);
        
        // Submit the transaction
        console.log('Submitting transaction...');
        const result = await server.submitTransaction(transaction);
        
        console.log('Campaign created:', result);
        
        showMessage('Campaign created successfully!', 'success');
        
        // Reset form
        document.getElementById('create-campaign-form').reset();
        
        // Reload campaigns
        await loadCampaigns();
        
    } catch (error) {
        console.error('Create campaign error:', error);
        const errorMsg = error.response?.data?.extras?.result_codes 
            ? JSON.stringify(error.response.data.extras.result_codes)
            : error.message;
        showMessage('Failed to create campaign: ' + errorMsg, 'error');
    }
}

// ============================================================================
// CAMPAIGN LOADING
// ============================================================================

async function loadCampaigns() {
    try {
        showMessage('Loading campaigns...', 'info');
        
        const campaigns = [];
        let campaignId = 0;
        let notFoundCount = 0;
        const maxNotFound = 5; // Stop after 5 consecutive not found
        
        // Try to load campaigns sequentially
        while (notFoundCount < maxNotFound) {
            try {
                const campaign = await getCampaign(campaignId);
                if (campaign) {
                    campaigns.push({ id: campaignId, ...campaign });
                    notFoundCount = 0; // Reset counter
                } else {
                    notFoundCount++;
                }
                campaignId++;
            } catch (error) {
                notFoundCount++;
                campaignId++;
            }
        }
        
        state.campaigns = campaigns;
        renderCampaignsList();
        
        showMessage(`Loaded ${campaigns.length} campaign(s)`, 'success');
        
    } catch (error) {
        console.error('Load campaigns error:', error);
        showMessage('Failed to load campaigns', 'error');
    }
}

async function getCampaign(campaignId) {
    try {
        const account = await server.loadAccount(state.keypair.publicKey());
        const contract = new StellarSdk.Contract(CONFIG.CONTRACT_ADDRESS);
        
        const transaction = new StellarSdk.TransactionBuilder(account, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: CONFIG.NETWORK_PASSPHRASE,
        })
            .addOperation(contract.call(
                'get_campaign',
                StellarSdk.nativeToScVal(campaignId, { type: 'u64' })
            ))
            .setTimeout(180)
            .build();
        
        const simulated = await server.simulateTransaction(transaction);
        
        if (simulated.results && simulated.results.length > 0) {
            const result = simulated.results[0];
            if (result.retval) {
                return parseCampaignData(result.retval);
            }
        }
        
        return null;
    } catch (error) {
        return null;
    }
}

function parseCampaignData(scVal) {
    try {
        // Parse the smart contract return value
        // This is a simplified parser - adjust based on actual return format
        const campaign = StellarSdk.scValToNative(scVal);
        
        return {
            creator: campaign.creator,
            goal: campaign.goal,
            pledged: campaign.pledged,
            deadline: campaign.deadline,
            state: campaign.state,
            backers: campaign.backers || [],
        };
    } catch (error) {
        console.error('Parse error:', error);
        return null;
    }
}

// ============================================================================
// CAMPAIGN RENDERING
// ============================================================================

function renderCampaignsList() {
    const listContainer = document.getElementById('campaigns-list');
    const countElement = document.getElementById('campaign-count');
    
    countElement.textContent = state.campaigns.length;
    
    if (state.campaigns.length === 0) {
        listContainer.innerHTML = '<p class="empty-state">No campaigns found. Create one to get started!</p>';
        return;
    }
    
    listContainer.innerHTML = '';
    listContainer.className = 'campaigns-list';
    
    state.campaigns.forEach(campaign => {
        const card = createCampaignCard(campaign);
        listContainer.appendChild(card);
    });
}

function createCampaignCard(campaign) {
    const card = document.createElement('div');
    card.className = 'campaign-card';
    card.onclick = () => showCampaignDetail(campaign.id);
    
    const goal = campaign.goal / 10000000; // Convert from stroops
    const pledged = campaign.pledged / 10000000;
    const progress = Math.min((pledged / goal) * 100, 100);
    
    const stateText = getCampaignStateText(campaign.state);
    const stateClass = getCampaignStateClass(campaign.state);
    
    const deadline = new Date(campaign.deadline * 1000);
    const now = new Date();
    const isExpired = deadline < now;
    
    card.innerHTML = `
        <div class="campaign-id">Campaign #${campaign.id}</div>
        <div class="campaign-creator">Creator: ${campaign.creator.substring(0, 8)}...${campaign.creator.substring(campaign.creator.length - 8)}</div>
        <div class="campaign-progress">
            <div class="progress-bar-container">
                <div class="progress-bar" style="width: ${progress}%"></div>
            </div>
            <div class="progress-text">
                <strong>${pledged.toFixed(2)} XLM</strong> / ${goal.toFixed(2)} XLM (${progress.toFixed(1)}%)
            </div>
        </div>
        <div>
            <strong>Deadline:</strong> ${deadline.toLocaleString()}
            ${isExpired ? '<span style="color: red;"> (Expired)</span>' : ''}
        </div>
        <span class="campaign-status ${stateClass}">${stateText}</span>
    `;
    
    return card;
}

function getCampaignStateText(state) {
    const states = {
        0: 'Active',
        1: 'Successful',
        2: 'Failed',
    };
    return states[state] || 'Unknown';
}

function getCampaignStateClass(state) {
    const classes = {
        0: 'status-active',
        1: 'status-successful',
        2: 'status-failed',
    };
    return classes[state] || '';
}

// ============================================================================
// CAMPAIGN DETAIL VIEW
// ============================================================================

function showCampaignDetail(campaignId) {
    state.currentCampaignId = campaignId;
    const campaign = state.campaigns.find(c => c.id === campaignId);
    
    if (!campaign) {
        showMessage('Campaign not found', 'error');
        return;
    }
    
    const detailContent = document.getElementById('campaign-detail-content');
    const goal = campaign.goal / 10000000;
    const pledged = campaign.pledged / 10000000;
    const progress = Math.min((pledged / goal) * 100, 100);
    
    const deadline = new Date(campaign.deadline * 1000);
    const now = new Date();
    const isExpired = deadline < now;
    const isCreator = state.wallet && campaign.creator === state.wallet.publicKey;
    
    const stateText = getCampaignStateText(campaign.state);
    const stateClass = getCampaignStateClass(campaign.state);
    
    detailContent.innerHTML = `
        <h3>Campaign #${campaignId}</h3>
        <div class="detail-grid">
            <div class="detail-item">
                <strong>Creator</strong>
                ${campaign.creator}
                ${isCreator ? '<span style="color: #667eea;"> (You)</span>' : ''}
            </div>
            <div class="detail-item">
                <strong>Funding Goal</strong>
                ${goal.toFixed(2)} XLM
            </div>
            <div class="detail-item">
                <strong>Amount Pledged</strong>
                ${pledged.toFixed(2)} XLM (${progress.toFixed(1)}%)
            </div>
            <div class="detail-item">
                <strong>Deadline</strong>
                ${deadline.toLocaleString()}
                ${isExpired ? '<span style="color: red;"> (Expired)</span>' : ''}
            </div>
            <div class="detail-item">
                <strong>Status</strong>
                <span class="campaign-status ${stateClass}">${stateText}</span>
            </div>
        </div>
        
        <div class="campaign-progress">
            <div class="progress-bar-container">
                <div class="progress-bar" style="width: ${progress}%"></div>
            </div>
        </div>
        
        <div class="detail-actions">
            ${campaign.state === 0 && !isExpired ? `
                <div class="pledge-form">
                    <h4>Make a Pledge</h4>
                    <div class="form-group">
                        <label for="pledge-amount">Amount (XLM):</label>
                        <input type="number" id="pledge-amount" min="0.01" step="0.01" placeholder="Enter amount">
                    </div>
                    <button class="btn btn-success" onclick="handlePledge()">Pledge Now</button>
                </div>
            ` : ''}
            
            ${isCreator && campaign.state === 1 ? `
                <button class="btn btn-success" onclick="handleClaimFunds()">Claim Funds</button>
            ` : ''}
            
            ${!isCreator && campaign.state === 2 ? `
                <button class="btn btn-primary" onclick="handleWithdrawRefund()">Withdraw Refund</button>
            ` : ''}
        </div>
    `;
    
    document.getElementById('campaigns-section').classList.add('hidden');
    document.getElementById('campaign-detail-section').classList.remove('hidden');
}

function showCampaignsList() {
    document.getElementById('campaign-detail-section').classList.add('hidden');
    document.getElementById('campaigns-section').classList.remove('hidden');
    state.currentCampaignId = null;
}

// ============================================================================
// PLEDGE FUNCTIONALITY
// ============================================================================

async function handlePledge() {
    const amount = parseFloat(document.getElementById('pledge-amount').value);
    
    if (!amount || amount <= 0) {
        showMessage('Please enter a valid pledge amount', 'error');
        return;
    }
    
    if (!state.keypair || state.currentCampaignId === null) {
        showMessage('Invalid state', 'error');
        return;
    }
    
    try {
        showMessage('Processing pledge...', 'info');
        
        // Convert to stroops
        const amountInStroops = Math.floor(amount * 10000000);
        
        // For this MVP, we're using native XLM
        // In production, you'd need the token address parameter
        const xlmAddress = 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC'; // Native XLM on testnet
        
        const account = await server.loadAccount(state.keypair.publicKey());
        const contract = new StellarSdk.Contract(CONFIG.CONTRACT_ADDRESS);
        
        let transaction = new StellarSdk.TransactionBuilder(account, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: CONFIG.NETWORK_PASSPHRASE,
        })
            .addOperation(contract.call(
                'pledge',
                StellarSdk.nativeToScVal(state.keypair.publicKey(), { type: 'address' }),
                StellarSdk.nativeToScVal(state.currentCampaignId, { type: 'u64' }),
                StellarSdk.nativeToScVal(amountInStroops, { type: 'u128' }),
                StellarSdk.nativeToScVal(xlmAddress, { type: 'address' })
            ))
            .setTimeout(180)
            .build();
        
        // Simulate and prepare transaction
        const simulated = await server.simulateTransaction(transaction);
        
        if (StellarSdk.SorobanRpc.Api.isSimulationSuccess(simulated)) {
            transaction = StellarSdk.SorobanRpc.assembleTransaction(
                transaction,
                simulated
            ).build();
        } else {
            throw new Error('Simulation failed: ' + JSON.stringify(simulated));
        }
        
        transaction.sign(state.keypair);
        
        const result = await server.submitTransaction(transaction);
        
        console.log('Pledge result:', result);
        
        showMessage(`Successfully pledged ${amount} XLM!`, 'success');
        
        // Reload campaigns and refresh detail view
        await loadCampaigns();
        showCampaignDetail(state.currentCampaignId);
        
    } catch (error) {
        console.error('Pledge error:', error);
        const errorMsg = error.response?.data?.extras?.result_codes 
            ? JSON.stringify(error.response.data.extras.result_codes)
            : error.message;
        showMessage('Failed to pledge: ' + errorMsg, 'error');
    }
}

// ============================================================================
// CLAIM FUNDS FUNCTIONALITY
// ============================================================================

async function handleClaimFunds() {
    if (!state.keypair || state.currentCampaignId === null) {
        showMessage('Invalid state', 'error');
        return;
    }
    
    try {
        showMessage('Claiming funds...', 'info');
        
        const xlmAddress = 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC';
        
        const account = await server.loadAccount(state.keypair.publicKey());
        const contract = new StellarSdk.Contract(CONFIG.CONTRACT_ADDRESS);
        
        let transaction = new StellarSdk.TransactionBuilder(account, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: CONFIG.NETWORK_PASSPHRASE,
        })
            .addOperation(contract.call(
                'claim_funds',
                StellarSdk.nativeToScVal(state.keypair.publicKey(), { type: 'address' }),
                StellarSdk.nativeToScVal(state.currentCampaignId, { type: 'u64' }),
                StellarSdk.nativeToScVal(xlmAddress, { type: 'address' })
            ))
            .setTimeout(180)
            .build();
        
        // Simulate and prepare transaction
        const simulated = await server.simulateTransaction(transaction);
        
        if (StellarSdk.SorobanRpc.Api.isSimulationSuccess(simulated)) {
            transaction = StellarSdk.SorobanRpc.assembleTransaction(
                transaction,
                simulated
            ).build();
        } else {
            throw new Error('Simulation failed: ' + JSON.stringify(simulated));
        }
        
        transaction.sign(state.keypair);
        
        const result = await server.submitTransaction(transaction);
        
        console.log('Claim result:', result);
        
        showMessage('Funds claimed successfully!', 'success');
        
        await loadCampaigns();
        showCampaignDetail(state.currentCampaignId);
        
    } catch (error) {
        console.error('Claim error:', error);
        const errorMsg = error.response?.data?.extras?.result_codes 
            ? JSON.stringify(error.response.data.extras.result_codes)
            : error.message;
        showMessage('Failed to claim funds: ' + errorMsg, 'error');
    }
}

// ============================================================================
// REFUND FUNCTIONALITY
// ============================================================================

async function handleWithdrawRefund() {
    if (!state.keypair || state.currentCampaignId === null) {
        showMessage('Invalid state', 'error');
        return;
    }
    
    try {
        showMessage('Withdrawing refund...', 'info');
        
        const xlmAddress = 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC';
        
        const account = await server.loadAccount(state.keypair.publicKey());
        const contract = new StellarSdk.Contract(CONFIG.CONTRACT_ADDRESS);
        
        let transaction = new StellarSdk.TransactionBuilder(account, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: CONFIG.NETWORK_PASSPHRASE,
        })
            .addOperation(contract.call(
                'withdraw_refund',
                StellarSdk.nativeToScVal(state.keypair.publicKey(), { type: 'address' }),
                StellarSdk.nativeToScVal(state.currentCampaignId, { type: 'u64' }),
                StellarSdk.nativeToScVal(xlmAddress, { type: 'address' })
            ))
            .setTimeout(180)
            .build();
        
        // Simulate and prepare transaction
        const simulated = await server.simulateTransaction(transaction);
        
        if (StellarSdk.SorobanRpc.Api.isSimulationSuccess(simulated)) {
            transaction = StellarSdk.SorobanRpc.assembleTransaction(
                transaction,
                simulated
            ).build();
        } else {
            throw new Error('Simulation failed: ' + JSON.stringify(simulated));
        }
        
        transaction.sign(state.keypair);
        
        const result = await server.submitTransaction(transaction);
        
        console.log('Refund result:', result);
        
        showMessage('Refund withdrawn successfully!', 'success');
        
        await loadCampaigns();
        showCampaignDetail(state.currentCampaignId);
        
    } catch (error) {
        console.error('Refund error:', error);
        const errorMsg = error.response?.data?.extras?.result_codes 
            ? JSON.stringify(error.response.data.extras.result_codes)
            : error.message;
        showMessage('Failed to withdraw refund: ' + errorMsg, 'error');
    }
}

// ============================================================================
// UI HELPERS
// ============================================================================

function showMessage(message, type = 'info') {
    const container = document.getElementById('status-messages');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `status-message status-${type}`;
    messageDiv.textContent = message;
    
    container.appendChild(messageDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}
