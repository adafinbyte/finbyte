import Head from "next/head"

import DefaultLayout from "@/components/default-layout"
import { PlatformQuickLinks } from "@/components/default-layout/right-sidebar"
import { Card } from "@/components/ui/card";
import { capitalize_first_letter } from "@/utils/common";
import Link from "next/link";

export default function Onboard() {
  const right_sidebar_contents = (
    <>
      <PlatformQuickLinks />
    </>
  );

  /** @todo move all these to its own file */
  const cardano_wallets_browser = [
    {
      name: 'begin',
      url: 'https://begin.is/',
      img: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/21/ee/ef/21eeef00-115a-ce49-6a1b-40ba99004478/AppIcon-0-0-1x_U007emarketing-0-7-0-0-85-220.png/512x512bb.jpg',
    },
    {
      name: 'eternl',
      url: 'https://eternl.io',
      img: 'https://fluidtokens.com/assets/images/dapps/eternl.png',
    },
    {
      name: 'lace',
      url: 'https://www.lace.io/',
      img: 'https://fluidtokens.com/assets/images/dapps/lace.svg'
    },
    {
      name: 'vespr',
      url: 'https://vespr.xyz/',
      img: 'https://cdn.prod.website-files.com/614c99cf4f23700c8aa3752a/6778546056a2e86e20a557cb_VESPR%20WALLET.png',
    },
  ];
  const cardano_wallets_hw = []
  const cardano_dapps = [];
  const cardano_pools = [];
  const cardano_learn = [];

  return (
    <>
      <Head>
        <title>Cardano Onboarding - Finbyte</title>
      </Head>

      <DefaultLayout right_sidebar={right_sidebar_contents}>
        <h1 className="text-lg font-semibold">
          Cardano Onboarding
        </h1>
        <p className="text-secondary">
          Learn how to get started with Cardano
        </p>

        <div>
          <h1>
            Cardano Wallets - Browser
          </h1>
          {cardano_wallets_browser.map((wallet, index) => (
            <Link key={index} href={wallet.url} target="_blank">
              <Card className="p-4 bg-secondary/20 backdrop-blur-lg text-center">
                <h1>{capitalize_first_letter(wallet.name)}</h1>
                <img src={wallet.img} className="size-10" />
              </Card>
            </Link>
          ))}
        </div>
      </DefaultLayout>
    </>
  )
}
