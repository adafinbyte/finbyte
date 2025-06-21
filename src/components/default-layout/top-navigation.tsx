"use client"

import { useState } from "react"
import Link from "next/link"
import { Home, Menu, Moon, PlugZap, Search, Settings, Sun, Trophy, Unplug, User, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useDarkMode } from "@/hooks/use-dark-mode"
import { useWallet } from "@meshsdk/react"
import WalletLoginModal from "../modals/wallet-login"
import { FINBYTE_WALLET_NAME } from "@/utils/consts"
import { useRouter } from "next/router"
import WalletSidebar from "./wallet-sidebar"

export default function TopNavigation() {
  const router = useRouter();
  const { isDark, toggleTheme } = useDarkMode();
  const { address, connected, disconnect } = useWallet();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [wallet_login_open, set_wallet_login_open] = useState(false);

  const handle_disconnect_wallet = async () => {
    router.push('/');
    disconnect();
    localStorage.removeItem(FINBYTE_WALLET_NAME);
  }

  return (
    <header className="fixed top-0 z-50 w-full border-b dark:border-slate-800 bg-background/80 backdrop-blur-sm">
      <div className="container flex h-14 items-center px-4">
        <div className="flex w-full items-center justify-between md:w-auto">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="h-7 w-7 rounded-full bg-transparent text-center text-lg font-bold leading-8 text-primary-foreground">
              <img src='/finbyte.png'/>
            </div>
            <span className="hidden md:inline-block text-lg">Finbyte</span>
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button onClick={toggleTheme} variant="ghost" size="icon">
            {isDark ? <Sun/> : <Moon/>}
          </Button>

          {connected ?
            <Button onClick={handle_disconnect_wallet} variant="ghost" size="icon">
              <Unplug className="h-5 w-5" />
              <span className="sr-only">Disconnect</span>
            </Button>
            :
            <Button onClick={() => set_wallet_login_open(true)} variant="ghost" size="icon">
              <PlugZap className="h-5 w-5" />
              <span className="sr-only">Connect</span>
            </Button>
          }

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px] dark:border-slate-800">
              <div className="flex flex-col gap-4 py-6">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                  <div className="h-8 w-8 rounded-full text-center text-lg font-bold leading-8 text-primary-foreground">
                    <img src='/finbyte.png' />
                  </div>
                  <span>Finbyte</span>
                </Link>
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

                <WalletSidebar />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <WalletLoginModal onOpenChange={set_wallet_login_open} open={wallet_login_open} />
    </header>
  )
}
