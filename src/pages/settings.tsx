
import { LoadingDots } from "@/components/loading-dots"
import SettingsFinbyte from "@/components/settings/finbyte"
import { fetch_user_data } from "@/utils/api/account/fetch"
import { platform_user_details } from "@/utils/interfaces"
import { useWallet } from "@meshsdk/react"
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
      set_connected_user_details(null);
      router.push('/');
    }
  }, [connected, address]);

  const bookmarked_posts = connected_user_details?.bookmarked_posts;
  const following_users = connected_user_details?.following;
  const muted_users = connected_user_details?.muted;
  const badges = connected_user_details?.badges;

  const get_bookmarked_posts = async () => { }

  const right_sidebar_contents = (<></>);

  return (
    <>
      <Head>
        <title>Settings - Finbyte</title>
      </Head>

      <DefaultLayout right_sidebar={right_sidebar_contents}>
        <div className="flex flex-col gap-2 pb-4">
          <h1 className="text-xl font-semibold">
            Wallet Settings
          </h1>
        </div>

        {connected_user_details ?
          <SettingsFinbyte
            user_details={connected_user_details}
          />
          :
          <LoadingDots />
        }
      </DefaultLayout>
    </>
  )
}
