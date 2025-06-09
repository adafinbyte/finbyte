import Link from "next/link";
import { FC } from "react";
import { Card } from "../ui/card";

interface custom_props {
}

const TfinQuickLinks: FC <custom_props> = ({
}) => {


  return (
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
  )
}

export default TfinQuickLinks;