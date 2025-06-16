
import FormatAddress from "@/components/format-address"
import { LoadingDots } from "@/components/loading-dots"
import MobileNavigation from "@/components/default-layout/mobile-navigation"
import ProfileAdminPanel from "@/components/profile/admin-panel"
import ProfileFinbyteStats from "@/components/profile/finbyte-stats"
import ProfileWalletInfo from "@/components/profile/wallet-info"
import Sidebar from "@/components/default-layout/sidebar"
import TopNavigation from "@/components/default-layout/top-navigation"
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
import DefaultLayout from "@/components/default-layout"
import Head from "next/head"

export default function Profile() {
  const { address, connected } = useWallet();
  const router = useRouter();

  const [connected_user_details, set_connected_user_details] = useState<platform_user_details | null>(null);
  const [refreshing_state, set_refreshing_state] = useState(false);

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

  useEffect(() => {
    if (connected && address) {
      get_user_details();
    }
    if (!connected) {
      router.push('/')
    }
  }, [connected, address]);

  const get_bookmarked_posts = async () => { }

  const right_sidebar_contents = (
    <>
    </>
  );

  return (
    <>
      <Head>
        <title>Profile - Finbyte</title>
      </Head>

      <DefaultLayout right_sidebar={right_sidebar_contents}>
        <div className="flex flex-col gap-4 pb-4">
          <div className="flex gap-2 items-center">
            <Avatar className="size-14 rounded-xl">
              <UserAvatar address={address} />
              <AvatarFallback>{address.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-0.5">
              <FormatAddress large_size address={address} />
              <div className="flex items-center gap-2">
                {connected_user_details?.badges && connected_user_details?.badges.map((badge, index) => (
                  <div key={index} className="text-center text-xs border border-muted-foreground px-2 py-0.5 rounded-lg">
                    {capitalize_first_letter(badge)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {connected_user_details ?
          <ProfileFinbyteStats
            user_details={connected_user_details}
          />
          :
          <LoadingDots />
        }
      </DefaultLayout>
    </>
  )
}
