// components/SettingsModal.tsx
"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { capitalize_first_letter } from "@/utils/string-tools"
import { BrowserWallet, Wallet } from "@meshsdk/core"
import { useWallet } from "@meshsdk/react"
import { Badge, Check, Moon, Sun, Verified } from "lucide-react"
import { title } from "process"
import { FC, useEffect, useState } from "react"

interface custom_props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  close_modal: () => void;
}

const WalletLoginModal: FC <custom_props> = ({ open, onOpenChange, close_modal }) => {
  const { connect } = useWallet();
  const [import_wallet_view, set_import_wallet_view] = useState(false);
  const [installed_wallets, set_installed_wallets] = useState<Wallet[] | undefined>();

  const get_wallets = async () => {
    const users_wallets = await BrowserWallet.getAvailableWallets();
    set_installed_wallets(users_wallets);
  }

  useEffect(() => {
    get_wallets();
  }, []);

  const attempt_wallet_connect = async (chosen_wallet: Wallet) => {
    try {
      await connect(chosen_wallet.name);
      const i = await BrowserWallet.enable(chosen_wallet.name);
      const get_addr = (await (i).getChangeAddress()).toString();
      if (get_addr.length > 0) {
        toast({
          title: 'Wallet Connected!',
          description: 'You have logged in with the wallet: ' + get_addr.substring(0, 10) + "..." + get_addr.substring(get_addr.length - 10),
        });
      }

      close_modal();
    } catch (error) {
      if (error instanceof Error) {
        toast({
          description: error.message,
          variant: 'destructive'
        });
      } else {
        throw error;
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] dark:border-neutral-800">
        <DialogHeader>
          <DialogTitle>Wallet Login</DialogTitle>
          <DialogDescription>
            Choose your wallet.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2">
          {/**
          <div className="pb-2 flex w-full justify-between items-center text-xs">
            <Label>
              Login Type
            </Label>

            <div className="flex gap-2">
              <Button size='sm' disabled={!import_wallet_view} variant='outline' onClick={() => set_import_wallet_view(false)} type="button">
                Detect
              </Button>

              <Button size='sm' disabled={import_wallet_view} variant='outline' onClick={() => set_import_wallet_view(true)} type="button">
                Import
              </Button>
            </div>
          </div>
          */}

          {import_wallet_view ?
            <>
              <Label>
                Import Your Wallet
              </Label>
            </>
            :
            <>
              <Label>
                Installed Wallets
              </Label>

              {installed_wallets?.map((wallet, index) => (
                <Button key={index} variant='ghost' onClick={() => attempt_wallet_connect(wallet)}>
                  <span className="flex gap-4 w-full items-center">
                    <img src={wallet.icon} className="size-5"/>
                    {capitalize_first_letter(wallet.name)}
                    {wallet.name === 'eternl' && (
                      <span className="ml-auto">
                        <Label className="text-xs border dark:border-green-400/60 inline-flex gap-2 py-0.5 px-2 rounded-lg">
                          Recommended
                          <Verified className="text-green-400"/>
                        </Label>
                      </span>
                    )}
                  </span>
                </Button>
              ))}
            </>
          }
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default WalletLoginModal;
