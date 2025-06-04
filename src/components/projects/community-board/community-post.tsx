import FinbyteMarkdown from "@/components/finbyte-md";
import FormatAddress from "@/components/format-address";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/user-avatar";
import { like_unlike_post } from "@/utils/api/posts/push";
import { get_timestamp } from "@/utils/common";
import { format_unix } from "@/utils/format";
import { community_post_data } from "@/utils/interfaces";
import { post_type } from "@/utils/types";
import { useWallet } from "@meshsdk/react";
import { HandCoins, Heart, Share2 } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { toast } from "sonner";

interface custom_props {
  post: community_post_data;
  get_posts: () => Promise<void>;
}

const CommunityFeedPost: FC <custom_props> = ({
  post, get_posts
}) => {
  const { address, connected } = useWallet();
  const [hidden_post, set_hidden_post] = useState(false);
  const [show_tip_post, set_show_tip_post] = useState(false);
  const [share_post, set_share_post] = useState(false);

  useEffect(() => {
    const spam_hidden = () => {
      return post.topic === 'spam' ? set_hidden_post(true) : set_hidden_post(false)
    }
    spam_hidden();
  }, [post]);

  const handle_like_post = async (post_type: post_type, post_id: number, likers: string[]) => {
    const is_liking = !likers.includes(address);
    const like_data = is_liking
      ? [...likers, address]
      : likers.filter((addr) => addr !== address);

    const like_action = await like_unlike_post(
      like_data,
      post_id,
      get_timestamp(),
      address,
      post_type,
      is_liking ? "like" : "unlike"
    );

    if (like_action.error) {
      toast.error(like_action.error);
      return;
    }
    if (like_action.done) {
      toast.success(`You have ${is_liking ? 'liked' : 'unliked'} this post.`);
      await get_posts();
    }
  }

  const handle_tip_post = async () => { }

  if (hidden_post) {
    return (
      <div>
        hidden post
      </div>
    )
  } else {
    return (
      <div className="p-4 relative">
        <div className="flex gap-3 relative">
          <Avatar>
            <UserAvatar address={post.author} />
            <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">
                  <FormatAddress address={post.author} />
                </span>
                <span className="text-sm text-muted-foreground">
                  <span className="px-1.5">· {format_unix(post.post_timestamp).time_ago}</span>
                </span>
              </div>
            </div>

            <div className="break-words pr-4">
              <FinbyteMarkdown>{post.post}</FinbyteMarkdown>
            </div>

            <div className="flex justify-between pt-2">
              <Button disabled={!connected || !address} onClick={() => handle_like_post('community', post.id, post.post_likers ?? [])} variant="ghost" size="sm" className='h-8 gap-1 px-2 text-muted-foreground'>
                <Heart
                  className={`h-4 w-4 ${post.post_likers?.includes(address)
                    ? "fill-current text-muted-foreground"
                    : ""
                    }`}
                />
                <span className="text-xs">{post.post_likers?.length ?? 0}</span>
              </Button>

              <Button disabled={!connected} onClick={() => set_show_tip_post(!show_tip_post)} variant="ghost" size="sm" className="h-8 gap-1 px-2 text-muted-foreground">
                <HandCoins className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {show_tip_post &&
          <div className="p-4 bg-secondary rounded-lg mt-4">
            <h1>WIP</h1>
          </div>
        }
      </div>
    )
  }
}

export default CommunityFeedPost;