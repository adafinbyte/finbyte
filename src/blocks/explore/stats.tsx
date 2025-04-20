import { FC, useEffect, useState } from "react";

import { copy_to_clipboard } from "@/utils/string-tools";
import { Binoculars, Calculator, Coins, HandCoins, HeartHandshake, Newspaper, Users } from "lucide-react";
import { fetch_everything_count } from "@/utils/api/fetch";
import curators_list from "@/verified/curators";
import verified_tokens from "@/verified/tokens";

interface numbers {
  forum_posts: number;
  forum_comments: number;
  community_posts: number;
  total_posts: number;
  total_tips:  number;
  likes_given: number;
  unique_users: number;
  interactions: number;
}

const ExploreStats: FC = () => {
  const [numbers, set_numbers] = useState<numbers | null>();

  const icon_size = 20;
  const finbyte_stats = [
    {
      icon: <Newspaper size={icon_size} className="text-blue-400"/>,
      title: 'Finbyte Posts',
      data: numbers ? numbers.total_posts : 0,
      tt_title: 'Forum Posts +\nForum Comments +\nCommunity Posts.'
    },
    {
      icon: <Users size={icon_size} className="text-blue-400"/>,
      title: 'Unique Users',
      data: numbers ? numbers.unique_users : 0,
      tt_title: 'This includes anon users.'
    },
    {
      icon: <HandCoins size={icon_size} className="text-blue-400"/>,
      title: 'Curated Tokens',
      data: verified_tokens.length,
      tt_title: 'Curated by our community.'
    },
    {
      icon: <Binoculars size={icon_size} className="text-blue-400"/>,
      title: 'Curators',
      data: curators_list.length,
      tt_title: 'Curators help verify token information.'
    },
    {
      icon: <Calculator size={icon_size} className="text-blue-400"/>,
      title: 'Total Interactions',
      data: numbers ? numbers.interactions : 0,
      tt_title: 'Finbyte activity counter.'
    },
    {
      icon: <HeartHandshake size={icon_size} className="text-blue-400"/>,
      title: 'Likes Given',
      data: numbers ? numbers.likes_given : 0,
      tt_title: 'Finbyte total likes counter.'
    },
    {
      icon: <Coins size={icon_size} className="text-blue-400"/>,
      title: 'Total Tips',
      data: numbers ? numbers.total_tips.toLocaleString() : 0,
      tt_title: 'Amount of tips users have sent each other.'
    },
  ];

  const [loading, set_loading] = useState(true);

  const fetch_data = async () => {
    const numbers = await fetch_everything_count();
    if (numbers) { set_numbers(numbers); }
    set_loading(false);
  }

  useEffect(() => {
    fetch_data()
  }, []);

  return (
    <div className="border border-transparent flex flex-col w-full gap-4 text-neutral-300">

      <div className="flex flex-wrap gap-4 justify-center">
        {finbyte_stats.map((stat, index) => (
          <div key={index} title={stat.tt_title} onClick={() => copy_to_clipboard(stat.data.toString())} className="flex items-center gap-4 border border-neutral-700 hover:border-blue-400 duration-300 cursor-copy bg-neutral-900 rounded-lg px-4 py-2">
            {stat.icon}
            <div className="flex flex-col gap-y-0.5 text-right px-2">
              <h1 className="text-xs font-semibold text-neutral-500">
                {stat.title}
              </h1>
              {loading ?
                <span className="h-6 bg-neutral-800 w-full rounded-full animate-pulse"/>
                :
                <h1 className="text-lg tracking-wider">
                  {stat.data.toLocaleString()}
                </h1>
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ExploreStats;