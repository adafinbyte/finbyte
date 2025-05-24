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
import { create_user_account, delete_account, update_username } from "@/utils/api/account/push"
import { checkSignature, generateNonce } from "@meshsdk/core"
import { get_pool_pm_adahandle } from "@/utils/api/external/pool-pm"
import { ADAHANDLE_POLICY } from "@/utils/consts"
import { Save, Trash, Unplug, Verified } from "lucide-react"
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
    if (!user_details) {
      toast({
        description: 'Could not find user details.',
        variant: 'destructive'
      })
      return;
    }

    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const signing_data = `${address} is changing their username at ${timestamp}.`;
      const nonce = generateNonce(signing_data);
      const signature = await wallet.signData(nonce, address);
      if (signature) {
        const is_valid_sig = await checkSignature(nonce, signature, address);
        if (is_valid_sig) {
          await update_username(address, timestamp, adahandle);
          await get_user_details();
        } else {
          toast({
            description: 'Signature verification failed! Whoops.',
            variant: 'destructive'
          })
          return;
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        toast({
          description: error.message,
          variant: 'destructive'
        })
      } else {
        throw error;
      }
    }
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

          <div className="flex flex-wrap items-center gap-2" style={{placeItems: 'start'}}>
            <div className="flex flex-col gap-1 p-2 rounded-lg border dark:border-neutral-800">
              <Label>Account Status</Label>
              <div className="mx-auto">
                {user_details?.account_data ?
                  <Verified className="size-4 text-blue-400"/> :
                  <Unplug className="size-4 opacity-50"/>
                }
              </div>
            </div>

            {user_details?.ada_handle && (
              <div className="flex flex-col p-2 rounded-lg border dark:border-neutral-800">
                <Label className="text-center">Username</Label>
                <div className="mx-auto">
                  <span className="text-black dark:text-white/60 text-sm inline-flex items-center">
                    <svg className="size-3 inline-block" viewBox="0 0 190 245" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M59.04 18.432c0-4.416 3.648-8.544 10.944-12.384C77.28 2.016 86.88 0 98.784 0 108 0 113.952 1.92 116.64 5.76c1.92 2.688 2.88 5.184 2.88 7.488v8.64c21.696 2.304 36.768 6.336 45.216 12.096 3.456 2.304 5.184 4.512 5.184 6.624 0 9.984-2.4 20.736-7.2 32.256-4.608 11.52-9.12 17.28-13.536 17.28-.768 0-3.264-.864-7.488-2.592-12.672-5.568-23.232-8.352-31.68-8.352-8.256 0-13.92.768-16.992 2.304-2.88 1.536-4.32 3.936-4.32 7.2 0 3.072 2.112 5.472 6.336 7.2 4.224 1.728 9.408 3.264 15.552 4.608 6.336 1.152 13.152 3.168 20.448 6.048 7.488 2.88 14.4 6.336 20.736 10.368s11.616 10.08 15.84 18.144c4.224 7.872 6.336 15.936 6.336 24.192s-.768 15.072-2.304 20.448c-1.536 5.376-4.224 10.944-8.064 16.704-3.648 5.76-9.312 10.944-16.992 15.552-7.488 4.416-16.512 7.68-27.072 9.792v4.608c0 4.416-3.648 8.544-10.944 12.384-7.296 4.032-16.896 6.048-28.8 6.048-9.216 0-15.168-1.92-17.856-5.76-1.92-2.688-2.88-5.184-2.88-7.488v-8.64c-12.48-1.152-23.328-2.976-32.544-5.472C8.832 212.64 0 207.456 0 201.888 0 191.136 1.536 180 4.608 168.48c3.072-11.712 6.72-17.568 10.944-17.568.768 0 8.736 2.592 23.904 7.776 15.168 5.184 26.592 7.776 34.272 7.776s12.672-.768 14.976-2.304c2.304-1.728 3.456-4.128 3.456-7.2s-2.112-5.664-6.336-7.776c-4.224-2.304-9.504-4.128-15.84-5.472-6.336-1.344-13.248-3.456-20.736-6.336-7.296-2.88-14.112-6.24-20.448-10.08s-11.616-9.504-15.84-16.992c-4.224-7.488-6.336-16.224-6.336-26.208 0-35.328 17.472-55.968 52.416-61.92v-3.744z" fill="#0CD15B"></path></svg>
                    {user_details?.ada_handle.slice(1)}
                  </span>
                </div>
              </div>
            )}

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
      <div className="h-full flex flex-col">
        {(found_handles && found_handles.length > 0) && (
          <div className="flex flex-col gap-2 w-full">
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

        <div className="flex items-center justify-between gap-2 mt-auto">
          <Label className="text-center text-xs opacity-80">Delete Account</Label>
          <Button variant='destructive' size='sm' onClick={confirm_delete ? () => delete_finbyte_account() : () => set_confirm_delete(true)}>
            {confirm_delete && (
              <motion.span
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                key={confirm_delete ? 'confirm' : 'delete'}
              >
                Are you sure?
              </motion.span>
            )}
            <Trash/>
          </Button>
        </div>
      </div>
    ),
  }

  const views = user_details?.account_data?.address === null ? { ...basic_views, ...non_finbyte_user_views } : {...basic_views, ...finbyte_user_views};
  const view_keys = Object.keys(views) as view[];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] dark:border-neutral-800">
        <DialogHeader>
          <DialogTitle>Account Overview</DialogTitle>
          <DialogDescription>
            Your account details.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-between gap-4 items-center">
          {view_keys.map((view, index) => (
            <Button key={index} type="button" size='sm' variant='outline' className="w-full" disabled={view === current_view} onClick={() => change_view(view)}>
              {view}
            </Button>
          ))}
          
        </div>

        <div className="grid gap-2 h-64">
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
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AccountModal;
