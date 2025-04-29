import { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";

import CommunityPosts from "./community";
import CommunityOverview from "./overview";
import CommuntiyTrade from "./trade";

import useThemedProps from "@/contexts/themed-props";

import { fetched_community_post_data } from "@/utils/api/interfaces";
import { pool_pm_fingerprint } from "@/utils/api/external/pool-pm";

import { verified_token } from "@/verified/interfaces";
import { asset_tx } from "@/utils/api/external/blockfrost";

interface custom_props {
  active_tab: number;
  token:      verified_token;
  community_posts: fetched_community_post_data[] | undefined;
  get_posts: () => Promise<void>;
  refresh: boolean;
  poolpm_fp_data: pool_pm_fingerprint | undefined;
  asset_transactions: asset_tx[] | undefined;
}

const CommunityView: FC <custom_props> = ({
  active_tab, token, community_posts, get_posts, refresh, poolpm_fp_data, asset_transactions
}) => {
  return (
    <div className={`p-2 lg:w-full`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={active_tab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          {active_tab === 0 && (
            <CommunityOverview
              token={token}
              poolpm_fp_data={poolpm_fp_data}
              asset_transactions={asset_transactions}
            />
          )}
  
          {active_tab === 1 && (
            <CommunityPosts
              token={token}
              community_posts={community_posts}
              get_posts={get_posts}
              refresh={refresh}
            />
          )}
  
          {active_tab === 2 && (
            <CommuntiyTrade
              token={token}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default CommunityView;
