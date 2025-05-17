import { Badge } from "@/components/ui/badge";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LoadingDots } from "@/components/ui/loading-dots";
import { toast } from "@/hooks/use-toast";
import { Asset, get_blockfrost_specific_asset, getAddressAssets, specific_asset } from "@/utils/api/external/blockfrost";
import { get_pool_pm_adahandle, get_pool_pm_asset, pool_pm_fingerprint } from "@/utils/api/external/pool-pm";
import { ADAHANDLE_POLICY } from "@/utils/consts";
import { capitalize_first_letter, format_atomic, format_long_string } from "@/utils/string-tools";
import { computeRarityFromMetadata, RarityResult } from "@/verified/nft-traits";
import curated_nfts from "@/verified/nfts";
import curated_tokens from "@/verified/tokens";
import { Eye, X } from "lucide-react";
import { FC, useEffect, useState } from "react";

interface custom_props {
  page_address: string;
}

const AddressOwnedNfts: FC <custom_props> = ({
  page_address
}) => {
  const [viewing_asset, set_viewing_asset] = useState(false);
  const [chosen_asset, set_chosen_asset] = useState<specific_asset | null>(null);
  const [chosen_asset_rarity_details, set_chosen_asset_rarity_details] = useState<RarityResult | null>(null);
  const [pool_pm_data, set_pool_pm_data] = useState<pool_pm_fingerprint | null>(null);

  const is_known_curated_asset = (unit: string | undefined) => {
    const nft = curated_nfts.find(a => a.policy === unit);
    return nft ? nft : null;
  };

  const handleNextPage = () => setPage((prevPage) => prevPage + 1);
  const handlePrevPage = () => setPage((prevPage) => Math.max(prevPage - 1, 1));
  const [assets, setAssets] = useState<Asset[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const count = 5;

  useEffect(() => {
    if (!page_address) {
      return;
    }

    const fetchAssets = async () => {
      setLoading(true);
      const result = await getAddressAssets(page_address, page, count);
      if ('error' in result) {
        console.error(result.error);
      } else {
        setAssets(result.assets);
      }
      setLoading(false);
    };

    fetchAssets();
  }, [page_address, page]);

  const toggle_chosen_asset = async (unit: string) => {
    set_viewing_asset(true);
  
    const asset_data = await get_blockfrost_specific_asset(unit);

    if (asset_data?.error) {
      toast({
        description: asset_data.error.toString(),
        variant: 'destructive'
      });
      return;
    }

    if (asset_data?.data) {
      set_chosen_asset(asset_data.data);
      const policy = unit.slice(0, 56);
      const pool_pm = await get_pool_pm_asset(asset_data.data.fingerprint);
      const asset_rarity_data = computeRarityFromMetadata(
        policy,
        //@ts-ignore
        pool_pm.metadata.attributes ?? {}
      );
      set_pool_pm_data(pool_pm ?? null)
  
      if (asset_rarity_data) {
        set_chosen_asset_rarity_details(asset_rarity_data);
      }
    }
  };

  const toggle_reset_view = () => {
    set_chosen_asset(null);
    set_chosen_asset_rarity_details(null);
    set_viewing_asset(false);
  }

  return (
    <Card className="dark:border-neutral-800 relative w-full">
      <CardHeader>
        <Label>Owned NFTs</Label>
      </CardHeader>
      <hr className="dark:border-neutral-800"/>

      <CardContent className="pt-4">
        {viewing_asset ?
          <div className="flex flex-col gap-2">
            <div className="flex justify-between gap-2 items-center mb-2">
              <Label>
                Asset Information
              </Label>
              
              <Button size='sm' onClick={toggle_reset_view} variant='destructive' className="scale-[75%]">
                <X/>
              </Button>
            </div>

            {pool_pm_data || chosen_asset_rarity_details ?
              <>
                <div className="flex justify-between gap-2 items-center">
                  {/**@ts-ignore */}
                  <Label>{pool_pm_data?.metadata.name}</Label>
                  <Badge variant='primary'>{is_known_curated_asset(chosen_asset?.policy_id)?.collection_name ?? chosen_asset?.asset_name}</Badge>
                </div>
                {/**@ts-ignore */}
                <img src={`https://ipfs.io/ipfs/${pool_pm_data?.metadata.image.slice(7)}`} className="w-3/4 mx-auto"/>
                <div className="mx-auto">
                  {chosen_asset_rarity_details && (
                    <Badge variant='outline'>
                      Rarity: {chosen_asset_rarity_details.rarityScore.toLocaleString(undefined, {maximumFractionDigits: 2})}%
                    </Badge>
                  )}
                </div>
              </>
              :
              <LoadingDots/>
            }

            <div className="flex flex-col gap-1">
              {chosen_asset_rarity_details?.traits.map((item, index) => (
                <Badge variant='secondary' key={index}>
                  {capitalize_first_letter(item.trait_type)}: {item.value}
                  <span className="ml-auto">{item.rarity.toLocaleString(undefined, {maximumFractionDigits: 2})}%</span>
                </Badge>
              ))}
            </div>
          </div>
          :
          <>
          {loading ?
            <LoadingDots/>
            :
            <div className="flex flex-col gap-2">
              {assets.filter(a => a.has_nft_onchain_metadata).map((item, index) => (
                <Button key={index} variant='outline' onClick={() => toggle_chosen_asset(item.unit)} className="p-1 flex w-full justify-between">
                  {format_long_string(item.unit)}
                  <Badge variant='secondary' className="ml-auto flex gap-2">
                    View NFT
                    <Eye/>
                  </Badge>
                </Button>
              ))}

              <div className="flex justify-end gap-1 items-center">
                <Button size='sm' variant='ghost' onClick={handlePrevPage} disabled={page === 1 || loading}>
                  Previous
                </Button>
                <span className="opacity-60 text-sm">
                  {page}
                </span>
                <Button size='sm' variant='ghost' onClick={handleNextPage} disabled={loading || assets.length !== 100 /** @todo check this */}>
                  Next
                </Button>
              </div>
            </div>
          }
          </>
        }
      </CardContent>
      <BorderBeam duration={20}/>
    </Card>
  )
}

export default AddressOwnedNfts;