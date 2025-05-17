import Head from "next/head";;
import AddressBlock from "@/blocks/address/address-block";

export default function Home() {
  return (
    <>
      <Head>
        <title>Address | Finbyte</title>
        <meta name="description" content="The future of social, built on Cardano." />
      </Head>

      <AddressBlock/>
    </>
  );
}
