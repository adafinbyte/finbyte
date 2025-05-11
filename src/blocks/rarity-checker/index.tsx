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
import { computeRarityFromMetadata, RarityResult } from "@/verified/nft-traits";
import { LoadingDots } from "@/components/ui/loading-dots";
import curated_nfts from "@/verified/nfts";
import { capitalize_first_letter } from "@/utils/string-tools";
import { X } from "lucide-react";
import Link from "next/link";

const RarityCheckerBlock: FC = () => {
  const [search_query, set_search_query] = useState<string>('');
  const [close_banner, set_close_banner] = useState(false);

  const [viewing_asset, set_viewing_asset] = useState(false);
  const [chosen_asset, set_chosen_asset] = useState<specific_asset | null>(null);
  const [chosen_asset_rarity_details, set_chosen_asset_rarity_details] = useState<RarityResult | null>(null);
  const [pool_pm_data, set_pool_pm_data] = useState<pool_pm_fingerprint | null>(null);

  const supported = [
    {title: 'TheBabyDux', policy: 'de53e935d272dd079f3e785ee0f3aa21db5579d5399a3b5d0ce3485c'},
    {title: 'TheChosenDux', policy: '444c89e7c273530f108c4b68b8788fba58ae4e503b0b439a4806d1cb',}
  ];

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
      const asset_rarity_data = computeRarityFromMetadata(
        policy,
        //@ts-ignore
        pool_pm.metadata.attributes ?? pool_pm.metadata ?? {}
      );
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
      <SiteHeader title='Rarity Checker'/>
      <div className="flex flex-1 flex-col">
        {!close_banner && (
          <Banner text="This page is under construction" subtext="Details on this page maybe inaccurate." on_close={() => set_close_banner(true)}/>
        )}

        <div className="@container/main flex flex-1 flex-col gap-2 p-2 lg:p-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring" }}
            className="flex flex-col gap-2"
          >
            <Label>Support CNTs</Label>
            <div className="flex flex-wrap gap-2">
              {supported.map((item, index) => (
                <Badge variant='secondary' key={index}>{item.title}</Badge>
              ))}
              <Link href={'/forums/'} className="cursor-pointer ml-auto"><Badge variant='primary'>Request Support</Badge></Link>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-4 mt-2" style={{ placeItems: 'start'}}>
            <AnimatePresence mode="wait">
              <div className="flex flex-col lg:col-start-2 lg:col-span-2 gap-2 w-full border dark:border-neutral-800 p-2 lg:p-4 rounded-xl">
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
              </div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  )
}

export default RarityCheckerBlock;