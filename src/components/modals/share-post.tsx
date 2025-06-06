"use client"

import { Check, ExternalLink } from "lucide-react"
import { FC, useEffect, useState } from "react"
import { toast } from "sonner"
import { BrowserWallet, Wallet } from "@meshsdk/core"
import { useWallet } from "@meshsdk/react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { check_user_on_login } from "@/utils/api/misc"
import { capitalize_first_letter, copy_to_clipboard } from "@/utils/common"
import { get_cardano_wallets, WalletInformation } from "@/utils/get-cardano-wallets"
import { post_type } from "@/utils/types"
import FormatAddress from "../format-address"
import { ScrollArea } from "../ui/scroll-area"
import { usePathname } from "next/navigation"

interface custom_props {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  post_id: number;
}

const SharePostModal: FC<custom_props> = ({
  open, onOpenChange, post_id
}) => {
  const pathname = usePathname();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] dark:border-slate-800">
        <DialogHeader>
          <DialogTitle>Share Post #{post_id}</DialogTitle>
          <DialogDescription>
            Share this post to help it gain audience.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-y-2">

          <ScrollArea>
            <div className="max-h-96 p-4">
              <Button onClick={() => copy_to_clipboard(pathname + 'post/' + post_id)} variant='ghost' className="w-full">
                {pathname + 'post/' + post_id}
              </Button>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SharePostModal;
