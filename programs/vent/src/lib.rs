use anchor_lang::prelude::*;

pub mod constant;
pub mod error;
pub mod states;
use crate::{constant::*, error::*, states::*};

declare_id!("8CvCMAGgCxjeZYmYCFxEsoWpGz7xq6eTwUPiDW4R7qgU");

#[program]
pub mod vent {
    use super::*;

    pub fn initialize_user(ctx: Context<InitializeUser>) -> Result<()> {
        let user_profile = &mut ctx.accounts.user_profile;
        user_profile.authority = ctx.accounts.authority.key();
        user_profile.last_vent = 0;
        user_profile.vent_count = 0;

        Ok(())
    }

    pub fn add_vent(ctx:Context<AddVent>, _content: String) -> Result<()> {
        let vent_account = &mut ctx.accounts.vent_account;
        let user_profile = &mut ctx.accounts.user_profile;

        require!(!_content.is_empty(), VentError::VentNotEmpty);

        vent_account.authority = ctx.accounts.authority.key();
        vent_account.idx = user_profile.last_vent;
        vent_account.content = _content;

        user_profile.last_vent = user_profile.last_vent.checked_add(1).unwrap();

        user_profile.vent_count = user_profile.vent_count.checked_add(1).unwrap();

        Ok(())
    }

    pub fn remove_vent(ctx:Context<RemoveVent>, todo_idx: u8) -> Result<()> {
        let user_profile = &mut ctx.accounts.user_profile;
        user_profile.vent_count = user_profile.vent_count.checked_sub(1).unwrap();

        Ok(())
    }

}

#[derive(Accounts)]
#[instruction()]
pub struct InitializeUser<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        seeds = [USER_TAG, authority.key().as_ref()],
        bump,
        payer = authority,
        space = 8 + std::mem::size_of::<UserProfile>(),
    )]
    pub user_profile: Box<Account<'info, UserProfile>>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction()]
pub struct AddVent<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [USER_TAG, authority.key().as_ref()],
        bump,
        has_one = authority,
    )]
    pub user_profile: Box<Account<'info, UserProfile>>,

    #[account(
        init,
        seeds = [VENT_TAG, authority.key().as_ref(), &[user_profile.last_vent as u8].as_ref()],
        bump,
        payer = authority,
        space = 8 + std::mem::size_of::<VentAccount>(),
    )]
    pub vent_account: Box<Account<'info, VentAccount>>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(vent_idx: u8)]
pub struct RemoveVent<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [USER_TAG, authority.key().as_ref()],
        bump,
        has_one = authority,
    )]
    pub user_profile: Box<Account<'info, UserProfile>>,

    #[account(
        mut,
        close = authority,
        seeds = [VENT_TAG, authority.key().as_ref(), &[vent_idx].as_ref()],
        bump,
        has_one = authority
    )]
    pub vent_account: Box<Account<'info, VentAccount>>,

    pub system_program: Program<'info, System>,
}