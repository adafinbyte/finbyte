import useThemedProps from "@/contexts/themed-props";
import { copy_to_clipboard } from "@/utils/string-tools";
import { FC } from "react";

interface custom_props {
  token_stats: {
    title: string;
    data: string | number | undefined;
  }[];
}

const CommunityTokenInformation: FC <custom_props> = ({
  token_stats
}) => {
  const themed = useThemedProps();

  return (
    <>
      <h1 className={`${themed['500'].text} text-left font-semibold text-sm`}>
        Token Information
      </h1>

      <div className={`flex flex-wrap gap-2 justify-center items-center p-2 rounded-lg`}>
        {token_stats.map((stat, index) => (
          <div key={index} onClick={() => copy_to_clipboard(stat.data as string)} className={`p-2 ${themed['900'].bg} border ${themed['700'].border} px-4 rounded-lg ${themed.effects.transparent_button.hover} duration-300 hover:-translate-y-0.5 cursor-copy`}>
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

export default CommunityTokenInformation;