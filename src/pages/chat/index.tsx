import Head from "next/head";
import Chat from "@/blocks/chat";

export default function Home() {
  return (
    <div className="w-full">
      <Head>
        <title>Chat | Finbyte</title>
        <meta name="description" content="A Cardano dApp powered my Mesh" />
      </Head>

      <main className={`min-h-screen`}>
        <Chat/>
      </main>
    </div>
  );
}
