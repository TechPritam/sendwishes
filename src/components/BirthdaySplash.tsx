"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { PartyConfettiBackground } from "@/components/PartyConfettiBackground";
import { registerSendwishesMedia, unregisterSendwishesMedia } from "@/app/_components/PauseMediaOnBackground";

type BirthdaySplashProps = {
  gifSrc?: string;
  audioSrc?: string;
  fromName?: string;
  minGifMs?: number;
  onComplete?: () => void;
};

export function BirthdaySplash({
  gifSrc = "/assets/birthday-celebration.gif",
  audioSrc = "/assets/Yayyy.mp3",
  fromName,
  minGifMs,
  onComplete,
}: BirthdaySplashProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startedRef = useRef(false);
  const [needsGesture, setNeedsGesture] = useState(false);
  const [stage, setStage] = useState<"intro" | "gif">("intro");
  const completedRef = useRef(false);

  const debug = (...args: unknown[]) => {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.debug("[BirthdaySplash]", ...args);
    }
  };

  const ensureAudio = () => {
    if (audioRef.current) return audioRef.current;
    const a = new Audio(audioSrc);
    a.loop = false;
    a.preload = "auto";
    a.volume = 1;
    registerSendwishesMedia(a);
    audioRef.current = a;
    debug("audio created", { src: audioSrc });
    return a;
  };

  const attemptPlay = () => {
    const a = ensureAudio();
    if (!a) return;
    if (startedRef.current) return;
    startedRef.current = true;
    a.currentTime = 0;
    debug("attempt play", { stage, readyState: a.readyState, paused: a.paused });
    a.play().then(
      () => {
        debug("play ok");
        setNeedsGesture(false);
      },
      (err) => {
      debug("play blocked", { name: err?.name, message: err?.message });
      // Autoplay may be blocked; allow another attempt on user interaction.
      startedRef.current = false;
      setNeedsGesture(true);
    });
  };

  useEffect(() => {
    // Pre-create the audio so it can start instantly on user gesture.
    const a = ensureAudio();

    return () => {
      try {
        a.muted = true;
        a.pause();
        a.currentTime = 0;
      } catch {
        // ignore
      }
      unregisterSendwishesMedia(a);
      audioRef.current = null;
      startedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioSrc]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const pauseAudio = () => {
      const a = audioRef.current;
      if (!a) return;
      try {
        const prevMuted = a.muted;
        a.muted = true;
        a.pause();
        window.setTimeout(() => {
          try {
            if (!a.paused) return;
            a.muted = prevMuted;
          } catch {
            // ignore
          }
        }, 250);
      } catch {
        // ignore
      }

      try {
        if (typeof navigator !== "undefined" && "mediaSession" in navigator) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (navigator as any).mediaSession.playbackState = "paused";
        }
      } catch {
        // ignore
      }

      // Allow replay when the user comes back and interacts again.
      startedRef.current = false;
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        pauseAudio();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pagehide", pauseAudio);
    window.addEventListener("blur", pauseAudio);
    document.addEventListener("freeze" as unknown as "visibilitychange", pauseAudio);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide", pauseAudio);
      window.removeEventListener("blur", pauseAudio);
      document.removeEventListener("freeze" as unknown as "visibilitychange", pauseAudio);
    };
  }, []);

  useEffect(() => {
    if (stage !== "gif") return;
    completedRef.current = false;
    const a = ensureAudio();

    const reduceMotion =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fallbackMs = typeof minGifMs === "number" ? minGifMs : reduceMotion ? 500 : 3200;

    const complete = () => {
      if (completedRef.current) return;
      completedRef.current = true;
      debug("complete splash");
      onComplete?.();
    };

    const onEnded = () => {
      debug("audio ended");
      complete();
    };

    // If the audio file can't load at all, don't trap the user forever.
    let fallbackTimer: number | null = null;
    const onError = () => {
      debug("audio error; using fallback timer");
      if (fallbackTimer !== null) return;
      fallbackTimer = window.setTimeout(() => complete(), fallbackMs);
    };

    a.addEventListener("ended", onEnded);
    a.addEventListener("error", onError);

    // Try to start playback (best-effort). If blocked, the user can tap again.
    attemptPlay();

    return () => {
      a.removeEventListener("ended", onEnded);
      a.removeEventListener("error", onError);
      if (fallbackTimer !== null) window.clearTimeout(fallbackTimer);
    };
  }, [minGifMs, onComplete, stage]);

  const onInteract = () => {
    debug("user interaction", { stage });
    if (stage === "intro") setStage("gif");
    attemptPlay();
  };

  return (
    <div
      className="relative min-h-dvh w-full overflow-hidden"
      onPointerDownCapture={() => {
        onInteract();
      }}
      onClickCapture={() => {
        onInteract();
      }}
      onKeyDownCapture={() => {
        onInteract();
      }}
      tabIndex={-1}
    >
      {stage === "intro" ? (
        <div className="relative min-h-dvh w-full">
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-purple-950 to-black"
          />
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-[5] bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-fuchsia-500/30 via-pink-500/10 to-transparent"
          />
          <PartyConfettiBackground />
          <div className="relative z-10 flex min-h-dvh w-full items-center justify-center px-6 py-12">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="w-[min(92vw,520px)] rounded-3xl border border-white/15 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-xl"
            >
              <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-pink-100 backdrop-blur">
                A little surprise
              </div>
              <div className="text-balance text-2xl font-semibold text-white sm:text-3xl">
                {fromName?.trim() ? `${fromName.trim()} has made you a surprise` : "Someone special has made you a surprise"}
              </div>
              <div className="mt-3 text-sm text-white/75 sm:text-base">
                Tap to reveal it.
              </div>
              <div className="mt-7 inline-flex items-center justify-center rounded-full bg-pink-600 px-6 py-3 text-sm font-semibold text-white shadow-sm cursor-pointer">
                Tap to see 🫣💖
              </div>
              {/* <div className="mt-6 text-xs text-white/60">(Sound will play on the next screen)</div> */}
            </motion.div>
          </div>
        </div>
      ) : (
        <div className="relative min-h-dvh w-full">
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-purple-950 to-black"
          />
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-[5] bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-fuchsia-500/30 via-pink-500/10 to-transparent"
          />
          <PartyConfettiBackground />
          <div className="relative z-10 flex min-h-dvh w-full items-center justify-center px-6 py-10">
            <img
              src={gifSrc}
              alt="Birthday celebration"
              className="w-[min(92vw,520px)] select-none rounded-3xl border border-white/10 bg-white/5 shadow-2xl"
              draggable={false}
            />
          </div>
        </div>
      )}

      {/* {needsGesture ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-10 z-20 flex justify-center px-6">
          <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium text-white/85 backdrop-blur">
            Tap to enable sound
          </div>
        </div>
      ) : null} */}
    </div>
  );
}