import Head from "next/head";;
import HomepageBlock from "@/blocks/homepage";
import RarityCheckerBlock from "@/blocks/rarity-checker";

export default function Home() {
  return (
    <>
      <Head>
        <title>Rarity Checker | Finbyte</title>
        <meta name="description" content="The future of social, built on Cardano." />
      </Head>

      <RarityCheckerBlock/>
    </>
  );
}
