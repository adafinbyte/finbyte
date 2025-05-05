import { FC, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calculator, Coins, HandCoins, HeartHandshake, MessagesSquare, Newspaper, Users } from "lucide-react";

import SiteHeader from "@/components/site-header";
import curated_tokens from "@/verified/tokens";
import { Card, CardContent } from "@/components/ui/card";
import { copy_to_clipboard } from "@/utils/string-tools";
import { cn } from "@/lib/utils";
import { useCountUp } from "@/hooks/use-count-up";
import { toast } from "@/hooks/use-toast";
import { fetch_finbyte_general_stats } from "@/utils/api/main/misc";

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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

const StatBlock: FC = () => {
  const [numbers, set_numbers] = useState<numbers | null>();

  const stat_values = {
    total_posts: useCountUp(numbers?.total_posts ?? 0, { duration: 2500 }),
    unique_users: useCountUp(numbers?.unique_users ?? 0, { duration: 2500 }),
    interactions: useCountUp(numbers?.interactions ?? 0, { duration: 2500 }),
    likes: useCountUp(numbers ? numbers.likes_given : 0, { duration: 2500 }),
    forum_posts: useCountUp(numbers?.forum_posts ?? 0, { duration: 2500 }),
    forum_comments: useCountUp(numbers?.forum_comments ?? 0, { duration: 2500 }),
    community_posts: useCountUp(numbers?.community_posts ?? 0, { duration: 2500 }),
    tokens: useCountUp(curated_tokens.length, { duration: 2500 }),
  }

  const finbyte_stats = [
    { icon: <Newspaper className="text-blue-400"/>, title: 'Finbyte Posts', data: stat_values.total_posts },
    { icon: <Users className="text-blue-400"/>, title: 'Unique Users', data: stat_values.unique_users },
    { icon: <HandCoins className="text-blue-400"/>, title: 'Curated Tokens', data: stat_values.tokens },
    { icon: <Calculator className="text-blue-400"/>, title: 'Total Interactions', data: stat_values.interactions },
    { icon: <HeartHandshake className="text-blue-400"/>, title: 'Likes Given', data: stat_values.likes },
    { icon: <Newspaper className="text-blue-400"/>, title: 'Forum Posts', data: stat_values.forum_posts },
    { icon: <MessagesSquare className="text-blue-400"/>, title: 'Forum Comments', data: stat_values.forum_comments },
    { icon: <Newspaper className="text-blue-400"/>, title: 'Community Posts', data: stat_values.community_posts },
  ];

  const fetch_data = async () => {
    const numbers = await fetch_finbyte_general_stats();
    if (numbers?.error) {
      toast({
        description: numbers.error.toString(),
        variant: 'destructive'
      });
      return;
    }
  
    if (numbers?.data) {
      set_numbers(numbers.data);
    }
  }

  useEffect(() => {
    fetch_data()
  }, []);


  return (
    <>
      <SiteHeader title='Finbyte Statistics'/>

      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2 p-2 lg:p-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 pt-8" style={{ placeItems: 'start'}}>
            {finbyte_stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  delay: 0.25 + (index * 0.1),
                }}
                className="w-full"
              >
                <Card
                  onClick={() => copy_to_clipboard(stat.data.toString(), 'The value of "' + stat.title + '" has been copied.')}
                  className={cn(
                    `dark:border-neutral-900`,
                    "cursor-copy transition-all duration-300 hover:-translate-y-0.5 will-change-transform hover:bg-black/10 hover:dark:bg-neutral-900",
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-x-6 justify-between">
                      <div>
                        <p className="text-sm font-medium opacity-60">{stat.title}</p>
                        <h3 className="text-4xl font-bold mt-2 tabular-nums">{stat.data}</h3>
                      </div>

                      <div className={`p-4 rounded-full`}>
                        {stat.icon}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default StatBlock;