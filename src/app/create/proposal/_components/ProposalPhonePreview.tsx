"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import confetti from "canvas-confetti";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type ProposalPhonePreviewProps = {
  question: string;
  recipient?: "her" | "him";
  message?: string;
  yesText?: string;
  noText?: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function ProposalPhonePreview({
  question,
  recipient = "her",
  yesText = "Yes",
  noText = "No",
}: ProposalPhonePreviewProps) {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const noButtonRef = useRef<HTMLButtonElement | null>(null);
  const yesButtonRef = useRef<HTMLButtonElement | null>(null);

  const [accepted, setAccepted] = useState(false);
  const [noPos, setNoPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [gifIndex, setGifIndex] = useState(0);
  const [cuteIndex, setCuteIndex] = useState(-1);

  const [pointerPos, setPointerPos] = useState<{ x: number; y: number }>({ x: 18, y: 18 });
  const [pointerTarget, setPointerTarget] = useState<"no" | "yes">("no");
  const [pointerTap, setPointerTap] = useState(0);

  const safeQuestion = useMemo(() => question.trim() || "Will you be mine forever?", [question]);

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

  const gifs = useMemo(
    () => [
      "/assets/1.yess-yes.gif",
      "/assets/2.bunny-yes.gif",
      "/assets/3.couple-bunny-dance.gif",
      "/assets/4.bubu-rub-bubu-love-dudu.gif",
    ],
    [],
  );

  const moveNoButton = useCallback(() => {
    const container = containerRef.current;
    const btn = noButtonRef.current;
    if (!container || !btn) return;

    const containerRect = container.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    const maxX = Math.max(0, containerRect.width - btnRect.width);
    const maxY = Math.max(0, containerRect.height - btnRect.height);

    const nextX = clamp(Math.random() * maxX, 0, maxX);
    const nextY = clamp(Math.random() * maxY, 0, maxY);

    setNoPos({ x: nextX, y: nextY });
    bumpCuteMessage();
  }, [bumpCuteMessage]);

  const computePointerPos = useCallback(() => {
    const root = rootRef.current;
    const el = pointerTarget === "yes" ? yesButtonRef.current : noButtonRef.current;
    if (!root || !el) return;

    const rootRect = root.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    const x = elRect.left - rootRect.left + elRect.width / 2;
    const y = elRect.top - rootRect.top + elRect.height / 2;
    setPointerPos({ x, y });
  }, [pointerTarget]);

  useEffect(() => {
    const t = window.setTimeout(() => moveNoButton(), 80);
    return () => window.clearTimeout(t);
  }, [moveNoButton]);

  useEffect(() => {
    computePointerPos();
    const t = window.setTimeout(() => computePointerPos(), 50);
    return () => window.clearTimeout(t);
  }, [computePointerPos, noPos, accepted, question, yesText, noText]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      // Only run the helper cursor loop when not reducing motion.
      // Keep it subtle for reduced-motion users.
      if (reduceMotion) return;

      while (!cancelled) {
        setAccepted(false);
        setGifIndex(0);
        setCuteIndex(-1);
        setPointerTarget("no");

        await new Promise((r) => window.setTimeout(r, 900));

        const tries = 4;
        for (let i = 0; i < tries; i += 1) {
          if (cancelled) return;
          setPointerTarget("no");
          await new Promise((r) => window.setTimeout(r, 380));
          if (cancelled) return;
          setPointerTap((n) => n + 1);
          moveNoButton();
          await new Promise((r) => window.setTimeout(r, 780));
        }

        if (cancelled) return;
        setPointerTarget("yes");
        await new Promise((r) => window.setTimeout(r, 600));
        if (cancelled) return;
        setPointerTap((n) => n + 1);
        setAccepted(true);

        await new Promise((r) => window.setTimeout(r, 5200));
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [moveNoButton, reduceMotion]);

  useEffect(() => {
    if (!accepted) return;
    const ms = reduceMotion ? 3200 : 2200;
    const t = window.setInterval(() => {
      setGifIndex((prev) => (prev + 1) % gifs.length);
    }, ms);
    return () => window.clearInterval(t);
  }, [accepted, gifs.length, reduceMotion]);

  const onYes = useCallback(() => {
    setAccepted(true);
    setGifIndex(0);

    if (reduceMotion) return;

    const anyConfetti = confetti as unknown as {
      (opts: Record<string, unknown>): void;
      shapeFromText?: (opts: { text: string; scalar?: number }) => unknown;
    };

    const heartShape = anyConfetti.shapeFromText
      ? anyConfetti.shapeFromText({ text: "❤", scalar: 1.1 })
      : undefined;

    anyConfetti({
      particleCount: 70,
      spread: 80,
      startVelocity: 34,
      ticks: 180,
      origin: { x: 0.5, y: 0.38 },
      colors: ["#e11d48", "#fb7185", "#fda4af", "#ffffff"],
      shapes: heartShape ? [heartShape] : undefined,
    });
  }, [reduceMotion]);

  return (
    <div ref={rootRef} className="relative flex h-full flex-col overflow-hidden">
      {/* Cursor helper (auto demo) */}
      {!reduceMotion ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute z-30"
          animate={{ x: pointerPos.x, y: pointerPos.y, opacity: accepted ? 0 : 1 }}
          transition={{ type: "spring", stiffness: 420, damping: 32, opacity: { duration: 0.2 } }}
        >
          {pointerTap ? (
            <motion.div
              key={pointerTap}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 0.85, 1] }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" className="drop-shadow-md">
                <path d="M4 3l16 9-7 2 2 7-3 1-2-7-6 6z" fill="#111827" />
                <path
                  d="M4 3l16 9-7 2 2 7-3 1-2-7-6 6z"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" className="drop-shadow-md">
              <path d="M4 3l16 9-7 2 2 7-3 1-2-7-6 6z" fill="#111827" />
              <path
                d="M4 3l16 9-7 2 2 7-3 1-2-7-6 6z"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </motion.div>
      ) : null}

      {!accepted ? (
        <div className="flex h-full flex-col items-center justify-center px-4 text-center">
          <motion.img
            src="/assets/5.act-innocent.gif"
            alt="Cute reaction"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-soft mx-auto h-24 w-24 object-contain"
          />

          <div className="mt-4 w-full">
            <div className="text-2xl text-rose-900" style={{ fontFamily: "var(--font-script)" }}>
              {safeQuestion}
            </div>
            <div className="mt-1 text-[10px] text-zinc-500 italic">Select your answer...</div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              ref={yesButtonRef}
              type="button"
              onClick={onYes}
              className="inline-flex h-10 items-center justify-center rounded-full bg-gradient-to-r from-rose-600 to-pink-600 px-6 text-xs font-bold text-white shadow-md transition-all active:scale-95"
            >
              {yesText.trim() || "Yes"}
            </button>

            <div ref={containerRef} className="relative h-12 w-32">
              <motion.button
                ref={noButtonRef}
                type="button"
                onPointerEnter={moveNoButton}
                onPointerDown={moveNoButton}
                onFocus={moveNoButton}
                animate={{ x: noPos.x, y: noPos.y }}
                transition={{ type: "spring", stiffness: 520, damping: 22 }}
                className="glass-pill absolute left-0 top-0 inline-flex h-10 items-center justify-center px-6 text-xs font-semibold text-rose-700"
              >
                {noText.trim() || "No"}
              </motion.button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {currentCuteMessage ? (
              <motion.div
                key={currentCuteMessage}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="mt-4 text-center text-[11px] font-medium text-rose-600"
              >
                {currentCuteMessage}
              </motion.div>
            ) : (
              <motion.div
                key="hint"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="mt-4 text-center text-[10px] text-zinc-500"
              >
                Try tapping “No”… if you can.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex h-full flex-col items-center justify-center px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-base font-bold text-zinc-900"
          >
            {/* {recipient === "him" ? "He" : "She"} said <span className="text-rose-600">YES!</span> ♥ */}
            <span className="text-rose-600"> You said Yes!</span>
          </motion.div>

          <div className="glass-panel mt-4 relative aspect-square w-full max-w-[200px] overflow-hidden ring-rose-200">
            <AnimatePresence mode="wait">
              <motion.img
                key={gifs[gifIndex]}
                src={gifs[gifIndex]}
                alt="Celebration"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={() => setAccepted(false)}
            className="mt-4 text-[11px] font-semibold text-rose-700 underline underline-offset-4"
          >
            Replay
          </button>
        </div>
      )}
    </div>
  );
}
