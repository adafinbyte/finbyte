import EllipsisMenu from "@/components/ellipsis-menu";
import { post_type } from "@/utils/api/types";
import { admin_addresses, moderation_addresses } from "@/utils/consts";
import { copy_to_clipboard } from "@/utils/string-tools";
import { useWallet } from "@meshsdk/react";
import { Copy, Edit, FileDigit, HeartHandshake, MessageCircle, Pencil, ReceiptText, Share, Trash } from "lucide-react";
import { Dispatch, FC, ReactNode, SetStateAction } from "react";

interface custom_props {
  post_type: post_type;
  preview: boolean;
  post_author: string;
  is_edited: boolean;
  post_id: number;

  modals: {
    view_likers: {
      state: boolean;
      set_state: Dispatch<SetStateAction<boolean>>;
    };
    view_repliers: {
      state: boolean;
      set_state: Dispatch<SetStateAction<boolean>>;
    };
    view_tip_hashes: {
      state: boolean;
      set_state: Dispatch<SetStateAction<boolean>>;
    };
    delete: {
      state: boolean;
      set_state: Dispatch<SetStateAction<boolean>>;
    };
    share: {
      state: boolean;
      set_state: Dispatch<SetStateAction<boolean>>;
    };
  };

  viewing: {
    state: 'post' | 'edit' | 'details';
    set_state: Dispatch<SetStateAction<'post' | 'edit' | 'details'>>;
  };

  show_original: {
    state: boolean;
    set_state: Dispatch<SetStateAction<boolean>>;
  };
}

const ForumPostHeaderOptions: FC <custom_props> = ({
  post_type, preview, post_author, is_edited, post_id, modals, viewing, show_original
}) => {
  interface post_option { icon: ReactNode; name: string; action: () => void; }
  const icon_size = 14;
  const use_wallet = useWallet();

  /** @note no matter what, these options should always be allowed */
  const basic: post_option[] = [
    {
      icon: <HeartHandshake size={icon_size}/>,
      name: 'View Likers',
      action: () => modals.view_likers.set_state(true)
    },
    {
      icon: <FileDigit size={icon_size}/>,
      name: 'View Tip Hashes',
      action: () => modals.view_tip_hashes.set_state(true)
    },
  ];

  /** @note universal options to be included only in non preview forum post view */
  const universal: post_option[] = [
    {
      icon: <ReceiptText size={icon_size}/>,
      name: viewing.state === 'details' ? 'View Post' : 'View Details',
      action: viewing.state === 'details' ? () => viewing.set_state('post') : () => viewing.set_state('details')
    },
  ];

  /** @note options for a non preview state */
  const edited: post_option[] = [
    {
      icon: <Edit size={icon_size}/>,
      name: show_original.state ? 'View Latest' : 'View Original',
      action: () => show_original.set_state(!show_original.state)
    },
  ];

  /** @note forum_post options to be included in both preview and full post views */
  const forum_post_specific: post_option[] = [
    {
      icon: <Share size={icon_size}/>,
      name: 'Share Post',
      action: () => modals.share.set_state(true)
    },
    {
      icon: <Copy size={icon_size}/>,
      name: 'Copy Link',
      action: () => copy_to_clipboard(post_id.toString())
    },
    {
      icon: <MessageCircle size={icon_size}/>,
      name: 'View Repliers',
      action: () => modals.view_repliers.set_state(true)
    },
  ];

  /** @note options only the author can see */
  const author_options = [
    {
      icon: <Pencil size={icon_size}/>,
      name: viewing.state === 'edit' ? 'View Post' : 'Edit Post',
      action: viewing.state === 'edit' ? () => viewing.set_state('post') : () => viewing.set_state('edit')
    },
  ];

  /** @note options only the author and platform mods can see */
  const mod_options = [
    {
      icon: <Trash size={icon_size}/>,
      name: 'Delete Post',
      action: () => modals.delete.set_state(true)
    },
  ];

  const forum_post_basic = [...forum_post_specific, ...basic];
  const forum_post_options = preview ? [...forum_post_basic] : is_edited ? [...forum_post_basic, ...universal, ...edited] : [...forum_post_basic, ...universal];
  
  const is_moderator = admin_addresses.includes(use_wallet.address) || moderation_addresses.includes(use_wallet.address);
  const is_author = post_author === use_wallet.address;

  const extended_post_options = is_author && !preview ? [...author_options, ...mod_options] : [...mod_options];

  const sort_options = () => {
    switch (post_type) {
      case "forum_post":
        return forum_post_options;
      case "forum_comment":
        return is_edited ? [...basic, ...universal, ...edited] : [...basic, ...universal];
      case "community_post":
        return is_edited ? [...basic, ...universal, ...edited] : [...basic, ...universal];
      default:
        return is_edited ? [...basic, ...universal, ...edited] : [...basic, ...universal];
    }
  }

  const standard_layout_options = [
    { title: 'Options', menu_items: sort_options() }
  ];
  const extended_layout_options = [
    { title: 'Manage', menu_items: extended_post_options }
  ];
  const all_options = (is_author || is_moderator) ? [...standard_layout_options, ...extended_layout_options] : [...standard_layout_options];

  return <EllipsisMenu alt_menu={all_options}/>
}

export default ForumPostHeaderOptions;