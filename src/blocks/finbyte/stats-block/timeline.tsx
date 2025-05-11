"use client"

import { FC, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { BorderBeam } from "@/components/ui/border-beam"
import { ScrollArea } from "@/components/ui/scroll-area"

interface TimelineItemType {
  type: 'todo' | 'done' | 'wip' | 'idea'
  title: string
  description: string
  url?: string
  is_external: boolean
}

interface StatsTimelineProps {
  items: TimelineItemType[]
  className?: string
}

const StatsTimeline: FC<StatsTimelineProps> = ({ items, className }) => {
  return (
    <div className={cn("mt-2 relative grid grid-cols-2 lg:grid-cols-4 gap-4 w-full", className)}>
      {items.map((item, index) => (
        <TimelineItem key={index} item={item} index={index} />
      ))}
    </div>
  )
}

function TimelineItem({
  item,
  index
}: {
  item: TimelineItemType
  index: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.4 })

  const icon_color = {
    todo: 'bg-red-400',
    wip: 'bg-amber-400',
    done: 'bg-green-400',
    idea: 'bg-blue-400'
  }

  return (
    <motion.div
      ref={ref}
      className="relative w-full"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        delay: index * 0.15,
        duration: 0.5,
        type: "spring",
        stiffness: 100,
      }}
    >
      <Card className="relative border-transparent">
        <div
          className={cn(
            "absolute inset-0",
            "opacity-80",
            "transition-opacity duration-300",
            "pointer-events-none"
          )}
        >
          <div className="rounded-xl absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.06)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[length:4px_4px]" />
        </div>

        <CardHeader>
          <div className="flex justify-between gap-2 items-center">
            <h1 className="font-semibold">{item.title}</h1>
            <div className={`ml-auto size-3 rounded-full ${icon_color[item.type]}`} />
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="pr-4 pl-2 pb-2">
            <p className="max-h-32 break-normal text-sm opacity-75">{item.description}</p>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default StatsTimeline;
