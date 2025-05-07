import { FC } from "react";
import FilterButton from "./filter-button";
import CreatePostModal from "@/components/modals/create-forum-post";
import { create_forum_post_data } from "@/utils/api/interfaces";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface custom_props {
  on_create_post: (details: create_forum_post_data) => Promise<void>;
  on_filter: (by_section: string) => void;
  on_refresh: () => Promise<void>;
  refreshing: boolean;
}

const ForumsAction: FC <custom_props> = ({
  on_create_post, on_filter, on_refresh, refreshing
}) => {

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Finbyte Forums</h1>
          <p className="text-muted-foreground mt-1 md:pr-12">
            Join the conversation, ask questions, share your knowledge, and connect with innovators shaping the future of finance.
          </p>
        </div>

        <div className="flex gap-3">
          <Button size={'sm'} variant={'outline'} onClick={on_refresh}>
            <RefreshCw size={12} className={refreshing ? "animate-spin" : ""}/>
          </Button>
          <FilterButton on_filter={on_filter}/>
          <CreatePostModal on_submit={on_create_post}/>
        </div>
      </div>

    </div>
  )
}

export default ForumsAction;