import { blockfrost_key } from "@/utils/secrets";
import { safe_fetched_return } from "../interfaces";
import { asset_res } from "./pool-pm";

export interface asset_tx {
  tx_hash: string;
  tx_index: number;
  block_height: number;
  block_time: number
}
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

export const get_blockfrost_address_transactions = async (
  address: string
): Promise<safe_fetched_return | void> => {  
  const params = new URLSearchParams({
    order: 'desc',
    count: '25'
  });
  const url = `https://cardano-mainnet.blockfrost.io/api/v0/addresses/${address}/transactions?${params.toString()}`;
  try {
    const response = await fetch(url, {headers: {'Project_id': blockfrost_key}});
    if (!response.ok) {
      console.error(`${response.status} - ${response.statusText}`);
      return { error: `${response.status} - ${response.statusText}` };
    }
    const data: asset_tx[] = await response.json();

    if (data !== null) {
      return {data: data};
    }
  } catch (error) {
    return;
  }
}

interface output_type {
  unit: string;
  quantity: string;
}
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

interface amount {
  unit: string;
  quantity: string;
  decimals: number;
  has_nft_onchain_metadata: boolean;
}
export interface address_information {
  address: string;
  amount: amount[];
  stake_address: string;
  type: string;
  script: boolean;
}
export const get_blockfrost_address_information = async (
  address: string
): Promise<safe_fetched_return | void> => {
  const url = `https://cardano-mainnet.blockfrost.io/api/v0/addresses/${address}/extended`;
  try {
    const response = await fetch(url, {headers: {'Project_id': blockfrost_key}});
    if (!response.ok) {
      return { error: `${response.status} - ${response.statusText}`};
    }
    const data: address_information = await response.json();

    if (data !== null) {
      return {data: data};
    }
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
  }
}

export interface address_details {
  address: string;
  quantity: string;
  received_sum: output_type[];
  sent_sum: output_type[];
  tx_count: number;
}
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

export interface specific_asset {
  asset: string;
  policy_id: string;
  asset_name: string;
  fingerprint: string;
  quantity: string;
  initial_mint_tx_hash: string;
  mint_or_burn_count: number;
  onchain_metadata: object;
  onchain_metadata_standard: string;
  onchain_metadata_extra: string;
  metadata: {
    name: string;
    description: string;
    ticker: string;
    decimals: number;
    image: string;
  }
}
export const get_blockfrost_specific_asset = async (
  policy_plus_hex: string
): Promise<safe_fetched_return | void> => {
  const url = `https://cardano-mainnet.blockfrost.io/api/v0/assets/${policy_plus_hex}`;
  try {
    const response = await fetch(url, {headers: {'Project_id': blockfrost_key}});
    if (!response.ok) {
      return { error: `${response.status} - ${response.statusText}`};
    }
    const data: specific_asset = await response.json();

    if (data !== null) {
      return { data: data };
    }
  } catch (error) {
    return { error: 'Failed get_blockfrost_specific_asset'};
  }
  return;
}

export interface Asset {
  unit: string;
  quantity: string;
  decimals?: number;
  has_nft_onchain_metadata: boolean;
}

export interface AddressInformation {
  address: string;
  assets: Asset[];
  stake_address?: string;
  type?: string;
  script?: boolean;
}

export const getAddressAssets = async (
  address: string,
  page: number = 1,
  count: number = 10
): Promise<AddressInformation | { error: string }> => {
  const url = `https://cardano-mainnet.blockfrost.io/api/v0/addresses/${address}/utxos?page=${page}&count=${count}`;

  try {
    const response = await fetch(url, {
      headers: { 'project_id': blockfrost_key },
    });

    if (!response.ok) {
      return { error: `${response.status} - ${response.statusText}` };
    }

    const utxos = await response.json();

    const assetsMap: { [unit: string]: Asset } = {};

    for (const utxo of utxos) {
      for (const amount of utxo.amount) {
        if (amount.unit === 'lovelace') continue;

        if (!assetsMap[amount.unit]) {
          const assetDetails = await fetch(
            `https://cardano-mainnet.blockfrost.io/api/v0/assets/${amount.unit}`,
            { headers: { 'project_id': blockfrost_key } }
          ).then((res) => res.json());

          const isNFT = assetDetails.onchain_metadata && assetDetails.quantity === '1';

          assetsMap[amount.unit] = {
            unit: amount.unit,
            quantity: amount.quantity,
            decimals: assetDetails.decimals,
            has_nft_onchain_metadata: isNFT,
          };
        } else {
          assetsMap[amount.unit].quantity = (
            BigInt(assetsMap[amount.unit].quantity) + BigInt(amount.quantity)
          ).toString();
        }
      }
    }

    return {
      address,
      assets: Object.values(assetsMap),
    };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'An unknown error occurred' };
  }
};
