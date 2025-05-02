import FormatAddress from "@/components/format-address";
import UserAvatar from "@/components/user-avatar";
import useThemedProps from "@/contexts/themed-props";
import { author_data } from "@/utils/api/account/fetch";
import { address_details, address_information } from "@/utils/api/external/blockfrost";
import { copy_to_clipboard, format_atomic, format_long_string, format_unix } from "@/utils/string-tools";
import verified_tokens from "@/verified/tokens";
import { Check, X } from "lucide-react";
import { FC, useState } from "react";

interface custom_props {
  address: string;

  address_data: {
    information: address_information | undefined;
  }
}

const AddressAddressInfo: FC <custom_props> = ({
  address, address_data
}) => {
  const themed = useThemedProps();

  const is_known = (unit: string) => {
    const token = verified_tokens.find(a => a.token_details.policy as string + a.hex === unit);
    return token ? '$' + token.token_details.ticker : format_long_string(unit);
  }

  return (
    <>
      <div className={`w-full flex flex-col rounded-lg border ${themed['700'].border} ${themed['900'].bg}`}>
        <div className={`flex flex-col gap-2 items-center justify-between p-2 ${themed['400'].text}`}>
          <h1 className={`text-left text-sm font-semibold ${themed['500'].text} w-full`}>
            Owned Assets
          </h1>

          <div className={`grid grid-cols-3 gap-2 text-center max-h-64 pr-4 ${themed.webkit_scrollbar}`}>
            {address_data.information?.amount.map((asset, index) => (
              <div key={index} onClick={() => copy_to_clipboard(asset.unit)} className={`p-1 rounded-lg text-sm border ${themed['700'].border}`}>
                <h1 className="text-xs">
                  {is_known(asset.unit)}
                </h1>

                <p className={`${themed['300'].text} font-semibold`}>
                  {format_atomic(asset.decimals, Number(asset.quantity)).toLocaleString(undefined, { maximumFractionDigits: asset.decimals})}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default AddressAddressInfo;