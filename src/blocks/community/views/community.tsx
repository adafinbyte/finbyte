import { FC, useEffect, useState } from "react";

import { verified_token } from "@/verified/interfaces";
import { RefreshCw } from "lucide-react";
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

interface custom_props {
  token: verified_token;
}

const CommuntiyPosts: FC <custom_props> = ({
  token
}) => {
  const use_wallet = useWallet();
  const wallet = use_wallet.wallet;

  const [refresh, set_refresh] = useState(false);

  const [community_posts, set_community_posts] = useState<fetched_community_post_data[] | undefined>();

  const get_posts = async () => {
    set_refresh(true);

    try {
      const community_posts = await fetch_community_posts(token.slug_id);
      if (community_posts) {
        set_community_posts(community_posts);
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
    get_posts();
  }, []);

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
    <div>
      <PostCreation
        post_type='community_post'
        is_connected={use_wallet.connected}
        connected_address={use_wallet.address}
        on_community_post_create={{
          post_data: toggle_create_post,
          token_slug: token.slug_id
        }}
      />
      <hr className="border-neutral-800 my-2"/>

      <div className="my-2 flex flex-wrap gap-1">
        <button onClick={get_posts} title="Refresh Feed" className="p-2 rounded-lg hover:bg-neutral-800">
          <RefreshCw size={14} className={refresh ? "animate-spin" : ""}/>
        </button>

        <span className="ml-auto text-[10px] text-neutral-400">
          Total Posts:
          <span className="ml-1 text-blue-400">
            {community_posts?.length.toLocaleString() ?? 0}
          </span>
        </span>
      </div>

      <div className="mt-2">
        {community_posts ?
          <div className="flex flex-col gap-4">
            {community_posts.map((post, index) => (
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
              />
            ))}
          </div>
          :
          <div className="flex flex-col gap-4">
            pending posts
          </div>
        }
      </div>
    </div>
  )
}

export default CommuntiyPosts;