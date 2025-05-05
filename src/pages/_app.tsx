import "@/styles/globals.css";
import "@meshsdk/react/styles.css";
import type { AppProps } from "next/app";
import { MeshProvider } from "@meshsdk/react";
import DefaultLayout from "@/blocks/layout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MeshProvider>
      <DefaultLayout>
        <Component {...pageProps} />        
      </DefaultLayout>
    </MeshProvider>
  );
}
