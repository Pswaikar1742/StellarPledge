
#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracterror, contracttype, token, Address, Env, Map,
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
pub struct Campaign {
    pub creator: Address,
    pub goal: u128,
    pub pledged: u128,
    pub deadline: u64,
    pub state: CampaignState,
    pub backers: Map<Address, u128>,
}

#[contracttype]
#[derive(Clone)]
pub enum StorageKey {
    Campaigns(u64),
    CampaignCounter,
}

#[contractimpl]
impl StellarPledgeContract {
    pub fn create_campaign(env: Env, creator: Address, goal: u128, deadline: u64) -> Result<u64, Error> {
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

        let new_campaign = Campaign {
            creator: creator.clone(),
            goal,
            pledged: 0,
            deadline,
            state: CampaignState::Active,
            backers: Map::new(&env),
        };

        env.storage()
            .instance()
            .set(&StorageKey::Campaigns(campaign_id), &new_campaign);

        env.storage()
            .instance()
            .set(&StorageKey::CampaignCounter, &(campaign_id + 1));

        Ok(campaign_id)
    }

    pub fn pledge(env: Env, backer: Address, campaign_id: u64, amount: u128, token_address: Address) -> Result<(), Error> {
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

        let token_client = token::Client::new(&env, &token_address);
        token_client.transfer(&backer, &env.current_contract_address(), &(amount as i128));

        campaign.pledged += amount;
        let current_pledge = campaign.backers.get(backer.clone()).unwrap_or(0);
        campaign.backers.set(backer, current_pledge + amount);

        if campaign.pledged >= campaign.goal {
            campaign.state = CampaignState::Successful;
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
