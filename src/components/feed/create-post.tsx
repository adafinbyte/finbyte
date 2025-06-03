import { FC, useState } from "react";
import { Card, CardContent } from "../ui/card";
import FinbyteMarkdown from "../finbyte-md";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Eraser, Glasses, HelpCircle, PenLine } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { toast } from "sonner";
import { useWallet } from "@meshsdk/react";
import { post_type } from "@/utils/types";
import { create_post } from "@/utils/api/posts/push";
import { create_feed_comment, create_feed_post } from "@/utils/interfaces";
import { capitalize_first_letter, get_timestamp } from "@/utils/common";
import { fetch_single_feed_post } from "@/utils/api/posts/fetch";
import { finbyte_topics } from "@/utils/consts";

interface custom_props {
  post_type: post_type;
  post_id: number | undefined;
  on_create: () => Promise<void>;
}

const CreateFeedPost: FC <custom_props> = ({
  post_type, post_id, on_create
}) => {
  const { address, connected } = useWallet();
  const [chosen_topic, set_chosen_topic] = useState("General");
  const [create_post_input, set_create_post_input] = useState("");
  const [previewing_created_post, set_previewing_created_post] = useState(false);

  const attempt_create_post = async () => {
    if (!connected) {
      toast.error('No wallet found.');
      return;
    }

    const post_timestamp = get_timestamp();

    const handle_post_creation = async (post_data: create_feed_post | create_feed_comment) => {
      try {
        const post_creation = await create_post(post_data, post_type);
        if (post_creation.error) {
          toast.error(post_creation.error);
          return;
        }
        if (post_creation.created) {
          await on_create();
          set_create_post_input('');
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'An unexpected error occurred.');
      }
    };

    if (post_type === 'feed_post') {
      const post_data: create_feed_post = {
        author: address,
        topic: chosen_topic.toLowerCase(),
        post: create_post_input,
        post_timestamp,
      };
      await handle_post_creation(post_data);
    } else if (post_type === 'feed_comment' && post_id) {
      const post_data: create_feed_comment = {
        author: address,
        post: create_post_input,
        comment_timestamp: post_timestamp,
        post_id,
      };
      await handle_post_creation(post_data);
    }
  };
  
  return (
    <Card className={`${post_type === 'feed_comment' ? 'border-0' : ''}`}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="flex-1">
            {previewing_created_post ?
              <div className="p-2 min-h-[80px]">
                <FinbyteMarkdown>
                  {create_post_input}
                </FinbyteMarkdown>
              </div>
              :
              <Textarea
                placeholder="What's happening?"
                className="min-h-[80px] resize-none p-2 focus-visible:ring-0"
                value={create_post_input}
                onChange={(e) => set_create_post_input(e.target.value)}
              />
            }

            <div className="mt-4 flex items-center justify-between">
              <div className="flex gap-2">
                <Button onClick={() => set_create_post_input('')} variant="outline" size="sm" className="text-xs">
                  <Eraser />
                </Button>

                <Button onClick={() => set_previewing_created_post(!previewing_created_post)} variant="outline" size="sm" className="text-xs">
                  {previewing_created_post ? <PenLine /> : <Glasses />}
                </Button>

                <Button title="Finbyte Markdown Help" variant="outline" size="sm" className="text-xs">
                  <HelpCircle />
                </Button>

                {post_type === 'feed_post' && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="text-xs">
                        #{chosen_topic}
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      {finbyte_topics.map((topic, index) => topic !== 'spam' && (
                        <DropdownMenuItem key={index} onClick={() => set_chosen_topic(topic)}>#{capitalize_first_letter(topic)}</DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              <Button size="sm" disabled={!create_post_input.trim() || !connected} onClick={attempt_create_post}>
                Post
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CreateFeedPost;