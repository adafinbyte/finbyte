import { Button } from "@/components/ui/button";
import { community_post_data, create_comment_post_data, create_community_post_data } from "@/utils/api/interfaces";
import { create_post, like_unlike_post } from "@/utils/api/forums/push";
import { curated_token } from "@/verified/interfaces";
import { checkSignature, generateNonce } from "@meshsdk/core";
import { useWallet } from "@meshsdk/react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Plus, RefreshCw, VerifiedIcon } from "lucide-react";
import { FC, useState } from "react";
import CreateCommentComponent from "../forums/post-block/actions/create-comment";
import { BorderBeam } from "@/components/ui/border-beam";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import UserAvatar from "@/components/user-avatar";
import { Badge } from "@/components/ui/badge";
import { format_long_string, format_unix } from "@/utils/string-tools";
import PostOptionsButton from "../forums/post-block/actions/post-options";
import FinbyteMarkdown from "@/components/finbytemd";
import { delete_post } from "@/utils/api/mod";

interface custom_props {
  token: curated_token;
  community_posts: community_post_data[];
  refresh_data: () => Promise<void>;
  refreshing: boolean;
}

const TokenCommunity: FC <custom_props> = ({
  token, community_posts, refresh_data, refreshing
}) => {
  const { address, connected, wallet } = useWallet();

  const [show_create, set_show_create] = useState(false);

  const [current_view, set_current_view] = useState<'post' | 'edit'>('post');
  const [show_alternative_timestamp, set_show_alternative_timestamp] = useState(false);
  const [show_original_post, set_show_original_post] = useState<{ [postId: string]: boolean }>({});

  const toggle_original_post = (post_id: number, is_updated: boolean) => {
    set_show_original_post(prev => ({
      ...prev,
      [post_id]: is_updated ? false : !prev[post_id],
    }));
  };

  const toggle_edit_view = () => set_current_view(current_view === 'edit' ? 'post' : 'edit')
  const toggle_timestamp = () => set_show_alternative_timestamp(!show_alternative_timestamp);

  const [share_post_modal_open, set_share_post_modal_open] = useState(false);
  const [view_likers_modal_open, set_view_likers_modal_open] = useState(false);
  const [view_repliers_modal_open, set_view_repliers_modal_open] = useState(false);
  const [delete_post_modal_open, set_delete_post_modal_open] = useState(false);
  const [like_post_modal_open, set_like_post_modal_open] = useState(false);

  const toggle_create_post = async (creation: create_community_post_data | create_comment_post_data) => {
    const details = creation as create_community_post_data;
    if (!connected) { return; } else {
      try {
        const timestamp = Math.floor(Date.now() / 1000);
        const signing_data = `${details.author} created a post at ${details.timestamp}`;
        const nonce = generateNonce(signing_data);
        const signature = await wallet.signData(nonce, address);
        if (signature) {
          const is_valid_sig = await checkSignature(nonce, signature, address);
          if (is_valid_sig) {
            await create_post(details, 'community_post', timestamp, address);
            await refresh_data();
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
  
  const toggle_delete_post = async (post_id: number): Promise<void> => {
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
            await delete_post(post_id, 'community_post', address, timestamp);
            await refresh_data();
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

  const toggle_like_unlike_post = async (
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

      const signing_data = `${address} ${post_likers?.includes(address) ? 'removed a like' : 'liked a post'} ${timestamp}.`;
      const nonce = generateNonce(signing_data);
      const signature = await wallet.signData(nonce, address);

      if (signature) {
        const is_valid = await checkSignature(nonce, signature, address);
        if (is_valid) {
          await like_unlike_post(like_data, post_id, timestamp, address, 'community_post', post_likers?.includes(address) ? 'unlike' : 'like');
          await refresh_data();
        } else {
          //toast.error('Signature verification failed! Whoops.');
          return;
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        //toast.error(error.message);
      } else {
        throw error;
      }
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">The {token.name} Community Board</h1>
          <p className="text-muted-foreground mt-1 md:pr-12">
            Join the conversation, ask questions, share your knowledge, and connect with innovators shaping the future of finance.
          </p>
        </div>

        <div className="flex gap-3">
          <Button size={'sm'} variant={'outline'} onClick={refresh_data}>
            <RefreshCw size={12} className={refreshing ? "animate-spin" : ""}/>
          </Button>
          <Button disabled={!connected} onClick={() => set_show_create(!show_create)}>
            <Plus />
            New Post
          </Button>
        </div>
      </div>
      
      <AnimatePresence>
        {show_create && (
          <motion.div
            key="create-comment"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            layout
          >
            <CreateCommentComponent
              on_create={toggle_create_post}
              close_create={() => set_show_create(false)}
              token_slug={token.slug_id}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div layout className="mt-2">
        {community_posts ? (
          <div className="grid lg:grid-cols-2 gap-2">
            {community_posts.map((post, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  delay: index * 0.2,
                }}
              >
                
    <div
      className={cn(
        "w-full p-1.5 rounded-2xl relative isolate overflow-hidden",
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
          "relative"
        )}
      >
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
        <div className="flex gap-4 items-center relative">
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
                  <span className="inline-flex items-center gap-2">
                    <Badge className="text-xs cursor-default" variant='secondary'>OP</Badge>
                    <span className="font-semibold text-black dark:text-white/90 hover:underline cursor-pointer">
                      {format_long_string(post.author)}
                    </span>
                  </span>

                  {post.user?.account_data ? true : false && (
                    <VerifiedIcon className="h-4 w-4 text-blue-400" />
                  )}
                </div>

                  {post.user?.account_data?.ada_handle && (
                    <span className="text-black dark:text-white/60 text-sm inline-flex items-center">
                      <svg className="size-3 inline-block" viewBox="0 0 190 245" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M59.04 18.432c0-4.416 3.648-8.544 10.944-12.384C77.28 2.016 86.88 0 98.784 0 108 0 113.952 1.92 116.64 5.76c1.92 2.688 2.88 5.184 2.88 7.488v8.64c21.696 2.304 36.768 6.336 45.216 12.096 3.456 2.304 5.184 4.512 5.184 6.624 0 9.984-2.4 20.736-7.2 32.256-4.608 11.52-9.12 17.28-13.536 17.28-.768 0-3.264-.864-7.488-2.592-12.672-5.568-23.232-8.352-31.68-8.352-8.256 0-13.92.768-16.992 2.304-2.88 1.536-4.32 3.936-4.32 7.2 0 3.072 2.112 5.472 6.336 7.2 4.224 1.728 9.408 3.264 15.552 4.608 6.336 1.152 13.152 3.168 20.448 6.048 7.488 2.88 14.4 6.336 20.736 10.368s11.616 10.08 15.84 18.144c4.224 7.872 6.336 15.936 6.336 24.192s-.768 15.072-2.304 20.448c-1.536 5.376-4.224 10.944-8.064 16.704-3.648 5.76-9.312 10.944-16.992 15.552-7.488 4.416-16.512 7.68-27.072 9.792v4.608c0 4.416-3.648 8.544-10.944 12.384-7.296 4.032-16.896 6.048-28.8 6.048-9.216 0-15.168-1.92-17.856-5.76-1.92-2.688-2.88-5.184-2.88-7.488v-8.64c-12.48-1.152-23.328-2.976-32.544-5.472C8.832 212.64 0 207.456 0 201.888 0 191.136 1.536 180 4.608 168.48c3.072-11.712 6.72-17.568 10.944-17.568.768 0 8.736 2.592 23.904 7.776 15.168 5.184 26.592 7.776 34.272 7.776s12.672-.768 14.976-2.304c2.304-1.728 3.456-4.128 3.456-7.2s-2.112-5.664-6.336-7.776c-4.224-2.304-9.504-4.128-15.84-5.472-6.336-1.344-13.248-3.456-20.736-6.336-7.296-2.88-14.112-6.24-20.448-10.08s-11.616-9.504-15.84-16.992c-4.224-7.488-6.336-16.224-6.336-26.208 0-35.328 17.472-55.968 52.416-61.92v-3.744z" fill="#0CD15B"></path></svg>
                      {post.user?.account_data?.ada_handle?.toString().slice(1)}
                    </span>
                  )}
                </div>

                <div className="p-1 flex items-center justify-center">
                  <PostOptionsButton
                    post_type='community_post'
                    current_view={current_view}
                    showing_original_post={show_original_post[post.id]}
                    is_edited={post.updated_post ? true : false}
                    post_author={post.author}
                    toggle_edit={toggle_edit_view}
                    toggle_original_post={() => toggle_original_post(post.id, !!post.updated_post)}
                    toggle_timestamp={toggle_timestamp}
                    modal_toggles={{
                      view_likers: () => set_view_likers_modal_open(true),
                      view_delete_post: () => set_delete_post_modal_open(true)
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <hr className="border-black/10 dark:border-white/10 my-4"/>

          <div className="relative">
            <FinbyteMarkdown>
              {post.post}
            </FinbyteMarkdown>

            <span className="pt-2 text-black dark:text-white/50 text-sm mt-2 block flex w-full justify-between">
              {show_alternative_timestamp ? format_unix(post.timestamp).date : format_unix(post.timestamp).time_ago}
            </span>

            <hr className='border-black/10 dark:border-white/10 my-4'/>

            <div className="inline-flex gap-2">
              <Button size={'sm'} disabled={!connected} variant='ghost' onClick={() => set_like_post_modal_open(true)}>
                <Heart className={`${post.post_likers?.includes(address) ? 'text-rose-400 fill-rose-400' : ''}`}/>
                {post.post_likers?.includes(address) ? 'Unlike Post' : 'Like Post'}
              </Button>

            </div>
          </div>
        </div>
      <BorderBeam duration={40}/>
    </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">pending posts</div>
        )}
      </motion.div>
    </div>
  )
}

export default TokenCommunity;