import SocialIcon from "@/components/social-icons";
import { verified_token } from "@/verified/interfaces";
import { Dispatch, FC, SetStateAction } from "react";

interface custom_props {
  token: verified_token;

  tab_list:   string[];
  active_tab: number;
  set_tab:    Dispatch<SetStateAction<number>>
}

const CommunitySidebar: FC <custom_props> = ({
  token, tab_list, active_tab, set_tab
}) => {

  return (
    <>
      <div className="flex gap-2 items-center justify-between text-right pb-2">
        <img src={token.images.logo} className="size-16 rounded-lg"/>

        <div className="flex flex-col">
          <h1 className="text-lg font-semibold text-neutral-200">
            {token.name}
          </h1>

          <span className="cursor-default border border-neutral-800 p-0.5 px-2 text-xs rounded inline-flex">
            <sub className="text-[8px] mt-1 mr-0.5 text-green-400">$</sub>
            <span className="text-neutral-300">
              {token.token_details.ticker}
            </span>
          </span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-1 mt-2">
        {Object.entries(token.links).map(([key, value], index) => (
          <SocialIcon key={index} name={key} link={value}/>
        ))}
      </div>

      <hr className="border-neutral-700 my-2"/>

      <div className="flex flex-col gap-1 text-neutral-300">
        {tab_list.map((tab, index) => (
          <button key={index} onClick={() => set_tab(index)} className={`w-full text-left p-2 hover:bg-neutral-800/60 active:bg-neutral-800/80 rounded text-sm ${active_tab === index ? 'bg-neutral-800/40 text-neutral-200 italic' : ''}`}>
            {tab}
          </button>
        ))}
      </div>
    </>
  )
}

export default CommunitySidebar;