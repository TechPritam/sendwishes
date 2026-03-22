"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { savePendingCheckout } from "@/lib/checkout";
import { MobilePreviewFrame } from "@/app/create/_components/MobilePreviewFrame";
import { ExperienceShell } from "@/app/create/_components/ExperienceShell";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Heart } from "lucide-react";
import confetti from "canvas-confetti";

function seededNumber(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function roundTo(n: number, digits: number) {
  return Number(n.toFixed(digits));
}

function ProposalPreviewBackground({ reduceMotion }: { reduceMotion: boolean }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const hearts = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => {
      const left = roundTo(seededNumber(i + 11) * 100, 3);
      const top = roundTo(38 + seededNumber(i + 99) * 55, 3);
      const drift = roundTo(10 + seededNumber(i + 77) * 18, 3);
      const size = Math.round(14 + seededNumber(i + 222) * 18);
      const duration = roundTo(7 + seededNumber(i + 333) * 7, 3);
      const delay = roundTo(seededNumber(i + 444) * 1.8, 3);
      const opacityPeak = roundTo(0.25 + seededNumber(i + 555) * 0.35, 3);
      const rotateBase = roundTo(-18 + seededNumber(i + 666) * 36, 3);
      return { id: i, left, top, drift, size, duration, delay, opacityPeak, rotateBase };
    });
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(244,114,182,0.32), transparent 58%)," +
            "radial-gradient(circle at 85% 30%, rgba(251,113,133,0.26), transparent 56%)," +
            "radial-gradient(circle at 45% 88%, rgba(253,164,175,0.30), transparent 60%)," +
            "linear-gradient(135deg, rgba(255,241,242,0.85), rgba(252,231,243,0.78), rgba(254,202,202,0.82))",
        }}
      />

      {/* Avoid SSR hydration mismatch by only rendering the animated layer after mount. */}
      {mounted ? (
        reduceMotion ? (
          hearts.slice(0, 10).map((h) => (
            <div
              key={h.id}
              className="absolute text-rose-500/30"
              style={{ left: `${h.left}%`, top: `${h.top}%` }}
            >
              <Heart size={h.size} fill="currentColor" />
            </div>
          ))
        ) : (
          hearts.map((h) => (
            <motion.div
              key={h.id}
              className="absolute text-rose-500/40"
              style={{ left: `${h.left}%`, top: `${h.top}%` }}
              initial={{ y: 120, opacity: 0, rotate: h.rotateBase }}
              animate={{
                y: -260,
                opacity: [0, h.opacityPeak, h.opacityPeak, 0],
                x: [0, h.drift, -roundTo(h.drift * 0.6, 3), 0],
                rotate: [h.rotateBase, roundTo(h.rotateBase + 10, 3), roundTo(h.rotateBase - 8, 3), roundTo(h.rotateBase + 6, 3)],
              }}
              transition={{
                duration: h.duration,
                delay: h.delay,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <Heart size={h.size} fill="currentColor" className="drop-shadow-sm" />
            </motion.div>
          ))
        )
      ) : null}

      <div className="absolute inset-0 bg-white/10" />
    </div>
  );
}

