import { edit_post_data, fetched_comment_post_data, fetched_community_post_data, post_with_comments } from "@/utils/api/interfaces";
import { post_type } from "@/utils/api/types";
import { Dispatch, FC, SetStateAction, useState } from "react";
import ForumPostHeader from "./header";
import { ArrowRight, MessageCircle } from "lucide-react";
import ViewLikersModal from "@/components/modals/view-likers";
import ViewRepliersModal from "@/components/modals/view-repliers";
import ViewTipHashesModal from "@/components/modals/view-tip-hashes";
import { useWallet } from "@meshsdk/react";
import ForumPostComponentView from "./view";
import ShareModal from "@/components/modals/share";
import DeleteModal from "@/components/modals/delete";
import LikeModal from "@/components/modals/like";
import useThemedProps from "@/contexts/themed-props";
import { useRouter } from "next/router";

interface custom_props {
  post_type: post_type;
  preview: boolean;

  forum_post?: {
    post: post_with_comments;
    on_edit?: (type: post_type, details: edit_post_data, post_id: number) => Promise<void>;
    on_like_unlike?: () => Promise<void>;
    on_delete: () => Promise<void>;
  };

  forum_comment?: {
    post: fetched_comment_post_data;
    on_edit: (type: post_type, details: edit_post_data, post_id: number) => Promise<void>;
    on_delete: () => Promise<void>;
    on_like_unlike: () => Promise<void>;
  };

  community_post?: {
    post: fetched_community_post_data;
    on_edit: (details: edit_post_data, post_id: number) => Promise<void>;
    on_delete: () => Promise<void>;
    on_like_unlike: () => Promise<void>;
  };

  show_create?: {
    state: boolean;
    set_state: Dispatch<SetStateAction<boolean>>;
  }
}

