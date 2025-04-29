import { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

import ForumsPostView from "./post-view";

import ForumsActions from "./header/actions";
import ForumsSidebarSections from "./header/sections";

import { fetch_all_forum_posts_with_comments } from "@/utils/api/fetch";
import { post_with_comments } from "@/utils/api/interfaces";
import { ALargeSmall, Megaphone, MessageCircle, MessagesSquare } from "lucide-react";

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
      else if (tab_id === '4') { set_active_tab(3); }
      else if (tab_id === '5') { set_active_tab(5); }
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

  const icon_size = 16;
  const tab_details = [
    { id: 1, title: "All Posts", icon: <ALargeSmall size={icon_size} />, data: forum_posts ? forum_posts.length : 0 },
    { id: 2, title: "#General", icon: <MessageCircle size={icon_size} />, data: forum_posts ? forum_posts.flat().filter(pwc => pwc.post.section === "general").length : 0 },
    { id: 3, title: "#Requests", icon: <Megaphone size={icon_size} />, data: forum_posts ? forum_posts.filter(pwc => pwc.post.section === "requests").length : 0, },
    { id: 4, title: "#Chatterbox", icon: <MessagesSquare size={icon_size} />, data: forum_posts ? forum_posts.filter(pwc => pwc.post.section === "chatterbox").length : 0, },
    { id: 5, title: "", icon: <img src='/finbyte.png' className='size-4' />, data: forum_posts ? forum_posts.flat().filter(pwc => pwc.post.section === "finbyte").length : 0 },
  ];

  const filtered_posts = forum_posts?.filter(post => {
    if (tab_action.state === 2) return post.post.section === 'general';
    if (tab_action.state === 3) return post.post.section === 'requests';
    if (tab_action.state === 4) return post.post.section === 'chatterbox';
    if (tab_action.state === 5) return post.post.section === 'finbyte';
    return true;
  }) ?? [];

  return filtered_posts && (
    <div className="lg:px-20 p-4 flex flex-col gap-2 w-full">
      <ForumsSidebarSections post_data={filtered_posts} tab_action={tab_action} tab_details={tab_details}/>
      <ForumsActions
        refresh_action={refresh_action}
        tab_state={tab_action.state}
        create_state={create_action}
      />

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
            post_data={filtered_posts}
            tab_action={tab_action}
            create_action={create_action}
            get_posts={get_posts}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default ForumsBlock;