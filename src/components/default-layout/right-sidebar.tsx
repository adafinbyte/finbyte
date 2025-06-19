import { Dispatch, FC, SetStateAction } from "react"
import { Card } from "../ui/card";
import { finbyte_topics } from "@/utils/consts";
import { capitalize_first_letter } from "@/utils/common";
import { Button } from "../ui/button";
import Link from "next/link";
import { curated_token } from "@/verified/interfaces";
import SocialIcon from "../social-icons";

interface stat_item { title: string; data: string | number; }
interface platform_stats_props {
  stat_items: stat_item[];
}
export const PlatformStats: FC <platform_stats_props> = ({
  stat_items
}) => (
  <Card className="space-y-2 p-4">
    <h1 className="font-semibold text-sm">Platform Stats</h1>
    {stat_items.map((item, index) => (
      <div key={index}>
        <h1 className="text-xs font-semibold text-muted-foreground">{item.title}</h1>
        <p className="text-base">{item.data}</p>
      </div>
    ))}
  </Card>
)

interface platform_topics_props {
  set_topic: Dispatch<SetStateAction<string | null>>;
  topic: string | null;
  topic_counts: Record<string, number>;
}
export const PlatformTopics: FC <platform_topics_props> = ({
  set_topic, topic, topic_counts
}) => {
  return (
    <Card className="space-y-2 p-4">
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
    <Card className="space-y-2 p-4">
      <h1 className="font-semibold text-sm">Quick Links</h1>
      <ol className="list-disc list-inside space-y-1 text-sm">
        {quick_links.map((link, index) => (
          <li>
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