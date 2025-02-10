#![allow(unexpected_cfgs)]
use anchor_lang::prelude::*;

declare_id!("6z68wfurCMYkZG51s1Et9BJEd9nJGUusjHXNt4dGbNNF");
pub const ANCHOR_DISCRIMINATOR_SIZE: usize = 8;

#[program]
pub mod voting {
    use super::*;

    pub fn initialize_poll(
        ctx: Context<InitializePoll>,
        poll_id: u64,
        poll_name: String,
        description: String,
        poll_start: u64,
        poll_end: u64,
    ) -> Result<()> {
        let poll_account = &mut ctx.accounts.poll_account;
        poll_account.poll_id = poll_id;
        poll_account.poll_name = poll_name;
        poll_account.description = description;
        poll_account.poll_start = poll_start;
        poll_account.poll_end = poll_end;
        poll_account.candidate_amount = 0;

        Ok(())
    }

    pub fn initialize_candidate(
        ctx: Context<InitializeCandidate>,
        poll_id: u64,
        candidate_name: String,
    ) -> Result<()> {
        let poll_account = &mut ctx.accounts.poll_account;
        let candidate_account = &mut ctx.accounts.candidate_account;

        candidate_account.candidate_name = candidate_name;
        candidate_account.poll_id = poll_id;
        candidate_account.candidate_votes = 0;

        poll_account.candidate_amount += 1;

        Ok(())
    }

    pub fn vote(ctx: Context<Vote>, _poll_id: u64, _candidate_name: String) -> Result<()> {
        let candidate_account = &mut ctx.accounts.candidate_account;
        candidate_account.candidate_votes += 1;

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(poll_id: u64, candidate_name: String)]
pub struct Vote<'info> {
    #[account()]
    pub signer: Signer<'info>,

    #[account(
        mut,
        seeds = [poll_id.to_le_bytes().as_ref(), candidate_name.as_bytes()],
        bump
    )]
    pub candidate_account: Account<'info, CandidateAccount>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(poll_id: u64)]
pub struct InitializePoll<'info> {
    // We need signer bcz we need to create a poll account
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        init,
        payer = signer,
        space = ANCHOR_DISCRIMINATOR_SIZE + PollAccount::INIT_SPACE,
        seeds = [poll_id.to_le_bytes().as_ref()],
        bump
    )]
    pub poll_account: Account<'info, PollAccount>,

    // Required bcz of 'init' passed
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(poll_id: u64, candidate_name: String)]
pub struct InitializeCandidate<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        mut,
        seeds = [poll_id.to_le_bytes().as_ref()],
        bump
    )]
    pub poll_account: Account<'info, PollAccount>,

    #[account(
        init,
        payer = signer,
        space = ANCHOR_DISCRIMINATOR_SIZE + CandidateAccount::INIT_SPACE,
        seeds = [poll_id.to_le_bytes().as_ref(), candidate_name.as_bytes()],
        bump
    )]
    pub candidate_account: Account<'info, CandidateAccount>,

    // Required bcz of 'init' passed
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct PollAccount {
    poll_id: u64,
    #[max_len(32)]
    poll_name: String,
    #[max_len(260)]
    description: String,
    poll_start: u64,
    poll_end: u64,
    candidate_amount: u64,
}

#[account]
#[derive(InitSpace)]
pub struct CandidateAccount {
    poll_id: u64,
    #[max_len(32)]
    candidate_name: String,
    candidate_votes: u64,
}
