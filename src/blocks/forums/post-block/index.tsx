import { FC, useEffect, useRef, useState } from "react";

import SiteHeader from "@/components/site-header";
import { useToast } from "@/hooks/use-toast";
import { create_comment_post_data, create_community_post_data, create_forum_post_data, edit_post_data, platform_user_details, post_with_comments } from "@/utils/api/interfaces";
import { fetch_all_forum_posts_with_comments, fetch_forum_post_with_comments } from "@/utils/api/forums/fetch";
import { useWallet } from "@meshsdk/react";
import { copy_to_clipboard, format_long_string, format_unix } from "@/utils/string-tools";
import { checkSignature, generateNonce } from "@meshsdk/core";
import { create_post, like_unlike_post } from "@/utils/api/forums/push";
import { useRouter } from "next/router";
import { fetch_author_data } from "@/utils/api/account/fetch";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import UserAvatar from "@/components/user-avatar";
import FormatAddress from "@/components/format-address";
import { Button } from "@/components/ui/button";
import { Copy, Eye, EyeClosed, EyeOff, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import ForumPostComponent from "./post";
import { AnimatePresence, motion, useAnimation, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import ForumCommentComponent from "./comment";
import CreateCommentComponent from "./actions/create-comment";
import { post_type } from "@/utils/api/types";
import { delete_post } from "@/utils/api/mod";

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
        set_forum_post(prev => ({
          ...post.data,
          comments: post.data.comments ?? prev?.comments ?? [],
          user: author.data
        }));
      }
    }

    set_refreshing_state(false);
  }

  const handle_view_adahandle = () => {
    if (author_data) {
      if (author_data.account_data?.ada_handle) {
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
  const add_adahandle_stat = { title: 'Adahandle', data: author_data?.account_data?.ada_handle || 'Not Set' }
  const stat_set = author_data?.account_data?.ada_handle
    ? [ ...about_stats.slice(0, 1), add_adahandle_stat, ...about_stats.slice(1) ]
    : [...about_stats];
  
  /** @todo paginate comment data so less stress fetching information */

  const toggle_like_unlike_post = async (
    type: post_type,
    post_id: number,
    post_likers: string[] | null
  ) => {
    try {
      const timestamp = Math.floor(Date.now() / 1000);
      let like_data: string[];
  
      if (post_likers?.includes(address)) {
        like_data = post_likers.filter(addr => addr !== address);
      } else {
        like_data = post_likers ? [...post_likers, address] : [address];
      }

      const signing_data = `${format_long_string(address)} ${post_likers?.includes(address) ? 'removed a like' : 'liked a post'} ${timestamp}.`;
      const nonce = generateNonce(signing_data);
      const signature = await wallet.signData(nonce, address);

      if (signature) {
        const is_valid = await checkSignature(nonce, signature, address);
        if (is_valid) {
          await like_unlike_post(like_data, post_id, timestamp, address, type, post_likers?.includes(address) ? 'unlike' : 'like');
          await fetch_post(forum_post.post.id);
        } else {
          toast({
            description: `Signature verification failed! Whoops.`,
            variant: 'destructive'
          });
          return;
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        toast({
          description: error.message,
          variant: 'destructive'
        });
      } else {
        throw error;
      }
    }
  };

  const create_comment = async (creation: create_comment_post_data | create_community_post_data) => {
    const details = creation as create_comment_post_data;
    if (!connected) { return; } else {
      try {
        const timestamp = Math.floor(Date.now() / 1000);
        const signing_data = `${format_long_string(details.author)} created a comment at ${details.timestamp} on post: ${details.post_id}`;
        const nonce = generateNonce(signing_data);
        const signature = await wallet.signData(nonce, address);
        if (signature) {
          const is_valid_sig = await checkSignature(nonce, signature, address);
          if (is_valid_sig) {
            await create_post(details, 'forum_comment', timestamp, address);
            await fetch_post(forum_post.post.id);
          } else {
            toast({
              description: `Signature verification failed! Whoops.`,
              variant: 'destructive'
            });
            return;
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          toast({
            description: error.message,
            variant: 'destructive'
          });
        } else {
          throw error;
        }
      }
    }
  }

  const edit_content = async (
    type: post_type,
    details: edit_post_data,
    post_id: number,
  ) => {
    if (!connected) { return; } else {
      try {
        const signing_data = `${format_long_string(details.author)} is editing their post at ${details.updated_timestamp}`;
        const nonce = generateNonce(signing_data);
        const signature = await wallet.signData(nonce, address);
        if (signature) {
          const is_valid_sig = await checkSignature(nonce, signature, address);
          if (is_valid_sig) {
            //await edit_post(post_id, use_wallet.address, details.updated_post, details.updated_timestamp, type);
            await fetch_post(forum_post.post.id);
          } else {
            //toast.error('Signature verification failed! Whoops.');
            return;
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          //toast.error(error.message)
        } else {
          throw error;
        }
      }
    }
  }

  const delete_content = async (
    post_type: post_type,
    post_id: number,
  ): Promise<void> => {
    if (!connected) {
      return;
    } else {
      try {
        const timestamp = Math.floor(Date.now() / 1000);
        const signing_data = `This post is about to be removed by: ${address} at ${timestamp}.`;
        const nonce = generateNonce(signing_data);
        const signature = await wallet.signData(nonce, address);
        if (signature) {
          const is_valid_sig = await checkSignature(nonce, signature, address);
          if (is_valid_sig) {
            await delete_post(post_id, post_type, address, timestamp);
            if (post_type === 'forum_comment') {
              await fetch_post(forum_post.post.id as number);
            } else {
              router.push('/forums');
            }

            toast({
              description: `Content has been deleted`,
              variant: 'destructive'
            });
          } else {
            toast({
              description: `Signature verification failed! Whoops.`,
              variant: 'destructive'
            });
            return;
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          toast({
            description: error.message,
            variant: 'destructive'
          });
        } else {
          throw error;
        }
      }
    }
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

  const ref = useRef(null);
  const in_view = useInView(ref, { once: false, margin: "-100px" });
  const controls = useAnimation();

  useEffect(() => {
    if (in_view) {
      controls.start("show");
    }
  }, [in_view, controls]);

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
          <div className="grid lg:grid-cols-4 gap-2 items-start" ref={ref}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="lg:mb-4"
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
                        <FormatAddress address={author_data.account_data?.ada_handle ? !view_adahandle ? author_data.account_data.ada_handle : forum_post.post.author : forum_post.post.author}/>
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
                      <Button key={index} variant='outline' size='sm' className={(index === 0 || index === 2) ? 'cursor-default' : 'cursor-copy'} onClick={(index === 0 || index === 2) ? undefined : () => copy_to_clipboard(stat.data.toString(), 'The value of "' + stat.title + '" has been copied.')}>
                        <span className="flex w-full gap-4">
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

              <div className="mt-2 flex gap-2">
                <Button variant={'ghost'} className="size-8 p-1" onClick={() => fetch_post(forum_post.post.id)}>
                  <RefreshCw className={refreshing_state ? "animate-spin" : ""}/>
                </Button>
              </div>
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
                on_delete={() => delete_content('forum_post', forum_post.post.id)}
                on_refresh={() => fetch_post(forum_post.post.id)}
                on_like_unlike={() => toggle_like_unlike_post('forum_post', forum_post.post.id, forum_post.post.post_likers)}
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
                  <CreateCommentComponent
                    on_create={create_comment}
                    close_create={() => set_show_create_post(false)}
                    post_id={forum_post.post.id}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              layout
              className="flex flex-col w-full gap-2 mt-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", delay: 0.4 }}
            >
              <Label className={`text-xs text-left flex gap-1 ml-auto`}>
                Post Comments:
                <span className="text-blue-400">
                  {forum_post.comments ? forum_post.comments.length : 0}
                </span>
              </Label>

              {forum_post.comments && forum_post.comments.map((comment, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", delay: 0.4 + (index * 0.2) }}
                >
                  <AnimatePresence mode="wait">
                    {hidden_comments.has(index) ? (
                      <motion.div
                        key="hidden"
                        variants={commentVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="flex gap-2 items-center w-full mb-2"
                      >
                        <Button variant='outline' size='sm' onClick={() => toggle_hide(index)}>
                          View Comment
                          <Eye/>
                        </Button>

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
                          original_post_author={forum_post.post.author}
                          toggle_hide={() => toggle_hide(index)}
                          on_delete={() => delete_content('forum_comment', comment.id)}
                          on_like={() => toggle_like_unlike_post('forum_comment', comment.id, comment.post_likers)}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ForumPostBlock;