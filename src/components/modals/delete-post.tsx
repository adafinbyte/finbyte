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
import { ArrowLeft, Copy, Moon, Sun, Trash } from "lucide-react"
import { usePathname } from "next/navigation"
import { FC, useEffect, useState } from "react"

interface custom_props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  on_delete: () => Promise<void>;
}

const DeletePostModal: FC <custom_props> = ({ open, onOpenChange, on_delete }) => {

  const attempt_delete = async () => {
    await on_delete();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] dark:border-neutral-800">
        <DialogHeader>
          <DialogTitle>Delete Post</DialogTitle>
          <DialogDescription>
            This is irreversable and cannot be undone, think carefully.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2 py-4">
          <Label className="text-center pb-2">
            Are you sure you want to delete this post?
          </Label>

          <div className="flex justify-center items-center w-full gap-2">
            <Button size='sm' onClick={() => onOpenChange(false)}>
              <ArrowLeft/>
              Cancel
            </Button>

            <Button variant='destructive' size='sm' onClick={attempt_delete}>
              <Trash/>
              Delete
            </Button>
            
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DeletePostModal;