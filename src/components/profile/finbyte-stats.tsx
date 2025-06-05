import { FC } from "react";
import { Card } from "../ui/card";
import { platform_user_details } from "@/utils/interfaces";
import { copy_to_clipboard } from "@/utils/common";
import { BookmarkPlus, UserMinus, Users } from "lucide-react";
import FormatAddress from "../format-address";

interface custom_props {
  user_details: platform_user_details;
}

const ProfileFinbyteStats: FC <custom_props> = ({
  user_details
}) => {
  const community_badge = user_details.community_badge ?? 'Not Set';

  const finbyte_user_stats = [
    { title: 'Total Posts', data: user_details.total_posts },
    { title: 'Finbyte Kudos', data: user_details.total_kudos },
    { title: 'Supporting Community', data: community_badge },
  ];

  return (
    <Card className="p-4">
      <div className="flex gap-2 items-center pb-2">
        <img src="/finbyte.png" className="size-4" />
        <h1 className="font-semibold text-sm text-muted-foreground">Finbyte Stats</h1>
      </div>

      <div className="flex flex-wrap gap-4 items-start justify-center">
        {finbyte_user_stats.map((item, index) => (
          <div key={index} onClick={() => copy_to_clipboard(item.data as string)} className="cursor-copy hover:-translate-y-0.5 duration-300 px-4 py-2 flex flex-col min-w-28 bg-secondary rounded-xl">
            <h1 className="text-muted-foreground text-xs text-center">
              {item.title}
            </h1>

            <p className="text-lg font-semibold text-center">
              {item.data}
            </p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 items-center pb-2 mt-6">
        <Users className="size-4 text-muted-foreground" />
        <h1 className="font-semibold text-sm text-muted-foreground">Following Users: {user_details.following?.length ?? 0}</h1>
      </div>

      <div className="flex flex-wrap gap-2">
        {user_details.following?.map((user, index) => (
          <div key={index}>
            <FormatAddress address={user} />
          </div>
        ))}
      </div>

      <div className="flex gap-2 items-center pb-2 mt-6">
        <BookmarkPlus className="size-4 text-muted-foreground" />
        <h1 className="font-semibold text-sm text-muted-foreground">Bookmarked Posts: {user_details.bookmarked_posts?.length ?? 0}</h1>
      </div>

      <div className="flex flex-col gap-2">
        {user_details.bookmarked_posts?.map((post, index) => (
          <div key={index}>
            {post}
          </div>
        ))}
      </div>


      {/** @todo move this to settings */}
      <div className="flex gap-2 items-center pb-2 mt-4">
        <UserMinus className="size-4 text-muted-foreground" />
        <h1 className="font-semibold text-sm text-muted-foreground">Muted Users: {user_details.muted?.length ?? 0}</h1>
      </div>

      <div className="flex flex-wrap gap-2">
        {user_details.muted?.map((user, index) => (
          <div key={index}>
            <FormatAddress address={user} />
          </div>
        ))}
      </div>

    </Card>
  )
}

export default ProfileFinbyteStats;