"use client"

import { verified_token } from "@/verified/interfaces";
import verified_tokens from "@/verified/tokens";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import CommunitySidebar from "./sidebar";
import CommunityView from "./views";
import { fetched_community_post_data } from "@/utils/api/interfaces";
import { fetch_community_posts } from "@/utils/api/fetch";
import toast from "react-hot-toast";
import { get_pool_pm_asset, pool_pm_fingerprint } from "@/utils/api/external/pool-pm";
import { asset_tx, get_blockfrost_asset_transactions } from "@/utils/api/external/blockfrost";


const Communities: FC = () => {
  const router = useRouter();
  const [found_token, set_found_token] = useState<verified_token | undefined>();
  const [active_tab, set_active_tab] = useState(0);
  const [refresh, set_refresh] = useState(false);
  const [asset_transactions, set_asset_transactions] = useState<asset_tx[] | undefined>();
  const [community_posts, set_community_posts] = useState<fetched_community_post_data[] | undefined>();
  const [poolpm_fp_data, set_poolpm_fp_data] = useState<pool_pm_fingerprint | undefined>();
  const tab_list = ["Overview", "Community", "Trade"];

  const get_posts = async () => {
    set_refresh(true);

    if (!found_token) {
      set_refresh(false);
      return;
    }

    try {
      const community_posts = await fetch_community_posts(found_token.slug_id);
      if (community_posts) {
        set_community_posts(community_posts);
      }

      if (found_token.token_details.fingerprint) {
        const poolpm_fingerprint = await get_pool_pm_asset(found_token.token_details.fingerprint);
        set_poolpm_fp_data(poolpm_fingerprint);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        throw error;
      }
    }

    set_refresh(false);
  }

  const get_transactions = async () => {
    if (!found_token) {
      set_refresh(false);
      return;
    }

    try {
      const policy_plus_hex = found_token.token_details.policy ? found_token.token_details.policy + found_token.hex : undefined;
      if (policy_plus_hex) {
        const asset_txs = await get_blockfrost_asset_transactions(policy_plus_hex);
        set_asset_transactions(asset_txs);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        throw error;
      }
    }
  }

  useEffect(() => {
    const slug_id = router.asPath.split('/').pop();
    const found_token = verified_tokens.find(a => a.slug_id === slug_id);

    if (found_token) {
      set_found_token(found_token);
    }
  }, [router.asPath]);

  useEffect(() => {
    get_posts();
    get_transactions();
  }, [found_token]);

  return found_token ? (
    <div className="mt-4 lg:mt-10">
      <div className="flex flex-col lg:flex-row gap-2 lg:px-20 p-2 justify-center">
        <CommunitySidebar
          token={found_token}
          tab_list={tab_list}
          active_tab={active_tab}
          set_tab={set_active_tab}
          post_length={community_posts ? community_posts.length : 0}
        />

        <div className="lg:w-[70%]">
          <CommunityView
            active_tab={active_tab}
            token={found_token}
            get_posts={get_posts}
            refresh={refresh}
            community_posts={community_posts}
            poolpm_fp_data={poolpm_fp_data}
            asset_transactions={asset_transactions}
          />
        </div>
      </div>
    </div>
  )
  :
  <div>
    No Token Found
  </div>
}

export default Communities;