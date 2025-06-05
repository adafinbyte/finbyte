import { FC, useEffect, useState } from "react";
import { Card } from "../ui/card";
import { useWallet } from "@meshsdk/react";
import { ADA_UNIT, ADAHANDLE_POLICY } from "@/utils/consts";


const ProfileWalletInfo: FC = ({

}) => {
  const { address, wallet } = useWallet();

  useEffect(() => {
    get_wallet_info();
  }, [address]);

  interface wallet_info {
    lovelace: number;
    owned_adahandles: number;
    network_id: number;
  }
  const [wallet_info, set_wallet_info] = useState<wallet_info | null>(null);

  const get_wallet_info = async () => {
    const balance = await wallet.getLovelace();
    const owned_aseets = await wallet.getPolicyIds();
    const owned_adahandles = owned_aseets.filter(a => a.includes(ADAHANDLE_POLICY));
    const network_id = await wallet.getNetworkId();

    const info: wallet_info = {
      lovelace: Number(balance) / ADA_UNIT,
      owned_adahandles: owned_adahandles.length,
      network_id,
    }
    set_wallet_info(info);
  }

  const wallet_info_render = [
    { title: 'Balance: ', data: wallet_info?.lovelace ?? 0 },
    { title: 'Adahandles: ', data: wallet_info?.owned_adahandles ?? 0 },
    { title: 'Network ID: ', data: wallet_info?.network_id ?? 0 },
  ];

  return (
    <Card className="p-4">
      <h1 className="text-sm font-semibold opacity-80">
        Wallet Information
      </h1>

      <div className="flex flex-col gap-1 pt-2">
        {wallet_info_render.map((item, index) => (
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