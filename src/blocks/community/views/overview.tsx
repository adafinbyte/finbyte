import { FC } from "react";

import { verified_token } from "@/verified/interfaces";
import { copy_to_clipboard } from "@/utils/string-tools";
import curators_list from "@/verified/curators";
import { Plus } from "lucide-react";

interface custom_props {
  token: verified_token;
}

const CommunityOverview: FC <custom_props> = ({
  token
}) => {
  const token_stats = [
    {
      title: "Hex",
      data: token.hex
    },
    {
      title: "Ticker",
      data: "$" + token.token_details.ticker
    },
    {
      title: "Supply",
      data: token.token_details.supply.toLocaleString()
    },
    {
      title: "Decimals",
      data: token.token_details.decimals
    },
    {
      title: "Policy",
      data: token.token_details.policy
    },
    {
      title: "Fingerprint",
      data: token.token_details.fingerprint
    },
  ]

  return (
    <div>

      <div className="flex flex-col w-full gap-4">
        <div className="border border-transparent p-2 w-full">
          <h1 className="text-left text-neutral-500 font-semibold text-sm pb-2">
            About <span className="text-blue-400">{token.name}</span>
          </h1>

          <p className="text-sm text-neutral-300">
            {token.description}
          </p>

          <hr className="border-neutral-700 my-4"/>

          {token.images.header && (
            <img src={token.images.header} className="w-full object-cover object-top h-20 rounded-lg shadow-sm shadow-neutral-800/60 brightness-50"/>
          )}
        </div>

        <div className="w-full">

          <h1 className="text-left text-neutral-500 font-semibold text-sm pb-2">
            Token Information
          </h1>

          <div className="flex flex-wrap gap-2 justify-center items-center">
            {token_stats.map((stat, index) => (
              <div key={index} onClick={() => copy_to_clipboard(stat.data as string)} className="p-2 border border-neutral-800 px-4 rounded-lg hover:bg-neutral-900 duration-300 hover:-translate-y-0.5 cursor-copy">
                <h1 className="text-xs text-neutral-400">
                  {stat.title}
                </h1>

                <p className="text-neutral-200">
                  {stat.data && stat.data.toString().length > 20
                    ? stat.data.toString().substring(0, 10) + "..." + stat.data.toString().substring(stat.data.toString().length - 10)
                    : stat.data
                  }
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  )
}

export default CommunityOverview;
