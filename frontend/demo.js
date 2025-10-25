// StellarPledge - DEMO MODE
// Happy Path Demonstration Script
// This code automates the exact narrative for judges

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
    CONTRACT_ADDRESS: 'CBBHYAHLF4FJWFMIX4ZZTGVWVL3M452TI4REVYJ64U6WGOKR2VFWOBO7',
    NETWORK_PASSPHRASE: StellarSdk.Networks.TESTNET,
    HORIZON_URL: 'https://horizon-testnet.stellar.org',
    NATIVE_ASSET: StellarSdk.Asset.native(),
};

// Pre-configured accounts from /Ref directory
const ACCOUNTS = {
    alice: {
        name: 'Alice',
        role: 'Creator',
        secret: 'SAH6ZOC6X4PVOHU7NQQ25KVWI2AGAHALTXI3N7UF4DLYUYJAJF22I7IF',
        public: 'GDMT3KZ3Q4S5YKPBCI7BGJB5H3ST7GF2IFRJVU34WEIE5UX5NZTW5FTF',
    },
    bob: {
        name: 'Bob',
        role: 'Backer #1',
        secret: 'SBJN7YARXSGO7RBF4L7F7GMQFIGCCG3GOALB2OG5PNSXKMI25TLD352T',
        public: 'GDBNXWAFUIAGNIU5G67ANOLNMHG7OB4L5X7NJXGYHL2HWEEGXCP4ATVM',
    },
    charlie: {
        name: 'Charlie',
        role: 'Backer #2',
        secret: 'SABGKNDSPHD6JSVEMFHSNQ6LVYQU3LGONFY2FADO2RSG6OM6QR425GWX',
        public: 'GD4I6Y3FQW3PTNQAVP223YOFLHE66GTORJRGD55FWPZXI5SNCPU6NZNX',
    },
};

// Demo state
const demoState = {
    currentStep: 1,
    campaignId: null,
    campaign: null,
};

const server = new StellarSdk.Horizon.Server(CONFIG.HORIZON_URL);

// ============================================================================
// STEP 1: ALICE CREATES CAMPAIGN
// ============================================================================

async function executeStep1() {
    try {
        showMessage('🎬 Step 1: Alice is creating her campaign...', 'info');
        markStepActive(1);
        
        const goal = 250; // 250 XLM
        const deadlineHours = 720; // 30 days
        
        const deadline = Math.floor(Date.now() / 1000) + (deadlineHours * 3600);
        const goalInStroops = Math.floor(goal * 10000000);
        
        // Load Alice's account
        const aliceKeypair = StellarSdk.Keypair.fromSecret(ACCOUNTS.alice.secret);
        const account = await server.loadAccount(aliceKeypair.publicKey());
        
        // Build transaction
        const contract = new StellarSdk.Contract(CONFIG.CONTRACT_ADDRESS);
        
        let transaction = new StellarSdk.TransactionBuilder(account, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: CONFIG.NETWORK_PASSPHRASE,
        })
            .addOperation(contract.call(
                'create_campaign',
                StellarSdk.nativeToScVal(aliceKeypair.publicKey(), { type: 'address' }),
                StellarSdk.nativeToScVal(goalInStroops, { type: 'u128' }),
                StellarSdk.nativeToScVal(deadline, { type: 'u64' })
            ))
            .setTimeout(180)
            .build();
        
        // Simulate and prepare
        console.log('Simulating transaction...');
        const simulated = await server.simulateTransaction(transaction);
        
        if (StellarSdk.SorobanRpc.Api.isSimulationSuccess(simulated)) {
            transaction = StellarSdk.SorobanRpc.assembleTransaction(
                transaction,
                simulated
            ).build();
        } else {
            throw new Error('Simulation failed: ' + JSON.stringify(simulated));
        }
        
        // Sign and submit
        transaction.sign(aliceKeypair);
        console.log('Submitting transaction...');
        const result = await server.submitTransaction(transaction);
        
        console.log('Campaign created:', result);
        
        // Extract campaign ID from result (it should be 0 for first campaign, or we can increment)
        demoState.campaignId = 0; // First campaign
        
        showMessage('✅ Success! Alice created Campaign #0 with a goal of 250 XLM', 'success');
        
        // Mark step complete and enable next step
        markStepComplete(1);
        enableStep(2);
        
        // Load and display campaign
        await loadCampaign();
        
    } catch (error) {
        console.error('Step 1 error:', error);
        const errorMsg = error.response?.data?.extras?.result_codes 
            ? JSON.stringify(error.response.data.extras.result_codes)
            : error.message;
        showMessage('❌ Step 1 Failed: ' + errorMsg, 'error');
    }
}

