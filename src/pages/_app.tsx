import "@/styles/globals.css";
import "@meshsdk/react/styles.css";
import type { AppProps } from "next/app";
import { MeshProvider } from "@meshsdk/react";
import DefaultLayout from "@/blocks/layout";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MeshProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <DefaultLayout>
          <Component {...pageProps} />
          <Toaster/>
        </DefaultLayout>
      </ThemeProvider>
    </MeshProvider>
  );
}
