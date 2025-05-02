import { FC, useState } from "react";

import { verified_token } from "@/verified/interfaces";
import { format_unix } from "@/utils/string-tools";
import { pool_pm_fingerprint } from "@/utils/api/external/pool-pm";
import useThemedProps from "@/contexts/themed-props";
import { asset_tx } from "@/utils/api/external/blockfrost";
import CommunityOverviewAbout from "./about";
import CommunityOverviewRecentTxs from "./recent-txs";
import CommunityTokenInformation from "./token-information";

interface custom_props {
  token: verified_token;
  poolpm_fp_data: pool_pm_fingerprint | undefined;
  asset_transactions: asset_tx[] | undefined;
}

const CommunityOverview: FC <custom_props> = ({
  token, poolpm_fp_data, asset_transactions
}) => {
  const themed = useThemedProps();

  const token_stats = [
    { title: "Hex", data: token.hex },
    { title: "Ticker", data: "$" + token.token_details.ticker },
    { title: "Supply", data: token.token_details.supply.toLocaleString() },
    { title: "Decimals", data: token.token_details.decimals },
    { title: "Minted", data: format_unix(poolpm_fp_data?.mint ?? 0).time_ago },
    { title: "on Epoch", data: poolpm_fp_data?.epoch ?? 0 },
    { title: "Policy", data: token.token_details.policy },
    { title: "Fingerprint", data: token.token_details.fingerprint },
    { title: "Creator", data: poolpm_fp_data?.owner },
  ];

  return (
    <div>
      <div className="flex flex-col w-full gap-2">
        <CommunityOverviewAbout token={token} />

        <div className={`grid lg:grid-cols-2 gap-2`}>
          <span>
            <CommunityTokenInformation token_stats={token_stats}/>
          </span>

          <span className="flex flex-col w-full gap-2">
            <h1 className={`${themed['500'].text} text-left font-semibold text-sm`}>
              Recent Transactions
            </h1>

           <CommunityOverviewRecentTxs asset_transactions={asset_transactions}/>
          </span>
        </div>
      </div>

    </div>
  )
}

export default CommunityOverview;