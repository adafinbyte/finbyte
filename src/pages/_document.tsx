import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical"/>
        <meta name="description" content="Join the Finbyte community to explore, discuss, and support the latest Cardano projects." />
        <meta name="keywords" content="Cardano, Finbyte, Blockchain, Forum, Crypto, Projects, Social, Social Media" />
        <meta property="og:title" content="Finbyte - The future of social; Built on Cardano." />
        <meta property="og:description" content={`
          "Where do builders meet supporters? Where do token holders, NFT collectors, and on-chain thinkers connect and collaborate?"
          Welcome to Finbyte. An open-source, Cardano-native social platform built to empower conversation, collaboration, and
          contribution with real on-chain incentives.`}
        />
        <meta property="og:image" content="/finbyte-img-1.jpg" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
