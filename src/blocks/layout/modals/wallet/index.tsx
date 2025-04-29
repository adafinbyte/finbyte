import { FC, useEffect, useState } from 'react';
import { Home, PlugZap, Settings, UserPlus, X } from 'lucide-react';
import { useWallet } from '@meshsdk/react';

import WalletModalOverview from './overview';
import WalletModalAccountSettings from './account-settings';
import { ADA_UNIT } from '@/utils/consts';
import WalletModalCreateAccount from './create-account';
import { account_data, create_account_data } from '@/utils/api/interfaces';
import { checkSignature, generateNonce } from '@meshsdk/core';
import toast from 'react-hot-toast';
import { create_user_account } from '@/utils/api/account/push';
import { author_data, fetch_author_data } from '@/utils/api/account/fetch';
import useThemedProps from '@/contexts/themed-props';

interface custom_props {
  is_modal_open: boolean;
  close_modal: () => void;
}

const WalletModal: FC <custom_props> = ({
  is_modal_open, close_modal
}) => {
  /** @modal_effect */
  useEffect(() => {
    if (is_modal_open) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [is_modal_open]);

  const themed = useThemedProps();
  const use_wallet = useWallet();
  const wallet = use_wallet.wallet;

  interface stat { title: string; data: string | number; }
  const [account_data, set_account_data] = useState<author_data | null>(null);
  const [account_stats, set_account_stats] = useState<stat[]>();

  const [active_tab, set_active_tab] = useState<number>(0);
  const is_finbyte_user = account_data && account_data.accountData !== null ? true : false;
  const finbyte_username = account_data?.accountData?.ada_handle ?? null;

  const get_user_details = async () => {
    const account = await fetch_author_data(use_wallet.address);
    set_account_data(account);

    const balance_str = await wallet.getLovelace();
    const balance = Number(balance_str) / ADA_UNIT;
    const assets_length = (await wallet.getAssets()).length;

    const stats: stat[] = [
      {
        title: 'Balance',
        data: '₳ ' + balance.toLocaleString()
      },
      {
        title: 'Total Assets',
        data: assets_length.toLocaleString()
      },
      {
        title: 'Finbyte Posts',
        data: account ? account.totalPosts : 0
      },
      {
        title: 'Finbyte Kudos',
        data: account ? account.totalKudos : 0
      },
    ];
    set_account_stats(stats);
  }

  const create_finbyte_account = async (details: create_account_data) => {
    if (!use_wallet.address || is_finbyte_user) { return; } else {
      try {
        const signing_string = `${use_wallet.address} is signing this message to confirm Finbyte account creation.`;
        const nonce = generateNonce(signing_string);
        const signature = await wallet.signData(nonce, use_wallet.address);

        if (signature) {
          const is_valid_sig = await checkSignature(nonce, signature, use_wallet.address);
          if (is_valid_sig) {
            const ad: account_data = {
              timestamp:       details.timestamp,
              ada_handle:      details.ada_handle,
              address:         use_wallet.address,
              profile_img:     undefined,
              roles:           undefined,
              badges:          undefined,
              community_badge: undefined,
              ra_timestamp:    undefined,
            }
  
            await create_user_account(ad);
            await get_user_details();
            close_modal();
            set_active_tab(0);
          } else {
            toast.error('Signature verification failed! Whoops.');
            return;
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message)
        } else {
          throw error;
        }
        close_modal();
      }
    }
  }

  useEffect(() => {
    if (use_wallet.connected) {
      get_user_details();
    }
  }, [use_wallet.connected]);

  const overview =
    <WalletModalOverview
      connected_address={use_wallet.address}
      stats={account_stats}
      is_finbyte_user={is_finbyte_user}
      finbyte_username={finbyte_username}
      account_data={account_data}
      close_modal={close_modal}
    />;
  const settings =
    <WalletModalAccountSettings
      refresh_data={get_user_details}
    />;
  const create_user =
    <WalletModalCreateAccount
      connected_address={use_wallet.address}
      create_finbyte_account={create_finbyte_account}
    />;

  const overview_desc = "View your wallet overview.";
  const settings_desc = "View and change your wallet settings.";
  const create_user_desc = "Create your Finbyte Account with AdaHandle support.";

  return (
    <div
      className={`
        fixed inset-0 z-[999] ${themed['900'].bg} bg-opacity-80 flex justify-center items-center
        transition-opacity duration-300 ease-out
        ${is_modal_open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}
    >
      <div className={`${themed['900'].bg} border ${themed['700'].border} shadow-lg ${themed['950'].shadow} rounded-lg w-5/6 lg:w-1/3 scale-95 transition-transform duration-300 ease-out`}>
        {/* Modal Header */}
        <div className={`border-b ${themed['700'].border} p-4 flex justify-between items-center items-start`}>
          <div className="flex flex-col">
            <div className='inline-flex items-center gap-2'>
              <PlugZap size={20} className='text-blue-400'/>
              <h1 className={`text-lg ${themed['300'].text} font-semibold`}>Wallet</h1>
            </div>

            <p className={`text-sm ${themed['500'].text}`}>
              {active_tab === 0 && overview_desc}
              {active_tab === 1 && settings_desc}
              {active_tab === 2 && create_user_desc}
            </p>
          </div>

          <button onClick={close_modal} title='Close Modal' className={`p-2 ${themed.effects.transparent_button.hover} rounded-lg`}>
            <X size={18} className='text-rose-400'/>
          </button>
        </div>

          {/* Modal Body */}
          <div className={`p-4 pr-4 ${themed['300'].text} flex-grow h-64 ${themed.webkit_scrollbar}`}>
            {active_tab === 0 && overview}
            {active_tab === 1 && settings}
            {active_tab === 2 && create_user}
          </div>

          {/* Modal Footer */}
          <div className={`text-xs border-t ${themed['700'].border} p-4 flex items-center gap-1 ${themed['400'].text}`}>
            <button className={`p-2 rounded-lg ${active_tab === 0 ? 'opacity-50' : themed.effects.transparent_button.hover}`} disabled={active_tab === 0} title='Overview' onClick={active_tab === 0 ? undefined : () => set_active_tab(0)}>
              <Home size={18}/>
            </button>

            {is_finbyte_user ?
              <button className={`p-2 rounded-lg ${active_tab === 1 ? 'opacity-50' : themed.effects.transparent_button.hover}`} disabled={active_tab === 1} title='Settings' onClick={active_tab === 1 ? undefined : () => set_active_tab(1)}>
                <Settings size={18}/>
              </button>
              :
              <button className={`p-2 rounded-lg ${active_tab === 2 ? 'opacity-50' : themed.effects.transparent_button.hover}`} disabled={active_tab === 2} title='Create Account' onClick={active_tab === 2 ? undefined : () => set_active_tab(2)}>
                <UserPlus size={18}/>
              </button>
            }

          </div>
        </div>
    </div>
  );
};

export default WalletModal;
