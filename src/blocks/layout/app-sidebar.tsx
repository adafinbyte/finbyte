import * as React from "react"
import {
  ArrowUpCircleIcon,
  BarChartIcon,
  CameraIcon,
  ClipboardListIcon,
  DatabaseIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  FolderIcon,
  HelpCircleIcon,
  HomeIcon,
  ListIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
  MessagesSquareIcon,
  MessageCircleIcon,
  HandCoinsIcon,
  Image
} from "lucide-react"

import { NavDocuments } from "@/components/nav-documents"
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

const FinbyteIcon = () => <img src="/finbyte.png" alt="logo" className="w-4 h-4" />;

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
//    {
//      title: "Chat",
//      url: "/chat",
//      icon: <MessageCircleIcon/>,
//    },
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
//    {
//      title: "NFTs",
//      url: "/nfts",
//      icon: <Image/>,
//    },
    {
      title: "Stats",
      url: "/finbyte-stats",
      icon: <FinbyteIcon/>,
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
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/">
                <img src='/finbyte.png' className="size-4" />
                <span className="text-base font-semibold">Finbyte.</span>
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
