import { full_post_data, platform_user_details } from "@/utils/interfaces";
import { FC, useEffect, useState } from "react";
import UserAvatar from "../user-avatar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import FormatAddress from "../format-address";
import { format_unix } from "@/utils/format";
import { Button } from "../ui/button";
import { ArrowRight, BookmarkPlus, HandCoins, Heart, MessageCircle, MoreHorizontal, Share2 } from "lucide-react";
import FinbyteMarkdown from "../finbyte-md";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { capitalize_first_letter, copy_to_clipboard } from "@/utils/common";
import CreateFeedPost from "../create-post";
import { useWallet } from "@meshsdk/react";
import { moderation_addresses } from "@/utils/consts";
import { like_unlike_post, mark_post_as_spam } from "@/utils/api/posts/push";
import { toast } from "sonner";
import { post_type } from "@/utils/types";
import PostLikersModal from "../modals/post-likers";
import FeedComment from "../comment";
import { bookmarked_post, follow_user, mute_user } from "@/utils/api/account/push";
import SharePostModal from "../modals/share-post";
import Link from "next/link";

interface custom_props {
  feed_post: full_post_data;
  get_posts: () => Promise<void>;
  get_user_details: () => Promise<void>;
  user_details: platform_user_details | null;
}

export type Option = {
  title: string;
  action: () => (void | Promise<void>);
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
  const { address, connected } = useWallet();
  const is_spam = feed_post.post.topic === 'spam';

  const [did_init, set_did_init] = useState(false);
  const [post_ui, set_post_ui] = useState({
    show_comments: false,
    hidden_post: false,
    view_likers: false,
    view_share: false,
  });

  useEffect(() => {
    if (!feed_post || !user_details || did_init) return;
    const is_muted = user_details.muted.includes(feed_post.post.author);
    const should_hide = is_spam || is_muted;

    set_post_ui(prev => ({ ...prev, hidden_post: should_hide }));
    set_did_init(true);
  }, [feed_post, user_details, did_init]);

  const handle_marked_post = async (post_id: number, post_type: post_type, user: string) => {
    const attemp_mark = await mark_post_as_spam(post_id, post_type, user);
    if (attemp_mark.error) toast.error(attemp_mark.error);
    if (attemp_mark.marked) {
      toast.success("Post marked as spam.");
      set_post_ui(prev => ({ ...prev, hidden_post: true }))
      await get_posts();
    }
  };

  const handle_like_post = async (post_type: post_type, post_id: number, likers: string[]) => {
    const is_liking = !likers.includes(address);
    const like_data = is_liking
      ? [...likers, address]
      : likers.filter((addr) => addr !== address);

    const like_action = await like_unlike_post(
      like_data,
      post_id,
      post_type === 'feed_comment' ? feed_post.post.author : undefined,
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
      await get_user_details();
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
      { title: "Copy Address", action: () => { copy_to_clipboard(feed_post.post.author) } },
      { title: "View Likers", action: () => { set_post_ui(prev => ({ ...prev, view_likers: true })) } },
      { title: "Hide Post", action: () => { set_post_ui(prev => ({ ...prev, hidden_post: true })) } },
      { title: "Share Post", action: () => { set_post_ui(prev => ({ ...prev, view_share: true })) } },
      /** @todo */
      //{ title: "Report Post", action: () => { }, destructive: true },
    ],
    connected_user_post_options: [
      { title: user_details?.following?.includes(feed_post.post.author) ? 'Unfollow User' : 'Follow User', action: handle_follow_user },
      { title: user_details?.muted?.includes(feed_post.post.author) ? 'Unmute User' : 'Mute User', action: handle_mute_user },
    ],
    author_post_options: [
      /** @todo */
      { title: "Remove Post", action: () => { }, destructive: true },
    ],
    mod_post_options: [
      { title: "Mark as Spam", action: () => handle_marked_post(feed_post.post.id, "feed_post", feed_post.post.author), destructive: true },
      /** @todo */
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

  if (post_ui.hidden_post) {
    return (
      <div id={feed_post.post.id.toString()} className="w-full bg-secondary/20 backdrop-blur-lg p-4 flex flex-col text-center">
        <div>
          <h1 className="text-muted-foreground text-sm">
            This post is hidden.
          </h1>

          {is_spam && (
            <h1 className="text-muted-foreground text-sm">
              This post has been marked as spam.
            </h1>
          )}

          {user_details?.muted?.includes(feed_post.post.author) && (
            <h1 className="text-muted-foreground text-sm">
              You have muted this user.
            </h1>
          )}
        </div>

        <div className="inline-flex justify-center gap-4 pt-2">
          <Button variant='secondary' size='sm' onClick={() => set_post_ui(prev => ({ ...prev, hidden_post: false }))} className="scale-[90%]">
            Unhide Post
          </Button>

          {user_details?.muted?.includes(feed_post.post.author) && (
            <Button variant='secondary' size='sm' onClick={handle_mute_user} className="scale-[90%]">
              Unmute User
            </Button>
          )}
        </div>
      </div>
    )
  } else {
    return (
      <div id={feed_post.post.id.toString()} className="p-4 relative bg-background/20 backdrop-blur-lg">
        <div>
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

              <div className="break-words pr-4">
                <FinbyteMarkdown>{feed_post.post.post}</FinbyteMarkdown>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4 px-8">
            <Button
              title="View Comments"
              variant="ghost" size="sm"
              className="h-8 gap-1 px-2 text-muted-foreground"
              onClick={() => set_post_ui(prev => ({ ...prev, show_comments: !prev.show_comments }))}
            >
              <MessageCircle
                className={`h-4 w-4 ${feed_post.comments.some(a => a.author === address)
                  ? "fill-current text-muted-foreground"
                  : ""
                  }`}
              />
              <span className="text-xs">{feed_post.comments.length ?? 0}</span>
            </Button>

            <Button
              title="Like/Unlike Post"
              variant="ghost" size="sm"
              className='h-8 gap-1 px-2 text-muted-foreground'
              disabled={!connected || !address}
              onClick={() => handle_like_post('feed_post', feed_post.post.id, feed_post.post.post_likers ?? [])}
            >
              <Heart
                className={`h-4 w-4 ${feed_post.post.post_likers?.some(a => a === address)
                  ? "fill-current text-muted-foreground"
                  : ""
                  }`}
              />
              <span className="text-xs">{feed_post.post.post_likers?.length ?? 0}</span>
            </Button>

            <Button
              title="Bookmark Post"
              variant="ghost" size="sm"
              className="h-8 gap-1 px-2 text-muted-foreground"
              onClick={() => handle_bookmark_post('feed_post', feed_post.post.id)}
              disabled={!connected}
            >
              <BookmarkPlus
                className={`h-4 w-4 ${user_details?.bookmarked_posts?.includes(feed_post.post.id)
                  ? "fill-current text-muted-foreground"
                  : ""
                  }`}
              />
            </Button>

            <Link title="View Post" href={'/post/' + feed_post.post.id}>
              <Button
                variant="ghost" size="sm"
                className="h-8 gap-1 px-2 text-muted-foreground"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {post_ui.show_comments && (
          <div className="p-4 bg-secondary/20 rounded-lg mt-4">
            <div className="w-full flex justify-end">
              <span className="text-xs text-muted-foreground">Comments: {feed_post.comments.length}</span>
            </div>

            <div className="pt-2 space-y-4">
              {feed_post.comments.length > 0 && feed_post.comments
                .sort((a, b) => b.comment_timestamp - a.comment_timestamp)
                .slice(0, 5)
                .map((comment, index) => (
                  <FeedComment
                    key={index}
                    index={index}
                    total_comments={feed_post.comments.length}
                    comment={comment}
                  />
                ))
              }
              {feed_post.comments.length > 5 && (
                <div className="w-full flex justify-end mt-4">
                  <span className="text-xs text-muted-foreground">View post to see all comments</span>
                </div>
              )}
            </div>
          </div>
        )}

        {post_ui.view_likers && (
          <PostLikersModal
            open={post_ui.view_likers}
            onOpenChange={() => set_post_ui(prev => ({ ...prev, view_likers: false }))}
            post_id={feed_post.post.id}
            post_type='feed_post'
            likers={feed_post.post.post_likers ?? []}
          />
        )}

        {post_ui.view_share && (
          <SharePostModal
            open={post_ui.view_share}
            onOpenChange={() => set_post_ui(prev => ({ ...prev, view_share: false }))}
            post_id={feed_post.post.id}
          />
        )}
      </div>
    );
  }
};

export default FeedPost;