// ============================================================================
// STEP 2: BOB PLEDGES 100 XLM
// ============================================================================

async function executeStep2() {
    try {
        showMessage('🎬 Step 2: Bob is making his pledge of 100 XLM...', 'info');
        markStepActive(2);
        
        const pledgeAmount = 100; // 100 XLM
        const amountInStroops = Math.floor(pledgeAmount * 10000000);
        
        // Native XLM token address on testnet
        const xlmAddress = 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC';
        
        // Load Bob's account
        const bobKeypair = StellarSdk.Keypair.fromSecret(ACCOUNTS.bob.secret);
        const account = await server.loadAccount(bobKeypair.publicKey());
        
        // Build transaction
        const contract = new StellarSdk.Contract(CONFIG.CONTRACT_ADDRESS);
        
        let transaction = new StellarSdk.TransactionBuilder(account, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: CONFIG.NETWORK_PASSPHRASE,
        })
            .addOperation(contract.call(
                'pledge',
                StellarSdk.nativeToScVal(bobKeypair.publicKey(), { type: 'address' }),
                StellarSdk.nativeToScVal(demoState.campaignId, { type: 'u64' }),
                StellarSdk.nativeToScVal(amountInStroops, { type: 'u128' }),
                StellarSdk.nativeToScVal(xlmAddress, { type: 'address' })
            ))
            .setTimeout(180)
            .build();
        
        // Simulate and prepare
        console.log('Simulating pledge transaction...');
        const simulated = await server.simulateTransaction(transaction);
        
        if (StellarSdk.SorobanRpc.Api.isSimulationSuccess(simulated)) {
            transaction = StellarSdk.SorobanRpc.assembleTransaction(
                transaction,
                simulated
            ).build();
        } else {
            throw new Error('Simulation failed: ' + JSON.stringify(simulated));
        }
        
        // Sign and submit
        transaction.sign(bobKeypair);
        console.log('Submitting pledge transaction...');
        const result = await server.submitTransaction(transaction);
        
        console.log('Pledge successful:', result);
        
        showMessage('✅ Success! Bob pledged 100 XLM. Campaign now at 100/250 XLM (40%)', 'success');
        
        // Mark step complete and enable next step
        markStepComplete(2);
        enableStep(3);
        
        // Reload campaign display
        await loadCampaign();
        
    } catch (error) {
        console.error('Step 2 error:', error);
        const errorMsg = error.response?.data?.extras?.result_codes 
            ? JSON.stringify(error.response.data.extras.result_codes)
            : error.message;
        showMessage('❌ Step 2 Failed: ' + errorMsg, 'error');
    }
}

// ============================================================================
// STEP 3: CHARLIE PLEDGES 150 XLM (REACHING GOAL)
// ============================================================================

