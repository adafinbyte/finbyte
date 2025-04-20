import ComboBox from "@/components/combobox";
import { update_username } from "@/utils/api/account/push";
import { ADAHANDLE_POLICY } from "@/utils/consts";
import { AssetExtended, checkSignature, generateNonce } from "@meshsdk/core";
import { useWallet } from "@meshsdk/react";
import { Save } from "lucide-react";
import { Dispatch, FC, SetStateAction, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface custom_props {
  connected_address: string;
  refresh_data: () => Promise<void>;
}

const WalletModalAccountSettings: FC <custom_props> = ({
  connected_address, refresh_data
}) => {
  const [found_handles, set_found_handles] = useState<AssetExtended[] | null>(null);
  const [chosen_handle, set_chosen_handle] = useState<string | null>(null);

  const chosen_handle_state = { state: chosen_handle, set_state: set_chosen_handle }

  const use_wallet = useWallet();
  const wallet = use_wallet.wallet;

  const decodeHex = (hex: string) => Buffer.from(hex, "hex").toString("utf-8");

  const find_users_adahandles = async () => {
    const adahandles = await wallet.getPolicyIdAssets(ADAHANDLE_POLICY);
    set_found_handles(adahandles);
  }

  useEffect(() => {
    find_users_adahandles();
  }, []);

  const save_username = async () => {
    if (!chosen_handle) {
      toast.error('Please select an AdaHandle.')
      return;
    } else {
      try {
        const timestamp = Math.floor(Date.now() / 1000);
        const signing_data = `${use_wallet.address} is changing their username at ${timestamp}.`;
        const nonce = generateNonce(signing_data);
        const signature = await wallet.signData(nonce, use_wallet.address);
        if (signature) {
          const is_valid_sig = await checkSignature(nonce, signature, use_wallet.address);
          if (is_valid_sig) {
            await update_username(use_wallet.address, timestamp, chosen_handle);
            refresh_data();
          } else {
            toast.error('Signature verification failed! Whoops.');
            return;
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          throw error;
        }
      }
    }
  }

  /** @todo - delete account */

  return (
    <div className='flex flex-col text-center gap-2'>
      <div className="flex flex-col gap-1 w-full text-left mt-2">
        {found_handles && found_handles.length > 0 ?
          <div className="mb-2 flex flex-col w-full gap-1">
            <h1 className="text-sm text-neutral-400 font-semibold">
              Would you like to change your username to a different AdaHandle?
            </h1>

            <div className="flex justify-between mt-2">
              <ComboBox items={found_handles.map(a => decodeHex(a.assetName))} placeholder="Select a AdaHandle..." selected={chosen_handle_state}/> 

              <div className="text-xs mx-auto">
                <button className="p-2 hover:bg-neutral-800 rounded-lg inline-flex items-center gap-2" onClick={save_username}>
                  Save Username
                  <Save size={16}/>
                </button>
              </div>
            </div>

            
          </div>
          :
          <></>
        }

      </div>
    </div>
  )
}

export default WalletModalAccountSettings;