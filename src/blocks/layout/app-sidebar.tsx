import * as React from "react"
import {
  HelpCircleIcon,
  HomeIcon,
  MessagesSquareIcon,
  HandCoinsIcon,
  Image,
  MessageCircleIcon
} from "lucide-react"

import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import NavMain from "@/components/nav-main"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Homepage",
      url: "/",
      icon: <HomeIcon/>,
    },
    null,
    {
      title: "Forums",
      url: "/forums",
      icon: <MessagesSquareIcon/>,
    },
    {
      title: "Tokens",
      url: "/tokens",
      icon: <HandCoinsIcon/>,
    },
    {
      title: "Rarity Checker",
      url: "/rarity-checker",
      icon: <Image/>,
    },
  ],
  navSecondary: [
    {
      title: "Get Help",
      url: "/get-help",
      icon: <HelpCircleIcon/>,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/">
                <img src='/finbyte.png' className="size-4" />
                <span className="text-base font-semibold text-xl">Finbyte.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/**@ts-ignore */}
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
