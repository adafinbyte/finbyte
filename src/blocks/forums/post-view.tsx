import { Dispatch, FC, SetStateAction, useState } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

import { useWallet } from "@meshsdk/react";
import { checkSignature, generateNonce } from "@meshsdk/core";

import { create_forum_post_data, post_with_comments } from "@/utils/api/interfaces";
import { create_post } from "@/utils/api/push";
import { admin_addresses } from "@/utils/consts";
import { delete_post } from "@/utils/api/mod";
import ForumPost from "@/components/forums-core/post";
import PostCreation from "@/components/forums-core/input/create";
import { Clock, Heart, MessagesSquare } from "lucide-react";
import useThemedProps from "@/contexts/themed-props";

interface custom_props {
  post_data: post_with_comments[];

  tab_action: {
    state: number;
    set_state: Dispatch<SetStateAction<number>>;
  }
  
  create_action: {
    state: boolean;
    set_state: Dispatch<SetStateAction<boolean>>;
  }

  get_posts: () => Promise<void>;
}

const ForumsPostView: FC <custom_props> = ({
  post_data, tab_action, create_action, get_posts
}) => {
  const themed = useThemedProps();
  const use_wallet = useWallet();
  const wallet = use_wallet.wallet;
  
  type sort_by = 'timestamp' | 'likes' | 'comments';
  const [sorting_by, set_sorting_by] = useState<sort_by>('timestamp');

  const sorted_posts = [...post_data].sort((a, b) => {
    if (sorting_by === 'timestamp') {
      return b.post.timestamp - a.post.timestamp;
    }
    if (sorting_by === 'likes') {
      return (b.post.post_likers?.length || 0) - (a.post.post_likers?.length || 0);
    }
    if (sorting_by === 'comments') {
      return (b.comments?.length || 0) - (a.comments?.length || 0);
    }
    return 0;
  });

  const toggle_create_post = async (details: create_forum_post_data) => {
    if (!use_wallet.connected) { return; } else {
      try {
        const timestamp = Math.floor(Date.now() / 1000);
        const signing_data = `${details.author} created a post at ${details.timestamp}`;
        const nonce = generateNonce(signing_data);
        const signature = await wallet.signData(nonce, use_wallet.address);
        if (signature) {
          const is_valid_sig = await checkSignature(nonce, signature, use_wallet.address);
          if (is_valid_sig) {
            await create_post(details, 'forum_post', timestamp, use_wallet.address);
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
            await delete_post(post_id, 'forum_post', use_wallet.address, timestamp);
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

  const is_team = admin_addresses.includes(use_wallet.address);
  const get_section = () => {
    if (tab_action.state === 2) { return 'general' }
    if (tab_action.state === 3) { return 'requests' }
    if (tab_action.state === 4) { return 'chatterbox' }
    if (tab_action.state === 5) { return 'finbyte' }
    return 'general'
  }

  const on_forum_post_create = {
    post_data: toggle_create_post,
    section: get_section()
  }

  return (
    <div className="flex flex-col w-full gap-2">
      
      <AnimatePresence>
        {create_action.state && tab_action.state !== 1 && !(tab_action.state === 5 && !is_team) && (
          <motion.div
            key="create-post-form"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            layout
          >
            <PostCreation
              post_type='forum_post'
              is_connected={use_wallet.connected}
              connected_address={use_wallet.address}
              on_forum_post_create={on_forum_post_create}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div layout className="flex flex-col w-full gap-2">
        <div className={`${themed['400'].text} flex gap-1 items-center ${post_data.length <= 1 ? 'hidden' : ''}`}>
          <button title="Sort By: Timestamp" onClick={() => set_sorting_by('timestamp')} className={`p-2 inline-flex gap-2 items-center hover:${themed['800'].bg} rounded-lg`}>
            <Clock size={16} className={`${sorting_by === 'timestamp' ? 'text-blue-400' : ''}`}/>
          </button>

          <button title="Sort By: Likes" onClick={() => set_sorting_by('likes')} className={`p-2 inline-flex gap-2 items-center hover:${themed['800'].bg} rounded-lg`}>
            <Heart size={16} className={`${sorting_by === 'likes' ? 'text-blue-400' : ''}`}/>
          </button>

          <button title="Sort By: Comments" onClick={() => set_sorting_by('comments')} className={`p-2 inline-flex gap-2 items-center hover:${themed['800'].bg} rounded-lg`}>
            <MessagesSquare size={16} className={`${sorting_by === 'comments' ? 'text-blue-400' : ''}`}/>
          </button>
        </div>

      <div>
        {sorted_posts ?
          <div className="flex flex-col w-full gap-2">
            {sorted_posts.length > 0 ?
              sorted_posts.map((post, index) => (
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
                    post_type="forum_post"
                    preview={true}
                    forum_post={{
                      post: post,
                      on_delete: () => toggle_delete_post(post.post.id),
                    }}
                  />
                </motion.div>
              ))
              :
              <div className={`p-2 text-center ${themed['400'].text}`}>
                no posts to show
              </div>
            }
          </div>
          :
          <div>
            Posts Loading
          </div>
        }
      </div>
      </motion.div>
    </div>
  )
}

export default ForumsPostView;