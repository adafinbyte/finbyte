import { Dispatch, FC, ReactNode, SetStateAction } from "react";
import { ALargeSmall, Box, GitMerge, GitPullRequest, Megaphone, MessagesSquare } from "lucide-react";
import { post_with_comments } from "@/utils/api/interfaces";
import useThemedProps from "@/contexts/themed-props";

interface custom_props {
  post_data: post_with_comments[] | null;

  tab_action: {
    state: number;
    set_state: Dispatch<SetStateAction<number>>;
  }

  tab_details: {
    id: number;
    title: string;
    icon: ReactNode;
    data: number;
  }[];
}

const ForumsSidebarSections: FC <custom_props> = ({
  post_data, tab_action, tab_details
}) => {
  const themed = useThemedProps();

  const finbyte_section = `border ${themed['900'].border}`;
  const active = `${themed['200'].text} ${themed['900'].bg} hover:${themed['800'].bg}`
  const inactive = `hover:${themed['900'].bg}`

  const create_button_style = (tab_id: number) => (
    `
      ${tab_id === tab_action.state ? active : inactive}
      ${tab_id === 5 ? finbyte_section : ''}
      p-2
      inline-flex
      gap-2
      items-center
      duration-300
      hover:${themed['300'].text}
      rounded-lg
    `
  )

  return (
    <div className={`flex flex-wrap items-center justify-center lg:justify-start gap-1 text-sm ${themed['400'].text}`}>
      {tab_details.map((section, index) => (
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