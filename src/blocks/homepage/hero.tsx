import { FC, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { HandCoins, MessageCircle, MessagesSquare } from "lucide-react";
import { motion, useAnimation, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { fetch_finbyte_general_stats } from "@/utils/api/misc";
import { finbyte_general_stats } from "@/utils/api/interfaces";
import FinbyteStats from "./finbyte-stats";
import { LoadingDots } from "@/components/ui/loading-dots";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";

const Hero: FC = () => {
  const ref = useRef(null);
  const in_view = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();
  const [finbyte_stats, set_finbyte_stats] = useState<finbyte_general_stats | null>(null);

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

  const fetch_data = async () => {
    const finbyte_stats = await fetch_finbyte_general_stats();
    if (finbyte_stats?.error) {
      toast.error('Failed to get Finbyte statistics.', { description: finbyte_stats.error });
      return;
    }
    if (finbyte_stats?.data) {
      set_finbyte_stats(finbyte_stats.data);
      return;
    }
  };

  useEffect(() => {
    fetch_data()
  }, []);


  useEffect(() => {
    if (in_view) {
      controls.start("show");
    }
  }, [in_view, controls]);

const why_finbyte_sections = [
  {
    section: 'Core Community Features',
    items: [
      {
        title: 'Community Discussions',
        description: 'Reddit-style threads built for Cardano talk, ideas, and requests.',
      },
      {
        title: 'Kudos for Engagement',
        description: 'Earn Kudos when your posts and comments get liked — rewarding meaningful interaction.',
      },
      {
        title: 'Request Voting',
        description: 'Submit ideas and vote on features to shape the platform together.',
      },
      {
        title: 'Live Chat',
        description: 'Instant messaging built in for real-time community interaction.',
      },
    ],
  },
  {
    section: 'Earning and Support System',
    items: [
      {
        title: '$FIN Token (Coming Soon)',
        description: 'Earn $FIN through engagement and use it to support Cardano projects.',
      },
      {
        title: 'Project Support with $FIN',
        description: 'Use your $FIN to back projects you believe in and help them grow.',
      },
    ],
  },
  {
    section: 'Blockchain Tools Built In',
    items: [
      {
        title: 'Token Explorer',
        description: 'Explore Cardano tokens with rich data, trends, and discovery features.',
      },
      {
        title: 'NFT Rarity Checker',
        description: 'View rarity scores and rankings across Cardano NFT collections.',
      },
      {
        title: 'Address Explorer',
        description: 'Track wallet activity, holdings, and on-chain history across Cardano.',
      },
    ],
  },
  {
    section: 'Platform Values',
    items: [
      {
        title: 'Open Source',
        description: 'Transparent and community-built. Available now on GitHub.',
      },
      {
        title: 'Cardano-Native',
        description: 'Built from the ground up for Cardano with full DApp wallet support.',
      },
    ],
  },
];

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
        <span className="text-neutral-800 dark:text-white text-5xl md:text-6xl">Finbyte;</span>
        <span className="dark:text-white/70 text-black/80">
          The Future of Social, Built on <span className="text-blue-400">Cardano</span>.
        </span>
      </motion.span>

      <motion.p
        variants={itemVariants}
        className="mt-4 text-neutral-700 dark:text-neutral-200 text-sm lg:text-lg lg:w-4/5 lg:mx-auto p-2"
      >
        <span className="italic dark:text-white text-xl">
          "Where do builders meet supporters?
          Where do token holders, NFT collectors, and on-chain thinkers connect and collaborate?"
        </span>
        <br/>
        <br/>
        Welcome to Finbyte.
        An open-source, Cardano-native social platform built to empower conversation, collaboration, and contribution with real on-chain incentives.
      </motion.p>

      <motion.div
        variants={itemVariants}
        className="mt-8 lg:mt-12"
      >
        {finbyte_stats ?
          <FinbyteStats
            finbyte_stats={finbyte_stats}
          />
          : <LoadingDots/>
        }
      </motion.div>
    </motion.div>
  );
};

export default Hero;