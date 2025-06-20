import { comment_post_data, platform_user_details } from "@/utils/interfaces";
import { FC, useState } from "react";
import { Card } from "../ui/card";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import UserAvatar from "../user-avatar";
import FormatAddress from "../format-address";
import { Button } from "../ui/button";
import { Heart, MoreHorizontal } from "lucide-react";
import FinbyteMarkdown from "../finbyte-md";
import { format_unix } from "@/utils/format";
import { useWallet } from "@meshsdk/react";
import { generate_options } from "../feed/post";
import { moderation_addresses } from "@/utils/consts";
import { copy_to_clipboard } from "@/utils/common";

interface custom_props {
  comment: comment_post_data;
  connected_user_details: platform_user_details | null;

  get_post: () => Promise<void>;
  handle_like: () => Promise<void>;
  handle_follow_user: () => Promise<void>;
  handle_mute_user: () => Promise<void>;
  handle_mark_as_spam: () => Promise<void>;
}

const PostComment: FC <custom_props> = ({
  comment, connected_user_details,
  get_post, handle_like, handle_follow_user, handle_mute_user, handle_mark_as_spam
}) => {
  const { address, connected } = useWallet();
  const [view_likers, set_view_likers] = useState<boolean>(false);

  const post_options = {
    disconnected_user_post_options: [
      { title: "Copy Address", action: () => { copy_to_clipboard(comment.author) } },
      { title: "View Likers", action: () => { set_view_likers(true) } },
    ],
    connected_user_post_options: [
      { title: connected_user_details?.following?.includes(comment.author) ? 'Unfollow User' : 'Follow User', action: handle_follow_user },
      { title: connected_user_details?.muted?.includes(comment.author) ? 'Unmute User' : 'Mute User', action: handle_mute_user },
    ],
    author_post_options: [
      /** @todo */
      //{ title: "Edit Post", action: () => { } },
      //{ title: "Remove Post", action: () => { }, destructive: true },
    ],
    mod_post_options: [
      { title: "Mark as Spam", action: handle_mark_as_spam, destructive: true },
      /** @todo */
      //{ title: "Remove Post", action: () => { }, destructive: true },
    ],
  };

  const rendered_post_options = () => {
    const is_mod = connected && moderation_addresses.includes(address);
    const is_author = connected && comment.author === address;

    return generate_options({
      is_connected: connected,
      is_author,
      is_mod,
      base_options: post_options.disconnected_user_post_options,
      connected_options: post_options.connected_user_post_options,
      author_options: post_options.author_post_options,
      mod_options: post_options.mod_post_options,
    });
  };

  return (
    <>
      <Card className="p-6 bg-secondary/20 backdrop-blur-lg">
        <div className="flex gap-3 relative">
          <Avatar>
            <UserAvatar address={comment.author} />
            <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">
                  <FormatAddress address={comment.author} />
                </span>
                <span className="text-sm text-muted-foreground">
                  <span className="px-1.5">· {format_unix(comment.comment_timestamp).time_ago}</span>
                </span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {rendered_post_options()
                    .filter((opt) => !opt.destructive)
                    .map((item, idx) => (
                      <DropdownMenuItem key={idx} onClick={item.action}>
                        {item.title}
                      </DropdownMenuItem>
                    ))
                  }
                  {/** <DropdownMenuSeparator /> */}
                  {rendered_post_options()
                    .filter((opt) => opt.destructive)
                    .map((item, idx) => (
                      <DropdownMenuItem key={`d-${idx}`} className="text-destructive" onClick={item.action}>
                        {item.title}
                      </DropdownMenuItem>
                    ))
                  }
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="break-words pr-6 pt-6">
              <FinbyteMarkdown>{comment.post}</FinbyteMarkdown>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 px-4 mt-8 w-full">
          <Button
            title="Like/Unlike Post"
            variant="ghost" size="sm"
            className='h-8 gap-1 px-2 text-muted-foreground'
            onClick={handle_like}
            disabled={!connected || !address}
          >
            <Heart
              className={`h-4 w-4 ${comment.post_likers?.some(a => a === address)
                ? "fill-current text-muted-foreground"
                : ""
                }`}
            />
            <span className="text-xs">{comment.post_likers?.length ?? 0}</span>
          </Button>
        </div>
      </Card>
    </>
  )
}

export default PostComment;