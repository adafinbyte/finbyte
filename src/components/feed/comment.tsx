import { comment_post_data, full_post_data } from "@/utils/interfaces";
import { FC } from "react";
import { generate_options, Option } from "./post";
import { Avatar, AvatarFallback } from "../ui/avatar";
import UserAvatar from "../user-avatar";
import FormatAddress from "../format-address";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import { useWallet } from "@meshsdk/react";
import { moderation_addresses } from "@/utils/consts";
import FinbyteMarkdown from "../finbyte-md";
import { format_unix } from "@/utils/format";

interface custom_props {
  index: number;
  total_comments: number;
  comment: comment_post_data;
}

const FeedComment: FC <custom_props> = ({
  index, total_comments, comment
}) => {
  const { address, connected } = useWallet();

  const get_comment_options = (comment_author: string, comment: comment_post_data): Option[] => {
    const is_mod = connected && moderation_addresses.includes(address);
    const is_author = connected && comment_author === address;

    return generate_options({
      is_connected: connected,
      is_author,
      is_mod,
      base_options: [
        { title: "Report Post", action: () => { }, destructive: true },
      ],
      connected_options: [
        { title: "Follow User", action: () => { } },
        { title: "Mute User", action: () => { } },
      ],
      author_options: [
        { title: "Edit Comment", action: () => { } },
        { title: "Remove Post", action: () => { }, destructive: true },
      ],
      mod_options: [
        { title: "Remove Post", action: () => { }, destructive: true },
      ],
    });
  };

  return (
    <div
      key={index}
      className={`flex gap-3 py-4 px-2 dark:bg-slate-900 ${index === 0 && "rounded-t-xl"} ${total_comments - 1 === index && "rounded-b-xl"
        }`}
    >
      <Avatar className="size-6 mt-1">
        <UserAvatar address={comment.author} />
        <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-medium">
              <FormatAddress address={comment.author} />
            </span>
            <span className="text-sm text-muted-foreground">
              {/**@ts-ignore**/}
              <span className="px-1.5">· {format_unix(comment.comment_timestamp).time_ago}</span>
            </span>
          </div>

          {
            /**
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {get_comment_options(comment.author, comment)
                .filter((opt) => !opt.destructive)
                .map((item, idx) => (
                  <DropdownMenuItem key={idx} onClick={item.action}>
                    {item.title}
                  </DropdownMenuItem>
                ))}
              <DropdownMenuSeparator />
              {get_comment_options(comment.author, comment)
                .filter((opt) => opt.destructive)
                .map((item, idx) => (
                  <DropdownMenuItem key={`cd-${idx}`} className="text-destructive" onClick={item.action}>
                    {item.title}
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
             * 
             */
          }

        </div>
        <div className="break-words pr-4">
          <FinbyteMarkdown>{comment.post}</FinbyteMarkdown>
        </div>
      </div>
    </div>
  )
}

export default FeedComment;