"use client"

import { Check, ExternalLink } from "lucide-react"
import { FC, useEffect, useState } from "react"
import { toast } from "sonner"
import { BrowserWallet, Wallet } from "@meshsdk/core"
import { useWallet } from "@meshsdk/react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { check_user_on_login } from "@/utils/api/misc"
import { capitalize_first_letter } from "@/utils/common"
import { get_cardano_wallets, WalletInformation } from "@/utils/get-cardano-wallets"

interface custom_props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WalletLoginModal: FC<custom_props> = ({
  open, onOpenChange
}) => {
  const { connect } = useWallet();
  const [installed_wallets, set_installed_wallets] = useState<WalletInformation[]>([]);

  const get_wallets = async () => {
    const users_wallets = await get_cardano_wallets();
    if (users_wallets.data) {
      set_installed_wallets(users_wallets.data);
    }
  }

  const attempt_wallet_connect = async (chosen_wallet: WalletInformation) => {
    if (!chosen_wallet.is_installed) {
      window.open(chosen_wallet.url, '_blank');
      return;
    }

    try {
      await connect(chosen_wallet.name);
      const i = await BrowserWallet.enable(chosen_wallet.name);
      const get_addr = (await i.getChangeAddress()).toString();

      if (get_addr.length > 0) {
        try {
          const user = await check_user_on_login(get_addr);
          if (user.error) {
            toast.error(user.error);
          }

          if (user.data) {
            if (user.data === true) {
              toast.success('We found you! Wallet Connected.', {
                description: 'You have logged in with the wallet: ' +
                  get_addr.substring(0, 10) + "..." + get_addr.substring(get_addr.length - 10),
              });
              setTimeout(() => onOpenChange(false), 100);
            } else if (user.data === false) {
              toast.success('We added you to the system, kudos! Wallet Connected.', {
                description: 'You have logged in with the wallet: ' +
                  get_addr.substring(0, 10) + "..." + get_addr.substring(get_addr.length - 10),
              });
              setTimeout(() => onOpenChange(false), 100);
            }
          }
        } catch (err) {
          toast.error("Wallet connection succeeded, but user check failed.");
          console.error(err);
          onOpenChange(false);
          return;
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        throw error;
      }
    }
  };

  useEffect(() => {
    get_wallets();
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] dark:border-slate-800">
        <DialogHeader>
          <DialogTitle>Wallet Login</DialogTitle>
          <DialogDescription>
            Choose your wallet.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-y-2">
          <h1 className="text-sm font-semibold">
            Cardano Wallets
          </h1>

          {installed_wallets.map((wallet, index) => (
            <Button key={index} type="button" variant="outline" className="justify-start w-full" onClick={() => attempt_wallet_connect(wallet)}>
              <img src={wallet.img} className="size-5"/>
              {capitalize_first_letter(wallet.name)}
              <div className="ml-auto">
                {wallet.is_installed ?
                  <Check className="text-green-400"/>
                  :
                  <ExternalLink/>
                }
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default WalletLoginModal;
