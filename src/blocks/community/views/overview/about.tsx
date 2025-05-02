import { FC } from "react";

import useThemedProps from "@/contexts/themed-props";

import { verified_token } from "@/verified/interfaces";

interface custom_props {
  token: verified_token;
}

const CommunityOverviewAbout: FC <custom_props> = ({
  token
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

      <hr className={`${themed['700'].border}`}/>
    </>
  )
}

export default CommunityOverviewAbout;