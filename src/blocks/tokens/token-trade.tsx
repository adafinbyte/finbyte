import '@dexhunterio/swaps/lib/assets/style.css'

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { pool_pm_fingerprint } from "@/utils/api/external/pool-pm";
import { format_unix } from "@/utils/string-tools";
import { curated_token } from "@/verified/interfaces";
import { FC } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { BorderBeam } from "@/components/ui/border-beam";
import { Badge } from "@/components/ui/badge";
import { Hash } from "lucide-react";
import Link from "next/link";
import { platform_user_details } from "@/utils/api/interfaces";
import dynamic from "next/dynamic";
import { useTheme } from 'next-themes';
import { useIsMobile } from '@/hooks/use-mobile';

const Swap = dynamic(() => import("@dexhunterio/swaps"), {
  ssr: false,
});

interface custom_props {
  token: curated_token;
  poolpm_fp_data: pool_pm_fingerprint | undefined;
  community_posts_length: number;
  finbyte_user: platform_user_details | null;

  toggle_create: () => void;
  refresh_data: () => Promise<void>;
  refresh_user_data: () => Promise<void>;
}

const TokenTrade: FC <custom_props> = ({
  token, poolpm_fp_data, community_posts_length, finbyte_user,
  toggle_create, refresh_data, refresh_user_data
}) => {
  const is_mobile = useIsMobile();
  const theme = useTheme().theme;
  
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
    dark: {"background":"#171717","containers":"#262626","subText":"#60a5fa","mainText":"#e5e5e5","buttonText":"#0a0a0a","accent":"#60a5fa"},
    light: {"background":"#0f172a","containers":"#1e293b","subText":"#94a3b8","mainText":"#e2e8f0","buttonText":"#e2e8f0","accent":"#2563eb"},
  }

  return (
    <div className="flex flex-col w-full gap-2">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          delay: 0.5,
        }}
        className="grid lg:grid-cols-2 gap-4 lg:gap-8 px-10"
        style={{ placeItems: 'start'}}
      >
        <Card className="relative dark:border-neutral-800 w-full">
          <CardHeader>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                delay: 0.2,
              }}
              className="flex w-full gap-4 justify-between items-center"
            >
              <div className="flex flex-col gap-2">
                <Label>
                  Trade ${token.token_details.ticker}
                </Label>
                <Label className="text-xs">
                  Powered by <Link className="text-blue-400" href={'https://www.dexhunter.io/'}>DexHunter</Link>
                </Label>
              </div>

                <img src={token.images.logo} className="size-12 rounded-lg"/>
            </motion.div>
          </CardHeader>

          <hr className="dark:border-neutral-800" />

          <CardContent className="py-4 flex flex-col w-full gap-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                delay: 0.4,
              }}
              className="flex flex-col w-full gap-2"
            >
              <div className='mx-auto max-w-full mt-4'>
                <Swap
                  orderTypes={["SWAP","LIMIT","DCA"]}
                  defaultToken={token.token_details.policy as string + token.hex}
                  theme={theme === 'light' ? 'light' : 'dark'}
                  partnerCode="finbyte6164647231717833386e74637a6d6c6b646e79716d3738616365663739306a7271723965686a79737932357472727876686165383964363239306e637a6e30793479637961736c613238737171727470797476337675753075716a34797533377139327275646cda39a3ee5e6b4b0d3255bfef95601890afd80709"
                  partnerName="Finbyte"
                  displayType={is_mobile ? "BUTTON" : "DEFAULT"}
                />
              </div>
            </motion.div>
          </CardContent>
          <BorderBeam duration={20}/>
        </Card>

        <AnimatePresence mode="wait">
          <div className="w-full flex flex-col gap-4 lg:gap-8">
            <Card className="relative dark:border-neutral-800">
              <CardHeader>
                <Label>
                  Notice
                </Label>
              </CardHeader>

              <CardContent className='flex flex-col'>
                <Label>
                  About Fee
                </Label>
                <p className="text-sm opacity-80">
                  We feel obliged to let you know that when trading from our platform using DexHunter, an additional 0.01% fee will be added to your transaction for providing the service.
                  This is also DexHunters lowest possible fee, if it could be 0% it would be set.
                  1 ADA spent = 0.001 ADA fee included. 
                </p>

                <Label className='mt-2'>
                  Keyboard Shortcuts
                </Label>
                <p className="text-sm opacity-80">
                  We do not provide any button to trigger this but you can do it from your own keyboard.
                </p>
                <div className='flex flex-wrap itesm-center gap-2 justify-center mt-2'>
                  {dexhunter_kbs.map((item, index) => (
                    <Badge variant='secondary' className='inline-flex gap-2 items-center'>
                      {item.name}
                      <Badge variant='primary'>
                        {item.shortcut}
                      </Badge>
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <BorderBeam duration={20}/>
            </Card>
          </div>
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default TokenTrade;