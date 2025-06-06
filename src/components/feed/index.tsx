"use client"

import { FC, useEffect, useState } from "react"
import { BookmarkPlus, Eraser, Glasses, Heart, HelpCircle, Info, MessageCircle, MoreHorizontal, PenLine, Repeat2, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { fetch_all_feed_posts, fetch_single_feed_post } from "@/utils/api/posts/fetch"
import { toast } from "sonner"
import { full_post_data, platform_user_details } from "@/utils/interfaces"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";

import { fetch_user_data } from "@/utils/api/account/fetch"
import { useWallet } from "@meshsdk/react"
import { LoadingDots } from "../loading-dots"
import FeedPost from "./post"
import FinbyteMarkdown from "../finbyte-md"
import CreateFeedPost from "./create-post"

interface custom_props {
  all_posts: full_post_data[] | null;
  refreshing_state: boolean;
  get_posts: () => Promise<void>;
  get_user_details: () => Promise<void>;
  selected_topic: string | null;
  user_details: platform_user_details | null;
  user_tfin_balance: number;
}

const FinbyteFeed: FC <custom_props> = ({
  all_posts, refreshing_state, get_posts, get_user_details, selected_topic, user_details, user_tfin_balance
}) => {
  const [current_tab, set_current_tab] = useState("all");

  /** @todo - we should do a different fetch function to get the connected users "following" posts **/

  return (
    <div className="space-y-4">
      <CreateFeedPost post_type='feed_post' post_id={undefined} on_create={get_posts} token_slug={undefined}/>

      <Card className="overflow-hidden">
        <CardHeader className="p-4 pb-2">
          <Tabs defaultValue={current_tab} className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="all" onClick={() => set_current_tab('all')} className="flex-1">
                Latest Posts
              </TabsTrigger>
              <TabsTrigger value="trending" onClick={() => set_current_tab('top')} className="flex-1">
                Trending Posts
              </TabsTrigger>
              <TabsTrigger value="following" onClick={() => set_current_tab('following')} className="flex-1" disabled>
                Following
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>

        <CardContent className="p-0">
          <div className="divide-y dark:divide-slate-800 py-4">
            {refreshing_state && (
              <LoadingDots />
            )}

            {all_posts &&
              [...all_posts]
                .filter((post) => {
                  if (!selected_topic) return true; // Show all if no topic is selected
                  return post.post.topic?.toLowerCase() === selected_topic.toLowerCase();
                })
                .sort((a, b) => {
                  if (current_tab === "top") {
                    return (b.post.post_likers?.length || 0) - (a.post.post_likers?.length || 0);
                  }
                  return 0;
                })
                .map((post) => (
                  <FeedPost key={post.post.id} feed_post={post} get_posts={get_posts} get_user_details={get_user_details} user_details={user_details} user_tfin_balance={user_tfin_balance}/>
                ))
            }
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default FinbyteFeed;