import { Dispatch, FC, SetStateAction } from "react";

import ForumPostComponentViewPost from "./post";

import { edit_post_data, fetched_chat_post_data, fetched_comment_post_data, fetched_community_post_data, fetched_forum_post_data, post_with_comments } from "@/utils/api/interfaces";
import ForumPostComponentViewEdit from "./edit";
import ForumPostComponentViewDetails from "./details";

interface custom_props {
  current_view: {
    state: 'post' | 'edit' | 'details';
    set_state: Dispatch<SetStateAction<'post' | 'edit' | 'details'>>;
  }

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

  chat_post?: {
    post: fetched_chat_post_data;
  }

  show_original: {
    state: boolean;
    set_state: Dispatch<SetStateAction<boolean>>;
  }

  on_edit: (details: edit_post_data) => Promise<void>;
}

const ForumPostComponentView: FC <custom_props> = ({
  current_view, preview, forum_post, forum_comment, community_post, chat_post, show_original, on_edit
}) => {

  return (
    <div className="">
      {current_view.state === 'post' && (
        <ForumPostComponentViewPost
          preview={preview}
          forum_post={forum_post}
          forum_comment={forum_comment}
          community_post={community_post}
          chat_post={chat_post}
          show_original={show_original}
        />
      )}

      {current_view.state === 'edit' && (
        <ForumPostComponentViewEdit
          forum_post={forum_post}
          forum_comment={forum_comment}
          community_post={community_post}
          chat_post={chat_post}
          on_edit={on_edit}
          reset_view={() => current_view.set_state('post')}
        />
      )}

      {current_view.state === 'details' && (
        <ForumPostComponentViewDetails
          forum_post={forum_post}
          forum_comment={forum_comment}
          community_post={community_post}
          chat_post={chat_post}
        />
      )}
    </div>
  )
}

export default ForumPostComponentView;