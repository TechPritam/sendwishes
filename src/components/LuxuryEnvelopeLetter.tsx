"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Cinzel, Great_Vibes, Montserrat } from "next/font/google";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "700"] });
const greatVibes = Great_Vibes({ subsets: ["latin"], weight: ["400"] });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["300", "600"] });

export type LuxuryEnvelopeLetterProps = {
  message: string;
  reduceMotion?: boolean;
};

type Stage = "closed" | "open" | "extracted" | "focused";

export function LuxuryEnvelopeLetter({ message, reduceMotion = false }: LuxuryEnvelopeLetterProps) {
  const safeMessage = useMemo(() => message?.trim() ?? "", [message]);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    }, 45);

    return () => window.clearInterval(interval);
  }, [reduceMotion, safeMessage, stage]);

  const openSequence = () => {
    if (stage !== "closed") return;
    clearTimers();

    setStage("open");

    if (reduceMotion) {
      setStage("focused");
      return;
    }

    schedule(() => setStage("extracted"), 700);
    schedule(() => setStage("focused"), 1700);
  };

  const closeSequence = () => {
    if (stage === "closed") return;
    clearTimers();

    if (reduceMotion) {
      setStage("closed");
      setTyped("");
      return;
    }

    setStage("extracted");
    schedule(() => setStage("open"), 600);
    schedule(() => {
      setStage("closed");
      setTyped("");
    }, 1400);
  };

  const isOpen = stage === "open" || stage === "extracted" || stage === "focused";
  const isExtracted = stage === "extracted" || stage === "focused";
  const isFocused = stage === "focused";

  return (
    <div className={montserrat.className + " fixed inset-0 z-[120] overflow-hidden"} data-testid="lux-stage">
      <div
        className="absolute inset-0"
        style={{ perspective: "2000px" }}
      >
      {/* Close */}
      {isFocused ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            closeSequence();
          }}
          data-testid="lux-close"
          className={
            cinzel.className +
            " fixed right-5 top-5 z-[200] rounded-full border border-amber-300/30 bg-white/5 px-5 py-2 text-[11px] tracking-[0.25em] text-amber-200/90 backdrop-blur"
          }
        >
          CLOSE
        </button>
      ) : null}

      {/* Letter */}
      <motion.div
        className="absolute inset-0 z-[140] flex items-center justify-center px-4 py-10"
        initial={false}
        animate={{ opacity: isExtracted ? 1 : 0 }}
        transition={{ duration: reduceMotion ? 0.15 : 0.6, ease: [0.19, 1, 0.22, 1] }}
        style={{ pointerEvents: isExtracted ? "auto" : "none" }}
        data-testid="lux-letter-overlay"
      >
        <motion.div
          initial={false}
          animate={
            isFocused
              ? { y: 0, scale: 1.02 }
              : isExtracted
                ? { y: -30, scale: 0.98 }
                : { y: 20, scale: 0.9 }
          }
          transition={{ duration: reduceMotion ? 0.2 : 1.1, ease: [0.19, 1, 0.22, 1] }}
          className="relative w-[min(92vw,450px)]"
          data-testid="lux-letter"
        >
          <div
            className="relative h-[min(82dvh,580px)] w-full overflow-hidden rounded-md border border-amber-300/20 bg-[#fffdfa] px-6 py-9 shadow-2xl sm:px-7 sm:py-10"
            style={{
              boxShadow: isFocused ? "0 50px 100px rgba(0,0,0,0.55)" : "0 10px 30px rgba(0,0,0,0.25)",
              background:
                "linear-gradient(180deg, rgba(255,253,250,1) 0%, rgba(255,251,246,1) 60%, rgba(255,248,244,1) 100%)",
            }}
            data-testid="lux-letter-paper"
          >
            <div aria-hidden className="pointer-events-none absolute inset-3 rounded-md border border-amber-300/30 opacity-30" />

            <div className="relative z-10 flex h-full flex-col">
              <div className={cinzel.className + " mb-5 text-center text-[9px] tracking-[0.35em] text-amber-600/70"}>
                PRIVATE CORRESPONDENCE
              </div>

              <div className="flex-1">
                <div
                  className={
                    greatVibes.className +
                    " whitespace-pre-wrap text-center text-[clamp(1.15rem,2.9vh,1.65rem)] leading-[1.5] text-zinc-800"
                  }
                  data-testid="lux-letter-text"
                >
                  {typed}
                </div>
              </div>

              <div aria-hidden className="mt-5 text-center text-amber-500/40 text-2xl">
                ❧
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Envelope */}
      <motion.div
        // className="absolute left-[calc(7.333333%)] top-[calc(35%)] z-[150] h-[260px] w-[min(85vw,420px)] -translate-x-1/2 -translate-y-1/2 cursor-pointer select-none"
        // initial={false}
        // animate={
        //   isFocused
        //     ? { y: 600, opacity: 0 }
        //     : { y: 0, opacity: 1 }
        // }
        // transition={{ duration: reduceMotion ? 0.25 : 1.2, ease: [0.19, 1, 0.22, 1] }}
        // onClick={openSequence}
        // data-testid="lux-envelope"

                  className="absolute left-1/2 top-1/2 z-[150] h-[200px] w-[min(80vw,370px)] cursor-pointer select-none"
                  initial={false}
                  style={{ x: "-50%", y: "-50%" }} // Perfectly centers the element
                  animate={
                      isFocused
                          ? { y: 600, opacity: 0, x: "-50%" } // Maintain horizontal center during exit
                          : { y: "-50%", opacity: 1, x: "-50%" }
                  }
                  transition={{ duration: reduceMotion ? 0.25 : 1.2, ease: [0.19, 1, 0.22, 1] }}
                  onClick={openSequence}
                  data-testid="lux-envelope"
      >
        {/* base */}
        <div
          className="absolute inset-0 rounded-[4px] bg-[#fffdfa] shadow-2xl"
          style={{
            boxShadow: "0 30px 60px rgba(0,0,0,0.55)",
            background:
              "linear-gradient(135deg, rgba(255,254,254,1) 0%, rgba(255,247,242,1) 100%)",
          }}
        />

        {/* pocket */}
        <div
          className="absolute inset-0 bg-white"
          style={{
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%, 50% 45%)",
            background:
              "linear-gradient(180deg, rgba(255,244,244,1) 0%, rgba(255,255,255,1) 100%)",
          }}
        />

        {/* flap */}
        <motion.div
          className="absolute inset-0 origin-top"
          initial={false}
          animate={{ rotateX: isOpen ? 160 : 0 }}
          transition={{ duration: reduceMotion ? 0.25 : 1, ease: [0.19, 1, 0.22, 1] }}
          style={{
            clipPath: "polygon(0 0, 100% 0, 50% 60%)",
            background:
              "linear-gradient(180deg, rgba(255,237,249,1) 0%, rgba(247,230,226,1) 100%)",
            transformStyle: "preserve-3d",
          }}
          data-testid="lux-envelope-flap"
        >
          <div
            className={
              "absolute left-1/2 top-[52%] flex h-[65px] w-[65px] -translate-x-1/2 items-center justify-center rounded-full border-2 border-amber-300 text-white shadow-2xl transition-opacity" +
              (isOpen ? " opacity-0" : " opacity-100")
            }
            style={{
              background: "linear-gradient(135deg, #8b0000, #5a0000)",
              boxShadow: "0 10px 20px rgba(0,0,0,0.45), inset 0 -3px 5px rgba(0,0,0,0.55)",
              fontSize: 28,
            }}
            data-testid="lux-envelope-seal"
          >
            ❤
          </div>
        </motion.div>
      </motion.div>

      {stage === "closed" ? (
        <motion.p
          className={
            cinzel.className +
            " absolute left-1/2 w-[min(80vw,370px)] text-center text-[12px] uppercase tracking-widest text-white"
          }
          style={{ top: "calc(50% + 128px)", x: "-50%" }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.6, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 1.6, ease: [0.19, 1, 0.22, 1], delay: reduceMotion ? 0 : 0.25 }}
          data-testid="lux-envelope-caption"
        >
          A message for your heart. Tap to reveal.
        </motion.p>
      ) : null}
      </div>
    </div>
  );
}
