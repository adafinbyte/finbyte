import { FC } from "react";

import useThemedProps from "@/contexts/themed-props";

import { verified_token } from "@/verified/interfaces";
import { copy_to_clipboard } from "@/utils/string-tools";

interface custom_props {
  token: verified_token;
  token_stats: {
    title: string;
    data: string | number | undefined;
  }[];
}

const CommunityOverviewAbout: FC <custom_props> = ({
  token, token_stats
}) => {
  const themed = useThemedProps();

  return (
    <>
      <h1 className={`${themed['500'].text} text-left font-semibold text-sm`}>
        About <span className="text-blue-400">{token.name}</span>
      </h1>

      <div className="flex gap-2 text-[10px]">
        {token.category && (
          <div className={`py-0.5 px-2 cursor-default rounded-lg ${themed['900'].bg} ${themed['300'].text} border ${themed['700'].border}`}>
            #{token.category}
          </div>
        )}
      </div>
  
      <p className={`text-sm ${themed['300'].text}`}>
        {token.description}
      </p>

      {token.images.header && (
        <>
          <hr className={`${themed['700'].border}`}/>

          <img src={token.images.header} className="mb-2 w-full object-cover object-top h-20 rounded-lg brightness-50"/>
        </>
      )}

      <hr className={`${themed['700'].border}`}/>

      <h1 className={`${themed['500'].text} text-left font-semibold text-sm`}>
        Token Information
      </h1>

      <div className={`flex flex-wrap gap-2 justify-center items-center p-2 lg:w-3/4 lg:mx-auto rounded-lg`}>
        {token_stats.map((stat, index) => (
          <div key={index} onClick={() => copy_to_clipboard(stat.data as string)} className={`p-2 border ${themed['700'].border} px-4 rounded-lg ${themed.effects.transparent_button.hover_darker} duration-300 hover:-translate-y-0.5 cursor-copy`}>
            <h1 className={`text-xs ${themed['400'].text}`}>
              {stat.title}
            </h1>

            <p className={`text-sm ${themed['200'].text}`}>
              {stat.data && stat.data.toString().length > 20
                ? stat.data.toString().substring(0, 10) + "..." + stat.data.toString().substring(stat.data.toString().length - 10)
                : stat.data
              }
            </p>
          </div>
        ))}
      </div>
    </>
  )
}

export default CommunityOverviewAbout;