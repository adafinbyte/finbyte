import { Marquee } from "@/components/marquee";
import { Card, CardContent } from "@/components/ui/card";
import { useCountUp } from "@/hooks/use-count-up";
import { motion, useAnimation, useInView } from "framer-motion";
import { ArrowRight, HandCoins, Hash, MessageCircle, Newspaper, Users } from "lucide-react";
import { FC, ReactNode, useEffect, useRef, useState } from "react";
import { HomepageFeatures } from "./features";
import Link from "next/link";
import { BorderBeam } from "@/components/ui/border-beam";
import { fetch_finbyte_general_stats } from "@/utils/api/main/misc";
import { useToast } from "@/hooks/use-toast";
import { thirdparty_logos } from "@/utils/consts";

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

const About: FC = () => {
  const ref = useRef(null);
  const in_view = useInView(ref, { once: false, margin: "-100px" });
  const controls = useAnimation();
  const { toast } = useToast();

  useEffect(() => {
    if (in_view) {
      controls.start("show");
    }
  }, [in_view, controls]);

  interface numbers {
    total_posts: number;
    unique_users: number;
    interactions: number;
  }

  const [numbers, set_numbers] = useState<numbers | null>();
  const fetch_data = async () => {
    const numbers = await fetch_finbyte_general_stats();
    if (numbers?.error) {
      toast({
        description: numbers.error.toString(),
        variant: 'destructive'
      });
      return;
    }
  
    if (numbers?.data) {
      set_numbers(numbers.data);
    }
  }

  useEffect(() => {
    fetch_data()
  }, []);

  const count = {
    total_posts: useCountUp(numbers?.total_posts ?? 0, { duration: 2500 }),
    unique_users: useCountUp(numbers?.unique_users ?? 0, { duration: 2500 }),
    interactions: useCountUp(numbers?.interactions ?? 0, { duration: 2500 }),
  }
  interface stat_item {title: string; text: string; data: string | number; icon: ReactNode; main?: boolean}
  const stat_items: stat_item[] = [
    {title: 'Total Posts', text: 'Combined total of Finbyte Posts.', data: count.total_posts, icon: <Newspaper className="size-10"/>, main: true},
    {title: 'Unique Users', text: 'Combined total of users who have interacted with Finbyte.', data: count.unique_users, icon: <Users className="text-blue-400 lg:size-10"/>},
    {title: 'Interactions', text: 'From creating a post to signing up, we count everything!', data: count.interactions, icon: <Hash className="text-blue-400 lg:size-10"/>},
  ];

  interface thirdparty_info {title: string; url: string; image: string; description: string;}
  const thirdparty_items: thirdparty_info[] = [
    {title: 'MeshSDK', url: 'https://meshjs.dev/', image: thirdparty_logos.meshsdk, description: 'Mesh is a TypeScript open-source framework and library, providing numerous tools to build Web3 apps.'},
    {title: 'DexHunter', url: 'https://www.dexhunter.io/', image: thirdparty_logos.dexhunter, description: 'Biggest Cardano DEX Aggregator with the best rates, real-time alerts and an easy to use interface'},
    {title: 'PoolPM', url: 'https://pool.pm/', image: thirdparty_logos.poolpm, description: 'Cardano visual explorer.'},
    {title: 'Blockfrost', url: 'https://blockfrost.io/', image: thirdparty_logos.blockfrost, description: 'Blockfrost.io is an instant, highly optimized, public and freely accessible API as a Service that serves as an alternative access to the Cardano blockchain and related networks, with extra features, without the need for running and maintaining additional infrastructure and tooling yourself.'},
    {title: 'Supabase', url: 'https://supabase.com/', image: 'https://img.icons8.com/color/512/supabase.png', description: 'Supabase is an open source Firebase alternative. Start your project with a Postgres database, Authentication, instant APIs, Edge Functions, Realtime subscriptions, Storage, and Vector embeddings.'},
    {title: 'shadcn', url: 'https://ui.shadcn.com/', image: 'https://avatars.githubusercontent.com/u/139895814?v=4', description: 'A set of beautifully-designed, accessible components and a code distribution platform.'},
    {title: 'Framer Motion', url: 'https://motion.dev/', image: 'https://user-images.githubusercontent.com/7850794/164965523-3eced4c4-6020-467e-acde-f11b7900ad62.png', description: 'A robust animation library for modern web projects using JavaScript, React, or Vue.'},
    {title: 'Lucide', url: 'https://lucide.dev/', image: 'https://images.opencollective.com/lucide-icons/9fe79a6/logo/256.png', description: 'Beautiful & consistent icons'},
    {title: 'Typescript', url: 'https://www.typescriptlang.org/', image: 'https://static-00.iconduck.com/assets.00/typescript-plain-icon-256x256-ypojgpyj.png', description: 'TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.'},
    {title: 'React', url: 'https://react.dev/', image: 'https://cdn4.iconfinder.com/data/icons/logos-3/600/React.js_logo-512.png', description: 'The library for web and native user interfaces'},
    {title: 'Markdown', url: 'https://en.wikipedia.org/wiki/Markdown', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9gEMEFNdXhYqUAExexlL_gxQAvQ8PQ6p2pQ&s', description: 'Markdown is a lightweight markup language for creating formatted text using a plain-text editor.'},
  ];
  
  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={controls}
      className="grid gap-2"
    >
      {/** @note initial doesnt need motion */}
      <div className="grid lg:grid-cols-2 gap-y-4 lg:gap-x-4 lg:gap-y-8 lg:px-36">
        {stat_items.map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className={`${item.main ? 'col-span-2' : ''} px-2`}
          >
            <Card className={`${item.main ? 'bg-gradient-to-r from-blue-500 to-cyan-500 border-transparent' : 'dark:border-neutral-800'} text-white`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium opacity-60">{item.title}</p>
                    <h3 className="text-4xl font-bold mt-2 tabular-nums">{item.data}</h3>
                  </div>

                  <div className={`p-4 rounded-full ${item.main ? 'p-4 bg-white/30' : 'p-2 bg-white/10'}`}>
                    {item.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        variants={containerVariants}
        className="grid pt-12 lg:pt-24 lg:px-24"
      >
        <motion.div
          variants={itemVariants}
          className="text-center flex flex-col w-full gap-2"
        >
          <h2 className={`text-3xl text-neutral-800 dark:text-neutral-300 font-bold lg:text-4xl`}>
            Where Community Meets the Chain.
          </h2>

          <p className={`text-neutral-600 dark:text-neutral-400`}>
            Merging the spirit of online forums with the transparency of Web3.
            Finbyte is built on Cardano to redefine how digital communities connect.
          </p>

          <span className="pt-2">
            <a className="inline-flex items-center gap-x-1 px-2 group text-sm text-blue-500 dark:text-blue-400 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium" href="#">
              Find out about getting started on Finbyte
              <ArrowRight className="size-4 group-hover:translate-x-0.5 duration-300"/>
            </a>
          </span>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="grid"
        >
          <HomepageFeatures/>
        </motion.div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="grid"
      >
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <Marquee pauseOnHover className="[--duration:120s]">
            {thirdparty_items.map((item, index) => (// change this to a card
              <Link
                key={index}
                title={item.url}
                target="_blank"
                href={item.url}
              >
                <Card className="relative p-2 inline-flex gap-x-4 opacity-50 hover:opacity-100 duration-300 w-64 dark:border-neutral-800">
                  <img src={item.image} className="size-10 flex-shrink-0 my-auto" />
                   <div className="flex flex-col w-full text-left">
                    <h1 className="font-semibold">{item.title}</h1>
                    <p className="flex-1 break-normal line-clamp-2 text-sm text-neutral-300">{item.description}</p>
                  </div>
                  <BorderBeam/>
                </Card>
              </Link>
            ))}
          </Marquee>
        </div>
      </motion.div>

    </motion.div>
  )
}

export default About;