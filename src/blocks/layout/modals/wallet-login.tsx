"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { capitalize_first_letter } from "@/utils/string-tools"
import { BrowserWallet, Wallet } from "@meshsdk/core"
import { useWallet } from "@meshsdk/react"
import { Verified } from "lucide-react"
import { FC, useEffect, useState } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { toast } from "sonner"

interface custom_props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WalletLoginModal: FC <custom_props> = ({
  open, onOpenChange
}) => {
  const { connect } = useWallet();
  const is_mobile = useIsMobile();

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
    const eternlIsAvailable = typeof window !== "undefined" && window.cardano?.eternl;

    if (chosen_wallet.id.toLowerCase() === "eternl" && !eternlIsAvailable) {
      toast.info("Please open this site in the Eternl wallet's dApp browser.");
      return;
    }

    try {
      await connect(chosen_wallet.name);
      const i = await BrowserWallet.enable(chosen_wallet.name);
      const get_addr = (await (i).getChangeAddress()).toString();
      if (get_addr.length > 0) {
        toast('Wallet Connected!', {
          description: 'You have logged in with the wallet: ' + get_addr.substring(0, 10) + "..." + get_addr.substring(get_addr.length - 10),
        });
      }

      onOpenChange(false);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
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
          <Label>
            Installed Wallets
          </Label>

          {installed_wallets ? installed_wallets?.map((wallet, index) => (
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
          )) : (
            <div>
              <p>
                If you're on mobile, we suggest you use the wallet dapp browser Eternl offers within their wallet to connect to Finbyte.
              </p>
              <p>
                Don't have a wallet? "TODO" - Learn how to get started here.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default WalletLoginModal;
