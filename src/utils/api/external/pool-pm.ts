
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

export interface pool_pm_adahandle {
  epoch: number;
  mint:  number;
  metadata: {
    characters: string;
    handle_type: string;
    image: string;
    length: number;
    mediaType: string;
    name: string;
    numeric_modifiers: string;
    og: number;
    og_number: number;
    rarity: string;
    version: number;
},
}

export const get_pool_pm_adahandle = async (fingerprint: string): Promise<pool_pm_adahandle | undefined> => {
  try {
    const response = await fetch(`https://pool.pm/asset/${fingerprint}?preview=true`);
    if (!response.ok) {
      console.error(`${response.status} - ${response.statusText}`);
      return;
    }
    const data: pool_pm_adahandle = await response.json();

    if (data !== null) {
      return data;
    }
  } catch (error) {
    return;
  }
}