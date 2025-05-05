import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "@/hooks/use-toast"
import { curated_token } from "@/verified/interfaces"
import { useWallet } from "@meshsdk/react"
import { FilterIcon, HeartHandshake } from "lucide-react"
import { FC, useState } from "react"

interface custom_props {
  token: curated_token;
  refresh_data: () => Promise<void>;
}

const RepresentCommunityButton: FC <custom_props> = ({
  token, refresh_data
}) => {
  const { address, connected } = useWallet();
  const [users_community, set_users_community] = useState<string | null>(null);

  const attempt_represent = async () => {
    if (!connected) {
      toast({
        description: 'No wallet found.',
        variant: 'destructive'
      });
      return;
    }
    
    const community = '$' + token.token_details.ticker;
    refresh_data();
  }

  const check_users_community = () => {

  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm">
          <HeartHandshake className="size-3" />
          Represent Community
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 dark:border-neutral-800">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Represent Community</h4>
          </div>

          <p className="text-black/80 dark:text-white/80 text-xs">
            You can only represent one community at a time, but you're totally free to switch it up whenever you want.
          </p>

          <div className="flex w-full gap-2 justify-end">
            <Button size='sm'>
              Confirm
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default RepresentCommunityButton;