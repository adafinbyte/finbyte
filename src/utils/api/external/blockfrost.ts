import { blockfrost_key } from "../secrets";

export interface bf_specific_asset {
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
}
interface get_specific_asset_return { error?: string; data?: bf_specific_asset }
export const get_specific_asset = async (policy_id_plus_asset_name: string): Promise<get_specific_asset_return> => {
  const base_url = "https://cardano-preprod.blockfrost.io/api/v0/assets/";
  const endpoint = base_url + policy_id_plus_asset_name;

  try {
    const response = await fetch(endpoint, {
      headers: { 'Project_id': blockfrost_key }
    });

    if (!response.ok) {
      return { error: `${response.status} - ${response.statusText}` };
    }

    const data: bf_specific_asset = await response.json();

    if (data !== null) {
      return { data };
    } else {
      return { error: "No asset data found." };
    }
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    } else {
      return { error: "Unknown error occurred." };
    }
  }
};

export interface asset_address {
  address: string;
  quantity: string;
}
interface get_asset_addresses_return { error?: string; data?: asset_address[] }
export const get_asset_addresses = async (policy_id_plus_asset_name: string): Promise<get_asset_addresses_return> => {
  const base_url = "https://cardano-preprod.blockfrost.io/api/v0/assets/";
  const endpoint = base_url + policy_id_plus_asset_name + '/addresses';

  try {
    const response = await fetch(endpoint, {
      headers: { 'Project_id': blockfrost_key }
    });

    if (!response.ok) {
      return { error: `${response.status} - ${response.statusText}` };
    }

    const data: asset_address[] = await response.json();

    if (data !== null) {
      return { data };
    } else {
      return { error: "No asset data found." };
    }
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    } else {
      return { error: "Unknown error occurred." };
    }
  }
};