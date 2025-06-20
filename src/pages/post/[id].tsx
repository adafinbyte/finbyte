import { LoadingDots } from "@/components/loading-dots"
import { fetch_user_data } from "@/utils/api/account/fetch"
import { fetch_single_feed_post } from "@/utils/api/posts/fetch"
import { full_post_data, platform_user_details } from "@/utils/interfaces"
import { useWallet } from "@meshsdk/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import DefaultLayout from "@/components/default-layout"
import { AboutAuthor, PlatformQuickLinks } from "@/components/default-layout/right-sidebar"
import Head from "next/head"
import MainPost from "@/components/post/main-post"
import { like_unlike_post, mark_post_as_spam } from "@/utils/api/posts/push"
import { post_type } from "@/utils/types"
import CreateFeedPost from "@/components/create-post"
import { follow_user, mute_user } from "@/utils/api/account/push"
import PostComment from "@/components/post/comment"

export default function Post() {
  const { address, connected } = useWallet();
  const router = useRouter();
  const { id } = router.query;

  const [page_post_id, set_page_post_id] = useState<number | null>(null);
  const [found_post, set_found_post] = useState<full_post_data | null>(null);
  const [author_details, set_author_details] = useState<platform_user_details | null>(null);
  const [connected_user_post_details, set_connected_user_post_details] = useState<platform_user_details | null>(null);

  const post_details = found_post && author_details
    ? { post: found_post, author: author_details }
    : null;

  useEffect(() => {
    if (!router.isReady) return;

    const as_num = Number(id);
    if (id && !isNaN(as_num)) {
      set_page_post_id(as_num);
    } else {
      router.replace("/");
    }
  }, [id, router.isReady]);

  useEffect(() => {
    get_post();
  }, [page_post_id]);

  useEffect(() => {
    if (connected) {
      get_connected_user_details();
    } else {
      set_connected_user_post_details(null);
    }
  }, [connected]);

  const get_post = async () => {
    if (!page_post_id) return;

    const post = await fetch_single_feed_post(page_post_id);
    if (post.error) {
      toast.error(post.error);
      router.push('/');
      return;
    }
    if (post.data) {
      set_found_post(post.data);

      const author = await fetch_user_data(post.data.post.author);
      if (author.error) {
        toast.error(author.error);
        return;
      }
      if (author.data) {
        set_author_details(author.data);
      }
    }
  };

  const get_connected_user_details = async () => {
    if (!connected || !address) return;

    const user = await fetch_user_data(address);
    if (user.error) {
      toast.error(user.error);
      return;
    }
    if (user.data) {
      set_connected_user_post_details(user.data);
    }
  };

  const handle_mute_user = async (user: string) => {
    const muted = await mute_user(user, address, connected_user_post_details?.muted ?? []);
    if (muted.error) {
      toast.error(muted.error);
      return;
    }
    toast.success(`You have updated your mute status on this user.`);
    await get_post();
  };

  const handle_follow_user = async (user: string) => {
    const follow = await follow_user(user, address, connected_user_post_details?.following ?? []);
    if (follow.error) {
      toast.error(follow.error);
      return;
    }
    toast.success(`You have updated your follow status for this user.`);
    await get_post();
  };

  const handle_like_post = async (post_id: number, post_type: post_type, likers: string[]) => {
    if (!post_details) return;

    const is_liking = !likers.includes(address);
    const like_data = is_liking
      ? [...likers, address]
      : likers.filter((addr) => addr !== address);

    const like_action = await like_unlike_post(
      like_data,
      post_id,
      post_type === 'feed_comment' ? post_details.post.post.author : undefined,
      address,
      post_type,
      is_liking ? "like" : "unlike"
    );

    if (like_action.error) {
      toast.error(like_action.error);
      return;
    }

    toast.success(`You have ${is_liking ? 'liked' : 'unliked'} this post.`);
    await get_post();
  };

  const handle_mark_as_spam = async (post_id: number, post_type: post_type, user: string) => {
    const attemp_mark = await mark_post_as_spam(post_id, post_type, user);
    if (attemp_mark.error) toast.error(attemp_mark.error);
    if (attemp_mark.marked) {
      toast.success("Post marked as spam.");
      await get_post();
    }
  };

  const right_sidebar_contents = (
    <>
      <AboutAuthor author={post_details?.author} />
      <PlatformQuickLinks/>
    </>
  );

  return (
    <>
      <Head>
        <title>{found_post ? '#' + found_post.post.id : 'Post'} - Finbyte</title>
      </Head>

      <DefaultLayout right_sidebar={right_sidebar_contents}>
        {post_details ? (
          <>
            {post_details.post.post.topic === 'spam' && (
              <div className="border border-destructive p-4 rounded-xl">
                <h1 className="text-lg text-center font-semibold text-muted-foreground">This post has been marked as spam.</h1>
              </div>
            )}

            <MainPost
              post_details={post_details}
              get_post={get_post}
              connected_user_details={connected_user_post_details}
              handle_like={() => handle_like_post(
                post_details.post.post.id, 'feed_post', post_details.post.post.post_likers ?? []
              )}
              handle_follow_user={() => handle_follow_user(post_details.post.post.author)}
              handle_mute_user={() => handle_mute_user(post_details.post.post.author)}
              handle_mark_as_spam={() => handle_mark_as_spam(post_details.post.post.id, "feed_post", post_details.post.post.author)}
            />

            <CreateFeedPost
              bg_type="transparent"
              post_type="feed_comment"
              post_id={post_details.post.post.id}
              on_create={get_post}
              token_slug={undefined}
              post_author={post_details.post.post.author}
            />

            <h1 className="text-center text-xs text-muted-foreground font-semibold">
              Total Comments: {post_details.post.comments.length ?? 0}
            </h1>

            <div className="space-y-4">
              {post_details.post.comments.map((comment, index) => (
                <PostComment
                  key={index}
                  comment={comment}
                  connected_user_details={connected_user_post_details}
                  get_post={get_post}
                  handle_like={() => handle_like_post(
                    post_details.post.post.id, 'feed_post', post_details.post.post.post_likers ?? []
                  )}
                  handle_follow_user={() => handle_follow_user(post_details.post.post.author)}
                  handle_mute_user={() => handle_mute_user(post_details.post.post.author)}
                  handle_mark_as_spam={() => handle_mark_as_spam(post_details.post.post.id, "feed_post", post_details.post.post.author)}
                />
              ))}
            </div>
          </>
        ) : (
          <LoadingDots />
        )}
      </DefaultLayout>
    </>
  );
}
