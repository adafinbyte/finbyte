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

  const use_wallet = useWallet();
  const wallet = use_wallet.wallet;

  interface stat { title: string; data: string | number; }
  const [account_data, set_account_data] = useState<author_data | null>(null);
  const [account_stats, set_account_stats] = useState<stat[]>();

  const [active_tab, set_active_tab] = useState<number>(0);
  const finbyte_user = account_data && account_data.accountData !== null ? true : false;

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
    if (!use_wallet.address || finbyte_user) { return; } else {
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
    get_user_details();
  }, []);

  const overview =
    <WalletModalOverview
      connected_address={use_wallet.address}
      stats={account_stats}
      finbyte_user={finbyte_user}
      account_data={account_data}
    />;
  const settings =
    <WalletModalAccountSettings
      connected_address={use_wallet.address}
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
    <div className="inline-flex">
      {/* Modal */}
      <div
        className={`fixed inset-0 bg-neutral-900 bg-opacity-80 flex justify-center items-center z-[999] transition-opacity duration-300 ease-out ${
          is_modal_open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col min-h-80 max-h-96 text-left bg-neutral-900 border border-neutral-800 shadow-sm shadow-neutral-700/20 rounded-lg w-9/12 sm:w-7/12 md:w-5/12 lg:w-3/12 scale-95 transition-transform duration-300 ease-out">
          {/* Modal Header */}
          <div className="border-b border-neutral-800 p-4 flex justify-between items-start">
            <div className="flex flex-col">
              <div className='inline-flex items-center gap-1'>
                <PlugZap size={20} className='text-blue-400'/>
                <h1 className="text-lg text-neutral-300 font-semibold">Wallet</h1>
              </div>

              <p className="text-sm text-neutral-500">
                {active_tab === 0 && overview_desc}
                {active_tab === 1 && settings_desc}
                {active_tab === 2 && create_user_desc}
              </p>
            </div>

            <button onClick={close_modal} title='Close Modal' className='p-2 hover:bg-neutral-800 rounded-lg'>
              <X size={16} className='text-rose-400'/>
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-4 text-neutral-300 flex-grow h-80 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:bg-neutral-500">
            {active_tab === 0 && overview}
            {active_tab === 1 && settings}
            {active_tab === 2 && create_user}
          </div>

          {/* Modal Footer */}
          <div className="text-xs border-t border-neutral-800 p-4 flex items-center gap-1">
            <button className='p-2 hover:bg-neutral-800 rounded-lg' disabled={active_tab === 0} title='Overview' onClick={active_tab === 0 ? undefined : () => set_active_tab(0)}>
              <Home size={16}/>
            </button>

            {finbyte_user ?
              <button className='p-2 hover:bg-neutral-800 rounded-lg' disabled={active_tab === 1} title='Settings' onClick={active_tab === 1 ? undefined : () => set_active_tab(1)}>
                <Settings size={16}/>
              </button>
              :
              <button className='p-2 hover:bg-neutral-800 rounded-lg' disabled={active_tab === 2} title='Create Account' onClick={active_tab === 2 ? undefined : () => set_active_tab(2)}>
                <UserPlus size={16}/>
              </button>
            }

          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletModal;
