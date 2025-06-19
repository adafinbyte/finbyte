import { cardanscan_key } from "../secrets";


interface fetch_transaction_count_for_asset_return { error?: string; data?: number }
export const fetch_transaction_count_for_asset = async (
  policy_id: string
): Promise<fetch_transaction_count_for_asset_return> => {
  const page = 1;
  try {
    const res = await fetch(
      `https://api.cardanoscan.io/api/v1/asset/list/byPolicyId?policyId=${policy_id}&pageNo=${page}`,
      {
        method: 'GET',
        headers: {
          'apiKey': cardanscan_key
        }
      }
    );

    if (!res.ok) {
      return { error: `API returned ${res.status}` };
    }

    const data = await res.json();
    const tx_count = data.tokens?.[0]?.txCount ?? 0;

    return { data: tx_count };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    } else {
      return { error: "Unknown error occurred." };
    }
  }
}