export function ProposalCreate() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [question, setQuestion] = useState<string>("Will you marry me?");
  const [recipient, setRecipient] = useState<"her" | "him">("her");
  const [message, setMessage] = useState<string>(
    "I knew you couldn't say no! (Actually, I didn't give you a choice... but still!)",
  );
  const [yesText, setYesText] = useState<string>("Yes");
  const [noText, setNoText] = useState<string>("No");

  // Preview-only interaction state
  const previewRootRef = useRef<HTMLDivElement | null>(null);
  const previewContainerRef = useRef<HTMLDivElement | null>(null);
  const previewYesButtonRef = useRef<HTMLButtonElement | null>(null);
  const previewNoButtonRef = useRef<HTMLButtonElement | null>(null);
  const previewConfettiCanvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const [previewNoPos, setPreviewNoPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [previewAccepted, setPreviewAccepted] = useState(false);
  const [previewGifIndex, setPreviewGifIndex] = useState(0);
  const [previewCuteIndex, setPreviewCuteIndex] = useState(-1);

  const [pointerPos, setPointerPos] = useState<{ x: number; y: number }>({ x: 16, y: 16 });
  const [pointerTarget, setPointerTarget] = useState<"no" | "yes">("no");
  const [pointerTap, setPointerTap] = useState(0);

  const canContinue = useMemo(() => {
    return (
      question.trim().length > 0 &&
      message.trim().length > 0 &&
      yesText.trim().length > 0 &&
      noText.trim().length > 0
    );
  }, [message, noText, question, yesText]);

  const previewGifs = useMemo(
    () => [
      "/assets/1.yess-yes.gif",
      "/assets/2.bunny-yes.gif",
      "/assets/3.couple-bunny-dance.gif",
      "/assets/4.bubu-rub-bubu-love-dudu.gif",
    ],
    [],
  );

  const previewCuteNoMessages = useMemo(
    () => [
      "Nope? Are you suuure? 😳",
      "That button is a little shy today…",
      "Oops—missed it by a whisker!",
      "Try again… I dare you.",
      "The universe says: pick the pink one.",
      "No is on a coffee break.",
      "Plot twist: only YES is clickable.",
      "Hehe—nice try.",
      "That’s adorable. Now click YES.",
    ],
    [],
  );

  const currentPreviewCuteMessage = useMemo(() => {
    if (previewCuteIndex < 0) return null;
    return previewCuteNoMessages[previewCuteIndex % previewCuteNoMessages.length] ?? null;
  }, [previewCuteIndex, previewCuteNoMessages]);

  const bumpPreviewCuteMessage = useCallback(() => {
    if (previewCuteNoMessages.length === 0) return;
    setPreviewCuteIndex((prev) => (prev + 1) % previewCuteNoMessages.length);
  }, [previewCuteNoMessages.length]);

  const movePreviewNoButton = useCallback(() => {
    const container = previewContainerRef.current;
    const btn = previewNoButtonRef.current;
    if (!container || !btn) return;

    const containerRect = container.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    const maxX = Math.max(0, containerRect.width - btnRect.width);
    const maxY = Math.max(0, containerRect.height - btnRect.height);

    const nextX = Math.random() * maxX;
    const nextY = Math.random() * maxY;

    setPreviewNoPos({ x: nextX, y: nextY });
    bumpPreviewCuteMessage();
  }, [bumpPreviewCuteMessage]);

  const computePointerPos = useCallback(() => {
    const root = previewRootRef.current;
    const el = pointerTarget === "yes" ? previewYesButtonRef.current : previewNoButtonRef.current;
    
    if (!root || !el) return;
    
    const rootRect = root.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    const x = elRect.left - rootRect.left + elRect.width / 2;
    const y = elRect.top - rootRect.top + elRect.height / 2;
    
    setPointerPos({ x, y });
  }, [pointerTarget]);

  useEffect(() => {
    const t = window.setTimeout(() => movePreviewNoButton(), 80);
    return () => window.clearTimeout(t);
  }, [movePreviewNoButton]);

  useEffect(() => {
    computePointerPos();
    const t = window.setTimeout(() => computePointerPos(), 50);
    return () => window.clearTimeout(t);
  }, [computePointerPos, previewNoPos, previewAccepted, message, yesText, noText]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      while (!cancelled) {
        setPreviewAccepted(false);
        setPreviewGifIndex(0);
        setPreviewCuteIndex(-1);
        setPointerTarget("no");
        
        await new Promise((r) => window.setTimeout(r, 1000));

        const tries = 4;
        for (let i = 0; i < tries; i += 1) {
          if (cancelled) return;
          setPointerTarget("no");
          await new Promise((r) => window.setTimeout(r, 400));
          if (cancelled) return;
          setPointerTap((n) => n + 1);
          movePreviewNoButton();
          await new Promise((r) => window.setTimeout(r, reduceMotion ? 950 : 780));
        }

        if (cancelled) return;
        setPointerTarget("yes");
        await new Promise((r) => window.setTimeout(r, reduceMotion ? 800 : 600));
        
        if (cancelled) return;
        setPointerTap((n) => n + 1);
        setPreviewAccepted(true);

        // Preview celebration duration
        await new Promise((r) => window.setTimeout(r, 6000));
      }
    }

    run();
    return () => { cancelled = true; };
  }, [movePreviewNoButton, reduceMotion]);

  useEffect(() => {
    if (!previewAccepted) return;
    const ms = reduceMotion ? 3200 : 2200;
    const t = window.setInterval(() => {
      setPreviewGifIndex((prev) => (prev + 1) % previewGifs.length);
    }, ms);
    return () => window.clearInterval(t);
  }, [previewAccepted, previewGifs.length, reduceMotion]);

  useEffect(() => {
    if (!previewAccepted) return;
    if (reduceMotion) return;

    const canvas = previewConfettiCanvasRef.current;
    if (!canvas) return;

    const instance = confetti.create(canvas, { resize: true, useWorker: true });

    const anyConfetti = instance as unknown as {
      (opts: Record<string, unknown>): void;
      shapeFromText?: (opts: { text: string; scalar?: number }) => unknown;
    };

    const sparkle = anyConfetti.shapeFromText
      ? anyConfetti.shapeFromText({ text: "✨", scalar: 1.15 })
      : undefined;

    const burst = (particleCount: number, spread: number, startVelocity: number) => {
      anyConfetti({
        particleCount,
        spread,
        startVelocity,
        ticks: 160,
        scalar: 0.85,
        origin: { x: 0.5, y: 0.45 },
        colors: ["#e11d48", "#fb7185", "#fda4af", "#ffffff"],
        shapes: sparkle ? [sparkle] : ["circle", "square"],
        gravity: 1.1,
        drift: 0,
      });
    };

    burst(70, 72, 34);
    window.setTimeout(() => burst(55, 110, 28), 160);
    window.setTimeout(() => burst(65, 90, 32), 520);
  }, [previewAccepted, reduceMotion]);

  const inputClass = "glass-input mt-2 w-full shadow-inner shadow-rose-200/40 focus:ring-rose-400";

  return (
    <ExperienceShell variant="proposal">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="mx-auto w-full max-w-5xl px-6 sm:py-14"
      >
        <header className="mx-auto max-w-3xl text-center">
          <p className="glass-pill inline-flex items-center gap-2 text-sm text-rose-700">
            <span className="text-base">♥</span>
            Create a Proposal
          </p>
          <h1 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
            A tiny game. A big YES.
          </h1>
          <p className="mt-3 text-pretty text-sm text-zinc-600 sm:text-base">
            Preview it live as you customize the message + buttons.
          </p>
        </header>

        <div className="mx-auto mt-8 grid w-full max-w-5xl gap-12 lg:grid-cols-2">
          {/* LEFT SIDE: CONTROLS */}
          <div className="order-2 glass-card p-6 sm:p-8 lg:order-1">
              <div className="glass-panel bg-white/60 p-5">
                <div className="text-sm font-semibold text-zinc-900">What you’re creating</div>
                <div className="mt-2 text-sm text-zinc-700">
                  A playful proposal experience with customizable “Yes/No” buttons.
                  After payment, you’ll get a unique link you can share.
                </div>
              </div>

              <div className="mt-6 grid gap-5">
                <div>
                  <label htmlFor="question" className="text-sm font-medium text-zinc-800">
                    Your question
                  </label>
                  <input
                    id="question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className={inputClass}
                    placeholder="e.g. Will you be mine forever?"
                  />
                </div>

                <div>
                  <label htmlFor="recipient" className="text-sm font-medium text-zinc-800">
                    For
                  </label>
                  <select
                    id="recipient"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value === "him" ? "him" : "her")}
                    className={inputClass}
                  >
                    <option value="her">Her</option>
                    <option value="him">Him</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="text-sm font-medium text-zinc-800">
                    Your message (shown after “Yes”)
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={inputClass + " resize-none"}
                    placeholder="Write something heartfelt…"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="yesText" className="text-sm font-medium text-zinc-800">
                      “Yes” button text
                    </label>
                    <input
                      id="yesText"
                      value={yesText}
                      onChange={(e) => setYesText(e.target.value)}
                      className={inputClass}
                      placeholder="Yes"
                    />
                  </div>

                  <div>
                    <label htmlFor="noText" className="text-sm font-medium text-zinc-800">
                      “No” button text
                    </label>
                    <input
                      id="noText"
                      value={noText}
                      onChange={(e) => setNoText(e.target.value)}
                      className={inputClass}
                      placeholder="No"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  disabled={!canContinue}
                  onClick={() => {
                    if (!canContinue) return;
                    savePendingCheckout({
                      type: "proposal",
                      question: question.trim(),
                      recipient,
                      message: message.trim(),
                      yesText: yesText.trim(),
                      noText: noText.trim(),
                      photoUrl: null,
                      returnTo: "/create/proposal",
                    });
                    router.push("/payment");
                  }}
                  className="inline-flex h-11 w-full items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-pink-600 px-7 text-sm font-semibold text-white shadow-[0_0_18px_rgba(255,255,255,0.55)] transition-all hover:brightness-105 hover:animate-bounce disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  Create Magic for ₹99
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="glass-pill inline-flex h-11 w-full items-center justify-center px-7 text-sm font-semibold text-rose-700 transition-colors hover:bg-white/80 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* RIGHT SIDE: LIVE PREVIEW */}
            <div className="order-1 lg:order-2">
              <MobilePreviewFrame
                title="Proposal"
                subtitle="Live preview"
                background={<ProposalPreviewBackground reduceMotion={Boolean(reduceMotion)} />}
              >
                <div ref={previewRootRef} className="relative flex h-full flex-col overflow-hidden">
                <canvas
                  ref={previewConfettiCanvasRef}
                  className="pointer-events-none absolute inset-0 z-20"
                  aria-hidden
                />
                
                {/* POINTER (Vanishes when accepted) */}
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute z-30"
                  animate={{ 
                    x: pointerPos.x, 
                    y: pointerPos.y, 
                    opacity: previewAccepted ? 0 : 1 
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 30,
                    opacity: { duration: 0.2 } 
                  }}
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
                        <path d="M4 3l16 9-7 2 2 7-3 1-2-7-6 6z" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinejoin="round" />
                      </svg>
                    </motion.div>
                  ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" className="drop-shadow-md">
                      <path d="M4 3l16 9-7 2 2 7-3 1-2-7-6 6z" fill="#111827" />
                      <path d="M4 3l16 9-7 2 2 7-3 1-2-7-6 6z" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinejoin="round" />
                    </svg>
                  )}
                </motion.div>

                {!previewAccepted ? (
                  <div className="flex h-full flex-col items-center justify-center px-4 text-center">
                    <motion.img
                      src="/assets/5.act-innocent.gif"
                      alt="Cute reaction"
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="glass-soft mx-auto h-24 w-24 object-contain"
                    />

                    <div className="mt-4 w-full">
                      <div
                        className="text-2xl text-rose-900"
                        style={{ fontFamily: "var(--font-script)" }}
                      >
                        {question.trim() || "Will you marry me?"}
                      </div>
                      <div className="mt-1 text-[10px] text-zinc-500 italic">Select your answer...</div>
                    </div>

                    <div className="mt-6 flex items-center justify-center gap-3">
                      <button
                        ref={previewYesButtonRef}
                        type="button"
                        onClick={() => {
                          setPreviewAccepted(true);
                          setPreviewGifIndex(0);
                        }}
                        className="inline-flex h-10 items-center justify-center rounded-full bg-gradient-to-r from-rose-600 to-pink-600 px-6 text-xs font-bold text-white shadow-md transition-all active:scale-95"
                      >
                        {yesText.trim() || "Yes"}
                      </button>

                      <div ref={previewContainerRef} className="relative h-12 w-32">
                        <motion.button
                          ref={previewNoButtonRef}
                          type="button"
                          onPointerEnter={movePreviewNoButton}
                          animate={{ x: previewNoPos.x, y: previewNoPos.y }}
                          transition={{ type: "spring", stiffness: 520, damping: 22 }}
                          className="glass-pill absolute left-0 top-0 inline-flex h-10 items-center justify-center px-6 text-xs font-semibold text-rose-700"
                        >
                          {noText.trim() || "No"}
                        </motion.button>
                      </div>
                    </div>

                    <AnimatePresence mode="wait">
                      {currentPreviewCuteMessage ? (
                        <motion.div
                          key={currentPreviewCuteMessage}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="mt-4 text-center text-[11px] font-medium text-rose-600"
                        >
                          {currentPreviewCuteMessage}
                        </motion.div>
                      ) : (
                        <div className="h-4 mt-4" />
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  /* CELEBRATION STATE (Shows message here) */
                  <div className="flex flex-col items-center justify-center h-full px-4 text-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-base font-bold text-zinc-900"
                    >
                      {/* {recipient === "him" ? "He" : "She"} said{" "} */}
                      <span className="text-rose-600">You said YES!</span> ♥
                    </motion.div>

                    <div className="glass-panel mt-4 relative aspect-square w-full max-w-[200px] overflow-hidden ring-rose-200">
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={previewGifs[previewGifIndex]}
                          src={previewGifs[previewGifIndex]}
                          alt="Celebration"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      </AnimatePresence>
                    </div>

                    {/* MOVED: After "Yes" message now appears here! */}
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="glass-panel mt-6 w-full bg-white/60 p-4 ring-rose-200"
                    >
                      <div className="text-[10px] uppercase font-bold text-rose-500 mb-1 tracking-wider">Your Message</div>
                      <div className="text-xs text-zinc-800 leading-relaxed italic">
                        {message.trim() || "Your beautiful message goes here..."}
                      </div>
                    </motion.div>
                  </div>
                )}
                </div>
              </MobilePreviewFrame>
            </div>
        </div>
      </motion.div>
    </ExperienceShell>
  );
}