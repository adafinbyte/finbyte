
import FormatAddress from "@/components/format-address"
import { LoadingDots } from "@/components/loading-dots"
import ProfileFinbyteStats from "@/components/profile/finbyte-stats"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import UserAvatar from "@/components/user-avatar"
import { fetch_user_data } from "@/utils/api/account/fetch"
import { capitalize_first_letter } from "@/utils/common"
import { full_post_data, platform_user_details } from "@/utils/interfaces"
import { useWallet } from "@meshsdk/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import DefaultLayout from "@/components/default-layout"
import Head from "next/head"
import { fetch_single_feed_post } from "@/utils/api/posts/fetch"

export default function Profile() {
  const { address, connected } = useWallet();
  const router = useRouter();

  const [connected_user_details, set_connected_user_details] = useState<platform_user_details | null>(null);
  const [bookmarked_posts_data, set_bookmarked_posts_data] = useState<full_post_data[]>([]);

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
      get_bookmarked_posts();
    }
    if (!connected) {
      set_connected_user_details(null);
      set_bookmarked_posts_data([]);
      router.push('/');
    }
  }, [connected, address]);

  const get_bookmarked_posts = async () => {
    if (!connected_user_details?.bookmarked_posts) { return; }

    const fetches = await Promise.all(
      connected_user_details.bookmarked_posts.map(post_id =>
        fetch_single_feed_post(post_id)
      )
    );

    const successful_posts = fetches
      .filter(result => result.data)
      .map(result => result.data as full_post_data);

    set_bookmarked_posts_data(successful_posts);
  }

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
            bookmarked_posts={bookmarked_posts_data}
          />
          :
          <LoadingDots />
        }
      </DefaultLayout>
    </>
  )
}
