import { fetch_forum_post_with_comments } from "@/utils/api/fetch";
import { motion, AnimatePresence } from "framer-motion";
import { create_comment_post_data, edit_post_data, post_with_comments } from "@/utils/api/interfaces";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import ForumPostSidebar from "./sidebar";
import { useWallet } from "@meshsdk/react";
import { format_long_string } from "@/utils/string-tools";
import { checkSignature, generateNonce } from "@meshsdk/core";
import { create_post, edit_post, like_unlike_post } from "@/utils/api/push";
import { delete_post } from "@/utils/api/mod";
import { post_type } from "@/utils/api/types";
import { author_data, fetch_author_data } from "@/utils/api/account/fetch";
import ForumPost from "@/components/forums-core/post";
import PostCreation from "@/components/forums-core/input/create";
import ShareModal from "@/components/modals/share";
import DeleteModal from "@/components/modals/delete";
import LikeModal from "@/components/modals/like";
import useThemedProps from "@/contexts/themed-props";

const ForumPostBlock: FC = () => {
  const router = useRouter();
  const themed = useThemedProps();
  const use_wallet = useWallet();
  const wallet = use_wallet.wallet;

  const [post, set_post] = useState<post_with_comments | null>(null);
  const [author_data, set_author_data] = useState<author_data | null>(null);
  const [refresh, set_refresh] = useState(false);
  const [hidden_comments, set_hidden_comments] = useState<Set<number>>(new Set());
  const [show_create_post, set_show_create_post] = useState<boolean>(false);

  const fetch_post = async (post_id: number) => {
    set_refresh(true);

    try {
      const post = await fetch_forum_post_with_comments(post_id);
      if (!post) {
        router.push('/');
      } else {
        set_post(prev => ({
          ...post,
          comments: post.comments ?? prev?.comments ?? []
        }));

        const author = await fetch_author_data(post.post.author);
        if (author) {
          set_author_data(author);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        throw error;
      }
    }
  
    set_refresh(false);
  }

  useEffect(() => {
    const path_segments = router.asPath.split('/');
    const post_id = path_segments[path_segments.length - 1];

    if (isNaN(Number(post_id))) {
      return;
    }

    fetch_post(Number(post_id));
  }, [router.asPath]);

  const [like_post_modal_open, set_like_post_modal_open] = useState(false);
  const [share_post_modal_open, set_share_post_modal_open] = useState(false);  
  const modals = {
    like: { state: like_post_modal_open, set_state: set_like_post_modal_open },
    share: { state: share_post_modal_open, set_state: set_share_post_modal_open },
  }

  const toggle_like_unlike_post = async (
    type: 'forum_post' | 'forum_comment' | 'community_post',
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
          await like_unlike_post(like_data, post_id, timestamp, use_wallet.address, type, post_likers?.includes(use_wallet.address) ? 'unlike' : 'like');
          await fetch_post(post?.post.id as number);
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

  const create_comment = async (details: create_comment_post_data) => {
    if (!use_wallet.connected) { return; } else {
      try {
        const now = new Date();
        const timestamp = Math.floor(now.getTime() / 1000);
        const signing_data = `${format_long_string(details.author)} created a comment at ${details.timestamp} on post: ${details.post_id}`;
        const nonce = generateNonce(signing_data);
        const signature = await wallet.signData(nonce, use_wallet.address);
        if (signature) {
          const is_valid_sig = await checkSignature(nonce, signature, use_wallet.address);
          if (is_valid_sig) {
            await create_post(details, 'forum_comment', timestamp, use_wallet.address);
            await fetch_post(post?.post.id as number);
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

  const edit_content = async (
    type: post_type,
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
            await edit_post(post_id, use_wallet.address, details.updated_post, details.updated_timestamp, type);
            await fetch_post(post?.post.id as number);
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

  const delete_content = async (
    post_id: number,
    post_type: post_type
  ): Promise<void> => {
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
            await delete_post(post_id, post_type, use_wallet.address, timestamp);
            await fetch_post(post?.post.id as number);
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

  return post ? (
    <>
      <div className="lg:px-20 p-4 grid lg:grid-cols-5 gap-2 lg:mt-10" style={{ placeItems: "start"}}>
        <ForumPostSidebar
          post={post.post}
          refresh_post={() => fetch_post(post.post.id)}
          refresh_status={refresh}
          author_data={author_data}
          modals={modals}
        />

        <div className="lg:col-span-4 border border-transparent w-full flex flex-col gap-2">
          <ForumPost
            preview={false}
            post_type='forum_post'
            forum_post={{
              post: post,
              on_edit: edit_content,
              on_delete: () => delete_content(post.post.id, 'forum_post'),
              on_like_unlike: () => toggle_like_unlike_post('forum_post', post.post.id, post.post.post_likers)
            }}
            show_create={{
              state: show_create_post,
              set_state: set_show_create_post
            }}
          />

          <AnimatePresence>
            {show_create_post && (
              <motion.div
                key="create-post-form"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ height: 0, opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                layout
              >
                <PostCreation
                  post_type='forum_comment'
                  is_connected={use_wallet.connected}
                  connected_address={use_wallet.address}
                  on_forum_comment={{
                    post_id: post.post.id,
                    comment_data: create_comment
                  }}
                />
            </motion.div>
            )}
          </AnimatePresence>

          <motion.div layout className="flex flex-col w-full gap-2">
          <span className={`text-[10px] ${themed['500'].text} text-left flex gap-2 ml-auto`}>
            Post Comments:
            <span className="text-blue-400">
              {post.comments ? post.comments.length : 0}
            </span>
          </span>

          {post.comments && post.comments.map((comment, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                delay: index * 0.2,
              }}
            >
            <div className={`flex gap-x-2 pb-2 ${hidden_comments.has(index) ? 'items-center' : ''}`}>
              <button title="Hide Comment." onClick={() => toggle_hide(index)} className={`hover:${themed['900'].bg} rounded-lg relative last:after:hidden after:absolute after:top-2 after:bottom-2 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-blue-400/60`}>
                <div className="relative z-10 size-7 flex justify-center items-center">
                  <div className="size-2 rounded-full bg-blue-400/60"></div>
                </div>
              </button>

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
                    <h1 className={`font-bold italic ${themed['500'].text} text-sm`}>
                      This comment has been hidden.
                    </h1>
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
                    <ForumPost
                      preview={false}
                      post_type='forum_comment'
                      forum_comment={{
                        post: comment,
                        on_edit: edit_content,
                        on_delete: () => delete_content(comment.id, 'forum_comment'),
                        on_like_unlike: () => toggle_like_unlike_post('forum_comment', comment.id, comment.post_likers)
                      }}
                    />
                  </motion.div>
                )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}</motion.div>
        </div>
      </div>

      {/** @todo change for real link */}
      <ShareModal is_modal_open={share_post_modal_open} close_modal={() => set_share_post_modal_open(false)} post_as_link={'/forums/' + post.post.id}/>
      <LikeModal is_modal_open={like_post_modal_open} close_modal={() => set_like_post_modal_open(false)} is_liker={post.post.post_likers?.includes(use_wallet.address) ?? false} on_like_unlike={() => toggle_like_unlike_post('forum_post', post.post.id, post.post.post_likers)}/>
    </>
  ) : (
    <div>
      Post Loading
    </div>
  )
}
export default ForumPostBlock;