async function executeStep3() {
    try {
        showMessage('🎬 Step 3: Charlie is making the decisive pledge of 150 XLM...', 'info');
        markStepActive(3);
        
        const pledgeAmount = 150; // 150 XLM
        const amountInStroops = Math.floor(pledgeAmount * 10000000);
        
        // Native XLM token address on testnet
        const xlmAddress = 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC';
        
        // Load Charlie's account
        const charlieKeypair = StellarSdk.Keypair.fromSecret(ACCOUNTS.charlie.secret);
        const account = await server.loadAccount(charlieKeypair.publicKey());
        
        // Build transaction
        const contract = new StellarSdk.Contract(CONFIG.CONTRACT_ADDRESS);
        
        let transaction = new StellarSdk.TransactionBuilder(account, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: CONFIG.NETWORK_PASSPHRASE,
        })
            .addOperation(contract.call(
                'pledge',
                StellarSdk.nativeToScVal(charlieKeypair.publicKey(), { type: 'address' }),
                StellarSdk.nativeToScVal(demoState.campaignId, { type: 'u64' }),
                StellarSdk.nativeToScVal(amountInStroops, { type: 'u128' }),
                StellarSdk.nativeToScVal(xlmAddress, { type: 'address' })
            ))
            .setTimeout(180)
            .build();
        
        // Simulate and prepare
        console.log('Simulating pledge transaction...');
        const simulated = await server.simulateTransaction(transaction);
        
        if (StellarSdk.SorobanRpc.Api.isSimulationSuccess(simulated)) {
            transaction = StellarSdk.SorobanRpc.assembleTransaction(
                transaction,
                simulated
            ).build();
        } else {
            throw new Error('Simulation failed: ' + JSON.stringify(simulated));
        }
        
        // Sign and submit
        transaction.sign(charlieKeypair);
        console.log('Submitting pledge transaction...');
        const result = await server.submitTransaction(transaction);
        
        console.log('Pledge successful:', result);
        
        showMessage('🎉 GOAL REACHED! Charlie pledged 150 XLM. Campaign is now SUCCESSFUL at 250/250 XLM (100%)', 'success');
        
        // Mark step complete and enable next step
        markStepComplete(3);
        enableStep(4);
        
        // Reload campaign display
        await loadCampaign();
        
    } catch (error) {
        console.error('Step 3 error:', error);
        const errorMsg = error.response?.data?.extras?.result_codes 
            ? JSON.stringify(error.response.data.extras.result_codes)
            : error.message;
        showMessage('❌ Step 3 Failed: ' + errorMsg, 'error');
    }
}

// ============================================================================
// STEP 4: ALICE CLAIMS FUNDS
// ============================================================================

async function executeStep4() {
    try {
        showMessage('🎬 Step 4: Alice is claiming her 250 XLM...', 'info');
        markStepActive(4);
        
        // Native XLM token address on testnet
        const xlmAddress = 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC';
        
        // Load Alice's account
        const aliceKeypair = StellarSdk.Keypair.fromSecret(ACCOUNTS.alice.secret);
        const account = await server.loadAccount(aliceKeypair.publicKey());
        
        // Build transaction
        const contract = new StellarSdk.Contract(CONFIG.CONTRACT_ADDRESS);
        
        let transaction = new StellarSdk.TransactionBuilder(account, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: CONFIG.NETWORK_PASSPHRASE,
        })
            .addOperation(contract.call(
                'claim_funds',
                StellarSdk.nativeToScVal(aliceKeypair.publicKey(), { type: 'address' }),
                StellarSdk.nativeToScVal(demoState.campaignId, { type: 'u64' }),
                StellarSdk.nativeToScVal(xlmAddress, { type: 'address' })
            ))
            .setTimeout(180)
            .build();
        
        // Simulate and prepare
        console.log('Simulating claim transaction...');
        const simulated = await server.simulateTransaction(transaction);
        
        if (StellarSdk.SorobanRpc.Api.isSimulationSuccess(simulated)) {
            transaction = StellarSdk.SorobanRpc.assembleTransaction(
                transaction,
                simulated
            ).build();
        } else {
            throw new Error('Simulation failed: ' + JSON.stringify(simulated));
        }
        
        // Sign and submit
        transaction.sign(aliceKeypair);
        console.log('Submitting claim transaction...');
        const result = await server.submitTransaction(transaction);
        
        console.log('Claim successful:', result);
        
        showMessage('🎊 THE END! Alice successfully claimed 250 XLM with ZERO platform fees! Demo complete!', 'success');
        
        // Mark step complete
        markStepComplete(4);
        
        // Reload campaign display
        await loadCampaign();
        
    } catch (error) {
        console.error('Step 4 error:', error);
        const errorMsg = error.response?.data?.extras?.result_codes 
            ? JSON.stringify(error.response.data.extras.result_codes)
            : error.message;
        showMessage('❌ Step 4 Failed: ' + errorMsg, 'error');
    }
}

