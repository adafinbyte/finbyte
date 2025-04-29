import { FC, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { verified_token } from "@/verified/interfaces";
import { FilePlus, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { create_community_post_data, edit_post_data, fetched_community_post_data } from "@/utils/api/interfaces";
import { fetch_community_posts } from "@/utils/api/fetch";
import PostCreation from "@/components/forums-core/input/create";
import { useWallet } from "@meshsdk/react";
import { checkSignature, generateNonce } from "@meshsdk/core";
import { create_post, edit_post, like_unlike_post } from "@/utils/api/push";
import ForumPost from "@/components/forums-core/post";
import { format_long_string } from "@/utils/string-tools";
import { delete_post } from "@/utils/api/mod";
import useThemedProps from "@/contexts/themed-props";

interface custom_props {
  token: verified_token;
  community_posts: fetched_community_post_data[] | undefined;
  get_posts: () => Promise<void>;
  refresh: boolean;
}

const CommunityPosts: FC <custom_props> = ({
  token, community_posts, get_posts, refresh
}) => {
  const themed = useThemedProps();
  const use_wallet = useWallet();
  const wallet = use_wallet.wallet;

  const [show_create, set_show_create] = useState(false);

  const toggle_create_post = async (details: create_community_post_data) => {
    if (!use_wallet.connected) { return; } else {
      try {
        const timestamp = Math.floor(Date.now() / 1000);
        const signing_data = `${details.author} created a post at ${details.timestamp}`;
        const nonce = generateNonce(signing_data);
        const signature = await wallet.signData(nonce, use_wallet.address);
        if (signature) {
          const is_valid_sig = await checkSignature(nonce, signature, use_wallet.address);
          if (is_valid_sig) {
            await create_post(details, 'community_post', timestamp, use_wallet.address);
            await get_posts();
          } else {
            toast.error('Signature verification failed! Whoops.');
            return;
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message)
        } else {
          throw error;
        }
      }
    }
  }

  const toggle_delete_post = async (post_id: number): Promise<void> => {
    if (!use_wallet.connected) {
      return;
    } else {
      try {
        const timestamp = Math.floor(Date.now() / 1000);
        const signing_data = `This post is about to be removed by: ${use_wallet.address} at ${timestamp}.`;
        const nonce = generateNonce(signing_data);
        const signature = await wallet.signData(nonce, use_wallet.address);
        if (signature) {
          const is_valid_sig = await checkSignature(nonce, signature, use_wallet.address);
          if (is_valid_sig) {
            await delete_post(post_id, 'community_post', use_wallet.address, timestamp);
            await get_posts();
          } else {
            toast.error('Signature verification failed! Whoops.');
            return;
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message)
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
      const now = new Date();
      const timestamp = Math.floor(now.getTime() / 1000);
      let like_data: string[];
  
      if (post_likers?.includes(use_wallet.address)) {
        like_data = post_likers.filter(addr => addr !== use_wallet.address);
      } else {
        like_data = post_likers ? [...post_likers, use_wallet.address] : [use_wallet.address];
      }

      const signing_data = `${format_long_string(use_wallet.address)} ${post_likers?.includes(use_wallet.address) ? 'removed a like' : 'liked a post'} ${timestamp}.`;
      const nonce = generateNonce(signing_data);
      const signature = await wallet.signData(nonce, use_wallet.address);

      if (signature) {
        const is_valid = await checkSignature(nonce, signature, use_wallet.address);
        if (is_valid) {
          await like_unlike_post(like_data, post_id, timestamp, use_wallet.address, 'community_post', post_likers?.includes(use_wallet.address) ? 'unlike' : 'like');
          await get_posts();
        } else {
          toast.error('Signature verification failed! Whoops.');
          return;
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        throw error;
      }
    }
  };

  const toggle_edit_content = async (
    details: edit_post_data,
    post_id: number,
  ) => {
    if (!use_wallet.connected) { return; } else {
      try {
        const signing_data = `${format_long_string(details.author)} is editing their post at ${details.updated_timestamp}`;
        const nonce = generateNonce(signing_data);
        const signature = await wallet.signData(nonce, use_wallet.address);
        if (signature) {
          const is_valid_sig = await checkSignature(nonce, signature, use_wallet.address);
          if (is_valid_sig) {
            await edit_post(post_id, use_wallet.address, details.updated_post, details.updated_timestamp, 'community_post');
            await get_posts();
          } else {
            toast.error('Signature verification failed! Whoops.');
            return;
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message)
        } else {
          throw error;
        }
      }
    }
  }

  return (
    <div className={`w-full flex flex-col gap-2 h-screen ${themed.webkit_scrollbar}`}>
      <div className={`flex items-center flex-wrap gap-1 ${themed['300'].text}`}>
        <button onClick={() => set_show_create(!show_create)} title="Create Post" className={`p-2 rounded-lg ${themed.effects.transparent_button.hover}`}>
          <FilePlus size={14}/>
        </button>

        <button onClick={get_posts} title="Refresh Feed" className={`p-2 rounded-lg ${themed.effects.transparent_button.hover}`}>
          <RefreshCw size={14} className={refresh ? "animate-spin" : ""}/>
        </button>

        <span className={`ml-auto text-[10px] ${themed['400'].text}`}>
          Total Posts:
          <span className="ml-1 text-blue-400">
            {community_posts?.length.toLocaleString() ?? 0}
          </span>
        </span>
      </div>

      <hr className={`${themed['700'].border}`}/>

      <AnimatePresence>
        {show_create && (
          <motion.div
            key="create-post-form"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            layout
          >
            <PostCreation
              post_type='community_post'
              is_connected={use_wallet.connected}
              connected_address={use_wallet.address}
              on_community_post_create={{
                post_data: toggle_create_post,
                token_slug: token.slug_id
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div layout className="mt-2">
        {community_posts ? (
          <div className="flex flex-col gap-4">
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
              <ForumPost
                key={index}
                post_type='community_post'
                preview={false}
                community_post={{
                  post: post,
                  on_delete: () => toggle_delete_post(post.id as number),
                  on_edit: toggle_edit_content,
                  on_like_unlike: () => toggle_like_unlike_post(post.id as number, post.post_likers ?? [])
                }}
              /></motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">pending posts</div>
        )}
      </motion.div>
    </div>
  )
}

export default CommunityPosts;
