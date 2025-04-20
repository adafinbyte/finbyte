import GetStartedBlock from "@/blocks/get-started";
import Head from "next/head";

export default function Home() {
  return (
    <div className="w-full">
      <Head>
        <title>Get Started | Finbyte</title>
        <meta name="description" content="A Cardano dApp powered my Mesh" />
      </Head>

      <main className={`min-h-screen`}>
        <GetStartedBlock/>
      </main>
    </div>
  );
}
