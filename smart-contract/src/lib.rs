
#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracterror, contracttype, log, token, Address, Env, Map, Symbol,
};

#[contract]
pub struct StellarPledgeContract;

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    InvalidGoalAmount = 1,
    DeadlineInThePast = 2,
    CampaignNotFound = 3,
    CampaignEnded = 4,
    PledgeAmountZero = 5,
    NotTheCreator = 6,
    CampaignStillActive = 7,
    CampaignNotSuccessful = 8,
    CampaignNotFailed = 9,
    PerkTransferFailed = 10,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum CampaignState {
    Active = 0,
    Successful = 1,
    Failed = 2,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PerkConfig {
    pub threshold: u128,           // Minimum pledge amount to earn perk
    pub asset_address: Address,    // Address of the perk token contract
    pub amount: i128,              // Amount of perk tokens to transfer (e.g., 1 token)
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Campaign {
    pub creator: Address,
    pub goal: u128,
    pub pledged: u128,
    pub deadline: u64,
    pub state: CampaignState,
    pub backers: Map<Address, u128>,
    pub perk: Option<PerkConfig>,  // Optional perk configuration
}

#[contracttype]
#[derive(Clone)]
pub enum StorageKey {
    Campaigns(u64),
    CampaignCounter,
}

#[contractimpl]
impl StellarPledgeContract {
    /// Create a new campaign with optional perk rewards
    /// 
    /// # Arguments
    /// * `creator` - Campaign creator's address
    /// * `goal` - Funding goal in stroops
    /// * `deadline` - Unix timestamp deadline
    /// * `perk_threshold` - Optional: minimum pledge to earn perk (0 = no perk)
    /// * `perk_asset` - Optional: address of reward token contract
    /// * `perk_amount` - Optional: amount of tokens to reward (e.g., 1000000 = 1 token with 6 decimals)
    pub fn create_campaign(
        env: Env,
        creator: Address,
        goal: u128,
        deadline: u64,
        perk_threshold: u128,
        perk_asset: Option<Address>,
        perk_amount: i128,
    ) -> Result<u64, Error> {
        creator.require_auth();

        if goal == 0 {
            return Err(Error::InvalidGoalAmount);
        }

        let current_time = env.ledger().timestamp();
        if deadline <= current_time {
            return Err(Error::DeadlineInThePast);
        }

        let campaign_id: u64 = env
            .storage()
            .instance()
            .get(&StorageKey::CampaignCounter)
            .unwrap_or(0);

        // Configure perk if threshold is set and asset is provided
        let perk_config = if perk_threshold > 0 && perk_asset.is_some() && perk_amount > 0 {
            Some(PerkConfig {
                threshold: perk_threshold,
                asset_address: perk_asset.unwrap(),
                amount: perk_amount,
            })
        } else {
            None
        };

        let new_campaign = Campaign {
            creator: creator.clone(),
            goal,
            pledged: 0,
            deadline,
            state: CampaignState::Active,
            backers: Map::new(&env),
            perk: perk_config,
        };

        env.storage()
            .instance()
            .set(&StorageKey::Campaigns(campaign_id), &new_campaign);

        env.storage()
            .instance()
            .set(&StorageKey::CampaignCounter, &(campaign_id + 1));

        log!(&env, "Campaign {} created by {} with goal {}", campaign_id, creator, goal);
        
        Ok(campaign_id)
    }

    /// Make a pledge to a campaign
    /// 
    /// This function handles:
    /// 1. Accepting the backer's XLM pledge into escrow
    /// 2. Automatically transferring perk tokens if pledge meets threshold
    /// 3. Updating campaign state to Successful if goal is reached
    pub fn pledge(
        env: Env,
        backer: Address,
        campaign_id: u64,
        amount: u128,
        token_address: Address,
    ) -> Result<(), Error> {
        backer.require_auth();

        if amount == 0 {
            return Err(Error::PledgeAmountZero);
        }

        let mut campaign: Campaign = env
            .storage()
            .instance()
            .get(&StorageKey::Campaigns(campaign_id))
            .ok_or(Error::CampaignNotFound)?;

        let current_time = env.ledger().timestamp();
        if current_time >= campaign.deadline || campaign.state != CampaignState::Active {
            return Err(Error::CampaignEnded);
        }

        // Transfer pledge amount from backer to contract (escrow)
        let token_client = token::Client::new(&env, &token_address);
        token_client.transfer(&backer, &env.current_contract_address(), &(amount as i128));

        log!(&env, "Backer {} pledged {} to campaign {}", backer, amount, campaign_id);

        // Update campaign state
        campaign.pledged += amount;
        let current_pledge = campaign.backers.get(backer.clone()).unwrap_or(0);
        let total_backer_pledge = current_pledge + amount;
        campaign.backers.set(backer.clone(), total_backer_pledge);

        // 🎁 AUTOMATED PERK DISTRIBUTION - THE INNOVATION!
        if let Some(perk) = &campaign.perk {
            // Check if this backer's TOTAL pledge meets or exceeds the threshold
            if total_backer_pledge >= perk.threshold {
                log!(
                    &env,
                    "🎉 Perk triggered! {} pledged {}, threshold is {}",
                    backer,
                    total_backer_pledge,
                    perk.threshold
                );

                // Cross-contract call to the perk asset token
                let perk_token_client = token::Client::new(&env, &perk.asset_address);
                
                // Transfer perk tokens from creator to backer
                // Note: Creator must have approved the contract or have sufficient balance
                perk_token_client.transfer(&campaign.creator, &backer, &perk.amount);

                log!(
                    &env,
                    "✅ Perk transferred: {} tokens from {} to {}",
                    perk.amount,
                    campaign.creator,
                    backer
                );
            }
        }

        // Check if campaign goal is reached
        if campaign.pledged >= campaign.goal {
            campaign.state = CampaignState::Successful;
            log!(&env, "🎯 Campaign {} reached its goal!", campaign_id);
        }

        env.storage()
            .instance()
            .set(&StorageKey::Campaigns(campaign_id), &campaign);

        Ok(())
    }

    pub fn claim_funds(env: Env, creator: Address, campaign_id: u64, token_address: Address) -> Result<(), Error> {
        creator.require_auth();

        let campaign: Campaign = env
            .storage()
            .instance()
            .get(&StorageKey::Campaigns(campaign_id))
            .ok_or(Error::CampaignNotFound)?;

        if campaign.creator != creator {
            return Err(Error::NotTheCreator);
        }

        if campaign.state != CampaignState::Successful {
            return Err(Error::CampaignNotSuccessful);
        }

        let token_client = token::Client::new(&env, &token_address);
        token_client.transfer(
            &env.current_contract_address(),
            &creator,
            &(campaign.pledged as i128),
        );

        Ok(())
    }

    pub fn withdraw_refund(env: Env, backer: Address, campaign_id: u64, token_address: Address) -> Result<(), Error> {
        backer.require_auth();

        let mut campaign: Campaign = env
            .storage()
            .instance()
            .get(&StorageKey::Campaigns(campaign_id))
            .ok_or(Error::CampaignNotFound)?;

        if campaign.state != CampaignState::Failed {
            return Err(Error::CampaignNotFailed);
        }

        let pledge_amount = campaign
            .backers
            .get(backer.clone())
            .ok_or(Error::CampaignNotFound)?;

        let token_client = token::Client::new(&env, &token_address);
        token_client.transfer(
            &env.current_contract_address(),
            &backer,
            &(pledge_amount as i128),
        );

        campaign.backers.remove(backer);

        env.storage()
            .instance()
            .set(&StorageKey::Campaigns(campaign_id), &campaign);

        Ok(())
    }

    pub fn get_campaign(env: Env, campaign_id: u64) -> Result<Campaign, Error> {
        env.storage()
            .instance()
            .get(&StorageKey::Campaigns(campaign_id))
            .ok_or(Error::CampaignNotFound)
    }
}
