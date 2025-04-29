import Head from "next/head";
import { CardanoWallet, MeshBadge } from "@meshsdk/react";
import Homepage from "@/blocks/homepage";

export default function Home() {
  return (
    <div className="w-full text-white text-center">
      <Head>
        <title>Mesh App on Cardano</title>
        <meta name="description" content="A Cardano dApp powered my Mesh" />
      </Head>
      <main>
        <Homepage/>
      </main>
    </div>
  );
}
