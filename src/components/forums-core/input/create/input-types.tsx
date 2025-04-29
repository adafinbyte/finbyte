import FinbyteMarkdown from "@/components/finbytemd";
import useThemedProps from "@/contexts/themed-props";
import { post_type } from "@/utils/api/types";
import { Dispatch, FC, SetStateAction } from "react"

interface custom_props {
  post_type: post_type;

  post_query: {
    tag: {
      state: string;
      set_state: Dispatch<SetStateAction<string>>;
    };
    title: {
      state: string;
      set_state: Dispatch<SetStateAction<string>>;
    };
    post: {
      state: string;
      set_state: Dispatch<SetStateAction<string>>;
    };
  };
  preview_post: boolean;

  section: string | undefined;
}

const CreatePostInputTypes: FC <custom_props> = ({
  post_type, post_query, preview_post, section
}) => {
  const themed = useThemedProps();

  const textarea = (
    query: string, set_query: Dispatch<SetStateAction<string>>,
    placeholder: string,
  ) => (
    <textarea
      value={query}
      onChange={(e) => set_query(e.target.value)}
      placeholder={placeholder}
      className={`p-2 lg:p-3 text-sm placeholder:${themed['300'].text} rounded-lg min-h-36 max-h-60 ${themed['900'].bg} border ${themed['700'].border} focus:border-blue-400 focus:outline-none ${themed.webkit_scrollbar}`}
    />
  );

  const input = (
    query: string, set_query: Dispatch<SetStateAction<string>>,
    placeholder: string,
  ) => (
    <input
      value={query}
      onChange={(e) => set_query(e.target.value)}
      placeholder={placeholder}
      className={`p-2 lg:p-3 text-sm placeholder:${themed['300'].text} rounded-lg ${themed['900'].bg} border ${themed['700'].border} focus:border-blue-400 focus:outline-none`}
    />
  );

  const label = (
    label: string,
    query_length: number,
    type: 'post' | 'cmt' | 'title' | 'tag'
  ) => {
    const limits = {
      post:  {min: 30, max: 1500},
      tag:   {min: 2,  max: 14},
      title: {min: 8,  max: 50},
      cmt:   {min: 30, max: 800}
    }

    return (
      <div className="flex justify-between items-center">
        <label className={`block text-left font-medium text-xs`}>{label}</label>

        <span className={`text-[10px]`}>
          <span className={`${(query_length > limits[type].max || query_length < limits[type].max) ? (type === 'tag' && query_length === 0) ? themed['400'].text : "text-red-400" : "text-green-400"} mr-0.5`}>
            {post_query.post.state.length.toLocaleString()}
          </span>

          {`/ (${limits[type].min}/${limits[type].max})`}
        </span>
      </div>
    )
  }

  const community_post_input = () => (
    <div className="flex flex-col w-full gap-1 mt-1">
      {label('Post', post_query.post.state.length, 'cmt')}
      {textarea(post_query.post.state, post_query.post.set_state, `This is a great project, I can't wait to discover more about it...`)}
    </div>
  )

  const forum_post_input = () => (
    <div className="flex flex-col w-full gap-2 p-2">
      <div className="flex gap-0.5 lg:gap-2 lg:flex-row flex-col items-center">
        <div className="flex flex-col gap-0.5 w-full lg:w-1/4">
          {label('Tag', post_query.tag.state.length, 'tag')}
          {input(post_query.tag.state, post_query.tag.set_state, section === 'requests' ? 'Requesting What?' : "")}
        </div>

        <div className="flex flex-col gap-0.5 w-full">
          {label('Title', post_query.title.state.length, 'title')}
          {input(post_query.title.state, post_query.title.set_state, 'Post Title')}
        </div>
      </div>

      <div className="flex flex-col gap-0.5 w-full">
        {label('Post', post_query.post.state.length, 'post')}
        {textarea(post_query.post.state, post_query.post.set_state, section === 'requests' ? 'Do your best to describe what you are requesting...' : "This is going to my first Finbyte post!...")}
      </div>
    </div>
  )

  const post_comment_input = () => (
    <div className="flex flex-col w-full gap-1 mt-1">
      {label('Comment', post_query.post.state.length, 'cmt')}
      {textarea(post_query.post.state, post_query.post.set_state, `This is a great post...`)}
    </div>
  )

  const render_preview = () => (
    <div className="flex flex-col w-full gap-1">
      <label className="block text-left font-medium text-xs">Post Preview</label>

      <div className={`p-2 max-h-60 rounded-lg min-h-36 text-sm text-left cursor-default focus:border-blue-400 focus:outline-none ${themed.webkit_scrollbar}`}>
        <FinbyteMarkdown>
          {post_query.post.state}
        </FinbyteMarkdown>
      </div>
    </div>
  )

  const render_input = {
    "community_post": community_post_input(),
    "forum_post": forum_post_input(),
    "forum_comment": post_comment_input(),
    "chat": post_comment_input(), // uses same component as forum_comment as its input

    "preview": render_preview()
  }

  const contents = preview_post ? render_input["preview"] : render_input[post_type];

  return (
    <div className={`flex flex-col w-full rounded-lg bg-opacity-30 duration-300 min-h-40 ${themed['300'].text}`}>
      {contents}
    </div>
  )
}

export default CreatePostInputTypes;