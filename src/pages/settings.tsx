
import FormatAddress from "@/components/format-address"
import { LoadingDots } from "@/components/loading-dots"
import MobileNavigation from "@/components/mobile-navigation"
import ProfileAdminPanel from "@/components/profile/admin-panel"
import ProfileFinbyteStats from "@/components/profile/finbyte-stats"
import ProfileWalletInfo from "@/components/profile/wallet-info"
import SettingsFinbyte from "@/components/settings/finbyte"
import Sidebar from "@/components/sidebar"
import TopNavigation from "@/components/top-navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import UserAvatar from "@/components/user-avatar"
import { fetch_user_data } from "@/utils/api/account/fetch"
import { capitalize_first_letter, copy_to_clipboard } from "@/utils/common"
import { moderation_addresses } from "@/utils/consts"
import { platform_user_details } from "@/utils/interfaces"
import { useWallet } from "@meshsdk/react"
import { BookmarkPlus, UserMinus, Users } from "lucide-react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function Profile() {
  const { address, connected } = useWallet();
  const router = useRouter();

  const [connected_user_details, set_connected_user_details] = useState<platform_user_details | null>(null);
  const [refreshing_state, set_refreshing_state] = useState(false);

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

  useEffect(() => {
    if (connected && address) {
      get_user_details();
    }
    if (!connected) {
      router.push('/')
    }
  }, [connected, address]);

  const bookmarked_posts = connected_user_details?.bookmarked_posts;
  const following_users = connected_user_details?.following;
  const muted_users = connected_user_details?.muted;
  const badges = connected_user_details?.badges;

  const get_bookmarked_posts = async () => { }

  return (connected && address) ? (
    <div className="min-h-screen bg-background">
      <TopNavigation />
      <div className="container mx-auto px-4 pt-16 pb-20 md:pb-4 md:pt-20">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5 lg:grid-cols-8">
          <div className="hidden md:col-span-1 md:block lg:col-span-2 lg:w-[90%]">
            <Sidebar />
          </div>

          <div className="col-span-1 md:col-span-4 lg:col-span-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-xl font-semibold">
                Wallet Settings
              </h1>

              <h1 className="mt-4 text-sm text-muted-foreground font-semibold">
                Connected Wallet
              </h1>

              <div className="flex gap-2 items-center">
                <Avatar className="size-6 rounded-lg">
                  <UserAvatar address={address} />
                  <AvatarFallback>{address.charAt(0)}</AvatarFallback>
                </Avatar>

                <FormatAddress large_size address={address}/>
              </div>
            </div>

            <hr className="dark:border-slate-800 my-6 w-4/5 mx-auto" />

            {connected_user_details ?
              <SettingsFinbyte
                user_details={connected_user_details}
              />
              :
              <LoadingDots/>
            }
          </div>

          <div className="hidden lg:col-span-2 lg:block">
          </div>
        </div>

        <div className="lg:hidden pt-4">
          <div className="sticky top-20 space-y-2">
          </div>
        </div>
      </div>
      <MobileNavigation />
    </div>
  ) : (
    <div>
      <h1>
        Connect your wallet!
      </h1>
    </div>
  )
}
