import { FC, useEffect, useState } from "react";
import { Card } from "../ui/card";
import { useWallet } from "@meshsdk/react";
import { ADA_UNIT, ADAHANDLE_POLICY } from "@/utils/consts";
import { format_atomic } from "@/utils/format";


const ProfileWalletInfo: FC = ({

}) => {
  const { address, connected, wallet } = useWallet();

  useEffect(() => {
    if (address && connected) {
      get_wallet_info();
    }
  }, [connected]);

  interface wallet_info {
    ada_balance: number;
    tfin_balance: string | number;
    network_id: number;
  }
  const [wallet_info, set_wallet_info] = useState<wallet_info | null>(null);

  const get_wallet_info = async () => {
    const lovelaces = await wallet.getLovelace();
    const balance = await wallet.getBalance();
    const owned_tfin = balance.find(a => a.unit.includes('37524129746446a5a55da896fe5379508244ea85e4c140156badbdc6'));
    const network_id = await wallet.getNetworkId();

    const info: wallet_info = {
      ada_balance: Number(lovelaces) / ADA_UNIT,
      tfin_balance: format_atomic(4, Number(owned_tfin?.quantity ?? 0)),
      network_id,
    }
    set_wallet_info(info);
  }

  const main_wallet_balances = [
    {
      title: '$tADA Balance',
      data: wallet_info?.ada_balance ? (() => {
        const supply = wallet_info.ada_balance;
        const [intPart, decPart] = supply.toLocaleString(undefined, { minimumFractionDigits: 6 }).split('.');
        return (
          <span>
            {intPart}.
            <span className="text-muted-foreground text-sm">{decPart}</span>
          </span>
        );
      })() : 0
    },
    {
      title: '$tFIN Balance',
      data: wallet_info?.tfin_balance ? (() => {
        const supply = wallet_info.tfin_balance;
        const [intPart, decPart] = supply.toLocaleString(undefined, { minimumFractionDigits: 4 }).split('.');
        return (
          <span>
            {intPart}.
            <span className="text-muted-foreground text-sm">{decPart}</span>
          </span>
        );
      })() : 0
    },
  ];

  return (
    <Card className="p-4">
      <h1 className="text-sm font-semibold opacity-80">
        Wallet Information
      </h1>

      <div className="flex flex-col gap-1 pt-2">
        {main_wallet_balances.map((item, index) => (
          <div key={index}>
            {item.title}
            {item.data}
          </div>
        ))}
      </div>
    </Card>
  )
}

export default ProfileWalletInfo;