import Head from "next/head";;
import ForumsBlock from "@/blocks/forums";

export default function Home() {
  return (
    <>
      <Head>
        <title>Forums | Finbyte</title>
      </Head>

      <ForumsBlock/>
    </>
  );
}
