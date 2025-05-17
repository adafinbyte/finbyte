import Head from "next/head";;
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { curated_nft, curated_token } from "@/verified/interfaces";
import { LoadingDots } from "@/components/ui/loading-dots";
import curated_nfts from "@/verified/nfts";
import NFTBlock from "@/blocks/nfts/nft-block";

export default function Home() {
  const router = useRouter();
  const [found_nft, set_found_nft] = useState<curated_nft | undefined>();

  useEffect(() => {
    const slug_id = router.asPath.split('/').pop();
    const found_nft = curated_nfts.find(a => a.slug_id === slug_id);

    if (found_nft) {
      set_found_nft(found_nft);
    }
  }, [router.asPath]);

  return found_nft ? (
    <>
      <Head>
        <title>Exploring ${found_nft.collection_name} | Finbyte</title>
        <meta name="description" content="A Cardano dApp powered my Mesh" />
      </Head>

      <NFTBlock
        nft={found_nft}
      />
    </>
  ) : (
    <div className="flex w-full justify-center mt-10">
      <LoadingDots/>
    </div>
  );
}
