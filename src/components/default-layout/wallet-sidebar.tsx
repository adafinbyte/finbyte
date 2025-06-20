import { useWallet } from "@meshsdk/react";
import { FC, useEffect, useState } from "react";
import { Card } from "../ui/card";
import { Copy } from "lucide-react";
import { format_atomic } from "@/utils/format";
import FormatAddress from "../format-address";
import { Button } from "../ui/button";
import { copy_to_clipboard } from "@/utils/common";


const WalletSidebar: FC = () => {
  const { address, connected, wallet } = useWallet();

  interface connected_wallet {
    network_id: number;
    lovelace: number;
    preprod_balance: {
      tfin: number;
    }
  }

  const [wallet_details, set_wallet_details] = useState<connected_wallet | null>(null);

  const get_connected_wallet_details = async () => {
    if (!address) { return; }

    const network_id = await wallet.getNetworkId();
    const lovelaces = await wallet.getLovelace();
    const format_lovelace = format_atomic(6, Number(lovelaces));
    const balance = await wallet.getBalance();
    const owned_tfin = balance.find(a => a.unit.includes('37524129746446a5a55da896fe5379508244ea85e4c140156badbdc6'));
    const format_tfin = format_atomic(4, Number(owned_tfin?.quantity));

    const data: connected_wallet = {
      network_id,
      lovelace: Number(format_lovelace),
      preprod_balance: {
        tfin: Number(format_tfin),
      },
    }
    set_wallet_details(data);
  }

  const preprod_wallet_balances = [
    {
      title: '$tFIN: tƒ',
      data: wallet_details?.preprod_balance.tfin ? (() => {
        const supply = wallet_details.preprod_balance.tfin;
        const [intPart, decPart] = supply.toLocaleString(undefined, { minimumFractionDigits: 4 }).split('.');
        return (
          <span>
            {intPart}.
            <span className="text-muted-foreground text-sm">{decPart}</span>
          </span>
        );
      })() : 0
    },
    {
      title: '$tADA: t₳',
      data: wallet_details?.lovelace ? (() => {
        const supply = wallet_details.lovelace;
        const [intPart, decPart] = supply.toLocaleString(undefined, { minimumFractionDigits: 6 }).split('.');
        return (
          <span>
            {intPart}.
            <span className="text-muted-foreground text-sm">{decPart}</span>
          </span>
        );
      })() : 0,
    },
  ];
  const mainnet_wallet_balances = [
    {
      title: '$ADA: ₳',
      data: wallet_details?.lovelace ? (() => {
        const supply = wallet_details.lovelace;
        const [intPart, decPart] = supply.toLocaleString(undefined, { minimumFractionDigits: 6 }).split('.');
        return (
          <span>
            {intPart}.
            <span className="text-muted-foreground text-sm">{decPart}</span>
          </span>
        );
      })() : 0,
    },
  ];

  useEffect(() => {
    if (connected) {
      get_connected_wallet_details();
    } else {
      set_wallet_details(null);
    }
  }, [connected, address]);

  return (address && connected) ? (
    <div className="pt-6">
      <Card className="p-2 text-xs text-center">
        <h1>
          Wallet Status: <span className="text-green-500 dark:text-green-400">Connected</span>
        </h1>

        <div className="flex flex-col items-start my-2 text-sm">
          <div className="flex justify-between w-full gap-2 items-center overflow-x-hidden">
            <FormatAddress address={address} large_size/>
            <Button size='icon' className="scale-[75%]" variant='ghost' onClick={() => copy_to_clipboard(address)}>
              <Copy/>
            </Button>
          </div>

          <h1 className="text-xs mt-2 text-muted-foreground font-semibold">
            Network ID
          </h1>

          <h1 className="text-base">
            {wallet_details?.network_id === 0 ? 'Preprod' : wallet_details?.network_id === 1 ? 'Mainnet' : 'Testnet'}
          </h1>

          <h1 className="text-xs mt-2 text-muted-foreground font-semibold">
            Wallet Balances
          </h1>

          {wallet_details?.network_id === 0 && (
            preprod_wallet_balances.map((item, index) => (
              <h1 key={index} className="text-base text-left">
                {item.title}{item.data}
              </h1>
            ))
          )}

          {wallet_details?.network_id === 1 && (
            mainnet_wallet_balances.map((item, index) => (
              <h1 key={index}>
                {item.title}{item.data}
              </h1>
            ))
          )}
        </div>
      </Card>
    </div>
  ) : (
    <div className="pt-6">
      <Card className="p-2 text-xs text-center">
        <h1>
          Wallet Status: <span className="text-red-500 dark:text-red-400">Not connected</span>
        </h1>
      </Card>
    </div>
  )
}

export default WalletSidebar;