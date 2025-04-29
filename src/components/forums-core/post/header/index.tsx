import { Dispatch, FC, ReactNode, SetStateAction, useState } from "react";

import { fetched_comment_post_data, fetched_community_post_data, post_with_comments } from "@/utils/api/interfaces";
import { post_type } from "@/utils/api/types";
import { format_long_string, format_unix } from "@/utils/string-tools";
import ForumPostHeaderOptions from "./options";
import FormatAddress from "@/components/format-address";
import UserAvatar from "@/components/user-avatar";
import { HeartHandshake } from "lucide-react";
import { useWallet } from "@meshsdk/react";
import useThemedProps from "@/contexts/themed-props";

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

  post_likers: string[];
}

const ForumPostHeader: FC <custom_props> = ({
  post_type, preview, forum_post, forum_comment, community_post, modals, viewing, show_original, post_likers
}) => {
  const use_wallet = useWallet();
  const themed = useThemedProps();
  const [show_address, set_show_address] = useState(false);
  const [show_date, set_show_date] = useState(false);

  const adahandle = forum_post?.post.post.ada_handle || forum_comment?.post.ada_handle || community_post?.post.ada_handle;
  const address = (forum_post?.post.post.author || forum_comment?.post.author || community_post?.post.author) ?? '';

  const post_ts = forum_post?.post.post.timestamp || forum_comment?.post.timestamp || community_post?.post.timestamp;
  const updated_post_ts = forum_post?.post.post.updated_timestamp || forum_comment?.post.updated_timestamp || community_post?.post.updated_timestamp;

  const post_id = forum_post?.post.post.id || forum_comment?.post.id || community_post?.post.id || 0;

  return (
    <div className="flex items-center w-full gap-2 text-sm p-2 lg:p-4">
      <UserAvatar address={address as string} className="size-8 lg:size-10"/>

      <div className="flex flex-col justify-center text-left">
        <FormatAddress className="cursor-pointer text-base" onClick={() => set_show_address(!show_address)} address={show_address ? address : adahandle ? adahandle : address as string}/>

        <span className={`text-xs ${themed['400'].text}`}>
          {show_date ?
            format_unix(Number(updated_post_ts ? updated_post_ts : post_ts)).date
            :
            format_unix(Number(updated_post_ts ? updated_post_ts : post_ts)).time_ago
          }
        </span>
      </div>

      <div className="ml-auto inline-flex items-center gap-1">
        <button onClick={() => modals.view_likers.set_state(true)} className={`inline-flex items-center gap-2 text-xs rounded-lg p-2 ${themed.effects.transparent_button.hover}`}>
          <HeartHandshake className={`${post_likers.includes(use_wallet.address) ? 'text-rose-400' : ''} size-4`}/>
          <span className="text-sm">
            {post_likers.length.toLocaleString()}
          </span>
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
          toggle_timestamp={{
            state: show_date,
            set_state: set_show_date
          }}
        />
      </div>
    </div>
  )
}

export default ForumPostHeader;