import { FC, useEffect, useRef } from "react";
import Link from "next/link";
import { HandCoins, MessageCircle, MessagesSquare } from "lucide-react";
import { motion, useAnimation, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

const Hero: FC = () => {
  const ref = useRef(null);
  const in_view = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();
  const { toast } = useToast();

  useEffect(() => {
    if (in_view) {
      controls.start("show");
    }
  }, [in_view, controls]);

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={controls}
      className="min-h-screen flex flex-col gap-2 items-center justify-center text-center"
    >
      <motion.span
        variants={itemVariants}
        className="text-neutral-500 dark:text-neutral-400 font-semibold text-2xl md:text-4xl flex flex-col gap-2"
      >
        <span className="text-neutral-800 dark:text-neutral-200 text-5xl md:text-6xl">Finbyte:</span>
        <span>
          The Future of Social, Built on <span className="text-blue-600">Cardano</span>.
        </span>
      </motion.span>

      <motion.p
        variants={itemVariants}
        className="mt-4 text-neutral-700 dark:text-neutral-400 text-sm lg:text-lg lg:w-3/4 lg:mx-auto"
      >
        A social platform designed for the modern web. Built with Cardano, Finbyte puts control,
        transparency, and community back where it belongs — in your hands.
      </motion.p>

      <motion.div
        variants={itemVariants}
        className="mt-4 lg:mt-6 inline-flex flex-wrap px-2 justify-center gap-2 text-base"
      >
        <Link href="/forums">
          <Button variant="outline">
            <MessagesSquare size={18} />
            Forums
          </Button>
        </Link>

        <Link href="/chat">
          <Button variant="outline">
            <MessageCircle size={18} />
            Chat
          </Button>
        </Link>

        <Link href="/token">
          <Button>
            <HandCoins size={18} />
            Tokens
          </Button>
        </Link>
      </motion.div>

      <div>
        <motion.div
          variants={itemVariants}
          className="mt-4 relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg shadow-lg"
        />
      </div>
    </motion.div>
  );
};

export default Hero;