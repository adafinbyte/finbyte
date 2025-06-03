import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

export default function Stories() {
  const stories = [
    { id: 1, username: "yourstory", avatar: "/placeholder.svg?height=60&width=60&text=You" },
    { id: 2, username: "alex", avatar: "/placeholder.svg?height=60&width=60&text=A" },
    { id: 3, username: "taylor", avatar: "/placeholder.svg?height=60&width=60&text=T" },
    { id: 4, username: "jordan", avatar: "/placeholder.svg?height=60&width=60&text=J" },
    { id: 5, username: "casey", avatar: "/placeholder.svg?height=60&width=60&text=C" },
    { id: 6, username: "riley", avatar: "/placeholder.svg?height=60&width=60&text=R" },
    { id: 7, username: "morgan", avatar: "/placeholder.svg?height=60&width=60&text=M" },
    { id: 8, username: "quinn", avatar: "/placeholder.svg?height=60&width=60&text=Q" },
  ]

  return (
    <div className="relative">
      <ScrollArea className="w-full whitespace-nowrap pb-4">
        <div className="flex w-max space-x-4 p-4">
          {stories.map((story) => (
            <div key={story.id} className="flex flex-col items-center space-y-1">
              <div className="relative h-16 w-16 rounded-full bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 p-[2px]">
                <div className="h-full w-full rounded-full border-2 border-background bg-muted">
                  <img
                    src={story.avatar || "/placeholder.svg"}
                    alt={story.username}
                    className="h-full w-full rounded-full object-cover p-[2px]"
                  />
                </div>
              </div>
              <span className="text-xs">{story.username}</span>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
