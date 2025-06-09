"use client"

import { Check, ExternalLink } from "lucide-react"
import { FC, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { BlockfrostProvider, BrowserWallet, MeshWallet, Wallet } from "@meshsdk/core"
import { useWallet } from "@meshsdk/react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { check_user_on_login } from "@/utils/api/misc"
import { capitalize_first_letter } from "@/utils/common"
import { get_cardano_wallets, WalletInformation } from "@/utils/get-cardano-wallets"
import { saveAs } from "file-saver";
import { blockfrost_key } from "@/utils/api/secrets"
import { FINBYTE_WALLET_NAME } from "@/utils/consts"

interface custom_props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WalletLoginModal: FC<custom_props> = ({
  open, onOpenChange
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { connect, setWallet } = useWallet();
  const [installed_wallets, set_installed_wallets] = useState<WalletInformation[]>([]);

  const provider = new BlockfrostProvider(blockfrost_key);

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

  const generate_and_export_wallet = () => {
    const mnemonic = MeshWallet.brew();
    const walletFile = {
      networkId: 0,
      key: {
        type: "mnemonic",
        words: mnemonic,
      },
    };

    const blob = new Blob([JSON.stringify(walletFile, null, 2)], {
      type: "application/json",
    });

    saveAs(blob, `finbyte_wallet.json`);
  };

  const handle_file_upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const json = JSON.parse(text);

      const mnemonic = json?.key?.words;
      if (!mnemonic || !Array.isArray(mnemonic) || mnemonic.length < 12) {
        toast.error("Invalid wallet file format.");
        return;
      }

      const customWallet = new MeshWallet({
        networkId: 0, // 0 = testnet, 1 = mainnet
        fetcher: provider,
        submitter: provider,
        key: {
          type: "mnemonic",
          words: mnemonic,
        },
      });

      await customWallet.init();

      const address = await customWallet.getChangeAddress();
      setWallet(customWallet, "custom-mesh-wallet", { mnemonic });
      localStorage.setItem(FINBYTE_WALLET_NAME, JSON.stringify({ mnemonic }));

      const user = await check_user_on_login(address);
      if (user.error) {
        toast.error(user.error);
        return;
      }

      toast.success(user.data ? "Welcome back!" : "You're registered!", {
        description: `Logged in with address: ${address.slice(0, 10)}...${address.slice(-10)}`,
      });

      setTimeout(() => onOpenChange(false), 100);
    } catch (err) {
      console.error(err);
      toast.error("Failed to read wallet file.");
    }
  };

  useEffect(() => {
    const restore_wallet = async () => {
      const saved = localStorage.getItem(FINBYTE_WALLET_NAME);
      if (!saved) return;

      try {
        const { mnemonic } = JSON.parse(saved);
        const customWallet = new MeshWallet({
          networkId: 0,
          fetcher: provider,
          submitter: provider,
          key: {
            type: "mnemonic",
            words: mnemonic,
          },
        });

        await customWallet.init();
        setWallet(customWallet, "custom-mesh-wallet", { mnemonic });

        const addr = await customWallet.getChangeAddress();
        console.log("Restored wallet:", addr);
      } catch (e) {
        console.error("Failed to restore wallet:", e);
      }
    };

    restore_wallet();
  }, []);
  
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
            Create & Import Wallet
          </h1>

          <Button type="button" variant="outline" className="justify-start w-full" onClick={() => generate_and_export_wallet()}>
            Generate New Wallet
            <span className="ml-auto border border-red-400 rounded-lg px-2 py-0.5 text-xs">Testnet</span>
          </Button>


          <input
            type="file"
            accept=".json"
            onChange={handle_file_upload}
            className="hidden"
            ref={fileInputRef}
          />

          <Button
            type="button"
            variant="outline"
            className="justify-start w-full"
            onClick={() => fileInputRef.current?.click()}
          >
            Import Wallet File
            <span className="ml-auto border border-red-400 rounded-lg px-2 py-0.5 text-xs">Testnet</span>
          </Button>

          <h1 className="text-sm font-semibold mt-4">
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
