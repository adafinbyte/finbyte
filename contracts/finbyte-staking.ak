use aiken/crypto.{VerificationKeyHash}
use cardano/transaction.{Transaction, OutputReference}
use vodka_extra_signatories.{key_signed}
use vodka_validity_range.{valid_after}

pub type StakeDatum {
  staker: VerificationKeyHash,
  stake_amount: Int,
  stake_start_time: Int,
  min_duration: Int
}

validator staking {
  spend(
    datum_opt: Option<StakeDatum>,
    _redeemer: Data,
    _input: OutputReference,
    tx: Transaction,
  ) {
    expect Some(datum) = datum_opt

    let unlock_time = datum.stake_start_time + datum.min_duration

    // Can only unstake if the signer is the original staker AND the time is valid
    and {
      key_signed(tx.extra_signatories, datum.staker),
      valid_after(tx.validity_range, unlock_time),
    }
  }

  else(_) {
    fail
  }
}
