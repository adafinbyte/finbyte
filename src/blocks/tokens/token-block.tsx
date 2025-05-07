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
import { curated_token } from "@/verified/interfaces";
import { Home, Newspaper, PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";
import TokenOverview from "./token-overview";
import TokenCommunity from "./token-community";
import { community_post_data, platform_user_details } from "@/utils/api/interfaces";
import { toast } from "@/hooks/use-toast";
import { get_pool_pm_asset, pool_pm_fingerprint } from "@/utils/api/external/pool-pm";
import { fetch_author_data } from "@/utils/api/account/fetch";
import { fetch_community_posts } from "@/utils/api/community/fetch";

interface custom_props {
  token: curated_token;
}

const TokenBlock: FC <custom_props> = ({
  token
}) => {
  const [poolpm_fp_data, set_poolpm_fp_data] = useState<pool_pm_fingerprint | undefined>(undefined);
  const [community_posts, set_community_posts] = useState<community_post_data[] | null>(null);
  const [refreshing_state, set_refreshing_state] = useState(false);
  const [current_view, set_current_view] = useState(1);

  const views = [
    {id: 1, title: 'Overview', icon: <Home/>},
    {id: 2, title: 'Community', icon: <Newspaper/>},
    {id: 3, title: 'Trade', icon: <PiggyBank/>},
  ];

  const get_token_data = async () => {
    set_refreshing_state(true);

    try {
      const community_posts = await fetch_community_posts(token.slug_id);
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

      if (token.token_details.fingerprint) {
        const poolpm_fingerprint = await get_pool_pm_asset(token.token_details.fingerprint);
        set_poolpm_fp_data(poolpm_fingerprint);
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
      <SiteHeader title={'Exploring ' + token.name}/>

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
            <div className="grid grid-cols-3 gap-2 bg-black/10 dark:bg-neutral-900 rounded-lg p-2">
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
                <TokenOverview
                  token={token}
                  poolpm_fp_data={poolpm_fp_data}
                  community_posts_length={community_posts?.length ?? 0}
                  toggle_create={() => set_current_view(2)}
                  refresh_data={get_token_data}
                />
              )}

              {current_view === 2 && (
                <TokenCommunity
                  token={token}
                  community_posts={community_posts ?? []}
                  refresh_data={get_token_data}
                  refreshing={refreshing_state}
                />
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}

export default TokenBlock;