import Head from "next/head";;
import HomepageBlock from "@/blocks/homepage";

export default function Home() {
  return (
    <>
      <Head>
        <title>Finbyte on Cardano</title>
        <meta name="description" content="The future of social, built on Cardano." />
      </Head>

      <HomepageBlock/>
    </>
  );
}
