import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "@/hooks/use-toast"
import { update_community_badge } from "@/utils/api/account/push"
import { platform_user_details } from "@/utils/api/interfaces"
import { curated_token } from "@/verified/interfaces"
import { checkSignature, generateNonce } from "@meshsdk/core"
import { useWallet } from "@meshsdk/react"
import { FilterIcon, HeartHandshake } from "lucide-react"
import { FC, useState } from "react"

interface custom_props {
  token: curated_token;
  finbyte_user: platform_user_details | null;
  refresh_user_data: () => Promise<void>;
}

const RepresentCommunityButton: FC <custom_props> = ({
  token, refresh_user_data, finbyte_user
}) => {
  const { address, connected, wallet } = useWallet();
  const [open, set_open] = useState(false);

  const represent_community = async () => {
    if (!connected) {
      toast({
        description: 'No wallet found.',
        variant: 'destructive'
      });
      return;
    }

    if (!finbyte_user) {
      toast({
        description: 'You need to be a Finbyte user.',
        variant: 'destructive'
      });
      return;
    }

      const timestamp = Math.floor(Date.now() / 1000);
      try {
        const signing_data = `${address} is updating their community badge at ${timestamp}`;
        const nonce = generateNonce(signing_data);
        const signature = await wallet.signData(nonce, address);
        if (signature) {
          const is_valid_sig = await checkSignature(nonce, signature, address);
          if (is_valid_sig) {
            await update_community_badge(address, timestamp, token.token_details.ticker);
            await refresh_user_data();
          } else {
            toast({
              description: 'Signature verification failed! Whoops.',
              variant: 'destructive'
            });
            return;
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          toast({
            description: error.message,
            variant: 'destructive'
          });
        } else {
          throw error;
        }
    }
  }

  const handle_confirm = async () => {
    represent_community();
    set_open(false);
  };

  const matching_badge = finbyte_user?.account_data?.community_badge === token.token_details.ticker;

  return (
    <Popover open={open} onOpenChange={set_open}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" disabled={!connected || matching_badge}>
          <HeartHandshake className="size-3"/>
          Community Badge
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 dark:border-neutral-800">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Apply Community Badge</h4>
          </div>

          <p className="text-black/80 dark:text-white/80 text-xs">
            You can only apply one community badge at a time, but you're totally free to switch it up whenever you want.
          </p>

          <div className="flex w-full gap-2 justify-end">
            <Button size='sm' onClick={handle_confirm}>
              Confirm
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default RepresentCommunityButton;