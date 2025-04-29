import { fetched_forum_post_data } from "@/utils/api/interfaces";
import { HandCoins, Heart, RefreshCw, Share } from "lucide-react";
import { Dispatch, FC, SetStateAction } from "react";
import { useWallet } from "@meshsdk/react";
import ForumPostAboutAuthor from "./about-author";
import { author_data } from "@/utils/api/account/fetch";
import { Transaction } from "@meshsdk/core";
import { update_tip_tx_hashes } from "@/utils/api/push";
import toast from "react-hot-toast";
import useThemedProps from "@/contexts/themed-props";

interface custom_props {
  post: fetched_forum_post_data;
  refresh_post: () => Promise<void>;
  refresh_status: boolean;
  author_data: author_data | null;

  modals: {
    like: {
      state: boolean;
      set_state: Dispatch<SetStateAction<boolean>>;
    };
    share: {
      state: boolean;
      set_state: Dispatch<SetStateAction<boolean>>;
    };
  };
}

const ForumPostSidebar: FC <custom_props> = ({
  post, refresh_post, refresh_status, author_data, modals
}) => {
  const themed = useThemedProps();
  const use_wallet = useWallet();
  const wallet = use_wallet.wallet;

  /** 
   * @note
   * - i haven't tested this!
   * @todo
   * - implement optional amount, increased from the 1 ADA thats currently set
   **/
  const handle_tip_post = async () => {
    const tip_amount = 1000000;

    try {
      const tip_tx = new Transaction({ initiator: wallet })
        .sendLovelace(post.author, tip_amount.toString())
  
      const build_tip_tx = await tip_tx.build();
      if (build_tip_tx) {
        const signature = await wallet.signTx(build_tip_tx);
        if (signature) {
          const tx_hash = await wallet.submitTx(signature);
          const tx_hashes = [tx_hash, ...(post.tip_tx_hashes || [])];

          await update_tip_tx_hashes(use_wallet.address, tx_hashes, post.id, 'forum_post');
          toast.success('Kudos! Youve just tipped this post.');
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        throw error;
      }
    }
  }

  const action_button_class_wallet = `${use_wallet.connected ? `hover:${themed['800'].bg} active:${themed['800'].bg}/60` : 'opacity-50'} border ${themed['700'].border} ${themed['900'].bg} p-1 px-2 text-xs rounded-lg flex justify-between items-center`
  const action_button_class = `border ${themed['700'].border} ${themed['900'].bg} hover:${themed['800'].bg} active:${themed['800'].bg}/60 p-1 px-2 text-xs rounded-lg flex justify-between items-center`

  return (
    <>
      <div className={`flex flex-col gap-2 w-full ${themed['300'].text}`}>
        <ForumPostAboutAuthor
          author_details={author_data}
          post={post}
        />

        <hr className={`${themed['700'].border}`}/>

        <div className="grid grid-cols-2 gap-2">
          <button title={`${!use_wallet.connected ? 'Connect your wallet to tip' : 'Tip 1 ADA'}`} onClick={handle_tip_post} disabled={!use_wallet.connected} className={action_button_class_wallet}>
            Tip Post
            <HandCoins size={12} />
          </button>

          <button title={`${!use_wallet.connected ? 'Connect your wallet to interact' : 'Like/Unlike Post'}`} onClick={() => modals.like.set_state(true)} disabled={!use_wallet.connected} className={action_button_class_wallet}>
            {post.post_likers?.includes(use_wallet.address) ? 'Unlike Post' : 'Like Post'}
            <Heart size={12} className={post.post_likers?.includes(use_wallet.address) ? 'fill-rose-400 text-rose-400' : ''}/>
          </button>

          <button title="Refresh Post" onClick={refresh_post} className={action_button_class}>
            Refresh Post
            <RefreshCw size={12} className={refresh_status ? "animate-spin" : ""}/>
          </button>

          <button title="Share Post" onClick={() => modals.share.set_state(true)} className={action_button_class}>
            Share Post
            <Share size={12}/>
          </button>
        </div>

        <hr className={`${themed['700'].border}`}/>
      </div>

    </>
  )
}

export default ForumPostSidebar;