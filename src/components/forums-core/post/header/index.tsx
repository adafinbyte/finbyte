import { Dispatch, FC, ReactNode, SetStateAction, useState } from "react";

import { fetched_comment_post_data, fetched_community_post_data, post_with_comments } from "@/utils/api/interfaces";
import { post_type } from "@/utils/api/types";
import { format_long_string, format_unix } from "@/utils/string-tools";
import ForumPostHeaderOptions from "./options";
import FormatAddress from "@/components/format-address";
import UserAvatar from "@/components/user-avatar";

interface custom_props {
  post_type: post_type;
  preview: boolean;

  forum_post?: {
    post: post_with_comments;
  };

  forum_comment?: {
    post: fetched_comment_post_data;
  };

  community_post?: {
    post: fetched_community_post_data;
  };

  modals: {
    view_likers: {
      state: boolean;
      set_state: Dispatch<SetStateAction<boolean>>;
    };
    view_repliers: {
      state: boolean;
      set_state: Dispatch<SetStateAction<boolean>>;
    };
    view_tip_hashes: {
      state: boolean;
      set_state: Dispatch<SetStateAction<boolean>>;
    };
    delete: {
      state: boolean;
      set_state: Dispatch<SetStateAction<boolean>>;
    };
    share: {
      state: boolean;
      set_state: Dispatch<SetStateAction<boolean>>;
    };
  };

  viewing: {
    state: 'post' | 'edit' | 'details';
    set_state: Dispatch<SetStateAction<'post' | 'edit' | 'details'>>;
  };

  show_original: {
    state: boolean;
    set_state: Dispatch<SetStateAction<boolean>>;
  };
}

const ForumPostHeader: FC <custom_props> = ({
  post_type, preview, forum_post, forum_comment, community_post, modals, viewing, show_original
}) => {
  const [show_address, set_show_address] = useState(false);
  const [show_date, set_show_date] = useState(false);

  const adahandle = forum_post?.post.post.ada_handle || forum_comment?.post.ada_handle || community_post?.post.ada_handle;
  const address = (forum_post?.post.post.author || forum_comment?.post.author || community_post?.post.author) ?? '';

  const post_ts = forum_post?.post.post.timestamp || forum_comment?.post.timestamp || community_post?.post.timestamp;
  const updated_post_ts = forum_post?.post.post.updated_timestamp || forum_comment?.post.updated_timestamp || community_post?.post.updated_timestamp;

  const post_id = forum_post?.post.post.id || forum_comment?.post.id || community_post?.post.id || 0;

  return (
    <div className="flex items-center w-full gap-2 text-sm">
      <UserAvatar address={address as string} className="size-6"/>

      <button onClick={() => set_show_address(!show_address)} className="px-2 py-1 inline-flex items-center gap-x-1 hover:bg-neutral-800 active:bg-neutral-800/60 rounded-lg">
        <FormatAddress address={show_address ? address : adahandle ? adahandle : address as string}/>
      </button>

      <div className="ml-auto inline-flex items-center gap-2">
        <button onClick={() => set_show_date(!show_date)} className="px-2 py-1 inline-flex items-center gap-x-1 hover:bg-neutral-800 active:bg-neutral-800/60 rounded-lg">
          {show_date ?
            format_unix(Number(updated_post_ts ? updated_post_ts : post_ts)).date
            :
            format_unix(Number(updated_post_ts ? updated_post_ts : post_ts)).time_ago
          }
        </button>

        <ForumPostHeaderOptions
          post_type={post_type}
          preview={preview}
          post_author={address}
          is_edited={updated_post_ts ? true : false}
          post_id={post_id}
          modals={modals}
          viewing={viewing}
          show_original={show_original}
        />
      </div>
    </div>
  )
}

export default ForumPostHeader;