import { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

import ForumsPostView from "./post-view";

import { fetch_all_forum_posts_with_comments } from "@/utils/api/fetch";
import { useRouter } from "next/router";
import { post_with_comments } from "@/utils/api/interfaces";
import ForumsActions from "./header/actions";
import ForumsSidebarSections from "./header/sections";

const ForumsBlock: FC = () => {
  const [forum_posts, set_forum_posts] = useState<post_with_comments[] | null>(null);
  const [refreshing_posts, set_refreshing_posts] = useState(false);
  const [active_tab, set_active_tab] = useState(1);
  const [show_create_post, set_show_create_post] = useState(false);

  const router = useRouter();
  const { tab_id } = router.query;

  useEffect(() => {
    if (tab_id) {
      if (tab_id === '1') { set_active_tab(1); }
      else if (tab_id === '2') { set_active_tab(2); } 
      else if (tab_id === '3') { set_active_tab(3); set_show_create_post(true); }
      else { router.pathname = '/forums'}
    }
  }, [tab_id]);

  const get_posts = async () => {
    set_refreshing_posts(true);

    try {
      const post_data = await fetch_all_forum_posts_with_comments();
      if (post_data) set_forum_posts(post_data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unknown error');
    }
  
    set_refreshing_posts(false);
  }

  const refresh_action = {
    status: refreshing_posts,
    action: get_posts
  }

  const tab_action = {
    state: active_tab,
    set_state: set_active_tab
  }

  const create_action = {
    state: show_create_post,
    set_state: set_show_create_post,
  }

  useEffect(() => {
    get_posts();
  }, []);

  useEffect(() => {
    const clear_states = () => {
      set_show_create_post(false);
    }

    clear_states()
  }, [active_tab]);

  return (
    <div className="lg:p-12 p-4 flex flex-col gap-2 w-full bg-neutral-950 min-h-screen">
      <ForumsSidebarSections post_data={forum_posts} tab_action={tab_action}/>
      <ForumsActions
        refresh_action={refresh_action}
        tab_state={tab_action.state}
        create_state={create_action}
      />

      <span className="">
        <AnimatePresence mode="wait">
          <motion.div
            key={active_tab}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <ForumsPostView
              post_data={forum_posts}
              tab_action={tab_action}
              create_action={create_action}
              get_posts={get_posts}
            />
          </motion.div>
        </AnimatePresence>
      </span>
    </div>
  )
}

export default ForumsBlock;