const ForumPost: FC <custom_props> = ({
  post_type, preview, forum_post, forum_comment, community_post, show_create
}) => {
  const router = useRouter();
  const use_wallet = useWallet();
  const themed = useThemedProps();

  const [view_likers_modal_open, set_view_likers_modal_open] = useState(false);
  const [view_repliers_modal_open, set_view_repliers_modal_open] = useState(false);
  const [view_tip_hashes_modal_open, set_view_tip_hashes_modal_open] = useState(false);
  const [delete_modal_open, set_delete_modal_open] = useState(false);
  const [share_modal_open, set_share_modal_open] = useState(false);
  const [like_modal_open, set_like_modal_open] = useState(false);

  const modals = {
    view_likers: { state: view_likers_modal_open, set_state: set_view_likers_modal_open },
    view_repliers: { state: view_repliers_modal_open, set_state: set_view_repliers_modal_open },
    view_tip_hashes: { state: view_tip_hashes_modal_open, set_state: set_view_tip_hashes_modal_open },
    delete: { state: delete_modal_open, set_state: set_delete_modal_open },
    share: { state: share_modal_open, set_state: set_share_modal_open },
    like: { state: like_modal_open, set_state: set_like_modal_open },
  }

  const [current_view, set_current_view] = useState<'post' | 'edit' | 'details'>('post');
  const [show_original_post, set_show_original_post] = useState(false);

  const post_likers = (forum_post?.post.post.post_likers || forum_comment?.post.post_likers || community_post?.post.post_likers) ?? [];
  const post_replies = forum_post?.post.comments?.map(comment => comment.author)  ?? [];

  const tip_hashes = (forum_post?.post.post.tip_tx_hashes || forum_comment?.post.tip_tx_hashes || community_post?.post.tip_tx_hashes) ?? [];
  const post_id = forum_post?.post.post.id || forum_comment?.post.id || community_post?.post.id || 0;

  const attempt_edit = async (details: edit_post_data) => {
    if (forum_post && forum_post.on_edit) {
      await forum_post.on_edit('forum_post', details, forum_post.post.post.id);
    }
    if (forum_comment) {
      await forum_comment.on_edit('forum_comment', details, forum_comment.post.id)
    }
  }

  const attempt_delete = async () => {
    const on_delete = (forum_post?.on_delete || forum_comment?.on_delete || community_post?.on_delete);
    if (on_delete) {
      on_delete();
      set_delete_modal_open(false);
    }
  }

  const like_unlike_action = forum_post?.on_like_unlike || forum_comment?.on_like_unlike || community_post?.on_like_unlike;
  const toggle_goto_post = (post_id: number) => router.push('/forums/' + post_id);

  return (
    <>
      <div className={`duration-300 border ${themed['700'].border} rounded-lg ${themed['900'].bg} w-full ${themed['400'].text}`}>
        <ForumPostHeader
          post_type={post_type}
          preview={preview}
          forum_post={forum_post}
          forum_comment={forum_comment}
          community_post={community_post}
          modals={modals}
          viewing={{
            state: current_view,
            set_state: set_current_view
          }}
          show_original={{
            state: show_original_post,
            set_state: set_show_original_post
          }}
          post_likers={post_likers}
        />

        <div className="px-2">
          <ForumPostComponentView
            current_view={{
              state: current_view,
              set_state: set_current_view
            }}
            preview={preview}
            forum_post={forum_post}
            forum_comment={forum_comment}
            community_post={community_post}
            show_original={{
              state: show_original_post,
              set_state: set_show_original_post
            }}
            on_edit={attempt_edit}
          />
        </div>

          <div className="flex gap-2 items-center w-full p-1 lg:px-2 lg:pb-2">
            {(post_type === 'community_post' || post_type === 'forum_comment' || post_type === 'forum_post' && !preview) && (
              <button title={`${!use_wallet.connected ? 'Connect your wallet' : undefined}`} onClick={() => set_like_modal_open(true)} disabled={!use_wallet.connected} className={`text-sm inline-flex items-center gap-2 rounded-lg p-2 ${use_wallet.connected ? themed.effects.transparent_button.hover : 'opacity-50'}`}>
                {post_likers.includes(use_wallet.address) ? (post_type === 'community_post' || post_type === 'forum_post') ? 'Unlike Post' : 'Unlike Comment' : (post_type === 'community_post' || post_type === 'forum_post') ? 'Like Post' : 'Like Comment'}
              </button>
            )}

            {post_type === 'forum_post' && (
              <button onClick={() => set_view_repliers_modal_open(true)} className={`inline-flex items-center gap-2 ${themed.effects.transparent_button.hover} rounded-lg p-2`}>
                <MessageCircle size={16} className={`${forum_post?.post.comments?.some(a => a.author === use_wallet.address) ? 'text-blue-400' : ''}`}/>
                <span className="text-sm">
                  {forum_post?.post.comments?.length.toLocaleString() ?? 0}
                </span>
              </button>
            )}

            {post_type === 'forum_post' && show_create && (
              <button onClick={() => show_create.set_state(!show_create.state)} className={`text-sm inline-flex items-center gap-2 ${themed.effects.transparent_button.hover} rounded-lg p-2`}>
                {show_create.state ? 'Hide Creation' : 'Create Comment'}
              </button>
            )}

            {post_type === 'forum_post' && preview && (
              <button onClick={() => toggle_goto_post(forum_post?.post.post.id as number)} className={`italic text-sm ml-auto ${themed.effects.transparent_button.hover} p-2 px-4 rounded-lg inline-flex gap-2 items-center`}>
                View Post
                <ArrowRight size={16} className="group-hover:translate-x-0.5 duration-300"/>
              </button>
            )}
          </div>
      </div>
      
      <ViewLikersModal is_modal_open={view_likers_modal_open} close_modal={() => set_view_likers_modal_open(false)} post_likers={post_likers}/>
      <ViewRepliersModal is_modal_open={view_repliers_modal_open} close_modal={() => set_view_repliers_modal_open(false)} post_repliers={post_replies}/>
      <ViewTipHashesModal is_modal_open={view_tip_hashes_modal_open} close_modal={() => set_view_tip_hashes_modal_open(false)} post_tip_hashes={tip_hashes}/>
      
      {/** @todo change for real link */}
      <ShareModal is_modal_open={share_modal_open} close_modal={() => set_share_modal_open(false)} post_as_link={forum_post ? '/forums/' + post_id : '/explore/' + post_id}/>
      <DeleteModal is_modal_open={delete_modal_open} close_modal={() => set_delete_modal_open(false)} on_delete={attempt_delete}/>
      <LikeModal is_modal_open={like_modal_open} close_modal={() => set_like_modal_open(false)} is_liker={post_likers.includes(use_wallet.address) ?? false} on_like_unlike={() => like_unlike_action?.()}/>
    </>
  )
}

export default ForumPost;