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
        <span className="text-neutral-800 dark:text-neutral-200 text-5xl md:text-6xl">Finbyte:</span>
        <span>
          The Future of Social, Built on <span className="text-blue-600">Cardano</span>.
        </span>
      </motion.span>

      <motion.p
        variants={itemVariants}
        className="mt-4 text-neutral-700 dark:text-neutral-400 text-sm lg:text-lg lg:w-3/4 lg:mx-auto"
      >
        Finbyte is a Cardano-native forum platform designed for the crypto-savvy and
        community-minded. Inspired by the simplicity of Reddit, Finbyte goes further by
        offering powerful on-chain tools, token-based engagement, and an open-source
        foundation for transparency and growth. Whether you're looking to discuss crypto
        topics, check NFT rarities, explore tokens, or support projects directly, Finbyte
        puts it all at your fingertips.
      </motion.p>

      <motion.div
        variants={itemVariants}
        className="mt-4 lg:mt-6 inline-flex flex-wrap px-2 justify-center gap-2 text-base"
      >
        {finbyte_stats ?
          <FinbyteStats
            finbyte_stats={finbyte_stats}
          />
          : <LoadingDots/>
        }

      </motion.div>

      <div>
        <motion.div
          variants={itemVariants}
          className="mt-4 w-full flex flex-col justify-center"
        >
          <Accordion type="multiple" className="grid lg:grid-cols-4 w-full gap-4">
            {why_finbyte_sections.map((section, sectionIndex) => (
              <motion.div
                key={sectionIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  delay: sectionIndex * 0.2
                }}
                className="w-full"
                >
                  <AccordionItem value={section.section}>
                    <AccordionTrigger>
                      {section.section}
                    </AccordionTrigger>

                    <AccordionContent>
                      <ScrollArea className="px-2 max-h-96">
                        <ul className="space-y-4 py-2">
                          {section.items.map((item, itemIndex) => (
                            <li key={itemIndex}>
                              <h4 className="font-medium">{item.title}</h4>
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                            </li>
                          ))}
                        </ul>
                      </ScrollArea>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))
            }
          </Accordion>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Hero;