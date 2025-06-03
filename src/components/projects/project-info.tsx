import { FC } from "react";
import { LoadingDots } from "../loading-dots";
import { curated_token } from "@/verified/interfaces";
import { pool_pm_fingerprint } from "@/utils/api/external/pool-pm";
import { format_long_string, format_unix } from "@/utils/format";
import { Button } from "../ui/button";
import { useWallet } from "@meshsdk/react";
import { copy_to_clipboard } from "@/utils/common";

interface custom_props {
  token_details: curated_token;
  poolpm_fp_data: pool_pm_fingerprint | null;
}

const ProjectsInformation: FC <custom_props> = ({
  token_details, poolpm_fp_data
}) => {
  const { address, connected } = useWallet();

  const base_stats = [
    { title: "Name Hex", data: token_details.hex },
    { title: "Ticker", data: "$" + token_details.token_details.ticker },
    { title: "Supply", data: token_details.token_details.supply.toLocaleString() },
    { title: "Decimals", data: token_details.token_details.decimals },
    { title: "Policy", data: token_details.token_details.policy },
    { title: "Fingerprint", data: token_details.token_details.fingerprint },
  ];
  const additional_stats = poolpm_fp_data ? [
    { title: "Minted", data: format_unix(poolpm_fp_data.mint).time_ago },
    { title: "on Epoch", data: poolpm_fp_data.epoch ?? 0 },
  ] : [];
  const token_stats = [...base_stats, ...additional_stats];

  const ready_and_built = false;

  return (
    <div className="p-4">
      <h1 className="text-sm text-muted-foreground font-semibold mb-2">
        Core Details
      </h1>

      <div className="flex flex-wrap gap-2 items-center justify-center">
        {token_stats.map((item, index) => (
          <div key={index} onClick={() => copy_to_clipboard(item.data as string)} className="cursor-copy hover:-translate-y-0.5 duration-300 px-4 py-2 flex flex-col min-w-28 bg-secondary rounded-xl">
            <h1 className="text-muted-foreground text-xs text-center">
              {item.title}
            </h1>

            <p className="text-lg font-semibold text-center">
              {(item.data?.toString().length === 0) ? 'Not Found' : format_long_string(item.data as string)}
            </p>
          </div>
        ))}
      </div>

      <h1 className="mt-4 text-sm text-muted-foreground font-semibold mb-2">
        On Finbyte
      </h1>

      <div className="grid grid-cols-2 gap-2 items-start">
        <div className="bg-secondary rounded-lg px-4 py-2 text-center">
          <h1 className="text-sm font-semibold text-muted-foreground">
            Community Likes
          </h1>

          <p>
            0
          </p>
        </div>

        <div className="bg-secondary rounded-lg px-4 py-2 text-center">
          <h1 className="text-sm font-semibold text-muted-foreground">
            Community Posts
          </h1>

          <p>
            0
          </p>
        </div>

        <div className={`bg-secondary rounded-lg px-4 py-2 text-center ${ready_and_built ? '' : 'opacity-50'}`}>
          <h1 className="text-sm font-semibold text-muted-foreground">
            Support Community
          </h1>

          <Button size='sm' variant='link' disabled={!ready_and_built}>
            Like
          </Button>
        </div>

        <div className={`bg-secondary rounded-lg px-4 py-2 text-center ${ready_and_built ? '' : 'opacity-50'}`}>
          <h1 className="text-sm font-semibold text-muted-foreground">
            Community Badge
          </h1>

          <Button size='sm' variant='link' disabled={!ready_and_built}>
            Apply
          </Button>
        </div>

      </div>
    </div>
  )
}

export default ProjectsInformation;