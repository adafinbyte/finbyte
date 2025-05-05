import { FC, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import PostPreview from "./post-preview";

import { post_with_comments } from "@/utils/api/interfaces";

interface custom_props {
  forum_posts: post_with_comments[] | null;
  refreshing: boolean;
}

const ForumsPostsList: FC <custom_props> = ({
  forum_posts, refreshing
}) => {

  /** @todo - remove */
  const multiple_examples = [...forum_posts??[],...forum_posts??[],...forum_posts??[],...forum_posts??[]];

  return (
    <div className="p-2 grid grid-cols-2 gap-4" style={{ placeItems: 'start' }}>
      <AnimatePresence mode="wait">
        {forum_posts ?
          multiple_examples.map((post, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                delay: index * 0.2,
              }}
            >
              <PostPreview forum_post={post}/>
            </motion.div>
          ))
          :
          <div className="">
            No posts to show...
          </div>
        }
      </AnimatePresence>
    </div>
  )
}

export default ForumsPostsList;