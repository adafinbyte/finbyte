import useThemedProps from "@/contexts/themed-props";
import { Check, Eraser, Glasses, SearchCode, Send, Smile, X } from "lucide-react";
import { Dispatch, FC, SetStateAction } from "react"
import toast from "react-hot-toast";

interface custom_props {
  query_status: 'check-passed' | 'check-fail' | 'check-pending';
  finbytemd_modal: {
    state: boolean;
    set_state: Dispatch<SetStateAction<boolean>>;
  };
  emoji_modal: {
    state: boolean;
    set_state: Dispatch<SetStateAction<boolean>>;
  };
  clear_post: () => void;
  check_post: () => void;
  preview_post: () => void;
  send_post: () => void;
  on_cancel?: () => void;
}

const PostActions: FC <custom_props> = ({
  query_status, finbytemd_modal, emoji_modal, clear_post, check_post, preview_post, send_post, on_cancel
}) => {
  const themed = useThemedProps();
  const icon_size = 16;
  const post_actions = [
//    {
//      title: 'FinbyteMD Guide',
//      icon: <svg role="img" className="fill-current size-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.27 19.385H1.73A1.73 1.73 0 010 17.655V6.345a1.73 1.73 0 011.73-1.73h20.54A1.73 1.73 0 0124 6.345v11.308a1.73 1.73 0 01-1.73 1.731zM5.769 15.923v-4.5l2.308 2.885 2.307-2.885v4.5h2.308V8.078h-2.308l-2.307 2.885-2.308-2.885H3.46v7.847zM21.232 12h-2.309V8.077h-2.307V12h-2.308l3.461 4.039z" /></svg>,
//      action: () => finbytemd_modal.set_state(true)
//    },
//    {
//      title: 'Emoji Guide',
//      icon: <Smile size={icon_size}/>,
//      action: () => emoji_modal.set_state(true)
//    },
    {
      title: 'Clear Post',
      icon: <Eraser size={icon_size}/>,
      action: clear_post
    },
    {
      title: 'Check Post',
      icon: query_status === 'check-pending' && (
        <SearchCode size={14} />
      ) || query_status === 'check-passed' && (
        <Check size={14} className="shrink-0 size-4 text-green-500 transition-opacity duration-500" />
      ) || query_status === 'check-fail' && (
        <X size={14} className="shrink-0 size-4 text-red-500 transition-opacity duration-500" />
      ),
      action: check_post
    },
  ];

  const end_actions = [
    {
      title: 'Preview Post',
      icon: <Glasses size={icon_size}/>,
      action: preview_post
    },
    {
      title: 'Sign & Send Post',
      icon: <Send size={icon_size} className={`${themed['200'].text}`}/>,
      action: send_post
    },
  ];

  const end_actions_alt = [
    {
      title: 'Cancel Edit',
      icon: <X size={icon_size}/>,
      action: on_cancel
    },
  ];

  const dynamic_end_actions = on_cancel ? [...end_actions_alt, ...end_actions] : [...end_actions];

  return (
    <div className="flex gap-1 items-center">
      {post_actions.map((action, index) => (
        <button key={index} onClick={action.action} title={action.title} className={`p-2 ${themed.effects.transparent_button.hover} rounded-lg ${themed['300'].text} duration-200`}>
          {action.icon}
        </button>
      ))}

      <div className="inline-flex gap-1 items-center ml-auto">
        {dynamic_end_actions.map((action, index) => (
          <button key={index} onClick={action.action} title={action.title} className={`${action.title === 'Sign & Send Post' ? "bg-blue-500 hover:bg-blue-400 active:bg-blue-500/80" : `${themed['300'].text} ${themed.effects.transparent_button.hover}`} p-2 rounded-lg duration-200`}>
            {action.icon}
          </button>
        ))}
      </div>
    </div>
  )
}

export default PostActions;