import { ScrollArea } from "@radix-ui/react-scroll-area";
import { FC } from "react";
import { Button } from "../ui/button";
import { tfin_requests_data } from "@/utils/interfaces";
import { format_unix } from "@/utils/format";
import FormatAddress from "../format-address";
import Link from "next/link";
import { useWallet } from "@meshsdk/react";

interface custom_props {
  tfin_requests: tfin_requests_data[] | null;
  handle_request_tfin: () => Promise<void>;
}
const RequestTFin: FC <custom_props> = ({
  tfin_requests,
  handle_request_tfin
}) => {
  const { address, connected } = useWallet();

  return (
    <div>
      <h1 className="text-xl font-semibold mt-6">
        Testnet Launch: Try tFIN on Cardano Preprod
      </h1>

      <p>
        We're beginning our rollout on the Cardano Pre-Production testnet.
        This allows us to safely test all aspects of Finbyte's token economy,
        wallet integrations, and community tools before going live on mainnet
        with our real token, $FIN.
      </p>

      <div className="p-4 border-l border-l-green-400 bg-secondary rounded-r-xl my-10">
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

          <Button size='sm' variant='secondary' onClick={handle_request_tfin} disabled={tfin_requests?.some(a => a.address === address) || !connected || !address?.startsWith('addr_test1')}>
            {!address.startsWith('addr_test1') ? 'Wrong Network' : 'Request $tFIN'}
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
    </div>
  )
}

export default RequestTFin;