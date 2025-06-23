import TokenDistribution from "@/components/tFIN/distribution"
import { asset_address, bf_specific_asset, get_asset_addresses, get_specific_asset } from "@/utils/api/external/blockfrost"
import { get_tfin_requests, send_request_tfin } from "@/utils/api/tFIN"
import { capitalize_first_letter, copy_to_clipboard } from "@/utils/common"
import { format_atomic, format_long_string, format_to_readable_number, format_unix } from "@/utils/format"
import { tfin_requests_data } from "@/utils/interfaces"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import DefaultLayout from "@/components/default-layout"
import { PlatformQuickLinks, PlatformStats } from "@/components/default-layout/right-sidebar"
import Head from "next/head"
import TokenIntroduction from "@/components/tFIN/introduction"
import RequestTFin from "@/components/tFIN/request"
import { TFIN_MINT_ADDRESS, TFINBYTE_UNIT } from "@/utils/consts"
import { Button } from "@/components/ui/button"
import { useWallet } from "@meshsdk/react"

export default function Home() {
  const { address, connected } = useWallet();

  const [finbyte_token_details, set_finbyte_token_details] = useState<bf_specific_asset | null>(null);
  const [finbyte_asset_address, set_finbyte_asset_address] = useState<asset_address[] | null>(null);
  const [tfin_requests, set_tfin_requests] = useState<tfin_requests_data[] | null>(null);
  const [tfin_circulating, set_tfin_circulating] = useState<number>(0);

  const get_tfin_data = async () => {
    const bf_specific_asset = await get_specific_asset(TFINBYTE_UNIT);
    if (bf_specific_asset.error) {
      toast.error(bf_specific_asset.error);
      return;
    }
    if (bf_specific_asset.data) {
      set_finbyte_token_details(bf_specific_asset.data);
    }

    const bf_asset_addresses = await get_asset_addresses(TFINBYTE_UNIT);
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

    const calculate_circulating = () => {
      if (!bf_asset_addresses.data) { return; }
      const mint_address = bf_asset_addresses.data.find(a => a.address === TFIN_MINT_ADDRESS);

      const supply = format_atomic(4, Number(bf_specific_asset.data?.quantity ?? 0)) as number;
      const mint_balance = format_atomic(4, Number(mint_address?.quantity ?? 0)) as number;
      const circulating = supply - mint_balance;
      return circulating;
    }
    const circulating = calculate_circulating();
    if (circulating) {
      set_tfin_circulating(circulating)
    }
  }

  const handle_request_tfin = async () => {
    if (!address) { return; }
    if (tfin_requests?.some(a => a.address === address)) {
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
      title: 'Total Supply: ' + format_to_readable_number(format_atomic(4, Number(finbyte_token_details?.quantity ?? 0)) as number),
      data: (() => {
        const supply = format_atomic(4, Number(finbyte_token_details?.quantity ?? 0));
        const [intPart, decPart] = supply.toLocaleString(undefined, { minimumFractionDigits: 4 }).split('.');
        return (
          <span>
            {intPart}.
            <span className="text-muted-foreground text-sm">{decPart}</span>
          </span>
        );
      })()
    },
    {
      title: 'Circulating Supply',
      data: (() => {
        const [intPart, decPart] = tfin_circulating.toLocaleString(undefined, { minimumFractionDigits: 4 }).split('.');
        return (
          <span>
            {intPart}.
            <span className="text-muted-foreground text-sm">{decPart}</span>
          </span>
        );
      })()
    },
    { title: 'Decimals', data: 4 },
    { title: 'Policy ID', data: format_long_string(finbyte_token_details?.policy_id ?? '') },
    { title: 'Asset Name', data: finbyte_token_details?.asset_name },
    { title: 'Fingerprint', data: format_long_string(finbyte_token_details?.fingerprint ?? '') },
    { title: 'Mint Hash', data: format_long_string(finbyte_token_details?.initial_mint_tx_hash ?? '') },
    { title: '$tFIN Requests', data: tfin_requests?.length ?? 0 },
  ];

  const table_of_contents = [
    'Request tFIN', 'introduction', 'Distribution Ideas'
  ]
  const right_sidebar_contents = (
    <>
      <PlatformStats/>
      <PlatformQuickLinks />
    </>
  )

  return (
    <>
      <Head>
        <title>$tFIN - Finbyte</title>
      </Head>

      <DefaultLayout right_sidebar={right_sidebar_contents}>
        <div className="scroll-smooth">
          <h1 className="text-2xl text-center font-medium">
            Welcome to the $tFIN hub
          </h1>

          <h1 className="text-xl font-medium pt-4 lg:pt-8">
            $tFIN Details
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

          <h1 className="text-sm text-center font-medium pt-4 lg:pt-8">
            Contents
          </h1>

          <div className="flex items-center justify-center gap-2 mt-2">
            {table_of_contents.map((item, index) => (
              <a href={'#' + item} key={index}>
                <Button variant='outline' size='sm'>
                  {capitalize_first_letter(item)}
                </Button>
              </a>
            ))}
          </div>

          <hr className="mt-12 w-3/4 mx-auto dark:border-slate-800" />

          <div id="about" className="mt-6" />
          <div className="space-y-4">
            <h1 className="text-xl font-semibold">
              About Finbyte
            </h1>

            <p>
              Finbyte is a Cardano-native forum platform designed for the crypto-savvy and
              community-minded. Inspired by the simplicity of Reddit, Finbyte goes further by
              offering powerful on-chain tools, token-based engagement, and an open-source
              foundation for transparency and growth. Whether you're looking to discuss crypto
              topics, explore tokens, or support projects directly, Finbyte puts it all at your
              fingertips.
            </p>

            <p>
              Finbyte is a decentralized social platform built on the Cardano blockchain,
              designed to reward meaningful engagement and empower users to support
              communities, creators, and projects they believe in. After nearly two
              years of development, we're proud to introduce the Finbyte Network to
              the world, starting with the launch of our testnet token, tFIN.
            </p>
          </div>

          <div id="Request tFIN" className="mt-6" />
          <RequestTFin
            tfin_requests={tfin_requests}
            handle_request_tfin={handle_request_tfin}
          />

          <hr className="mt-12 w-3/4 mx-auto dark:border-slate-800" />

          <div id="introduction" className="mt-6" />
          <TokenIntroduction />

          <hr className="mt-12 w-3/4 mx-auto dark:border-slate-800" />

          <div id="Distribution Ideas" />
          <TokenDistribution />
        </div>
      </DefaultLayout>
    </>
  )
}
