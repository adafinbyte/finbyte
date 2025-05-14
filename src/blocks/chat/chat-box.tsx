"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { cn } from "@/utils/common"
import { Eraser, Glasses, SendIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Textarea } from "@/components/ui/textarea"
import { LoadingDots } from "@/components/loading-dots"
import { fetch_chat_posts } from "@/utils/api/fetch/posts"
import { chat_post_data, create_chat_post_data } from "@/utils/api/interfaces"
import { getWalletAddress, useConnectWallet } from "@newm.io/cardano-dapp-wallet-connector"

import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion";
import FinbyteChatComponent from "./chat-component"
import { create_post } from "@/utils/api/push/post"

export function ChatForm({ className, ...props }: React.ComponentProps<"form">) {
  const [input, setInput] = useState("");
  const [loading, set_loading] = useState(false);

  const { isConnected, wallet } = useConnectWallet();

  const [current_page, set_current_page] = useState(1);
  const [all_authors, set_all_authors] = useState<string[] | null>(null);
  const [posts, set_posts] = useState<chat_post_data[] | null>(null);
  const [users_address, set_users_address] = useState<string | null>(null);
  const [mounted, set_mounted] = useState(false);

  const get_chat_data = async () => {
    set_loading(true);

    const { data, error } = await fetch_chat_posts(current_page);
    if (error) {
      toast('Failed to get chat posts', {
        description: error
      });
      return;
    } else if (data) {
      set_posts(data);
      // here we want to get the data for each address from authors
    }

    set_loading(false);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) { return; }
    if (!users_address || !wallet) {
      toast('No wallet connected', {
        description: 'You need to connect your wallet in order to preform this action.'
      });
      return;
    }

    const timestamp = Math.floor(Date.now() / 1000);
    try {
      const details: create_chat_post_data = {
        author: users_address,
        timestamp: timestamp,
        post: input
      }
      const creation = await create_post(details, 'finbyte_chat', details.timestamp, users_address);
      if (creation?.error) {
        toast.warning('Could not create post', {
          description: creation.error
        });
        return;
      }
      if (creation.created) {
        await get_chat_data();
        setInput('');
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
    set_mounted(true);
  }, []);

  useEffect(() => {
    const fetchAddress = async () => {
      if (isConnected && wallet) {
        toast('Connected', {
          description: 'Your wallet is now connected to Finbyte.'
        });
        const address = await getWalletAddress(wallet);
        if (address) {
          set_users_address(address);
        }
      } else if (!isConnected) {
        set_users_address(null);
      }
    };

    fetchAddress();
  }, [isConnected, wallet, mounted]);

  if (!mounted) { return null; }

  const header = (
    <header className="m-auto flex max-w-96 flex-col gap-5 text-center">
      <h1 className="text-2xl font-semibold leading-none tracking-tight">Welcome to the Chat, Cardano.</h1>
      <LoadingDots className="mt-4"/>
    </header>
  )

  const messageList = (
    <div className="my-4 flex h-fit min-h-full flex-col gap-4">
      <AnimatePresence mode="sync">
        {posts && posts.toReversed().map((post, index) => {
          const role = users_address === post.author ? 'us' : 'them';
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", delay: index * 0.2 }}
              data-role={role}
              className={cn(
                "w-[80%] lg:w-[60%]",
                !isConnected && "mx-auto",
                users_address === post.author ?
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
          className="border-input bg-background focus-within:ring-ring/10 relative mx-6 mb-4 flex items-center rounded-[16px] border px-3 py-1.5 text-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-0"
        >
          <Textarea
            onChange={(v) => setInput(v)}
            value={input}
            placeholder={'Type your message here...'}
            className="placeholder:text-muted-foreground flex-1 bg-transparent focus:outline-none"
          />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                disabled={loading}
              >
                <SendIcon size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={12}>Submit</TooltipContent>
          </Tooltip>
        </form>

        <div className="flex items-center w-full px-6 gap-1">
          <Button variant='secondary' size='sm' onClick={() => setInput('')}>
            <Eraser/>
          </Button>

          <Button variant='secondary' size='sm'>
            <Glasses/>
          </Button>
        </div>

        <hr className="w-[90%] mx-auto mt-4 mb-2"/>

        <div className="flex-1 content-center px-6">{posts?.length ? messageList : header}</div>
      </main>
    </TooltipProvider>
  )
}
