import "@/styles/globals.css";
import "@/styles/custom-calendar.css";
import "@/styles/custom-react-terminal-ui.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
