import MobileNavigation from "@/components/mobile-navigation"
import Sidebar from "@/components/sidebar"
import TopNavigation from "@/components/top-navigation"
import { Card } from "@/components/ui/card"
import { fetch_user_data } from "@/utils/api/account/fetch"
import { platform_user_details } from "@/utils/interfaces"
import { useWallet } from "@meshsdk/react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function Home() {
  const { address, connected } = useWallet();

  const [connected_user_details, set_connected_user_details] = useState<platform_user_details | null>(null);

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

  const get_tfin_data = async () => {}

  useEffect(() => {
    get_tfin_data();

    /** @note connecting doesnt instantly get the address, wait until we have it */
    if (connected && address) {
      get_user_details();
    }
  }, [connected]);

  const total_coins = 1_000_000_000;
  const mainnet_token_alloc = [
    { title: 'Locked/Vest', data: 550_000_000 }, // cnftools should be holding this
    { title: 'Platform Rewards', data: 300_000_000 }, // core rewards
    { title: 'Extra Rewards', data: 200_000_000 }, // staking/giveaways
    { title: 'Team Funds', data: 50_000_000 }, // r&d/services
  ];
  /** @note do donut chart for mainnet_token_alloc */

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation />
      <div className="container mx-auto px-4 pt-16 pb-20 md:pb-4 md:pt-20">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5 lg:grid-cols-8">
          <div className="hidden md:col-span-1 md:block lg:col-span-2 lg:w-[90%]">
            <Sidebar />
          </div>

          <div className="col-span-1 md:col-span-4 lg:col-span-4">
            <h1 className="text-lg font-semibold text-muted-foreground">
              Welcome to the $tFIN hub 
            </h1>

            <h1 className="font-semibold opacity-60 mt-2">
              About
            </h1>
            <p>
              We have been working on the Finbyte Network for nearly two years, and we feel
              that we're finally ready to launch our testnet token, tFIN.<br />
              <br />
              By launching first on the preprod network on Cardano, we can thoroughly test
              everything needed before releasing the real token on the Cardano mainnet.<br />
              <br />
              <span className="font-semibold opacity-90">
                To participate, please ensure your wallet is connected to the "Pre-Production testnet"
                in your wallet settings.
              </span>
            </p>

            <h1 className="font-semibold opacity-60 mt-4">
              Get Started
            </h1>

            <div>
              <ol className="list-decimal list-inside space-y-1">
                <li>
                  Make sure you select "Preprod Testnet" for the environment and enter your address.
                </li>
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
              </ol>
            </div>

            <hr className="dark:border-slate-700 my-4" />

            <h1 className="font-semibold opacity-60 mt-4">
              Get $tFIN
            </h1>

            <p>
              Here, we should have an option, while we're in preprod, to allow the user
              to get a bunch of tokens from a faucet like function so they can start
              engaging with the platform using $tFIN.
            </p>

            <h1 className="font-semibold opacity-60 mt-4">
              $tFIN Token Details
            </h1>

            <p>
              Here, we'll use Blockfrost to get the on-chain information for $tFIN
            </p>

            <h1 className="font-semibold opacity-60 mt-4">
              Status
            </h1>

            <p>
              Here, we should list everything regarding our testnet token.
              This should include our network status (if we're still using preprop or moving to mainnet),
              the total wallets which hold the token, all the links to our smart contracts/vesting services,
              probably more I'm forgetting right now but this is going to be updated soon.
            </p>

            <h1 className="font-semibold opacity-60 mt-4">
              Plans for $tFIN
            </h1>

            <div className="mt-2">
              <ol className="list-disc list-inside space-y-1 text-sm">
                <li></li>
              </ol>
            </div>
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
                        href=""
                      >
                        Cardanoscan
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
