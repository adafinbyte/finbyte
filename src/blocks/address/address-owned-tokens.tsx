import { Badge } from "@/components/ui/badge";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LoadingDots } from "@/components/ui/loading-dots";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Asset, getAddressAssets } from "@/utils/api/external/blockfrost";
import { format_atomic, format_long_string } from "@/utils/string-tools";
import curated_tokens from "@/verified/tokens";
import { FC, useEffect, useState } from "react";

interface custom_props {
  page_address: string;
}

const AddressOwnedTokens: FC <custom_props> = ({
  page_address
}) => {

  const is_known_curated_asset = (unit: string) => {
    const token = curated_tokens.find(a => a.token_details.policy as string + a.hex === unit);
    return token ? '$' + token.token_details.ticker : unit === 'lovelace' ? '₳ADA' : format_long_string(unit);
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

  return (
    <Card className="dark:border-neutral-800 relative w-full">
      <CardHeader>
        <Label>Owned Tokens</Label>
      </CardHeader>
      <hr className="dark:border-neutral-800"/>
      <CardContent className="pt-4">
        {loading ?
          <LoadingDots/>
          :
          <div className="flex flex-col gap-2">
            <ScrollArea>
              <div className="max-h-64 flex flex-col gap-2 pr-4">
                {assets.filter(a => a.has_nft_onchain_metadata === false).map((item, index) => (
                  <Badge key={index} variant='outline' className="p-1 flex w-full justify-between">
                    {is_known_curated_asset(item.unit)}

                    <Badge variant='secondary'>
                      x{format_atomic(item.decimals ?? 0, Number(item.quantity)).toLocaleString(undefined, {maximumFractionDigits: item.decimals})}
                    </Badge>
                  </Badge>
                ))}
              </div>
            </ScrollArea>
            <div className="flex justify-end gap-1">
              <Button size='sm' variant='ghost' onClick={handlePrevPage} disabled={page === 1 || loading}>
                Previous
              </Button>

              <Button size='sm' variant='ghost' onClick={handleNextPage} disabled={loading}>
                Next
              </Button>
            </div>
          </div>
        }
      </CardContent>
      <BorderBeam duration={20}/>
    </Card>
  )
}

export default AddressOwnedTokens;