import { FC, useEffect, useState } from 'react';
import { ArrowRight, MessageCircle, PlugZap, X } from 'lucide-react';
import { BrowserWallet, Wallet } from '@meshsdk/core';
import { useRouter } from 'next/router';
import useThemedProps from '@/contexts/themed-props';
import ConnectWalletDetect from './detect-wallet';
import ConnectWalletImport from './import-wallet';
import Link from 'next/link';

interface custom_props {
  is_modal_open: boolean;
  close_modal: () => void;

  attempt_connect: (chosen_wallet: Wallet) => void;
}

const ConnectWalletModal: FC <custom_props> = ({
  is_modal_open, close_modal, attempt_connect
}) => {
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

  const router = useRouter();
  const [installed_wallets, set_installed_wallets] = useState<Wallet[] | undefined>();

  const get_wallets = async () => {
    const users_wallets = await BrowserWallet.getAvailableWallets();
    set_installed_wallets(users_wallets);
  }

  useEffect(() => {
    get_wallets();
  }, []);

  const themed = useThemedProps();

  type view = 'detect' | 'import';
  const [current_view, set_current_view] = useState<view>('detect');

  const toggle_selected_wallet = async (chosen_wallet: Wallet) => {
    attempt_connect(chosen_wallet);
    close_modal();
  }

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
              <PlugZap size={18} className='text-blue-400'/>

              <h1 className={`text-lg ${themed['300'].text} font-semibold`}>Connect Wallet</h1>
            </div>

            <p className={`text-sm ${themed['500'].text}`}>Choose a wallet to connect.</p>
          </div>

          <button onClick={close_modal} title='Close Modal' className={`p-2 ${themed.effects.transparent_button.hover} rounded-lg`}>
            <X size={18} className='text-rose-400'/>
          </button>
        </div>

        {/* Modal Body */}
        <div className={`p-2 ${themed['300'].text} w-full max-w-content flex flex-col justify-start gap-2`}>
          <span className="inline-flex">
            <h1 className={`text-left text-xs font-semibold ${themed['500'].text} border-b ${themed['500'].border}`}>
              Connect Type
            </h1>
          </span>

          <div className='flex w-full items-center gap-1 text-sm'>
            <button onClick={() => set_current_view('detect')} className={`p-1 ${themed.effects.transparent_button.hover} rounded-lg ${current_view === 'detect' ? themed['300'].text : themed['500'].text}`}>
              Detect Wallet
            </button>

            <button onClick={() => set_current_view('import')} className={`p-1 ${themed.effects.transparent_button.hover} rounded-lg ${current_view === 'import' ? themed['300'].text : themed['500'].text}`}>
              Import Wallet
            </button>
          </div>

          <div className={`py-2 h-64 ${themed.webkit_scrollbar}`}>
            {current_view === 'detect' && (
              <ConnectWalletDetect 
                installed_wallets={installed_wallets}
                toggle_selected_wallet={toggle_selected_wallet}
                close_modal={close_modal}
                />
            )}

            {/** @todo */}
            {current_view === 'import' && (
              <ConnectWalletImport
              />
            )}
          </div>
        </div>

        <div className={`text-xs border-t ${themed['700'].border} ${themed['400'].text} p-4 flex flex-col items-center gap-2`}>
          <div className='flex w-full'>
            <span className='ml-auto text-xs'>
              Finbyte uses Mesh to handle wallet connections.
              <Link href={'https://meshjs.dev/'} target='_blank' className='ml-1 text-blue-400 inline-flex items-center gap-1 group'>
                Learn More
                <ArrowRight className='size-3 group-hover:translate-x-0.5 duration-300'/>
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectWalletModal;