import Head from "next/head";;
import TokenBlock from "@/blocks/tokens/token-block";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import curated_tokens from "@/verified/tokens";
import { platform_user_details, post_with_comments } from "@/utils/api/interfaces";
import { toast } from "@/hooks/use-toast";
import { fetch_forum_post_with_comments } from "@/utils/api/main/fetch";
import { fetch_author_data } from "@/utils/api/account/fetch";
import ForumPostBlock from "@/blocks/forums/post-block";

export default function Home() {
  const router = useRouter();
  const [forum_post, set_forum_post] = useState<post_with_comments | null>(null);
  const [author_data, set_author_data] = useState<platform_user_details | null>(null);

  useEffect(() => {
    const path_segments = router.asPath.split('/');
    const post_id = path_segments[path_segments.length - 1];

    if (isNaN(Number(post_id))) {
      return;
    }

    const fetch_post = async (post_id: number) => {
      const post = await fetch_forum_post_with_comments(post_id);
      if (post?.error) {
        toast({
          description: post.error.toString(),
          variant: 'destructive'
        });
        return;
      }
      if (post?.data) {
        set_forum_post(prev => ({
            ...post.data,
          comments: post.data.comments ?? prev?.comments ?? []
        }));
    
        const author = await fetch_author_data(post.data.post.author);
        if (author?.error) {
          toast({
            description: author.error.toString(),
            variant: 'destructive'
          });
          return;
        }
        if (author?.data) {
          set_author_data(author.data);
        }
        set_forum_post(post.data);
      }
    }

    fetch_post(Number(post_id));
  }, [router.asPath]);

  return (forum_post && author_data) ? (
    <>
      <Head>
        <title>Viewing Post ID: #{forum_post.post.id} | Finbyte</title>
        <meta name="description" content="A Cardano dApp powered my Mesh" />
      </Head>

      <ForumPostBlock
        initial_forum_post={forum_post}
        initial_author_data={author_data}
      />
    </>
  ) : (
    <div>
      No post found...
    </div>
  );
}