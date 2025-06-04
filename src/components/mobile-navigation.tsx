import Link from "next/link"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import { Bell, Home, Plus, Search, Settings, User } from "lucide-react"

export default function MobileNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const handle_create_post = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/");
    }
  };

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t dark:border-slate-800 bg-background md:hidden">
      <div className="grid h-14 grid-cols-5">
        <Link
          href="/"
          className="flex flex-col items-center justify-center text-muted-foreground hover:text-foreground"
        >
          <Home className="h-5 w-5" />
          <span className="text-xs">Home</span>
        </Link>

        <Link
          href="/explore"
          className="flex flex-col items-center justify-center text-muted-foreground hover:text-foreground"
        >
          <Search className="h-5 w-5" />
          <span className="text-xs">Explore</span>
        </Link>
        <Link
          href="/"
          onClick={handle_create_post}
          className="flex flex-col items-center justify-center text-muted-foreground hover:text-foreground"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Plus className="size-6"/>
          </div>
        </Link>

        {/** @todo */}
        <Link
          href="/"
          className="opacity-50 flex flex-col items-center justify-center text-muted-foreground hover:text-foreground"
        >
          <User className="h-5 w-5" />
          <span className="text-xs">Profile</span>
        </Link>

        {/** @todo */}
        <Link
          href="/"
          className="opacity-50 flex flex-col items-center justify-center text-muted-foreground hover:text-foreground"
        >
          <Settings className="h-5 w-5" />
          <span className="text-xs">Settings</span>
        </Link>
      </div>
    </div>
  )
}
