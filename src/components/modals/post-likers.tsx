"use client"

import { ArrowRight, Check, ExternalLink } from "lucide-react"
import { FC, useEffect, useState } from "react"
import { toast } from "sonner"
import { BrowserWallet, Wallet } from "@meshsdk/core"
import { useWallet } from "@meshsdk/react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { check_user_on_login } from "@/utils/api/misc"
import { capitalize_first_letter } from "@/utils/common"
import { get_cardano_wallets, WalletInformation } from "@/utils/cardano/get-cardano-wallets"
import { post_type } from "@/utils/types"
import FormatAddress from "../format-address"
import { ScrollArea } from "../ui/scroll-area"
import Link from "next/link"

interface custom_props {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  post_type: post_type;
  post_id: number;
  likers: string[];
}

const PostLikersModal: FC<custom_props> = ({
  open, onOpenChange, post_type, post_id, likers
}) => {

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] dark:border-slate-800">
        <DialogHeader>
          <DialogTitle>{post_type === 'feed_post' ? 'Post ' : 'Comment '}Likers</DialogTitle>
          <DialogDescription>
            View and discover who has liked this post.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-y-2">
          <h1 className="text-xs text-muted-foreground font-semiboldm text-right">
            Post Likers: {likers.length}
          </h1>

          <ScrollArea>
            <div className="max-h-96 p-4">
              {likers.map((liker, index) => (
                <Link href={`/dashboard?address=${liker}`}>
                  <Button key={index} type="button" variant="outline" className="justify-start w-full">
                    <FormatAddress address={liker} />
                    <div className="ml-auto"/>
                    <ArrowRight/>
                  </Button>
                </Link>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PostLikersModal;
