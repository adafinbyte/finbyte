import { FC, useEffect, useState } from "react"

import useThemedProps from "@/contexts/themed-props";
import { fetch_everything_count } from "@/utils/api/fetch";
import { platform_user } from "@/utils/api/interfaces";
import FormatAddress from "@/components/format-address";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

const FinbytePlatformUsers: FC = () => {
  const themed = useThemedProps();

  type view = 'finbyte' | 'anon';
  const [current_view, set_current_view] = useState<view>('finbyte');
  const [platform_users, set_platform_users] = useState<platform_user[] | undefined>(undefined);
  const [search_address_query, set_search_address_query] = useState<string>('');

  const fetch_data = async () => {
    const everything = await fetch_everything_count();
    if (everything?.users) { set_platform_users(everything?.users); }
  }

  useEffect(() => {
    fetch_data()
  }, []);

  const views = [
    {
      title: 'Registered',
      view: 'finbyte',
      data: platform_users?.filter(a => a.type === 'finbyte').length ?? 0
    },
    {
      title: 'Anonymous',
      view: 'anon',
      data: platform_users?.filter(a => a.type === 'anon').length ?? 0
    },
  ];

  const tab_button_class = (triggers: view) => `
    ${triggers === current_view ? themed['300'].text + ' border-b ' + themed['800'].border : themed['500'].text + ' '}
    ${themed.effects.transparent_button.hover}
    py-1 px-2 rounded-lg
    inline-flex gap-2 items-center
  `;

  return (
    <div className={`p-2 flex flex-col gap-2 ${themed['900'].bg} rounded-lg border ${themed['700'].border}`}>
      <h1 className={`text-left text-sm font-semibold ${themed['500'].text} w-full`}>
        Platform Users: <span className="text-blue-400">{platform_users?.length.toLocaleString() ?? 0}</span>
      </h1>

      <div className={`flex items-center gap-1 ${themed.webkit_scrollbar}`}>
        {views.map((view, index) => (
          <button key={index} onClick={() => set_current_view(view.view as view)} className={tab_button_class(view.view as view)}>
            {view.title}
            <span className={`${view.view === current_view ? 'text-blue-400' : 'text-blue-500'} text-xs`}>
              {view.data.toLocaleString()}
            </span>
          </button>
        ))}

        <span className="ml-auto w-full items-center flex">
          <div className={`flex w-full items-center gap-2 ${themed['900'].bg} border ${themed['700'].border} rounded-lg py-1 px-2`}>
            <Search className={`size-4 ${themed['300'].text}`}/>

            <input
              className={`flex w-full items-center gap-2 text-xs ${themed['900'].bg} ${themed['300'].text} outline-none px-2`}
              placeholder="Search Address..."
              onChange={(e) => set_search_address_query(e.target.value)}
              value={search_address_query}
            />

            <Link href={'/address/' + search_address_query} className={`group text-[10px] font-semibold inline-flex items-center gap-2 px-2 rounded-lg ${themed['400'].text} ${themed.effects.transparent_button.hover}`}>
              Search
              <ArrowRight className="size-2.5 group-hover:translate-x-0.5 duration-300"/>
            </Link>
          </div>
        </span>
      </div>

      <span className={`max-h-80 ${themed.webkit_scrollbar}`}>
        {current_view === 'anon' &&
          <div className={`${themed['400'].text} text-xs`}>
            <div className="flex gap-1 flex-wrap">
              {platform_users?.filter(a => a.type === 'anon').map((user, index) => (
                <Link href={'/address/' + user.address} key={index} className={`py-1 px-2 rounded-lg ${themed.effects.transparent_button.hover}`}>
                  <FormatAddress address={user.address}/>
                </Link>
              ))}
            </div>
          </div>
        }

        {current_view === 'finbyte' &&
          <div className={`${themed['400'].text} text-xs`}>
            <div className="flex gap-1 flex-wrap">
              {platform_users?.filter(a => a.type === 'finbyte').map((user, index) => (
                <Link href={'/address/' + user.address} key={index} className={`py-1 px-2 rounded-lg ${themed.effects.transparent_button.hover}`}>
                  <FormatAddress address={user.address}/>
                </Link>
              ))}
            </div>
          </div>
        }
      </span>

    </div>
  )
}

export default FinbytePlatformUsers;