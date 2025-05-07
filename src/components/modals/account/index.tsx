"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { FC, ReactNode, useEffect, useState } from "react"
import AccountCreateView from "./create-account"
import { AnimatePresence, motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { fetch_author_data } from "@/utils/api/account/fetch"
import { useWallet } from "@meshsdk/react"
import { account_data, create_account_data, platform_user_details } from "@/utils/api/interfaces"
import { toast } from "@/hooks/use-toast"
import { LoadingDots } from "@/components/ui/loading-dots"
import { create_user_account, delete_account } from "@/utils/api/account/push"
import { checkSignature, generateNonce } from "@meshsdk/core"
import { get_pool_pm_adahandle } from "@/utils/api/external/pool-pm"
import { ADAHANDLE_POLICY } from "@/utils/consts"
import { Save, Trash } from "lucide-react"
import AdaHandlesComboBox from "./adahandles-combobox"

interface custom_props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AccountModal: FC <custom_props> = ({ open, onOpenChange }) => {
  const { address, connected, wallet } = useWallet();

  const [user_details, set_user_details] = useState<platform_user_details>();
  const [found_handles, set_found_handles] = useState<string[] | null>(null);
  const [chosen_handle, set_chosen_handle] = useState<string | null>(null);
  const [confirm_delete, set_confirm_delete] = useState(false);

  type view = 'Overview' | 'Create Account' | 'Settings';
  const [current_view, set_current_view] = useState<view>('Overview');
  const transition_variants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  const change_view = (view: view) => {
    set_confirm_delete(false);
    set_current_view(view);
  }

  const get_user_details = async () => {
    const user_details = await fetch_author_data(address);
    if (user_details?.error) {
      toast({
        description: user_details.error.toString(),
        variant: 'destructive'
      });
      return;
    }
    if (user_details.data) {
      set_user_details(user_details.data);
    }
  }

  const find_users_adahandles = async () => {
    const adahandles = await wallet.getPolicyIdAssets(ADAHANDLE_POLICY);

    const names = await Promise.all(
      adahandles.map(async a => {
        const metadata = await get_pool_pm_adahandle(a.fingerprint);
        return metadata ? metadata.metadata.name : null;
      })
    );

    if (names) {
      set_found_handles(names as string[]);
    }
  }

  const create_finbyte_account = async (details: create_account_data) => {
    if (!address || !(user_details?.account_data === null)) { return; } else {
      try {
        const signing_string = `${address} is signing this message to confirm they are creating a Finbyte account.`;
        const nonce = generateNonce(signing_string);
        const signature = await wallet.signData(nonce, address);

        if (signature) {
          const is_valid_sig = await checkSignature(nonce, signature, address);
          if (is_valid_sig) {
            const ad: account_data = {
              f_timestamp:     details.f_timestamp,
              ada_handle:      details.ada_handle,
              address:         address,
              badges:          null,
              community_badge: null,
              l_timestamp:    null,
            }
  
            await create_user_account(ad);
            await get_user_details();
            toast({
              title: 'Account creation succeeded!',
              description: 'Kudos on the new account.',
            });
          } else {
            toast({
              description: 'Signature verification failed! Whoops.',
              variant: 'destructive'
            });
            return;
          }
        }
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
    onOpenChange(false);
    set_current_view('Overview');
  }

  const delete_finbyte_account = async () => {
    if (!address || (user_details?.account_data === null)) { return; } else {
      try {
        const signing_string = `${address} is signing this message to confirm they are deleting their Finbyte account.`;
        const nonce = generateNonce(signing_string);
        const signature = await wallet.signData(nonce, address);

        if (signature) {
          const is_valid_sig = await checkSignature(nonce, signature, address);
          if (is_valid_sig) {
            const timestamp = Math.floor(Date.now() / 1000);
            await delete_account(address, timestamp);
            await get_user_details();
            toast({
              title: 'Your account has been deleted',
              description: 'We hope to see you come back one day!',
            });
          } else {
            toast({
              description: 'Signature verification failed! Whoops.',
              variant: 'destructive'
            });
            return;
          }
        }
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
    onOpenChange(false);
    set_current_view('Overview');
  }

  const save_handle = async (adahandle: string) => {

  }

  useEffect(() => {
    if (connected) {
      get_user_details();
      find_users_adahandles();
    } else {
      onOpenChange(false);
    }
  }, [connected]);

  const basic_views: Partial<Record<view, ReactNode>> = {
    'Overview': (
      <div>
        <Label className="text-center pb-2">Overview</Label>
        <Card className="mt-2 relative p-4 border-transparent dark:bg-white/5 bg-black/5">
          <div
            className={cn(
              "absolute inset-0",
              "opacity-80",
              "transition-opacity duration-300",
              "pointer-events-none"
            )}
          >
            <div className="rounded-xl absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.06)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[length:4px_4px]" />
          </div>

        </Card>
      </div>
    ),
  };

  const non_finbyte_user_views: Partial<Record<view, ReactNode>> = {
    'Create Account': (
      <AccountCreateView
        toggle_cancel={() => change_view('Overview')}
        found_handles={found_handles}
        on_create={create_finbyte_account}
      />
    )
  }

  const finbyte_user_views: Partial<Record<view, ReactNode>> = {
    'Settings': (
      <div>
        <Label className="text-center pb-2">Account Settings</Label>

        {(found_handles && found_handles.length > 0) && (
          <div className="flex flex-col gap-2 w-full mt-2">
            <Label className="text-xs opacity-80">
              Change Username
            </Label>

            <AdaHandlesComboBox
              adahandles={found_handles}
              on_selected={set_chosen_handle}
              on_save_handle={save_handle}
            />
          </div>
        )}
        
        <div className="flex items-center justify-between gap-2 mt-4">
          <Label className="text-center pb-2 opacity-80">Delete Account</Label>
          <Button variant='destructive' size='sm' onClick={confirm_delete ? () => delete_finbyte_account() : () => set_confirm_delete(true)}>
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              key={confirm_delete ? 'confirm' : 'delete'}
            >
              {confirm_delete ? 'Are you sure?' : 'Delete Account'}
            </motion.span>
            <Trash/>
          </Button>
        </div>
      </div>
    ),
  }

  const views = user_details?.account_data?.address === null ? { ...basic_views, ...non_finbyte_user_views } : {...basic_views, ...finbyte_user_views};
  const view_keys = Object.keys(views) as view[];

  return user_details && (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] dark:border-neutral-800">
        <DialogHeader>
          <DialogTitle>Account Overview</DialogTitle>
          <DialogDescription>
            Everything in one place.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-between gap-4 items-center">
          {view_keys.map((view, index) => (
            <Button key={index} type="button" size='sm' variant='outline' className="w-full" disabled={view === current_view} onClick={() => change_view(view)}>
              {view}
            </Button>
          ))}
          
        </div>

        <div className="grid gap-2 pb-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={current_view}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={transition_variants}
              transition={{ duration: 0.2 }}
            >
              {views[current_view]}
            </motion.div>
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AccountModal;