import AddressBlock from "@/blocks/address";
import Head from "next/head";

export default function Home() {
  return (
    <div className="w-full">
      <Head>
        <title>Address | Finbyte</title>
        <meta name="description" content="A Cardano dApp powered my Mesh" />
      </Head>

      <main className={`min-h-screen`}>
        <AddressBlock/>
      </main>
    </div>
  );
}
