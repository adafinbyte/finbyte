import { Dispatch, FC, SetStateAction, useEffect, useState } from "react"
import { Card } from "../ui/card";
import { finbyte_topics } from "@/utils/consts";
import { capitalize_first_letter, shuffle_array } from "@/utils/common";
import { Button } from "../ui/button";
import Link from "next/link";
import { curated_token } from "@/verified/interfaces";
import SocialIcon from "../social-icons";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "../ui/avatar";
import curated_tokens from "@/verified/tokens";
import { Shuffle } from "lucide-react";
import { finbyte_general_stats, platform_user_details } from "@/utils/interfaces";
import { fetch_finbyte_general_stats } from "@/utils/api/misc";
import { toast } from "sonner";
import { LoadingDots } from "../loading-dots";
import FormatAddress from "../format-address";
import { format_unix } from "@/utils/format";

export const PlatformStats: FC = () => {
  const [finbyte_stats, set_finbyte_stats] = useState<finbyte_general_stats | null>(null);

  const get_stats = async () => {
    const finbyte_stats = await fetch_finbyte_general_stats();
    if (finbyte_stats?.error) {
      toast.error('Failed to get Finbyte statistics.', { description: finbyte_stats.error });
      return;
    }
    if (finbyte_stats?.data) {
      set_finbyte_stats(finbyte_stats.data);
      return;
    }
  };

  useEffect(() => {
    get_stats();
  }, []);

  interface stat_item { title: string; data: string | number; }
  const stat_items: stat_item[] = [
    { title: 'Total Posts', data: finbyte_stats?.total_posts ?? 0 },
    { title: 'Feed Posts', data: finbyte_stats?.forum_posts ?? 0 },
    { title: 'Feed Comments', data: finbyte_stats?.forum_comments ?? 0 },
    { title: 'Community Posts', data: finbyte_stats?.community_posts ?? 0 },
    { title: 'Unique Users', data: finbyte_stats?.unique_users ?? 0 },
    { title: 'Interactions', data: finbyte_stats?.interactions ?? 0 },
  ];

  return (
    <Card className="bg-secondary/20 backdrop-blur-lg space-y-2 p-4">
      <h1 className="font-semibold text-sm">Platform Stats</h1>
      {stat_items.map((item, index) => (
        <div key={index}>
          <h1 className="text-xs font-semibold text-muted-foreground">{item.title}</h1>
          <p className="text-base">{item.data}</p>
        </div>
      ))}
    </Card>
  )
}

