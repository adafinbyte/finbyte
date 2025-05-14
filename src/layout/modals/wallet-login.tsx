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
import { Badge, Check, Moon, Sun, Verified } from "lucide-react"
import { FC, useEffect, useState } from "react"

import { useConnectWallet, WalletInfo } from "@newm.io/cardano-dapp-wallet-connector";
import { capitalize_first_letter } from "@/utils/string-tools"
import { toast } from "sonner"
import { useIsMobile } from "@/hooks/use-mobile"

interface custom_props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WalletLoginModal: FC<custom_props> = ({ open, onOpenChange }) => {
  const { connect, isConnected, getSupportedWallets, error } = useConnectWallet();

  useEffect(() => {
    if (error) {
      toast.warning('Connection Error', {
        description: error,
      });
    }
  }, [error]);

  const supported_wallets = getSupportedWallets();
  const is_mobile = useIsMobile();

  const handle_connect = async (wallet_id: string) => {
    const eternlIsAvailable = typeof window !== "undefined" && window.cardano?.eternl;

    if (wallet_id === "eternl" && !eternlIsAvailable) {
      toast.info("Please open this site in the Eternl wallet's DApp browser.");
      return;
    }

    try {
      connect(wallet_id);
      onOpenChange(false);
    } catch (e) {
      toast.warning("Connection failed", { description: (e as Error).message });
    }
  };

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
          {is_mobile && (
            <div>
              <p>Mobile has limited support, we suggest using Eternl's dApp browser to connect your wallet.</p>
            </div>
          )}
          <Label>Supported Wallets</Label>

          {supported_wallets?.map((wallet, index) => (
            <Button key={index} variant='ghost' onClick={() => handle_connect(wallet.id)}>
              <span className="flex gap-4 w-full items-center">
                <img src={wallet.icon} className="size-5" />
                {capitalize_first_letter(wallet.name)}
                {wallet.name === 'Eternl' && (
                  <span className="ml-auto">
                    <Label className="text-xs border dark:border-green-400/60 inline-flex gap-2 py-0.5 px-2 rounded-lg">
                      Recommended
                      <Verified className="text-green-400" />
                    </Label>
                  </span>
                )}
              </span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default WalletLoginModal;
