"use client";

import confetti from "canvas-confetti";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type ProposalExperienceProps = {
  question?: string;
  recipient?: "her" | "him";
  message: string;
  yesText?: string;
  noText?: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function ProposalExperience({ question, recipient, message, yesText, noText }: ProposalExperienceProps) {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const noButtonRef = useRef<HTMLButtonElement | null>(null);
  const isFirstMount = useRef(true); 

  const [noPos, setNoPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [accepted, setAccepted] = useState(false);
  const [gifIndex, setGifIndex] = useState(0);
  const [cuteIndex, setCuteIndex] = useState(-1);
  const [isCrying, setIsCrying] = useState(false);

  const safeQuestion = useMemo(() => question?.trim() || "Will you marry me?", [question]);
  const safeMessage = useMemo(() => message.trim() || "I love you. Will you marry me?", [message]);
  const safeYesText = useMemo(() => yesText?.trim() || "Yes", [yesText]);
  const safeNoText = useMemo(() => noText?.trim() || "No", [noText]);

  const celebrationGifs = useMemo(
    () => [
      "/assets/happy-cat.gif",
      "/assets/dancing-cat-cat.gif",
      "/assets/bubu-dancing.gif",
       "/assets/chems.gif",
       "/assets/2.bunny-yes.gif",
      "/assets/4.bubu-rub-bubu-love-dudu.gif",
      "/assets/3.couple-bunny-dance.gif",
      "/assets/1.yess-yes.gif",
    ],
    [],
  );

  const cuteNoMessages = useMemo(
    () => [
      "Nope? Are you suuure? 😳",
      "That button is a little shy today…",
      "Oops—missed it by a whisker!",
      "Try again… I dare you.",
      "The universe says: pick the pink one.",
      "No is on a coffee break.",
      "Plot twist: only YES is clickable.",
      "Your finger almost got it… almost.",
      "Hehe—nice try.",
      "That’s adorable. Now click YES.",
    ],
    [],
  );

  const currentCuteMessage = useMemo(() => {
    if (cuteIndex < 0) return null;
    return cuteNoMessages[cuteIndex % cuteNoMessages.length] ?? null;
  }, [cuteIndex, cuteNoMessages]);

  const bumpCuteMessage = useCallback(() => {
    if (cuteNoMessages.length === 0) return;
    setCuteIndex((prev) => (prev + 1) % cuteNoMessages.length);
  }, [cuteNoMessages.length]);

  // Handle cat-cry.mp3 (When isCrying is true)
  useEffect(() => {
    if (isCrying) {
      const cryAudio = new Audio("/assets/cat-cryyy.mp3");
      cryAudio.play().catch(() => {});
      
      const timeout = setTimeout(() => setIsCrying(false), 3400);
      return () => clearTimeout(timeout);
    }
  }, [isCrying]);

  useEffect(() => {
    if (!accepted) return;
    if (celebrationGifs.length <= 1) return;
    const ms = reduceMotion ? 3200 : 2200;
    const t = window.setInterval(() => {
      setGifIndex((prev) => (prev + 1) % celebrationGifs.length);
    }, ms);
    return () => window.clearInterval(t);
  }, [accepted, celebrationGifs.length, reduceMotion]);

  const moveNoButton = useCallback((isInitial = false) => {
    const container = containerRef.current;
    const btn = noButtonRef.current;
    if (!container || !btn) return;

    const containerRect = container.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    const maxX = Math.max(0, containerRect.width - btnRect.width);
    const maxY = Math.max(0, containerRect.height - btnRect.height);

    const nextX = randomBetween(0, maxX);
    const nextY = randomBetween(0, maxY);

    setNoPos({ x: clamp(nextX, 0, maxX), y: clamp(nextY, 0, maxY) });
    
    if (!isInitial && !isFirstMount.current) {
      bumpCuteMessage();
      setIsCrying(true);
    }
  }, [bumpCuteMessage]);

  useEffect(() => {
    moveNoButton(true);
    const t = window.setTimeout(() => {
      isFirstMount.current = false;
    }, 150);
    return () => {
      window.clearTimeout(t);
      setIsCrying(false);
    };
  }, [moveNoButton]);

  function onYes() {
    setAccepted(true);
    setGifIndex(0);

    // Play happy-cat.mp3 twice
    const happyAudio = new Audio("/assets/happy-catt.mp3");
    let playCount = 0;
    const handleEnded = () => {
      playCount++;
      if (playCount < 2) {
        happyAudio.currentTime = 0;
        happyAudio.play().catch(() => {});
      }
    };
    happyAudio.addEventListener("ended", handleEnded);
    happyAudio.play().catch(() => {});

    const anyConfetti = confetti as any;
    const heartShape = anyConfetti.shapeFromText ? anyConfetti.shapeFromText({ text: "❤", scalar: 1.2 }) : undefined;
    const burst = (particleCount: number, spread: number, startVelocity: number) => {
      anyConfetti({
        particleCount, spread, startVelocity, scalar: 1, ticks: 260,
        origin: { x: 0.5, y: 0.42 },
        colors: ["#e11d48", "#fb7185", "#fda4af", "#ffffff"],
        shapes: heartShape ? [heartShape] : undefined,
      });
    };
    burst(160, 80, 48);
    window.setTimeout(() => burst(120, 120, 42), 160);
    window.setTimeout(() => burst(150, 100, 44), 520);
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10 sm:py-14">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="mx-auto w-full max-w-3xl"
      >
        <div className="bg-white/30 backdrop-blur-2xl rounded-[2.5rem] border border-white/40 shadow-2xl shadow-rose-200/50">
          <div className="p-6 sm:p-10">
            {!accepted ? (
              <div className="flex min-h-[80dvh] flex-col items-center justify-center text-center sm:min-h-0">
                
                <div className="relative h-[240px] w-full flex items-center justify-center overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={isCrying ? "crying" : "innocent"}
                      src={isCrying ? "/assets/banana-crying-cat.gif" : "/assets/5.act-innocent.gif"}
                      alt="Reaction GIF"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      className={`h-full w-auto rounded-3xl object-contain ${isCrying ? " " : " mr-6 "}`}
                    />
                  </AnimatePresence>
                </div>

                <div className="mt-6 text-4xl text-rose-900 sm:text-5xl" style={{ fontFamily: "var(--font-script)" }}>
                  {safeQuestion}
                </div>

                <div className="mt-3 text-sm text-zinc-600">(There’s only one correct answer.)</div>

                <div className="mt-10 flex w-full flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
                  <motion.button
                    type="button"
                    onClick={onYes}
                    whileHover={reduceMotion ? undefined : { scale: 1.04 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex h-12 min-w-[140px] items-center justify-center rounded-full bg-gradient-to-r from-rose-600 to-pink-600 px-8 text-base font-semibold text-white shadow-[0_0_20px_rgba(225,29,72,0.4)] transition-transform sm:w-auto"
                  >
                    {safeYesText}
                  </motion.button>

                  <div ref={containerRef} className="relative h-16 w-full max-w-[260px] overflow-hidden">
                    <motion.button
                      ref={noButtonRef}
                      layout
                      type="button"
                      onPointerEnter={() => moveNoButton()}
                      onPointerDown={() => moveNoButton()}
                      onFocus={() => moveNoButton()}
                      animate={{ x: noPos.x, y: noPos.y }}
                      transition={{ type: "spring", stiffness: 240, damping: 18, mass: 0.9 }}
                      className="absolute left-0 top-0 inline-flex h-12 items-center justify-center rounded-full bg-white/70 px-8 text-base font-semibold text-rose-700 ring-1 ring-white/40 backdrop-blur hover:bg-white/80"
                    >
                      {safeNoText}
                    </motion.button>
                  </div>
                </div>

                <div className="h-10">
                  <AnimatePresence mode="wait">
                    {currentCuteMessage && (
                      <motion.div
                        key={currentCuteMessage}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="mx-auto mt-5 max-w-xl text-sm font-medium text-rose-700"
                      >
                        {currentCuteMessage}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                <div className="text-3xl font-semibold text-rose-900 sm:text-4xl">
                  You said <span className="text-rose-700"> YES !!!</span>
                </div>
                <div className="mt-6 rounded-[2.25rem] bg-white/30 backdrop-blur-2xl border border-white/40 shadow-2xl shadow-rose-200/40 p-5 sm:p-6">
                  <div className="mt-4 relative aspect-[16/10] w-full overflow-hidden rounded-3xl ring-1 ring-white/40">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={celebrationGifs[gifIndex]}
                        src={celebrationGifs[gifIndex]}
                        alt="Celebration"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 h-full w-full object-contain bg-white/20"
                      />
                    </AnimatePresence>
                  </div>
                </div>
                <div className="mt-6 rounded-[2.25rem] bg-white/30 backdrop-blur-2xl border border-white/40 shadow-2xl shadow-rose-200/40 p-6 text-left">
                  <div className="mt-3 text-pretty text-base text-zinc-800 sm:text-lg">{safeMessage}</div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}