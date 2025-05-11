import Head from "next/head";;
import FinbyteChatBlock from "@/blocks/chat";

export default function Home() {
  return (
    <>
      <Head>
        <title>Chat | Finbyte</title>
        <meta name="description" content="The future of social, built on Cardano." />
      </Head>

      <FinbyteChatBlock/>
    </>
  );
}
