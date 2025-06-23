import { platform_user_details } from "@/utils/interfaces"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import DefaultLayout from "@/components/default-layout"
import { CuratedTokens, PlatformQuickLinks, PlatformStats } from "@/components/default-layout/right-sidebar"
import Head from "next/head"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { fetch_all_finbyte_users } from "@/utils/api/misc"
import { fetch_user_data } from "@/utils/api/account/fetch"
import { LoadingDots } from "@/components/loading-dots"
import FormatAddress from "@/components/format-address"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { copy_to_clipboard } from "@/utils/common"
import Link from "next/link"
import { Card } from "@/components/ui/card"

export default function Home() {
  const [is_loading, set_is_loading] = useState(true);
  const [user_details, set_user_details] = useState<platform_user_details[] | null>(null);

  const get_address_data = async () => {
    const known_users = await fetch_all_finbyte_users();

    if (known_users?.error) {
      toast.error('Failed to get Finbyte Known Addresses.', { description: known_users.error });
      return;
    }

    if (known_users?.data) {
      const user_stats_results = await Promise.allSettled(
        known_users.data.map(user => fetch_user_data(user.address))
      );

      const enriched = user_stats_results
        .filter(res => res.status === "fulfilled" && res.value?.data)
        .map(res => (res as PromiseFulfilledResult<{ data: platform_user_details }>).value.data);

      set_user_details(enriched.sort((a, b) => b.total_kudos - a.total_kudos));
    }
  };

  useEffect(() => {
    get_address_data().finally(() => set_is_loading(false));
  }, []);

  const right_sidebar_contents = (
    <>
      <PlatformStats />
      <PlatformQuickLinks />
      <CuratedTokens/>
    </>
  )

  return (
    <>
      <Head>
        <title>Kudos - Finbyte</title>
      </Head>

      <DefaultLayout right_sidebar={right_sidebar_contents}>
        <div className="space-y-2">
          <h1 className="text-lg font-semibold">
            Finbyte Kudos Leaderboard
          </h1>

          <p className="text-sm">
            Discover the top users of the platform down below.
            The top users will be rewarded with the Finbyte Token for
            being active engagers of the platform.
          </p>

          <Card className="p-4 bg-secondary/40 background-blured-lg mt-2 space-y-2">
            <p className="text-sm text-center">
              Finbyte has set aside 50,000,000 - 50M tokens that users can earn
              through engagement on the platform. We intend payouts to be every
              epoch and with roughly 73 in a year, then that means each epoch
              distributes a total of $FIN 684,931.5068 tokens. We will either be
              using a smart contract or a token distribution system already existing
              on Cardano for this.
            </p>
            <p className="text-xs text-center font-semibold">
              Right now, we only operate on the preproduction network so we are only distributing
              the $tFIN token.
            </p>
          </Card>

          <div className="pt-2" />
          <Card className="p-4 bg-secondary/40 background-blured-lg  space-y-2 text-sm">
            <h1 className="text-muted-foreground font-semibold">
              How to earn Kudos.
            </h1>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>
                Creating, Liking and Commenting on <Link href={'/'} className="text-blue-500 dark:text-blue-400">Feed Posts</Link>
                {' and '}<Link href={'/communities'} className="text-blue-500 dark:text-blue-400">Community Message Boards</Link>.
              </li>
              <li>
                Following other users on the platform.
              </li>
              <li>
                <b>SOON</b> - Staking the Finbyte token.
              </li>
              <li>
                <b>IDEA</b> - Owning asset partner tokens or NFTs.
              </li>
              <li>
                <b>IDEA</b> - Engagement with partner platforms.
              </li>
            </ul>
          </Card>

          <div className="pt-4"/>
          {is_loading ? (
            <div className="flex justify-center py-8">
              <LoadingDots />
            </div>
          ) : (
            <table className="w-full text-center">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Address</th>
                  <th>Total Kudos</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {user_details ? user_details.map((item, index) => (
                  <tr key={index} className="bg-secondary/40 backdrop-blur-lg">
                    <td>
                      {index + 1}
                    </td>
                    <td>
                      <FormatAddress address={item.ada_handle ? item.ada_handle : item.address} />
                    </td>
                    <td>
                      {item.total_kudos}
                    </td>
                    <td className="flex gap-2 items-center justify-center">
                      <Button size='icon' variant='ghost' onClick={() => copy_to_clipboard(item.address)}>
                        <Copy />
                      </Button>
                      <Link href={`/dashboard?address=${item.address}`}>
                        <Button size='icon' variant='ghost'>
                          <img src="/finbyte.png" className="size-5" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                )) : <LoadingDots />
                }
              </tbody>
            </table>
          )}
        </div>
      </DefaultLayout>
    </>
  )
}
