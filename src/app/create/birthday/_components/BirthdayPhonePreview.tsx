"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import confetti from "canvas-confetti";
import { Luckiest_Guy } from "next/font/google";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LuxuryEnvelopeLetterPreview } from "./LuxuryEnvelopeLetterPreview";
import { Play } from "lucide-react";

const luckiestGuy = Luckiest_Guy({ weight: "400", subsets: ["latin"] });

type Stage = "splash" | "gif" | "balloons" | "cake" | "envelope";

function wait(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export function BirthdayPhonePreview({ message, name }: { message?: string; name?: string } = {}) {
  const reduceMotion: boolean = useReducedMotion() ?? false;
  const words = useMemo(() => ["YOU", "ARE", "TOTALLY", "AWESOME!"], []);

  const [stage, setStage] = useState<Stage>("splash");
  const [isPlaying, setIsPlaying] = useState(false);
  const [splashTap, setSplashTap] = useState(0);
  const [readyToPop, setReadyToPop] = useState(false);
  const [popped, setPopped] = useState<boolean[]>(() => words.map(() => false));
  const [flame, setFlame] = useState<"lit" | "flicker" | "out">("lit");
  const [smokeKey, setSmokeKey] = useState(0);
  const [cutDone, setCutDone] = useState(false);
  const [showWind, setShowWind] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastPlaybackStageRef = useRef<Stage | null>(null);

  const yayRef = useRef<HTMLAudioElement | null>(null);
  const lastYayStageRef = useRef<Stage | null>(null);

  const cakeConfettiCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const attemptPlayMusic = useCallback(async () => {
    const a = audioRef.current;
    if (!a || !isPlaying) return;
    try {
      await a.play();
    } catch {
      // ignore
    }
  }, [isPlaying]);

  const attemptPlayYay = useCallback(async () => {
    const a = yayRef.current;
    if (!a || !isPlaying) return;
    try {
      a.currentTime = 0;
      await a.play();
    } catch {
      // ignore
    }
  }, [isPlaying]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const a = new Audio("/assets/hbd.mp3");
    a.loop = true;
    a.preload = "auto";
    a.volume = 0.35;
    audioRef.current = a;
    return () => {
      try {
        a.pause();
        a.currentTime = 0;
      } catch {
        // ignore
      }
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const a = new Audio("/assets/Yayyy.mp3");
    a.loop = false;
    a.preload = "auto";
    a.volume = 1;
    yayRef.current = a;
    return () => {
      try {
        a.pause();
        a.currentTime = 0;
      } catch {
        // ignore
      }
      yayRef.current = null;
    };
  }, []);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    if (!isPlaying || stage === "splash" || stage === "gif") {
      lastPlaybackStageRef.current = null;
      try {
        a.pause();
        a.currentTime = 0;
      } catch {
        // ignore
      }
      return;
    }

    if (stage === "balloons" || stage === "cake" || stage === "envelope") {
      if (lastPlaybackStageRef.current === stage) return;
      lastPlaybackStageRef.current = stage;
      const t = window.setTimeout(() => {
        attemptPlayMusic();
      }, 120);
      return () => window.clearTimeout(t);
    }
  }, [attemptPlayMusic, isPlaying, stage]);

  useEffect(() => {
    const a = yayRef.current;
    if (!a) return;

    if (!isPlaying || stage !== "gif") {
      lastYayStageRef.current = null;
      try {
        a.pause();
        a.currentTime = 0;
      } catch {
        // ignore
      }
      return;
    }

    if (lastYayStageRef.current === "gif") return;
    lastYayStageRef.current = "gif";
    const t = window.setTimeout(() => {
      attemptPlayYay();
    }, 80);
    return () => window.clearTimeout(t);
  }, [attemptPlayYay, isPlaying, stage]);

  const heartConfettiExplosion = useCallback(() => {
    if (typeof window === "undefined") return;
    if (reduceMotion) return;

    const canvas = cakeConfettiCanvasRef.current;
    const anyConfettiBase = confetti as unknown as {
      (opts: Record<string, unknown>): void;
      create?: (canvas: HTMLCanvasElement, opts?: Record<string, unknown>) => (opts: Record<string, unknown>) => void;
      shapeFromText?: (opts: { text: string; scalar?: number }) => unknown;
    };

    const confettiFn = canvas && anyConfettiBase.create
      ? anyConfettiBase.create(canvas, { useWorker: true })
      : (anyConfettiBase as unknown as (opts: Record<string, unknown>) => void);

    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width));
      const h = Math.max(1, Math.round(rect.height));
      if (canvas.width !== w) canvas.width = w;
      if (canvas.height !== h) canvas.height = h;
    }

    const heartShape = anyConfettiBase.shapeFromText
      ? anyConfettiBase.shapeFromText({ text: "❤", scalar: 1.15 })
      : undefined;

    const burst = (particleCount: number, spread: number, startVelocity: number, scalar: number) => {
      confettiFn({
        particleCount,
        spread,
        startVelocity,
        scalar,
        ticks: 180,
        origin: { x: 0.5, y: 0.58 },
        colors: ["#e11d48", "#fb7185", "#f472b6", "#a78bfa", "#ffffff"],
        shapes: heartShape ? [heartShape] : undefined,
      });
    };

    burst(120, 85, 42, 0.95);
    window.setTimeout(() => burst(90, 115, 38, 0.9), 180);
    window.setTimeout(() => burst(110, 105, 40, 0.92), 460);
  }, [reduceMotion]);

  useEffect(() => {
    if (stage !== "cake") return;
    if (flame !== "out") return;
    if (!cutDone) return;
    heartConfettiExplosion();
  }, [cutDone, flame, heartConfettiExplosion, stage]);

  useEffect(() => {
    let cancelled = false;

    async function runLoop() {
      if (!isPlaying) return;

      while (!cancelled && isPlaying) {
        setStage("splash");
        setSplashTap(0);
        setReadyToPop(false);
        setPopped(words.map(() => false));
        setFlame("lit");
        setSmokeKey(0);
        setCutDone(false);
        setShowWind(false);

        await wait(reduceMotion ? 700 : 1600);
        if (cancelled || !isPlaying) return;
        setSplashTap((n) => n + 1);
        await wait(reduceMotion ? 240 : 520);
        if (cancelled || !isPlaying) return;

        setStage("gif");
        await wait(reduceMotion ? 1100 : 4000);
        if (cancelled || !isPlaying) return;

        setStage("balloons");
        setReadyToPop(false);
        setPopped(words.map(() => false));
        await wait(reduceMotion ? 600 : 1400);
        if (cancelled || !isPlaying) return;
        setReadyToPop(true);
        attemptPlayMusic();

        const baseDelay = reduceMotion ? 160 : 900;
        const gap = reduceMotion ? 260 : 720;
        await wait(baseDelay);
        for (let i = 0; i < words.length; i += 1) {
          if (cancelled || !isPlaying) return;
          setPopped((prev) => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
          await wait(gap);
        }

        await wait(reduceMotion ? 260 : 1500);
        if (cancelled || !isPlaying) return;

        setStage("cake");
        setFlame("lit");
        setCutDone(false);
        setShowWind(false);
        await wait(reduceMotion ? 650 : 1500);
        if (cancelled || !isPlaying) return;

        setShowWind(true);
        setFlame("flicker");
        await wait(reduceMotion ? 180 : 1560);
        if (cancelled || !isPlaying) return;
        setFlame("out");
        setSmokeKey((k) => k + 1);
        await wait(reduceMotion ? 520 : 2700);
        if (cancelled || !isPlaying) return;
        await wait(reduceMotion ? 800 : 2500);
        if (cancelled || !isPlaying) return;

        setStage("envelope");
        await wait(reduceMotion ? 2200 : 11000);
        
        setIsPlaying(false);
      }
    }

    runLoop();
    return () => {
      cancelled = true;
    };
  }, [reduceMotion, words, isPlaying, attemptPlayMusic]);

  const letterMessage = useMemo(() => {
    if (typeof message === "string" && message.trim().length > 0) return message;

    return (
      "Dear my favorite human,\n\n" +
      "Happy Birthday! Today is your day — and you deserve the happiest surprises.\n" +
      "May this year bring you peace, big wins, and tiny moments that make you smile.\n" +
      "With love,\nSomeone who thinks you're totally awesome ❤"
    );
  }, [message]);

  return (
    <div
      className="relative flex h-full flex-col overflow-hidden"
      data-testid="birthday-phone-preview"
    >
      <AnimatePresence>
        {!isPlaying && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-[2px]"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsPlaying(true)}
              className="group flex flex-col items-center gap-3 bg-white/90 p-6 rounded-3xl shadow-2xl transition-all"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-500 text-white shadow-lg group-hover:bg-pink-600 transition-colors">
                <Play className="h-6 w-6 fill-current" />
              </div>
              <span className="text-sm font-bold text-zinc-800 tracking-tight">
                {readyToPop || cutDone ? "Watch Again" : "Start Preview"}
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {stage === "splash" ? (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex h-full items-center justify-center"
          >
            <div className="w-full px-2">
              <div className="w-full rounded-3xl border border-white/15 bg-white/10 p-5 text-center shadow-2xl backdrop-blur-xl">
                <div className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-semibold text-pink-100 backdrop-blur">
                  A little surprise
                </div>
                <div className="text-balance text-xl font-semibold text-white">
                  Someone special has made you a surprise
                </div>
                <div className="mt-2 text-sm text-white/75">Tap to reveal it.</div>

                <motion.div
                  key={splashTap}
                  initial={{ scale: 1 }}
                  animate={{ scale: splashTap ? [1, 0.96, 1] : 1 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="mt-5 inline-flex items-center justify-center rounded-full bg-pink-600 px-6 py-3 text-sm font-semibold text-white shadow-sm"
                >
                  Tap to see 🫣💖
                </motion.div>
              </div>
            </div>
          </motion.div>
        ) : null}

        {stage === "gif" ? (
          <motion.div
            key="gif"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex h-full items-center justify-center"
          >
            <img
              src="/assets/birthday-celebration.gif"
              alt="Birthday celebration"
              className="w-full select-none rounded-3xl border border-white/10 bg-white/5 shadow-2xl"
              draggable={false}
            />
          </motion.div>
        ) : null}

        {stage === "balloons" ? (
          <motion.div
            key="balloons"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex h-full flex-col items-center justify-center"
          >
            <div className="flex w-full flex-1 flex-col items-center justify-center text-center">
              {!readyToPop ? (
                <div className="w-full max-w-[320px] rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                  <div className="text-[10px] font-semibold tracking-wide text-pink-100/90">A surprise is waiting</div>
                  <div className="mt-2 text-balance text-base font-semibold text-white">Ready to pop the balloons?</div>
                  <div className="mt-4 inline-flex h-10 items-center justify-center rounded-full bg-pink-600 px-8 text-sm font-semibold text-white shadow-sm">
                    Yes
                  </div>
                </div>
              ) : (
                <AutoBalloonLine words={words} popped={popped} reduceMotion={reduceMotion} />
              )}
            </div>
          </motion.div>
        ) : null}

        {stage === "cake" ? (
          <motion.div
            key="cake"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative flex h-full flex-col items-center justify-center mt-10"
          >
            <div className="w-full rounded-3xl border border-white/15 bg-white/10 p-4 text-center backdrop-blur">
              <div className={luckiestGuy.className + " text-xl tracking-tight text-white"}>
                {name?.trim() ? `Happy Birthday, ${name.trim()}!` : "Happy Birthday!"}
              </div>
              <div className="mt-1 text-xs text-white/70">Blow the candles & cut the cake.</div>
            </div>

            <div className="relative mt-4 w-full flex-1 overflow-hidden">
              <CakeFrame>
                {flame === "out" ? (
                  cutDone ? null : (
                    <CakeCutStage reduceMotion={reduceMotion} smokeKey={smokeKey} onFinished={() => setCutDone(true)} />
                  )
                ) : (
                  <Cake flame={flame} smokeKey={smokeKey} reduceMotion={reduceMotion} />
                )}
              </CakeFrame>

              <canvas
                ref={cakeConfettiCanvasRef}
                aria-hidden
                className="pointer-events-none absolute inset-0 z-30"
                style={{ width: "100%", height: "100%" }}
              />

              {showWind && flame !== "lit" ? (
                <WindLines reduceMotion={reduceMotion} />
              ) : null}
            </div>
          </motion.div>
        ) : null}

        {stage === "envelope" ? (
          <motion.div
            key="envelope"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative flex h-full items-center justify-center"
          >
            <LuxuryEnvelopeLetterPreview message={letterMessage} reduceMotion={reduceMotion} autoStart />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function BalloonSvg({ base, deep }: { base: string; deep: string }) {
  const id = useMemo(() => Math.random().toString(36).slice(2), []);
  return (
    <svg width="92" height="128" viewBox="0 0 92 128" className="drop-shadow-[0_16px_30px_rgba(0,0,0,0.45)]">
      <defs>
        <linearGradient id={`g-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={base} />
          <stop offset="1" stopColor={deep} />
        </linearGradient>
        <radialGradient id={`s-${id}`} cx="30%" cy="22%" r="65%">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="0.4" stopColor="#ffffff" stopOpacity="0.18" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d="M46 96c-2 9-4 13-1 19 3 6 2 9-1 13" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="2" fill="none" />
      <path d="M42 88h8l-4 8z" fill="#ffffff" fillOpacity="0.65" />
      <path d="M46 10c-18 0-32 16-32 36 0 26 18 42 32 42s32-16 32-42C78 26 64 10 46 10z" fill={`url(#g-${id})`} />
      <ellipse cx="28" cy="26" rx="10" ry="16" fill="#ffffff" opacity="0.18" />
    </svg>
  );
}

function AutoBalloonLine({
  words,
  popped,
  reduceMotion,
}: {
  words: string[];
  popped: boolean[];
  reduceMotion: boolean;
}) {
  const palette = [
    { base: "#fb7185", deep: "#e11d48" },
    { base: "#a78bfa", deep: "#7c3aed" },
    { base: "#38bdf8", deep: "#0284c7" },
    { base: "#fbbf24", deep: "#f59e0b" },
  ];

  const slots = [
    { left: "12%", y: 18 },
    { left: "37%", y: -11 },
    { left: "62%", y: -11 },
    { left: "84%", y: 22 },
  ];

  return (
    <div className="relative mx-auto mt-6 h-[260px] w-full max-w-[520px] overflow-visible">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[146px] h-px w-[92%] -translate-x-1/2 bg-white/10"
        style={{ borderRadius: 9999 }}
      />

      {words.map((word, i) => {
        const c = palette[i % palette.length];
        const slot = slots[i] ?? slots[slots.length - 1];
        return (
          <div
            key={word + i}
            className="absolute top-[132px]"
            style={{ left: slot.left, transform: `translateX(-50%) translateY(${slot.y}px)` }}
          >
            <motion.div
              initial={{ y: 42, opacity: 1 }}
              animate={{ y: -92, opacity: 1 }}
              transition={{ duration: reduceMotion ? 0.35 : 1.6, ease: "easeOut" }}
              className="relative flex w-[110px] flex-col items-center justify-start"
            >
              {popped[i] ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className={
                    luckiestGuy.className +
                    " pointer-events-none absolute top-[-10px] z-0 -translate-x-1/2 text-center tracking-tight text-white drop-shadow " +
                    (i === words.length - 1 ? "text-base" : "text-lg")
                  }
                  style={{ left: i === words.length - 1 ? "29%" : "34%" }}
                >
                  {word}
                </motion.div>
              ) : null}

              <AnimatePresence>
                {!popped[i] ? (
                  <motion.div
                    key="balloon"
                    className="relative z-10"
                    initial={{ opacity: 1, scale: 1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.25 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                  >
                    <div className="flex items-center justify-center">
                      <BalloonSvg base={c.base} deep={c.deep} />
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

function CakeFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto w-[min(88vw,320px)]">
      <div className="relative w-full" style={{ aspectRatio: "320 / 260" }}>
        <div className="absolute inset-0 flex items-center justify-center">{children}</div>
      </div>
    </div>
  );
}

function CakeCutStage({
  reduceMotion,
  smokeKey,
  onFinished,
}: {
  reduceMotion: boolean;
  smokeKey: number;
  onFinished: () => void;
}) {
  const [split, setSplit] = useState(false);
  useEffect(() => {
    const splitMs = reduceMotion ? 180 : 1100;
    const doneMs = reduceMotion ? 520 : 2400;
    setSplit(false);
    const t1 = window.setTimeout(() => setSplit(true), splitMs);
    const t2 = window.setTimeout(() => onFinished(), doneMs);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [onFinished, reduceMotion]);

  return (
    <div className="relative h-full w-full">
      <motion.div
        className="absolute inset-0"
        style={{ clipPath: "inset(0 50% 0 0)" }}
        initial={false}
        animate={split ? { x: -120, rotate: -5, opacity: 0 } : { x: 0, rotate: 0, opacity: 1 }}
        transition={{ duration: reduceMotion ? 0.35 : 0.85, ease: "easeInOut" }}
      >
        <Cake flame="out" smokeKey={smokeKey} reduceMotion={reduceMotion} />
      </motion.div>
      <motion.div
        className="absolute inset-0"
        style={{ clipPath: "inset(0 0 0 50%)" }}
        initial={false}
        animate={split ? { x: 120, rotate: 5, opacity: 0 } : { x: 0, rotate: 0, opacity: 1 }}
        transition={{ duration: reduceMotion ? 0.35 : 0.85, ease: "easeInOut", delay: reduceMotion ? 0 : 0.05 }}
      >
        <Cake flame="out" smokeKey={smokeKey} reduceMotion={reduceMotion} />
      </motion.div>
    </div>
  );
}

function Cake({
  flame,
  smokeKey,
  reduceMotion,
}: {
  flame: "lit" | "flicker" | "out";
  smokeKey: number;
  reduceMotion: boolean;
}) {
  const lit = flame === "lit";
  const flicker = flame === "flicker";
  const candles = useMemo(
    () => [
      { id: 1, x: 121, baseY: 85, color: "#fb7185" },
      { id: 2, x: 141, baseY: 85, color: "#a78bfa" },
      { id: 3, x: 161, baseY: 85, color: "#fbbf24" },
      { id: 4, x: 181, baseY: 85, color: "#38bdf8" },
      { id: 5, x: 201, baseY: 85, color: "#34d399" },
    ],
    [],
  );

  const candleWidth = 4;
  const candleHeight = 56;

  return (
    <svg viewBox="0 -12 320 272" className="h-full w-full drop-shadow-2xl" preserveAspectRatio="xMidYMid meet">
      <image href="/assets/cake1.png" x="0" y="0" width="320" height="260" preserveAspectRatio="xMidYMid meet" />
      {candles.map((c, i) => {
        const bodyX = c.x - candleWidth / 2;
        const bodyY = c.baseY - candleHeight;
        const wickTopY = bodyY - 6;

        return (
          <g key={c.id}>
            <ellipse cx={c.x} cy={c.baseY + 2} rx={6} ry={2} fill="#000000" opacity={0.2} />
            <rect x={bodyX} y={bodyY} width={candleWidth} height={candleHeight} rx={2} fill={c.color} />
            <rect x={c.x - 0.5} y={wickTopY} width={1} height={6} fill="#111827" />

            <AnimatePresence>
              {(lit || flicker) ? (
                <motion.g
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: [1, 1.1, 1], y: [0, -2, 0] }}
                  exit={{ opacity: 0, scale: 0 }}
                  style={{ originX: `${c.x}px`, originY: `${wickTopY}px` }}
                >
                  <path
                    d={`M ${c.x} ${wickTopY} Q ${c.x + 7} ${wickTopY - 15} ${c.x} ${wickTopY - 25} Q ${c.x - 7} ${wickTopY - 15} ${c.x} ${wickTopY} Z`}
                    fill="#fbbf24"
                  />
                  <path
                    d={`M ${c.x} ${wickTopY - 2} Q ${c.x + 4} ${wickTopY - 10} ${c.x} ${wickTopY - 18} Q ${c.x - 4} ${wickTopY - 10} ${c.x} ${wickTopY - 2} Z`}
                    fill="#fb7185"
                    opacity="0.6"
                  />
                </motion.g>
              ) : null}
            </AnimatePresence>

            <AnimatePresence>
              {flame === "out" && smokeKey > 0 ? (
                <motion.g
                  key={`smoke-${smokeKey}-${c.id}`}
                  initial={{ opacity: 0, y: 0, scale: 0.9 }}
                  animate={{ opacity: [0, 0.35, 0], y: [0, -18], scale: [0.9, 1.15, 1.25] }}
                  transition={{ duration: reduceMotion ? 0.7 : 1.1, ease: "easeOut", delay: i * 0.04 }}
                >
                  <circle cx={c.x} cy={wickTopY - 12} r={7} fill="white" opacity={0.55} />
                  <circle cx={c.x + 6} cy={wickTopY - 18} r={5} fill="white" opacity={0.35} />
                  <circle cx={c.x - 6} cy={wickTopY - 20} r={4} fill="white" opacity={0.28} />
                </motion.g>
              ) : null}
            </AnimatePresence>
          </g>
        );
      })}
    </svg>
  );
}

function WindLines({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute left-0 right-0 top-[46%] z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <motion.svg
        viewBox="0 0 360 120"
        className="mx-auto h-16 w-full"
        preserveAspectRatio="xMidYMid meet"
        initial={false}
        animate={reduceMotion ? { x: 0 } : { x: [0, 6, 0] }}
        transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M10 55 C 70 20, 130 90, 200 55 S 310 40, 350 55" stroke="rgba(255,255,255,0.55)" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M20 78 C 85 45, 140 110, 215 76 S 305 66, 342 76" stroke="rgba(255,255,255,0.35)" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M12 34 C 70 6, 132 66, 198 34 S 300 18, 346 34" stroke="rgba(255,255,255,0.22)" strokeWidth="2" fill="none" strokeLinecap="round" />
      </motion.svg>
    </motion.div>
  );
}