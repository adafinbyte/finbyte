import { FC, ReactNode, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/router";
import { Home, MessageCircle, MessagesSquare, PlugZap, Search, Settings } from "lucide-react";
import { BrowserWallet, Wallet } from "@meshsdk/core";
import { useWallet } from "@meshsdk/react";

import ConnectWalletModal from "./modals/connect-wallet";
import WalletModal from "./modals/wallet";

import UserAvatar from "@/components/user-avatar";
import PlatformSettingsModal from "@/components/modals/platform-settings";
import useThemedProps from "@/contexts/themed-props";

import { format_long_string } from "@/utils/string-tools";

const DefaultLayoutNavbar: FC = () => {
  interface menu_item {title: string | undefined; icon: ReactNode; link?: string; on_click?: () => void;}

  const themed = useThemedProps();
  const use_wallet = useWallet();
  const router = useRouter();

  const [platform_settings_modal_open, set_platform_settings_modal_open] = useState(false);
  const [connect_wallet_modal_open, set_connect_wallet_modal_open] = useState(false);
  const [wallet_modal_open, set_wallet_modal_open] = useState(false);
  const [connected_address, set_connected_address] = useState<string>();

  const navigation_items: menu_item[] = [
    {
      title: 'Home',
      icon: <Home className="size-5"/>,
      link: '/'
    },
    {
      title: 'Forums',
      icon: <MessagesSquare className="size-5"/>,
      link: '/forums'
    },
//    {
//      title: 'Chat',
//      icon: <MessageCircle className="size-5"/>,
//      link: '/chat'
//    },
    {
      title: 'Explore',
      icon: <Search className="size-5"/>,
      link: '/explore'
    },
    {
      title: undefined,
      icon: <img src='/finbyte.png' className="size-6 lg:size-5"/>,
      link: '/finbyte'
    },
  ];

  const extra_items: menu_item[] = [
    {
      title: '',
      icon: <Settings className="size-5"/>,
      on_click: () => set_platform_settings_modal_open(true)
    },
    {
      title: (use_wallet.connected && connected_address) ? format_long_string(use_wallet.address) : 'Connect',
      icon: (use_wallet.connected && connected_address) ? <UserAvatar address={use_wallet.address} className="size-5"/> : <PlugZap className="size-5"/>,
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
      <nav className={`max-w-screen flex gap-2 ${themed['950'].bg} ${themed['400'].text}`}>
        {/** @mobile_tablet */}
        <div className={`lg:hidden px-2 flex w-full`}>
          <span className={`${themed['900'].bg} rounded-b-xl flex items-center justify-between w-full px-2`}>
            <button onClick={() => router.push('/')} className={`${themed.effects.transparent_button.hover} p-1 rounded-lg`}>
              <img src='/finbyte.png' className="size-8"/>
            </button>

            <div className="p-2 flex gap-2">
              {navigation_items.map((item, index) => (
                <Link key={index} title={item.title} href={item.link?.toString() ?? ''} className={`${is_url_active(item.link as string) ? themed['800'].bg : ''} p-2 ${themed.effects.transparent_button.hover} rounded-lg inline-flex items-center gap-2`}>
                  {item.icon}
                </Link>
              ))}
            </div>

            <div className="p-2 flex gap-2">
              {extra_items.map((item, index) => (
                <button key={index} title={item.title} onClick={item.on_click} className={`p-2 ${themed.effects.transparent_button.hover} rounded-lg inline-flex items-center gap-2`}>
                  {item.icon}
                </button>
              ))}
            </div>
          </span>
        </div>

        {/** @desktop */}
        <div className={`lg:w-[80%] ${themed['900'].bg} lg:mx-auto hidden lg:flex lg:justify-between lg:p-2 lg:items-center lg:h-16 lg:rounded-b-xl`}>
          <button onClick={() => router.push('/')} className="p-2 flex gap-2 items-center justify-center">
            <img src='/finbyte.png' className="size-8"/>

            <h1 className={`font-semibold text-2xl ${themed['200'].text}`}>
              Finbyte
            </h1>
          </button>

          <div className="p-2 gap-1 flex text-sm">
            {navigation_items.map((item, index) => (
              <Link key={index} title={item.title} href={item.link?.toString() ?? ''} className={`${is_url_active(item.link as string) ? themed['800'].bg + ' ' + themed['300'].text : ''} p-2 ${themed.effects.transparent_button.hover} rounded-lg inline-flex items-center gap-2`}>
                {item.icon}

                {item.title && (
                  <h1 className="font-semibold">
                    {item.title}
                  </h1>
                )}
              </Link>
            ))}
          </div>

          <div className="p-2 flex gap-1 text-sm">
            {extra_items.map((item, index) => (
              <button key={index} title={item.title} onClick={item.on_click} className={`p-2 ${themed.effects.transparent_button.hover} rounded-lg inline-flex items-center gap-2`}>
                {item.icon}
                {item.title && (
                  <h1 className="font-semibold">
                    {item.title}
                  </h1>
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <ConnectWalletModal is_modal_open={connect_wallet_modal_open} close_modal={() => set_connect_wallet_modal_open(false)} attempt_connect={attempt_wallet_connect}/>
      {use_wallet.connected && use_wallet.address && (        
        <WalletModal is_modal_open={wallet_modal_open} close_modal={() => set_wallet_modal_open(false)} />
      )}
      <PlatformSettingsModal is_modal_open={platform_settings_modal_open} close_modal={() => set_platform_settings_modal_open(false)}/>
    </>
  )
}

export default DefaultLayoutNavbar;