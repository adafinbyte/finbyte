
import { LoadingDots } from "@/components/loading-dots"
import MobileNavigation from "@/components/default-layout/mobile-navigation"
import ProjectsCommunityFeed from "@/components/projects/community-board/community-feed"
import ProjectsInformation from "@/components/projects/project-info"
import Sidebar from "@/components/default-layout/sidebar"
import SocialIcon from "@/components/social-icons"
import TopNavigation from "@/components/default-layout/top-navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetch_user_data } from "@/utils/api/account/fetch"
import { fetch_community_data } from "@/utils/api/community/fetch"
import { get_pool_pm_asset, pool_pm_fingerprint } from "@/utils/api/external/pool-pm"
import { fetch_community_posts } from "@/utils/api/posts/fetch"
import { community_post_data, platform_user_details, project_community_data } from "@/utils/interfaces"
import { curated_token } from "@/verified/interfaces"
import curated_tokens from "@/verified/tokens"
import { useWallet } from "@meshsdk/react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import DefaultLayout from "@/components/default-layout"
import { ProjectDiscover, ProjectLinks } from "@/components/default-layout/right-sidebar"
import Head from "next/head"

export default function Home() {
  const { address, connected } = useWallet();
  const router = useRouter();

  const [connected_user_details, set_connected_user_details] = useState<platform_user_details | null>(null);
  const [found_token, set_found_token] = useState<curated_token | null>(null);
  const [current_tab, set_current_tab] = useState("info");
  const [refreshing_state, set_refreshing_state] = useState(false);
  const [community_data, set_community_data] = useState<project_community_data | null>(null);
  const [community_posts, set_community_posts] = useState<community_post_data[] | null>(null);
  const [poolpm_fp_data, set_poolpm_fp_data] = useState<pool_pm_fingerprint | null>(null);

  useEffect(() => {
    const slug_id = router.asPath.split('/').pop();
    if (!slug_id) return;

    const token = curated_tokens.find(a => a.slug_id === slug_id);
    if (token) {
      set_found_token(token);
    }
  }, [router.asPath]);
  
  const get_user_details = async () => {
    const user_details = await fetch_user_data(address);
    if (user_details.error) {
      toast.error('Failed to get User Details.', { description: user_details.error });
      return;
    }
    if (user_details.data) {
      set_connected_user_details(user_details.data);
    }
  }

  const get_pool_pm_details = async () => {
    if (!found_token) { return; }
    if (found_token.token_details.fingerprint) {
      const poolpm_fingerprint = await get_pool_pm_asset(found_token.token_details.fingerprint);
      if (poolpm_fingerprint) {
        set_poolpm_fp_data(poolpm_fingerprint);
      }
    }
  }

  const get_community_data = async () => {
    if (!found_token) { return; }
    const data = await fetch_community_data(found_token.slug_id);
    if (data.error) {
      toast.error(data.error);
      return;
    }
    if (data.data) {
      set_community_data(data.data);
    }
  }

  const get_community_posts = async () => {
    set_refreshing_state(true);
    if (!found_token) { return; }
    const posts = await fetch_community_posts(found_token.slug_id);
    if (posts.error) {
      toast.error(posts.error)
      return;
    }
    if (posts.data) {
      set_community_posts(posts.data);
    }
    set_refreshing_state(false);
  }

  useEffect(() => {
    get_pool_pm_details();

    if (found_token) {
      get_community_data();
      get_community_posts();
    }

    /** @note connecting doesnt instantly get the address, wait until we have it */
    if (connected && address) {
      get_user_details();
    } else {
      set_connected_user_details(null);
    }
  }, [connected, found_token]);

  const right_sidebar_contents = (
    <>
      <ProjectDiscover token={found_token}/>
      <ProjectLinks token={found_token}/>
    </>
  )

  return (
    <>
      <Head>
        <title>{found_token?.name ?? 'Token Page'} - Finbyte</title>
      </Head>

      <DefaultLayout right_sidebar={right_sidebar_contents}>
        {found_token ? (
          <>
            <div className="flex w-full gap-4 items-center justify-between">
              <h1 className="font-semibold text-lg">
                <span className="text-base text-muted-foreground">Welcome to the</span><br />
                {found_token.name} Community Page
              </h1>

              <img src={found_token.images.logo} className="size-10 mx-4" />
            </div>

            <hr className="dark:border-slate-700 my-2" />

            <Card>
              <CardHeader className="p-4 pb-4">
                <Tabs value={current_tab} defaultValue={current_tab} className="w-full">
                  <TabsList className="w-full">
                    <TabsTrigger value="info" onClick={() => set_current_tab('info')} className="flex-1">
                      Project Information
                    </TabsTrigger>
                    <TabsTrigger value="community_feed" onClick={() => set_current_tab('community_feed')} className="flex-1">
                      Community Feed {'(' + (community_posts?.length ?? 0) + ')'}
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>

              <CardContent className="p-0">
                {current_tab === 'info' && (
                  <ProjectsInformation
                    token_details={found_token}
                    poolpm_fp_data={poolpm_fp_data}
                    community_data={community_data}
                    get_community_data={get_community_data}
                    change_tab={() => set_current_tab('community_feed')}
                  />
                )}

                {current_tab === 'community_feed' && (
                  <ProjectsCommunityFeed
                    refreshing_state={refreshing_state}
                    community_posts={community_posts}
                    get_posts={get_community_posts}
                    token={found_token}
                  />
                )}
              </CardContent>
            </Card>
          </>
        ) : (
          <LoadingDots />
        )}
      </DefaultLayout>
    </>
  )
}
