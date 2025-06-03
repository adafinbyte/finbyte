import { comment_post_data, full_post_data, platform_user_details } from "@/utils/interfaces";
import { FC, useEffect, useState } from "react";
import UserAvatar from "../user-avatar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import FormatAddress from "../format-address";
import { format_long_string, format_unix } from "@/utils/format";
import { Button } from "../ui/button";
import { BookmarkPlus, HandCoins, Heart, MessageCircle, MoreHorizontal, Share2 } from "lucide-react";
import FinbyteMarkdown from "../finbyte-md";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { capitalize_first_letter, get_timestamp } from "@/utils/common";
import CreateFeedPost from "./create-post";
import { useWallet } from "@meshsdk/react";
import { moderation_addresses } from "@/utils/consts";
import { like_unlike_post, mark_post_as_spam } from "@/utils/api/posts/push";
import { toast } from "sonner";
import { post_type } from "@/utils/types";
import PostLikersModal from "../modals/post-likers";
import FeedComment from "./comment";
import { Transaction } from "@meshsdk/core";
import { bookmarked_post, follow_user, mute_user } from "@/utils/api/account/push";
import SharePostModal from "../modals/share-post";

interface custom_props {
  feed_post: full_post_data;
  get_posts: () => Promise<void>;
  get_user_details: () => Promise<void>;
  user_details: platform_user_details | null;
}

export type Option = {
  title: string;
  action: () => void;
  destructive?: boolean;
};

export const generate_options = ({
  is_connected,
  is_author,
  is_mod,
  base_options,
  connected_options,
  author_options,
  mod_options,
}: {
  is_connected: boolean;
  is_author: boolean;
  is_mod: boolean;
  base_options: Option[];
  connected_options: Option[];
  author_options: Option[];
  mod_options: Option[];
}): Option[] => {
  let options = [...base_options];

  if (is_connected) {
    options.push(...connected_options);
    if (is_author) options.push(...author_options);
    if (is_mod) options.push(...mod_options);
  }

  const seen = new Set();
  return options.filter((opt) => {
    if (seen.has(opt.title)) return false;
    seen.add(opt.title);
    return true;
  });
};

