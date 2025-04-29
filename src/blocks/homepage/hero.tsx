import { FC, useEffect, useRef } from "react";
import Link from "next/link";
import { MessageCircle, Search } from "lucide-react";
import { motion, useAnimation, useInView } from "framer-motion";

import useThemedProps from "@/contexts/themed-props";
import ForumPostExample from "@/components/forums-core/post/example";

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
  const themed = useThemedProps();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("show");
    } else {
      controls.set("hidden");
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={controls}
      className="min-h-screen flex items-center justify-center"
    >
      <div className="max-w-6xl mx-auto xl:px-0">
        <motion.span
          variants={itemVariants}
          className={`${themed['300'].text} font-semibold text-2xl md:text-4xl flex flex-col gap-2`}
        >
          <span className={`${themed['200'].text} text-5xl md:text-6xl`}>Finbyte:</span>
          <span>
            The Future of Social, Built on <span className="text-blue-600">Cardano</span>.
          </span>
        </motion.span>

        <motion.p
          variants={itemVariants}
          className={`mt-4 ${themed['400'].text} text-sm lg:text-lg lg:w-3/4 lg:mx-auto`}
        >
          A social platform designed for the modern web. Built with Cardano, Finbyte puts control,
          transparency, and community back where it belongs — in your hands.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="mt-4 lg:mt-6 inline-flex flex-wrap px-2 justify-center gap-2 text-base"
        >
          <Link href='/forums'>
            <button className={`inline-flex gap-2 items-center font-semibold ${themed['900'].bg} hover:${themed['800'].bg} border ${themed['700'].border} p-1 px-4 rounded-lg ${themed['200'].text} duration-300`}>
              <MessageCircle size={18}/>
              Forums
            </button>
          </Link>

          <Link href='/explore'>
            <button className={`inline-flex gap-2 items-center font-semibold ${themed['900'].bg} hover:${themed['800'].bg} border ${themed['700'].border} p-1 px-4 rounded-lg ${themed['200'].text} duration-300`}>
              <Search size={18}/>
              Explore
            </button>
          </Link>
        </motion.div>

        <motion.div
  variants={containerVariants}
  className="grid lg:grid-cols-3 gap-4 mt-10 lg:scale-90"
  style={{ placeItems: 'start' }}
>
  <motion.div variants={itemVariants} className="w-full">
    <ForumPostExample type="forum_post" />
  </motion.div>

  <motion.div variants={itemVariants} className="w-full">
    <ForumPostExample type="forum_comment" show_gif_post={true} />
  </motion.div>

  <motion.div variants={itemVariants} className="w-full">
    <ForumPostExample type="forum_comment" />
  </motion.div>
</motion.div>
      </div>
    </motion.div>
  );
};

export default Hero;
