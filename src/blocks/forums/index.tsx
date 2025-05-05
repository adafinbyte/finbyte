import { FC, useEffect, useState } from "react";

import ForumsActions from "./actions";
import ForumsPostsList from "./posts-list";

import SiteHeader from "@/components/site-header";
import { useToast } from "@/hooks/use-toast";
import { create_forum_post_data, post_with_comments } from "@/utils/api/interfaces";
import { fetch_all_forum_posts_with_comments } from "@/utils/api/main/fetch";
import { useWallet } from "@meshsdk/react";
import { format_long_string } from "@/utils/string-tools";
import { checkSignature, generateNonce } from "@meshsdk/core";
import { create_post } from "@/utils/api/main/push";

const ForumsBlock: FC = () => {
  const { toast } = useToast();
  const { address, connected, wallet } = useWallet();

  const [forum_posts, set_forum_posts] = useState<post_with_comments[] | null>(null);
  const [all_forum_posts, set_all_forum_posts] = useState<post_with_comments[] | null>(null);
  const [refreshing_state, set_refreshing_state] = useState(false);

  const known_sections = [
    'general', 'requests', 'finbyte'
  ]

  const get_posts = async () => {
    set_refreshing_state(true);
    const posts = await fetch_all_forum_posts_with_comments();
    if (posts?.error) {
      toast({
        description: posts.error.toString(),
        variant: 'destructive'
      });
      return;
    }
    if (posts?.data) {
      set_all_forum_posts(posts.data);
      set_forum_posts(posts.data);
    }
    set_refreshing_state(false);
  }

  const filter_posts = async (by_section?: string) => {
    if (!all_forum_posts) return;
  
    if (!by_section || by_section === 'all') {
      return set_forum_posts(all_forum_posts);
    }
  
    set_forum_posts(all_forum_posts.filter(a => a.post.section === by_section));
  }

  const attempt_create_post = async (details: create_forum_post_data) => {
    if (!connected) { return; }

    const data_to_sign = `${format_long_string(details.author)} created a forum post at ${details.timestamp}`;
    try {
      const nonce = generateNonce(data_to_sign);
      const signature = await wallet.signData(nonce, address);

      if (signature) {
        const is_valid_sig = await checkSignature(nonce, signature, address);
        if (is_valid_sig) {
          if (address !== details.author) {
            toast({
              description: `Your address doesn't seem to match the author!`,
              variant: 'destructive'
            });
            return;
          }
          const creation = await create_post(details, 'forum_post', details.timestamp, address);
          if (creation?.error) {
            toast({
              description: creation.error.toString(),
              variant: 'destructive'
            });
            return;
          }
          await get_posts();
        } else {
          toast({
            description: 'Signature verification failed! Whoops, is it your wallet?',
            variant: 'destructive'
          });
          return;
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        toast({
          description: error.message,
          variant: 'destructive'
        });
      } else {
        throw error;
      }
    }
  }

  useEffect(() => {
    get_posts();
  }, []);

  return (
    <>
      <SiteHeader title="Finbyte Forums"/>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2 p-2 lg:p-4">
          <ForumsActions
            on_filter={filter_posts}
            on_create_post={attempt_create_post}
            on_refresh={get_posts}
            refreshing={refreshing_state}
          />

          <ForumsPostsList forum_posts={forum_posts} refreshing={refreshing_state}/>
        </div>
      </div>
    </>
  )
}

export default ForumsBlock;