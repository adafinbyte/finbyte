import '@dexhunterio/swaps/lib/assets/style.css'

import { FC, useContext } from "react";
import dynamic from "next/dynamic";

import { verified_token } from "@/verified/interfaces";
import useThemedProps from '@/contexts/themed-props';
import { FinbyteContext } from '@/contexts';

const Swap = dynamic(() => import("@dexhunterio/swaps"), {
  ssr: false,
});

interface custom_props {
  token: verified_token;
}

const CommuntiyTrade: FC <custom_props> = ({
  token
}) => {
  const { theme } = useContext(FinbyteContext);
  const themed = useThemedProps();

  const dexhunter_kbs = [
    { shortcut: 'Q', name: '-1% Slippage'},
    { shortcut: 'E', name: '+1% Slippage'},
    { shortcut: 'K', name: 'Swap Buy/Sell'},
    { shortcut: 'P', name: 'Swap Price'},
    { shortcut: 'S', name: 'Settngs'},
  ];

  type HEX = `#${string}`;
  type CUSTOME_COLORS = 'mainText' | 'subText' | 'background' | 'containers' | 'buttonText' | 'accent';
  type colorsProps = {
      [key in CUSTOME_COLORS]?: HEX;
  };

  const trading_theme = {
    Neutral: {"background":"#171717","containers":"#262626","subText":"#60a5fa","mainText":"#e5e5e5","buttonText":"#0a0a0a","accent":"#60a5fa"},
    Slate: {"background":"#0f172a","containers":"#1e293b","subText":"#94a3b8","mainText":"#e2e8f0","buttonText":"#e2e8f0","accent":"#2563eb"},
  }

  return token.token_details.policy && token.hex ? (
    <div className="flex w-full flex-col gap-2 p-2 lg:px-10">
      <h1 className={`text-center ${themed['500'].text} font-semibold text-sm`}>
        Trade <span className="text-blue-400">{token.name}</span>
      </h1>

      <div className='grid gap-4' style={{ placeItems: 'center'}}>
        <div className='flex justify-center w-full'>
          <Swap
            orderTypes={["SWAP","LIMIT","DCA"]}
            defaultToken={token.token_details.policy + token.hex}
            colors={trading_theme[theme] as colorsProps}
            theme="dark"
            partnerCode="finbyte6164647231717833386e74637a6d6c6b646e79716d3738616365663739306a7271723965686a79737932357472727876686165383964363239306e637a6e30793479637961736c613238737171727470797476337675753075716a34797533377139327275646cda39a3ee5e6b4b0d3255bfef95601890afd80709"
            partnerName="Finbyte"
            displayType="DEFAULT"
          />
        </div>

        <div className='w-full flex flex-col gap-2 text-center'>
          <p className={`${themed['300'].text}`}>
            You can buy and sell your tokens directly from within the Finbyte platform thanks to its DexHunter integration.
            Because we have integrated DexHunter, we are required to add a fee but we have set this to the minimum at 0.1%.<br/>
            <span className='font-semibold'>Every 1 ADA spent is 0.001 as fee.</span>
          </p>

          <a className='font-semibold text-blue-400' href='https://dexhunter.gitbook.io/dexhunter-partners' target='_blank'>
            You can read more about DexHunters Parter Program right here.
          </a>

          <div>
            <h1 className={`${themed['300'].text} text-center font-semibold text-xs mb-2`}>
              Keyboard Shortcuts
            </h1>

            <div className='flex flex-wrap justify-center items-center gap-1 cursor-default'>
              {dexhunter_kbs.map((kbs, index) => (
                <div key={index} className={`inline-flex gap-2 ${themed['900'].bg} ${themed['400'].text} px-2 py-1 rounded-lg`}>
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