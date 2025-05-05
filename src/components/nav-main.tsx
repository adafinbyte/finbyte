import { MailIcon, PlusCircleIcon, type LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { FC, ReactNode } from "react"
import { useRouter } from "next/router"
import Link from "next/link"

interface item {
  title: string;
  url:   string;
  icon?: ReactNode;
}
interface custom_props {
  items: item[] | null;
}
const NavMain: FC <custom_props> = ({
  items,
}) => {
  const router = useRouter();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2 pt-4">
        <SidebarMenu>
          {items && items.map((item, index) => item !== null ? (
            <SidebarMenuItem key={index}>
              <Link href={item.url}>
                <SidebarMenuButton tooltip={item.title} isActive={router.pathname === item.url}>
                  {item.icon}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            ) : <div className="mt-4"/>)
          }
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export default NavMain;