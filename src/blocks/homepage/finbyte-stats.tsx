import { FC, ReactNode, useEffect, useRef } from "react";
import { Hash, HeartHandshake, Newspaper, Users } from "lucide-react";
import { motion } from "framer-motion";

import { useCountUp } from "@/hooks/use-count-up";

import { finbyte_general_stats } from "@/utils/api/interfaces";
import { Card, CardContent } from "@/components/ui/card";

interface custom_props {
  finbyte_stats: finbyte_general_stats;
}

const FinbyteStats: FC <custom_props> = ({
  finbyte_stats
}) => {
  const itemVariants = {
    show: {
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  const counter = {
    total_posts:  useCountUp(finbyte_stats.total_posts  ?? 0, { duration: 2500 }),
    unique_users: useCountUp(finbyte_stats.unique_users ?? 0, { duration: 2500 }),
    interactions: useCountUp(finbyte_stats.interactions ?? 0, { duration: 2500 }),
    likes: useCountUp(finbyte_stats.likes_given ?? 0, { duration: 2500 }),
  }
  interface stat_item {title: string; data: string | number; icon: ReactNode;}
  const stat_items: stat_item[] = [
    {title: 'Total Posts',  data: counter.total_posts,  icon: <Newspaper className="size-8"/>},
    {title: 'Unique Users', data: counter.unique_users, icon: <Users className="size-8"/>},
    {title: 'Interactions', data: counter.interactions, icon: <Hash className="size-8"/>},
    {title: 'Total Post Likes', data: counter.likes, icon: <HeartHandshake className="size-8"/>},
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", delay: 0.1 }}
    >
      <div className="flex flex-wrap items-start justify-center gap-2">
        {stat_items.map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className={`px-2`}
          >
            <Card className={`bg-gradient-to-r border-transparent ${index % 2 ? 'from-neutral-500/10 to-cyan-500/10' : 'from-neutral-500/10 to-blue-500/10'} dark:text-white`}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 justify-between">
                  <div>
                    <p className="text-sm font-medium opacity-60">{item.title}</p>
                    <h3 className="text-4xl font-bold mt-2 opacity-90 tabular-nums">{item.data}</h3>
                  </div>

                  <div className={`px-4 py-2 rounded-full`}>
                    {item.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default FinbyteStats;