interface platform_topics_props {
  set_topic: Dispatch<SetStateAction<string | null>>;
  topic: string | null;
  topic_counts: Record<string, number>;
}
export const PlatformTopics: FC <platform_topics_props> = ({
  set_topic, topic, topic_counts
}) => {
  return (
    <Card className="bg-secondary/20 backdrop-blur-lg space-y-2 p-4">
      <h1 className="font-semibold text-sm">Feed Topics</h1>
      <div className="space-y-2">
        <Button
          variant={topic === null ? 'secondary' : 'ghost'}
          className="w-full justify-start"
          onClick={() => set_topic(null)}
        >
          Latest Posts
        </Button>

        {finbyte_topics.map((t) => (
          <Button
            key={t}
            variant={t === topic ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            onClick={() => set_topic(t)}
          >
            #{capitalize_first_letter(t)}

            <span className="ml-auto">
              {topic_counts[t] ?? 0} posts
            </span>
          </Button>
        ))}
      </div>
    </Card>
  )
}

export const PlatformQuickLinks: FC = ({
}) => {
  const quick_links = [
    { title: 'Follow ', url_text: 'Finbyte on X', url: 'https://x.com/adaFinbyte', target: '_blank' },
    { title: 'About the ', url_text: '$tFIN token', url: '/tFIN', target: '' },
    { title: 'View $tFIN on ', url_text: 'Proprod Cardanoscan', url: 'https://preprod.cardanoscan.io/token/37524129746446a5a55da896fe5379508244ea85e4c140156badbdc67446494e', target: '_blank' },
  ];

  return (
    <Card className="bg-secondary/20 backdrop-blur-lg space-y-2 p-4">
      <h1 className="font-semibold text-sm">Quick Links</h1>
      <ol className="list-disc list-inside space-y-1 text-sm">
        {quick_links.map((link, index) => (
          <li key={index}>
            {link.title}
            <Link
              className="dark:text-blue-400 text-blue-500"
              href={link.url}
              target={link.target}
            >
              {link.url_text}
            </Link>.
          </li>
        ))}
      </ol>
    </Card>
  )
}

interface project_discover_props {
  token: curated_token | null;
}
export const ProjectDiscover: FC <project_discover_props> = ({
  token
}) => token && (
  <div className="flex flex-col gap-1">
    <h1 className="font-semibold text-sm">Discover more from {token.name}</h1>
    {token.finbyte?.collection?.map((item, index) => (
      <Link key={index} href={item.url} target="_blank" className="my-2">
        <Card className="bg-secondary/20 backdrop-blur-lg p-4 flex justify-between gap-4 items-center hover:-translate-y-0.5 duration-300">
          <div className="flex flex-col gap-1">
            <h1 className="font-semibold text-sm">
              {item.title}
            </h1>
            <p className="text-xs">
              {item.description}
            </p>
          </div>
          <img src={item.image} className="size-10 my-auto" />
        </Card>
      </Link>
    ))}
  </div>
)

export const ProjectLinks: FC<project_discover_props> = ({
  token
}) => token && (
  <div>
    <h1 className="font-semibold text-sm mb-2">Follow {token.name}</h1>
    <div className="flex flex-wrap gap-2" >
      {Object.entries(token.links).map(([key, value], index) => (
        <SocialIcon key={index} name={key} link={value} only_icon={false} />
      ))}
    </div>
  </div>
)

export const CuratedTokens: FC = () => {
  const [mounted, set_mounted] = useState(false);
  useEffect(() => set_mounted(true), []);

  const [randomised_tokens, set_randomised_tokens] = useState(
    () => shuffle_array(curated_tokens).slice(0, 10)
  );

  const randomise = () => {
    set_randomised_tokens(shuffle_array(curated_tokens).slice(0, 10));
  };

  if (!mounted) return null;

  return (
    <Card className="bg-secondary/20 backdrop-blur-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-semibold text-sm">Discover Tokens</h1>
        <Button variant='ghost' size='icon' className="scale-[90%]" onClick={randomise}>
          <Shuffle/>
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 items-center justify-center">
        {randomised_tokens.map((token, index) => (
          <Link key={index} href={'/projects/' + token.slug_id} className="hover:-translate-y-0.5 duration-300">
            <Avatar title={token.name}>
              <AvatarImage className="size-10 rounded-xl" src={token.images.logo} />
              <AvatarFallback>{token.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </Link>
        ))}
      </div>
    </Card>
  )
}

interface about_author_props {
  author: platform_user_details | undefined;
}
export const AboutAuthor: FC <about_author_props> = ({
  author
}) => {
  const bades = author?.badges ?? [];
  const community_badge = author?.community_badge ?? [];
  const bookmarked_posts = author?.bookmarked_posts ?? [];

  const author_details = [
    { title: 'Kudos', data: author?.total_kudos.toLocaleString() },
    { title: 'Total Posts', data: author?.total_posts.toLocaleString() },
    { title: 'First Interaction', data: format_unix(author?.first_timestamp ?? 0).time_ago },
  ];

  return (
    <Card className="bg-secondary/20 backdrop-blur-lg space-y-2 p-4">
      <h1 className="font-semibold text-sm">Author Details</h1>
      {author ?
        <div>
          <Link href={`/dashboard?address=${author.address}`}>
            <FormatAddress address={author.address}/>
          </Link>

          {author.ada_handle && (
            <FormatAddress address={author.ada_handle}/>
          )}

          {author_details.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground font-semibold">
                {item.title}
              </span>
              <span>
                {item.data}
              </span>
            </div>
          ))}

        </div>
        :
        <LoadingDots/>
      }
    </Card>
  )
}