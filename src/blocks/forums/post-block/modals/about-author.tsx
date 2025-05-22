// components/SettingsModal.tsx
"use client"

import FormatAddress from "@/components/format-address"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { platform_user_details } from "@/utils/api/interfaces"
import { format_unix } from "@/utils/string-tools"
import { Moon, Sun, Verified } from "lucide-react"
import { useTheme } from "next-themes"
import { FC, useEffect, useState } from "react"

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  author_details: platform_user_details;
}

const AboutAuthorModal: FC<SettingsModalProps> = ({ open, onOpenChange, author_details }) => {
  const account_type = author_details.type === 'anon' ? 'Anonymous User' : 'Finbyte User';
  const total_posts = author_details.total_posts.toLocaleString();
  const first_timestamp = format_unix(author_details.first_timestamp).time_ago;
  const total_kudos = author_details.total_kudos.toLocaleString();
  const ada_handle = author_details.ada_handle ? author_details.ada_handle : 'Not Set';
  const address = author_details.address;

  const displayed_stats = [
    { title: 'Account Type', data: account_type },
    { title: 'Total Posts', data: total_posts },
    { title: 'First Interaction', data: first_timestamp },
    { title: 'Total Kudos', data: total_kudos },
    { title: 'Ada Handle', data: ada_handle },
    { title: 'Address', data: address },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] dark:border-neutral-800">
        <DialogHeader>
          <DialogTitle>About this Author</DialogTitle>
          <DialogDescription>
            View this Author's Finbyte stats.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2 py-4">
          <Label>
            Platform Statistics
          </Label>
          <div className="flex flex-wrap max-w-96 mx-auto mt-2 gap-2 justify-center items-center">
            {displayed_stats.map((item, index) => (
              <Card className="p-2 dark:border-neutral-800 px-3 text-center">
                <h1 className="text-xs opacity-60 font-semibold">
                  {item.title}
                </h1>

                {(item.title === 'Ada Handle' || item.title === 'Address') ? (
                  <FormatAddress address={item.data}/>
                  ) : (
                  <span className="inline-flex gap-1.5 items-center">
                    {item.data}
                    {item.data === 'Finbyte User' && (
                      <Verified className="text-blue-400 size-4"/>
                    )}
                  </span>
                )}
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AboutAuthorModal;
