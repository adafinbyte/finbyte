import "@/styles/globals.css";
import "@meshsdk/react/styles.css";
import type { AppProps } from "next/app";
import { MeshProvider } from "@meshsdk/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider defaultTheme='dark' attribute="class" enableSystem disableTransitionOnChange>
      <MeshProvider>
        <Toaster/>
        <Component {...pageProps} />
      </MeshProvider>
    </ThemeProvider>
  );
}
