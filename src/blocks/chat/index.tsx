import { FC, useEffect, useState } from "react";

import SiteHeader from "@/components/site-header";
import { useToast } from "@/hooks/use-toast";
import { chat_post_data, create_comment_post_data, create_forum_post_data, platform_user_details } from "@/utils/api/interfaces";
import { fetch_chat_posts } from "@/utils/api/forums/fetch";
import { useWallet } from "@meshsdk/react";
import { format_long_string } from "@/utils/string-tools";
import { checkSignature, generateNonce } from "@meshsdk/core";
import { create_post } from "@/utils/api/forums/push";
import { fetch_author_data } from "@/utils/api/account/fetch";
import { useRouter } from "next/router";
import ChatBlock from "./chat-box";

const FinbyteChatBlock: FC = () => {
  const { toast } = useToast();
  const router = useRouter();
  const { address, connected, wallet } = useWallet();

  const [chat_posts, set_chat_posts] = useState<chat_post_data[] | null>(null);
  const [refreshing_state, set_refreshing_state] = useState(false);

  const get_posts = async () => {
    set_refreshing_state(true);
    const posts = await fetch_chat_posts();
    if (posts?.error) {
      toast({
        description: posts.error.toString(),
        variant: 'destructive'
      });
      return;
    }

    /** @todo paginate this properly from the db */
    const only_lastest_posts: chat_post_data[] = posts.data.slice(0, 25);
    const enriched_posts = await Promise.all(only_lastest_posts.map(async (post) => {
      const user_response = await fetch_author_data(post.author);
      const data: platform_user_details = user_response.data;
      return {
        ...post,
        user: data || null,
      };
    }));

    set_chat_posts(enriched_posts.sort((a, b) => b.timestamp - a.timestamp));
    set_refreshing_state(false);
  }

  const attempt_create_post = async (details: create_comment_post_data) => {
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
          if (creation?.data) {
            router.push('/forums/' + creation.data);
          } else {
            /** @note fallback just refreshes */
            await get_posts();
          }
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

  const attempt_delete_post = async (post_id: number) => {

  }

  const attempt_like_unlike = async (post_id: number, post_likers: string[]) => {

  }

  useEffect(() => {
    get_posts();
  }, []);

  return chat_posts && (
    <>
      <SiteHeader title="Finbyte Chat"/>
      <div className="flex flex-1 flex-col">
        <div className="@container/main p-2 lg:p-4 lg:w-[75%] lg:mx-auto">
          <ChatBlock
            posts={chat_posts}
            on_create={attempt_create_post}
            on_delete={attempt_delete_post}
            on_like_unlike={attempt_like_unlike}
          />
        </div>
      </div>
    </>
  )
}

export default FinbyteChatBlock;