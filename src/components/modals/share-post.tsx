"use client"

import { FC } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

import { Copy, Send, MessageSquare, Newspaper } from "lucide-react"
import { copy_to_clipboard } from "@/utils/common"
import SocialIcon from "../social-icons"

interface custom_props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post_id: number;
}

const SharePostModal: FC<custom_props> = ({ open, onOpenChange, post_id }) => {
  const post_url = `https://finbyte.network/post/${post_id}`;
  const encoded_post_url = encodeURIComponent(post_url);
  const share_text = encodeURIComponent(`Check out this Finbyte post!`);

  const share_options = [
    {
      name: "Copy Link",
      icon: <Copy size={16} />,
      onClick: () => copy_to_clipboard(post_url),
    },
    {
      name: "Share on X",
      icon: <SocialIcon only_icon name="x" />,
      href: `https://twitter.com/intent/tweet?url=${encoded_post_url}&text=${share_text}`,
    },
    {
      name: "Share on Telegram",
      icon: <Send size={16} />,
      href: `https://t.me/share/url?url=${encoded_post_url}&text=${share_text}`,
    },
    {
      name: "Share on WhatsApp",
      icon: <MessageSquare size={16} />,
      href: `https://wa.me/?text=${encoded_post_url}`,
    },
    {
      name: "Share on LinkedIn",
      icon: <Newspaper size={16} />,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded_post_url}`,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] dark:border-slate-800">
        <DialogHeader>
          <DialogTitle>Share Post #{post_id}</DialogTitle>
          <DialogDescription>Share this post to help it gain audience.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-y-2">
          <ScrollArea className="p-2">
            <div className="flex flex-col space-y-2">
              {share_options.map((option, idx) => (
                option.href ? (
                  <a
                    key={idx}
                    href={option.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="ghost" className="w-full justify-start">
                      {option.name}
                      <div className="ml-auto">{option.icon}</div>
                    </Button>
                  </a>
                ) : (
                  <Button
                    key={idx}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={option.onClick}
                  >
                    {option.name}
                    <div className="ml-auto">{option.icon}</div>
                  </Button>
                )
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SharePostModal;
