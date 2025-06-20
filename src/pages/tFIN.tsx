import AboutTFinToken from "@/components/about-tfin"
import FormatAddress from "@/components/format-address"
import SocialIcon from "@/components/social-icons"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { asset_address, bf_specific_asset, get_asset_addresses, get_specific_asset } from "@/utils/api/external/blockfrost"
import { get_tfin_requests, send_request_tfin } from "@/utils/api/tFIN"
import { copy_to_clipboard } from "@/utils/common"
import { format_atomic, format_long_string, format_unix } from "@/utils/format"
import { tfin_requests_data } from "@/utils/interfaces"
import finbyte_constributors from "@/verified/contributors"
import { useWallet } from "@meshsdk/react"
import { Plus } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import DefaultLayout from "@/components/default-layout"
import { PlatformQuickLinks } from "@/components/default-layout/right-sidebar"
import Head from "next/head"

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
  const right_sidebar_contents = (
    <>
      <PlatformQuickLinks/>
    </>
  )

  return (
    <>
      <Head>
        <title>$tFIN - Finbyte</title>
      </Head>

      <DefaultLayout right_sidebar={right_sidebar_contents}>
        <div className="scroll-smooth">
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

          <hr className="mt-12 w-3/4 mx-auto dark:border-slate-800" />

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
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </div>

            <hr className="mt-12 w-3/4 mx-auto dark:border-slate-800" />

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

          <div className="mt-6" />
          <h1 className="text-xl font-semibold">
            Meet The Contributors & Team
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full mt-2">
            {finbyte_constributors.map((user, index) => (
              <div key={index} className="w-full p-4 bg-secondary rounded-xl">
                <img src={user.image} className="mx-auto rounded-lg" />

                <h1 className="text-sm text-muted-foreground text-center mt-2">
                  {user.name}
                </h1>

                <div className="flex flex-wrap gap-1 items-center justify-center mt-2">
                  {user.roles.map((item) => (
                    <div key={item} className="text-xs font-medium px-2 p-1 rounded-lg border dark:border-slate-700">
                      {item}
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1 items-center justify-center mt-2">
                  {Object.entries(user.links).map(([key, value]) => (
                    <SocialIcon key={key} only_icon={false} name={key} link={value} />
                  ))}
                </div>
              </div>
            ))}

            <div className="w-full h-full p-4 bg-secondary rounded-xl flex flex-col justify-center">
              <Plus className="w-24 mx-auto rounded-lg" />

              <div className="text-sm text-muted-foreground text-center mt-2">
                <span className="text-primary font-semibold text-base">This could be you!</span>
                <br />
                Get in touch now to learn how.
              </div>

              <div className="flex flex-wrap gap-1 items-center justify-center mt-2">
                <div className="text-xs font-medium px-2 p-1 rounded-lg border dark:border-slate-700">
                  Contributor
                </div>
              </div>

              <div className="flex flex-wrap gap-1 items-center justify-center mt-2">
                <SocialIcon only_icon={false} name={'discord'} link={'https://discord.gg/EVawcspwyp'} />
                <SocialIcon only_icon={false} name={'x'} link={'https://www.x.com/adaFinbyte'} />
                <SocialIcon only_icon={false} name={'website'} link={'https://finbyte.network/'} />
              </div>
            </div>
          </div>

          <hr className="mt-12 w-3/4 mx-auto dark:border-slate-800" />

          <div id="distribution" />
          <AboutTFinToken />
        </div>
      </DefaultLayout>
    </>
  )
}
