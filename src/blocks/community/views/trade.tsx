import '@dexhunterio/swaps/lib/assets/style.css'

import { FC } from "react";
import dynamic from "next/dynamic";

import { verified_token } from "@/verified/interfaces";

const Swap = dynamic(() => import("@dexhunterio/swaps"), {
  ssr: false,
});

interface custom_props {
  token: verified_token;
}

const CommuntiyTrade: FC <custom_props> = ({
  token
}) => {
  const dexhunter_kbs = [
    { shortcut: 'Q', name: '-1% Slippage'},
    { shortcut: 'E', name: '+1% Slippage'},
    { shortcut: 'K', name: 'Swap Buy/Sell'},
    { shortcut: 'P', name: 'Swap Price'},
    { shortcut: 'S', name: 'Settngs'},
  ]

  return token.token_details.policy && token.hex ? (
    <div className="flex w-full flex-col p-2 lg:px-10">
      <h1 className="text-left text-neutral-500 font-semibold text-sm">
        Trade <span className="text-blue-400">{token.name}</span>
      </h1>

      <div className='grid lg:grid-cols-2 gap-4' style={{ placeItems: 'start'}}>
        <div className='flex justify-center w-full'>
          <Swap
            orderTypes={["SWAP","LIMIT","DCA"]}
            defaultToken={token.token_details.policy + token.hex}
            colors={{"background":"#0a0a0a","containers":"#262626","subText":"#60a5fa","mainText":"#e5e5e5","buttonText":"#0a0a0a","accent":"#60a5fa"}}
            theme="dark"
            partnerCode="finbyte6164647231717833386e74637a6d6c6b646e79716d3738616365663739306a7271723965686a79737932357472727876686165383964363239306e637a6e30793479637961736c613238737171727470797476337675753075716a34797533377139327275646cda39a3ee5e6b4b0d3255bfef95601890afd80709"
            partnerName="Finbyte"
            displayType="DEFAULT"
          />
        </div>

        <div className='w-full flex flex-col gap-2 text-center'>
          <p className='text-neutral-300'>
            You can buy and sell your tokens directly from within the Finbyte platform thanks to its DexHunter integration.
            Because we have integrated DexHunter, we are required to add a fee but we have set this to the minimum at 0.1%.<br/>
            <span className='font-semibold'>Every 1 ADA spent is 0.001 as fee.</span>
          </p>

          <a className='font-semibold text-blue-400' href='https://dexhunter.gitbook.io/dexhunter-partners' target='_blank'>
            You can read more about DexHunters Parter Program right here.
          </a>

          <div>
            <h1 className='text-left text-neutral-500 font-semibold text-xs mb-1'>
              Keyboard Shortcuts
            </h1>

            <div className='flex flex-wrap justify-center items-center gap-1 cursor-default'>
              {dexhunter_kbs.map((kbs, index) => (
                <div key={index} className='inline-flex gap-2 bg-neutral-900 text-neutral-400 px-2 py-1 rounded-lg'>
                  <span className='font-semibold px-1'>
                    {kbs.shortcut}
                  </span>
                  {kbs.name}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  ) : (
    <div>Unsupported, No Hex or Policy.</div>
  )
}

export default CommuntiyTrade;