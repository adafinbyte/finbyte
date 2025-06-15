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

export default function Home() {
  const { address, connected } = useWallet();

  const [all_feed_posts, set_all_feed_posts] = useState<full_post_data[] | null>(null);
  const [finbyte_stats, set_finbyte_stats] = useState<finbyte_general_stats | null>(null);
  const [connected_user_details, set_connected_user_details] = useState<platform_user_details | null>(null);

  const [refreshing_state, set_refreshing_state] = useState(false);
  const [selected_topic, set_selected_topic] = useState<string | null>(null);
  const [post_offset, set_post_offset] = useState<number>(0);

  const get_posts = async (append: boolean = false) => {
    set_refreshing_state(true);
    const POSTS_PER_PAGE = 100;
    const offset = append ? post_offset : 0;
    const posts = await fetch_all_feed_posts(POSTS_PER_PAGE, offset);

    if (posts.error) {
      toast(posts.error);
      set_refreshing_state(false);
      return;
    }

    if (posts.data) {
      set_all_feed_posts(posts.data);
      set_post_offset(POSTS_PER_PAGE);
      await get_stats();
    }

    set_refreshing_state(false);
  };

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

  const get_user_details = async () => {
    const user_details = await fetch_user_data(address);
    if (user_details.error) {
      toast.error(user_details.error);
      return;
    }
    if (user_details.data) {
      await get_stats();
      set_connected_user_details(user_details.data);
    }
  }

  useEffect(() => {
    if (connected && address) {
      get_user_details();
    } else {
      set_connected_user_details(null);
    }

    get_posts();
    get_stats();
  }, [connected, address]);

  interface stat_item { title: string; data: string | number; }
  const stat_items: stat_item[] = [
    { title: 'Total Posts', data: finbyte_stats?.total_posts ?? 0 },
    { title: 'Feed Posts', data: finbyte_stats?.forum_posts ?? 0 },
    { title: 'Unique Users', data: finbyte_stats?.unique_users ?? 0 },
    { title: 'Interactions', data: finbyte_stats?.interactions ?? 0 },
  ];

  const topic_counts: Record<string, number> = {};
  all_feed_posts && all_feed_posts.forEach((post) => {
    const topic = post.post.topic;
    topic_counts[topic] = (topic_counts[topic] || 0) + 1;
  });

  const right_sidebar_contents = (
    <>
      <PlatformStats stat_items={stat_items} />
      <PlatformTopics set_topic={set_selected_topic} topic={selected_topic} topic_counts={topic_counts} />
      <PlatformQuickLinks/>
    </>
  )

  return (
    <>
      <Head>
        <title>Finbyte - The future of social; Built on Cardano.</title>
      </Head>

      <DefaultLayout right_sidebar={right_sidebar_contents}>
        <FinbyteFeed
          all_posts={all_feed_posts}
          refreshing_state={refreshing_state}
          get_posts={get_posts}
          get_user_details={get_user_details}
          selected_topic={selected_topic}
          user_details={connected_user_details}
        />
      </DefaultLayout>
    </>
  )
}
