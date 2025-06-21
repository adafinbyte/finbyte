import Link from "next/link"
import { Home, PlugZap, Settings, Trophy, Unplug, User, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useWallet } from "@meshsdk/react"
import WalletLoginModal from "../modals/wallet-login";
import { useState } from "react";
import WalletSidebar from "./wallet-sidebar";
import { useRouter } from "next/router";
import { FINBYTE_WALLET_NAME } from "@/utils/consts";

export default function Sidebar() {
  const router = useRouter();
  const { address, connected, disconnect } = useWallet();
  const [wallet_login_open, set_wallet_login_open] = useState(false);

  const handle_disconnect_wallet = async () => {
    router.push('/');
    disconnect();
    localStorage.removeItem(FINBYTE_WALLET_NAME);
  }

  return (
    <div className="sticky top-20 space-y-4">
      <nav className="flex flex-col gap-1">
        <h1 className="font-bold uppercase text-[10px] tracking-wide text-muted-foreground mb-2">
          Platform
        </h1>

        <Link href="/">
          <Button variant={router.pathname === '/' ? 'secondary' : "ghost"} className="w-full justify-start gap-2 rounded-full">
            <Home className="h-5 w-5" />
            <span>Home</span>
          </Button>
        </Link>

        <Link href="/communities">
          <Button variant={router.pathname === '/communities' ? 'secondary' : "ghost"} className="w-full justify-start gap-2 rounded-full">
            <Users className="h-5 w-5" />
            <span>Communities</span>
          </Button>
        </Link>

        <Link href="/kudos">
          <Button variant={router.pathname === '/kudos' ? 'secondary' : "ghost"} className="w-full justify-start gap-2 rounded-full">
            <Trophy className="h-5 w-5" />
            <span>Kudos</span>
          </Button>
        </Link>

        <Link href="/dashboard">
          <Button variant={router.pathname === '/dashboard' ? 'secondary' : "ghost"} className="w-full justify-start gap-2 rounded-full">
            <img src='/finbyte.png' className="h-5 w-5" />
            <span>Dashboard</span>
          </Button>
        </Link>

        <Link href="/tFIN">
          <Button variant={router.pathname === '/tFIN' ? 'secondary' : "ghost"} className="w-full justify-start gap-2 rounded-full">
            <img src='/finbyte.png' className="h-5 w-5" />
            <span>$tFIN</span>
          </Button>
        </Link>

        <hr className="w-4/5 mx-auto dark:border-slate-800 my-4" />

        <h1 className="font-bold uppercase text-[10px] tracking-wide text-muted-foreground my-2">
          Wallet
        </h1>

        {(connected && address) ?
          <>
            <Link href="/profile">
              <Button variant={router.pathname === '/profile' ? 'secondary' : "ghost"} className="w-full justify-start gap-2 rounded-full">
                <User className="h-5 w-5" />
                <span>Profile</span>
              </Button>
            </Link>

            <Button onClick={handle_disconnect_wallet} variant="ghost" className="w-full justify-start gap-2 rounded-full">
              <Unplug className="h-5 w-5" />
              <span>Disconnect</span>
            </Button>

            <Link href="/settings">
              <Button variant={router.pathname === '/settings' ? 'secondary' : "ghost"} className="w-full justify-start gap-2 rounded-full">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Button>
            </Link>
          </>
          :
          <Button variant="ghost" className="w-full justify-start gap-2 rounded-full" onClick={() => set_wallet_login_open(true)}>
            <PlugZap className="h-5 w-5" />
            Connect
          </Button>
        }
      </nav>

      <WalletSidebar/>

      <WalletLoginModal onOpenChange={set_wallet_login_open} open={wallet_login_open}/>
    </div>
  )
}