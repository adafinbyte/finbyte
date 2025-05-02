

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

interface amount {unit: string; quantity: string; decimals: number; has_nft_onchain_metadata: boolean;}
export interface address_information {address: string; amount: amount[]; stake_address: string; type: string; script: boolean;}
export const get_blockfrost_address_information = async (address: string) => {
  const url = `https://cardano-mainnet.blockfrost.io/api/v0/addresses/${address}/extended`;
  try {
    const response = await fetch(url, {headers: {'Project_id': blockfrost_key}});
    if (!response.ok) {
      console.error(`${response.status} - ${response.statusText}`);
      return;
    }
    const data: address_information = await response.json();

    if (data !== null) {
      return data;
    }
  } catch (error) {
    return;
  }
}

export interface address_details {address: string; quantity: string; received_sum: output_type[]; sent_sum: output_type[]; tx_count: number;}
export const get_blockfrost_address_details = async (address: string) => {
  const url = `https://cardano-mainnet.blockfrost.io/api/v0/addresses/${address}/total`;
  try {
    const response = await fetch(url, {headers: {'Project_id': blockfrost_key}});
    if (!response.ok) {
      console.error(`${response.status} - ${response.statusText}`);
      return;
    }
    const data: address_details = await response.json();

    if (data !== null) {
      return data;
    }
  } catch (error) {
    return;
  }
}
