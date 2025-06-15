import { Dispatch, FC, SetStateAction } from "react"
import { Card } from "../ui/card";
import { finbyte_topics } from "@/utils/consts";
import { capitalize_first_letter } from "@/utils/common";
import { Button } from "../ui/button";
import Link from "next/link";

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