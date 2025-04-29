import useThemedProps from "@/contexts/themed-props";
import { FC, useEffect, useState } from "react"

const ExplorePools: FC = () => {
  const themed = useThemedProps();
  const [cardano_pools, set_cardano_pools] = useState<any[]>();
  
  const get_basic_pooldata = async () => {
  }

  useEffect(() => {
    get_basic_pooldata();
  }, []);

  return (
    <div className="flex flex-col gap-1 w-full">
      <h1 className={`${themed['400'].text} text-xs font-semibold`}>
        Cardano Pools
      </h1>

      <div className="flex flex-wrap gap-4 justify-center lg:px-4">
        {cardano_pools ?
          cardano_pools.slice(0, 25).map((pool, index) => (
            <div key={index} className={`p-2 flex gap-2 items-center border ${themed['700'].border} rounded-lg ${themed.effects.transparent_button.hover_darker} duration-300 hover:-translate-y-0.5 cursor-copy`}>
              <div className="flex flex-col gap-y-0.5 text-right px-2 w-full">
                <h1 className={`text-xs font-semibold ${themed['400'].text}`}>
                  {pool.name}
                </h1>

                <h1 className={`text-sm ${themed['200'].text}`}>
                  {pool.ticker}
                </h1>
              </div>
            </div>
          )) : (
            <div>
              Pools loading...
            </div>
          )
        }
      </div>
    </div>
  )
}

export default ExplorePools;