import { FC } from "react";
import { LoadingDots } from "../loading-dots";

interface custom_props {
  refreshing_state: boolean;
}

const ProjectsCommunityFeed: FC <custom_props> = ({
  refreshing_state
}) => {

  return (
    <div className="divide-y dark:divide-slate-800 py-4">
      {refreshing_state && (
        <LoadingDots />
      )}

    </div>
  )
}

export default ProjectsCommunityFeed;