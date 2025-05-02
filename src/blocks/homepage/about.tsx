import Marquee from "@/components/marquee";
import useThemedProps from "@/contexts/themed-props";
import { fetch_everything_count } from "@/utils/api/fetch";
import { motion, useAnimation, useInView } from "framer-motion";
import { ArrowRight, HandCoins, Hash, MessageCircle, Newspaper, Users } from "lucide-react";
import { FC, ReactNode, useEffect, useRef, useState } from "react";

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

  const about_items = [
    {
      icon:  <MessageCircle className={`${themed['300'].text} size-6`}/>,
      title: "Community Driven Forums",
      about: "Unique to Cardano, Finbyte's Forums is a Web3 social platform that uses your browser wallet to verify your actions at no cost, ensuring a seamless and secure experience.",
    },
    {
      icon:  <HandCoins className={`${themed['300'].text} size-6`}/>,
      title: "User Curated Projects",
      about: "You don't need to pay to request or modify your favorite tokenized projects on Finbyte. The process is as simple as creating a forum post with a request tag and waiting for the community to vote.",
    },
    {
      icon:  <Users className={`${themed['300'].text} size-6`}/>,
      title: "Finbyte Curators",
      about: "Curators play a significant role on Finbyte, and to express our appreciation, we have created dedicated curator pages. These pages can serve as valuable references to enhance your presence within the Cardano community.",
    },
  ];

  interface numbers {
    total_posts: number;
    unique_users: number;
    interactions: number;
  }

  const [numbers, set_numbers] = useState<numbers | null>();
  const fetch_data = async () => {
    const numbers = await fetch_everything_count();
    if (numbers) { set_numbers(numbers); }
  }

  useEffect(() => {
    fetch_data()
  }, []);

  interface stat_item {title: string; text: string; data: string | number; icon: ReactNode;}
  const stat_items: stat_item[] = [
    {title: 'Total Posts', text: 'This includes Forum posts, comments and community posts.', data: numbers?.total_posts.toLocaleString() ?? 0, icon: <Newspaper className="text-blue-400 size-10"/>},
    {title: 'Unique Users', text: 'This also includes anon users that have interacted with Finbyte.', data: numbers?.unique_users.toLocaleString() ?? 0, icon: <Users className="text-blue-400 size-10"/>},
    {title: 'Interactions', text: 'From creating a post to signing up, we count everything!', data: numbers?.interactions.toLocaleString() ?? 0, icon: <Hash className="text-blue-400 size-10"/>},
  ];

  interface thirdparty_info {title: string; url: string; image: string; description: string;}
  const thirdparty_items: thirdparty_info[] = [
    {title: 'MeshSDK', url: 'https://meshjs.dev/', image: 'https://meshjs.dev/logo-mesh/white/logo-mesh-white-64x64.png', description: 'Mesh is a TypeScript open-source framework and library, providing numerous tools to build Web3 apps.'},
    {title: 'DexHunter', url: 'https://www.dexhunter.io/', image: 'https://www.dexhunter.io/_next/static/media/hunt-token.0f202821.svg', description: 'Biggest Cardano DEX Aggregator with the best rates, real-time alerts and an easy to use interface'},
    {title: 'PoolPM', url: 'https://pool.pm/', image: 'https://pool.pm/pool.pm.svg', description: 'Cardano visual explorer.'},
    {title: 'Blockfrost', url: 'https://blockfrost.io/', image: 'https://pbs.twimg.com/profile_images/1683911708719316992/n9LpcKJk_400x400.png', description: 'Blockfrost.io is an instant, highly optimized, public and freely accessible API as a Service that serves as an alternative access to the Cardano blockchain and related networks, with extra features, without the need for running and maintaining additional infrastructure and tooling yourself.'},
    {title: 'Supabase', url: 'https://supabase.com/', image: 'https://img.icons8.com/color/512/supabase.png', description: 'Supabase is an open source Firebase alternative. Start your project with a Postgres database, Authentication, instant APIs, Edge Functions, Realtime subscriptions, Storage, and Vector embeddings.'},
    {title: 'Lucide', url: 'https://lucide.dev/', image: 'https://images.opencollective.com/lucide-icons/9fe79a6/logo/256.png', description: 'Beautiful & consistent icons'},
    {title: 'React', url: 'https://react.dev/', image: 'https://cdn4.iconfinder.com/data/icons/logos-3/600/React.js_logo-512.png', description: 'The library for web and native user interfaces'},
    {title: 'Framer Motion', url: 'https://motion.dev/', image: 'https://user-images.githubusercontent.com/7850794/164965523-3eced4c4-6020-467e-acde-f11b7900ad62.png', description: 'A robust animation library for modern web projects using JavaScript, React, or Vue.'},
    {title: 'Typescript', url: 'https://www.typescriptlang.org/', image: 'https://static-00.iconduck.com/assets.00/typescript-plain-icon-256x256-ypojgpyj.png', description: 'TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.'},
    {title: 'Markdown', url: 'https://en.wikipedia.org/wiki/Markdown', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9gEMEFNdXhYqUAExexlL_gxQAvQ8PQ6p2pQ&s', description: 'Markdown is a lightweight markup language for creating formatted text using a plain-text editor.'},
  ];
  
  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={controls}
      className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto"
    >
      <div className="p-2 grid lg:grid-cols-3 gap-4 lg:gap-0 mx-auto pb-4 lg:pb-24">
        {stat_items.map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="flex gap-2 lg:gap-8 items-center"
          >
            {item.icon}
            <div className="flex flex-col text-left">
              <span className={`${themed['300'].text} flex gap-2 text-lg font-semibold`}>
                <h1>
                  {item.data}
                </h1>
                <span>-</span>
                <h1>
                  {item.title}
                </h1>
              </span>

              <p className={`${themed['400'].text} text-base`}>
                {item.text}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

        <motion.div
  variants={containerVariants}
  className="grid md:grid-cols-2 gap-12 pb-24 w-full"
  style={{ placeItems: 'center' }}
>
                <motion.div
                  variants={itemVariants}
                  className={`lg:w-3/4`}
                >
          <h2 className={`text-3xl ${themed['300'].text} font-bold lg:text-4xl`}>
            Where Community Meets the Chain.
          </h2>
          <p className={`mt-4 ${themed['400'].text}`}>
            Merging the spirit of online forums with the transparency of Web3.
            Finbyte is built on Cardano to redefine how digital communities connect.
          </p>

          <p className="mt-5">
            <a className="inline-flex items-center gap-x-1 px-2 group text-sm text-blue-400 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium" href="#">
              Find out about getting started on Finbyte
              <ArrowRight className="size-4 group-hover:translate-x-0.5 duration-300"/>
            </a>
          </p>
        </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="grid gap-y-4"
                >
          {about_items.map((item, index) => (
            <div key={index} className="flex gap-x-4 items-center sm:gap-x-8">
              <span className={`m-auto shrink-0 inline-flex justify-center items-center size-12 rounded-full border-2 border-blue-400 ${themed['800'].bg}`}>
                {item.icon}
              </span>

              <div className="grow">
                <h3 className={`text-base sm:text-lg font-semibold ${themed['300'].text}`}>
                  {item.title}
                </h3>
                <p className={`mt-1 ${themed['400'].text}`}>
                  {item.about}
                </p>
              </div>
            </div>
          ))}
          </motion.div>
        </motion.div>
        
      
        <div>
                <motion.div
                  variants={itemVariants}
                  className={`relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-background`}
                >
        <h1 className={`text-center font-semibold text-lg ${themed['300'].text}`}>
          Powered By
        </h1>

        <Marquee pauseOnHover>
          {thirdparty_items.map((item, index) => (
            <a key={index} title={item.url} target="_blank" href={item.url} className={`p-2 inline-flex gap-x-4 opacity-50 hover:opacity-100 duration-300 border ${themed['700'].border} ${themed['900'].bg} w-64 rounded-lg`}>
              <img src={item.image} className="size-10 flex-shrink-0 my-auto"/>
              <div className="flex flex-col w-full text-left">
                <h1 className="font-semibold">
                  {item.title}
                </h1>
                <p className={`flex-1 break-normal line-clamp-2 text-sm ${themed['400'].text}`}>
                  {item.description}
                </p>
              </div>
            </a>
          ))}
        </Marquee>
      </motion.div>
      </div>
    </motion.div>
  )
}

export default About;