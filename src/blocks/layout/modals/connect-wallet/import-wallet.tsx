import useThemedProps from "@/contexts/themed-props";
import { capitalize_first_letter } from "@/utils/string-tools";
import { Wallet } from "@meshsdk/core";
import { Hammer } from "lucide-react";
import { useRouter } from "next/router";
import { FC } from "react";

interface custom_props {
}

const ConnectWalletImport: FC <custom_props> = ({
}) => {
  const themed = useThemedProps();

  return (
    <div>
      <span className={`flex gap-2 items-center justify-center`}>
        This is under construction, come back soon!
        <Hammer className="size-4 text-amber-400"/>
      </span>
    </div>
  )
}

export default ConnectWalletImport;