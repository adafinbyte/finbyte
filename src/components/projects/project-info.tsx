import { FC } from "react";
import { LoadingDots } from "../loading-dots";
import { curated_token } from "@/verified/interfaces";
import { pool_pm_fingerprint } from "@/utils/api/external/pool-pm";
import { format_long_string, format_unix } from "@/utils/format";
import { Button } from "../ui/button";
import { useWallet } from "@meshsdk/react";
import { copy_to_clipboard } from "@/utils/common";
import { like_unlike_community } from "@/utils/api/community/push";
import { toast } from "sonner";
import { project_community_data } from "@/utils/interfaces";
import { Avatar, AvatarFallback } from "../ui/avatar";
import UserAvatar from "../user-avatar";
import { Card } from "../ui/card";
import { FileWarning, HeartCrack, HeartHandshake, MessageCircleWarning } from "lucide-react";

interface custom_props {
  token_details: curated_token;
  poolpm_fp_data: pool_pm_fingerprint | null;
  community_data: project_community_data | null;
  get_community_data: () => Promise<void>;
  change_tab: () => void;
}

const ProjectsInformation: FC <custom_props> = ({
  token_details, poolpm_fp_data, community_data, get_community_data, change_tab
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

  const attempt_like_unlike_community = async () => {
    const like_community = await like_unlike_community(address, token_details.slug_id);
    if (like_community.error) {
      toast.error(like_community.error);
      return;
    } else {
      toast.success(`Successfully ${like_community.action} like from Community.`);
      await get_community_data();
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-sm font-semibold mb-2">
        About {token_details.name}
      </h1>

      <p className="text-sm">
        {token_details.description}
      </p>

      {/**
       * @note we will have to update this if we want to include nft projects as
       * this is just getting the token information
       **/}
      <h1 className="text-sm font-semibold mt-4 mb-2">
        Core Details
      </h1>

      <div className="flex flex-wrap gap-2 items-center justify-center md:w-3/4 md:mx-auto">
        {token_stats.map((item, index) => (
          <div key={index} onClick={() => copy_to_clipboard(item.data as string)} className="cursor-copy hover:-translate-y-0.5 duration-300 px-4 py-2 flex flex-col min-w-28 bg-secondary/40 backdrop-blur-lg rounded-xl">
            <h1 className="text-muted-foreground text-xs text-center">
              {item.title}
            </h1>

            <p className="text-lg font-semibold text-center">
              {(item.data?.toString().length === 0) ? 'Not Found' : format_long_string(item.data as string)}
            </p>
          </div>
        ))}
      </div>

      <h1 className="text-sm font-semibold mt-4 mb-2">
        On Finbyte
      </h1>

      <div className="grid md:grid-cols-2 gap-2 items-start">
        <Card className="p-4 text-center">
          <div className="font-semibold flex gap-2 items-center">
            Community Likers:
            <span>
              {community_data?.community_likers?.length.toLocaleString() ?? 0}
            </span>

            <Button variant='secondary' size='icon' className="scale-[80%] ml-auto" disabled={!connected} onClick={attempt_like_unlike_community}>
              {community_data?.community_likers?.includes(address) ? <HeartCrack /> : <HeartHandshake />}
            </Button>
          </div>

          <div className="flex flex-wrap -space-x-2 p-2 mt-2">
            {community_data?.community_likers?.map((liker, index) => (
              <Avatar key={index} className="size-8 border-2 dark:border-slate-800" title={`${liker.substring(0, 10) + "..." + liker.substring(liker.length - 10)}`}>
                <UserAvatar address={liker} />
                <AvatarFallback>{liker.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
          </div>
        </Card>

        <Card className="px-4 py-2 flex flex-col gap-2">
          <h1 className="text-sm text-left font-semibold">Engage with ${token_details.token_details.ticker}</h1>

          <Button variant="outline" size="sm" onClick={change_tab}>
            Community Feed
          </Button>

          <h1 className="mt-2 text-sm text-left font-semibold">Support ${token_details.token_details.ticker}</h1>

          <Button variant="outline" disabled>
            Represent Community
          </Button>
        </Card>
      </div>
    </div>
  )
}

export default ProjectsInformation;