use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct UserProfile {
    pub authority: Pubkey,
    pub last_vent: u8,
    pub vent_count: u8
}

#[account]
#[derive(Default)]
pub struct VentAccount {
    pub authority: Pubkey,
    pub idx: u8,
    pub content: String
}