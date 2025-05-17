import Head from "next/head";;
import GetHelpBlock from "@/blocks/finbyte/get-help";

export default function Home() {
  return (
    <>
      <Head>
        <title>Get Help | Cardano</title>
      </Head>

      <GetHelpBlock/>
    </>
  );
}
