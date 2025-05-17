import FinbyteMarkdown from "@/components/finbytemd";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { create_comment_post_data, create_community_post_data } from "@/utils/api/interfaces";
import { useWallet } from "@meshsdk/react";
import { Eraser, Glasses, Send, X } from "lucide-react";
import { FC, useEffect, useState } from "react";

interface custom_props {
  on_create: (details: create_comment_post_data | create_community_post_data) => Promise<void>;
  close_create: () => void;
  post_id?: number;
  token_slug?: string;
}

const CreateCommentComponent: FC <custom_props> = ({
  on_create, close_create, post_id, token_slug
}) => {
  const { address, connected } = useWallet();
  const [comment_query, set_comment_query] = useState('');
  const [preview_post, set_preview_post] = useState(false);

  const attempt_create = async () => {
    if ((comment_query.length < 30 || comment_query.length > 800)) {
      toast({
        title: 'Comment creation error.',
        description: comment_query.length < 30 ? 'Comment too small.' : 'Comment too big.',
        variant: 'destructive'
      });
      return;
    } else {
      if (!connected) {
        toast({
          description: 'No wallet found.',
          variant: 'destructive'
        });
        return;
      }
    }
    const timestamp = Math.floor(Date.now() / 1000);
    if (post_id && !token_slug) {
      const comment: create_comment_post_data = {
        author: address,
        post_id: post_id,
        timestamp: timestamp,
        post: comment_query
      }
      await on_create(comment);
    } else if (!post_id && token_slug) {
      const community: create_community_post_data = {
        author: address,
        token_slug: token_slug,
        timestamp: timestamp,
        post: comment_query
      }
      await on_create(community);
    }
    close_create();
  }

  const valid = (comment_query.length < 30 || comment_query.length > 800) ? false : true;
  const [valid_state, set_valid_state] = useState(valid);
  useEffect(() => {
    set_valid_state(valid)
  }, [comment_query]);

  return (
    <div className="grid w-full gap-2 pb-4">
      <Label htmlFor="comment">Create your comment</Label>
      {preview_post ?
        <span className="min-h-12">
          <FinbyteMarkdown>
            {comment_query}
          </FinbyteMarkdown>
        </span>
        :
        <>
          <Textarea
            placeholder="Type your comment here."
            id="comment"
            className={cn(
              comment_query.length > 0
              ? valid_state ?
              'border-green-400' : 'border-destructive' : '',
              "max-h-64"
            )}
            onChange={(e) => set_comment_query(e.target.value)}
            value={comment_query}
          />
          {!valid_state && comment_query.length > 0 && <p className="text-sm text-red-500 mt-1">{comment_query.length < 30 ? 'Comment too small.' : 'Comment too big.'}</p>}
        </>
      }

      <div className="flex gap-2 items-center">
        <Button onClick={() => set_comment_query('')} className="size-8 p-1" variant='outline' size='sm'>
          <Eraser/>
        </Button>

        <Button onClick={() => set_preview_post(!preview_post)} className="size-8 p-1" variant='outline' size='sm'>
          <Glasses/>
        </Button>

        <span className="ml-auto inline-flex gap-2">
          <Button onClick={close_create} className="size-8 p-1" variant='destructive' size='sm'>
            <X/>
          </Button>

          <Button onClick={attempt_create} className="size-8 p-1" variant='primary' size='sm'>
            <Send/>
          </Button>
        </span>
      </div>
    </div>
  )
}

export default CreateCommentComponent;