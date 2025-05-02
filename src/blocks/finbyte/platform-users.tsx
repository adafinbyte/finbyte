import { FC, useEffect, useState } from "react"

import useThemedProps from "@/contexts/themed-props";
import { fetch_everything_count } from "@/utils/api/fetch";
import { platform_user } from "@/utils/api/interfaces";
import FormatAddress from "@/components/format-address";

const FinbytePlatformUsers: FC = () => {
  const themed = useThemedProps();

  type view = 'finbyte' | 'anon';
  const [current_view, set_current_view] = useState<view>('anon');
  const [platform_users, set_platform_users] = useState<platform_user[] | undefined>(undefined);

  const fetch_data = async () => {
    const everything = await fetch_everything_count();
    if (everything?.users) { set_platform_users(everything?.users); }
  }

  useEffect(() => {
    fetch_data()
  }, []);

  const views = [
    {
      title: 'Anonymous',
      view: 'anon',
      data: platform_users?.filter(a => a.type === 'anon').length ?? 0
    },
    {
      title: 'Registered',
      view: 'finbyte',
      data: platform_users?.filter(a => a.type === 'finbyte').length ?? 0
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

      <div className={`flex gap-1 ${themed.webkit_scrollbar}`}>
        {views.map((view, index) => (
          <button key={index} onClick={() => set_current_view(view.view as view)} className={tab_button_class(view.view as view)}>
            {view.title}
            <span className={`${view.view === current_view ? 'text-blue-400' : 'text-blue-500'} text-xs`}>
              {view.data.toLocaleString()}
            </span>
          </button>
        ))}
      </div>

      <span className={`max-h-80 ${themed.webkit_scrollbar}`}>
        {current_view === 'anon' &&
          <div className={`${themed['400'].text} text-xs`}>
            <div className="flex gap-1 flex-wrap">
              {platform_users?.filter(a => a.type === 'anon').map((user, index) => (
                <div key={index} className={`cursor-default py-1 px-2 rounded-lg ${themed.effects.transparent_button.hover}`}>
                  <FormatAddress address={user.address}/>
                </div>
              ))}
            </div>
          </div>
        }

        {current_view === 'finbyte' &&
          <div className={`${themed['400'].text} text-xs`}>
            <div className="flex gap-1 flex-wrap">
              {platform_users?.filter(a => a.type === 'finbyte').map((user, index) => (
                <div key={index} className={`cursor-default py-1 px-2 rounded-lg ${themed.effects.transparent_button.hover}`}>
                  <FormatAddress address={user.address}/>
                </div>
              ))}
            </div>
          </div>
        }
      </span>

    </div>
  )
}

export default FinbytePlatformUsers;