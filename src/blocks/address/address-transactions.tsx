import { BorderBeam } from "@/components/ui/border-beam";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LoadingDots } from "@/components/ui/loading-dots";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { asset_tx, get_blockfrost_address_transactions } from "@/utils/api/external/blockfrost";
import { format_long_string, format_unix } from "@/utils/string-tools";
import { FC, useEffect, useState } from "react";

interface custom_props {
  address: string;
}

const AddressTransactions: FC <custom_props> = ({
  address
}) => {
  const [transactions, set_transactions] = useState<asset_tx[] | null>(null);

  const get_address_transactions = async () => {
    const txs = await get_blockfrost_address_transactions(address);
    if (txs?.data) {
      set_transactions(txs?.data);
    }
  }

  useEffect(() => {
    get_address_transactions();
  }, []);

  return (
    <Card className="dark:border-neutral-800 relative w-full">
      <CardHeader>
        <Label>Address Transactions</Label>
      </CardHeader>
      <hr className="dark:border-neutral-800"/>
      <div className="p-2">
        <ScrollArea>
          <div className="w-full max-h-64">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Index</TableHead>
                  <TableHead>Hash</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {transactions ? transactions.map((tx, index) => (
                  <TableRow key={index}>
                    <TableCell>{format_unix(tx.block_time).time_ago}</TableCell>
                    <TableCell>{tx.tx_index}</TableCell>
                    <TableCell>{format_long_string(tx.tx_hash)}</TableCell>
                  </TableRow>
                )) : (
                  <LoadingDots/>
                )}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </div>
      <BorderBeam duration={20}/>
    </Card>
  )
}

export default AddressTransactions;