import { FC } from "react";

import { fetched_chat_post_data, fetched_comment_post_data, fetched_community_post_data, post_with_comments } from "@/utils/api/interfaces";
import { copy_to_clipboard } from "@/utils/string-tools";
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
}

const ForumPostComponentViewDetails: FC<custom_props> = ({
  forum_post,
  forum_comment,
  community_post,
  chat_post
}) => {
  const themed = useThemedProps();

  const post_id =
    forum_post?.post.post.id ||
    forum_comment?.post.id ||
    community_post?.post.id ||
    chat_post?.post.id;
  const author =
    forum_post?.post.post.author ||
    forum_comment?.post.author ||
    community_post?.post.author ||
    chat_post?.post.author;
  const timestamp =
    forum_post?.post.post.timestamp ||
    forum_comment?.post.timestamp ||
    community_post?.post.timestamp ||
    chat_post?.post.timestamp;

  const basic_post_details = [
    { title: "ID", data: '#' + post_id, copy: post_id },
    { title: "Timestamp", data: timestamp, copy: timestamp ?? 0 },
    { title: "Author", data: author, copy: author },
  ];

  const forum_post_details = [
    ...basic_post_details,
    {
      title: "Post Title",
      data: forum_post?.post.post.title ?? "",
      copy: forum_post?.post.post.title ?? "",
    },
    {
      title: "Original Post",
      data: forum_post?.post.post.post ?? "",
      copy: forum_post?.post.post.post ?? "",
    },
    ...(forum_post?.post.post.tag
      ? [
          {
            title: "Post Tag",
            data: forum_post.post.post.tag,
            copy: forum_post.post.post.tag,
          },
        ]
      : []),
    ...(forum_post?.post.post.updated_timestamp &&
    forum_post?.post.post.updated_post
      ? [
          {
            title: "Edited Timestamp",
            data: forum_post.post.post.updated_timestamp,
            copy: forum_post.post.post.updated_timestamp,
          },
          {
            title: "Edited Post",
            data: forum_post.post.post.updated_post,
            copy: forum_post.post.post.updated_post,
          },
        ]
      : []),
  ];

  const forum_comment_details = [
    ...basic_post_details,
    {
      title: "Original Comment",
      data: forum_comment?.post.post ?? "",
      copy: forum_comment?.post.post ?? "",
    },
    ...(forum_comment?.post.updated_timestamp &&
    forum_comment?.post.updated_post
      ? [
          {
            title: "Edited Timestamp",
            data: forum_comment.post.updated_timestamp,
            copy: forum_comment.post.updated_timestamp,
          },
          {
            title: "Edited Post",
            data: forum_comment.post.updated_post,
            copy: forum_comment.post.updated_post,
          },
        ]
      : []),
  ];

  const community_post_details = [
    ...basic_post_details,
    {
      title: "Original Comment",
      data: community_post?.post.post ?? "",
      copy: community_post?.post.post ?? "",
    },
    ...(community_post?.post.updated_timestamp &&
    community_post?.post.updated_post
      ? [
          {
            title: "Edited Timestamp",
            data: community_post.post.updated_timestamp,
            copy: community_post.post.updated_timestamp,
          },
          {
            title: "Edited Post",
            data: community_post.post.updated_post,
            copy: community_post.post.updated_post,
          },
        ]
      : []),
  ];

  const chat_post_details = [
    ...basic_post_details,
    {
      title: "Original Comment",
      data: chat_post?.post.post ?? "",
      copy: chat_post?.post.post ?? "",
    },
    ...(chat_post?.post.updated_timestamp &&
      chat_post?.post.updated_post
      ? [
          {
            title: "Edited Timestamp",
            data: chat_post.post.updated_timestamp,
            copy: chat_post.post.updated_timestamp,
          },
          {
            title: "Edited Post",
            data: chat_post.post.updated_post,
            copy: chat_post.post.updated_post,
          },
        ]
      : []),
  ];

  const post_details = forum_post
    ? forum_post_details
    : forum_comment
    ? forum_comment_details
    : community_post
    ? community_post_details
    : chat_post
    ? chat_post_details
    : [];

  return (
    <div className="flex flex-col w-full gap-1 lg:gap-2 p-2">
      <div className="flex w-full">
        <h1 className={`${themed['400'].text} font-semibold text-sm text-left`}>
          Viewing Post Details
        </h1>
      </div>

      <div
        className="flex flex-wrap items-center gap-2 text-sm"
        style={{ placeItems: "start" }}
      >
        {post_details.map((item, index) => (
          <div key={index} onClick={() => copy_to_clipboard(item.data as string)} className={`flex gap-2 items-center border ${themed['700'].border} p-2 rounded-lg ${themed.effects.transparent_button.hover_darker} duration-300 hover:-translate-y-0.5 cursor-copy`}>
            <div className="flex flex-col gap-y-0.5 text-left px-2 max-w-64 break-all">
              <h1 className={`text-xs font-semibold ${themed['400'].text}`}>
                {item.title}
              </h1>

              <h1 className={`text-sm ${themed['200'].text}`}>
                {item.data as string}
              </h1>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForumPostComponentViewDetails;
