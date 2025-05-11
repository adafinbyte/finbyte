"use client"

import * as React from "react"
import { Settings } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import SettingsModal from "@/blocks/layout/modals/settings"
import Link from "next/link"
import { useRouter } from "next/router"

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: React.ReactNode
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const router = useRouter();
  const [settings_modal_open, set_settings_modal_open] = React.useState(false)

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton asChild isActive={router.pathname === item.url}>
                <Link href={item.url}>
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}

          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => set_settings_modal_open(true)}>
              <Settings/>
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>

      {/* Mount the modal outside of the menu */}
      <SettingsModal open={settings_modal_open} onOpenChange={set_settings_modal_open} />
    </SidebarGroup>
  )
}
