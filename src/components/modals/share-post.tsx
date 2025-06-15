"use client"

import { FC } from "react"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

import { copy_to_clipboard } from "@/utils/common"

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
