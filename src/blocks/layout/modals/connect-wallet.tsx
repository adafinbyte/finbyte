import { FC, useEffect, useState } from 'react';
import { MessageCircle, PlugZap, X } from 'lucide-react';
import { BrowserWallet, Wallet } from '@meshsdk/core';
import { useRouter } from 'next/router';

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

  const handle_learn_more = () => {
    router.push({
      pathname: '/documents',
      /** @note this is the tab id for "Get a Wallet" */
      //query: { tab_id: 2.2 }
    })
    close_modal();
  }

  const toggle_selected_wallet = async (chosen_wallet: Wallet) => {
    attempt_connect(chosen_wallet);
    close_modal();
  }

  return (
    <div
      className={`
        fixed inset-0 z-[999] bg-neutral-900 bg-opacity-80 flex justify-center items-center
        transition-opacity duration-300 ease-out
        ${is_modal_open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}
    >
      <div className="bg-neutral-900 border border-neutral-800 shadow-md shadow-neutral-950/40 rounded-lg w-9/12 sm:w-7/12 md:w-5/12 lg:w-3/12 scale-95 transition-transform duration-300 ease-out">
        {/* Modal Header */}
        <div className="border-b border-neutral-800 p-4 flex justify-between items-center items-start">
          <div className="flex flex-col">
            <div className='inline-flex items-center gap-2'>
              <PlugZap size={18} className='text-amber-400'/>
              <h1 className="text-lg text-neutral-300 font-semibold">Connect Wallet</h1>
            </div>
            <p className="text-sm text-neutral-500">Choose a wallet to connect.</p>
          </div>

          <button onClick={close_modal} title='Close Modal' className='p-2 hover:bg-neutral-800 rounded-lg'>
            <X size={18} className='text-rose-400'/>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 text-neutral-300 w-full max-w-content text-left text-base flex flex-col justify-start gap-1 h-40 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:bg-neutral-500">
          {installed_wallets ?
            <div className='flex flex-col gap-2 w-full p-2'>
              <p className="font-semibold text-sm">Installed Wallets</p>

              <div className='flex flex-wrap gap-1'>
                {installed_wallets.map((wallet, index) => wallet.name !== "MetaMask" && (
                  <button key={index} onClick={() => toggle_selected_wallet(wallet)} className='hover:bg-neutral-800 duration-300 inline-flex items-center gap-2 p-2 px-4 rounded-lg font-semibold'>
                    <img src={wallet.icon} className='size-6'/>
                    {wallet.name}
                  </button>
                ))}
              </div>
            </div>
            :
            <span className='text-center text-sm my-auto'>
              We cannot find any installed wallets.<br />
              <span onClick={handle_learn_more}>
                Click here to discover Cardano wallets.
              </span>
            </span>
          }
        </div>
      </div>
    </div>
  );
};

export default ConnectWalletModal;