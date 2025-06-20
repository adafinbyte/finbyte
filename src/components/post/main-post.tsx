import { FC, useState } from "react";
import { Card } from "../ui/card";
import { full_post_data, platform_user_details } from "@/utils/interfaces";
import FinbyteMarkdown from "../finbyte-md";
import FormatAddress from "../format-address";
import { Avatar, AvatarFallback } from "../ui/avatar";
import UserAvatar from "../user-avatar";
import { capitalize_first_letter, copy_to_clipboard } from "@/utils/common";
import { format_unix } from "@/utils/format";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu";
import { BookmarkPlus, Heart, MessageCircle, MoreHorizontal, Share2 } from "lucide-react";
import { Button } from "../ui/button";
import { useWallet } from "@meshsdk/react";
import { post_type } from "@/utils/types";
import { toast } from "sonner";
import { bookmarked_post } from "@/utils/api/account/push";
import PostLikersModal from "../modals/post-likers";
import SharePostModal from "../modals/share-post";
import { generate_options } from "../feed/post";
import { moderation_addresses } from "@/utils/consts";

interface custom_props {
  post_details: {
    post: full_post_data;
    author: platform_user_details;
  }
  connected_user_details: platform_user_details | null;

  get_post: () => Promise<void>;
  handle_like: () => Promise<void>;
  handle_follow_user: () => Promise<void>;
  handle_mute_user: () => Promise<void>;
  handle_mark_as_spam: () => Promise<void>;
}

const MainPost: FC <custom_props> = ({
  post_details, connected_user_details,
  get_post, handle_like, handle_follow_user, handle_mute_user, handle_mark_as_spam
}) => {
  const { address, connected } = useWallet();
  const feed_post = post_details.post;

  const [post_ui, set_post_ui] = useState({
    view_likers:   false,
    view_share:    false,
  });

  const handle_bookmark_post = async () => {
    if (!connected_user_details) {
      toast.error("Coulnd't fetch user details");
      return;
    }

    const bookmarked = await bookmarked_post(
      feed_post.post.id, address, connected_user_details.bookmarked_posts ?? []
    );
    if (bookmarked.error) {
      toast.error(bookmarked.error);
      return;
    }
    if (bookmarked.done) {
      toast.success(`You have updated your bookmark on this post.`);
      await get_post();
    }
  }

  const post_options = {
    disconnected_user_post_options: [
      { title: "Copy Address", action: () => { copy_to_clipboard(feed_post.post.author) } },
      { title: "View Likers", action: () => { set_post_ui(prev => ({ ...prev, view_likers: true })) } },
      { title: "Share Post", action: () => { set_post_ui(prev => ({ ...prev, view_share: true })) } },
    ],
    connected_user_post_options: [
      { title: connected_user_details?.following?.includes(feed_post.post.author) ? 'Unfollow User' : 'Follow User', action: handle_follow_user },
      { title: connected_user_details?.muted?.includes(feed_post.post.author) ? 'Unmute User' : 'Mute User', action: handle_mute_user },
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
    const is_author = connected && feed_post.post.author === address;

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
            <UserAvatar address={feed_post.post.author} />
            <AvatarFallback>{feed_post.post.author.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">
                  <FormatAddress address={feed_post.post.author} />
                </span>
                <span className="text-sm text-muted-foreground">
                  <span className="px-1.5">· {format_unix(feed_post.post.post_timestamp).time_ago}</span>
                </span>
              </div>

              <span className="ml-auto px-2 text-xs opacity-70">
                #{capitalize_first_letter(feed_post.post.topic)}
              </span>

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
              <FinbyteMarkdown>{feed_post.post.post}</FinbyteMarkdown>
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
              className={`h-4 w-4 ${feed_post.post.post_likers?.some(a => a === address)
                ? "fill-current text-muted-foreground"
                : ""
                }`}
            />
            <span className="text-xs">{feed_post.post.post_likers?.length ?? 0}</span>
          </Button>

          <div className="ml-auto"/>

          <Button
            title="Bookmark Post"
            variant="ghost" size="sm"
            className="h-8 gap-1 px-2 text-muted-foreground"
            onClick={handle_bookmark_post}
            disabled={!connected}
          >
            <BookmarkPlus
              className={`h-4 w-4 ${connected_user_details?.bookmarked_posts?.includes(feed_post.post.id)
                ? "fill-current text-muted-foreground"
                : ""
                }`}
            />
          </Button>

          <Button
            title="Share Post"
            variant="ghost" size="sm"
            className="h-8 gap-1 px-2 text-muted-foreground"
            onClick={() => set_post_ui(prev => ({ ...prev, view_share: true }))}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      <PostLikersModal
        onOpenChange={() => set_post_ui(prev => ({ ...prev, view_likers: false }))}
        open={post_ui.view_likers}
        likers={feed_post.post.post_likers ?? []}
        post_id={feed_post.post.id}
        post_type='feed_post'
      />

      <SharePostModal
        onOpenChange={() => set_post_ui(prev => ({ ...prev, view_share: false }))}
        open={post_ui.view_share}
        post_id={feed_post.post.id}
      />
    </>
  )
}

export default MainPost;