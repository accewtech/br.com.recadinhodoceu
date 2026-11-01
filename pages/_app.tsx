import type { AppProps } from "next/app";
import Head from "next/head";
import { DM_Sans, Geist_Mono, Playfair_Display } from "next/font/google";
import "../src/shared/globals.css";
import "../src/shared/message-card.css";
import "../src/v1/message-card.css";
import "../src/v2/message-card.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div
      className={`${dmSans.variable} ${playfairDisplay.variable} ${geistMono.variable} antialiased`}
    >
      <Head>
        <title>Recadinho do Céu</title>
        <meta name="description" content="Gere mensagens para compartilhar." />
      </Head>
      <Component {...pageProps} />
    </div>
  );
}
