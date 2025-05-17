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
import { copy_to_clipboard } from "@/utils/string-tools"
import { Copy, Moon, Sun } from "lucide-react"
import { usePathname } from "next/navigation"
import { FC, useEffect, useState } from "react"

interface custom_props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post_id: number;
}

const SharePostModal: FC <custom_props> = ({ open, onOpenChange }) => {
  const pathname = usePathname();

  const toggle_copy = () => {
    copy_to_clipboard(pathname, 'The post link has been copied to the clipboard.');
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] dark:border-neutral-800">
        <DialogHeader>
          <DialogTitle>Share Post</DialogTitle>
          <DialogDescription>
            Share this post amoungst your friends and communities.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2 py-4">
          <Label>
            Share Link
          </Label>

          <div className="flex flex-col w-full gap-2">
            <Button variant='secondary' size='sm' onClick={toggle_copy}>
              <Copy/>
              {pathname}
            </Button>
            
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SharePostModal;