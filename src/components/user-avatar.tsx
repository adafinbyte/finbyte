import { FC, HTMLAttributes } from "react";
import Avatar from "boring-avatars";

interface custom_props extends HTMLAttributes<HTMLDivElement> {
  address:      string;
  skeleton?:    boolean;
}

const UserAvatar: FC <custom_props> = ({
  address, skeleton = false, ...props
}) => {

  const default_hexes = ["#5b1d99", "#0074b4", "#00b34c", "#ffd41f", "#fc6e3d"];

  return (
    <div className={`inline-flex relative ${skeleton && "animate-pulse"}`} {...props}>
      <Avatar
        name={address}
        className={'rounded-lg ' + props.className}
        square
        colors={default_hexes}
        variant="marble"
      />
    </div>
  )
};

export default UserAvatar;