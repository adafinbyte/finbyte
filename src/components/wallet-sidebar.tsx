import { useWallet } from "@meshsdk/react";
import { FC, useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Check } from "lucide-react";
import { format_atomic } from "@/utils/format";


const WalletSidebar: FC = () => {
  const { address, connected, wallet } = useWallet();

  interface connected_wallet {
    network_id: number;
    balances: number[];
  }

  const [wallet_details, set_wallet_details] = useState<connected_wallet | null>(null);

  const get_connected_wallet_details = async () => {
    if (!address) { return; }

    const network_id = await wallet.getNetworkId();
    const lovelaces = await wallet.getLovelace();
    const format_lovelace = format_atomic(6, Number(lovelaces));
    const balnce = await wallet.getBalance();
    const owned_tfin = balnce.find(a => a.unit.includes('37524129746446a5a55da896fe5379508244ea85e4c140156badbdc6'));
    const format_tfin = format_atomic(4, Number(owned_tfin?.quantity));

    const data: connected_wallet = {
      network_id,
      balances: [Number(format_lovelace), Number(format_tfin) ]
    }
    set_wallet_details(data);
  }

  const wallet_balances = [
    { 
      title: '$tFIN: ƒ',
      data: (() => {
        const supply = wallet_details?.balances[1] ?? 0;
        const [intPart, decPart] = supply.toLocaleString(undefined, { minimumFractionDigits: 4 }).split('.');
        return (
          <span>
            {intPart}.
            <span className="text-muted-foreground text-sm">{decPart}</span>
          </span>
        );
      })()
     },
    {
      title: '$tADA: t₳',
      data: (() => {
        const supply = wallet_details?.balances[0] ?? 0;
        const [intPart, decPart] = supply.toLocaleString(undefined, { minimumFractionDigits: 6 }).split('.');
        return (
          <span>
            {intPart}.
            <span className="text-muted-foreground text-sm">{decPart}</span>
          </span>
        );
      })()
    },
  ];

  useEffect(() => {
    if (connected && address) {
      get_connected_wallet_details();
    }
  }, [connected, address]);

  return (address && connected) ? (
    <div className="pt-6">
      <Card className="p-2 text-xs text-center">
        <h1>
          Wallet Status: <span className="text-green-500 dark:text-green-400">Connected</span>
        </h1>

        <div className="flex flex-col items-start mt-2 text-sm">
          <h1 className="text-xs ">
            Wallet Network ID
          </h1>

          <div className="flex gap-2 items-center w-full p-2">
            <h1 className="w-1/3">
              {wallet_details?.network_id}
            </h1>

            {wallet_details?.network_id === 0 && (
              <div className="flex gap-4 items-center ml-auto border dark:border-green-500 border-primary-400 py-0.5 rounded-lg px-4">
                <h1 className="text-xs">
                  Ready for $tFIN
                </h1>
                <Check className="text-green-500 dark:text-green-400 size-4" />
              </div>
            )}
          </div>
        </div>

        {wallet_details?.network_id === 0 && (
          <div className="flex flex-col items-start mt-2 text-sm">
            <h1 className="text-xs ">
              Wallet Balances
            </h1>

            {wallet_balances.map((item, index) => (
              <h1 key={index}>
                {item.title}{item.data}
              </h1>
            ))}
          </div>
        )}
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