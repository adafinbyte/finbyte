import { FC, ReactNode } from "react"

import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Clock, Copy, Edit, Ellipsis, EyeOff, FileDigit, HandCoins, HeartHandshake, MessageCircle, Pencil, ReceiptText, Share, Trash } from "lucide-react"
import { moderation_addresses } from "@/utils/consts"
import { useWallet } from "@meshsdk/react"
import { copy_to_clipboard } from "@/utils/string-tools"
import { usePathname } from "next/navigation"
import { post_type } from "@/utils/api/types"

interface custom_props {
  post_type: post_type;
  post_author: string;
  is_edited: boolean;

  current_view: 'post' | 'edit';
  showing_original_post: boolean;

  toggle_edit: () => void;
  toggle_original_post: () => void;
  toggle_timestamp: () => void;
  toggle_hide_comment?: () => void;

  modal_toggles: {
    share_post?: () => void;
    view_repliers?: () => void;
    view_likers: () => void;
    view_delete_post: () => void;
  }
}

const PostOptionsButton: FC <custom_props> = ({
  post_type, post_author, is_edited, current_view, showing_original_post,
  toggle_edit, toggle_original_post, toggle_timestamp, toggle_hide_comment,
  modal_toggles
}) => {
  // still uses old logic of having a preview and multiple post types, we need to clean this up.

  interface post_option { icon: ReactNode; name: string; action: () => void; }
  const icon_size = 14;
  const pathname = usePathname();
  const use_wallet = useWallet();

  /** @note no matter what, these options should always be allowed */
  const basic: post_option[] = [
    {
      icon: <HeartHandshake size={icon_size}/>,
      name: 'View Likers',
      action: () => modal_toggles.view_likers()
    },
    {
      icon: <Clock size={icon_size}/>,
      name: 'Toggle Date',
      action: toggle_timestamp
    },
  ];

  /** @note options for a non preview state */
  const edited: post_option[] = [
    {
      icon: <Edit size={icon_size}/>,
      name: showing_original_post ? 'View Latest' : 'View Original',
      action: toggle_original_post
    },
  ];

  /** @note forum_post options to be included in both preview and full post views */
  const forum_post_specific: post_option[] = [
    {
      icon: <Share size={icon_size}/>,
      name: 'Share Post',
      action: () => modal_toggles.share_post?.()
    },
    {
      icon: <Copy size={icon_size}/>,
      name: 'Copy Link',
      action: () => copy_to_clipboard(pathname, 'The post link has been copied to the clipboard.')
    },
    {
      icon: <MessageCircle size={icon_size}/>,
      name: 'View Repliers',
      action: () => modal_toggles.view_repliers?.()
    },
  ];

  /** @note options only the author can see 
  const author_options = [
    {
      icon: <Pencil size={icon_size}/>,
      name: current_view === 'edit' ? 'View Post' : 'Edit Post',
      action: toggle_edit
    },
  ];*/

  /** @note options only the author and platform mods can see */
  const mod_options = [
    {
      icon: <Trash size={icon_size}/>,
      name: 'Delete Post',
      action: () => modal_toggles.view_delete_post()
    },
  ];

  const comment_options = [
    {
      icon: <EyeOff size={icon_size}/>,
      name: 'Hide Comment',
      action: toggle_hide_comment
    },
  ];

  const has_fp_funcs = modal_toggles.share_post && modal_toggles.view_repliers
  const forum_post_basic = has_fp_funcs ? [...forum_post_specific, ...basic] : [...basic];
  const forum_post_options = is_edited ? [...forum_post_basic, ...edited] : post_type === 'forum_comment' ? [...comment_options, ...forum_post_basic] : [...forum_post_basic];
  
  const is_moderator = moderation_addresses.includes(use_wallet.address);
  const is_author = post_author === use_wallet.address;

  const extended_post_options = [...mod_options]; // is_author ? [...author_options, ...mod_options] : [...mod_options];

  const standard_layout_options = [
    { title: 'Options', menu_items: forum_post_options }
  ];
  const extended_layout_options = [
    { title: 'Manage', menu_items: extended_post_options }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost"><Ellipsis className="size-6"/></Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 dark:border-neutral-800">
        <DropdownMenuLabel>Post Options</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {standard_layout_options.map((s_items, s_index) => (
          <DropdownMenuGroup key={s_index}>
            {s_items.menu_items.map((option, o_index) => (
            <DropdownMenuItem key={o_index} onClick={option.action}>
              {option.name}
              <DropdownMenuShortcut>{option.icon}</DropdownMenuShortcut>
            </DropdownMenuItem>
          ))}
          </DropdownMenuGroup>
        ))}

        {(is_author || is_moderator) && (
          <>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>{is_author ? 'Author' : 'Moderation'} Options</DropdownMenuLabel>
          {extended_layout_options.map((e_items, e_index) => (
            <DropdownMenuGroup key={e_index}>
              {e_items.menu_items.map((option, o_index) => (
              <DropdownMenuItem key={o_index} onClick={option.action}>
                {option.name}
                <DropdownMenuShortcut>{option.icon}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            </DropdownMenuGroup>
          ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default PostOptionsButton;