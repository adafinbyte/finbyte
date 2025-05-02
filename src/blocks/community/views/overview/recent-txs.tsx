import useThemedProps from "@/contexts/themed-props";
import { asset_tx, get_blockfrost_transaction, tx } from "@/utils/api/external/blockfrost";
import { copy_to_clipboard, format_long_string, format_unix } from "@/utils/string-tools";
import { data } from "framer-motion/client";
import { ArrowDown, ArrowRight, Copy } from "lucide-react";
import { FC, useState } from "react";
import toast from "react-hot-toast";

interface custom_props {
  asset_transactions: asset_tx[] | undefined;

}
const CommunityOverviewRecentTxs: FC <custom_props> = ({
  asset_transactions
}) => {
  const themed = useThemedProps();
  const [opened_transaction, set_opened_transaction] = useState<number | null>(null);
  const [loading, set_loading] = useState<boolean>(false);
  const [transaction_details_map, set_transaction_details_map] = useState<Record<string, tx>>({});

  const get_transaction_details = async (tx_hash: string) => {
    try {
      set_loading(true);
      const tx_details = await get_blockfrost_transaction(tx_hash);
      if (tx_details) {
        set_transaction_details_map((prev) => ({
          ...prev,
          [tx_hash]: tx_details
        }))
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        throw error;
      }
    } finally {
      set_loading(false);
    }
  }

  const toggle_open = async (index: number, tx_hash: string) => {
    if (loading) return;

    if (opened_transaction === index) {
      set_opened_transaction(null);
    } else {
      if (!transaction_details_map[tx_hash]) {
        await get_transaction_details(tx_hash);
      }
      set_opened_transaction(index);
    }
  };

  const transaction_details = (tx_hash: string) => {
    const details = transaction_details_map[tx_hash];
    if (!details) {
      return (
        <div className="text-xs italic">Loading details...</div>
      )
    }

    const table_items = [
      {name: 'Block Hash', data: details.block},
      {name: 'Height', data: details.block_height.toLocaleString()},
      {name: 'Unix', data: details.block_time},
      {name: 'Fees', data: details.fees},
      {name: 'TX Hash', data: details.hash},
      {name: 'UTXO count', data: details.utxo_count}
    ]

    return (
      <div className="flex flex-col gap-1 w-full">
        <a href={`https://cardanoscan.io/transaction/` + tx_hash} target="_blank" className="group text-xs text-blue-400 inline-flex ml-auto gap-1 items-center">
          View on Cardanoscan
          <ArrowRight className="group-hover:translate-x-0.5 duration-300 size-3"/>
        </a>

        <table className={`w-full table-fixed text-sm text-left ${themed['400'].text}`}>
          <colgroup>
            <col className="w-6" />
            <col className="w-24" />
            <col className="w-full" />
          </colgroup>

          <tbody>
            {table_items.map((item, index) => (
              <tr key={index} className={`${!(index === table_items.length - 1) ? `border-b ${themed['700'].border}` : ''}`}>
                <td className={`px-2 py-1 ${themed.effects.transparent_button.hover} cursor-pointer`} onClick={() => copy_to_clipboard(item.data as string)}>
                  <Copy className="size-3" />
                </td>
                <td className="px-2 py-1 truncate">
                  {item.name}
                </td>
                <td className="px-2 py-1 truncate">
                  {item.data}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return asset_transactions ? (
    <div className={`${themed['900'].bg} border ${themed['700'].border} max-w-md mx-auto mt-2 rounded-lg p-1 flex flex-col gap-1`}>
      <div className={`p-1 ${themed['500'].text} font-semibold text-xs`}>
        Recent 25 Transactions
      </div>

      <div className={`max-h-72 ${themed.webkit_scrollbar} text-sm`}>
        {asset_transactions.map((tx, index) => (
          <div key={index} className={`p-1 px-2 w-full ${themed['300'].text} ${index === opened_transaction ? themed['900'].bg : themed.effects.transparent_button.hover} rounded-lg flex flex-col gap-2 duration-150`}>
            <button className="flex gap-2 items-center" disabled={loading} onClick={() => toggle_open(index, tx.tx_hash)} >
              <h1 className={`${themed['200'].text}`} title="TX Time">
                {format_unix(tx.block_time).time_ago}
              </h1>
              <h1 className={`text-xs text-blue-400`} title="Block Height">
                {tx.block_height.toLocaleString()}
              </h1>
              <h1 className={`${themed['400'].text} truncate`} title="TX Hash">
                {tx.tx_hash}
              </h1>

              <span className="ml-auto">
                <ArrowDown className={`${index === opened_transaction ? 'rotate-180' : ''} transition-transform size-4`}/>
              </span>
            </button>

            {index === opened_transaction && (transaction_details(tx.tx_hash))}
          </div>
        ))}
      </div>
      
    </div>
  ) : (
    <div>
      Could not find any transactions
    </div>
  )
}

export default CommunityOverviewRecentTxs;