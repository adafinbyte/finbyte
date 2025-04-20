import SocialIcon from "@/components/social-icons";
import verified_tokens from "@/verified/tokens";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC } from "react"
import { motion } from "framer-motion";

const ExploreProjects: FC = () => {
  const router = useRouter();

  const handle_request = () => {
    router.push({
      pathname: '/forums',
      query: { tab_id: 3 }
    })
  }
  
  /** @todo paginate verified_tokens */

  return (
    <div className="flex flex-col w-full items-center justify-center mt-4">
      <div className="grid lg:grid-cols-3 gap-4" style={{ placeItems: 'start' }}>
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
          <div key={index} className={`${!token.token_details.policy ? 'opacity-50' : 'opacity-[75%] hover:opacity-100'} text-neutral-300 cursor-default border border-neutral-700 duration-300 bg-neutral-900 rounded-xl`}>
            <div className='flex justify-between items-center border-b border-neutral-700 p-2'>
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
                    <span className="border border-neutral-700 px-2 py-0.5 rounded-lg text-xs">
                      {token.category}
                    </span>
                  </div>
                )}

                <h3 className='ml-auto text-xs bg-neutral-950 text-blue-400 rounded-lg p-1 px-2'>
                  ${token.token_details.ticker}
                </h3>
              </div>

              <h1 className="h-12 text-sm overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:bg-neutral-500">
                {token.description}
              </h1>
            </div>

            <div className="border-t border-neutral-700 p-2 flex gap-1">
              {Object.entries(token.links).slice(0, 4).map(([key, value], index) => (
                <SocialIcon disabled={!token.token_details.policy} name={key} link={value} key={index}/>
              ))}

              <span className="ml-auto text-sm">
                {token.token_details.policy ?
                  <Link href={'/token/' + token.slug_id} className="group">
                    <button className="p-2 hover:bg-neutral-800 rounded-lg">
                      <span className="px-1 inline-flex gap-2 items-center text-neutral-300 italic">
                        View Token
                        <ArrowRight size={14} className={`${!token.token_details.policy ? '' : 'group-hover:translate-x-0.5 duration-300'}`}/>
                      </span>
                    </button>
                  </Link>
                  :
                  <span className="p-2 inline-flex gap-2 items-center text-neutral-300">
                    View Token
                    <ArrowRight size={14}/>
                  </span>
                }
              </span>
            </div>
          </div>

          </motion.div>
        ))}
      </div>

      <div className="flex w-full mt-2 lg:mt-10">
        <span className="flex w-full justify-end gap-2 items-center text-sm text-neutral-400">
          Want to request a project?
          <span onClick={handle_request} className="text-blue-400 cursor-pointer">
            Click here!
          </span>
        </span>
      </div>
    </div>
  )
}

export default ExploreProjects;