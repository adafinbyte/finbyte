import { BorderBeam } from "@/components/ui/border-beam";
import { Card, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import UserAvatar from "@/components/user-avatar";
import { cn } from "@/lib/utils";
import {  platform_user_details } from "@/utils/api/interfaces";
import { moderation_addresses } from "@/utils/consts";
import { Verified } from "lucide-react";
import { FC } from "react";

interface custom_props {
  user:    platform_user_details;
}

const PlatformUserCard: FC <custom_props> = ({
  user
}) => {

  return (
    <Card className="relative dark:border-neutral-800">
      <div
        className={cn(
          "absolute inset-0",
          "opacity-80",
          "transition-opacity duration-300",
          "pointer-events-none"
        )}
      >
        <div className="rounded-xl absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.06)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[length:4px_4px]" />
      </div>

      <CardHeader>
        <div className="flex w-full gap-2 items-center">
          <Label className="font-bold"><span>addr1</span>...{user.address.substring(user.address.length - 6)}</Label>
          {user.type === 'finbyte' && (
            <Verified className="size-4 dark:text-blue-400 text-blue-500"/>
          )}
          {moderation_addresses.includes(user.address) && (
            <img src='/finbyte.png' className="size-4"/>
          )}
          <UserAvatar address={user.address} className="size-8 ml-auto"/>
        </div>
      </CardHeader>
      
      {user.type === 'finbyte' && (
        <BorderBeam/>
      )}
    </Card>
  )
}

export default PlatformUserCard;