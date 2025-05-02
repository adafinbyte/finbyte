import { FC, useEffect, useState } from "react"
import { useRouter } from "next/router";
import { author_data, fetch_author_data } from "@/utils/api/account/fetch";
import { address_information, get_blockfrost_address_information } from "@/utils/api/external/blockfrost";
import AddressFinbyteInfo from "./finbyte-info";
import useThemedProps from "@/contexts/themed-props";
import AddressAddressInfo from "./address-info";

const AddressBlock: FC = () => {
  const themed = useThemedProps();
  const router = useRouter();
  const [page_address, set_page_address] = useState<string | undefined>();

  const [finbyte_address_details, set_finbyte_address_details] = useState<author_data | null>(null);
  const [bf_address_info, set_bf_address_info] = useState<address_information | undefined>();

  const address_data = {
    finbyte: finbyte_address_details, information: bf_address_info
  }
  
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
    set_finbyte_address_details(finbyte_address_data);

    const bf_address_info = await get_blockfrost_address_information(page_address);
    set_bf_address_info(bf_address_info);
  }

  useEffect(() => {
    if (page_address) {
      find_address_details();
    }
  }, [page_address]);

  return page_address && (
    <div className="p-4 lg:mt-10">
      <div className="grid lg:grid-cols-3 lg:px-24 gap-4 lg:gap-8" style={{ placeItems: 'start'}}>

        <AddressFinbyteInfo
          address={page_address}
          address_data={address_data}
        />

        <AddressAddressInfo
          address={page_address}
          address_data={address_data}
        />

      </div>
    </div>
  )
}

export default AddressBlock;