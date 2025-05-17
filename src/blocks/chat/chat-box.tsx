"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useWallet } from "@meshsdk/react"
import { motion, AnimatePresence } from "framer-motion";
import { Eraser, Glasses, SendIcon } from "lucide-react"

import FinbyteChatComponent from "./comment"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { AutoTextarea } from "@/components/ui/textarea-auto";
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { LoadingDots } from "@/components/ui/loading-dots"

import { cn } from "@/lib/utils"

import { chat_post_data, create_chat_post_data, platform_user_details } from "@/utils/api/interfaces"
import { fetch_chat_posts } from "@/utils/api/forums/fetch"
import { create_post } from "@/utils/api/forums/push"
import { fetch_author_data } from "@/utils/api/account/fetch";
import { checkSignature, generateNonce } from "@meshsdk/core";
import { format_unix } from "@/utils/string-tools";
import FinbyteMarkdown from "@/components/finbytemd";

export function ChatForm({ className, ...props }: React.ComponentProps<"form">) {
  const { address, connected, wallet } = useWallet();

  const [input, setInput] = useState("");
  const [loading, set_loading] = useState(false);
  const [current_page, set_current_page] = useState(1);
  const [posts, set_posts] = useState<chat_post_data[] | null>(null);
  const [previewing_post, set_previewing_post] = useState(false);

  const get_chat_data = async () => {
    set_loading(true);

    const { data, error } = await fetch_chat_posts(current_page);
    if (error) {
      toast('Failed to get chat posts', {
        description: error,
      });
      set_loading(false);
      return;
    }

    if (!data) {
      set_loading(false);
      return;
    }

    const authorCache: Record<string, platform_user_details> = {};
    const enrichedPosts = await Promise.all(
      data.map(async (post) => {
        if (!post.author) return post;

        if (!authorCache[post.author]) {
          const author = await fetch_author_data(post.author);
          if (author?.error) {
            toast.error(author.error as string);
          } else if (author?.data) {
            authorCache[post.author] = author.data;
          }
        }

        return {
          ...post,
          user: authorCache[post.author] ?? null,
        };
      })
    );

    set_posts(enrichedPosts);
    set_loading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) { return; }
    if (!address || !connected) {
      toast('No wallet connected', {
        description: 'You need to connect your wallet in order to preform this action.'
      });
      return;
    }

    const timestamp = Math.floor(Date.now() / 1000);
    try {
      const details: create_chat_post_data = {
        author: address,
        timestamp: timestamp,
        post: input
      }

      const signing_data = `${address} is creating a finbyte chat at ${format_unix(timestamp).date} (${timestamp})`;
      const nonce = generateNonce(signing_data);
      const signature = await wallet.signData(nonce, address);
      if (signature) {
        const is_valid_sig = await checkSignature(nonce, signature, address);
        if (is_valid_sig) {
          const creation = await create_post(details, 'finbyte_chat', details.timestamp, address);
          if (creation?.error) {
            toast.warning('Could not create post', {
              description: creation.error as string
            });
            return;
          }

          await get_chat_data();
          setInput('');
        } else {
          toast.error('Signature verification failed! Whoops.');
          return;
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.warning('Error', {
          description: error.message,
        });
      } else {
        throw error;
      }
    }
  }

  useEffect(() => {
    get_chat_data();
  }, [current_page]);

  const header = (
    <header className="m-auto flex max-w-96 flex-col gap-5 text-center">
      <h1 className="text-2xl font-semibold leading-none tracking-tight">Welcome to the Chat, Cardano.</h1>
      <LoadingDots className="mt-4"/>
      <h1 className="text-lg font-semibold leading-none tracking-tight opacity-40 py-2">Maybe you've jumped too far ahead in pages.</h1>
    </header>
  )

  const messageList = (
    <div className="my-4 flex flex-col gap-4">
      <AnimatePresence mode="sync">
        {posts && posts.toReversed().map((post, index) => {
          const role = address === post.author ? 'us' : 'them';
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", delay: index * 0.2 }}
              data-role={role}
              className={cn(
                "w-[80%] lg:w-[60%]",
                !connected && "mx-auto",
                address === post.author ?
                  "self-end"
                  :
                  "self-start",
              )}
            >
              <FinbyteChatComponent
                post={post}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>

      {loading && <div className="self-start rounded-xl bg-gray-100 px-3 py-2 text-sm">Loading data...</div>}
    </div>
  );

  return (
    <TooltipProvider>
      <main
        className={cn(
          "ring-none mx-auto flex w-full flex-col items-stretch border-none mb-12",
          className,
        )}
        {...props}
      >
        <form
          onSubmit={handleSubmit}
          className="border-input bg-background focus-within:ring-ring/10 relative mx-6 mb-2 flex items-center rounded-[16px] border px-3 py-1.5 text-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-0"
        >
          {previewing_post ?
            <div className="w-full">
              <FinbyteMarkdown>
                {input}
              </FinbyteMarkdown>
            </div>
            :
            <AutoTextarea
              onChange={(e) => setInput(e)}
              value={input}
              placeholder={'Type your message here...'}
              className="placeholder:text-muted-foreground flex-1 bg-transparent focus:outline-none"
            />
          }

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="ml-2"
                onClick={() => set_previewing_post(!previewing_post)}
              >
                <Glasses />
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={12}>Preview Post</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setInput('')}
              >
                <Eraser />
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={12}>Clear Post</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                disabled={loading || !connected}
              >
                <SendIcon size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={12}>Submit</TooltipContent>
          </Tooltip>
        </form>

        <div className="p-4 lg:px-8">
          <Card className="relative dark:border-neutral-800">
            <Label className='px-2 opacity-60 text-xs'><sub>Viewing:</sub> Most Recent</Label>

            <div className={cn("absolute inset-0", "opacity-20 group-hover:opacity-100", "transition-opacity duration-300")}>
              <div className="rounded-xl absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.2)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[length:4px_4px]" />
            </div>

            <ScrollArea className="p-4 relative">
              <div className="max-h-[550px] flex flex-col gap-4 px-6">{posts?.length ? messageList : header}</div>
            </ScrollArea>
            
            <div className="pb-2 flex w-full justify-end gap-2 relative px-4 items-center">
              <Button variant='ghost' size='sm' disabled={current_page === 1 || loading} onClick={() => set_current_page(current_page - 1)}>
                Prev
              </Button>
              <span className="opacity-60">
                {current_page}
              </span>
              <Button variant='ghost' size='sm' disabled={loading || posts?.length === 0 || posts?.length !== 10} onClick={() => set_current_page(current_page + 1)}>
                Next
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </TooltipProvider>
  )
}
