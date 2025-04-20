import Head from "next/head";
import ForumsBlock from "@/blocks/forums";

export default function Home() {
  return (
    <div className="w-full">
      <Head>
        <title>Forums | Finbyte</title>
        <meta name="description" content="A Cardano dApp powered my Mesh" />
      </Head>

      <main className={`min-h-screen`}>
        <ForumsBlock/>
      </main>
    </div>
  );
}
