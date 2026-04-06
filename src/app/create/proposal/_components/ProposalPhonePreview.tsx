"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import confetti from "canvas-confetti";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Play } from "lucide-react";

type ProposalPhonePreviewProps = {
  question: string;
  recipient?: "her" | "him";
  message?: string; // This is the personalized message
  yesText?: string;
  noText?: string;
  name?: string;    // Their name
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function ProposalPhonePreview({
  question,
  message,
  yesText = "Yes",
  noText = "No",
  name,
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
  const [isCrying, setIsCrying] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-demo pointer state
  const [pointerPos, setPointerPos] = useState<{ x: number; y: number }>({ x: 150, y: 400 });
  const [pointerTap, setPointerTap] = useState(0);

  const safeQuestion = useMemo(() => question.trim() || "Will you marry me?", [question]);
  const toName = useMemo(() => (name || "").trim(), [name]);
  const safeMessage = useMemo(() => message?.trim() || "I love you. Will you marry me?", [message]);

  // Audio Logic
  const playCryingSound = useCallback(() => {
    const audio = new Audio("/assets/cat-cryyy.mp3"); // 3s
    audio.volume = 0.4;
    audio.play().catch(() => {});
  }, []);

  const playHappySound = useCallback(() => {
    const audio = new Audio("/assets/happy-catt.mp3"); // 9s
    audio.volume = 0.5;
    audio.play().catch(() => {});
  }, []);

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
    []
  );

  const cuteNoMessages = useMemo(
    () => [
      "Nope? Are you suuure? 😳",
      "Try again… I dare you.",
      "The universe says: pick the pink one.",
      "No is on a coffee break.",
      "Your finger almost got it… almost.",
    ],
    []
  );

  const currentCuteMessage = useMemo(() => {
    if (cuteIndex < 0) return null;
    return cuteNoMessages[cuteIndex % cuteNoMessages.length] ?? null;
  }, [cuteIndex, cuteNoMessages]);

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
    setCuteIndex((prev) => (prev + 1) % cuteNoMessages.length);
  }, [cuteNoMessages.length]);

  const getElementCenter = (el: HTMLElement | null) => {
    const root = rootRef.current;
    if (!root || !el) return { x: 0, y: 0 };
    const rootRect = root.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    return {
      x: elRect.left - rootRect.left + elRect.width / 2,
      y: elRect.top - rootRect.top + elRect.height / 2,
    };
  };

  // Main Demo Sequence Loop
  useEffect(() => {
    let cancelled = false;

    async function runDemo() {
      if (reduceMotion || !isPlaying) return;

      while (!cancelled && isPlaying) {
        setAccepted(false);
        setGifIndex(0);
        setCuteIndex(-1);
        setIsCrying(false);
        setPointerPos({ x: 250, y: 450 });

        await new Promise((r) => setTimeout(r, 1500));

        const loops = 3;
        for (let i = 0; i < loops; i++) {
          if (cancelled || !isPlaying) return;

          const noCenter = getElementCenter(noButtonRef.current);
          setPointerPos(noCenter);
          await new Promise((r) => setTimeout(r, 500));
          
          setIsCrying(true);
          playCryingSound(); 
          moveNoButton();
          setPointerTap(p => p + 1);
          
          setPointerPos({ x: 50, y: 450 });
          await new Promise((r) => setTimeout(r, 3000)); // Wait for 3s cry audio
          
          setIsCrying(false);
          await new Promise((r) => setTimeout(r, 600));
        }

        if (cancelled || !isPlaying) return;
        const yesCenter = getElementCenter(yesButtonRef.current);
        setPointerPos(yesCenter);
        await new Promise((r) => setTimeout(r, 1000));
        
        setPointerTap(p => p + 1);
        onYes(); 
        playHappySound(); 

        await new Promise((r) => setTimeout(r, 10000)); // Wait for 9s happy audio
        
        // After celebration, stop playing to trigger the "Start Preview" overlay again
        setIsPlaying(false);
      }
    }

    runDemo();
    return () => { cancelled = true; };
  }, [moveNoButton, playCryingSound, playHappySound, reduceMotion, isPlaying]);

  useEffect(() => {
    if (!accepted) return;
    const t = window.setInterval(() => {
      setGifIndex((prev) => (prev + 1) % celebrationGifs.length);
    }, 2000);
    return () => window.clearInterval(t);
  }, [accepted, celebrationGifs.length]);

  const onYes = useCallback(() => {
    setAccepted(true);
    const confettiFn = confetti as unknown as {
      (opts: Record<string, unknown>): void;
      shapeFromText?: (opts: { text: string; scalar?: number }) => unknown;
    };
    const heartShape = confettiFn.shapeFromText ? confettiFn.shapeFromText({ text: "❤", scalar: 1.2 }) : undefined;
    confettiFn({
      particleCount: 80,
      spread: 70,
      origin: { x: 0.5, y: 0.4 },
      colors: ["#e11d48", "#fb7185", "#ffffff"],
      shapes: heartShape ? [heartShape] : undefined,
    });
  }, []);

  return (
    <div ref={rootRef} className="relative flex h-full flex-col overflow-hidden bg-rose-50/10">
      
      {/* Interaction Overlay to start/restart preview */}
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
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg group-hover:bg-rose-600 transition-colors">
                <Play className="h-6 w-6 fill-current" />
              </div>
              <span className="text-sm font-bold text-zinc-800 tracking-tight">
                {accepted ? "Watch Again" : "Start Preview"}
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Simulation Cursor */}
      {!reduceMotion && !accepted && isPlaying && (
        <motion.div
          className="pointer-events-none absolute z-40"
          animate={{ x: pointerPos.x, y: pointerPos.y }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        >
          <motion.div key={pointerTap} initial={{ scale: 1 }} animate={{ scale: [1, 0.7, 1] }} transition={{ duration: 0.2 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" className="drop-shadow-lg">
              <path d="M4 3l16 9-7 2 2 7-3 1-2-7-6 6z" fill="#111827" stroke="#fff" strokeWidth="1.5" />
            </svg>
          </motion.div>
        </motion.div>
      )}

      {!accepted ? (
        <div className="flex h-full flex-col items-center justify-center px-4 text-center">
          <div className="relative h-28 w-full flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.img
                key={isCrying ? "crying" : "innocent"}
                src={isCrying ? "/assets/banana-crying-cat.gif" : "/assets/5.act-innocent.gif"}
                alt={isCrying ? "Crying cat" : "Innocent cat"}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="h-full w-auto rounded-xl object-contain"
              />
            </AnimatePresence>
          </div>

          <div className="mt-4">
            <div className="text-xl font-bold text-rose-900 leading-tight" style={{ fontFamily: "var(--font-script)" }}>
              {safeQuestion}
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center gap-3 w-full">
            <button ref={yesButtonRef} type="button" className="inline-flex h-9 w-36 items-center justify-center rounded-full bg-gradient-to-r from-rose-600 to-pink-600 text-[10px] font-bold text-white shadow-md">
              {yesText}
            </button>

            <div ref={containerRef} className="relative h-10 w-36 overflow-hidden rounded-xl bg-white/10">
              <motion.button ref={noButtonRef} type="button" animate={{ x: noPos.x, y: noPos.y }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="absolute left-0 top-0 inline-flex h-9 items-center justify-center px-5 text-[10px] font-semibold text-rose-700 bg-white/80 rounded-full shadow-sm">
                {noText}
              </motion.button>
            </div>
          </div>

          <div className="h-10 mt-4 flex items-center justify-center px-6">
            <AnimatePresence mode="wait">
              {currentCuteMessage && (
                <motion.div key={currentCuteMessage} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-[10px] font-medium text-rose-600 text-center">
                  {currentCuteMessage}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <div className="flex h-full flex-col items-start justify-center px-6 py-8 overflow-y-auto custom-scrollbar">
          {/* Headline like Original */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-sm font-semibold text-rose-900 w-full text-center">
            I knew you {toName ? `${toName}` : ""} couldn&apos;t say No! <span className="text-rose-600 uppercase tracking-tighter">YES !!!</span>
          </motion.div>

          {/* Celebration GIF Box like Original */}
          <div className="mt-6 w-full rounded-[1.75rem] bg-white/30 backdrop-blur-2xl border border-white/40 shadow-xl shadow-rose-200/30 p-3 self-center">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-white/10">
              <AnimatePresence mode="wait">
                <motion.img
                  key={celebrationGifs[gifIndex]}
                  src={celebrationGifs[gifIndex]}
                  alt=""
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 h-full w-full object-contain"
                />
              </AnimatePresence>
            </div>
          </div>

          {/* Personalized Message Box like Original */}
          <div className="mt-6 w-full rounded-[1.75rem] bg-white/30 backdrop-blur-2xl border border-white/40 shadow-xl shadow-rose-200/30 p-5">
             <div className="text-xs text-zinc-500 font-semibold mb-1 uppercase tracking-wider">A message for you:</div>
             <div className="text-sm text-zinc-800 leading-relaxed font-medium italic">
               {safeMessage}
             </div>
          </div>

          <div className="mt-8 w-full text-center">
            <span className="text-[9px] font-black text-rose-300 uppercase tracking-widest animate-pulse">
              Simulation Replay soon...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}