import { Dispatch, FC, SetStateAction } from "react";
import { ALargeSmall, Box, GitMerge, GitPullRequest, Megaphone, MessagesSquare } from "lucide-react";
import { post_with_comments } from "@/utils/api/interfaces";

interface custom_props {
  post_data: post_with_comments[] | null;

  tab_action: {
    state: number;
    set_state: Dispatch<SetStateAction<number>>;
  }

}

const ForumsSidebarSections: FC <custom_props> = ({
  post_data, tab_action
}) => {
  const icon_size = 16;
  const sidebar_sections = [
    {
      id: 1,
      title: "All Posts",
      icon: <ALargeSmall size={icon_size} />,
      data: post_data ? post_data.length : 0
    },
    {
      id: 2,
      title: "#General",
      icon: <MessagesSquare size={icon_size} />,
      data: post_data ? post_data.flat().filter(pwc => pwc.post.section === "general").length : 0
    },
    {
      id: 3,
      title: "#Requests",
      icon: <Megaphone size={icon_size} />,
      data: post_data ? post_data.filter(pwc => pwc.post.section === "requests").length : 0,
    },
    {
      id: 4,
      title: "#Chatterbox",
      icon: <Megaphone size={icon_size} />,
      data: post_data ? post_data.filter(pwc => pwc.post.section === "chatterbox").length : 0,
    },
    {
      id: 5,
      title: "#Finbyte",
      icon: <img src='/finbyte.png' className='size-4' />,
      data: post_data ? post_data.flat().filter(pwc => pwc.post.section === "finbyte").length : 0
    },
  ];

  const create_button_style = (tab_id: number) => (
    `
      ${tab_id === tab_action.state ? "bg-neutral-900 text-neutral-200" : ""}
      ${tab_id === 5 ? 'bg-blue-950/60 hover:bg-blue-950' : 'hover:bg-neutral-800'}
      p-2
      inline-flex
      gap-2
      items-center
      duration-300
      hover:text-neutral-300
      rounded-lg
    `
  )

  return (
    <div className="grid lg:grid-cols-5 lg:w-[80%] lg:mx-auto gap-2 text-sm text-neutral-400">
      {sidebar_sections.map((section, index) => (
        <button
          key={index}
          title={section.title}
          className={create_button_style(section.id)}
          onClick={() => tab_action.set_state(section.id)}
        >
          {section.icon}
          {section.title}

          <span className="ml-auto text-xs text-blue-400">
            {section.data}
          </span>
        </button>
      ))}
    </div>
  )
}

export default ForumsSidebarSections;