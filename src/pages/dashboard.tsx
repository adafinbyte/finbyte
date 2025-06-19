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
import { databases, TFINBYTE_POLICTID, finbyte_topics } from "@/utils/consts"
import { format_atomic, format_unix } from "@/utils/format"
import { create_feed_comment, finbyte_general_stats, forum_post_data, full_post_data, platform_user_details } from "@/utils/interfaces"
import curated_tokens from "@/verified/tokens"
import { useWallet } from "@meshsdk/react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import DefaultLayout from "@/components/default-layout"
import { CuratedTokens, PlatformQuickLinks, PlatformStats, PlatformTopics } from "@/components/default-layout/right-sidebar"
import Head from "next/head"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import FormatAddress from "@/components/format-address"

export default function Home() {
  const [finbyte_stats, set_finbyte_stats] = useState<finbyte_general_stats | null>(null);
  const [found_user_details, set_found_user_details] = useState<platform_user_details | null>(null);
  const [search_user_input, set_search_user_input] = useState<string>('');

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

  const find_user = async (address: string) => {
    if (address === found_user_details?.address) {
      toast.info('User has already been loaded');
      return;
    }

    set_found_user_details(null);
    const user_details = await fetch_user_data(address);
    if (user_details.error) {
      toast.error('Failed to find user.', { description: "It seems this user hasn't used Finbyte, boo."})
      return;
    }
    if (user_details.data) {
      toast.success('Found user.');
      set_found_user_details(user_details.data);
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

  const user_details_map = [
    { title: 'Username', data: found_user_details?.ada_handle ? <FormatAddress large_size address={found_user_details.ada_handle}/> : 'No ADA Handle set' },
    { title: 'First Interaction', data: format_unix(found_user_details?.first_timestamp ?? 0).time_ago },
    { title: 'Kudos Earned', data: found_user_details?.total_kudos ?? 0 },
    { title: 'Total Posts', data: found_user_details?.total_posts ?? 0 },
    { title: 'Feed Posts', data: found_user_details?.forum_posts.length ?? 0 },
    { title: 'Feed Comments', data: found_user_details?.forum_comments.length ?? 0 },
  ];

  const right_sidebar_contents = (
    <>
      <PlatformQuickLinks />
      <CuratedTokens />
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
              <Card key={index} className="px-4 py-2 text-center bg-secondary/40 backdrop-blur-lg">
                <h1 className="text-muted-foreground text-sm font-semibold">{stat.title}</h1>
                <p>{stat.data}</p>
              </Card>
            ))}
          </div>
        </Card>

        <Card className="p-4 bg-card/20 backdrop-blur-lg">
          <h1 className="text-lg font-semibold mb-2">Search User</h1>
          <div className="flex w-full gap-2 items-center mb-4">
            <Input
              value={search_user_input}
              placeholder="Search Address..."
              className="resize-none p-2 focus-visible:ring-0"
              onChange={(e) => set_search_user_input(e.target.value)}
            />
            <Button size='sm' variant='secondary' onClick={() => find_user(search_user_input)} disabled={!search_user_input}>
              Search
            </Button>
          </div>

          {found_user_details ?
            <>
              <div className="flex justify-center mb-4">
                <FormatAddress address={search_user_input} large_size />
              </div>
              <div className="flex flex-wrap gap-4 items-center justify-center">
                {user_details_map.map((item, index) => (
                  <Card key={index} className="px-4 py-2 bg-secondary/40 backdrop-blur-lg">
                    <h1 className="text-xs font-semibold text-muted-foreground">
                      {item.title}
                    </h1>
                    <p className="text-lg text-center">
                      {item.data}
                    </p>
                  </Card>
                ))}
              </div>
            </>
            :
            <div>
              <h1 className="text-center text-muted-foreground text-sm">
                Search for a user by entering an address
              </h1>
            </div>
          }
        </Card>
      </DefaultLayout>
    </>
  )
}
