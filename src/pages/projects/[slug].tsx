
import { LoadingDots } from "@/components/loading-dots"
import MobileNavigation from "@/components/mobile-navigation"
import ProjectsCommunityFeed from "@/components/projects/community-feed"
import ProjectsInformation from "@/components/projects/project-info"
import Sidebar from "@/components/sidebar"
import SocialIcon from "@/components/social-icons"
import TopNavigation from "@/components/top-navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetch_user_data } from "@/utils/api/account/fetch"
import { fetch_community_data } from "@/utils/api/community/fetch"
import { get_pool_pm_asset, pool_pm_fingerprint } from "@/utils/api/external/pool-pm"
import { platform_user_details, project_community_data } from "@/utils/interfaces"
import { curated_token } from "@/verified/interfaces"
import curated_tokens from "@/verified/tokens"
import { useWallet } from "@meshsdk/react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function Home() {
  const { address, connected } = useWallet();
  const router = useRouter();

  const [connected_user_details, set_connected_user_details] = useState<platform_user_details | null>(null);
  const [found_token, set_found_token] = useState<curated_token | null>(null);
  const [current_tab, set_current_tab] = useState("info");
  const [refreshing_state, set_refreshing_state] = useState(false);
  const [community_data, set_community_data] = useState<project_community_data | null>(null);
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
      toast.error(user_details.error);
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

  useEffect(() => {
    get_pool_pm_details();

    if (found_token) {
      get_community_data();
    }

    /** @note connecting doesnt instantly get the address, wait until we have it */
    if (connected && address) {
      get_user_details();
    }
  }, [connected, found_token]);

  return found_token ? (
    <div className="min-h-screen bg-background">
      <TopNavigation />
      <div className="container mx-auto px-4 pt-16 pb-20 md:pb-4 md:pt-20">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5 lg:grid-cols-8">
          <div className="hidden md:col-span-1 md:block lg:col-span-2 lg:w-[90%]">
            <Sidebar />
          </div>

          <div className="col-span-1 md:col-span-4 lg:col-span-4">
            <div className="flex w-full gap-4 items-center justify-between">
              <h1 className="font-semibold text-lg">
                <span className="text-base text-muted-foreground">Welcome to the</span><br />
                {found_token.name} Community Page
              </h1>

              <img src={found_token.images.logo} className="size-10 mx-4"/>
            </div>

            <hr className="dark:border-slate-700 my-2"/>

            <Card>
              <CardHeader className="p-4 pb-4">
                <Tabs defaultValue={current_tab} className="w-full">
                  <TabsList className="w-full">
                    <TabsTrigger value="info" onClick={() => set_current_tab('info')} className="flex-1">
                      Project Information
                    </TabsTrigger>
                    <TabsTrigger value="community_feed" onClick={() => set_current_tab('community_feed')} disabled className="flex-1">
                      Community Feed
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
                  />
                )}

                {current_tab === 'community_feed' && (
                  <ProjectsCommunityFeed
                    refreshing_state={refreshing_state}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          <div className="hidden lg:col-span-2 lg:block">
            <div className="sticky top-20 space-y-2">
              <h1 className="font-semibold text-sm opacity-80">Discover more from {found_token.name}</h1>
              {found_token.finbyte?.collection?.map((item, index) => (
                <Link key={index} href={item.url} target="_blank" className="py-2 px-4 hover:-translate-y-0.5 duration-300 bg-secondary rounded-xl flex w-full justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <h1 className="font-semibold text-sm">
                      {item.title}
                    </h1>
                    <p className="text-xs">
                      {item.description}
                    </p>
                  </div>
                  <img src={item.image} className="size-10 my-auto"/>
                </Link>
              ))}

              <h1 className="font-semibold text-sm opacity-80 pt-2">Follow {found_token.name}</h1>
              <div className="flex flex-wrap gap-1">
                {Object.entries(found_token.links).map(([key, value], index) => (
                  <SocialIcon key={index} name={key} link={value} only_icon={false} />
                ))}
              </div>

            </div>
          </div>
        </div>

        <div className="lg:hidden pt-4">
          <div className="sticky top-20 space-y-2">
            <h1 className="font-semibold text-sm opacity-80">Discover more from {found_token.name}</h1>
            {found_token.finbyte?.collection?.map((item, index) => (
              <Link key={index} href={item.url} target="_blank" className="py-2 px-4 hover:-translate-y-0.5 duration-300 bg-secondary rounded-xl flex w-full justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <h1 className="font-semibold text-sm">
                    {item.title}
                  </h1>
                  <p className="text-xs">
                    {item.description}
                  </p>
                </div>
                <img src={item.image} className="size-10 my-auto" />
              </Link>
            ))}

            <h1 className="font-semibold text-sm opacity-80 pt-2">Follow {found_token.name}</h1>
            <div className="flex flex-wrap gap-1">
              {Object.entries(found_token.links).map(([key, value], index) => (
                <SocialIcon key={index} name={key} link={value} only_icon={false} />
              ))}
            </div>

          </div>
        </div>
      </div>
      <MobileNavigation />
    </div>
  ) : (
    <LoadingDots/>
  )
}
