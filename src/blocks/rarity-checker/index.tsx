import { FC, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import SiteHeader from "@/components/site-header";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import Banner from "@/components/banner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { get_blockfrost_specific_asset, specific_asset } from "@/utils/api/external/blockfrost";
import { toast } from "@/hooks/use-toast";
import { get_pool_pm_asset, pool_pm_fingerprint } from "@/utils/api/external/pool-pm";
import { computeRarityFromMetadata, RarityResult, supported_nfts } from "@/verified/nft-traits";
import { LoadingDots } from "@/components/ui/loading-dots";
import curated_nfts from "@/verified/nfts";
import { capitalize_first_letter } from "@/utils/string-tools";
import { X } from "lucide-react";
import Link from "next/link";
import { title } from "process";
import { Marquee } from "@/components/marquee";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const RarityCheckerBlock: FC = () => {
  const [search_query, set_search_query] = useState<string>('');

  const [viewing_asset, set_viewing_asset] = useState(false);
  const [chosen_asset, set_chosen_asset] = useState<specific_asset | null>(null);
  const [chosen_asset_rarity_details, set_chosen_asset_rarity_details] = useState<RarityResult | null>(null);
  const [pool_pm_data, set_pool_pm_data] = useState<pool_pm_fingerprint | null>(null);

  const is_known_curated_asset = (unit: string | undefined) => {
    const nft = curated_nfts.find(a => a.policy === unit);
    return nft ? nft : null;
  };

  /** @note asset_id = policy + hexname */
  const get_asset_details = async () => {
    if (!search_query) {
      return;
    }

    set_viewing_asset(true);
    const asset_data = await get_blockfrost_specific_asset(search_query);

    if (asset_data?.error) {
      toast({
        description: asset_data.error.toString(),
        variant: 'destructive'
      });
      return;
    }

    if (asset_data?.data) {
      set_chosen_asset(asset_data.data);

      const policy = search_query.slice(0, 56);
      const pool_pm = await get_pool_pm_asset(asset_data.data.fingerprint);
      //@ts-ignore
      const rawAttributes = pool_pm?.metadata.attributes ?? pool_pm?.metadata.Attributes;
      const flattenedAttributes = Array.isArray(rawAttributes)
        ? Object.assign({}, ...rawAttributes)
        : pool_pm?.metadata ?? {};
      const asset_rarity_data = computeRarityFromMetadata(policy, flattenedAttributes);
      set_pool_pm_data(pool_pm ?? null)
  
      if (asset_rarity_data) {
        set_chosen_asset_rarity_details(asset_rarity_data);
      }
    }
  }

  const toggle_cancel = async () => {
    set_viewing_asset(false);
    set_chosen_asset(null);
    set_chosen_asset_rarity_details(null);
    set_pool_pm_data(null);
    set_search_query('');
  }

  return (
    <>
      <SiteHeader title='Tool: Rarity Checker'/>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2 p-2 lg:p-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring" }}
            className="flex flex-col gap-2"
          >
            <div className="w-full flex justify-between items-center">
              <Label>Support NFTs</Label>
              
              <Link href={'/forums/'} className="cursor-pointer ml-auto">
                <Badge variant='primary'>Request Support</Badge>
              </Link>
            </div>

            <Marquee pauseOnHover className="w-full [--duration:80s]">
              <div className="flex flex-wrap gap-2">
                {supported_nfts.map((item, index) => (
                  <Card key={index} className="dark:border-neutral-800 p-2 max-w-96">
                    <div className="flex gap-4 items-center">
                      <div className="flex flex-col">
                        <h1 className="text-sm">{item.title}</h1>
                        <ScrollArea>
                          <p className="text-xs opacity-80 max-h-14 p-2">{item.description}</p>
                        </ScrollArea>
                        <Link href={item.website} target="_blank">
                          <Button size='sm' variant={'link'}>
                            Website
                          </Button>
                        </Link>
                      </div>

                      <img src={item.image} className="size-14 rounded-lg mr-4"/>
                    </div>
                  </Card>
                ))}
              </div>
            </Marquee>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-4 mt-2" style={{ placeItems: 'start'}}>
            <AnimatePresence mode="sync">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring" }}
                className="flex flex-col lg:col-start-2 lg:col-span-2 gap-2 w-full border dark:border-neutral-800 p-2 lg:p-4 rounded-xl"
              >
                <Label>Search Asset ID</Label>
                <div className="flex gap-2 items-center w-full">
                  <Input
                    placeholder="Search Asset ID..."
                    value={search_query}
                    onChange={(e) => set_search_query(e.target.value)}
                  />
                  <Button variant='outline' onClick={get_asset_details}>
                    Search
                  </Button>
                </div>

                {viewing_asset ?
                  <div>
                    {chosen_asset && pool_pm_data ?
                      <div>
                        <div className="flex gap-2 items-center">
                          {/**@ts-ignore */}
                          <Label>{pool_pm_data?.metadata.name}</Label>
                          <div className="ml-auto"/>
                          <Badge variant='primary'>{is_known_curated_asset(chosen_asset?.policy_id)?.collection_name ?? pool_pm_data.name}</Badge>
                          <Button onClick={toggle_cancel} className="scale-[75%]" size='icon' variant='destructive'><X/></Button>
                        </div>

                        {/**@ts-ignore */}
                        <img src={`https://ipfs.io/ipfs/${pool_pm_data?.metadata.image.slice(7)}`} className="rounded-lg w-1/2 mx-auto"/>

                        <div className="flex justify-center w-full my-2">
                          {chosen_asset_rarity_details && (
                            <Badge variant='outline'>
                              Rarity: {chosen_asset_rarity_details.rarityScore.toLocaleString(undefined, {maximumFractionDigits: 2})}%
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-1">
                          {chosen_asset_rarity_details?.traits.map((item, index) => (
                            <Badge variant='secondary' key={index}>
                              {capitalize_first_letter(item.trait_type)}: {item.value}
                              <span className="ml-auto">{item.rarity.toLocaleString(undefined, {maximumFractionDigits: 2})}%</span>
                            </Badge>
                          ))}
                        </div>
                      </div>
                      :
                      <LoadingDots/>
                    }
                  </div>
                  :
                  <div>
                  </div>
                }
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  )
}

export default RarityCheckerBlock;