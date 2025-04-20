import { FC } from "react";

import FormatAddress from "@/components/format-address";
import UserAvatar from "@/components/user-avatar";
import { author_data } from "@/utils/api/account/fetch";

interface stat { title: string; data: string | number; }
interface custom_props {
  connected_address: string;
  finbyte_user: boolean;

  stats: stat[] | undefined;
  account_data: author_data | null;
}

const WalletModalOverview: FC <custom_props> = ({
  connected_address, finbyte_user, stats, account_data
}) => {

  return (
    <div className='flex flex-col gap-2'>
      <div className='inline-flex justify-between items-center gap-4'>
        <div className='inline-flex items-center gap-2'>
          <UserAvatar address={connected_address} className="size-6"/>
          <div className='flex flex-col'>
            <FormatAddress address={connected_address}/>
            <span className={`${finbyte_user ? "text-green-400" : "text-red-400"} text-[10px]`}>
              {finbyte_user ? "Registered" : "Anon"}
            </span>
          </div>
        </div>
      </div>
  
      <div className='inline-flex items-center justify-between px-2 gap-2 rounded-lg bg-neutral-800'>
        {stats && stats.map((stat, index) => (
          <div key={index} className='p-1 inline-flex flex-col gap-0.5 text-center'>
            <h1 className='text-sm text-blue-400'>
              {stat.title}
            </h1>
            <p className='font-semibold text-lg'>
              {stat.data}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WalletModalOverview;