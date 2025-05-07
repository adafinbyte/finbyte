import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { pool_pm_fingerprint } from "@/utils/api/external/pool-pm";
import { copy_to_clipboard, format_long_string, format_unix } from "@/utils/string-tools";
import { curated_token } from "@/verified/interfaces";
import { FC, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCountUp } from "@/hooks/use-count-up";
import { Label } from "@/components/ui/label";
import { BorderBeam } from "@/components/ui/border-beam";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, Hash, MessagesSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import SocialIcon from "@/components/social-icons";
import { community_post_data } from "@/utils/api/interfaces";
import { useWallet } from "@meshsdk/react";
import { toast } from "@/hooks/use-toast";
import RepresentCommunityButton from "./represent-community";

interface custom_props {
  token: curated_token;
  poolpm_fp_data: pool_pm_fingerprint | undefined;
  community_posts_length: number;

  toggle_create: () => void;
  refresh_data: () => Promise<void>;
}

const TokenOverview: FC <custom_props> = ({
  token, poolpm_fp_data, community_posts_length, toggle_create, refresh_data
}) => {
  const token_stats = [
    { title: "Hex", data: token.hex },
    { title: "Ticker", data: "$" + token.token_details.ticker },
    { title: "Supply", data: token.token_details.supply.toLocaleString() },
    { title: "Decimals", data: token.token_details.decimals },
    { title: "Minted", data: format_unix(poolpm_fp_data?.mint ?? 0).time_ago },
    { title: "on Epoch", data: poolpm_fp_data?.epoch ?? 0 },
    { title: "Policy", data: token.token_details.policy },
    { title: "Fingerprint", data: token.token_details.fingerprint },
    { title: "Creator", data: poolpm_fp_data?.owner },
  ];

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
                  About ${token.token_details.ticker}
                </Label>
                <span>
                  <Badge className="inline-flex" variant='secondary'>
                    <p className="opacity-60 tracking-wider">
                      ${token.token_details.ticker}
                    </p>
                  </Badge>
                </span>
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
              <Label>
                Description
              </Label>
              <ScrollArea>
                <p className="max-h-32 pr-2">
                  {token.description}
                </p>
              </ScrollArea>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                delay: 0.6,
              }}
              className="flex flex-col w-full gap-2"
            >
              <Label className="mt-2">
                Category
              </Label>
              <span className="flex w-full">
                <Badge className="inline-flex gap-2 py-1 px-2" variant='outline'>
                  <Hash className="size-4"/>
                  {token.category}
                </Badge>
              </span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                delay: 0.8,
              }}
              className="flex flex-col gap-2 w-full"
            >
            <Label className="mt-2">
              Token Information
            </Label>
            <ScrollArea>
              <div className="flex flex-col max-h-56 gap-1 pr-6">
                {token_stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      type: "spring",
                      delay: 1 + (index * 0.2),
                    }}
                  >
                    <Button className="w-full" variant='ghost' onClick={() => copy_to_clipboard(stat.data as string,  'The value of "' + stat.title + '" has been copied.')}>
                      <div className="flex w-full items-center gap-4">
                        <span className="flex gap-2 items-center">
                          {stat.title}:
                          <span>
                            {stat.data && stat.data.toString().length > 12 ? format_long_string(stat.data as string) : stat.data}
                          </span>
                        </span>
                        <span className="ml-auto">
                          <Copy className="size-4"/>
                        </span>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
            </motion.div>
          </CardContent>

          <hr className="dark:border-neutral-800" />

          <CardFooter className="p-2 px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                delay: 2,
              }}
              className="flex w-full items-center"
            >
              <Label>
                Links
              </Label>
              <div className="ml-auto flex gap-1">
                {Object.entries(token.links).map(([key, value], index) => (
                  <SocialIcon key={index} name={key} link={value} only_icon={false}/>
                ))}
              </div>
            </motion.div>
          </CardFooter>

          <BorderBeam duration={20}/>
        </Card>

        <AnimatePresence mode="wait">
          <div className="w-full flex flex-col gap-4 lg:gap-8">
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
              <div className="flex justify-between items-center gap-2">
                <Label>
                  On Finbyte
                </Label>
                <img src={'/finbyte.png'} className="size-4 rounded-lg"/>
              </div>
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
              layout
            >
              <Label>
                Community
              </Label>

              <div className="flex flex-wrap gap-2">
                <Badge className="inline-flex gap-2 py-1 px-2" variant='outline'>
                  <MessagesSquare className="size-4"/>
                  Community Posts: <span className="text-blue-500 dark:text-blue-400">{community_posts_length.toLocaleString()}</span>
                </Badge>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                delay: 0.6,
              }}
              className="flex flex-col w-full gap-2"
            >
              <Label className="mt-2">
                Engage
              </Label>

              <span className="flex w-full">
                <Button onClick={toggle_create} size='sm' variant='ghost'>
                  Create Post
                </Button>

                <RepresentCommunityButton
                  token={token}
                  refresh_data={refresh_data}
                />
              </span>

            </motion.div>
          </CardContent>

          <BorderBeam duration={20}/>
        </Card>

        {token.finbyte && (
          <Card className="relative dark:border-neutral-800 w-full">
            <CardContent className="py-4 flex flex-col w-full gap-2">
              {token.finbyte.collection && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: "spring",
                    delay: 1,
                  }}
                  className="flex flex-col w-full gap-2"
                >
                  <Label>
                    Also see...
                  </Label>

                  <div className="grid gap-2 mt-2">
                    {token.finbyte.collection.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          type: "spring",
                          delay: 1 + (index * 0.2),
                        }}
                      >
                      <Link href={item.url} target="_blank">
                        <Card className="dark:border-neutral-800 dark:hover:bg-white/5 hover:bg-black/5 hover:-translate-y-0.5 duration-300 duration-300 flex justify-between w-full p-4 items-center gap-2">
                          <img src={item.image} className="size-14 rounded-lg flex-shrink-0"/>
                          <div className="text-right flex flex-col flex-1">
                            <Label className="cursor-pointer">{item.title}</Label>

                            <ScrollArea className="text-xs max-h-12">
                              {item.description}
                            </ScrollArea>
                           </div>
                          </Card>
                        </Link>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </CardContent>
              <BorderBeam duration={20}/>
            </Card>
          )}
          </div>
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default TokenOverview;