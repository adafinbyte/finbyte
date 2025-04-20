import Head from "next/head";
import { useRouter } from "next/router";
import ForumPostBlock from "@/blocks/forum-post";

export default function Home() {
  const router = useRouter();
  const path_segments = router.asPath.split('/');
  const post_id = path_segments[path_segments.length - 1];

  return (
    <div className="w-full">
      <Head>
        <title>#{post_id} | Forums | Finbyte</title>
        <meta name="description" content="A Cardano dApp powered my Mesh" />
      </Head>

      <main className={`min-h-screen`}>
        <ForumPostBlock/>
      </main>
    </div>
  );
}
