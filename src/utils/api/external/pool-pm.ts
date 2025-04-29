
export interface pool_pm_fingerprint {
  epoch: number;
  mint:  number;
  owner: string;
}

export const get_pool_pm_asset = async (fingerprint: string): Promise<pool_pm_fingerprint | undefined> => {
  try {
    const response = await fetch(`https://pool.pm/asset/${fingerprint}?preview=true`);
    if (!response.ok) {
      console.error(`${response.status} - ${response.statusText}`);
      return;
    }
    const data: pool_pm_fingerprint = await response.json();

    if (data !== null) {
      return data;
    }
  } catch (error) {
    return;
  }
}
