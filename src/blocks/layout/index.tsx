import { FC, ReactNode, useEffect, useRef } from "react";
import DefaultLayoutNavbar from "./navbar";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "./footer";
import useThemedProps from "@/contexts/themed-props";

interface CustomProps {
  children: ReactNode;
}

const DefaultLayout: FC<CustomProps> = ({ children }) => {
  const router = useRouter();
  const scroll_ref = useRef<HTMLDivElement>(null);
  const themed = useThemedProps();

  useEffect(() => {
    if (scroll_ref.current) {
      scroll_ref.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [router.pathname]);

  return (
    <div className={`flex flex-col w-full ${themed['950'].bg}`}>
      <DefaultLayoutNavbar />

      <div ref={scroll_ref} className={`flex-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:${themed['700'].bg} [&::-webkit-scrollbar-thumb]:${themed['500'].bg}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={router.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {children}
            <Footer/>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DefaultLayout;
