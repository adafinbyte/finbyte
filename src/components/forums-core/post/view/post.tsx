import { Dispatch, FC, SetStateAction } from "react";

import FinbyteMarkdown from "@/components/finbytemd";

import { fetched_comment_post_data, fetched_community_post_data, fetched_forum_post_data, post_with_comments } from "@/utils/api/interfaces";
import { capitalize_first_letter } from "@/utils/string-tools";

interface custom_props {
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

  show_original: {
    state: boolean;
    set_state: Dispatch<SetStateAction<boolean>>;
  }
}

const ForumPostComponentViewPost: FC <custom_props> = ({
  preview, forum_post, forum_comment, community_post, show_original
}) => {
  const fp_post = forum_post?.post.post.updated_post ? forum_post.post.post.updated_post : forum_post?.post.post.post;
  const fc_post = forum_comment?.post.updated_post ? forum_comment.post.updated_post : forum_comment?.post.post;
  const cp_post = community_post?.post.updated_post ? community_post.post.updated_post : community_post?.post.post;

  const post_to_show = (fp_post || fc_post || cp_post) as string;

  const original_post = forum_post?.post.post.post || forum_comment?.post.post || community_post?.post.post;
  const edited_post = forum_post?.post.post.updated_post || forum_comment?.post.updated_post || community_post?.post.updated_post;

  return (
    <div className="flex flex-col w-full gap-1 lg:gap-2">
      <span className="flex w-full items-center font-semibold text-blue-400">
        {fp_post && (
          preview ?
            <span className="text-lg">
              {forum_post?.post.post.title}
            </span>
          :
            <span className="mx-auto text-xl">
              {forum_post?.post.post.title}
            </span>
          )
        }
      </span>

      <div className={`text-left flex flex-col w-full gap-1 break-normal ${preview ? 'text-sm p-2 max-h-20 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:bg-neutral-500' : ''}`}>
        {preview ?
          <FinbyteMarkdown>
            {post_to_show.length > 120 ? post_to_show.substring(0, 120) + "..." : post_to_show}
          </FinbyteMarkdown>
          :
          <FinbyteMarkdown>
            {show_original.state ? original_post : post_to_show}
          </FinbyteMarkdown>
        }
      </div>
    </div>
  )
}

export default ForumPostComponentViewPost;