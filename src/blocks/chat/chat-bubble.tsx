import FinbyteMarkdown from "@/components/finbytemd";
import FormatAddress from "@/components/format-address";
import ForumPostHeaderOptions from "@/components/forums-core/post/header/options";
import ForumPostComponentView from "@/components/forums-core/post/view";
import UserAvatar from "@/components/user-avatar";
import useThemedProps from "@/contexts/themed-props";
import { edit_post_data, fetched_chat_post_data } from "@/utils/api/interfaces";
import { format_unix } from "@/utils/string-tools";
import { FC, useState } from "react";

interface custom_props {
  message: fetched_chat_post_data;
  index: number;
  on_edit: (details: edit_post_data) => Promise<void>;
}

const ChatBubble: FC <custom_props> = ({
  message, index, on_edit
}) => {
  const themed = useThemedProps();
  const left_sided = index % 2 === 0;

  const chat_class = `
    flex flex-col
    ${left_sided ? 'rounded-e-xl rounded-es-xl' : 'ml-auto  rounded-l-xl rounded-b-xl'}
    w-full max-w-[320px] lg:max-w-[60%]
    p-4
    border ${themed['700'].border}
    ${themed['900'].bg}
  `;
  
  const [show_address, set_show_address] = useState(false);

  const [show_likers_modal, set_show_likers_modal] = useState(false);
  const [show_tip_tx_hashes_modal, set_show_tip_tx_hashes_modal] = useState(false);
  const [show_delete_modal, set_show_delete_modal] = useState(false);
  const modals = {
    view_likers: { state: show_likers_modal, set_state: set_show_likers_modal },
    view_tip_hashes: { state: show_tip_tx_hashes_modal, set_state: set_show_tip_tx_hashes_modal },
    delete:  { state: show_delete_modal, set_state: set_show_delete_modal }
  }

  const [current_view, set_current_view] = useState<'post' | 'edit' | 'details'>('post');
  const [show_original_post, set_show_original_post] = useState(false);
  const [show_date, set_show_date] = useState(false);

  return (
    <>
      <div className="flex items-start gap-2.5">
        {left_sided && (
          <UserAvatar title={message.author} address={message.author} className="size-9"/>
        )}

        <div className={chat_class}>
          <div className="flex items-center justify-between w-full">
            <FormatAddress className="cursor-pointer" onClick={() => set_show_address(!show_address)} address={show_address ? message.author : message.ada_handle ? message.ada_handle : message.author}/>

            <span>
              <ForumPostHeaderOptions
                post_type='chat'
                preview={false}
                post_author={message.author}
                is_edited={message.updated_post ? true : false}
                post_id={message.id}
                modals={modals}
                viewing={{
                  state: current_view,
                  set_state: set_current_view
                }}
                show_original={{
                  state: show_original_post,
                  set_state: set_show_original_post
                }}
                toggle_timestamp={{
                  state: show_date,
                  set_state: set_show_date
                }}
              />
            </span>
          </div>

          <span className="text-sm">
            <ForumPostComponentView
              current_view={{
                state: current_view,
                set_state: set_current_view
              }}
              preview={false}
              chat_post={{ post: message }}
              show_original={{
                state: show_original_post,
                set_state: set_show_original_post
              }}
              on_edit={on_edit}
            />
          </span>

          <span className="text-xs">
            <span className="font-normal text-gray-500 ml-auto">
              {format_unix(message.updated_timestamp ? message.updated_timestamp : message.timestamp).time_ago}
            </span>
          </span>
        </div>

        {!left_sided && (
          <UserAvatar title={message.author} address={message.author} className="size-9"/>
        )}
      </div>
    </>
  )
}

export default ChatBubble;