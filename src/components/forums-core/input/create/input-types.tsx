import FinbyteMarkdown from "@/components/finbytemd";
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
  const community_post_input = () => (
    <div className="flex flex-col w-full gap-0.5 p-2">
      <div className="flex justify-between items-center">
        <label className="block text-left font-medium mb-1 text-neutral-300 text-xs">Post</label>

        <span className={`text-[10px] text-neutral-300`}>
          <span className={`${(post_query.post.state.length > 1500 || post_query.post.state.length < 30) ? "text-red-400" : "text-green-400"} mr-0.5`}>
            {post_query.post.state.length.toLocaleString()}
          </span>
          {'/ (30/1,500)'}
        </span>
      </div>

      <textarea
        value={post_query.post.state}
        onChange={(e) => post_query.post.set_state(e.target.value)}
        placeholder="This is a great project, I can't wait to discover more about it..."
        className="p-2 lg:p-3 text-sm text-neutral-300 placeholder:text-neutral-500 rounded-lg min-h-36 max-h-60 bg-neutral-900 border border-neutral-700 focus:border-blue-400 focus:outline-none overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:bg-neutral-500"
      />
    </div>
  )

  const forum_post_input = () => (
    <div className="flex flex-col w-full gap-2 p-2">
      <div className="flex gap-0.5 lg:gap-2 lg:flex-row flex-col items-center">
        <div className="flex flex-col gap-0.5 w-full lg:w-1/4">
          <div className="flex justify-between items-center">
            <label className="block text-left font-medium mb-1 text-neutral-300 text-xs">Tag</label>

            <span className={`text-[10px] text-neutral-300`}>
              <span className={`${post_query.tag.state && (post_query.tag.state.length > 14 || post_query.tag.state.length < 2) ? "text-red-400" : "text-green-400"} ${post_query.tag.state.length === 0 && "text-neutral-300"} mr-0.5`}>
                {post_query.tag.state.length.toLocaleString()}
              </span>
              {'/ (2/14)'}
            </span>
          </div>

          <input
            placeholder={`${section === 'requests' ? 'Requesting What?' : "<optional> Welcome-Post"}`}
            value={post_query.tag.state}
            onChange={(e) => post_query.tag.set_state(e.target.value)}
            className="p-2 lg:p-3 text-sm text-neutral-300 placeholder:text-neutral-500 rounded-lg bg-neutral-900 border border-neutral-700 focus:border-blue-400 focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-0.5 w-full">
          <div className="flex justify-between items-center">
            <label className="block text-left font-medium mb-1 text-neutral-300 text-xs">Title</label>

            <span className={`text-[10px] text-neutral-300`}>
              <span className={`${(post_query.title.state.length > 50 || post_query.title.state.length < 8) ? "text-red-400" : "text-green-400"} mr-0.5`}>
                {post_query.title.state.length.toLocaleString()}
              </span>
              {'/ (8/50)'}
            </span>
          </div>

          <input
            placeholder={`${section === 'requests' ? 'About <Requesting>' : "My First Post"}`}
            value={post_query.title.state}
            onChange={(e) => post_query.title.set_state(e.target.value)}
            className="p-2 lg:p-3 text-sm text-neutral-300 placeholder:text-neutral-500 rounded-lg bg-neutral-900 border border-neutral-700 focus:border-blue-400 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <label className="block text-left font-medium text-neutral-300 text-xs">Post</label>

        <span className={`text-[10px] text-neutral-300`}>
          <span className={`${(post_query.post.state.length < 50 || post_query.post.state.length > 1500) ? "text-red-400" : "text-green-400"} mr-0.5`}>
            {post_query.post.state.length.toLocaleString()}
          </span>
          {'/ (50/1,500)'}
        </span>
      </div>

      <textarea
        placeholder={`${section === 'requests' ? 'Do your best to describe what you are requesting...' : "This is my first forum post on the Finbyte platform, kudos!..."}`}
        value={post_query.post.state}
        onChange={(e) => post_query.post.set_state(e.target.value)}
        className="p-2 lg:p-3 text-sm text-neutral-300 placeholder:text-neutral-500 rounded-lg min-h-36 max-h-60 bg-neutral-900 border border-neutral-700 focus:border-blue-400 focus:outline-none"
      />
    </div>
  )

  const post_comment_input = () => (
    <div className="flex flex-col w-full gap-0.5 p-2">
      <div className="flex justify-between items-center">
        <label className="block text-left font-medium mb-1 text-neutral-300 text-xs">Comment</label>

        <span className={`text-[10px] text-neutral-300`}>
          <span className={`${(post_query.post.state.length > 800 || post_query.post.state.length < 30) ? "text-red-400" : "text-green-400"} mr-0.5`}>
            {post_query.post.state.length.toLocaleString()}
          </span>
          {'/ (30/800)'}
        </span>
      </div>

      <textarea
        value={post_query.post.state}
        onChange={(e) => post_query.post.set_state(e.target.value)}
        placeholder="This is a great post, Kudos..."
        className="p-2 lg:p-3 text-sm text-neutral-300 placeholder:text-neutral-500 rounded-lg min-h-36 max-h-60 bg-neutral-900 border border-neutral-700 focus:border-blue-400 focus:outline-none overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:bg-neutral-500"
      />
    </div>
  )

  const render_preview = () => (
    <div className="flex flex-col w-full gap-0.5 p-2">
      <label className="block text-left font-medium mb-1 text-neutral-300 text-xs">Post Preview</label>
      <div className="p-2 lg:p-3 max-h-60 rounded-lg min-h-36 text-sm text-neutral-300 text-left bg-neutral-900 border border-blue-400/60 focus:border-blue-400 focus:outline-none overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:bg-neutral-500">
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

    "preview": render_preview()
  }

  const contents = preview_post ? render_input["preview"] : render_input[post_type];

  return (
    <div className="flex flex-col w-full rounded-lg bg-neutral-900 bg-opacity-30 border border-neutral-800 hover:border-neutral-700 duration-300 min-h-40 mb-2">
      {contents}
    </div>
  )
}

export default CreatePostInputTypes;