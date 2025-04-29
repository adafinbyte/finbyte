import SocialIcon from "@/components/social-icons";
import verified_tokens from "@/verified/tokens";
import { ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC } from "react"
import { motion } from "framer-motion";
import useThemedProps from "@/contexts/themed-props";

const ExploreProjects: FC = () => {
  const router = useRouter();
  const themed = useThemedProps();

  const handle_request = () => {
    router.push({
      pathname: '/forums',
      query: { tab_id: 3 }
    })
  }
  
  /** @todo paginate verified_tokens */

  return (
    <div className="flex flex-col gap-1 w-full">
      <h1 className={`${themed['400'].text} text-xs font-semibold`}>
        Curated Tokens
      </h1>

      <div className="grid lg:grid-cols-3 gap-4 lg:px-4" style={{ placeItems: 'start' }}>
        {verified_tokens.map((token, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              delay: index * 0.1,
            }}
            className="w-full"
          >
            <div key={index} className={`${!token.token_details.policy ? 'opacity-50' : 'opacity-[75%] hover:opacity-100'} ${themed['300'].text} cursor-default border ${themed['700'].border} duration-300 ${themed['900'].bg} rounded-xl`}>
              <div className={`flex justify-between items-center border-b ${themed['700'].border} p-2`}>
                <img src={token.images.logo} className='size-9 p-1 rounded-lg'/>
                <div className="flex flex-col items-center gap-1">
                  <h1 className='text-lg font-semibold'>
                    {token.name}
                  </h1>
                </div>
              </div>

              <div className="p-2 py-4 flex flex-col w-full gap-2">
                <div className="flex justify-between items-center gap-x-2">
                  {token.category && (
                    <div className="flex justify-center">
                      <span className={`border ${themed['700'].border} px-2 py-0.5 rounded-lg text-xs`}>
                        {token.category}
                      </span>
                    </div>
                  )}

                  <h3 className={`ml-auto text-xs ${themed['950'].bg} text-blue-400 rounded-lg p-1 px-2`}>
                    ${token.token_details.ticker}
                  </h3>
                </div>

                <h1 className={`h-12 text-sm ${themed.webkit_scrollbar}`}>
                  {token.description}
                </h1>
              </div>

              <div className={`border-t ${themed['700'].border} p-2 flex gap-1`}>
                {Object.entries(token.links).slice(0, 4).map(([key, value], index) => (
                  <SocialIcon disabled={!token.token_details.policy} name={key} link={value} key={index}/>
                ))}

                <span className="ml-auto text-sm">
                  {token.token_details.policy ?
                    <Link href={'/token/' + token.slug_id} className="group">
                      <button className={`p-2 hover:${themed['800'].bg} rounded-lg inline-flex gap-2 items-center ${themed['300'].text}`}>
                        View Token
                        <ArrowRight size={14} className={`${!token.token_details.policy ? '' : 'group-hover:translate-x-0.5 duration-300'}`}/>
                      </button>
                    </Link>
                    :
                    <span className={`p-2 inline-flex gap-2 items-center ${themed['300'].text}`}>
                      No Fingerprint
                      <X size={14}/>
                    </span>
                  }
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex w-full mt-2 lg:mt-10">
        <span className={`flex ml-auto text-right flex-col text-sm ${themed['400'].text}`}>
          Don't see what you want?
          <span onClick={handle_request} className="text-blue-400 cursor-pointer">
            Request a project in our forums!
          </span>
        </span>
      </div>
    </div>
  )
}

export default ExploreProjects;