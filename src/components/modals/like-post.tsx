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
import { ArrowLeft, Copy, Heart, HeartCrack, Moon, Sun, Trash } from "lucide-react"
import { usePathname } from "next/navigation"
import { FC, useEffect, useState } from "react"

interface custom_props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  on_like: () => Promise<void>;
  is_a_liker: boolean;
}

const LikePostModal: FC <custom_props> = ({ open, onOpenChange, on_like, is_a_liker }) => {

  const attempt_like = async () => {
    await on_like();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] dark:border-neutral-800">
        <DialogHeader>
          <DialogTitle>{is_a_liker ? 'Unlike' : 'Like'} Post</DialogTitle>
          <DialogDescription>
            Liking a post? Kudos! Unliking? What happened?
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2 py-4">
          <Label className="text-center pb-2">
            Are you sure you want to {is_a_liker ? 'unlike' : 'like'} this post?
          </Label>

          <div className="flex justify-center items-center w-full gap-2">
            <Button size='sm' variant={'outline'} onClick={() => onOpenChange(false)}>
              <ArrowLeft/>
              Cancel
            </Button>

            <Button size='sm' onClick={attempt_like}>
              { is_a_liker ?
                <>
                  <HeartCrack/>
                  Unlike Post
                </>
                :
                <>
                  <Heart/>
                  Like Post
                </>
              }
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default LikePostModal;