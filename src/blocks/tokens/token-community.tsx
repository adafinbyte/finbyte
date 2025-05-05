import { curated_token } from "@/verified/interfaces";
import { FC } from "react";

interface custom_props {
  token: curated_token;
}

const TokenCommunity: FC <custom_props> = ({
  token
}) => {

  return (
    <div>
      community
    </div>
  )
}

export default TokenCommunity;