import { FC } from "react";
import { Card } from "../ui/card";
import { platform_user_details } from "@/utils/interfaces";
import { copy_to_clipboard } from "@/utils/common";
import { UserMinus } from "lucide-react";
import { Button } from "../ui/button";

interface custom_props {
  user_details: platform_user_details;
}

const SettingsFinbyte: FC <custom_props> = ({
  user_details
}) => {

  return (
    <Card className="p-4">
      <div className="flex gap-2 items-center pb-2">
        <img src="/finbyte.png" className="size-4" />
        <h1 className="font-semibold text-sm">Finbyte Settings</h1>
      </div>

      <div className="flex gap-2 items-center pb-2 mt-4">
        <UserMinus className="size-4 text-muted-foreground" />
        <h1 className="font-semibold text-sm text-muted-foreground">Muted Users: {user_details.muted?.length ?? 0}</h1>
      </div>

      <div className="flex flex-col gap-2">
        {user_details.muted?.map((user, index) => (
          <div key={index} className="p-1 flex items-center gap-2">
            <div onClick={() => copy_to_clipboard(user)} className="hover:-translate-y-0.5 duration-300 cursor-copy p-1 px-4 rounded-lg bg-secondary">
              {user.substring(0, 10) + "..." + user.substring(user.length - 25)}
            </div>
            <Button size='sm' variant='secondary'>
              Unmute
            </Button>
          </div>
        ))}
      </div>

    </Card>
  )
}

export default SettingsFinbyte;