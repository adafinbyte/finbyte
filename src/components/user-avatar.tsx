import { FC, HTMLAttributes } from "react";
import Avatar from "boring-avatars";

import { Wallet } from "@meshsdk/core";

interface custom_props extends HTMLAttributes<HTMLDivElement> {
  address:      string;
  wallet_info?: Wallet | undefined;
  skeleton?:    boolean;
}

const UserAvatar: FC <custom_props> = ({
  address, wallet_info, skeleton = false, ...props
}) => {

  const default_hexes = ["#5b1d99", "#0074b4", "#00b34c", "#ffd41f", "#fc6e3d"];
  const blue_hexes = []

  return (
    <div className={`inline-flex relative ${skeleton && "animate-pulse"}`} {...props}>
      <Avatar
        name={address}
        className={'rounded-lg ' + props.className}
        square
        colors={default_hexes}
        variant="marble"
      />
      
      {wallet_info && (
        <div className="bg-neutral-950/40 absolute bottom-0 right-0 rounded-br-lg rounded-tl">
          <img src={wallet_info.icon} className="w-4 h-4"/>
        </div>
      )}
    </div>
  )
};

export default UserAvatar;