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

        <div className="ml-auto flex items-center gap-1">
          <Button onClick={toggleTheme} variant="ghost" size="icon">
            {isDark ? <Sun/> : <Moon/>}
          </Button>

          <Link href={'https://x.com/adaFinbyte'} target="_blank">
            <Button variant='ghost' size='icon'>
              <svg className={'size-4 fill-primary'} role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>X</title><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" /></svg>
            </Button>
          </Link>

          <Link href={'https://github.com/adafinbyte/finbyte/'} target="_blank">
            <Button variant='ghost' size='icon'>
              <svg className={'size-4 fill-primary'} role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
            </Button>
          </Link>

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
