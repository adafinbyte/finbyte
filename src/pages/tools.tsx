

import Head from "next/head";;
import ToolsBlock from "@/blocks/tools";

export default function Home() {
  return (
    <>
      <Head>
        <title>Finbyte Tools</title>
        <meta name="description" content="The future of social, built on Cardano." />
      </Head>

      <ToolsBlock/>
    </>
  );
}
