import { FC } from "react";


import { fetched_comment_post_data, fetched_community_post_data, fetched_forum_post_data, post_with_comments } from "@/utils/api/interfaces";
import { copy_to_clipboard, format_long_string } from "@/utils/string-tools";

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
}

const ForumPostComponentViewDetails: FC <custom_props> = ({
  forum_post, forum_comment, community_post
}) => {
  const post_id = forum_post?.post.post.id || forum_comment?.post.id || community_post?.post.id;
  const author = forum_post?.post.post.author || forum_comment?.post.author || community_post?.post.author;
  const timestamp = forum_post?.post.post.timestamp || forum_comment?.post.timestamp || community_post?.post.timestamp;

  const post_likers = forum_post?.post.post.post_likers || forum_comment?.post.post_likers || community_post?.post.post_likers;
  const tip_hashes = forum_post?.post.post.tip_tx_hashes || forum_comment?.post.tip_tx_hashes || community_post?.post.tip_tx_hashes;

  /** @todo */
  const basic_post_details = [
    {title: 'ID', data: post_id, copy: post_id},
    {title: 'Author', data: post_id, copy: author},
    {title: 'Timestamp', data: post_id, copy: timestamp ?? 0},
  ];

  return (
    <div className="flex flex-col w-full gap-1 lg:gap-2 p-2">
      <div className="flex w-full">
        <h1 className="text-neutral-400 font-semibold text-sm text-left">
          Viewing Post Details
        </h1>
      </div>

      <div className='flex flex-wrap items-center gap-x-2 text-sm'>
        {basic_post_details.map((item, index) => (
          <div key={index} className="flex flex-col gap-1 p-1">
            <h1 className="text-left text-xs font-semibold text-neutral-500 underline">{item.title}</h1>

            <div title="Click to copy full data." onClick={() => copy_to_clipboard(item.copy as string)} className="cursor-copy border border-neutral-700 hover:border-blue-400/70 duration-300 px-2 py-1 rounded-lg text-center">
              {item.data}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ForumPostComponentViewDetails;