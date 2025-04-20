import ComboBox from "@/components/combobox";
import { create_account_data } from "@/utils/api/interfaces";
import { ADAHANDLE_POLICY } from "@/utils/consts";
import { AssetExtended } from "@meshsdk/core";
import { useWallet } from "@meshsdk/react";
import { UserPlus } from "lucide-react";
import { FC, useEffect, useState } from "react";

interface custom_props {
  connected_address: string;
  create_finbyte_account: (details: create_account_data) => void;
}

const WalletModalCreateAccount: FC <custom_props> = ({
  connected_address, create_finbyte_account
}) => {
  const [found_handles, set_found_handles] = useState<AssetExtended[] | null>(null);
  const [chosen_handle, set_chosen_handle] = useState<string | null>(null);
  const chosen_handle_state = { state: chosen_handle, set_state: set_chosen_handle }

  const use_wallet = useWallet();
  const wallet = use_wallet.wallet;

  const decodeHex = (hex: string) => Buffer.from(hex, "hex").toString("utf-8");

  const attempt_creation = () => {
    const timestamp = Math.floor(Date.now() / 1000);
    const details: create_account_data = {
      timestamp:  timestamp,
      address:    connected_address,
      ada_handle: chosen_handle !== null ? chosen_handle : undefined
    };
    create_finbyte_account(details);
  }

  const find_users_adahandles = async () => {
    const adahandles = await wallet.getPolicyIdAssets(ADAHANDLE_POLICY);
    set_found_handles(adahandles);
  }

  useEffect(() => {
    find_users_adahandles();
  }, []);

  return (
    <div className='flex flex-col text-center'>
      <div>
        <p className='text-sm text-neutral-400'>
          Kudos for being interested in registering for Finbyte at our early stage.
          <br/>
        </p>

        <hr className='my-2 border-neutral-800'/>

        <div className='flex flex-col mt-4'>
          <div className="grid">
            <div>
              <label className="block text-left font-medium mb-0.5 text-neutral-300 text-xs">Linked Address</label>

              <input
                type="text"
                disabled
                className="py-2 px-4 block w-full rounded-lg text-sm border border-solid border-neutral-800 focus:border-blue-400 focus:ring-blue-400 bg-neutral-900 text-neutral-400 placeholder-neutral-500 focus:outline-none"
                placeholder={connected_address}
              />
            </div>
          </div>

          {found_handles && found_handles.length > 0 ?
            <div className="my-2">
              <h1 className="text-sm text-neutral-400">
                We found AdaHandles within your wallet.<br/>
                Would you like to set one as your Finbyte Username?
              </h1>

              <div className="flex justify-center mt-2">
                <ComboBox items={found_handles.map(a => decodeHex(a.assetName))} placeholder="Select a AdaHandle..." selected={chosen_handle_state}/> 
              </div>
            </div>
            :
            <></>
          }
        </div>

        <div className="flex flex-col w-full gap-1 text-sm">
          <div className="mt-2">
            <button onClick={attempt_creation} className="p-2 hover:bg-neutral-800 rounded-lg inline-flex items-center gap-2">
              Create Account
              <UserPlus size={16}/>
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default WalletModalCreateAccount;