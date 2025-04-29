import { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";

import CreatePostInputTypes from "./input-types";
import PostActions from "./post-actions";

import { create_chat_data, create_comment_post_data, create_community_post_data, create_forum_post_data } from "@/utils/api/interfaces";
import { fetch_username_from_account } from "@/utils/api/account/fetch";
import { post_type } from "@/utils/api/types";
import useThemedProps from "@/contexts/themed-props";

interface custom_props {
  post_type: post_type;
  is_connected: boolean;
  connected_address: string | undefined;

  on_forum_post_create?: {
    post_data: (details: create_forum_post_data) => Promise<void>;
    section: string;
  }

  on_community_post_create?: {
    post_data: (details: create_community_post_data) => Promise<void>;
    token_slug: string;
  }

  on_forum_comment?: {
    comment_data: (details: create_comment_post_data) => Promise<void>;
    post_id: number | null | undefined;
  }

  on_chat?: {
    chat_data: (details: create_chat_data) => Promise<void>;
  }
}

/**
 * @props
 * - post_type: 'community-post' | 'general-forum-post' | 'request-forum-post' | 'forum-comment'
 * - is_connected: boolean
 * - connected_address: string | undefined
 * - send_forum_post?: (details: create_forum_post_data) => void
 * - community_post?: {
 * -   community_post_data: (details: create_community_post_data) => void;
 * -   token_slug: string;
 * - }
 * - forum_comment?: {
 * -  forum_comment_data: (details: create_comment_post_data) => void;
 * -  post_id: number;
 * - }
 * @notes
 * - All modals working as intended.
 * - All functions working as intended.
 * - Consistent styling across all post types
 * - Works for all post types
 * @todo
 * - Make sure send post works as intended
 *   - send forum     = works
 *   - send community = unknown
 *   - send comment   = unknown
 */
const PostCreation: FC <custom_props> = ({
  post_type, is_connected, connected_address, on_forum_post_create, on_community_post_create, on_forum_comment, on_chat
}) => {
  const themed = useThemedProps();

  /** @modals */
  const [finbytemd_modal_open, set_finbytemd_modal_open] = useState(false);
  const [emoji_modal_open, set_emoji_modal_open] = useState(false);
  const finbytemd_modal = {
    state: finbytemd_modal_open,
    set_state: set_finbytemd_modal_open
  };
  const emoji_modal = {
    state: emoji_modal_open,
    set_state: set_emoji_modal_open
  };

  /** @states */
  const [preview_post, set_preview_post] = useState(false);

  type create_post_states = "check-passed" | "check-fail" | "check-pending";
  const [query_status, set_query_status] = useState<create_post_states>('check-pending');

  const [post_query_tag, set_post_query_tag] = useState('');
  const [post_query_title, set_post_query_title] = useState('');
  const [post_query_post, set_post_query_post] = useState('');

  useEffect(() => {
    clear_post();
  }, [post_type]);

  useEffect(() => {
    set_query_status("check-pending");
  }, [post_query_tag, post_query_title, post_query_post]);

  const post_tag_too_small   = post_query_tag.length < 2;
  const post_tag_too_long    = post_query_tag.length > 14;
  const post_title_too_small = post_query_title.length < 8;
  const post_title_too_long  = post_query_title.length > 50;
  const post_too_small       = post_query_post.length < 30;
  const post_too_long        = post_query_post.length > 1500;
  const comment_too_small    = post_query_post.length < 30;
  const comment_too_long     = post_query_post.length > 800;

  const post_query = {
    tag: {
      state: post_query_tag,
      set_state: set_post_query_tag
    },
    title: {
      state: post_query_title,
      set_state: set_post_query_title
    },
    post: {
      state: post_query_post,
      set_state: set_post_query_post
    },
  }

  /** @functions */
  const clear_post = () => {
    set_post_query_tag('');
    set_post_query_title('');
    set_post_query_post('');
  }

  const check_post = () => {
    if (post_type === 'forum_post') {
      if (post_query_tag && post_tag_too_small) {
        toast.error('Post tag is too small');
        return false;
      } else if (post_query_tag && post_tag_too_long) {
        toast.error('Post tag is too long');
        return false;
      } else if (post_title_too_small) {
        toast.error('Post title is too small');
        return false;
      } else if (post_title_too_long) {
        toast.error('Post title is too long');
        return false;
      } else if (post_too_small) {
        toast.error('Post is too small');
        return false;
      } else if (post_too_long) {
        toast.error('Post is too long');
        return false;
      }
    } else if (post_type === 'community_post') {
      if (post_too_small) {
        toast.error('Post is too small');
        return false;
      } else if (post_too_long) {
        toast.error('Post is too long');
        return false;
      }
    } else if (post_type === 'forum_comment') {
      if (comment_too_small) {
        toast.error('Comment is too small');
        return false;
      } else if (comment_too_long) {
        toast.error('Comment is too long');
        return false;
      }
    } else if (post_type === 'chat') {
      if (comment_too_small) {
        toast.error('Comment is too small');
        return false;
      } else if (comment_too_long) {
        toast.error('Comment is too long');
        return false;
      }
    }
  
    toast.success("Post seems good!");
    return true;
  }

  const attempt_send = async () => {
    const timestamp = Math.floor(Date.now() / 1000);
    const is_valid = check_post();

    if (!is_valid || !is_connected || !connected_address) {
      return; 
    }

    const ada_handle = await fetch_username_from_account(connected_address);

    if (on_forum_post_create && post_type === 'forum_post') {
      const sending_data: create_forum_post_data = {
        tag: post_query_tag,
        title: post_query_title,
        post: post_query_post,
        author: connected_address,
        ada_handle: ada_handle,
        timestamp: timestamp,
        section: on_forum_post_create.section,
        has_poll: on_forum_post_create.section === 'requests' ? true : false,
      }

      await on_forum_post_create.post_data(sending_data);
      clear_post();
    } else if (on_community_post_create && post_type === 'community_post') {
      const sending_data: create_community_post_data = {
        post: post_query_post,
        author: connected_address,
        ada_handle: ada_handle,
        timestamp: timestamp,
        token_slug: on_community_post_create.token_slug
      }

      await on_community_post_create.post_data(sending_data);
      clear_post();
    } else if (on_forum_comment && post_type === 'forum_comment') {
      const sending_data: create_comment_post_data = {
        post: post_query_post,
        author: connected_address,
        ada_handle: ada_handle,
        timestamp: timestamp,
        post_id: Number(on_forum_comment.post_id)
      }

      await on_forum_comment.comment_data(sending_data);
      clear_post();
    } else if (on_chat && post_type === 'chat') {
      const sending_data: create_chat_data = {
        post: post_query_post,
        author: connected_address,
        ada_handle: ada_handle,
        timestamp: timestamp,
      }

      await on_chat.chat_data(sending_data);
      clear_post();
    }
  }

  const toggle_preview_post = () => {
    set_preview_post(!preview_post);
  }

  return (
    <>
      <div className="relative">
        <div className={`${!is_connected ? 'blur-sm' : ''} px-2 flex flex-col w-full gap-2`}>
          <CreatePostInputTypes
            post_type={post_type}
            post_query={post_query}
            preview_post={preview_post}
            section={on_forum_post_create?.section}
          />

          <PostActions
            query_status={query_status}
            finbytemd_modal={finbytemd_modal}
            emoji_modal={emoji_modal}
            clear_post={clear_post}
            check_post={check_post}
            preview_post={toggle_preview_post}
            send_post={attempt_send}
          />
        </div>

        {!is_connected && (
          <div className="absolute inset-0 flex items-center justify-center bg-opacity-50 z-2">
            <div className={`cursor-default ${themed['900'].bg} border ${themed['700'].border} p-2 px-4 rounded-lg shadow-lg ${themed['950'].shadow} text-center`}>
              <p className={`${themed['300'].text}`}>Please connect your wallet.</p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default PostCreation;