import FinPieChart from "@/components/fin-piechart"
import FormatAddress from "@/components/format-address"
import MobileNavigation from "@/components/mobile-navigation"
import Sidebar from "@/components/sidebar"
import TopNavigation from "@/components/top-navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { fetch_user_data } from "@/utils/api/account/fetch"
import { asset_address, bf_specific_asset, get_asset_addresses, get_specific_asset } from "@/utils/api/external/blockfrost"
import { get_tfin_requests, send_request_tfin } from "@/utils/api/tFIN"
import { copy_to_clipboard } from "@/utils/common"
import { moderation_addresses } from "@/utils/consts"
import { format_atomic, format_long_string, format_unix } from "@/utils/format"
import { platform_user_details, tfin_requests_data } from "@/utils/interfaces"
import { useWallet } from "@meshsdk/react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function Home() {
  const { address, connected } = useWallet();
  const [finbyte_token_details, set_finbyte_token_details] = useState<bf_specific_asset | null>(null);
  const [finbyte_asset_address, set_finbyte_asset_address] = useState<asset_address[] | null>(null);
  const [tfin_requests, set_tfin_requests] = useState<tfin_requests_data[] | null>(null);
  
  const get_tfin_data = async () => {
    const bf_specific_asset = await get_specific_asset('37524129746446a5a55da896fe5379508244ea85e4c140156badbdc67446494e');
    if (bf_specific_asset.error) {
      toast.error(bf_specific_asset.error);
      return;
    }
    if (bf_specific_asset.data) {
      set_finbyte_token_details(bf_specific_asset.data);
    }

    const bf_asset_addresses = await get_asset_addresses('37524129746446a5a55da896fe5379508244ea85e4c140156badbdc67446494e');
    if (bf_asset_addresses.error) {
      toast.error(bf_asset_addresses.error);
      return;
    }
    if (bf_asset_addresses.data) {
      set_finbyte_asset_address(bf_asset_addresses.data);
    }

    const tfin_requests = await get_tfin_requests();
    if (tfin_requests.error) {
      toast.error(tfin_requests.error);
      return;
    }
    if (tfin_requests.data) {
      set_tfin_requests(tfin_requests.data);
    }
  }

  const handle_request_tfin = async () => {
    if (tfin_requests?.some(a=> a.address === address)) {
      toast.error('This wallet has already requested $tFIN.')
      return;
    }

    const request_tfin = await send_request_tfin(address);
    if (request_tfin.error) {
      toast.error(request_tfin.error);
      return;
    }
    if (request_tfin.requested) {
      await get_tfin_data();
    }
  }

  useEffect(() => {
    get_tfin_data();
  }, [connected]);

  const token_details = [
    { title: 'Unique Holders', data: finbyte_asset_address?.length.toLocaleString() ?? 0 },
    {
      title: 'Total Supply',
      data: (() => {
        const supply = format_atomic(4, Number(finbyte_token_details?.quantity ?? 0));
        const [intPart, decPart] = supply.toLocaleString(undefined, { minimumFractionDigits: 4 }).split('.');
        return (
          <span>
            {intPart}.
            <span className="text-muted-foreground text-sm">{decPart}</span>
          </span>
        );
      })() },
    { title: 'Decimals', data: 4 },
    { title: 'Policy ID', data: format_long_string(finbyte_token_details?.policy_id ?? '') },
    { title: 'Asset Name', data: finbyte_token_details?.asset_name },
    { title: 'Fingerprint', data: format_long_string(finbyte_token_details?.fingerprint ?? '') },
    { title: 'Mint Hash', data: format_long_string(finbyte_token_details?.initial_mint_tx_hash ?? '') },
    { title: '$tFIN Requests', data: tfin_requests?.length ?? 0 },
  ]


  return (
    <div className="min-h-screen bg-background">
      <TopNavigation />
      <div className="container mx-auto px-4 pt-16 pb-20 md:pb-4 md:pt-20">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5 lg:grid-cols-8">
          <div className="hidden md:col-span-1 md:block lg:col-span-2 lg:w-[90%]">
            <Sidebar />
          </div>

          <div className="col-span-1 md:col-span-4 lg:col-span-4 scroll-smooth">
            <h1 className="text-xl font-medium">
              Welcome to the $tFIN hub 
            </h1>

            <div className="flex flex-wrap gap-4 justify-center mt-4">
              {token_details.map((item, index) => (
                <div key={index} onClick={() => copy_to_clipboard(item.data as string)} className="hover:-translate-y-0.5 duration-300 cursor-copy py-2 px-4 bg-secondary rounded-xl">
                  <h1 className="font-semibold text-sm text-muted-foreground">
                    {item.title}
                  </h1>

                  <p className="text-lg">
                    {item.data}
                  </p>
                </div>
              ))}
            </div>

            <div id="about" className="mt-6">
              <h1 className="text-xl font-semibold">
                About Finbyte
              </h1>

              <p>
                Finbyte is a decentralized social platform built on the Cardano blockchain,
                designed to reward meaningful engagement and empower users to support
                communities, creators, and projects they believe in. After nearly two
                years of development, we're proud to introduce the Finbyte Network to
                the world, starting with the launch of our testnet token, tFIN.
              </p>

              <h1 className="text-xl font-semibold mt-6">
                Testnet Launch: Try tFIN on Cardano Preprod
              </h1>

              <p>
                We're beginning our rollout on the Cardano Pre-Production testnet.
                This allows us to safely test all aspects of Finbyte's token economy,
                wallet integrations, and community tools before going live on mainnet
                with our real token, $FIN.
              </p>

              <div className="p-4 border-l bg-secondary rounded-r-xl my-10">
                <h1 className="font-semibold">How to join:</h1>

                <div className="my-2 text-sm pl-4">
                  <ol className="list-disc list-outside space-y-1">
                    <li>
                      <p>
                        Make sure your wallet (e.g. Eternl, Nami, Lace) is connected to the
                        Pre-Production Testnet under your wallet's network settings.
                      </p>
                    </li>
                    <li>
                      <p>
                        Request tokens by clicking the Request $tFIN button below.
                        You can view the status of all the requests below.
                      </p>
                    </li>
                  </ol>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between items-center gap-2">
                  <h1 className="font-semibold">
                    $tFIN Requests
                  </h1>

                  <Button size='sm' variant='secondary' onClick={handle_request_tfin} disabled={tfin_requests?.some(a => a.address === address) || !connected}>
                    Request $tFIN
                  </Button>
                </div>

                <ScrollArea>
                  <div className="max-h-96 pt-4">
                    <div className="flex flex-col gap-2">
                      {tfin_requests && tfin_requests.map((item, index) => (
                        <div key={index} className={`w-full flex flex-col gap-2 bg-secondary rounded-lg p-2 px-4 ${address === item.address ? 'border dark:border-slate-500' : ''}`}>
                          <div className="flex gap-2 items-center">
                            <FormatAddress address={item.address} large_size />

                            <h1>
                              {format_unix(item.requested_timestamp).time_ago}
                            </h1>

                            <div className="ml-auto flex gap-2">
                              {item.tx_hash ?
                                <Link target="_blank" href={item.tx_hash}>
                                  <Button size={'sm'}>
                                    View Transaction
                                  </Button>
                                </Link>
                                :
                                <Button size={'sm'} variant='destructive' disabled>
                                  Not Fulfilled
                                </Button>
                              }
                              {moderation_addresses.includes(address) && (
                                <Button size='sm'>
                                  Marked Fulfilled
                                </Button>
                              )}
                            </div>
                          </div>

                        </div>
                      ))}

                      {tfin_requests?.length === 0 && (
                        <div>
                          No requests found.
                        </div>
                      )}
                    </div>
                  </div>
                </ScrollArea>
              </div>

              <h1 className="text-xl font-semibold mt-6 lg:mt-12">
                A New Kind of Social Network
              </h1>

              <p>
                Finbyte is not just a social media platform, it's a community-powered network.
                Our goal is to build a space where your voice, support, and contributions carry
                real value. On Finbyte, engagement is currency. You can:
              </p>

              <div className="mt-2">
                <ol className="list-disc list-inside space-y-1">
                  <li><span className="font-semibold">Earn tokens</span> by liking, posting, commenting, or participating in verified Cardano initiatives.</li>
                  <li><span className="font-semibold">Support other communities or creators</span> by tipping or donating tokens, helping them grow their presence.</li>
                  <li><span className="font-semibold">Stake your tokens</span> to earn passive rewards and unlock additional benefits over time.</li>
                  <li><span className="font-semibold">Participate in governance</span> and help shape the future of Finbyte.</li>
                </ol>
              </div>

              <h1 className="text-xl font-semibold mt-6">
                Why Own $FIN?
              </h1>

              <p>
                While you can earn $FIN through engagement, there are powerful reasons to hold and buy the token too:
              </p>

              <div className="mt-2">
                <ol className="list-disc list-inside space-y-1">
                  <li><span className="font-semibold">Access exclusive features</span> and tools on the platform (priority feeds, advanced analytics, creator boosts).</li>
                  <li><span className="font-semibold">Participate in project funding</span> or unlock badges and support roles within other communities.</li>
                  <li><span className="font-semibold">Earn staking rewards</span> by locking up your $FIN in the protocol.</li>
                  <li><span className="font-semibold">Support the broader Cardano ecosystem</span> by empowering verified projects directly through your Finbyte activity.</li>
                </ol>
              </div>
              
              <p>Every transaction on Finbyte fuels a circular economy where value stays with the community, not with centralized platforms.</p>
            </div>

            <div id="distribution" />
            <FinPieChart />
          </div>

          <div className="hidden lg:col-span-2 lg:block">
            <div className="sticky top-20 space-y-4">
              <Card className="p-4">
                <h1 className="text-muted-foreground font-semibold text-sm">Quick Links</h1>
                <div className="mt-2">
                  <ol className="list-disc list-inside space-y-1 text-sm">
                    <li>
                      Get tADA from the{' '}
                      <Link
                        className="dark:text-blue-400 text-blue-500"
                        target="_blank"
                        href="https://docs.cardano.org/cardano-testnets/tools/faucet"
                      >
                        Cardano Faucet
                      </Link>.
                    </li>

                    <li>
                      View on{' '}
                      <Link
                        className="dark:text-blue-400 text-blue-500"
                        target="_blank"
                        href="https://preprod.cardanoscan.io/token/37524129746446a5a55da896fe5379508244ea85e4c140156badbdc67446494e?tab=minttransactions"
                      >
                        Preprod Cardanoscan
                      </Link>.
                    </li>

                    <li>
                      View {' '}
                      <Link
                        className="dark:text-blue-400 text-blue-500"
                        href="#about"
                      >
                        Token Details
                      </Link>.
                    </li>

                    <li>
                      View {' '}
                      <Link
                        className="dark:text-blue-400 text-blue-500"
                        href="#distribution"
                      >
                        Distribution Plans
                      </Link>.
                    </li>
                  </ol>
                </div>

              </Card>
            </div>
          </div>
        </div>

        <div className="lg:hidden pt-4">
          <div className="sticky top-20 space-y-4">
            <Card className="p-4">
              <h1 className="text-muted-foreground font-semibold text-sm">Quick Links</h1>
              <div className="mt-2">
                <ol className="list-disc list-inside space-y-1 text-sm">
                  <li>
                    Get tADA from the{' '}
                    <Link
                      className="dark:text-blue-400 text-blue-500"
                      target="_blank"
                      href="https://docs.cardano.org/cardano-testnets/tools/faucet"
                    >
                      Cardano Faucet
                    </Link>.
                  </li>

                  <li>
                    View on{' '}
                    <Link
                      className="dark:text-blue-400 text-blue-500"
                      target="_blank"
                      href="https://preprod.cardanoscan.io/token/37524129746446a5a55da896fe5379508244ea85e4c140156badbdc67446494e?tab=minttransactions"
                    >
                      Preprod Cardanoscan
                    </Link>.
                  </li>

                  <li>
                    View {' '}
                    <Link
                      className="dark:text-blue-400 text-blue-500"
                      href="#about"
                    >
                      Token Details
                    </Link>.
                  </li>

                  <li>
                    View {' '}
                    <Link
                      className="dark:text-blue-400 text-blue-500"
                      href="#distribution"
                    >
                      Distribution Plans
                    </Link>.
                  </li>
                </ol>
              </div>
            </Card>
          </div>
        </div>
      </div>
      <MobileNavigation />
    </div>
  )
}
