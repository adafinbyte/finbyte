import Link from "next/link"
import { Bell, Bookmark, Home, MessageSquare, PlugZap, Search, Settings, Unplug, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useWallet } from "@meshsdk/react"
import WalletLoginModal from "./modals/wallet-login";
import { useState } from "react";

export default function Sidebar() {
  const { connected, disconnect } = useWallet();
  const [wallet_login_open, set_wallet_login_open] = useState(false);

  return (
    <div className="sticky top-20 space-y-4">
      <nav className="flex flex-col gap-1">
        <Link href="/">
          <Button variant="ghost" className="w-full justify-start gap-2 rounded-full">
            <Home className="h-5 w-5" />
            <span>Home</span>
          </Button>
        </Link>

        <Link href="/explore">
          <Button variant="ghost" className="w-full justify-start gap-2 rounded-full">
            <Search className="h-5 w-5" />
            <span>Explore</span>
          </Button>
        </Link>

        {connected ?
          <>
          {
            /**
            <Link href="#">
              <Button variant="ghost" className="w-full justify-start gap-2 rounded-full">
                <Bookmark className="h-5 w-5" />
                <span>Bookmarks</span>
              </Button>
            </Link>
            <Link href="#">
              <Button variant="ghost" className="w-full justify-start gap-2 rounded-full">
                <User className="h-5 w-5" />
                <span>Profile</span>
              </Button>
            </Link>
             * 
             */
          }
            <Button onClick={disconnect} variant="ghost" className="w-full justify-start gap-2 rounded-full">
              <Unplug className="h-5 w-5" />
              <span>Disconnect</span>
            </Button>
          </>
          :
          <Button variant="ghost" className="w-full justify-start gap-2 rounded-full" onClick={() => set_wallet_login_open(true)}>
            <PlugZap className="h-5 w-5" />
            Connect
          </Button>
        }

        <Button disabled variant="ghost" className="w-full justify-start gap-2 rounded-full">
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Button>
      </nav>

      <WalletLoginModal onOpenChange={set_wallet_login_open} open={wallet_login_open}/>
    </div>
  )
}