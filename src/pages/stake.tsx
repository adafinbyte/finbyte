import MobileNavigation from "@/components/default-layout/mobile-navigation"
import Sidebar from "@/components/default-layout/sidebar"
import TopNavigation from "@/components/default-layout/top-navigation"
import { useWallet } from "@meshsdk/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { applyParamsToScript, PlutusScript, BlockfrostProvider, MeshTxBuilder, Asset, serializePlutusScript,
  deserializeAddress, mConStr0, deserializeDatum } from '@meshsdk/core';
import { Button } from "@/components/ui/button"
import blueprint from "../../contracts/plutus.json";
import { blockfrost_key } from "@/utils/api/secrets"
import { FINBYTE_UNIT } from "@/utils/consts"
import { format_atomic, format_long_string } from "@/utils/format"
import { copy_to_clipboard, get_timestamp } from "@/utils/common"
import { Copy } from "lucide-react"

/** @WIP  */
export default function Stake() {
  const { address, connected, wallet } = useWallet();
  const router = useRouter();

  interface stake_info {
    assets: Asset[];
    staker: string;
    txHash: string;
    outputIndex: number;
    timestamp: number;
    stake_amount: bigint | string;
    current_reward: string;
  }
  const [current_tfin_stakes, set_current_tfin_stakes] = useState<stake_info[] | null>(null);

  const rewardFunderVKH = "da4ff11b9c5603bbdfcb98d461160e68094ce64cd9c0b81b93bff80a";
  const SCRIPT_CBOR = applyParamsToScript(
    blueprint.validators[0].compiledCode,
    [rewardFunderVKH]
  );
  const STAKING_VALIDATOR: PlutusScript = {
    version: "V3",
    code: SCRIPT_CBOR,
  };

  const calculate_reward = (
    stake_amount: number,
    stake_timestamp: number,
    annual_rate: number = 0.10
  ): number => {
    const now = get_timestamp();
    const stakeTimestampInSeconds = stake_timestamp / 1000;

    const secondsElapsed = now - stakeTimestampInSeconds;
    const daysElapsed = secondsElapsed / (60 * 60 * 24);

    const dailyRate = annual_rate / 365;
    return stake_amount * dailyRate * daysElapsed;
  }

  const getTxBuilder = () => {
    const provider = new BlockfrostProvider(blockfrost_key);
    return new MeshTxBuilder({
      fetcher: provider,
      submitter: provider,
    });
  }

  const create_stake = async () => {
    const stakeAmount = "100000"; // 10 tFIN
    const stakedAssets: Asset[] = [
      { unit: FINBYTE_UNIT, quantity: stakeAmount },
    ];

    const utxos = await wallet.getUtxos();
    const signerHash = deserializeAddress(address).pubKeyHash;
    const datum = mConStr0([signerHash]);
    const scriptAddr = serializePlutusScript(STAKING_VALIDATOR, undefined, 0).address;

    const txBuilder = getTxBuilder();
    await txBuilder
      .txOut(scriptAddr, stakedAssets)
      .txOutInlineDatumValue(datum)
      .changeAddress(address)
      .selectUtxosFrom(utxos)
      .complete();

    const unsignedTx = txBuilder.txHex;
    const signedTx = await wallet.signTx(unsignedTx);
    const txHash = await wallet.submitTx(signedTx);

    toast.info(`10 tFIN staked at: ${txHash}`);
  };

  const fetch_current_tfin_stakes = async () => {
    const provider = new BlockfrostProvider(blockfrost_key);
    const scriptAddr = serializePlutusScript(STAKING_VALIDATOR, undefined, 0).address;
    const utxos = await provider.fetchAddressUTxOs(scriptAddr);
    const current_stakes = [];

    for (const utxo of utxos) {
      const { input, output } = utxo;
      let datum = null;

      if (output.dataHash) {
        try {
          const fetched = await provider.get(`scripts/datum/${output.dataHash}`);
          if (fetched?.json_value) {
            datum = fetched.json_value;
          } else if (fetched?.cbor) {
            datum = deserializeDatum(fetched.cbor);
          }
        } catch (error) {
          console.error("Error fetching datum:", error);
          continue;
        }
      }

      if (!datum && output.plutusData) {
        try {
          datum = JSON.parse(output.plutusData);
        } catch (e) {
          console.warn("Failed to parse inline datum:", e);
        }
      }

      // ✅ NEW datum shape check (1 field)
      if (
        datum &&
        datum.constructor === 0 &&
        Array.isArray(datum.fields) &&
        datum.fields.length === 1
      ) {
        const staker = datum.fields[0]?.bytes ?? "";
        const stake_amount = output.amount.find(
          (a) => a.unit === FINBYTE_UNIT
        )?.quantity ?? "0";

        // Fetch the transaction details to get the timestamp
        let timestamp = 0;
        try {
          const txDetails = await provider.get(`txs/${input.txHash}`);
          if (txDetails && txDetails.block_time) {
            timestamp = txDetails.block_time;
          }
        } catch (error) {
          console.error("Error fetching transaction details:", error);
        }

        const tfin = format_atomic(4, Number(stake_amount)) as number;
        const current_reward = calculate_reward(tfin, timestamp, 0.1);

        current_stakes.push({
          assets: output.amount,
          staker: staker,
          stake_amount: '$tFIN: ' + tfin.toLocaleString(undefined, {
            minimumFractionDigits: 4,
          }),
          txHash: input.txHash,
          outputIndex: input.outputIndex,
          timestamp: timestamp,
          current_reward: '$tFIN: ' + format_atomic(4, current_reward).toLocaleString(undefined, {maximumFractionDigits: 4})
        });

        console.log(current_stakes)
      } else {
        console.warn("Skipping UTxO with invalid datum structure:", datum);
      }
    }

    set_current_tfin_stakes(current_stakes);
  };
  
  useEffect(() => {
    if (!connected) {
      router.push('/')
    }
    fetch_current_tfin_stakes();
  }, [connected, address]);

  return (connected && address) ? (
    <div className="min-h-screen bg-background">
      <TopNavigation />
      <div className="container mx-auto px-4 pt-16 pb-20 md:pb-4 md:pt-20">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5 lg:grid-cols-8">
          <div className="hidden md:col-span-1 md:block lg:col-span-2 lg:w-[90%]">
            <Sidebar />
          </div>

          <div className="col-span-1 md:col-span-4 lg:col-span-4">

            <div className="grid gap-4">
              <div>
                <h1 className="pb-4 text-xl font-semibold">
                  Stake platform
                </h1>

                <Button onClick={create_stake}>
                  Stake 10 tFIN
                </Button>

                <div className="mt-4 p-2">

                  <table className="w-full text-left">
                    <thead>
                      <tr>
                        <th>Address</th>
                        <th>Staked</th>
                        <th>Current Reward</th>
                        <th>Tx Hash</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {current_tfin_stakes?.map((item, index) => (
                        <tr key={index} className="bg-secondary">
                          <td>
                            {format_long_string(item.staker)}
                          </td>
                          <td>
                            {item.stake_amount}
                          </td>
                          <td>
                            {item.current_reward}
                          </td>
                          <td>
                            {format_long_string(item.txHash)}
                          </td>
                          <td className="flex gap-2 items-center">
                            <Button size='sm' onClick={() => copy_to_clipboard(item.txHash)}>
                              <Copy/>
                            </Button>
                            <Button size='sm'>
                              Unstake
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {current_tfin_stakes?.length === 0 && (
                    <div>
                      No staked $tFIN found.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:col-span-2 lg:block">
          </div>
        </div>

        <div className="lg:hidden pt-4">
          <div className="sticky top-20 space-y-2">

          </div>
        </div>
      </div>
      <MobileNavigation />
    </div>
  ) : (
    <div>
      <h1>
        Connect your wallet!
      </h1>
    </div>
  )
}
