"use client";

import confetti from "canvas-confetti";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Luckiest_Guy } from "next/font/google";
import { Volume2, VolumeX } from "lucide-react";

import { PartyConfettiBackground } from "@/components/PartyConfettiBackground";
import { LuxuryEnvelopeLetter } from "@/components/LuxuryEnvelopeLetter";
import { registerSendwishesMedia, unregisterSendwishesMedia } from "@/app/_components/PauseMediaOnBackground";

const luckiestGuy = Luckiest_Guy({ weight: "400", subsets: ["latin"] });

type AudioContextConstructor = typeof AudioContext;

function getAudioContextConstructor(): AudioContextConstructor | undefined {
  if (typeof window === "undefined") return undefined;
  const w = window as unknown as { webkitAudioContext?: AudioContextConstructor };
  return window.AudioContext || w.webkitAudioContext;
}

type VirtualBirthdayProps = {
  name: string;
  age?: number;
  cakeType?: string;
  photoUrl?: string | null;
  message?: string;
};

export function VirtualBirthday({ name, age, cakeType, photoUrl, message }: VirtualBirthdayProps) {
  const reduceMotion: boolean = useReducedMotion() ?? false;
  const [flame, setFlame] = useState<"lit" | "flicker" | "out">("lit");
  const [listening, setListening] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [candlePrimerStage, setCandlePrimerStage] = useState<"primer" | "cake">("primer");
  const [requestingMic, setRequestingMic] = useState(false);
  const [tapFallbackAvailable, setTapFallbackAvailable] = useState(false);
  const [smokeKey, setSmokeKey] = useState(0);
  const [cutDone, setCutDone] = useState(false);
  const [postBlowStage, setPostBlowStage] = useState<"smoke" | "cut">("smoke");
  const [muted, setMuted] = useState(false);
  const [musicRequested, setMusicRequested] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [readyToPop, setReadyToPop] = useState(false);
  const [popHoldDone, setPopHoldDone] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stopAfterPlayRef = useRef(false);
  const words = useMemo(() => ["YOU", "ARE", "TOTALLY", "AWESOME!"], []);
  const [popped, setPopped] = useState<boolean[]>(() => words.map(() => false));

  const allPopped = popped.every(Boolean);
  const readyForCake = allPopped && popHoldDone;
  const showCandlePrimer = readyForCake && candlePrimerStage !== "cake";

  const showEnvelopeLetter = readyForCake && flame === "out" && cutDone;
  const showBirthdayHeader = readyForCake && !showEnvelopeLetter && candlePrimerStage === "cake";
  const cardHeightClass = readyForCake
    ? "h-[90dvh] sm:h-auto sm:min-h-[680px]"
    : "h-auto";

  const heading = `Happy Birthday${name ? `, ${name}` : ""}!`;

  const defaultLetterMessage = useMemo(() => {
    const to = name?.trim() ? name.trim() : "my favorite human";
    return (
      `Dear ${to},\n\n` +
      `Today is your day — and I just want you to know how proud I am of you. ` +
      `You bring light, laughter, and comfort in a way that feels like home.\n` +
      `May this year surprise you with peace, big wins, and tiny moments that make you smile for no reason at all. ` +
      `Stay magical. Stay you.\n` +
      `With love,\nSomeone who thinks you're totally awesome ❤`
    );
  }, [name]);

  const letterMessage = useMemo(() => {
    if (typeof message === "string" && message.trim().length > 0) return message;
    return defaultLetterMessage;
  }, [defaultLetterMessage, message]);

  const attemptPlayMusic = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (muted) return;
    if (!musicRequested) return;
    a.play().catch(() => undefined);
  }, [muted, musicRequested]);

  const stopMusicAfterCurrentPlay = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (stopAfterPlayRef.current) return;
    stopAfterPlayRef.current = true;

    // Prevent any future replays from our code paths.
    setMusicRequested(false);

    try {
      // Let the current iteration finish, then stop.
      a.loop = false;
    } catch {
      // ignore
    }

    if (a.paused) {
      try {
        a.currentTime = 0;
      } catch {
        // ignore
      }
      return;
    }

    const onEnded = () => {
      try {
        a.pause();
        a.currentTime = 0;
      } catch {
        // ignore
      }
    };

    a.addEventListener("ended", onEnded, { once: true });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const a = new Audio("/assets/hbd.mp3");
    a.loop = true;
    a.preload = "auto";
    a.volume = 0.35;
    a.muted = muted;
    registerSendwishesMedia(a);
    audioRef.current = a;
    return () => {
      try { a.pause(); } catch { }
      unregisterSendwishesMedia(a);
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const pauseAudio = () => {
      const a = audioRef.current;
      if (!a) return;
      try {
        a.pause();
      } catch {
        // ignore
      }
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
    if (!readyToPop) return;
    if (typeof window === "undefined") return;

    // Reset balloons for a clean automated sequence.
    setPopped(words.map(() => false));
    setPopHoldDone(false);

    // Let the balloons finish their flight first, then pop one-by-one.
    const baseDelay = reduceMotion ? 250 : 1900;
    const gap = reduceMotion ? 420 : 1500;
    const timers: number[] = [];

    for (let i = 0; i < words.length; i += 1) {
      timers.push(
        window.setTimeout(() => {
          popBalloon(i);
        }, baseDelay + i * gap)
      );
    }

    return () => {
      for (const t of timers) window.clearTimeout(t);
    };
  }, [readyToPop, reduceMotion, words]);

  useEffect(() => {
    if (!allPopped) {
      setPopHoldDone(false);
      return;
    }
    const ms = reduceMotion ? 250 : 1500;
    const t = window.setTimeout(() => setPopHoldDone(true), ms);
    return () => window.clearTimeout(t);
  }, [allPopped, reduceMotion]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.muted = muted;
    if (muted) {
      a.pause();
      return;
    }
    if (hasInteracted && musicRequested) {
      attemptPlayMusic();
    }
  }, [attemptPlayMusic, hasInteracted, muted, musicRequested]);

  function playPop() {
    if (typeof window === "undefined") return;
    try {
      const AudioCtx = getAudioContextConstructor();
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
      osc.onended = () => { ctx.close().catch(() => undefined); };
    } catch { }
  }

  function playCheers() {
    if (typeof window === "undefined") return;
    try {
      const AudioCtx = getAudioContextConstructor();
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const duration = 1.6;
      const bufferSize = Math.floor(ctx.sampleRate * duration);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i += 1) {
        const t = i / ctx.sampleRate;
        const envelope = Math.exp(-t * 1.4);
        const flutter = 0.65 + 0.35 * Math.sin(t * 24 + Math.sin(t * 6));
        const noise = (Math.random() * 2 - 1) * 0.9;
        const gate = Math.random() > 0.35 ? 1 : 0;
        data[i] = noise * envelope * flutter * gate;
      }
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      const hp = ctx.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.value = 400;
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 1400;
      bp.Q.value = 0.7;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      src.connect(hp);
      hp.connect(bp);
      bp.connect(gain);
      gain.connect(ctx.destination);
      src.start();
      src.stop(ctx.currentTime + duration);
      src.onended = () => { ctx.close().catch(() => undefined); };
    } catch { }
  }

  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const listenTimeoutRef = useRef<number | null>(null);
  const tapFallbackTimerRef = useRef<number | null>(null);
  const baselineRef = useRef<number>(0);
  const lastRmsRef = useRef<number>(0);
  const listenTokenRef = useRef<number>(0);

  const stopListening = useCallback(() => {
    listenTokenRef.current += 1;
    setListening(false);
    if (rafRef.current !== null && typeof window !== "undefined") {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (typeof window !== "undefined") {
      if (listenTimeoutRef.current !== null) {
        window.clearTimeout(listenTimeoutRef.current);
        listenTimeoutRef.current = null;
      }
      if (tapFallbackTimerRef.current !== null) {
        window.clearTimeout(tapFallbackTimerRef.current);
        tapFallbackTimerRef.current = null;
      }
    }
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) track.stop();
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => undefined);
      audioCtxRef.current = null;
    }
    analyserRef.current = null;
    baselineRef.current = 0;
    lastRmsRef.current = 0;
  }, []);

  function heartConfettiExplosion() {
    const anyConfetti = confetti as unknown as {
      (opts: Record<string, unknown>): void;
      shapeFromText?: (opts: { text: string; scalar?: number }) => unknown;
    };
    const heartShape = anyConfetti.shapeFromText ? anyConfetti.shapeFromText({ text: "❤", scalar: 1.25 }) : undefined;
    const burst = (particleCount: number, spread: number, startVelocity: number, scalar: number) => {
      anyConfetti({
        particleCount, spread, startVelocity, scalar, ticks: 300,
        origin: { x: 0.5, y: 0.42 },
        colors: ["#e11d48", "#fb7185", "#f472b6", "#a78bfa", "#ffffff"],
        shapes: heartShape ? [heartShape] : undefined,
      });
    };
    burst(220, 95, 55, 1.05);
    window.setTimeout(() => burst(180, 120, 48, 0.95), 180);
    window.setTimeout(() => burst(200, 110, 52, 1.0), 520);
  }

  function triggerBlowOut() {
    if (flame === "out" || flame === "flicker") return;
    stopListening();
    setMicError(null);
    setTapFallbackAvailable(false);
    setCutDone(false);
    setPostBlowStage("smoke");
    setFlame("flicker");
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try { navigator.vibrate?.([18, 30, 18]); } catch { }
    }
    window.setTimeout(() => {
      setFlame("out");
      setSmokeKey((k) => k + 1);
    }, reduceMotion ? 120 : 420);

    // Give smoke a beat before celebration/cut.
    window.setTimeout(() => {
      setPostBlowStage("cut");
      if (typeof window !== "undefined") heartConfettiExplosion();
      playCheers();
    }, reduceMotion ? 240 : 1420);
  }

  async function startListeningForBlow() {
    if (typeof window === "undefined") return;
    if (listening) return;
    if (flame === "out") return;
    setMicError(null);
    setTapFallbackAvailable(false);
    try {
      const token = listenTokenRef.current + 1;
      listenTokenRef.current = token;

      const hasMedia = typeof navigator !== "undefined" && !!navigator.mediaDevices?.getUserMedia;
      if (!hasMedia) {
        setMicError("Microphone not available on this device.");
        setTapFallbackAvailable(true);
        return;
      }

      // We prepare the analyser on the "Next" screen, but we also tolerate
      // users skipping it (or the analyser being cleared) and request again.
      if (!analyserRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        const AudioCtx = getAudioContextConstructor();
        if (!AudioCtx) {
          setMicError("Audio engine not available.");
          setTapFallbackAvailable(true);
          stopListening();
          return;
        }
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 1024;
        analyser.smoothingTimeConstant = 0.7;
        source.connect(analyser);
        analyserRef.current = analyser;
        // Start higher to avoid immediate false spikes after permission.
        baselineRef.current = 0.06;
        lastRmsRef.current = 0;
      }

      setListening(true);

      // If we can't detect a blow quickly, unlock the manual fallback so the
      // experience never gets stuck.
      tapFallbackTimerRef.current = window.setTimeout(() => {
        if (listenTokenRef.current !== token) return;
        setTapFallbackAvailable(true);
        stopListening();
      }, 7000);

      const analyserForLoop = analyserRef.current;
      if (!analyserForLoop) {
        setMicError("Microphone not ready.");
        setTapFallbackAvailable(true);
        stopListening();
        return;
      }

      const data = new Uint8Array(analyserForLoop.fftSize);
      const startedAt = typeof performance !== "undefined" ? performance.now() : Date.now();
      let consecutiveSpikes = 0;

      const tick = () => {
        if (listenTokenRef.current !== token) return;
        const a = analyserRef.current;
        if (!a) return;
        a.getByteTimeDomainData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i += 1) {
          const v = (data[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / data.length);
        const baseline = baselineRef.current;
        const nextBaseline = baseline * 0.92 + rms * 0.08;
        baselineRef.current = Math.max(0.005, Math.min(0.08, nextBaseline));
        const lastRms = lastRmsRef.current;
        lastRmsRef.current = rms;

        const now = typeof performance !== "undefined" ? performance.now() : Date.now();
        const warmupDone = now - startedAt > (reduceMotion ? 250 : 900);
        // During warmup, we only learn the baseline so the analyser settles.
        if (!warmupDone) {
          rafRef.current = window.requestAnimationFrame(tick);
          return;
        }

        const spike = rms > baselineRef.current * 3.0 && rms > 0.09 && rms - lastRms > 0.02;
        consecutiveSpikes = spike ? consecutiveSpikes + 1 : 0;

        if (consecutiveSpikes >= 2) {
          triggerBlowOut();
          return;
        }
        rafRef.current = window.requestAnimationFrame(tick);
      };
      rafRef.current = window.requestAnimationFrame(tick);
      listenTimeoutRef.current = window.setTimeout(() => {
        if (listenTokenRef.current !== token) return;
        stopListening();
      }, 18000);
    } catch {
      setMicError("Microphone permission denied.");
      setTapFallbackAvailable(true);
      stopListening();
    }
  }

  async function prepareMicrophone() {
    if (typeof window === "undefined") return;
    setMicError(null);
    setTapFallbackAvailable(false);

    const hasMedia = typeof navigator !== "undefined" && !!navigator.mediaDevices?.getUserMedia;
    if (!hasMedia) {
      setMicError("Microphone not available on this device.");
      setTapFallbackAvailable(true);
      return;
    }

    try {
      // Clean state before requesting again.
      stopListening();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const AudioCtx = getAudioContextConstructor();
      if (!AudioCtx) {
        setMicError("Audio engine not available.");
        setTapFallbackAvailable(true);
        stopListening();
        return;
      }
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.7;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Higher initial baseline avoids instant false blow-outs.
      baselineRef.current = 0.06;
      lastRmsRef.current = 0;
    } catch {
      setMicError("Microphone permission denied.");
      setTapFallbackAvailable(true);
      stopListening();
    }
  }

  useEffect(() => {
    if (!readyForCake) return;
    // Permission Primer: when we first reach the cake moment, start at pre-header.
    setCandlePrimerStage("primer");
    setMicError(null);
    setTapFallbackAvailable(false);
    stopListening();
  }, [readyForCake, stopListening]);

  useEffect(() => {
    return () => stopListening();
  }, [stopListening]);

  function popBalloon(index: number) {
    setPopped((prev) => {
      if (prev[index]) return prev;
      const next = [...prev];
      next[index] = true;
      return next;
    });
    setHasInteracted(true);
    attemptPlayMusic();
    playPop();
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try { navigator.vibrate?.(25); } catch { }
    }
  }

  return (
    <div className="relative w-full" data-testid="birthday-root">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-purple-950 to-black"
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[5] bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-fuchsia-500/30 via-pink-500/10 to-transparent"
        initial={false}
        animate={{ opacity: allPopped ? 1 : 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />
      <PartyConfettiBackground />
      {showEnvelopeLetter ? (
        <LuxuryEnvelopeLetter
          message={letterMessage}
          reduceMotion={reduceMotion}
          onClose={stopMusicAfterCurrentPlay}
        />
      ) : showCandlePrimer ? (
        <div className="relative z-20 flex min-h-dvh w-full items-center justify-center px-4" data-testid="candle-primer-shell">
          <div className="w-full max-w-md">
            <div className="rounded-3xl border border-white/20 bg-white/10 p-6 text-center text-white backdrop-blur-xl" data-testid="candle-primer-card">
              <div className="font-sans text-balance text-xl font-semibold">
                Ready to make your wish come true? ✨
              </div>
              <p className="mt-3 font-sans text-pretty text-sm text-white/85">
                 Blow into your mic to put out the candles. We only detect airflow — no audio is saved.
              </p>
              <motion.button
                type="button"
                data-testid="candle-primer-next"
                disabled={requestingMic}
                onClick={async () => {
                  if (requestingMic) return;
                  setRequestingMic(true);
                  setHasInteracted(true);
                  try {
                    await prepareMicrophone();
                  } finally {
                    setRequestingMic(false);
                    setCandlePrimerStage("cake");
                  }
                }}
                whileHover={reduceMotion ? undefined : { y: -1 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-pink-600 px-7 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                 Next
              </motion.button>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative z-20 mx-auto w-full px-4  sm:px-6" data-testid="birthday-shell">
          <div className="mx-auto flex w-full items-center justify-center">
            <div
              className={"relative w-[min(92vw,480px)] overflow-hidden rounded-3xl border border-white/20 bg-white/10 " + cardHeightClass}
              data-testid="birthday-card"
              onPointerDownCapture={() => {
                if (!hasInteracted) setHasInteracted(true);
                attemptPlayMusic();
              }}
            >
              {readyForCake && candlePrimerStage === "cake" ? (
                <button
                  type="button"
                  aria-label={muted ? "Unmute music" : "Mute music"}
                  data-testid="birthday-mute"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    setMuted((m) => !m);
                  }}
                  className="absolute right-4 top-4 z-40 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/90 backdrop-blur transition-colors hover:bg-white/15"
                >
                  {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </button>
              ) : null}
              <div className="flex h-full flex-col p-6 sm:p-8">
                {showBirthdayHeader ? (
                  <header className="text-center">
                    <h1 className={luckiestGuy.className + " relative mt-5 text-balance text-4xl tracking-tight text-white sm:text-5xl"}>
                      <span aria-hidden className="pointer-events-none absolute inset-0 select-none text-pink-400/40 blur-md">{heading}</span>
                      <span className="relative">{heading}</span>
                    </h1>
                    {age || cakeType ? (
                      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                        {typeof age === "number" ? (
                          <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-pink-100 backdrop-blur">Turning {age}</span>
                        ) : null}
                      </div>
                    ) : null}
                        <div className="mt-3 min-h-[20px] sm:min-h-[24px]">
                          {readyForCake && candlePrimerStage === "cake" ? (
                            <p className={"text-pretty text-sm font-black text-white/70 sm:text-base " + (flame === "lit" ? "opacity-100" : "opacity-0")}>
                              Light the candle, make a wish, and tap to blow.
                            </p>
                          ) : null}
                        </div>
                  </header>
                ) : null}

                <div
                  className={(showBirthdayHeader ? "mt-12" : "mt-4") + " flex-1 overflow-hidden"}
                  data-testid={!readyForCake ? "birthday-balloon-stage" : "birthday-cake-stage"}
                >
                  {!readyForCake ? (
                    <div className="flex min-h-[360px] w-full flex-col items-center justify-center p-5 text-center backdrop-blur sm:p-6" data-testid="balloon-stage-inner">
                      {!readyToPop ? (
                        <div className="flex w-full max-w-md flex-col items-center" data-testid="balloon-ready-panel">
                          <div className="text-xs font-semibold tracking-wide text-pink-100/90" data-testid="balloon-ready-title">A surprise is waiting</div>
                          <div className="mt-3 text-balance text-lg font-semibold text-white sm:text-xl" data-testid="balloon-ready-subtitle">
                            Ready to pop the balloons?
                          </div>
                          <motion.button
                            type="button"
                            data-testid="balloon-ready-yes"
                            onClick={() => {
                              setReadyToPop(true);
                              setHasInteracted(true);
                              setMusicRequested(true);
                              const a = audioRef.current;
                              if (a && !muted) {
                                a.play().catch(() => undefined);
                              }
                            }}
                            whileHover={reduceMotion ? undefined : { y: -1 }}
                            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                            className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-pink-600 px-10 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-pink-700"
                          >
                            Yes
                          </motion.button>
                        </div>
                      ) : (
                        <AutoBalloonLine words={words} popped={popped} reduceMotion={reduceMotion} />
                      )}
                    </div>
                  ) : (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key="cake-stage"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full h-full flex items-center justify-center"
                        data-testid="cake-stage-inner"
                      >
                        {flame === "out" ? (
                          postBlowStage === "cut" ? (
                            cutDone ? null : (
                              <CakeFrame>
                                <CakeCutStage reduceMotion={reduceMotion} smokeKey={smokeKey} onFinished={() => setCutDone(true)} />
                              </CakeFrame>
                            )
                          ) : (
                            <CakeFrame>
                              <Cake flame={"out"} smokeKey={smokeKey} reduceMotion={reduceMotion} />
                            </CakeFrame>
                          )
                        ) : (
                          <CakeFrame>
                            <Cake flame={flame} smokeKey={smokeKey} reduceMotion={reduceMotion} />
                          </CakeFrame>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>

                {readyForCake && candlePrimerStage === "cake" ? (
                  <>
                    <div
                      className={
                        "mt-5 flex min-h-[44px] w-full flex-col items-center gap-3 transition-opacity sm:flex-row sm:justify-center " +
                        (flame === "out" ? "pointer-events-none opacity-0" : "opacity-100")
                      }
                    >
                      <motion.button
                        type="button"
                        data-testid="blow-button"
                        onClick={() => {
                          if (micError || tapFallbackAvailable) {
                            triggerBlowOut();
                            return;
                          }
                          startListeningForBlow().catch(() => undefined);
                          setHasInteracted(true);
                          attemptPlayMusic();
                        }}
                        whileHover={reduceMotion ? undefined : { y: -1 }}
                        whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                        disabled={flame !== "lit" || listening}
                        className="inline-flex h-11 w-full items-center justify-center rounded-full bg-pink-600 px-7 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                      >
                        {micError || tapFallbackAvailable ? "Tap to Blow" : listening ? "Listening… Blow!" : "Blow the candles"}
                      </motion.button>
                    </div>

                    <div className={"mt-3 min-h-[16px] text-center text-xs text-white/65 " + (flame === "out" ? "opacity-0" : "opacity-100")}>
                      {micError ? micError : ""}
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


function BalloonSvg({ base, deep }: { base: string; deep: string }) {
  const id = useMemo(() => Math.random().toString(36).substr(2, 9), []);
  return (
    <svg width="92" height="128" viewBox="0 0 92 128" className="drop-shadow-[0_16px_30px_rgba(0,0,0,0.45)]">
      <defs>
        <linearGradient id={`g-${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={base} /><stop offset="1" stopColor={deep} /></linearGradient>
        <radialGradient id={`s-${id}`} cx="30%" cy="22%" r="65%"><stop offset="0" stopColor="#ffffff" stopOpacity="0.85" /><stop offset="0.4" stopColor="#ffffff" stopOpacity="0.18" /><stop offset="1" stopColor="#ffffff" stopOpacity="0" /></radialGradient>
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

  // Slightly curved / bent "line".
  const slots = [
    { left: "12%", y: 18 },
    { left: "37%", y: -11 },
    { left: "62%", y: -11 },
    { left: "88%", y: 18 },
  ];

  return (
    <div className="relative mx-auto mt-8 h-[280px] w-full max-w-[520px] overflow-visible">
      {/* faint guide curve */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[156px] h-px w-[92%] -translate-x-1/2 bg-white/10"
        style={{ borderRadius: 9999 }}
      />

      {words.map((word, i) => {
        const c = palette[i % palette.length];
        const slot = slots[i] ?? slots[slots.length - 1];
        return (
          <div
            key={word + i}
            className="absolute top-[140px]"
            style={{ left: slot.left, transform: `translateX(-50%) translateY(${slot.y}px)` }}
          >
            <motion.div
              initial={{ y: 42, opacity: 1 }}
              animate={{ y: -100, opacity: 1 }}
              transition={{ duration: reduceMotion ? 0.35 : 1.8, ease: "easeOut" }}
              className="relative flex w-[110px] flex-col items-center justify-start"
            >
              {/* Word sits behind the balloon; popping reveals it in-place */}
              {popped[i] ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className={
                    luckiestGuy.className +
                    " pointer-events-none absolute left-1/2-10px top-[-10px] z-0 -translate-x-1/2 text-center text-lg tracking-tight text-white drop-shadow sm:text-xl"
                  }
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
    <div className="relative mx-auto w-[min(88vw,360px)]">
      <div className="relative w-full" style={{ aspectRatio: "320 / 260" }}>
        <div className="absolute inset-0 flex items-center justify-center">{children}</div>
      </div>
    </div>
  );
}

function CakeCutStage({ reduceMotion, smokeKey, onFinished }: { reduceMotion: boolean; smokeKey: number; onFinished: () => void; }) {
  const [split, setSplit] = useState(false);
  useEffect(() => {
    const splitMs = reduceMotion ? 180 : 1500; // Was 650. Now stays whole longer.
    const doneMs = reduceMotion ? 520 : 3500;
    setSplit(false);
    const t1 = setTimeout(() => setSplit(true), splitMs);
    const t2 = setTimeout(() => onFinished(), doneMs);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onFinished, reduceMotion]);

  return (
    <div className="relative h-full w-full">
      <motion.div
        className="absolute inset-0"
        style={{ clipPath: "inset(0 50% 0 0)" }}
        initial={false}
        animate={split ? { x: -140, rotate: -5, opacity: 0 } : { x: 0, rotate: 0, opacity: 1 }}
        transition={{ duration: reduceMotion ? 0.35 : 0.9, ease: "easeInOut" }}
      >
        <Cake flame="out" smokeKey={smokeKey} reduceMotion={reduceMotion} />
      </motion.div>
      <motion.div
        className="absolute inset-0"
        style={{ clipPath: "inset(0 0 0 50%)" }}
        initial={false}
        animate={split ? { x: 140, rotate: 5, opacity: 0 } : { x: 0, rotate: 0, opacity: 1 }}
        transition={{ duration: reduceMotion ? 0.35 : 0.9, ease: "easeInOut", delay: reduceMotion ? 0 : 0.05 }}
      >
        <Cake flame="out" smokeKey={smokeKey} reduceMotion={reduceMotion} />
      </motion.div>
    </div>
  );
}

function Cake({ flame, smokeKey, reduceMotion }: { flame: "lit" | "flicker" | "out"; smokeKey: number; reduceMotion: boolean; }) {
  const lit = flame === "lit";
  const flicker = flame === "flicker";
  const candles = useMemo(() => [
    { id: 1, x: 121, baseY: 85, color: "#fb7185" },
    { id: 2, x: 141, baseY: 85, color: "#a78bfa" },
    { id: 3, x: 161, baseY: 85, color: "#fbbf24" },
    { id: 4, x: 181, baseY: 85, color: "#38bdf8" },
    { id: 5, x: 201, baseY: 85, color: "#34d399" },
  ], []);

  // Thinner candles
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
              {(lit || flicker) && (
                <motion.g
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: [1, 1.1, 1], y: [0, -2, 0] }}
                  exit={{ opacity: 0, scale: 0 }}
                //   transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                  // Ensure flame is centered on the wick
                  style={{ originX: `${c.x}px`, originY: `${wickTopY}px` }}
                >
                    {/* Position the flame path relative to the specific wick top */}
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
              )}
            </AnimatePresence>

            <AnimatePresence>
              {flame === "out" && smokeKey > 0 ? (
                <motion.g
                  key={`smoke-${smokeKey}-${c.id}`}
                  initial={{ opacity: 0, y: 0, scale: 0.9 }}
                  animate={{ opacity: [0, 0.35, 0], y: [0, -18], scale: [0.9, 1.15, 1.25] }}
                  transition={{ duration: reduceMotion ? 0.7 : 1.15, ease: "easeOut", delay: i * 0.04 }}
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