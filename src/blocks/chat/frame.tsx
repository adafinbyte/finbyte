import PostCreation from "@/components/forums-core/input/create";
import useThemedProps from "@/contexts/themed-props";
import { fetch_chats } from "@/utils/api/fetch";
import { create_chat_data, edit_post_data, fetched_chat_post_data } from "@/utils/api/interfaces";
import { useWallet } from "@meshsdk/react";
import { FC, useEffect, useState } from "react";
import ChatBubble from "./chat-bubble";


const ChatFrame: FC = ({

}) => {
  const themed = useThemedProps();
  const use_wallet = useWallet();

  const [chats, set_chats] = useState<fetched_chat_post_data[] | null>(null);

  const get_posts = async () => {
    const chat_posts = await fetch_chats();
    set_chats(chat_posts);
  }

  const create_chat = async (details: create_chat_data) => {

  }

  const edit_chat = async (details: edit_post_data) => {

  }

  useEffect(() => {
    get_posts()
  }, []);

  return (
    <div className={`lg:w-1/2 lg:mx-auto p-2 lg:p-4 flex flex-col gap-2 max-h-screen overflow-y-auto`}>
      {chats ?
        chats.map((chat, index) => (
          <span key={index} className="">
            <ChatBubble message={chat} index={index} on_edit={edit_chat}/>
          </span>
        ))
        :
        <div>
          posts loading
        </div>
      }

      <div className=""/>

      <PostCreation
        post_type="chat"
        is_connected={use_wallet.connected}
        connected_address={use_wallet.address}
        on_chat={{
          chat_data: create_chat
        }}
      />
    </div>
  )
}

export default ChatFrame;