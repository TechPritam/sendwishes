"use client";

import { useEffect, useMemo, useState } from "react";
import { Caveat, Montserrat } from "next/font/google";

const caveat = Caveat({ weight: ["400", "600"], subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["700"] });

type RichLetterCardProps = {
  message: string;
  reduceMotion?: boolean;
};

export function RichLetterCard({ message, reduceMotion = false }: RichLetterCardProps) {
  const safeMessage = useMemo(() => message?.trim() || "", [message]);
  const [typed, setTyped] = useState("");

  useEffect(() => {
    setTyped("");

    if (reduceMotion) {
      setTyped(safeMessage);
      return;
    }

    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setTyped(safeMessage.slice(0, i));
      if (i >= safeMessage.length) window.clearInterval(id);
    }, 55);

    return () => window.clearInterval(id);
  }, [reduceMotion, safeMessage]);

  return (
    <div className="mx-auto w-[min(92vw,420px)]">
      <div className="relative h-[min(72dvh,520px)] overflow-hidden rounded-3xl border border-rose-300/50 bg-gradient-to-b from-amber-50 to-rose-50 px-7 py-7 shadow-2xl">

        {/* inner frame */}
        <div aria-hidden className="pointer-events-none absolute inset-3 rounded-3xl ring-1 ring-rose-200/50" />

        {/* dog-ear */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 h-12 w-12 bg-white/50"
          style={{ clipPath: "polygon(0 0, 0 100%, 100% 100%)" }}
        />

        <div className="relative">
          <div className="mb-5 flex items-center gap-2 opacity-80">
            <div className="h-px flex-1 bg-rose-200/70" />
            <span className={montserrat.className + " text-[9px] uppercase tracking-widest text-rose-500/80"}>
              Hand-Delivered Correspondence
            </span>
            <div className="h-px flex-1 bg-rose-200/70" />
          </div>

          <div className={caveat.className + " whitespace-pre-wrap text-[16px] leading-[1.9] text-zinc-800 sm:text-2xl"} style={{ overflow: "hidden", maxHeight: "calc(min(72dvh, 520px) - 60px)" }}>
            {typed}
            {!reduceMotion && typed.length < safeMessage.length ? (
              <span className="ml-1 inline-block h-6 w-[2px] bg-rose-400 align-middle animate-pulse" />
            ) : null}
          </div>

          <div aria-hidden className="mt-6 text-center text-rose-300/60">
            ❧
          </div>
        </div>
      </div>
    </div>
  );
}
