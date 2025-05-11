import { FC, useEffect, useRef, useState } from "react";
import SiteHeader from "@/components/site-header";
import curated_tokens from "@/verified/tokens";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence, motion } from "framer-motion";
import { curated_nft, curated_token } from "@/verified/interfaces";
import { Home, Newspaper, PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";
import { community_post_data, platform_user_details } from "@/utils/api/interfaces";
import { toast } from "@/hooks/use-toast";
import { get_pool_pm_asset, pool_pm_fingerprint } from "@/utils/api/external/pool-pm";
import { fetch_author_data } from "@/utils/api/account/fetch";
import { fetch_community_posts } from "@/utils/api/community/fetch";
import { useWallet } from "@meshsdk/react";
import NFTOverview from "./nft-overview";

interface custom_props {
  nft: curated_nft;
}

const NFTBlock: FC <custom_props> = ({
  nft
}) => {
  const { address, connected } = useWallet();

  const [poolpm_fp_data, set_poolpm_fp_data] = useState<pool_pm_fingerprint | undefined>(undefined);
  const [community_posts, set_community_posts] = useState<community_post_data[] | null>(null);
  const [refreshing_state, set_refreshing_state] = useState(false);
  const [current_view, set_current_view] = useState(1);

  const views = [
    {id: 1, title: 'Overview', icon: <Home/>},
    {id: 2, title: 'Community', icon: <Newspaper/>},
  ];
  const [user_details, set_user_details] = useState<platform_user_details | null>(null);

  const get_user_details = async () => {
    const account_details = await fetch_author_data(address);
    if (account_details?.error) {
      toast({
        description: account_details.error.toString(),
        variant: 'destructive'
      });
      return;
    }
    if (account_details?.data) {
      set_user_details(account_details.data);
    }
  }

  useEffect(() => {
    if (connected) {
      get_user_details();
    }
  }, [connected]);

  const get_token_data = async () => {
    set_refreshing_state(true);

    try {
      const community_posts = await fetch_community_posts(nft.slug_id);
      if (community_posts?.error) {
        toast({
          description: community_posts.error.toString(),
          variant: 'destructive'
        });
        return;
      }
      if (community_posts?.data) {
        /** @todo paginate this properly from the db */
        const only_lastest_posts: community_post_data[] = community_posts.data.slice(0, 25);
        const enriched_posts = await Promise.all(only_lastest_posts.map(async (post) => {
          const user_response = await fetch_author_data(post.author);
          const data: platform_user_details = user_response.data;
          return {
            ...post,
            user: data || null,
          };
        }));
        set_community_posts(enriched_posts);
      }

      if (nft.policy) {
      //  const poolpm_fingerprint = await get_pool_pm_asset(nft.policy);
      //  set_poolpm_fp_data(poolpm_fingerprint);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast({
          description: error.message,
          variant: 'destructive'
        });
      } else {
        throw error;
      }
    }

    set_refreshing_state(false);
  }

  useEffect(() => {
    get_token_data();
  }, []);

  return (
    <>
      <SiteHeader title={'Exploring ' + nft.collection_name}/>

      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2 p-2 lg:p-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              delay: 0.2,
            }}
            className="mb-4"
          >
            <div className="grid grid-cols-2 gap-2 bg-black/10 dark:bg-neutral-900 rounded-lg p-2">
              {views.map((tab, index) => (
                <Button key={index} variant='outline' disabled={tab.id === current_view} onClick={() => set_current_view(tab.id)}>
                  <span className="flex w-full justify-center items-center">
                    {tab.icon}
                    <p className="mx-auto">
                      {tab.title}
                    </p>
                  </span>
                </Button>
              ))}
            </div>
          </motion.div>

          <AnimatePresence mode='wait'>
            <motion.div
              key={current_view}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                delay: 0.2,
              }}
            >
              {current_view === 1 && (
                <NFTOverview
                  nft={nft}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}

export default NFTBlock;