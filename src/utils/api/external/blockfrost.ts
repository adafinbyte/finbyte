

//https://docs.blockfrost.io/#tag/cardano--network

import { blockfrost_key } from "@/utils/secrets";

export interface asset_tx {tx_hash: string; tx_index: number; block_height: number; block_time: number}
export const get_blockfrost_asset_transactions = async (policy_plus_hex: string) => {  
  const params = new URLSearchParams({
    order: 'desc',
    count: '25'
  });
  const url = `https://cardano-mainnet.blockfrost.io/api/v0/assets/${policy_plus_hex}/transactions?${params.toString()}`;
  try {
    const response = await fetch(url, {headers: {'Project_id': blockfrost_key}});
    if (!response.ok) {
      console.error(`${response.status} - ${response.statusText}`);
      return;
    }
    const data: asset_tx[] = await response.json();

    if (data !== null) {
      return data;
    }
  } catch (error) {
    return;
  }
}

interface output_type {unit: string; quantity: string;}
export interface tx {
  hash: string; block: string; block_height: number; block_time: number; slot: number; index: number;
  output_amount: output_type[]; fees: string; size: number; utxo_count: number;
}
export const get_blockfrost_transaction = async (tx_hash: string) => {
  const url = `https://cardano-mainnet.blockfrost.io/api/v0/txs/${tx_hash}`;
  try {
    const response = await fetch(url, {headers: {'Project_id': blockfrost_key}});
    if (!response.ok) {
      console.error(`${response.status} - ${response.statusText}`);
      return;
    }
    const data: tx = await response.json();

    if (data !== null) {
      return data;
    }
  } catch (error) {
    return;
  }
}