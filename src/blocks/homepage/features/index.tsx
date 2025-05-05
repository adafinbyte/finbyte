"use client";

import RadialOrbitalTimeline, { feature_detail } from "@/blocks/homepage/features/radial-orbital-timeline";
import { Calendar, Code, FileText, User, Clock, HandCoins, Newspaper, Network, Settings, Search } from "lucide-react";

const timelineData = [
  {
    id: 1,
    title: "Planning",
    date: "Jan 2024",
    content: "Project planning and requirements gathering phase.",
    category: "Planning",
    icon: Calendar,
    relatedIds: [2],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 2,
    title: "Design",
    date: "Feb 2024",
    content: "UI/UX design and system architecture.",
    category: "Design",
    icon: FileText,
    relatedIds: [1, 3],
    status: "completed" as const,
    energy: 90,
  },
  {
    id: 3,
    title: "Development",
    date: "Mar 2024",
    content: "Core features implementation and testing.",
    category: "Development",
    icon: Code,
    relatedIds: [2, 4],
    status: "in-progress" as const,
    energy: 60,
  },
  {
    id: 4,
    title: "Testing",
    date: "Apr 2024",
    content: "User testing and bug fixes.",
    category: "Testing",
    icon: User,
    relatedIds: [3, 5],
    status: "pending" as const,
    energy: 30,
  },
  {
    id: 5,
    title: "Release",
    date: "May 2024",
    content: "Final deployment and release.",
    category: "Release",
    icon: Clock,
    relatedIds: [4],
    status: "pending" as const,
    energy: 10,
  },
];

const features_data: feature_detail[] = [
  {
    id: 1,
    related_ids: [],
    icon: <img src='https://cdn4.iconfinder.com/data/icons/crypto-currency-and-coin-2/256/cardano_ada-512.png' className="p-1"/>,
    full_title: 'Built on Cardano',
    short_title: 'Cardano',
    content: `Unique to Cardano, the Finbyte platform is a Web3-first social platform that uses your browser wallet to verify your actions at no cost, ensuring a seamless and secure experience.`,
  },
  {
    id: 2,
    related_ids: [1],
    icon: <HandCoins className="p-1"/>,
    full_title: 'User Curated Tokens',
    short_title: 'Tokens',
    content: `You don't need to pay to request or modify your favorite tokenized projects on Finbyte. The process is as simple as creating a forum post with a request tag and waiting for the community to vote.`,
  },
  {
    id: 3,
    related_ids: [1, 5],
    icon: <Newspaper className="p-1"/>,
    full_title: 'Cardano Powered Chat & Forum',
    short_title: 'Web3 Chat',
    content: `Anybody can create content on Finbyte's Chat and within the Forums with a connected wallet, 100% free. Using Cardano's CIP-8, this is how we are able to verify your actions.`,
  },
  {
    id: 4,
    related_ids: [1, 5],
    icon: <Network className="p-1"/>,
    full_title: 'Cardano Integrations',
    short_title: 'Integrations',
    content: `We work hard to bring you the full Cardano experience. Currently, we have integrated Dexhunter for buying and selling listed tokens, MeshSDK for wallet integration, PoolPM & Blockfrost for blockchain data.`,
  },
  {
    id: 5,
    related_ids: [],
    icon: <Settings className="p-1"/>,
    full_title: 'Finbyte is Work-In-Progress',
    short_title: 'Development',
    content: `Although a work in progress, the platform is getting daily updates.
      With this, you may see some bugs when using the platform.
      The one main "bug" we do have is Wallet Mobile support but we are working on this.`,
  },
  {
    id: 6,
    related_ids: [1, 5, 4],
    icon: <Search className="p-1"/>,
    full_title: 'Explore the Ecosystem',
    short_title: 'Explore',
    content: `To bring that Cardano experience, we're creating a way for you to search the whole of Cardano. Currently we have an Address explorer that shows the blockchain data alongside their Finbyte data to bring a more unique experience.`,
  },
]

export function HomepageFeatures() {
  return (
    <>
      <RadialOrbitalTimeline features_data={features_data} />
    </>
  );
}

export default {
  HomepageFeatures,
};
