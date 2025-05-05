import { FC, useEffect, useState } from "react";

import SiteHeader from "@/components/site-header";
import { useToast } from "@/hooks/use-toast";
import { create_comment_post_data, create_forum_post_data, platform_user_details, post_with_comments } from "@/utils/api/interfaces";
import { fetch_all_forum_posts_with_comments, fetch_forum_post_with_comments } from "@/utils/api/main/fetch";
import { useWallet } from "@meshsdk/react";
import { copy_to_clipboard, format_long_string, format_unix } from "@/utils/string-tools";
import { checkSignature, generateNonce } from "@meshsdk/core";
import { create_post } from "@/utils/api/main/push";
import { useRouter } from "next/router";
import { fetch_author_data } from "@/utils/api/account/fetch";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import UserAvatar from "@/components/user-avatar";
import FormatAddress from "@/components/format-address";
import { Button } from "@/components/ui/button";
import { Copy, Eye, EyeClosed, EyeOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import ForumPostComponent from "./post";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import ForumCommentComponent from "./comment";

interface custom_props {
  initial_forum_post: post_with_comments;
  initial_author_data: platform_user_details;
}

const ForumPostBlock: FC <custom_props> = ({
  initial_forum_post, initial_author_data
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const { address, connected, wallet } = useWallet();

  const [forum_post, set_forum_post] = useState<post_with_comments>(initial_forum_post);
  const [author_data, set_author_data] = useState<platform_user_details>(initial_author_data);
  const [view_adahandle, set_view_adahandle] = useState(false);
  const [refreshing_state, set_refreshing_state] = useState(false);
  const [show_create_post, set_show_create_post] = useState(false);
  const [hidden_comments, set_hidden_comments] = useState<Set<number>>(new Set());

  const fetch_post = async (post_id: number) => {
    set_refreshing_state(true);

    const post = await fetch_forum_post_with_comments(post_id);
    if (post?.error) {
      toast({
        description: post.error.toString(),
        variant: 'destructive'
      });
      return;
    }
    if (post?.data) {
      set_forum_post(prev => ({
        ...post.data,
        comments: post.data.comments ?? prev?.comments ?? []
      }));

      const author = await fetch_author_data(post.data.post.author);
      if (author?.error) {
        toast({
          description: author.error.toString(),
          variant: 'destructive'
        });
        return;
      }
      if (author?.data) {
        set_author_data(author.data);
      }
      set_forum_post(post.data);
    }

    set_refreshing_state(false);
  }

  const handle_view_adahandle = () => {
    if (author_data) {
      if (author_data.account_data.ada_handle) {
        set_view_adahandle(!view_adahandle);
      } else {
        toast({
          description: 'Could not find adahandle.',
          variant: 'destructive'
        });
      }
    } else {
      toast({
        description: 'No account data found.',
        variant: 'destructive'
      });
    }
  }

  const about_stats = [
    { title: 'Status', data: author_data?.account_data ? 'Registered' : 'Anonymous' },
    { title: 'First Post', data: author_data?.first_timestamp ? format_unix(Number(author_data?.first_timestamp)).time_ago : 'Loading...' },
    null,
    { title: 'Total Posts', data: author_data?.total_posts?.toLocaleString() ?? '0' },
    { title: 'Finbyte Kudos', data: author_data?.total_kudos.toLocaleString() ?? '0' },
  ];
  const add_adahandle_stat = { title: 'Username', data: author_data?.account_data?.ada_handle || 'Not Set' }
  const stat_set = author_data?.account_data.ada_handle
    ? [ ...about_stats.slice(0, 1), add_adahandle_stat, ...about_stats.slice(1) ]
    : [...about_stats];
  
  /** @todo paginate comment data so less stress fetching information */

  const create_comment = (details: create_comment_post_data) => {

  }

  const toggle_hide = (index: number) => {
    set_hidden_comments(prev => {
      const updated = new Set(prev);
      if (updated.has(index)) {
        updated.delete(index);
      } else {
        updated.add(index);
      }
      return updated;
    });
  };

  const commentVariants = {
    hidden: { opacity: 0, height: 0, overflow: 'hidden' },
    visible: { opacity: 1, height: 'auto', overflow: 'visible' },
    exit: { opacity: 0, height: 0, overflow: 'hidden' },
  };

  return (
    <>
      <SiteHeader title={`Viewing: ` + forum_post.post.title}/>

      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2 p-2 lg:p-4">
          <div className="grid lg:grid-cols-4 gap-2 items-start">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="mb-4"
            >
              <Card className="relative w-full border-black/10 dark:border-white/10 bg-white/5 dark:bg-black/90">
                <div
                  className={cn(
                    "absolute inset-0",
                    "opacity-80",
                    "transition-opacity duration-300",
                    "pointer-events-none"
                  )}
                >
                  <div className="rounded-xl absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.05)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[length:4px_4px]" />
                </div>

                <div className="p-4 relative">
                  <div className="flex gap-4 items-center justify-between w-full">
                    <UserAvatar address={forum_post.post.author} className="size-14"/>
                    <div className="flex flex-col gap-1 w-fit">
                      <Button size='sm' onClick={handle_view_adahandle} variant='secondary'>
                        <FormatAddress address={view_adahandle ? author_data?.account_data.ada_handle?.slice(1) ?? forum_post.post.author : forum_post.post.author}/>
                      </Button>

                      <span className="ml-auto cursor-default">
                        <Badge variant='primary'>
                          Kudos: {author_data?.total_kudos.toLocaleString() ?? '0'}
                        </Badge>
                      </span>
                    </div>
                  </div>
                </div>

                <hr className="border-black/10 dark:border-white/10"/>

                <CardContent className="pt-4 relative">
                  <Label className="text-xs">
                    About Author
                  </Label>

                  <div className="mt-2 flex flex-col w-full gap-2">
                    {stat_set.map((stat, index) => stat ? (
                      <Button key={index} variant='outline' size='sm' className="cursor-copy" onClick={() => copy_to_clipboard(stat.data.toString(), 'The value of "' + stat.title + '" has been copied.')}>
                        <span className="flex w-full gap-4">
                          <Copy className="p-0.5" />
                          {stat.title}
                          <span className="ml-auto">
                            {stat.data}
                          </span>
                        </span>
                      </Button>
                    ) : <div className="mt-4"/>)}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <div className="px-2 lg:col-span-3 w-full">

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="mb-4"
            >
              <ForumPostComponent
                forum_post={forum_post}
                is_registered={author_data?.account_data ? true : false}
                on_create={() => set_show_create_post(!show_create_post)}
              />
            </motion.div>

              <AnimatePresence>
                {show_create_post && (
                  <motion.div
                    key="create-post-form"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ height: 0, opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    layout
                    className="mt-6"
                  >
                    Creating Post
                  </motion.div>
                )}
              </AnimatePresence>

            <motion.div layout className="flex flex-col w-full gap-2 mt-2">
              <Label className={`text-xs text-left flex gap-1 ml-auto`}>
                Post Comments:
                <span className="text-blue-400">
                  {forum_post.comments ? forum_post.comments.length : 0}
                </span>
              </Label>

              {forum_post.comments && forum_post.comments.map((comment, index) => (
            <div className={`flex gap-x-2 pb-2 ${hidden_comments.has(index) ? 'items-center' : ''}`}>
              <Button size='sm' variant='ghost' onClick={() => toggle_hide(index)}>
                {!hidden_comments.has(index) ?
                  <EyeOff/>
                  :
                  <Eye/>
                }
              </Button>

              <AnimatePresence mode="wait">
                {hidden_comments.has(index) ? (
                  <motion.div
                    key="hidden"
                    variants={commentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="flex w-full"
                  >
                    <Label className="opacity-50">
                      This comment has been hidden. ID: #{comment.id}
                    </Label>
                  </motion.div>
                ) : (
                  <motion.div
                    key="visible"
                    variants={commentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="grow"
                  >
                  <ForumCommentComponent
                    key={index}
                    comment_post={comment}
                    is_registered={false} /** @todo / @note part of paginate */
                    on_create={create_comment}
                    original_post_author={forum_post.post.author}
                  />
                  </motion.div>
                )}
                </AnimatePresence>
              </div>
          ))}</motion.div>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ForumPostBlock;