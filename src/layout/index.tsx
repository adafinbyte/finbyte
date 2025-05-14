import { AppSidebar } from "@/layout/app-sidebar";
import { usePathname } from "next/navigation";
import { FC, ReactNode, useEffect, } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "@/components/ui/sonner";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface custom_props {
  children: ReactNode;
}

const DefaultLayout: FC <custom_props> = ({
  children
}) => {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <div className="relative w-full min-h-screen overflow-hidden rounded-xl">
          <main className="relative z-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {children}
                <Toaster />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default DefaultLayout;