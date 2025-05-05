import Head from "next/head";;
import TokenBlock from "@/blocks/tokens/token-block";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { curated_token } from "@/verified/interfaces";
import curated_tokens from "@/verified/tokens";

export default function Home() {
  const router = useRouter();
  const [found_token, set_found_token] = useState<curated_token | undefined>();

  useEffect(() => {
    const slug_id = router.asPath.split('/').pop();
    const found_token = curated_tokens.find(a => a.slug_id === slug_id);

    if (found_token) {
      set_found_token(found_token);
    }
  }, [router.asPath]);

  return found_token ? (
    <>
      <Head>
        <title>Exploring ${found_token.token_details.ticker} | Finbyte</title>
        <meta name="description" content="A Cardano dApp powered my Mesh" />
      </Head>

      <TokenBlock
        token={found_token}
      />
    </>
  ) : (
    <div>
      No token found...
    </div>
  );
}
