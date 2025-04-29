import { FC, useEffect, useState } from "react";

import FinbyteMarkdown from "@/components/finbytemd";

import { edit_post_data, fetched_chat_post_data, fetched_comment_post_data, fetched_community_post_data, fetched_forum_post_data, post_with_comments } from "@/utils/api/interfaces";
import toast from "react-hot-toast";
import { useWallet } from "@meshsdk/react";
import PostActions from "../../input/create/post-actions";
import useThemedProps from "@/contexts/themed-props";

interface custom_props {
  forum_post?: {
    post: post_with_comments;
  };

  forum_comment?: {
    post: fetched_comment_post_data;
  };

  community_post?: {
    post: fetched_community_post_data;
  };

  chat_post?: {
    post: fetched_chat_post_data;
  }

  on_edit: (details: edit_post_data) => Promise<void>;
  reset_view: () => void;
}

const ForumPostComponentViewEdit: FC <custom_props> = ({
  forum_post, forum_comment, community_post, chat_post, on_edit, reset_view
}) => {
  const themed = useThemedProps();
  const use_wallet = useWallet();
  const [preview_post, set_preview_post] = useState(false);
  const fp_post = forum_post?.post.post.updated_post ? forum_post.post.post.updated_post : forum_post?.post.post.post;
  const fc_post = forum_comment?.post.updated_post ? forum_comment.post.updated_post : forum_comment?.post.post;
  const cp_post = community_post?.post.updated_post ? community_post.post.updated_post : community_post?.post.post;
  const c_post = chat_post?.post.updated_post ? chat_post.post.updated_post : chat_post?.post.post;

  const post_to_show = (fp_post || fc_post || cp_post || c_post) as string;

  const [post_query, set_post_query] = useState<string>(post_to_show);

  type create_post_states = "check-passed" | "check-fail" | "check-pending";
  const [query_status, set_query_status] = useState<create_post_states>('check-pending');

  const post_too_small = post_query.length < 30;
  const post_too_long  = post_query.length > 1500;

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

  useEffect(() => {
    set_query_status("check-pending");
  }, [post_query]);

  const clear_post = () => {
    set_post_query('');
  }

  const check_post = () => {
    if (post_too_small) {
      toast.error('Post is too small');
      set_query_status('check-fail');
      return;
    } else if (post_too_long) {
      toast.error('Post is too long');
      set_query_status('check-fail');
      return;
    } else {
      set_query_status("check-passed");
    }
  }

  const attempt_edit = async () => {
    if (post_too_small || post_too_long) {
      return;
    } else {
      if (!use_wallet.connected || !use_wallet.address) { return } else {
        const timestamp = Math.floor(Date.now() / 1000);
        const sending_data: edit_post_data = {
          updated_post: post_query,
          author: use_wallet.address,
          updated_timestamp: timestamp,
        }
        await on_edit(sending_data);
        reset_view();
        clear_post();
      }
    }
  }

  const toggle_preview_post = () => {
    set_preview_post(!preview_post);
  }

  return (
    <div className="flex flex-col w-full gap-1 lg:gap-2">
      {forum_post?.post && (
        <span className={`flex w-full items-center font-semibold text-blue-400 p-2 border-b ${themed['700'].border}`}>
          <span className="mx-auto text-xl">
            {forum_post.post.post.title}
          </span>
        </span>
      )}

      {preview_post ?
        <div className="flex flex-col w-full gap-0.5 p-2">
          <label className={`block text-left font-medium mb-1 ${themed['300'].text} text-xs`}>Post Preview</label>
            <div className={`p-2 lg:p-3 max-h-60 rounded-lg min-h-36 text-sm ${themed['300'].text} text-left ${themed['900'].bg} border border-blue-400/60 focus:border-blue-400 focus:outline-none ${themed.webkit_scrollbar}`}>
            <FinbyteMarkdown>
              {post_query}
            </FinbyteMarkdown>
          </div>
        </div>
        :
        <div className="flex flex-col w-full gap-0.5 p-2">
          <div className="flex justify-between items-center">
            <label className={`block text-left font-medium mb-1 ${themed['300'].text} text-xs`}>Edit Post</label>

            <span className={`text-[10px] ${themed['300'].text}`}>
              <span className={`${(post_query.length > 1500 || post_query.length < 30) ? "text-red-400" : "text-green-400"} mr-0.5`}>
                {post_query.length.toLocaleString()}
              </span>
              {'/ (30/1,500)'}
            </span>
          </div>

          <textarea
            value={post_query}
            onChange={(e) => set_post_query(e.target.value)}
            placeholder="This is my first forum post on the Finbyte platform, kudos!..."
            className={`p-2 lg:p-3 text-sm ${themed['300'].text} placeholder:${themed['500'].text} rounded-lg min-h-36 max-h-60 ${themed['900'].bg} border ${themed['700'].border} focus:border-blue-400 focus:outline-none ${themed.webkit_scrollbar}`}
          />
        </div>
      }

      <span className="px-2 pb-2">
        <PostActions
          query_status={query_status}
          finbytemd_modal={finbytemd_modal}
          emoji_modal={emoji_modal}
          clear_post={clear_post}
          check_post={check_post}
          preview_post={toggle_preview_post}
          send_post={attempt_edit}
          on_cancel={reset_view}
        />
      </span>
    </div>
  )
}

export default ForumPostComponentViewEdit;