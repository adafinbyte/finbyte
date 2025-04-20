import { FC } from "react";
import CommunityOverview from "./overview";
import { verified_token } from "@/verified/interfaces";
import CommuntiyPosts from "./community";
import CommuntiyTrade from "./trade";

interface custom_props {
  active_tab: number;
  token:      verified_token;
}

const CommunityView: FC <custom_props> = ({
  active_tab, token
}) => {

  return (
    <div className="mx-auto">
      {active_tab === 0 && (
        <CommunityOverview
          token={token}
        />
      )}

      {active_tab === 1 && (
        <CommuntiyPosts
          token={token}
        />
      )}

      {active_tab === 2 && (
        <CommuntiyTrade
          token={token}
        />
      )}
    </div>
  )
}

export default CommunityView;