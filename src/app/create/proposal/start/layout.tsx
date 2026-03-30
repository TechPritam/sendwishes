import type { ReactNode } from "react";
import Head from "next/head";

// List of GIFs used in proposal experience
const proposalGifs = [
  "/assets/happy-cat.gif",
  "/assets/dancing-cat-cat.gif",
  "/assets/bubu-dancing.gif",
  "/assets/chems.gif",
  "/assets/2.bunny-yes.gif",
  "/assets/4.bubu-rub-bubu-love-dudu.gif",
  "/assets/3.couple-bunny-dance.gif",
  "/assets/1.yess-yes.gif",
  "/assets/banana-crying-cat.gif",
  "/assets/5.act-innocent.gif",
];

// List of music/audio files used in proposal experience
const proposalMusic = [
  "/assets/cat-cryyy.mp3",
  "/assets/happy-catt.mp3",
];

export default function ProposalLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Head>
        {proposalGifs.map((gif) => (
          <link key={gif} rel="preload" as="image" href={gif} />
        ))}
        {proposalMusic.map((music) => (
          <link key={music} rel="preload" as="audio" href={music} />
        ))}
      </Head>
      {children}
    </>
  );
}