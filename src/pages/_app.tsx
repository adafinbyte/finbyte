import "@/styles/globals.css";
import "@meshsdk/react/styles.css";
import type { AppProps } from "next/app";
import { MeshProvider } from "@meshsdk/react";
import DefaultLayout from "@/blocks/layout";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MeshProvider>
      <DefaultLayout>
        <Component {...pageProps} />
        <Toaster
          toastOptions={{
            style: {
              borderRadius: '8px',
              background: '#171717',
              color: '#e5e5e5',
              position: 'relative',
              borderColor: '#262626',
              borderWidth: 1,

              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              padding: '16px'
            },
          }}
        />
      </DefaultLayout>
    </MeshProvider>
  );
}
