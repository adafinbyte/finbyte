import { FC, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import PostPreview from "./post-preview";

import { post_with_comments } from "@/utils/api/interfaces";
import { LoadingDots } from "@/components/ui/loading-dots";

interface custom_props {
  forum_posts: post_with_comments[] | null;
  refreshing: boolean;
}

const ForumsPostsList: FC <custom_props> = ({
  forum_posts, refreshing
}) => {

  return (
    <div className="p-2 grid lg:grid-cols-2 gap-4" style={{ placeItems: 'start' }}>
      <AnimatePresence mode='sync'>
        {forum_posts ?
          forum_posts.sort((a, b)=> b.post.id - a.post.id).map((post, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                delay: index * 0.2,
              }}
              className="w-full"
            >
              <PostPreview forum_post={post}/>
            </motion.div>
          ))
          :
          <div className="flex w-full justify-center col-span-2">
            <LoadingDots/>
          </div>
        }
      </AnimatePresence>
    </div>
  )
}

export default ForumsPostsList;