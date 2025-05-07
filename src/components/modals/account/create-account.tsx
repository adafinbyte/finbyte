import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FC, useState } from "react";
import AdaHandlesComboBox from "./adahandles-combobox";
import { create_account_data } from "@/utils/api/interfaces";
import { useWallet } from "@meshsdk/react";

interface custom_props {
  toggle_cancel: () => void;
  found_handles: string[] | null;
  on_create: (details: create_account_data) => Promise<void>;
}

const AccountCreateView: FC <custom_props> = ({
  toggle_cancel, found_handles, on_create
}) => {
  const { address } = useWallet();
  const [chosen_handle, set_chosen_handle] = useState<string | null>(null);

  const attempt_create = async () => {
    const timestamp = Math.floor(Date.now() / 1000);
    const details: create_account_data = {
      f_timestamp: timestamp,
      address: address,
      ada_handle: chosen_handle
    }

    await on_create(details);
  }

  return (
    <div>
      <Label>
        Create a Finbyte Account
      </Label>

      <p className="opacity-60 text-xs">
        Creating a Finbyte Account is easy.
        Below, we should have already detected an Ada Handle, if you own any, so you can use it as your username!
      </p>

      <div className="flex justify-center mt-4">
        {found_handles && found_handles.length > 0 ?
          <AdaHandlesComboBox adahandles={found_handles} on_selected={set_chosen_handle}/>
          :
          <Label className="opacity-80">No Handles Found, don't worry you can still change this later!</Label>
        }
      </div>

      <div className="flex justify-end mt-4 gap-2 items-center">
        <Button variant='ghost' size='sm' onClick={toggle_cancel}>
          Cancel
        </Button>

        <Button size='sm' onClick={() => attempt_create()}>
          Create
        </Button>
      </div>
    </div>
  )
}

export default AccountCreateView;