// ============================================================================
// CAMPAIGN DISPLAY FUNCTIONS
// ============================================================================

async function loadCampaign() {
    if (demoState.campaignId === null) {
        return;
    }
    
    try {
        const campaign = await getCampaign(demoState.campaignId);
        
        if (campaign) {
            demoState.campaign = campaign;
            renderCampaign(campaign);
        }
        
    } catch (error) {
        console.error('Failed to load campaign:', error);
    }
}

async function getCampaign(campaignId) {
    try {
        // Use Alice's keypair for simulation
        const aliceKeypair = StellarSdk.Keypair.fromSecret(ACCOUNTS.alice.secret);
        const account = await server.loadAccount(aliceKeypair.publicKey());
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
        console.error('Get campaign error:', error);
        return null;
    }
}

function parseCampaignData(scVal) {
    try {
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

function renderCampaign(campaign) {
    const container = document.getElementById('campaign-info');
    
    const goal = campaign.goal / 10000000;
    const pledged = campaign.pledged / 10000000;
    const progress = Math.min((pledged / goal) * 100, 100);
    
    const stateText = ['🟢 Active', '✅ Successful', '❌ Failed'][campaign.state] || 'Unknown';
    
    container.innerHTML = `
        <div class="stat-card">
            <strong>Campaign ID</strong>
            <div class="big-number">#${demoState.campaignId}</div>
        </div>
        
        <div class="stat-card">
            <strong>Creator</strong>
            <div>👩‍🎨 Alice (${campaign.creator.substring(0, 8)}...${campaign.creator.substring(campaign.creator.length - 8)})</div>
        </div>
        
        <div class="stat-card">
            <strong>Funding Progress</strong>
            <div class="big-number">${pledged.toFixed(2)} / ${goal.toFixed(2)} XLM</div>
            <div class="progress-bar-container" style="margin-top: 15px;">
                <div class="progress-bar" style="width: ${progress}%"></div>
            </div>
            <div style="text-align: center; margin-top: 10px; font-size: 1.2rem; font-weight: bold;">
                ${progress.toFixed(1)}% Complete
            </div>
        </div>
        
        <div class="stat-card">
            <strong>Campaign Status</strong>
            <div style="font-size: 1.5rem; margin-top: 10px;">${stateText}</div>
        </div>
        
        <div class="stat-card">
            <strong>Deadline</strong>
            <div>${new Date(campaign.deadline * 1000).toLocaleString()}</div>
        </div>
    `;
}

// ============================================================================
// UI HELPER FUNCTIONS
// ============================================================================

function markStepActive(stepNum) {
    document.querySelectorAll('.demo-step').forEach(step => {
        step.classList.remove('active');
    });
    document.getElementById(`step${stepNum}`).classList.add('active');
}

function markStepComplete(stepNum) {
    const step = document.getElementById(`step${stepNum}`);
    step.classList.remove('active');
    step.classList.add('completed');
    step.querySelector('button').disabled = true;
}

function enableStep(stepNum) {
    const step = document.getElementById(`step${stepNum}`);
    step.querySelector('button').disabled = false;
}

function showMessage(message, type = 'info') {
    const container = document.getElementById('status-messages');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `status-message status-${type}`;
    messageDiv.textContent = message;
    
    container.appendChild(messageDiv);
    
    // Auto-remove after 8 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 8000);
}

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    showMessage('🎬 Demo Mode Ready! Click "Execute" on Step 1 to begin the narrative.', 'info');
});
