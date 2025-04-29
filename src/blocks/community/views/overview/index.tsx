import { FC, useState } from "react";

import { verified_token } from "@/verified/interfaces";
import { format_unix } from "@/utils/string-tools";
import { pool_pm_fingerprint } from "@/utils/api/external/pool-pm";
import useThemedProps from "@/contexts/themed-props";
import { asset_tx } from "@/utils/api/external/blockfrost";
import CommunityOverviewAbout from "./about";
import CommunityOverviewRecentTxs from "./recent-txs";

interface custom_props {
  token: verified_token;
  poolpm_fp_data: pool_pm_fingerprint | undefined;
  asset_transactions: asset_tx[] | undefined;
}

const CommuntiyOverview: FC <custom_props> = ({
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
        <CommunityOverviewAbout token={token} token_stats={token_stats}/>

        <hr className={`${themed['700'].border}`}/>

        <div className="grid lg:grid-cols-4 gap-4" style={{placeItems: 'start'}}>
          <div className={`w-full lg:col-span-2 lg:col-start-2`}>
            <CommunityOverviewRecentTxs asset_transactions={asset_transactions}/>
          </div>
        </div>

      </div>

    </div>
  )
}

export default CommuntiyOverview;