import FinbyteFeed from "@/components/feed"
import MobileNavigation from "@/components/default-layout/mobile-navigation"
import Sidebar from "@/components/default-layout/sidebar"
import TopNavigation from "@/components/default-layout/top-navigation"
import { Button } from "@/components/ui/button"
import { fetch_user_data } from "@/utils/api/account/fetch"
import { fetch_finbyte_general_stats } from "@/utils/api/misc"
import { fetch_all_feed_posts } from "@/utils/api/posts/fetch"
import { create_post } from "@/utils/api/posts/push"
import { supabase } from "@/utils/api/secrets"
import { capitalize_first_letter, get_timestamp } from "@/utils/common"
import { databases, FINBYTE_POLICTID, finbyte_topics } from "@/utils/consts"
import { format_atomic } from "@/utils/format"
import { create_feed_comment, finbyte_general_stats, forum_post_data, full_post_data, platform_user_details } from "@/utils/interfaces"
import curated_tokens from "@/verified/tokens"
import { useWallet } from "@meshsdk/react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import DefaultLayout from "@/components/default-layout"
import { PlatformQuickLinks, PlatformStats, PlatformTopics } from "@/components/default-layout/right-sidebar"
import Head from "next/head"
import { Card } from "@/components/ui/card"

export default function Home() {
  const [finbyte_stats, set_finbyte_stats] = useState<finbyte_general_stats | null>(null);

  const get_stats = async () => {
    const finbyte_stats = await fetch_finbyte_general_stats();
    if (finbyte_stats?.error) {
      toast.error('Failed to get Finbyte statistics.', { description: finbyte_stats.error });
      return;
    }
    if (finbyte_stats?.data) {
      set_finbyte_stats(finbyte_stats.data);
      return;
    }
  };

  useEffect(() => {
    get_stats();
  }, []);

  interface stat_item { title: string; data: string | number; }
  const stat_items: stat_item[] = [
    { title: 'Total Posts', data: finbyte_stats?.total_posts ?? 0 },
    { title: 'Feed Posts', data: finbyte_stats?.forum_posts ?? 0 },
    { title: 'Feed Comments', data: finbyte_stats?.forum_comments ?? 0 },
    { title: 'Community Posts', data: finbyte_stats?.community_posts ?? 0 },
    { title: 'Unique Users', data: finbyte_stats?.unique_users ?? 0 },
    { title: 'Interactions', data: finbyte_stats?.interactions ?? 0 },
  ];

  const right_sidebar_contents = (
    <>
      <PlatformQuickLinks />
    </>
  )

  return (
    <>
      <Head>
        <title>Dashboard - Finbyte</title>
      </Head>

      <DefaultLayout right_sidebar={right_sidebar_contents}>
        <Card className="p-4 bg-card/20 backdrop-blur-lg">
          <h1 className="text-lg font-semibold mb-2">Platform Stats</h1>
          <div className="flex flex-wrap gap-2 items-center justify-center">
            {stat_items.map((stat, index) => (
              <Card key={index} className="px-4 py-2 text-center bg-secondary/20 backdrop-blur-lg">
                <h1 className="text-muted-foreground text-sm font-semibold">{stat.title}</h1>
                <p>{stat.data}</p>
              </Card>
            ))}
          </div>
        </Card>

        <Card className="p-4 bg-card/20 backdrop-blur-lg">
          <h1 className="text-lg font-semibold mb-2">$tFIN Stats</h1>
          <div className="flex flex-wrap gap-2 items-center justify-center">
            {stat_items.map((stat, index) => (
              <Card key={index} className="px-4 py-2 text-center bg-secondary/20 backdrop-blur-lg">
                <h1>{stat.title}</h1>
                <p>{stat.data}</p>
              </Card>
            ))}
          </div>
        </Card>
      </DefaultLayout>
    </>
  )
}