const FeedPost: FC<custom_props> = ({ feed_post, get_posts, get_user_details, user_details }) => {
  const { address, connected, wallet } = useWallet();
  const [show_comments, set_show_comments] = useState(false);
  const [show_tip_post, set_show_tip_post] = useState(false);
  const [hidden_post, set_hidden_post] = useState(false);
  const [view_likers, set_view_likers] = useState(false);
  const [share_post, set_share_post] = useState(false);

  const [chosen_tip_asset, set_chosen_tip_asset] = useState<string | null>(null);
  const [chosen_tip_amount, set_chosen_tip_amount] = useState<number | null>(null);

  useEffect(() => {
    const spam_hidden = () => {
      return feed_post.post.topic === 'spam' ? set_hidden_post(true) : set_hidden_post(false)
    }
    spam_hidden();
  }, [feed_post]);

  useEffect(() => {
    const muted_hidden = () => {
      if (!user_details) { return; }
      return user_details.muted?.includes(feed_post.post.author) ? set_hidden_post(true) : set_hidden_post(false)
    }

    if (connected && user_details) {
      muted_hidden();
    }
  }, [connected, user_details]);

  const handle_option = (option: "comment" | "tip") => {
    if (option === "comment") {
      set_show_tip_post(false);
      set_show_comments(!show_comments);
    } else {
      set_show_comments(false);
      set_show_tip_post(!show_tip_post);
    }
  };

  const handle_marked_post = async (post_id: number, post_type: post_type) => {
    const attemp_mark = await mark_post_as_spam(post_id, post_type, address);
    if (attemp_mark.error) toast.error(attemp_mark.error);
    if (attemp_mark.marked) {
      toast.success("Post marked as spam.");
      set_hidden_post(true);
      await get_posts();
    }
  };

  const handle_tip_post = async (address: string) => {
    if (!chosen_tip_asset) {
      toast.error('An asset has not been chosen.');
      return;
    }

    if (!chosen_tip_amount) {
      toast.error('Asset amount has not been chosen.');
      return;
    }

    const tx = new Transaction({ initiator: wallet });

    const send_asset = tx.sendAssets(
      { address: address },
      [
        {
          unit: chosen_tip_asset,
          quantity: '1',
        },
      ]
    );

    const send_token = async () => {
    }
  }

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

  const handle_bookmark_post = async (post_type: post_type, post_id: number) => {
    if (!user_details) {
      toast.error("Coulnd't fetch user details");
      return;
    }

    const bookmarked = await bookmarked_post(post_id, address, user_details.bookmarked_posts ?? []);
    if (bookmarked.error) {
      toast.error(bookmarked.error);
      return;
    }
    if (bookmarked.done) {
      toast.success(`You have updated your bookmark on this post.`);
      await get_user_details();
      await get_posts();
    }
  }

  const handle_mute_user = async () => {
    const muted = await mute_user(feed_post.post.author, address, user_details?.muted ?? []);
    if (muted.error) {
      toast.error(muted.error);
      return;
    }
    if (muted.done) {
      toast.success(`You have updated your mute status on this user.`);
      await get_user_details();
      await get_posts();
    }
  }

  const handle_follow_user = async () => {
    const follow = await follow_user(feed_post.post.author, address, user_details?.following ?? []);
    if (follow.error) {
      toast.error(follow.error);
      return;
    }
    if (follow.done) {
      toast.success(`You have updated your follow status on this user.`);
      await get_user_details();
      await get_posts();
    }
  }

  const post_options = {
    disconnected_user_post_options: [
      { title: "View Likers", action: () => { set_view_likers(true) } },
      { title: "Hide Post", action: () => { set_hidden_post(true) } },
      { title: "Report Post", action: () => { }, destructive: true },
    ],
    connected_user_post_options: [
      { title: user_details?.following?.includes(feed_post.post.author) ? 'Unfollow User' : 'Follow User', action: handle_follow_user },
      { title: user_details?.muted?.includes(feed_post.post.author) ? 'Unmute User' : 'Mute User', action: handle_mute_user },
    ],
    author_post_options: [
      //{ title: "Edit Post", action: () => { } },
      { title: "Remove Post", action: () => { }, destructive: true },
    ],
    mod_post_options: [
      { title: "Mark as Spam", action: () => handle_marked_post(feed_post.post.id, "feed_post"), destructive: true },
      { title: "Remove Post", action: () => { }, destructive: true },
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

  if (hidden_post) {
    return (
      <div className="w-full bg-secondary p-4 flex flex-col text-center">
        <div>
          <h1 className="text-muted-foreground text-sm">
            This post has been hidden.
          </h1>

          {user_details?.muted?.includes(feed_post.post.author) && (
            <h1 className="text-muted-foreground text-sm">
              You have muted this user.
            </h1>
          )}
        </div>

        <div className="inline-flex justify-center gap-4">
          <Button variant='secondary' size='sm' onClick={() => set_hidden_post(false)}>
            Unhide Post
          </Button>

          {user_details?.muted?.includes(feed_post.post.author) && (
            <Button variant='secondary' size='sm' onClick={handle_mute_user}>
              Unmute User
            </Button>
          )}
        </div>
      </div>
    )
  } else {
    return (
      <div className="p-4 relative">
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
                  {feed_post.author_details?.ada_handle && (
                    <>
                      {" · "}
                      <FormatAddress address={feed_post.author_details.ada_handle} />
                    </>
                  )}
                  <span className="px-1.5">· {format_unix(feed_post.post.post_timestamp).time_ago}</span>
                </span>
              </div>
              <span className="ml-auto px-2 text-sm opacity-70">
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
                    ))}
                  <DropdownMenuSeparator />
                  {rendered_post_options()
                    .filter((opt) => opt.destructive)
                    .map((item, idx) => (
                      <DropdownMenuItem key={`d-${idx}`} className="text-destructive" onClick={item.action}>
                        {item.title}
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="break-words pr-4">
              <FinbyteMarkdown>{feed_post.post.post}</FinbyteMarkdown>
            </div>

            <div className="flex justify-between pt-2">
              <Button onClick={() => handle_option("comment")} variant="ghost" size="sm" className="h-8 gap-1 px-2 text-muted-foreground">
                <MessageCircle
                  className={`h-4 w-4 ${feed_post.comments.some(a => a.author === address)
                    ? "fill-current text-muted-foreground"
                    : ""
                    }`}
                  />
                <span className="text-xs">{feed_post.comments.length ?? 0}</span>
              </Button>
              <Button disabled={!connected || !address} onClick={() => handle_like_post('feed_post', feed_post.post.id, feed_post.post.post_likers ?? [])} variant="ghost" size="sm" className='h-8 gap-1 px-2 text-muted-foreground'>
                <Heart
                  className={`h-4 w-4 ${feed_post.post.post_likers?.includes(address)
                      ? "fill-current text-muted-foreground"
                      : ""
                    }`}
                />
                <span className="text-xs">{feed_post.post.post_likers?.length ?? 0}</span>
              </Button>
              <Button onClick={() => handle_bookmark_post('feed_post', feed_post.post.id)} disabled={!connected} variant="ghost" size="sm" className="h-8 gap-1 px-2 text-muted-foreground">
                <BookmarkPlus
                  className={`h-4 w-4 ${user_details?.bookmarked_posts?.includes(feed_post.post.id)
                    ? "fill-current text-muted-foreground"
                    : ""
                    }`}
                  />
              </Button>
              <Button disabled={!connected} onClick={() => handle_option("tip")} variant="ghost" size="sm" className="h-8 gap-1 px-2 text-muted-foreground">
                <HandCoins className="h-4 w-4" />
              </Button>
              <Button onClick={() => set_share_post(true)} variant="ghost" size="sm" className="h-8 gap-1 px-2 text-muted-foreground">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {show_comments && (
          <div className="p-4 bg-secondary rounded-lg mt-4">
            <CreateFeedPost post_type="feed_comment" post_id={feed_post.post.id} on_create={get_posts} />

            <div className="w-full flex justify-end mt-4">
              <span className="text-xs text-muted-foreground">Comments: {feed_post.comments.length}</span>
            </div>

            <div className="divide-y dark:divide-secondary mt-4">
              {feed_post.comments.length > 0 &&
                feed_post.comments
                  .sort((a, b) => b.post_timestamp - a.post_timestamp)
                  .map((comment, index) => (
                    <FeedComment
                      key={index}
                      index={index}
                      total_comments={feed_post.comments.length}
                      comment={comment}
                    />
                  ))}
            </div>
          </div>
        )}

        {show_tip_post &&
          <div className="p-4 bg-secondary rounded-lg mt-4">
            <h1>WIP</h1>
          </div>
        }

        {view_likers && (
          <PostLikersModal
            open={view_likers}
            onOpenChange={set_view_likers}
            post_id={feed_post.post.id}
            post_type='feed_post'
            likers={feed_post.post.post_likers ?? []}
          />
        )}

        {share_post && (
          <SharePostModal
            open={share_post}
            onOpenChange={set_share_post}
            post_id={feed_post.post.id}
          />
        )}
      </div>
    );
  }
};

export default FeedPost;
