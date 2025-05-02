import useThemedProps from "@/contexts/themed-props";
import { capitalize_first_letter } from "@/utils/string-tools";
import { Wallet } from "@meshsdk/core";
import { useRouter } from "next/router";
import { FC } from "react";

interface custom_props {
  installed_wallets: Wallet[] | undefined;
  toggle_selected_wallet: (wallet: Wallet) => Promise<void>;
  close_modal: () => void;
}

const ConnectWalletDetect: FC <custom_props> = ({
  installed_wallets, toggle_selected_wallet, close_modal
}) => {
  const router = useRouter();
  const themed = useThemedProps();

  const handle_learn_more = () => {
    router.push({
      pathname: '/finbyte',
      /** @note this is the tab id for "Get a Wallet" */
      //query: { tab_id: 2.2 }
    })
    close_modal();
  }

  return (
    <div>
      {installed_wallets && installed_wallets.length > 0 ?
        <div className='flex flex-col gap-2 w-full'>
          <span className="inline-flex">
            <h1 className={`text-left text-xs font-semibold ${themed['500'].text} border-b ${themed['500'].border}`}>
              Installed Wallets
            </h1>
          </span>

          <div className='flex flex-wrap gap-1'>
            {installed_wallets.map((wallet, index) => wallet.name !== "MetaMask" && (
              <button title={`${wallet.name}`} key={index} onClick={() => toggle_selected_wallet(wallet)} className={`${themed.effects.transparent_button.hover} duration-300 inline-flex items-center gap-2 p-2 px-4 rounded-lg font-semibold`}>
                <img src={wallet.icon} className='size-6'/>
                {capitalize_first_letter(wallet.name)}
              </button>
            ))}
          </div>
        </div>
        :
        <span className='text-center text-sm my-auto'>
          We cannot find any installed wallets.<br />
          <span onClick={handle_learn_more} className="text-blue-400">
            Click here to discover Cardano wallets.
          </span>
        </span>
      }
    </div>
  )
}

export default ConnectWalletDetect;