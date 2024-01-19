import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { CssBaseLine } from "smarthr-normalize-css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <CssBaseLine />
      <Component {...pageProps} />
    </>
  );
}