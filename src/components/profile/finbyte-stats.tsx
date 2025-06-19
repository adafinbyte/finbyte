import { FC } from "react";
import { Card } from "../ui/card";
import { full_post_data, platform_user_details } from "@/utils/interfaces"
import { BookmarkPlus, Users } from "lucide-react";
import FormatAddress from "../format-address";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import FinbyteMarkdown from "../finbyte-md";

interface custom_props {
  user_details: platform_user_details;
  bookmarked_posts: full_post_data[];
}

const ProfileFinbyteStats: FC <custom_props> = ({
  user_details, bookmarked_posts
}) => {
  const community_badge = user_details.community_badge ?? 'Not Set';

  const finbyte_user_stats = [
    { title: 'Total Posts', data: user_details.total_posts },
    { title: 'Finbyte Kudos', data: user_details.total_kudos },
    { title: 'Community', data: community_badge },
  ];

  return (
    <Card className="p-4">
      <div className="flex gap-2 items-center pb-2">
        <img src="/finbyte.png" className="size-4" />
        <h1 className="font-semibold text-sm">Finbyte Stats</h1>
      </div>

      <div className="flex flex-wrap gap-2 items-start justify-center">
        {finbyte_user_stats.map((item, index) => (
          <div key={index} className="text-xs border border-slate-500 dark:border-slate-400 px-2 py-0.5 rounded-lg">
            {item.title}: {item.data}
          </div>
        ))}
      </div>

      <div className="flex gap-2 items-center pb-2 mt-6">
        <Users className="size-4" />
        <h1 className="font-semibold text-sm">Following Users: {user_details.following?.length ?? 0}</h1>
      </div>

      <ScrollArea>
        <div className="flex flex-col gap-2 max-h-64 p-2">
          {user_details.following?.map((user, index) => (
            <div key={index} className="flex justify-between items-center w-full p-1 rounded-lg border dark:border-slate-800">
              <h1 className="font-semibold pl-2">
                <span className="text-xs text-muted-foreground font-thin">
                  {user.substring(0, 10) + '...'}
                </span>
                {user.substring(user.length - 10)}
              </h1>

              <Button size='sm' variant='destructive'>
                Unfollow
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="flex gap-2 items-center pb-2 mt-6">
        <BookmarkPlus className="size-4" />
        <h1 className="font-semibold text-sm">Bookmarked Posts: {user_details.bookmarked_posts?.length ?? 0}</h1>
      </div>

      <ScrollArea>
        <div className="flex flex-col gap-2 max-h-98 p-2">
          {bookmarked_posts.map((post, index) => (
            <Card key={index} className="p-4 bg-secondary/20 text-sm backdrop-blur-lg">
              <FormatAddress address={post.post.author}/>

              <FinbyteMarkdown>
                {post.post.post}
              </FinbyteMarkdown>
            </Card>
          ))}
        </div>
      </ScrollArea>

    </Card>
  )
}

export default ProfileFinbyteStats;