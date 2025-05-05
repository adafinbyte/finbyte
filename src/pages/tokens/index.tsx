import Head from "next/head";;
import TokensBlock from "@/blocks/tokens";

export default function Home() {
  return (
    <>
      <Head>
        <title>Explore Tokens | Finbyte</title>
        <meta name="description" content="A Cardano dApp powered my Mesh" />
      </Head>

      <TokensBlock/>
    </>
  );
}
