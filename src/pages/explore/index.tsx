import ExploreBlock from "@/blocks/explore";
import Head from "next/head";

export default function Home() {
  return (
    <div className="w-full">
      <Head>
        <title>Explore | Finbyte</title>
        <meta name="description" content="A Cardano dApp powered my Mesh" />
      </Head>

      <main className={`min-h-screen`}>
        <ExploreBlock/>
      </main>
    </div>
  );
}
