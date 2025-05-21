"use client";

import { ArrowRight, Clock, Heart, MessageCircle, MessagesSquare, ThumbsDown, ThumbsUp, VerifiedIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FC, useState } from "react";
import { post_with_comments } from "@/utils/api/interfaces";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import UserAvatar from "@/components/user-avatar";
import { capitalize_first_letter, format_long_string, format_unix } from "@/utils/string-tools";
import FinbyteMarkdown from "@/components/finbytemd";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWallet } from "@meshsdk/react";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import FormatAddress from "@/components/format-address";
import { useRouter } from "next/router";

interface custom_props {
  forum_post: post_with_comments
}

const PostPreview: FC <custom_props> = ({
  forum_post
}) => {


  const post = forum_post.post;
  const { address } = useWallet();
  const router = useRouter();

  const post_votes = forum_post.votes;
  const votes = forum_post.post.section === 'requests' ? {yes: post_votes?.filter(vote => vote.vote === "yes").length ?? 0, no: post_votes?.filter(vote => vote.vote === "no").length ?? 0 } : null;
  return (
    <Card className="dark:border-neutral-800 p-2 px-3">
      <div className="flex gap-2 items-center">
        <UserAvatar className="size-8" address={post.author}/>

        <div className="flex flex-col justify-start">
          <div>
            <Label className="text-xs opacity-60">{post.author.substring(0, 10) + "..."}</Label>
            <Label className="text-base font-bold tracking-wide bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-300 text-transparent bg-clip-text">{post.author.substring(post.author.length - 10)}</Label>
          </div>

          {forum_post.user?.ada_handle && (
            <FormatAddress address={forum_post.user.ada_handle}/>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <p className="text-xs opacity-80">{format_unix(post.updated_timestamp ? post.updated_timestamp : post.timestamp).time_ago}</p>
          <Button onClick={() => router.push('/forums/' + post.id)} size='sm' variant='ghost'><ArrowRight/></Button>
        </div>
      </div>

      <CardContent className="mt-2">
        <h1 className="text-lg font-semibold opacity-90">{post.title}</h1>

        {/** limit the view, not the post */}
        <ScrollArea>
          <div className="max-h-100 scale-[90%]">
            <FinbyteMarkdown>
              {post.updated_post ? post.updated_post : post.post}
            </FinbyteMarkdown>
          </div>
        </ScrollArea>
      </CardContent>

      <div className="flex items-center gap-2">
        <div className="opacity-90 inline-flex gap-1 items-center text-xs">
          <Heart className="size-3"/>
          {post.post_likers?.length ?? 0} Likes
        </div>

        <div className="opacity-90 inline-flex gap-1 items-center text-xs">
          <MessagesSquare className="size-3"/>
          {forum_post.comments?.length ?? 0} Comments
        </div>

        <div className="ml-auto"/>

        {post.section === 'requests' && (
          <>
            <div className="opacity-90 inline-flex gap-1 items-center text-xs">
              <ThumbsDown className="size-3"/>
              {votes?.no ?? 0} No
            </div>

            <div className="opacity-90 inline-flex gap-1 items-center text-xs">
              <ThumbsUp className="size-3"/>
              {votes?.yes ?? 0} Yes
            </div>
          </>
        )}
        
        <Badge variant='secondary'>
          #{capitalize_first_letter(post.section)}
        </Badge>
      </div>
    </Card>
  );
}

export default PostPreview;