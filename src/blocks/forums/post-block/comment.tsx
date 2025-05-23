"use client";

import { Heart, VerifiedIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { FC, useEffect, useState } from "react";
import { comment_post_data, platform_user_details } from "@/utils/api/interfaces";
import { Avatar } from "@/components/ui/avatar";
import UserAvatar from "@/components/user-avatar";
import { format_long_string, format_unix } from "@/utils/string-tools";
import FinbyteMarkdown from "@/components/finbytemd";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWallet } from "@meshsdk/react";
import PostOptionsButton from "./actions/post-options";
import ViewLikersModal from "@/components/modals/view-likers";
import DeletePostModal from "@/components/modals/delete-post";
import LikePostModal from "@/components/modals/like-post";
import { fetch_author_data } from "@/utils/api/account/fetch";
import { toast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

interface custom_props {
  comment_post: comment_post_data;
  original_post_author: string;
  toggle_hide: () => void;
  on_delete: () => Promise<void>;
  on_like: () => Promise<void>;
  comment_index: number;
}

const ForumCommentComponent: FC <custom_props> = ({
  comment_post, original_post_author, toggle_hide, on_delete, on_like, comment_index
}) =>{
  const is_registered = false; //todo
  const { address, connected } = useWallet();

  const [author_data, set_author_data] = useState<platform_user_details | null>(null);

  const [current_view, set_current_view] = useState<'post' | 'edit'>('post');
  const [show_original_post, set_show_original_post] = useState(false);
  const [show_alternative_timestamp, set_show_alternative_timestamp] = useState(false);

  const toggle_edit_view = () => set_current_view(current_view === 'edit' ? 'post' : 'edit')
  const toggle_original_post = () => set_show_original_post(comment_post.updated_post ? false : true);
  const toggle_timestamp = () => set_show_alternative_timestamp(!show_alternative_timestamp);

  const [view_likers_modal_open, set_view_likers_modal_open] = useState(false);
  const [delete_post_modal_open, set_delete_post_modal_open] = useState(false);
  const [like_post_modal_open, set_like_post_modal_open] = useState(false);

  const get_author_details = async () => {
    const author = await fetch_author_data(comment_post.author);
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
  }

  useEffect(() => {
    get_author_details()
  }, []);

  return (
    <>
      <Card className="relative dark:border-neutral-800 p-4">
        <div className="flex gap-4 items-center relative">
          <div className="shrink-0">
            <div className="size-10 rounded-lg overflow-hidden">
              <Avatar>
                <UserAvatar address={comment_post.author}/>
              </Avatar>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="inline-flex items-center gap-2">
                    {original_post_author === comment_post.author && (
                      <Badge className="text-xs cursor-default" variant='secondary'>OP</Badge>
                    )}
                    <span className="font-semibold text-black dark:text-white/90 hover:underline cursor-pointer">
                      {format_long_string(comment_post.author)}
                    </span>
                  </span>

                  {author_data?.account_data && (
                    <VerifiedIcon className="h-4 w-4 text-blue-400" />
                  )}
                </div>

                  {author_data?.ada_handle && (
                    <span className="text-black dark:text-white/60 text-sm inline-flex items-center">
                      <svg className="size-3 inline-block" viewBox="0 0 190 245" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M59.04 18.432c0-4.416 3.648-8.544 10.944-12.384C77.28 2.016 86.88 0 98.784 0 108 0 113.952 1.92 116.64 5.76c1.92 2.688 2.88 5.184 2.88 7.488v8.64c21.696 2.304 36.768 6.336 45.216 12.096 3.456 2.304 5.184 4.512 5.184 6.624 0 9.984-2.4 20.736-7.2 32.256-4.608 11.52-9.12 17.28-13.536 17.28-.768 0-3.264-.864-7.488-2.592-12.672-5.568-23.232-8.352-31.68-8.352-8.256 0-13.92.768-16.992 2.304-2.88 1.536-4.32 3.936-4.32 7.2 0 3.072 2.112 5.472 6.336 7.2 4.224 1.728 9.408 3.264 15.552 4.608 6.336 1.152 13.152 3.168 20.448 6.048 7.488 2.88 14.4 6.336 20.736 10.368s11.616 10.08 15.84 18.144c4.224 7.872 6.336 15.936 6.336 24.192s-.768 15.072-2.304 20.448c-1.536 5.376-4.224 10.944-8.064 16.704-3.648 5.76-9.312 10.944-16.992 15.552-7.488 4.416-16.512 7.68-27.072 9.792v4.608c0 4.416-3.648 8.544-10.944 12.384-7.296 4.032-16.896 6.048-28.8 6.048-9.216 0-15.168-1.92-17.856-5.76-1.92-2.688-2.88-5.184-2.88-7.488v-8.64c-12.48-1.152-23.328-2.976-32.544-5.472C8.832 212.64 0 207.456 0 201.888 0 191.136 1.536 180 4.608 168.48c3.072-11.712 6.72-17.568 10.944-17.568.768 0 8.736 2.592 23.904 7.776 15.168 5.184 26.592 7.776 34.272 7.776s12.672-.768 14.976-2.304c2.304-1.728 3.456-4.128 3.456-7.2s-2.112-5.664-6.336-7.776c-4.224-2.304-9.504-4.128-15.84-5.472-6.336-1.344-13.248-3.456-20.736-6.336-7.296-2.88-14.112-6.24-20.448-10.08s-11.616-9.504-15.84-16.992c-4.224-7.488-6.336-16.224-6.336-26.208 0-35.328 17.472-55.968 52.416-61.92v-3.744z" fill="#0CD15B"></path></svg>
                      {author_data?.ada_handle.slice(1)}
                    </span>
                  )}
                </div>

                <div className="p-1 flex items-center justify-center">
                  <PostOptionsButton
                    post_type='forum_comment'
                    current_view={current_view}
                    showing_original_post={show_original_post}
                    is_edited={comment_post.updated_post ? true : false}
                    post_author={comment_post.author}
                    toggle_edit={toggle_edit_view}
                    toggle_original_post={toggle_original_post}
                    toggle_timestamp={toggle_timestamp}
                    toggle_hide_comment={toggle_hide}
                    modal_toggles={{
                      view_likers: () => set_view_likers_modal_open(true),
                      view_delete_post: () => set_delete_post_modal_open(true)
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <hr className="border-black/10 dark:border-white/10 my-4"/>

          <div className="mt-2 relative">
            <FinbyteMarkdown>
              {comment_post.post}
            </FinbyteMarkdown>

            <span className="pt-2 text-black dark:text-white/50 text-sm mt-2 block flex w-full justify-between">
              {show_alternative_timestamp ? format_unix(comment_post.timestamp).date : format_unix(comment_post.timestamp).time_ago}

              <Badge variant={'outline'}>
                #{comment_index}
              </Badge>
            </span>

            <hr className='border-black/10 dark:border-white/10 my-4'/>

            <div className="inline-flex gap-2">
              <Button size={'sm'} disabled={!connected} variant='ghost' onClick={() => set_like_post_modal_open(true)}>
                <Heart className={`${comment_post.post_likers?.includes(address) ? 'text-rose-400 fill-rose-400' : ''}`}/>
                {comment_post.post_likers?.includes(address) ? 'Unlike Post' : 'Like Post'}
              </Button>
            </div>
          </div>
      </Card>

      <ViewLikersModal
    open={view_likers_modal_open}
    onOpenChange={set_view_likers_modal_open}
    likers={comment_post.post_likers  ?? []}
  />
  <DeletePostModal
    open={delete_post_modal_open}
    onOpenChange={set_delete_post_modal_open}
    on_delete={on_delete}
  />
  <LikePostModal
    open={like_post_modal_open}
    onOpenChange={set_like_post_modal_open}
    on_like={on_like}
    is_a_liker={comment_post.post_likers?.includes(address) ? true : false}
    />
    </>
  );
}

export default ForumCommentComponent;