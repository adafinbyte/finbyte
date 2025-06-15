import { BrowserWallet } from '@meshsdk/core';

/** @note - name should be the wallets id */
export interface WalletInformation {
  name: string;
  url: string;
  img: string;
  is_installed: boolean;
}

interface get_cardano_wallets_return {
  error?: string;
  data?: WalletInformation[];
}

/** @todo stop using 3rd party for images */
const predefined_wallets: Omit<WalletInformation, 'is_installed'>[] = [
  {
    name: 'begin',
    url: 'https://begin.is/',
    img: 'https://play-lh.googleusercontent.com/X3MDLub2TEq8-zVVWfx5if8X7vZtQ7kz2QwV8BMCbPLMk-blvJ_kSw3R4ehI1X4S-ERG',
  },
  {
    name: 'eternl',
    url: 'https://eternl.io',
    img: 'https://fluidtokens.com/assets/images/dapps/eternl.png',
  },
  {
    name: 'lace',
    url: '',
    img: 'https://fluidtokens.com/assets/images/dapps/lace.svg'
  },
  {
    name: 'vespr',
    url: 'https://vespr.xyz/',
    img: 'https://cdn.prod.website-files.com/614c99cf4f23700c8aa3752a/6778546056a2e86e20a557cb_VESPR%20WALLET.png',
  },
];

/**
 * @note
 * Although we have hardcoded supported wallets, this doesn't mean they're
 * the only wallets supported. We search for any wallets that aren't listed,
 * displaying all installed wallets first.
 * The reason for this is to showcase other Cardano wallets allowing the end
 * user to discover more.
 **/
export const get_cardano_wallets = async (): Promise<get_cardano_wallets_return> => {
  try {
    const users_wallets = BrowserWallet.getInstalledWallets(); // sync
    const installed_names = users_wallets.map(w => w.name.toLowerCase());

    const base_wallets: WalletInformation[] = predefined_wallets.map(wallet => ({
      ...wallet,
      is_installed: installed_names.includes(wallet.name.toLowerCase()),
    }));

    const additional_wallets: WalletInformation[] = users_wallets
      .filter(w => !predefined_wallets.find(p => p.name.toLowerCase() === w.name.toLowerCase()))
      .map(w => ({
        name: w.name,
        url: '',
        img: w.icon || '',
        is_installed: true,
      }));

    const all_wallets: WalletInformation[] = [...base_wallets, ...additional_wallets]
      .sort((a, b) => Number(b.is_installed) - Number(a.is_installed));

    return { data: all_wallets };
  } catch (error) {
    return { error: 'Failed to fetch installed wallets' };
  }
};
