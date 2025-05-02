import useThemedProps from "@/contexts/themed-props";
import { capitalize_first_letter } from "@/utils/string-tools";
import verified_tokens from "@/verified/tokens";
import Link from "next/link";
import { FC } from "react";
import { kanban_items, recent_items } from "./consts";
import { Plus } from "lucide-react";

const FinbyteDevelopment: FC = () => {
  const themed = useThemedProps();
  /** @note add timestamp to verified_tokens? */
  const newly_listed_map = verified_tokens.slice(0, 11);

  return (
    <div className={`${themed['900'].bg} rounded-lg border ${themed['700'].border} p-2 flex flex-col gap-2 w-full`}>
      <h1 className={`text-left text-sm font-semibold ${themed['500'].text} w-full`}>
        Finbyte Development
      </h1>

      <div className={`grid lg:grid-cols-2 gap-2 py-2 max-h-[200px] ${themed.webkit_scrollbar}`} style={{ placeItems: 'start'}}>
        {kanban_items.map((item, index) => (
          <div key={index} className={`border ${themed['700'].border} rounded-lg`}>
            <div className={`flex gap-2 items-center w-full py-1 px-2 border-b ${themed['700'].border}`}>
              <div title={capitalize_first_letter(item.status)} className={`w-2 rounded h-2 ${item.status === 'done' ? 'bg-green-400' : item.status === 'idea' ? 'bg-amber-400' : 'bg-red-400'}`}/>
              <p className={`${themed['400'].text} font-semibold`}>
                {item.title}
              </p>
            </div>

            <div className={`p-2 max-h-64 ${themed.webkit_scrollbar}`}>
              <p className={`${themed['300'].text} text-sm`}>
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <hr className={`${themed['700'].border}`}/>

      <div className={`p-2 max-h-64 ${themed.webkit_scrollbar}`}>
        <ol className={`relative border-s ${themed['700'].border}`}>       
          {recent_items.toReversed().map((item, index) => (
            <li key={index} className="mb-4 ms-4">
              <div className={`absolute w-3 h-3 ${themed['700'].bg} rounded-full mt-1.5 -start-1.5 border border-transparent`}/>
              <div className={`py-1 text-sm font-normal leading-none ${themed['500'].text}`}>
                {item.date}
                {index === 0 && (
                  <span className={`ml-2 text-xs text-blue-400`}>
                    Latest
                  </span>
                )}
              </div>

              <h3 className={`text-lg font-semibold ${themed['400'].text}`}>{item.title}</h3>
              <p className={`text-base font-normal ${themed['300'].text}`}>{item.description}</p>
            </li>
          ))}
        </ol>
      </div>

      <hr className={`${themed['700'].border}`}/>

      <h1 className={`text-left text-sm font-semibold ${themed['500'].text} w-full`}>
        Newly Listed 
      </h1>

      <div className={`max-h-64 ${themed.webkit_scrollbar}`}>
        <ol className={`grid grid-cols-2 lg:grid-cols-3 gap-2 rounded-lg`}>
          {newly_listed_map.map((item, index) => item.token_details.fingerprint ? (
            <Link href={'/token/' + item.slug_id} key={index}>
              <button className={`w-full rounded-lg border ${themed['700'].border} py-1 px-2 ${themed['300'].text} ${themed.effects.transparent_button.hover} duration-300`}>
                <div className="w-full flex items-center gap-2">
                  <img src={item.images.logo} className="size-4"/>
                  <p className={`text-sm `}>
                    {item.name}
                  </p>
                </div>
              </button>
            </Link>
          ) : (
            <button disabled title="No Fingerprint Found" className={`w-full rounded-lg border ${themed['700'].border} py-1 px-2 ${themed['300'].text} opacity-50`}>
              <div className="w-full flex items-center gap-2">
                <img src={item.images.logo} className="size-4"/>
                <p className={`text-sm `}>
                  {item.name}
                </p>
              </div>
            </button>
          ))}

          <Link href={{query: { tab_id: 3 }, pathname: '/forums'}} >
            <button className={`w-full rounded-lg border ${themed['700'].border} py-1 px-2 ${themed['300'].text} ${themed.effects.transparent_button.hover} duration-300`}>
              <div className="w-full flex items-center gap-2">
                <Plus className="text-blue-400 size-4"/>
                <p className={`text-sm `}>
                  Request Token
                </p>
              </div>
            </button>
          </Link>
        </ol>
      </div>

      <span className={`flex gap-1 w-full justify-end text-[10px] ${themed['500'].text}`}>
        Finbyte is an <Link href={'https://github.com/adafinbyte/finbyte'} target="_blank" className="text-blue-400">open-sourced project</Link>- Feel free to contribute.
      </span>
    </div>
  )
}

export default FinbyteDevelopment;