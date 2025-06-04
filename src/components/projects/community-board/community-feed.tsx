import { FC } from "react";
import { LoadingDots } from "../../loading-dots";
import { community_post_data } from "@/utils/interfaces";
import CommunityFeedPost from "./community-post";
import CreateFeedPost from "@/components/feed/create-post";
import { curated_token } from "@/verified/interfaces";

interface custom_props {
  refreshing_state: boolean;
  community_posts: community_post_data[] | null;
  get_posts: () => Promise<void>;
  token: curated_token;
}

const ProjectsCommunityFeed: FC <custom_props> = ({
  refreshing_state, community_posts, get_posts, token
}) => {

  return (
    <div className="space-y-4">
      <CreateFeedPost post_type={'community'} post_id={undefined} on_create={get_posts} token_slug={token.slug_id} />

      <div className="divide-y dark:divide-slate-800 py-4">
        {refreshing_state && (
          <LoadingDots />
        )}

        {community_posts && community_posts.map((post, index) => (
          <CommunityFeedPost
            key={index}
            post={post}
            get_posts={get_posts}
          />
        ))}

        {community_posts && community_posts.length === 0 && (
          <div className="p-4 flex justify-center w-full">
            <h1 className="text-muted-foreground font-semibold text-sm">No posts found</h1>
          </div>
        )}

      </div>
    </div>
  )
}

export default ProjectsCommunityFeed;