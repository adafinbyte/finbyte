import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { curated_nft } from "@/verified/interfaces";
import { FC, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { BorderBeam } from "@/components/ui/border-beam";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, Hash, X } from "lucide-react";
import Link from "next/link";
import SocialIcon from "@/components/social-icons";
import { asset_res, get_pool_pm_asset, get_pool_pm_recent_assets } from "@/utils/api/external/pool-pm";
import { get_blockfrost_specific_asset, specific_asset } from "@/utils/api/external/blockfrost";
import { toast } from "@/hooks/use-toast";

interface custom_props {
  nft: curated_nft;
}

const NFTOverview: FC <custom_props> = ({
 nft
}) => {

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
                  About {nft.collection_name}
                </Label>
                <span className="flex w-full">
                  <Badge className="inline-flex gap-2 px-2" variant='outline'>
                    <Hash className="size-4"/>
                    {nft.category}
                  </Badge>
                </span>
              </div>

              <img src={nft.images.logo} className="size-12 rounded-lg"/>
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
                  {nft.description}
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

            </motion.div>
          </CardContent>

          <hr className="dark:border-neutral-800" />

          <CardFooter className="p-2 px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                delay: 0.8,
              }}
              className="flex w-full items-center"
            >
              <Label>
                Links
              </Label>
              <div className="ml-auto flex gap-1">
                {Object.entries(nft.links).map(([key, value], index) => (
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
                  transition={{ type: "spring", delay: 0.2 }}
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
                  transition={{ type: "spring", delay: 0.4 }}
                  className="flex flex-col w-full gap-2"
                  layout
                >
                  <Label>
                    Community
                  </Label>
                </motion.div>
              </CardContent>
            <BorderBeam duration={20}/>
          </Card>

        {nft.finbyte && (
          <Card className="relative dark:border-neutral-800 w-full">
            <CardContent className="py-4 flex flex-col w-full gap-2">
              {nft.finbyte.collection && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: "spring",
                    delay: 1,
                  }}
                  className="flex flex-col w-full gap-2 pb-2"
                >
                  <Label>
                    Also see...
                  </Label>

                  <div className="grid gap-2 mt-2">
                    {nft.finbyte.collection.map((item, index) => (
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

export default NFTOverview;