import { FC } from "react";

import { Badge } from "@/components/ui/badge";
import UserAvatar from "@/components/user-avatar";

import { cn } from "@/lib/utils";

import { chat_post_data } from "@/utils/api/interfaces";
import { format_long_string, format_unix } from "@/utils/string-tools";

interface custom_props {
  post: chat_post_data;
}

const FinbyteChatComponent: FC <custom_props> = ({
  post
}) => {

  return (
    <div
      className={cn(
        "w-full p-1.5 rounded-2xl relative isolate overflow-hidden",
        "bg-white/5 dark:bg-black/90",
        "bg-linear-to-br from-black/5 to-black/[0.02] dark:from-white/5 dark:to-white/[0.02]",
        "backdrop-blur-xl backdrop-saturate-[180%]",
        "border border-black/10 dark:border-white/10",
        "shadow-[0_8px_16px_rgb(0_0_0_/_0.15)] dark:shadow-[0_8px_16px_rgb(0_0_0_/_0.25)]",
      )}
    >
      <div
        className={cn(
          "w-full p-5 rounded-xl relative",
          "bg-linear-to-br from-black/[0.05] to-transparent dark:from-white/[0.08] dark:to-transparent",
          "backdrop-blur-md backdrop-saturate-150",
          "border border-black/[0.05] dark:border-white/[0.08]",
          "text-black/90 dark:text-white",
          "shadow-xs",
          "before:absolute before:inset-0 before:bg-linear-to-br before:from-black/[0.02] before:to-black/[0.01] dark:before:from-white/[0.03] dark:before:to-white/[0.01] before:opacity-0 before:transition-opacity before:pointer-events-none",
          "hover:before:opacity-100",
          "relative"
        )}
      >
        <div className="flex gap-4 items-center relative">
          <div className="shrink-0">
            <div className="rounded-lg overflow-hidden">
              <UserAvatar className="size-8" address={post.author}/>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <div className="flex items-center gap-1 text-sm">
                  <span className="font-semibold text-black dark:text-white/90 hover:underline cursor-pointer">
                    {format_long_string(post.author)}
                  </span>
                </div>

                <div className="inline-flex gap-2 items-center">
                  a
                </div>
              </div>

                <div className="p-1 flex items-center justify-center">
                  m
                </div>
              </div>
            </div>
          </div>

          <hr className="border-black/10 dark:border-white/10 my-4"/>

          <div className="mt-2 relative">
            
              {post.post}

            <span className="pt-2 text-black dark:text-white/50 text-sm mt-2 block flex w-full justify-between">
              {format_unix(post.timestamp).date}

              <Badge variant={'outline'}>
                #{post.id}
              </Badge>
            </span>

          </div>
        </div>
      </div>
  )
}

export default FinbyteChatComponent;