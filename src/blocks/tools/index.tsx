import { FC, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import SiteHeader from "@/components/site-header";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Marquee } from "@/components/marquee";
import { supported_nfts } from "@/verified/nft-traits";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { AutoTextarea } from "@/components/ui/textarea-auto";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { fetch_author_data } from "@/utils/api/account/fetch";
import { platform_user_details } from "@/utils/api/interfaces";
import { AddressInformation, Asset, asset_tx, get_blockfrost_address_transactions, getAddressAssets } from "@/utils/api/external/blockfrost";
import { LoadingDots } from "@/components/ui/loading-dots";
import AddressDetails from "./address-details";
import RarityCheckerBlock from "./rarity-checker";

const ToolsBlock: FC = () => {
  const [search_address, set_search_address] = useState("");
  const [search_asset_id, set_search_asset_id] = useState("");

  const [finbyte_author_details, set_finbyte_author_details] = useState<platform_user_details | null>(null);
  const [author_transactions, set_author_transactions] = useState<asset_tx[] | null>(null);
  const [author_assets, set_author_assets] = useState<AddressInformation | null>(null);

  const attempt_search_address = async () => {
    if (!search_address.startsWith('addr1')) {
      toast.error('Address must start with addr1.');
      return;
    }

    /** Get Finbyte Details */
    const finbyte_address_data = await fetch_author_data(search_address);
    if (finbyte_address_data?.error) {
      toast.error(finbyte_address_data.error.toString());
      return;
    }
    if (finbyte_address_data?.data) {
      set_finbyte_author_details(finbyte_address_data.data);
    }

    /** Get Transactions from Blockfrost */
    const txs = await get_blockfrost_address_transactions(search_address);
    if (txs?.error) {
      toast.error(txs.error.toString());
      return;
    }
    if (txs?.data) {
      set_author_transactions(txs.data);
    }
    
    /** Get Address Assets from Blockfrost */
    const assets = await getAddressAssets(search_address, 1, 100);
    if (assets?.error) {
      toast.error(assets.error.toString());
      return;
    }
    if (assets?.data) {
      set_author_assets(assets.data);
    }
  }

  return (
    <>
      <SiteHeader title='Finbyte Tools'/>

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
              <div className="flex flex-wrap gap-4">
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

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring" }}
            className="grid lg:grid-cols-2 gap-4 items-start"
          >
            <div>
              <Card className="w-full flex flex-col gap-2 p-4 dark:border-neutral-800">
                <Label>Search Address</Label>

                <div className="flex gap-2">
                  <AutoTextarea
                    onChange={(e) => set_search_address(e)}
                    value={search_address}
                    placeholder={'Search an address here...'}
                    className="placeholder:text-muted-foreground flex-1 bg-transparent focus:outline-none focus:outline-neutral-700 rounded-md p-1 text-sm"
                  />
                  <Button size={'icon'} variant={'ghost'} onClick={attempt_search_address}>
                    <Search/>
                  </Button>
                </div>

                {finbyte_author_details &&
                  <AddressDetails
                    finbyte_details={finbyte_author_details}
                    author_transactions={author_transactions}
                    author_assets={author_assets}
                  />
                }
              </Card>
            </div>

            <Card className="w-full flex flex-col gap-2 p-4 dark:border-neutral-800">
              <Label>Rarity Checker</Label>

                <div className="flex gap-2">
                  <AutoTextarea
                    onChange={(e) => set_search_asset_id(e)}
                    value={search_asset_id}
                    placeholder={'Search a support asset id...'}
                    className="placeholder:text-muted-foreground flex-1 bg-transparent focus:outline-none focus:outline-neutral-700 rounded-md p-1 text-sm"
                  />
                  <Button size={'icon'} variant={'ghost'}>
                    <Search/>
                  </Button>
                </div>
                <RarityCheckerBlock/>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default ToolsBlock;