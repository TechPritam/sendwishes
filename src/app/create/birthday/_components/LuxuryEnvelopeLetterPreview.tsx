"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Cinzel, Edu_NSW_ACT_Cursive, Montserrat } from "next/font/google";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "700"] });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["300", "600"] });
const eduCursive = Edu_NSW_ACT_Cursive({
  subsets: ["latin"],
  weight: ["400", "700"],
  adjustFontFallback: false,
});

type Stage = "closed" | "open" | "extracted" | "focused";

export type LuxuryEnvelopeLetterPreviewProps = {
  message: string;
  reduceMotion?: boolean;
  autoStart?: boolean;
};

export function LuxuryEnvelopeLetterPreview({ message, reduceMotion = false, autoStart = true }: LuxuryEnvelopeLetterPreviewProps) {
  const safeMessage = useMemo(() => message ?? "", [message]);
  const [stage, setStage] = useState<Stage>("closed");
  const [typed, setTyped] = useState("");
  const timersRef = useRef<number[]>([]);

  const clearTimers = () => {
    for (const t of timersRef.current) window.clearTimeout(t);
    timersRef.current = [];
  };

  const schedule = (fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timersRef.current.push(id);
  };

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, []);

  useEffect(() => {
    if (!autoStart) return;
    clearTimers();
    setStage("closed");
    setTyped("");

    if (reduceMotion) {
      setStage("focused");
      return;
    }

    schedule(() => setStage("open"), 800);
    schedule(() => setStage("extracted"), 1500);
    schedule(() => setStage("focused"), 2400);
  }, [autoStart, reduceMotion]);

  useEffect(() => {
    if (stage !== "focused") return;

    setTyped("");
    if (reduceMotion) {
      setTyped(safeMessage);
      return;
    }

    let i = 0;
    const interval = window.setInterval(() => {
      i += 1;
      setTyped(safeMessage.slice(0, i));
      if (i >= safeMessage.length) window.clearInterval(interval);
    }, 30);

    return () => window.clearInterval(interval);
  }, [reduceMotion, safeMessage, stage]);

  const isOpen = stage === "open" || stage === "extracted" || stage === "focused";
  const isExtracted = stage === "extracted" || stage === "focused";
  const isFocused = stage === "focused";

  return (
    <div className={montserrat.className + " absolute inset-0 z-20 overflow-hidden"} data-testid="lux-preview-stage">
      <div className="absolute inset-0" style={{ perspective: "2000px" }}>
        <motion.div
          className="absolute inset-0 z-10 flex items-center justify-center px-4 py-8"
          initial={false}
          animate={{ opacity: isExtracted ? 1 : 0 }}
          transition={{ duration: reduceMotion ? 0.15 : 0.6, ease: [0.19, 1, 0.22, 1] }}
          style={{ pointerEvents: "none" }}
        >
          <motion.div
            initial={false}
            animate={
              isFocused
                ? { y: 0, scale: 1.02 }
                : isExtracted
                  ? { y: -22, scale: 0.98 }
                  : { y: 14, scale: 0.9 }
            }
            transition={{ duration: reduceMotion ? 0.2 : 1.1, ease: [0.19, 1, 0.22, 1] }}
            className="relative w-[min(92vw,320px)]"
          >
            <div
              className="relative h-[min(62dvh,420px)] w-full overflow-hidden rounded-md border border-amber-300/20 bg-[#fffdfa] px-5 py-7 shadow-2xl"
              style={{
                boxShadow: isFocused ? "0 30px 70px rgba(0,0,0,0.55)" : "0 10px 30px rgba(0,0,0,0.25)",
                background:
                  "linear-gradient(180deg, rgba(255,253,250,1) 0%, rgba(255,251,246,1) 60%, rgba(255,248,244,1) 100%)",
              }}
            >
              <div aria-hidden className="pointer-events-none absolute inset-3 rounded-md border border-amber-300/30 opacity-30" />

              <div className="relative z-10 flex h-full flex-col">
                <div className={cinzel.className + " mb-4 text-center text-[8px] tracking-[0.35em] text-amber-600/70"}>
                  PRIVATE CORRESPONDENCE
                </div>

                <div className="flex-1">
                  <div
                    className={
                      eduCursive.className +
                      " whitespace-pre-wrap break-words hyphens-auto text-center text-[14px] leading-[1.55] text-zinc-800"
                    }
                  >
                    {typed}
                  </div>
                </div>

                <div aria-hidden className="mt-4 text-center text-amber-500/40 text-xl">
                  ❧
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute left-1/2 top-1/2 z-20 h-[180px] w-[min(80vw,290px)] select-none"
          initial={false}
          style={{ x: "-50%", y: "-50%" }}
          animate={isFocused ? { y: 420, opacity: 0, x: "-50%" } : { y: "-50%", opacity: 1, x: "-50%" }}
          transition={{ duration: reduceMotion ? 0.25 : 1.2, ease: [0.19, 1, 0.22, 1] }}
        >
          <div
            className="absolute inset-0 rounded-[4px] bg-[#fffdfa] shadow-2xl"
            style={{
              boxShadow: "0 22px 46px rgba(0,0,0,0.55)",
              background: "linear-gradient(135deg, rgba(255,254,254,1) 0%, rgba(255,247,242,1) 100%)",
            }}
          />

          <div
            className="absolute inset-0 bg-white"
            style={{
              clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%, 50% 45%)",
              background: "linear-gradient(180deg, rgba(255,244,244,1) 0%, rgba(255,255,255,1) 100%)",
            }}
          />

          <motion.div
            className="absolute inset-0 origin-top"
            initial={false}
            animate={{ rotateX: isOpen ? 160 : 0 }}
            transition={{ duration: reduceMotion ? 0.25 : 1, ease: [0.19, 1, 0.22, 1] }}
            style={{
              clipPath: "polygon(0 0, 100% 0, 50% 60%)",
              background: "linear-gradient(180deg, rgba(255,237,249,1) 0%, rgba(247,230,226,1) 100%)",
              transformStyle: "preserve-3d",
            }}
          >
            <div
              className={
                "absolute left-1/2 top-[52%] flex h-[56px] w-[56px] -translate-x-1/2 items-center justify-center rounded-full border-2 border-amber-300 text-white shadow-2xl transition-opacity" +
                (isOpen ? " opacity-0" : " opacity-100")
              }
              style={{
                background: "linear-gradient(135deg, #8b0000, #5a0000)",
                boxShadow: "0 10px 18px rgba(0,0,0,0.45), inset 0 -3px 5px rgba(0,0,0,0.55)",
                fontSize: 24,
              }}
            >
              ❤
            </div>
          </motion.div>
        </motion.div>

        {stage === "closed" ? (
          <motion.p
            className={
              cinzel.className +
              " absolute inset-x-0 mx-auto w-[min(80vw,290px)] text-center text-[10px] uppercase tracking-widest text-white"
            }
            style={{ top: "calc(50% + 108px)" }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 0.6, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            A message for your heart. Tap to reveal.
          </motion.p>
        ) : null}
      </div>
    </div>
  );
}