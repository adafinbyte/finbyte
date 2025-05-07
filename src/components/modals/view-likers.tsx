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
import { copy_to_clipboard, format_long_string } from "@/utils/string-tools"
import { Copy } from "lucide-react"
import { FC } from "react"
import { Badge } from "../ui/badge"
import { ScrollArea } from "../ui/scroll-area"

interface custom_props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  likers: string[];
}

const ViewLikersModal: FC <custom_props> = ({
  open, onOpenChange, likers
}) => {

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] dark:border-neutral-800">
        <DialogHeader>
          <DialogTitle>View Likers</DialogTitle>
          <DialogDescription>
            Showing the likers of this content.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col w-full gap-2 py-4">
          <Label>
            Likers
          </Label>

          {likers.length > 0 ? (
            <ScrollArea className="max-h-64 pr-4 w-full">
              {likers.map((liker, index) => (
                <Button key={index} className="w-full my-1" variant='secondary' onClick={() => copy_to_clipboard(liker, 'The full address has been copied to the clipboard.')} >
                  <Label className="cursor-pointer">
                    {format_long_string(liker)}
                  </Label>

                  <span className='ml-auto'>
                    <Copy size={14}/>
                  </span>
                </Button>
              ))}
            </ScrollArea>
            ) : (
            <p className='text-center text-sm my-auto'>
              We cannot find any likers on this post.<br />
              Shall you be the first?
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ViewLikersModal;