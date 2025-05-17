import { FC, useEffect, useState } from "react"
import { useRouter } from "next/router";
import { platform_user_details } from "@/utils/api/interfaces";
import { address_information, Asset, get_blockfrost_address_information, getAddressAssets } from "@/utils/api/external/blockfrost";
import { fetch_author_data } from "@/utils/api/account/fetch";
import { toast } from "@/hooks/use-toast";
import AddressFinbyteDetails from "./finbyte-details";
import SiteHeader from "@/components/site-header";
import { format_long_string } from "@/utils/string-tools";
import AddressOwnedTokens from "./address-owned-tokens";
import AddressOwnedNfts from "./address-owned-nfts";
import AddressTransactions from "./address-transactions";
import Banner from "@/components/banner";

const AddressBlock: FC = () => {
  const router = useRouter();
  const [page_address, set_page_address] = useState<string>();
  const [close_banner, set_close_banner] = useState(false);

  const [finbyte_address_details, set_finbyte_address_details] = useState<platform_user_details | null>(null);
  
  useEffect(() => {
    const address = router.asPath.split('/').pop();
    const found_address = address && address.startsWith('addr1') ? address : undefined;

    if (found_address) {
      set_page_address(found_address);
    }
  }, [router.asPath]);


  const find_address_details = async () => {
    if (!page_address) { return; }
    const finbyte_address_data = await fetch_author_data(page_address);
    if (finbyte_address_data?.error) {
      toast({
        description: finbyte_address_data.error.toString(),
        variant: 'destructive'
      });
      return;
    }
    if (finbyte_address_data?.data) {
      set_finbyte_address_details(finbyte_address_data.data);
    }
  }

  useEffect(() => {
    if (page_address) {
      find_address_details();
    }
  }, [page_address]);

  return page_address && (
    <>
      <SiteHeader title={"Searcing " + format_long_string(page_address)}/>
      <div className="flex flex-1 flex-col">
        {!close_banner && (
          <Banner text="This page is under construction" subtext="Details on this page maybe inaccurate." on_close={() => set_close_banner(true)}/>
        )}

        <div className="@container/main p-2 lg:p-4">
          <div className="grid lg:grid-cols-3 gap-4" style={{ placeItems: 'start'}}>
            <div className="flex flex-col w-full gap-4">
              {finbyte_address_details && (
                <AddressFinbyteDetails
                  finbyte_details={finbyte_address_details}
                />
              )}
              <AddressOwnedNfts
                page_address={page_address}
              />
            </div>

            <AddressOwnedTokens
              page_address={page_address}
            />
            <AddressTransactions
              address={page_address}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default AddressBlock;