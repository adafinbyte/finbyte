import { FC, ReactNode, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/router";
import { Home, MessageCircle, PlugZap, Search, Settings, Stars } from "lucide-react";
import { BrowserWallet, Wallet } from "@meshsdk/core";
import { useWallet } from "@meshsdk/react";

import ConnectWalletModal from "./modals/connect-wallet";

import UserAvatar from "@/components/user-avatar";

import { format_long_string } from "@/utils/string-tools";
import { platform_interaction } from "@/utils/api/interfaces";
import { fetch_platform_interactions } from "@/utils/api/fetch";
import { format_interactions } from "@/utils/format-interactions";
import FormatAddress from "@/components/format-address";
import { supabase } from "@/utils/secrets";
import WalletModal from "./modals/wallet";

const DefaultLayoutSidebar: FC = () => {
  interface menu_item {title: string; icon: ReactNode; link?: string; on_click?: () => void;}

  const use_wallet = useWallet();
  const router = useRouter();

  const [connect_wallet_modal_open, set_connect_wallet_modal_open] = useState(false);
  const [wallet_modal_open, set_wallet_modal_open] = useState(false);
  const [connected_address, set_connected_address] = useState<string>();

  const navigation_items: menu_item[] = [
    {
      title: 'Home',
      icon: <Home className="size-6 lg:size-5"/>,
      link: '/'
    },
    {
      title: 'Forums',
      icon: <MessageCircle className="size-6 lg:size-5"/>,
      link: '/forums'
    },
    {
      title: 'Explore',
      icon: <Search className="size-6 lg:size-5"/>,
      link: '/explore'
    },
//    {
//      title: 'Documents',
//      icon: <Book className="size-6 lg:size-5"/>,
//      link: '/documents'
//    },
  ];

  const extra_items: menu_item[] = [
//    {
//      title: 'Settings',
//      icon: <Settings className="size-6 lg:size-5"/>,
//      on_click: () => {}
//    },
    {
      title: (use_wallet.connected && connected_address) ? format_long_string(use_wallet.address) : 'Connect',
      icon: (use_wallet.connected && connected_address) ? <UserAvatar address={use_wallet.address} className="size-6 lg:size-5"/> : <PlugZap className="size-6 lg:size-5"/>,
      on_click: (use_wallet.connected && connected_address) ? () => set_wallet_modal_open(true) : () => set_connect_wallet_modal_open(true)
    }
  ];

  const attempt_wallet_connect = async (chosen_wallet: Wallet) => {
    try {
      await use_wallet.connect(chosen_wallet.name);
      const i = await BrowserWallet.enable(chosen_wallet.name);
      const get_addr = (await (i).getChangeAddress()).toString();
      set_connected_address(get_addr);
      toast.success('Successfully Connected.');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        throw error;
      }
    }
  }

  const is_url_active = (link: string): boolean => {
    return link === '/' ? router.asPath === '/' : router.asPath.startsWith(link);
  }

  return (
    <>
      <div className="max-h-screen flex flex-col gap-2 bg-neutral-950 text-neutral-400">
        {/** @mobile */}
        <div className="lg:hidden p-2 flex flex-col items-center h-full border-r-2 border-neutral-700">
          <img src='/finbyte.png' className="size-8 mt-4"/>

          <div className="p-2 mt-4 flex flex-col gap-2">
            {navigation_items.map((item, index) => (
              <Link key={index} title={item.title} href={item.link?.toString() ?? ''} className="p-2 hover:bg-neutral-800 hover:text-blue-400 duration-300 rounded-lg">
                {item.icon}
              </Link>
            ))}
          </div>

          <div className="mt-auto p-2 flex flex-col gap-2">
            {extra_items.map((item, index) => (
              <div key={index} title={item.title} onClick={item.on_click} className="p-2 hover:bg-neutral-800 duration-300 rounded-lg">
                {item.icon}
              </div>
            ))}
          </div>
        </div>

        {/** @desktop */}
        <div className="w-52 hidden lg:flex flex-col p-2 items-center h-screen border-r-2 border-neutral-700">
          <div className="inline-flex gap-2 items-center justify-center w-full mt-4">
            <img src='/finbyte.png' className="size-8"/>
            <h1 className="font-semibold text-2xl text-neutral-200">
              Finbyte
            </h1>
          </div>

          <div className="p-2 mt-4 flex flex-col gap-1 w-full">
            {navigation_items.map((item, index) => (
              <Link key={index} title={item.title} href={item.link?.toString() ?? ''} className={`${is_url_active(item.link as string) ? 'bg-neutral-800/80' : ''} p-2 hover:bg-neutral-800 hover:text-neutral-200 rounded-lg inline-flex items-center gap-2`}>
                {item.icon}
                <h1 className="font-semibold">
                  {item.title}
                </h1>
              </Link>
            ))}
          </div>

          <div className="mt-auto p-2 flex flex-col gap-1 w-full">
            <span className="text-xs text-neutral-300">This platform is currently in development. Feel free to use the forums to express anything you need.</span>
            {extra_items.map((item, index) => (
              <div key={index} title={item.title} onClick={item.on_click} className="cursor-pointer p-2 hover:bg-neutral-800 rounded-lg inline-flex gap-2 items-center">
                {item.icon}
                <h1 className="font-semibold">
                  {item.title}
                </h1>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ConnectWalletModal is_modal_open={connect_wallet_modal_open} close_modal={() => set_connect_wallet_modal_open(false)} attempt_connect={attempt_wallet_connect}/>
      {use_wallet.connected && use_wallet.address && (        
        <WalletModal is_modal_open={wallet_modal_open} close_modal={() => set_wallet_modal_open(false)} />
      )}
    </>
  )
}

export default DefaultLayoutSidebar;
