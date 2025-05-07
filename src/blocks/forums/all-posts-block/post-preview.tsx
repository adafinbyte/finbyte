"use client";

import { ArrowRight, Heart, MessageCircle, ThumbsDown, ThumbsUp, VerifiedIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FC } from "react";
import { post_with_comments } from "@/utils/api/interfaces";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import UserAvatar from "@/components/user-avatar";
import { capitalize_first_letter, format_long_string, format_unix } from "@/utils/string-tools";
import FinbyteMarkdown from "@/components/finbytemd";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWallet } from "@meshsdk/react";
import { Label } from "@/components/ui/label";

interface custom_props {
  forum_post: post_with_comments
}

const PostPreview: FC <custom_props> = ({
  forum_post
}) => {
  const post = forum_post.post;
  const { address } = useWallet();
  const post_votes = forum_post.votes;
  const votes = forum_post.post.section === 'requests' ? {yes: post_votes?.filter(vote => vote.vote === "yes").length ?? 0, no: post_votes?.filter(vote => vote.vote === "no").length ?? 0 } : null;
  return (
    <Link
      href={'/forums/' + post.id}
    >
      <div
        className={cn(
          "w-full p-1.5 rounded-2xl relative isolate overflow-hidden lg:hover:-translate-y-1 duration-300",
          "bg-white/5 dark:bg-black/90",
          "bg-linear-to-br from-black/5 to-black/[0.02] dark:from-white/5 dark:to-white/[0.02]",
          "backdrop-blur-xl backdrop-saturate-[180%]",
          "border border-black/10 dark:border-white/10",
          "shadow-[0_8px_16px_rgb(0_0_0_/_0.15)] dark:shadow-[0_8px_16px_rgb(0_0_0_/_0.25)]",
          "will-change-transform translate-z-0"
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
            "will-change-transform translate-z-0",
            "before:absolute before:inset-0 before:bg-linear-to-br before:from-black/[0.02] before:to-black/[0.01] dark:before:from-white/[0.03] dark:before:to-white/[0.01] before:opacity-0 before:transition-opacity before:pointer-events-none",
            "hover:before:opacity-100",
            "relative group"
          )}
        >
        <div
          className={cn(
            "absolute inset-0",
            "opacity-20 group-hover:opacity-100",
            "transition-opacity duration-300",
          )}
        >
          <div className="rounded-xl absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.05)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[length:4px_4px]" />
        </div>
          <div className="flex gap-4 items-center">
            <div className="shrink-0">
              <div className="size-10 rounded-lg overflow-hidden">
                <Avatar>
                  <UserAvatar address={post.author}/>
                </Avatar>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">

                    <span className="font-semibold text-black dark:text-white/90 hover:underline cursor-pointer">
                      {format_long_string(post.author)}
                    </span>

                    {forum_post.user?.account_data ? (
                      <VerifiedIcon className="h-4 w-4 text-blue-400" />
                    ) : <></>}
                  </div>

                  {forum_post?.user?.account_data?.address && (
                    <span className="text-black dark:text-white/60 text-sm inline-flex items-center">
                      <svg className="size-3 inline-block" viewBox="0 0 190 245" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M59.04 18.432c0-4.416 3.648-8.544 10.944-12.384C77.28 2.016 86.88 0 98.784 0 108 0 113.952 1.92 116.64 5.76c1.92 2.688 2.88 5.184 2.88 7.488v8.64c21.696 2.304 36.768 6.336 45.216 12.096 3.456 2.304 5.184 4.512 5.184 6.624 0 9.984-2.4 20.736-7.2 32.256-4.608 11.52-9.12 17.28-13.536 17.28-.768 0-3.264-.864-7.488-2.592-12.672-5.568-23.232-8.352-31.68-8.352-8.256 0-13.92.768-16.992 2.304-2.88 1.536-4.32 3.936-4.32 7.2 0 3.072 2.112 5.472 6.336 7.2 4.224 1.728 9.408 3.264 15.552 4.608 6.336 1.152 13.152 3.168 20.448 6.048 7.488 2.88 14.4 6.336 20.736 10.368s11.616 10.08 15.84 18.144c4.224 7.872 6.336 15.936 6.336 24.192s-.768 15.072-2.304 20.448c-1.536 5.376-4.224 10.944-8.064 16.704-3.648 5.76-9.312 10.944-16.992 15.552-7.488 4.416-16.512 7.68-27.072 9.792v4.608c0 4.416-3.648 8.544-10.944 12.384-7.296 4.032-16.896 6.048-28.8 6.048-9.216 0-15.168-1.92-17.856-5.76-1.92-2.688-2.88-5.184-2.88-7.488v-8.64c-12.48-1.152-23.328-2.976-32.544-5.472C8.832 212.64 0 207.456 0 201.888 0 191.136 1.536 180 4.608 168.48c3.072-11.712 6.72-17.568 10.944-17.568.768 0 8.736 2.592 23.904 7.776 15.168 5.184 26.592 7.776 34.272 7.776s12.672-.768 14.976-2.304c2.304-1.728 3.456-4.128 3.456-7.2s-2.112-5.664-6.336-7.776c-4.224-2.304-9.504-4.128-15.84-5.472-6.336-1.344-13.248-3.456-20.736-6.336-7.296-2.88-14.112-6.24-20.448-10.08s-11.616-9.504-15.84-16.992c-4.224-7.488-6.336-16.224-6.336-26.208 0-35.328 17.472-55.968 52.416-61.92v-3.744z" fill="#0CD15B"></path></svg>
                      {forum_post?.user.ada_handle?.toString().slice(1)}
                    </span>
                  )}
                </div>

                <div className="h-8 w-8 text-black dark:text-white/80 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-lg p-1 flex items-center justify-center">
                  <ArrowRight className="p-1"/>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-2">
            <Label className="text-lg text-blue-500 dark:text-blue-200">{post.title}</Label>
            <FinbyteMarkdown>
              {post.post.length > 100 ? post.post.substring(0, 100) + '...' : post.post}
            </FinbyteMarkdown>

            <span className="pt-2 text-black dark:text-white/50 text-sm mt-2 block flex w-full justify-between">
              {format_unix(post.timestamp).time_ago}

              <Badge variant={'outline'}>
                {capitalize_first_letter(post.section)}
              </Badge>
            </span>
            
            <hr className='dark:border-neutral-800 my-4'/>

            <div className="flex gap-2">
              <Button size={'sm'} disabled variant='ghost'>
                <Heart className={`${post.post_likers?.includes(address) ? 'text-rose-400 fill-rose-400' : ''}`}/>
                {post.post_likers?.length ?? 0}
              </Button>

              <Button size={'sm'} disabled variant='ghost'>
                <MessageCircle className={`${forum_post.comments?.some(a => a.author === address) ? 'text-blue-400 fill-blue-400' : ''}`}/>
                {forum_post.comments?.length ?? 0}
              </Button>

              {forum_post.post.section === 'requests' && (
                <div className="ml-auto flex items-center gap-2">
                  <Button size={'sm'} disabled variant='outline' className={`${post_votes?.some(a => (a.address === address) && a.vote === 'no') ? 'border-red-400' : ''}`}>
                    <ThumbsDown/>
                    {votes?.no ?? 0}
                  </Button>

                  <Button size={'sm'} disabled variant='outline' className={`${post_votes?.some(a => (a.address === address) && a.vote === 'yes') ? 'border-green-400' : ''}`}>
                    <ThumbsUp/>
                    {votes?.yes ?? 0}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PostPreview;