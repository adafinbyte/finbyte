import ExploreProjects from "@/components/explore/projects"
import FinbyteFeed from "@/components/feed"
import MobileNavigation from "@/components/mobile-navigation"
import Sidebar from "@/components/sidebar"
import TopNavigation from "@/components/top-navigation"
import { Button } from "@/components/ui/button"
import { fetch_user_data } from "@/utils/api/account/fetch"
import { fetch_finbyte_general_stats } from "@/utils/api/misc"
import { fetch_all_feed_posts } from "@/utils/api/posts/fetch"
import { capitalize_first_letter } from "@/utils/common"
import { finbyte_topics } from "@/utils/consts"
import { finbyte_general_stats, full_post_data, platform_user_details } from "@/utils/interfaces"
import curated_tokens from "@/verified/tokens"
import { useWallet } from "@meshsdk/react"
import { HandCoins, Hash, HeartHandshake, Newspaper, Users } from "lucide-react"
import { ReactNode, useEffect, useState } from "react"
import { toast } from "sonner"

export default function Explore() {
  const { address, connected } = useWallet();
  const [finbyte_stats, set_finbyte_stats] = useState<finbyte_general_stats | null>(null);
  const [connected_user_details, set_connected_user_details] = useState<platform_user_details | null>(null);

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
    get_stats();

    /** @note connecting doesnt instantly get the address, wait until we have it */
    if (connected && address) {
      get_user_details();
    }
  }, [connected]);

  interface stat_item { title: string; data: string | number; }
  const stat_items: stat_item[] = [
    { title: 'Total Posts', data: finbyte_stats?.total_posts ?? 0 },
    { title: 'Feed Posts', data: finbyte_stats?.forum_posts ?? 0 },
    { title: 'Unique Users', data: finbyte_stats?.unique_users ?? 0},
    { title: 'Interactions', data: finbyte_stats?.interactions ?? 0},
    { title: 'Curated Projects', data: curated_tokens.length },
  ];

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation />
      <div className="container mx-auto px-4 pt-16 pb-20 md:pb-4 md:pt-20">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5 lg:grid-cols-8">
          <div className="hidden md:col-span-1 md:block lg:col-span-2 lg:w-[90%]">
            <Sidebar />
          </div>

          <div className="col-span-1 md:col-span-4 lg:col-span-4">
            <div className="w-full flex flex-col gap-4">
              <ExploreProjects />
            </div>
          </div>

          <div className="hidden lg:col-span-2 lg:block">
            <div className="sticky top-20 space-y-4">
              <div className="rounded-xl border dark:border-slate-800 bg-card p-4 shadow">
                <h2 className="mb-4 font-semibold">Finbyte Stats</h2>
                <div className="space-y-4">
                  {stat_items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div>
                          <p className="text-sm font-medium">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.data}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="lg:hidden pt-4">
          <div className="sticky top-20 space-y-4">
            <div className="rounded-xl border dark:border-slate-800 bg-card p-4 shadow">
              <h2 className="mb-4 font-semibold">Finbyte Stats</h2>
              <div className="space-y-4">
                {stat_items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.data}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
      <MobileNavigation />
    </div>
  )
}
