import { FC, ReactNode } from "react";
import DefaultLayoutSidebar from "./sidebar";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "./footer";

interface CustomProps {
  children: ReactNode;
}

const DefaultLayout: FC<CustomProps> = ({ children }) => {
  const router = useRouter();

  return (
    <div className="max-h-screen flex bg-neutral-950">
      <DefaultLayoutSidebar />

      {/* Animate route changes */}
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:bg-neutral-500">
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
