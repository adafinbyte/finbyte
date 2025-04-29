import { FC, useState } from "react";

import FormatAddress from "@/components/format-address";
import UserAvatar from "@/components/user-avatar";
import { author_data } from "@/utils/api/account/fetch";
import { format_unix } from "@/utils/string-tools";
import { post_type } from "@/utils/api/types";
import { useRouter } from "next/router";
import useThemedProps from "@/contexts/themed-props";
import { ArrowRight } from "lucide-react";

interface stat { title: string; data: string | number; }
interface custom_props {
  connected_address: string;
  is_finbyte_user: boolean;
  finbyte_username: string | null;

  stats: stat[] | undefined;
  account_data: author_data | null;
  close_modal: () => void;
}

const WalletModalOverview: FC <custom_props> = ({
  connected_address, is_finbyte_user, finbyte_username, stats, account_data, close_modal
}) => {
  const themed = useThemedProps();
  const router = useRouter();

  const [show_address, set_show_address] = useState(false);

  const handle_post_press = async (post_type: post_type, post_id: number) => {
    if (post_type === 'forum_post') {
      await router.push('/forums/' + post_id);
      close_modal();
    }
  }

  return (
    <div className='flex flex-col gap-2'>
      <div className='inline-flex items-center gap-2'>
        <UserAvatar address={connected_address} className="size-10"/>
        <div className='flex flex-col w-full text-left'>
          <FormatAddress onClick={finbyte_username ? () => set_show_address(!show_address) : undefined} address={show_address ? connected_address : finbyte_username ? finbyte_username : connected_address} className={`${finbyte_username ? 'cursor-pointer' : ''}`}/>

          <span className={`${is_finbyte_user ? "text-green-400" : "text-red-400"} text-[10px]`}>
            {is_finbyte_user ? "Registered" : "Anon"}
          </span>
        </div>
      </div>
  
      <div className={`inline-flex items-center justify-between px-4 gap-2 rounded-lg border ${themed['700'].border} ${themed['800'].bg}`}>
        {stats && stats.map((stat, index) => (
          <div key={index} className='p-1 inline-flex flex-col gap-0.5 text-center'>
            <h1 className={`text-sm font-semibold ${themed['500'].text}`}>
              {stat.title}
            </h1>
            <p className='text-lg'>
              {stat.data}
            </p>
          </div>
        ))}
      </div>

      <div className={`rounded-lg border ${themed['700'].border} ${themed['800'].bg}`}>
        <div className="flex flex-col">
          <h1 className={`px-2 py-1 text-sm ${themed['400'].text} border-b ${themed['700'].border}`}>Forum Posts</h1>

          <div className={`text-xs ${themed['300'].text}`}>
            {account_data?.forumPosts ?
              account_data.forumPosts.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10).map((post, index) => (
                <>
                  {/**@ts-ignore */}
                  <button key={index} onClick={() => handle_post_press('forum_post', post.post_id)} className={`group ${themed.effects.transparent_button.hover_darker} ${index === account_data.forumPosts.length - 1 ? 'rounded-b-lg' : ''} px-2 py-1 w-full flex items-center gap-2 truncate`}>
                    <span className={`${themed['400'].text}`} title="Global Post ID">
                      {/**@ts-ignore */}
                      #{post.post_id}
                    </span>

                    <span className="text-blue-400" title="Timestamp">
                      {/**@ts-ignore */}
                      {format_unix(post.post_timestamp).time_ago}
                    </span>

                    <span title="Post Title">
                      {post.title}
                    </span>                
 
                    <ArrowRight className="size-4 group-hover:translate-x-1 duration-300 ml-auto mr-2" />
                  </button>
                </>
              ))
              :
              <div>
                No posts to show
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default WalletModalOverview;