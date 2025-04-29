import { FC } from "react";

import { post_type } from "@/utils/api/types";
import useThemedProps from "@/contexts/themed-props";
import { fetched_comment_post_data } from "@/utils/api/interfaces";
import UserAvatar from "@/components/user-avatar";
import { format_unix } from "@/utils/string-tools";
import FormatAddress from "@/components/format-address";
import EllipsisMenu from "@/components/ellipsis-menu";
import { HeartHandshake } from "lucide-react";
import FinbyteMarkdown from "@/components/finbytemd";

interface custom_props {
  type: post_type;
  show_gif_post?: boolean
}

const ForumPostExample: FC <custom_props> = ({
  type = 'forum_post', show_gif_post = false
}) => {
  const themed = useThemedProps();

  const example_ftitle = 'WooHoo! My first Finbyte post!';
  const example_fpost = 'This is an example of what your post will look like on Finbyte!'
  const example_gif_post = '![adagif](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaXk5N2hwNzE4eHNwZXM1ZnJuMDdvcXNmdjFtNGZkeGVoeDNmdGdjeiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/4LPxINAIcA72lohDYE/giphy.gif)'

  const example_data: fetched_comment_post_data = {
    id: 0, post_id: 1, ada_handle: 'example_adahandle', author: 'addr1qx38ntczmlkdnyqm78acef790jrqr9ehjysy25trrxvhae89d6290nczn0y4ycyasla28sqqrtpytv3vuu0uqj4yu37q92rudl',
    timestamp: 1741065206, post: 'And this is an example of what your comment will look like on Finbyte! Why not use a gif, or even an emoji! :finbyte: :snek:', updated_post: null, updated_timestamp: null,
    post_likers: [], tip_tx_hashes: [], marked_spam: false
  };

  return (
    <div className={`duration-500 w-full cursor-default border ${themed['700'].border} rounded-lg ${themed['900'].bg} w-full ${themed['400'].text}`}>

      {/** post header */}
      <div className="flex items-center w-full gap-2 text-sm p-2 lg:p-4">
        <UserAvatar address={example_data.author} className="size-8 lg:size-10"/>

        <div className="flex flex-col justify-center text-left">
          <FormatAddress className="text-base" address={example_data.ada_handle as string}/>

          <span className={`text-xs ${themed['400'].text}`}>
            {format_unix(example_data.timestamp).date}
          </span>
        </div>

        <div className="ml-auto inline-flex items-center gap-1">
          <span className={`inline-flex items-center gap-2 text-xs rounded-lg p-2`}>
            <HeartHandshake className={`size-4`}/>
            <span className="text-sm">
              69
            </span>
          </span>

          <EllipsisMenu className="size-4" example={true}/>
        </div>
      </div>

      {/** post contents */}
      <div className="p-2">
        <div className="flex flex-col w-full gap-1 lg:gap-2 px-2">
          {type === 'forum_post' &&
            <span className="flex w-full items-center font-semibold text-blue-400">
              <span className="mx-auto text-xl">
                {example_ftitle}
              </span>
            </span>
          }

          <div className={`text-left flex flex-col w-full gap-1 break-normal`}>
            {show_gif_post ?
              <FinbyteMarkdown>
                  {example_gif_post}
              </FinbyteMarkdown>
              :
              <FinbyteMarkdown>
                  {type === 'forum_post' ? example_fpost : example_data.post}
              </FinbyteMarkdown>
            }
          </div>
        </div>
      </div>

      <div className="flex gap-2 items-center w-full p-1 lg:px-2 lg:pb-2">
              <span className={`text-sm inline-flex items-center gap-2 rounded-lg p-2`}>
                {type === 'forum_post' ? 'Like Post' : 'Like Comment'}
              </span>
          </div>
    </div>
  )
}

export default ForumPostExample;