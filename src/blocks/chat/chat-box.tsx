"use client"

import type React from "react"

import { useState, useRef, useEffect, FC } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Eraser, Glasses, Send } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { chat_post_data, create_comment_post_data } from "@/utils/api/interfaces"
import { motion } from "framer-motion";
import ChatCommentComponent from "./comment"
import { useWallet } from "@meshsdk/react"
import { cn } from "@/lib/utils"

// Define message type
type Message = {
  id: string
  content: string
  sender: "user" | "other"
  timestamp: Date
}

interface custom_props {
  posts: chat_post_data[] | null;
  on_create: (details: create_comment_post_data) => Promise<void> 
  on_delete: (post_id: number) => Promise<void> 
  on_like_unlike: (post_id: number, post_likers: string[]) => Promise<void>
}

const ChatBlock: FC <custom_props> = ({
  posts, on_create, on_delete, on_like_unlike
}) => {
  const { address } = useWallet();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! How can I help you today?",
      sender: "other",
      timestamp: new Date(),
    },
  ])
  const [chat, set_chat] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    set_chat(e.target.value)
  }

  const [view_adahandle, set_view_adahandle] = useState(false);
  const [refreshing_state, set_refreshing_state] = useState(false);
  const [show_create_post, set_show_create_post] = useState(false);
  const [hidden_comments, set_hidden_comments] = useState<Set<number>>(new Set());

  const toggle_hide = (index: number) => {
    set_hidden_comments(prev => {
      const updated = new Set(prev);
      if (updated.has(index)) {
        updated.delete(index);
      } else {
        updated.add(index);
      }
      return updated;
    });
  };

  const commentVariants = {
    hidden: { opacity: 0, height: 0, overflow: 'hidden' },
    visible: { opacity: 1, height: 'auto', overflow: 'visible' },
    exit: { opacity: 0, height: 0, overflow: 'hidden' },
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="sticky top-0 z-10 p-4">
        <div className="flex flex-col w-full gap-2">
          <Textarea
            value={chat}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1 max-h-64 resize-none"
          />

          <div className="flex gap-1 items-center">
            <Button variant='ghost' size="sm">
              <Eraser className="" />
            </Button>

            <Button variant='ghost' size="sm">
              <Glasses className="" />
            </Button>

            <div className="ml-auto"/>
            <Button type="submit" variant='primary' size="sm" disabled={!chat.trim()}>
              Send Chat
              <Send className="" />
            </Button>
          </div>
        </div>
      </div>
  
      <ScrollArea className="flex-1 overflow-y-auto p-4">
        <div className="max-h-screen flex flex-col w-full gap-y-4 pb-10">
          {posts ? posts.map((post, index) => (
            <motion.div
              key="visible"
              variants={commentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={cn(
                "w-[90%] lg:w-[75%]",
                post.author === address ? `ml-auto` : ''
              )}
            >
              <ChatCommentComponent
                key={index}
                comment_post={post}
                original_post_author={post.author}
                toggle_hide={() => toggle_hide(index)}
                on_delete={() => on_delete(post.id)}
                on_like={() => on_like_unlike(post.id, post.post_likers ?? [])}
              />
            </motion.div>
          )) : (
            <div>
              No posts to show
            </div>
          )}
        </div>
      </ScrollArea>
  
    </div>
  )
}

export default ChatBlock;