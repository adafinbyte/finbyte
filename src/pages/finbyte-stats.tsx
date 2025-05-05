import Head from "next/head";;
import StatBlock from "@/blocks/finbyte/stats-block";

export default function Home() {
  return (
    <>
      <Head>
        <title>Stats | Cardano</title>
      </Head>

      <StatBlock/>
    </>
  );
}
