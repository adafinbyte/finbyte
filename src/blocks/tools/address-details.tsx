import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AddressInformation, asset_tx } from "@/utils/api/external/blockfrost";
import { platform_user_details } from "@/utils/api/interfaces";
import { format_unix } from "@/utils/string-tools";
import { Verified } from "lucide-react";
import { FC } from "react";


interface custom_props {
  finbyte_details: platform_user_details | null;
  author_transactions: asset_tx[] | null;
  author_assets: AddressInformation | null;
}

const AddressDetails: FC <custom_props> = ({
  finbyte_details, author_transactions, author_assets
}) => {
  const finbyte_data = [
    { title: 'User Type', data: finbyte_details?.type === 'anon' ? 'Anonymous User' : 'Finbyte User'},
    { title: 'Total Posts', data: finbyte_details?.total_posts ?? 0 },
    { title: 'First Interacted', data: format_unix(finbyte_details?.first_timestamp ?? 0).time_ago },
    { title: 'Total Kudos', data: finbyte_details?.total_kudos ?? 0 },

    { title: 'Total Assets', data: author_assets?.assets.length ?? 0 },
    { title: 'Total TXs', data: author_transactions?.length ?? 0 },
  ];

  return (
    <div>
      <div className="p-2">
        <Label>Details</Label>

        <div className="px-2 mt-2 flex flex-wrap justify-center gap-2">
          {finbyte_data.map((item, index) => (
            <Card key={index} className={`py-2 px-4 ${index < 4 ? `bg-gradient-to-r border-transparent from-neutral-500/10 to-cyan-500/10 dark:text-white border-transparent` : "dark:border-neutral-800 "}`}>
              <h1 className="text-semibold opacity-70 text-xs">
                {item.title}
              </h1>
              <span className="inline-flex gap-2 items-center">
                {item.data}
                {item.data === 'Finbyte User' && (
                  <Verified className="size-4 text-blue-400"/>
                )}
              </span>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AddressDetails;