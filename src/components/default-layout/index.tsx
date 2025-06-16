import { FC, ReactNode } from "react";
import TopNavigation from "./top-navigation";
import Sidebar from "./sidebar";
import MobileNavigation from "./mobile-navigation";
import { useTheme } from "next-themes";

interface custom_props {
  children: ReactNode;
  right_sidebar: JSX.Element;
}

const DefaultLayout: FC <custom_props> = ({
  children, right_sidebar
}) => {
  const { theme } = useTheme();
  /** @note mesh gradient > basic gradients https://gradienty.codes/mesh-gradients */
  const light_bg = {
    backgroundColor: "#f1f5f9",
    backgroundImage: `
      radial-gradient(at 57% 21%, #f1f5f9 0%, transparent 60%),
      radial-gradient(at 63% 45%, #e2e8f0 0%, transparent 50%),
      radial-gradient(at 36% 52%, #cbd5e1 0%, transparent 40%),
      radial-gradient(at 43% 55%, #94a3b8 0%, transparent 30%)
    `,
  };

  const dark_bg = {
    backgroundColor: "#020617",
    backgroundImage: `
      radial-gradient(at 57% 21%, #020617 0%, transparent 60%),
      radial-gradient(at 63% 45%, #0f172a 0%, transparent 50%),
      radial-gradient(at 36% 52%, #1e293b 0%, transparent 40%),
      radial-gradient(at 43% 55%, #334155 0%, transparent 30%)
    `,
  };

  return (
    <div
      className="min-h-screen"
      style={theme === "light" ? light_bg : dark_bg}
    >
      <TopNavigation />

      <div className="container mx-auto px-4 pt-16 pb-20 md:pb-4 md:pt-20">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5 lg:grid-cols-8">
          <div className="hidden md:col-span-1 md:block lg:col-span-2 lg:w-[90%]">
            <Sidebar />
          </div>

          <div className="col-span-1 md:col-span-4 lg:col-span-4 space-y-4">
            {children}
          </div>

          <div className="hidden lg:col-span-2 lg:block">
            <div className="sticky top-20 space-y-4">
              {right_sidebar}
            </div>
          </div>
        </div>

        <div className="lg:hidden pt-4">
          <div className="sticky top-20 space-y-4">
            {right_sidebar}
          </div>
        </div>
      </div>

      <MobileNavigation />
    </div>
  )
}

export default DefaultLayout;