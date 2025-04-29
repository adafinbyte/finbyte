import FinbyteBlock from "@/blocks/finbyte";
import Head from "next/head";

export default function Home() {
  return (
    <div className="w-full">
      <Head>
        <title>Finbyte</title>
        <meta name="description" content="A Cardano dApp powered my Mesh" />
      </Head>

      <main className={`min-h-screen`}>
        <FinbyteBlock/>
      </main>
    </div>
  );
}
