import { FC, useEffect, useState } from "react";

import ForumsActions from "./actions";
import ForumsPostsList from "./posts-list";

import SiteHeader from "@/components/site-header";
import { useToast } from "@/hooks/use-toast";
import { create_forum_post_data, forum_post_data, platform_user_details, post_with_comments } from "@/utils/api/interfaces";
import { fetch_all_forum_posts_with_comments } from "@/utils/api/forums/fetch";
import { useWallet } from "@meshsdk/react";
import { capitalize_first_letter, format_long_string, format_unix } from "@/utils/string-tools";
import { checkSignature, generateNonce } from "@meshsdk/core";
import { create_post } from "@/utils/api/forums/push";
import { fetch_author_data } from "@/utils/api/account/fetch";
import { useRouter } from "next/router";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowRight, Clock, Heart, MessagesSquare, Pin, ThumbsDown, ThumbsUp } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import FinbyteMarkdown from "@/components/finbytemd";
import { BorderBeam } from "@/components/ui/border-beam";
import UserAvatar from "@/components/user-avatar";
import FormatAddress from "@/components/format-address";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

const ForumsBlock: FC = () => {
  const { toast } = useToast();
  const router = useRouter();
  const { address, connected, wallet } = useWallet();

  const [forum_posts, set_forum_posts] = useState<post_with_comments[] | null>(null);
  const [all_forum_posts, set_all_forum_posts] = useState<post_with_comments[] | null>(null);
  const [refreshing_state, set_refreshing_state] = useState(false);

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

    /** @todo paginate this properly from the db */
    const only_lastest_posts: post_with_comments[] = posts.data.slice(0, 25);
    const enriched_posts = await Promise.all(only_lastest_posts.map(async (post) => {
      const user_response = await fetch_author_data(post.post.author);
      //@ts-ignore
      const data: platform_user_details = user_response.data;
      return {
        ...post,
        user: data,
      };
    }));

    set_all_forum_posts(enriched_posts);
    set_forum_posts(enriched_posts);

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

  useEffect(() => {
    get_posts();
  }, []);


  const votes = (post: post_with_comments) => {
    const post_votes = post.votes;
    const votes = post.post.section === 'requests' ? {yes: post_votes?.filter(vote => vote.vote === "yes").length ?? 0, no: post_votes?.filter(vote => vote.vote === "no").length ?? 0 } : null;
    return votes;
  }


  return (
    <>
      <SiteHeader title="Finbyte Forums"/>

      <div className="flex flex-1 flex-col relative">
        <div className="@container/main flex flex-1 flex-col p-2 lg:p-4 relative">
          <ForumsActions
            on_filter={filter_posts}
            on_create_post={attempt_create_post}
            on_refresh={get_posts}
            refreshing={refreshing_state}
          />

          <div className="flex gap-2 items-center pb-2">
            <Pin className="size-4 text-red-400"/>
            <Label>Pinned Posts</Label>
          </div>

          <div className="grid lg:grid-cols-2 gap-4 items-start">
            {all_forum_posts &&
              all_forum_posts.filter(a => a.post.is_pinned).map((item, index) => (
              <Card key={index} className="p-4 border-transparent relative dark:bg-black/40 bg-white/40 backdrop-blue-lg">
                <div className="flex gap-2 items-center">
                  <UserAvatar className="size-8" address={item.post.author}/>
                  <div className="flex flex-col justify-start">
                    <div>
                      <Label className="text-xs opacity-60">{item.post.author.substring(0, 10) + "..."}</Label>
                      <Label className="text-base font-bold tracking-wide bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-300 text-transparent bg-clip-text">{item.post.author.substring(item.post.author.length - 10)}</Label>
                    </div>

                    {item.user?.ada_handle && (
                      <FormatAddress address={item.user.ada_handle}/>
                    )}
                  </div>

                  <div className="ml-auto flex items-center gap-2">
                    <p className="text-xs opacity-80">{format_unix(item.post.updated_timestamp ? item.post.updated_timestamp : item.post.timestamp).time_ago}</p>
                    <Button onClick={() => router.push('/forums/' + item.post.id)} size='sm' variant='ghost'><ArrowRight/></Button>
                  </div>
                </div>

                <h1 className="text-lg font-semibold opacity-90 pt-2">{item.post.title}</h1>
                <ScrollArea>
                  <div className="max-h-100 scale-[90%]">
                    <FinbyteMarkdown>
                      {item.post.updated_post ? item.post.updated_post : item.post.post}
                    </FinbyteMarkdown>
                  </div>
                </ScrollArea>
                
                <div className="flex items-center gap-2 pt-2">
                  <div className="opacity-90 inline-flex gap-1 items-center text-xs">
                    <Heart className="size-3"/>
                    {item.post.post_likers?.length ?? 0} Likes
                  </div>

                  <div className="opacity-90 inline-flex gap-1 items-center text-xs">
                    <MessagesSquare className="size-3"/>
                    {item.comments?.length ?? 0} Comments
                  </div>

                  <div className="ml-auto"/>
                  
                  {item.post.section === 'requests' && (() => {
                    const voteCounts = votes(item);
                    return (
                      <>
                      <div className="opacity-90 inline-flex gap-1 items-center text-xs">
                        <ThumbsDown className="size-3" />
                        {voteCounts?.no ?? 0} No
                      </div>
                      <div className="opacity-90 inline-flex gap-1 items-center text-xs">
                        <ThumbsUp className="size-3" />
                        {voteCounts?.yes ?? 0} Yes
                      </div>
                      </>
                    );
                  })()}

                  <Badge variant='secondary'>
                    #{capitalize_first_letter(item.post.section)}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex gap-2 items-center pt-4">
            <Clock className="size-4 opacity-80"/>
            <Label>Recent Posts</Label>
          </div>
          <ForumsPostsList forum_posts={forum_posts} refreshing={refreshing_state}/>
        </div>
      </div>
    </>
  )
}

export default ForumsBlock;