import * as React from "react"
import {
  HelpCircleIcon,
  HomeIcon,
  MessagesSquareIcon,
  HandCoinsIcon,
  Image,
  MessageCircleIcon,
  Hammer
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
import { Card } from "@/components/ui/card"

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
  ],
  navSecondary: [
    {
      title: "Tools",
      url: "/tools",
      icon: <Hammer/>,
    },
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
        <div className="mt-auto"/>

        {/**
        <div className="transition-all duration-300 group-data-[collapsible=icon]:hidden pb-2">
          <Card className="border-transparent p-2">
            <p className="text-sm font-medium">Did you know?</p>
            <p className="text-muted-foreground text-xs">
              The $FIN token will be launching soon on the Cardano blockchain, allowing you to earn free through real social engagement.
            </p>
          </Card>
        </div>
         */}

        <NavSecondary items={data.navSecondary} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
