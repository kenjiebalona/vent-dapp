use anchor_lang::prelude::*;

#[error_code]
pub enum VentError {
    #[msg("You are not authorized to perform this action.")]
    Unauthorized,
    #[msg("Not allowed.")]
    NotAllowed,
    #[msg("Vent can't be empty.")]
    VentNotEmpty,
}