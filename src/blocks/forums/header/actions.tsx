import useThemedProps from "@/contexts/themed-props";
import { admin_addresses, moderation_addresses } from "@/utils/consts";
import { useWallet } from "@meshsdk/react";
import { Ban, FilePlus, RefreshCw } from "lucide-react";
import { Dispatch, FC, SetStateAction } from "react";
import toast from "react-hot-toast";

interface custom_props {
  refresh_action: {
    status: boolean;
    action: () => Promise<void>;
  }

  tab_state: number;

  create_state: {
    state: boolean;
    set_state: Dispatch<SetStateAction<boolean>>;
  }
}

const ForumsActions: FC <custom_props> = ({
  refresh_action, tab_state, create_state
}) => {
  const themed = useThemedProps();
  const use_wallet = useWallet();
  const is_admin = admin_addresses.includes(use_wallet.address);
  const is_moderator = moderation_addresses.includes(use_wallet.address);
  const public_creation_tabs = [2,3,4];
  const disabled = !public_creation_tabs.includes(tab_state);

  const attempt_create_state_change = () => {
    if (tab_state === 1) {
      toast.error('Please choose a category other than "All Posts".');
      return undefined;
    }
    return create_state.set_state(!create_state.state);
  }

  const icon_size = 14;
  const default_actions = [
    {
      title: refresh_action.status ? 'Refreshing...' : 'Refresh Feed',
      action: refresh_action.action,
      icon: <RefreshCw size={icon_size} className={refresh_action.status ? "animate-spin" : ""}/>
    },
    {
      title: create_state.state ? "Cancel Creation" : "Create Post",
      action: () => attempt_create_state_change(),
      icon: create_state.state ? <Ban size={icon_size} className="text-rose-400"/> : <FilePlus size={icon_size}/>
    },
  ];

  return (
    <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
      {default_actions.map((action, index) => {
        const is_disabled = index === 1 ? (is_admin || is_moderator) ? false : disabled : false;
        const action_style = `
          p-1 px-2 duration-300 rounded-lg ${themed['400'].text} inline-flex gap-2 items-center
          text-sm border ${themed['700'].border} ${themed['900'].bg}
          ${is_disabled ? 'opacity-50' : 'hover:' + themed['800'].bg + ' active:' + themed['800'].bg + '/60'}
        `;

        return (
          <button
            key={index}
            title={action.title}
            className={action_style}
            onClick={action.action}
            disabled={is_disabled}
          >
            {action.title}
            {action.icon}
          </button>
        )}
      )}
    </div>
  )
}

export default ForumsActions;