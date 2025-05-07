"use client"

import { FC, useState } from "react"
import { Button } from "@/components/ui/button"
import { ThumbsUp, ThumbsDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Label } from "@/components/ui/label"
import { post_votes } from "@/utils/api/interfaces"
import { useWallet } from "@meshsdk/react"

interface custom_props {
  votes: {
    yes: number;
    no:  number;
  }
  on_vote: (type: "yes" | "no") => Promise<void>;
  voters: post_votes[];
}

const ForumPostVoteComponent: FC <custom_props> = ({
  votes, on_vote, voters
}) => {
  const { connected } = useWallet();
  const total_votes = votes.yes + votes.no
  const yes_percentage = total_votes === 0 ? 0 : Math.round((votes.yes / total_votes) * 100)

  const handleVote = async (type: "yes" | "no") => {
    await on_vote(type);
  }

  return (
    <div className="w-full p-2 lg:py-4 mt-4">
      <div className="flex flex-col">
        <div className="flex justify-between text-xs mb-1">
          <span>Yes: {votes.yes}</span>
          <span className="opacity-50">Votes: {total_votes}</span>
          <span>No: {votes.no}</span>
        </div>

        <div className="h-8 w-full rounded-lg overflow-hidden border dark:border-neutral-800 relative">
          <AnimatePresence>
            {total_votes === 0 ? (
              <motion.div
                key="no-votes"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full w-full dark:bg-black flex items-center justify-center text-xs absolute inset-0"
              >
                <span className="opacity-50">
                  No votes yet
                </span>
              </motion.div>
            ) : (
              <motion.div key="votes" className="h-full w-full flex absolute inset-0">
                <motion.div
                  className="h-full bg-green-500 flex items-center justify-center text-xs text-white font-medium"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${yes_percentage}%`,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 120,
                    damping: 20,
                  }}
                >
                  {yes_percentage > 10 && `${yes_percentage}%`}
                </motion.div>
                <motion.div
                  className="h-full bg-red-500 flex items-center justify-center text-xs text-white font-medium"
                  initial={{ width: total_votes === 0 ? "100%" : 0 }}
                  animate={{
                    width: `${100 - yes_percentage}%`,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 120,
                    damping: 20,
                  }}
                >
                  {100 - yes_percentage > 10 && `${100 - yes_percentage}%`}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {connected && (
          <div className="flex justify-end mt-2 gap-2">
            <Button onClick={() => handleVote("no")} className="size-7 p-1 flex items-center gap-2" variant='destructive'>
              <ThumbsDown/>
            </Button>
            <Button variant='save' onClick={() => handleVote("yes")} className="size-7 p-1 flex items-center gap-2">
              <ThumbsUp/>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ForumPostVoteComponent;