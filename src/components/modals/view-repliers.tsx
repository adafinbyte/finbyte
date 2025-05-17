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
  repliers: string[];
}

const ViewRepliersModal: FC <custom_props> = ({
  open, onOpenChange, repliers
}) => {

  const count_replies = () => {
    const repliers_count: Record<string, number> = {};
  
    repliers.forEach((replier) => {
      repliers_count[replier] = (repliers_count[replier] || 0) + 1;
    });
  
    return Object.entries(repliers_count).map(([author, count]) => ({
      author,
      count,
    }));
  };

  const formatted_repliers = count_replies();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] dark:border-neutral-800">
        <DialogHeader>
          <DialogTitle>View Repliers</DialogTitle>
          <DialogDescription>
            Showing the unique repliers and how many time's they've commented.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col w-full gap-2 py-4">
          <Label>
            Repliers
          </Label>

          {formatted_repliers.length > 0 ? (
            <ScrollArea className="max-h-64 pr-4">
              {formatted_repliers.map((author, index) => (
              <Button key={index} className="w-full my-1" variant='secondary' onClick={() => copy_to_clipboard(author.author, 'The full address has been copied to the clipboard.')} >
                <Label className="cursor-pointer">
                  {format_long_string(author.author)}
                </Label>

                <span className='ml-auto flex items-center gap-2'>
                  <Badge variant='primary'>
                    x{author.count}
                  </Badge>
                  <Copy size={14}/>
                </span>
              </Button>
              ))}
            </ScrollArea>
            ) : (
            <p className='text-center text-sm my-auto'>
              We cannot find any replies on this post.<br />
              Shall you be the first?
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ViewRepliersModal;