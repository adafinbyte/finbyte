import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useWallet } from "@meshsdk/react"

import ExploreProjects from "@/components/explore/projects"
import { PlatformStats } from "@/components/default-layout/right-sidebar"
import DefaultLayout from "@/components/default-layout"

import { fetch_user_data } from "@/utils/api/account/fetch"
import { fetch_finbyte_general_stats } from "@/utils/api/misc"
import { finbyte_general_stats, platform_user_details } from "@/utils/interfaces"
import Head from "next/head"

export default function Explore() {
  const { address, connected } = useWallet();
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
  }, [connected]);

  interface stat_item { title: string; data: string | number; }
  const stat_items: stat_item[] = [
    { title: 'Total Posts', data: finbyte_stats?.total_posts ?? 0 },
    { title: 'Feed Posts', data: finbyte_stats?.forum_posts ?? 0 },
    { title: 'Unique Users', data: finbyte_stats?.unique_users ?? 0},
    { title: 'Interactions', data: finbyte_stats?.interactions ?? 0},
  ];

  const right_sidebar_contents = (
    <>
      <PlatformStats stat_items={stat_items} />
    </>
  )

  return (
    <>
      <Head>
        <title>Communities - Finbyte</title>
      </Head>

      <DefaultLayout right_sidebar={right_sidebar_contents}>
        <ExploreProjects />
      </DefaultLayout>
    </>
  )
}
