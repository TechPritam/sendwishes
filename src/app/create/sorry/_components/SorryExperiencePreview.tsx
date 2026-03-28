"use client";

import { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Fredoka } from "next/font/google";
import { FirstScreenCarousel } from "@/app/_components/FirstScreenCarousel";

const fredoka = Fredoka({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const SAD_GIFS = ["/assets/upset-bubu.gif", "/assets/sad-dudu.gif", "/assets/sad-guitar.gif"];
const CAROUSEL_SLIDES = [
    { src: "/assets/surrender-flag.gif", title: "I Surrender", msg: "Okay, you win. I’m really sorry." },
    { src: "/assets/sorry.gif", title: "I Messed Up", msg: "No excuses. Just a soft little sorry." },
    { src: "/assets/sorry2.gif", title: "Let Me Make It Right", msg: "Tell me what you need." },
];

export function SorryExperiencePreview({ name }: { name?: string; reason?: string }) {
    // Animated backgrounds (from SorryExperience)
    const pinkLavaBackground = (
        <motion.div
            aria-hidden
            className="absolute inset-0"
            initial={false}
            animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                filter: ["hue-rotate(0deg)", "hue-rotate(10deg)", "hue-rotate(0deg)"]
            }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            style={{
                backgroundImage:
                    "radial-gradient(1200px 700px at 25% 25%, rgba(251,113,133,0.75), transparent 60%)," +
                    "radial-gradient(1000px 650px at 85% 40%, rgba(244,114,182,0.65), transparent 55%)," +
                    "radial-gradient(900px 600px at 55% 85%, rgba(167,139,250,0.55), transparent 60%)," +
                    "linear-gradient(135deg, rgba(255,228,230,1), rgba(253,230,255,1), rgba(255,237,213,1))",
                backgroundSize: "220% 220%",
            }}
        />
    );
    const peachCloudBackground = (
        <motion.div
            aria-hidden
            className="absolute inset-0"
            initial={false}
            animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            style={{
                backgroundImage:
                    "radial-gradient(900px 520px at 20% 30%, rgba(253,186,116,0.55), transparent 62%)," +
                    "radial-gradient(850px 520px at 85% 45%, rgba(251,113,133,0.45), transparent 60%)," +
                    "radial-gradient(900px 560px at 55% 85%, rgba(196,181,253,0.45), transparent 60%)," +
                    "linear-gradient(180deg, rgba(255,237,213,1), rgba(255,228,230,1))",
                backgroundSize: "200% 200%",
            }}
        />
    );
    const glitterSandBackground = (
        <motion.div
            aria-hidden
            className="absolute inset-0"
            initial={false}
            animate={{ filter: ["saturate(1)", "saturate(1.15)", "saturate(1)"] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            style={{
                backgroundImage:
                    "radial-gradient(1100px 700px at 30% 20%, rgba(251,113,133,0.55), transparent 60%)," +
                    "radial-gradient(1000px 680px at 80% 45%, rgba(244,114,182,0.55), transparent 60%)," +
                    "radial-gradient(900px 620px at 50% 85%, rgba(253,186,116,0.45), transparent 65%)," +
                    "linear-gradient(135deg, rgba(255,228,230,1), rgba(253,230,255,1))",
            }}
        />
    );
    const sugarSparkleBackground = (
        <motion.div
            aria-hidden
            className="absolute inset-0"
            initial={false}
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut" }}
            style={{
                backgroundImage:
                    "radial-gradient(1000px 700px at 20% 20%, rgba(244,114,182,0.75), transparent 60%)," +
                    "radial-gradient(900px 650px at 80% 35%, rgba(253,186,116,0.65), transparent 58%)," +
                    "radial-gradient(900px 650px at 55% 90%, rgba(167,139,250,0.65), transparent 60%)," +
                    "linear-gradient(135deg, rgba(255,228,230,1), rgba(253,164,175,1), rgba(196,181,253,1))",
                backgroundSize: "240% 240%",
            }}
        />
    );
    // Grain overlay
    const GRAIN_DATA_URI =
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E";
    const [screen, setScreen] = useState(1);
    const [idleHint, setIdleHint] = useState<string | null>(null);
        // Idle hint logic (show on screen 1, like SorryExperience)
        useEffect(() => {
            if (screen !== 1) {
                setIdleHint(null);
                return;
            }
            const hint = "Say yes. For the plot. 🎬";
            const t = window.setTimeout(() => {
                setIdleHint(hint);
            }, 500);
            return () => window.clearTimeout(t);
        }, [screen]);
    const [carouselIdx, setCarouselIdx] = useState(0);
    const [gifIdx, setGifIdx] = useState(0);
    const [swipeToast, setSwipeToast] = useState<"accept" | "reject" | null>(null);
    const [cardKey, setCardKey] = useState(0);
    const toName = useMemo(() => (name || "my favorite human").trim(), [name]);

    const [previewHugSequence, setPreviewHugSequence] = useState<"hold" | "hug2" | "hug1">("hold");
    const [hugProgress, setHugProgress] = useState(0);
    const [showBlast, setShowBlast] = useState(false);
    const [particles, setParticles] = useState<{ id: number; x: number; emoji: string }[]>([]);

    // Logic for discrete bursts on Screen 2
    useEffect(() => {
        if (screen !== 2) {
            setParticles([]);
            return;
        }

        const emojis = ["🥔", "💗", "✨", "💖"];
        
        // Trigger Burst 1 (Matches first button selection at 1s)
        const t1 = setTimeout(() => {
            const burst = Array.from({ length: 8 }).map((_, i) => ({
                id: Date.now() + i,
                x: Math.random() * 40 + 5, // Left side
                emoji: emojis[Math.floor(Math.random() * emojis.length)],
            }));
            setParticles(prev => [...prev, ...burst]);
        }, 1000);

        // Trigger Burst 2 (Matches second button selection at 1.8s)
        const t2 = setTimeout(() => {
            const burst = Array.from({ length: 8 }).map((_, i) => ({
                id: Date.now() + 50 + i,
                x: Math.random() * 40 + 55, // Right side
                emoji: emojis[Math.floor(Math.random() * emojis.length)],
            }));
            setParticles(prev => [...prev, ...burst]);
        }, 1800);

        // Clean up old particles to prevent "rain" feel
        const t3 = setTimeout(() => setParticles([]), 5000);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, [screen]);

    useEffect(() => {
        if (screen !== 5) {
            setPreviewHugSequence("hold");
            setHugProgress(0);
            setShowBlast(false);
            return;
        }

        const progressInterval = setInterval(() => {
            setHugProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    setShowBlast(true);
                    return 100;
                }
                return prev + 2;
            });
        }, 40);

        const t1 = setTimeout(() => {
            setShowBlast(false);
            setPreviewHugSequence("hug2");
        }, 2500);

        const t2 = setTimeout(() => {
            setPreviewHugSequence("hug1");
        }, 5000);

        return () => {
            clearInterval(progressInterval);
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, [screen]);

    useEffect(() => {
        const interval = setInterval(() => {
            setScreen((prev) => (prev % 6) + 1);
        }, 7000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (screen !== 1) return;
        const interval = setInterval(() => {
            setCarouselIdx((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
        }, 2200);
        return () => clearInterval(interval);
    }, [screen]);

    useEffect(() => {
        if (screen !== 3) return;
        const interval = setInterval(() => {
            setGifIdx((prev) => (prev + 1) % SAD_GIFS.length);
        }, 1500);
        return () => clearInterval(interval);
    }, [screen]);


    return (
        <div className={`${fredoka.className} relative flex h-[604px] w-full flex-col overflow-hidden shadow-inner`}>
            {idleHint ? (
                <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="pointer-events-none absolute left-4 top-10 z-[70] max-w-[240px] text-xs bg-transparent rounded-lg px-3 py-1 shadow"
                >
                    {idleHint}
                </motion.div>
            ) : null}
            {/* Animated BGs */}
            <div className="absolute inset-0 -z-10">
                {screen === 1 ? pinkLavaBackground : null}
                {screen === 2 ? peachCloudBackground : null}
                {screen === 3 ? glitterSandBackground : null}
                {screen === 4 ? pinkLavaBackground : null}
                {screen === 5 ? peachCloudBackground : null}
                {screen === 6 ? sugarSparkleBackground : null}
                <div
                    className="absolute inset-0 opacity-[0.12] mix-blend-overlay"
                    style={{ backgroundImage: `url(${GRAIN_DATA_URI})` }}
                />
            </div>

            {/* Falling Emojis Burst Layer */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden z-20">
                <AnimatePresence>
                    {particles.map((p) => (
                        <motion.div
                            key={p.id}
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ 
                                y: 600, 
                                opacity: [0, 1, 0], 
                                rotate: [0, 180] 
                            }}
                            transition={{ 
                                duration: 1.5, // Faster fall for "burst" feel
                                ease: "easeIn" 
                            }}
                            className="absolute text-xl"
                            style={{ left: `${p.x}%` }}
                        >
                            {p.emoji}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="flex justify-center gap-1.5 pt-10 pb-4">
                {[1, 2, 3, 4, 5, 6].map((s) => (
                    <div
                        key={s}
                        className={`h-1.5 rounded-full transition-all duration-500 ${screen === s ? "w-6 bg-pink-500" : "w-1.5 bg-pink-200"
                            }`}
                    />
                ))}
            </div>

            <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
                <AnimatePresence mode="wait">

                    {screen === 1 && (
                        <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full text-center">
                            <div className="flex flex-col items-center gap-4">
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={CAROUSEL_SLIDES[carouselIdx].src}
                                        src={CAROUSEL_SLIDES[carouselIdx].src}
                                        className="h-32 w-auto object-contain"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.1 }}
                                    />
                                </AnimatePresence>
                                <div>
                                    <h3 className="text-sm font-bold text-zinc-900">{CAROUSEL_SLIDES[carouselIdx].title}</h3>
                                    <p className="text-[11px] text-zinc-500 mt-1 px-4">{CAROUSEL_SLIDES[carouselIdx].msg}</p>
                                </div>
                                <div className="flex gap-1.5">
                                    {CAROUSEL_SLIDES.map((_, i) => (
                                        <div key={i} className={`h-1.5 w-1.5 rounded-full ${i === carouselIdx ? "bg-rose-500" : "bg-rose-200"}`} />
                                    ))}
                                </div>
                                <div className="mt-4 h-10 w-full rounded-full bg-gradient-to-r from-pink-500 to-rose-400 flex items-center justify-center text-[11px] font-bold text-white shadow-md">
                                    Oki, fine. 💖
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {screen === 2 && (
                        <motion.div
                            key="s2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="w-full flex-1 flex flex-col justify-between relative z-10"
                        >
                            <div className="text-center pt-2">
                                <h2
                                    className="text-balance text-2xl font-semibold tracking-tight text-zinc-900 leading-tight"
                                    style={{ textShadow: "0 10px 25px rgba(0,0,0,0.3)" }}
                                >
                                    Why was I being such a potato? 🥔
                                </h2>
                            </div>

                            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 px-2">
                                {([
                                    ["drama", "I was being a drama queen. 👑"],
                                    ["rock", "My two brain cells were fighting. 🥊 🪨"],
                                    ["exited", "My brain just... exited the chat. 📉"],
                                    ["baby", "I'm just a baby, pls forgive. 🍼"],
                                ] as const).map(([key, label], i) => {
                                    return (
                                        <motion.div
                                            key={key}
                                            initial={{ scale: 1, backgroundColor: "rgba(255,255,255,0.1)" }}
                                            animate={{ 
                                                scale: i < 2 ? [1, 1.08, 1] : 1, // Selection pop
                                                backgroundColor: i < 4 ? "rgba(135,38,38,0.15)" : "rgba(255,255,255,0.1)",
                                                borderColor: i < 4 ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.25)"
                                            }}
                                            transition={{ delay: 1 + i * 0.8, duration: 0.4 }}
                                            className="relative flex h-16 w-[130px] flex-col items-center justify-center rounded-full border backdrop-blur-sm shadow-sm"
                                        >
                                            <div className="px-3 text-center text-[10px] font-semibold text-zinc-900/80 leading-snug">
                                                {label}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            <div className="mt-12 flex items-center justify-between pb-4">
                                <button
                                    type="button"
                                    className="text-[10px] font-semibold tracking-[0.2em] text-zinc-900/40 uppercase"
                                >
                                    Back
                                </button>

                                <motion.div
                                    initial={{ opacity: 0.4 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 2.8 }}
                                    className="relative inline-flex h-10 items-center justify-center rounded-full px-6 text-xs font-semibold text-white ring-1 ring-white/30 backdrop-blur-xl bg-white/18 shadow-lg shadow-pink-200/30"
                                    style={{ backgroundImage: "linear-gradient(135deg, rgba(151,59,59,0.25), rgba(255,255,255,0.05))" }}
                                >
                                    <span>CONTINUE ✨</span>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}

                    {screen === 3 && (
                        <motion.div key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col items-center">
                            <img src={SAD_GIFS[gifIdx]} className="h-24 mb-3" alt="Sad gif" />
                                <motion.h6
                                    className={fredoka.className + " mt-3 mb-3 text-xl font-bold text-zinc-800"}
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                  >
                                    Ab maan bhi jao...
                                  </motion.h6>
                            <div className="w-full rounded-[2rem] bg-white/40 border border-white p-5 shadow-xl backdrop-blur-sm">
                                <p className="text-[10px] font-bold text-zinc-800 text-center mb-4 italic px-2">
                                    &quot;My aura is -10,000 right now. Pick your bribe...&quot;
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="aspect-square rounded-2xl border-2 border-pink-400 bg-pink-50 flex flex-col items-center justify-center">
                                        <span className="text-2xl">🥟</span>
                                        <span className="text-[9px] font-black mt-1">MOMOS</span>
                                    </div>
                                    <div className="aspect-square rounded-2xl border border-zinc-100 bg-white/50 flex flex-col items-center justify-center opacity-40">
                                        <span className="text-2xl">🍦</span>
                                        <span className="text-[9px] font-bold mt-1">DRIVE</span>
                                    </div>
                                    <div className="aspect-square rounded-2xl border border-zinc-100 bg-white/50 flex flex-col items-center justify-center opacity-40">
                                        <span className="text-2xl">🤗</span>
                                        <span className="text-[9px] font-bold mt-1">HUGS</span>
                                    </div>
                                    <div className="aspect-square rounded-2xl border border-zinc-100 bg-white/50 flex flex-col items-center justify-center opacity-40">
                                        <span className="text-2xl">🎶</span>
                                        <span className="text-[9px] font-bold mt-1">MSIC</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {screen === 4 && (
                        <motion.div
                            key="s4-container"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="w-full flex flex-col items-center"
                        >
                            <div className="text-center mb-6">
                                <h1 className="text-lg font-semibold tracking-tight text-zinc-900">
                                    My Forgiveness Bribe Inventory 🎁 🎁
                                </h1>
                                <p className="mt-1 text-[10px] font-medium text-zinc-400">
                                    swipe right to accept • swipe left to reject
                                </p>
                            </div>

                            <div className="relative h-64 w-[200px] flex items-center justify-center">
                                <AnimatePresence>
                                    {swipeToast && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8, x: "-50%", scale: 0.9 }}
                                            animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className={`absolute -top-12 left-1/2 z-[100] whitespace-nowrap rounded-full px-4 py-1.5 text-[10px] font-bold ring-1 backdrop-blur-xl shadow-sm ${swipeToast === "accept"
                                                ? "bg-emerald-50/90 text-emerald-900 ring-emerald-200/60"
                                                : "bg-rose-50/90 text-rose-900 ring-rose-200/60"
                                                }`}
                                        >
                                            {swipeToast === "accept" ? "Accepted! ✅" : "Try harder! ❌"}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {[
                                    { id: 1, emoji: "🎟️", title: "Unlimited Cuddles Pass", sub: "redeem anytime (no cooldown)" },
                                    { id: 2, emoji: "🤝", title: "Blame Shield", sub: "I'll take the fall for 3 fights" },
                                    { id: 3, emoji: "💆‍♀️", title: "Head Scratch Session", sub: "1-hour with eye contact" },
                                    { id: 4, emoji: "📸", title: "Insta Story Post", sub: "Yes, with a cute song" },
                                ].reverse().map((bribe, i, arr) => {
                                    const indexFromTop = arr.length - 1 - i;
                                    const delay = indexFromTop * 1.5;

                                    return (
                                        <motion.div
                                            key={bribe.id}
                                            className="absolute inset-0"
                                            style={{ zIndex: i }}
                                            initial={{ x: 0, opacity: 1, rotate: 0 }}
                                            animate={{
                                                x: [0, 0, 350],
                                                rotate: [0, 0, 20],
                                                opacity: [1, 1, 0]
                                            }}
                                            transition={{
                                                duration: 2.5,
                                                delay: delay,
                                                times: [0, 0.7, 1],
                                                ease: "easeInOut"
                                            }}
                                            onUpdate={(latest) => {
                                                const x = latest.x as number;
                                                if (x > 100 && x < 110) {
                                                    if (!swipeToast) {
                                                        setSwipeToast("accept");
                                                        setTimeout(() => setSwipeToast(null), 1800);
                                                    }
                                                }
                                            }}
                                        >
                                            <div
                                                className="h-full w-full rounded-[2.5rem] border border-white/35 bg-white/65 p-4 backdrop-blur-2xl shadow-2xl"
                                                style={{
                                                    transform: `rotate(${indexFromTop % 2 === 0 ? -2 : 2}deg) translateY(${indexFromTop * 2}px)`
                                                }}
                                            >
                                                <div className="h-full rounded-[1.8rem] bg-white p-4 ring-1 ring-zinc-200 flex flex-col justify-between text-left">
                                                    <div className="flex items-start justify-between">
                                                        <div className="text-[8px] font-semibold tracking-[0.2em] text-zinc-500 uppercase">
                                                            Bribe #{bribe.id}
                                                        </div>
                                                        <div className="text-2xl">{bribe.emoji}</div>
                                                    </div>

                                                    <div className="mt-2">
                                                        <div className="text-[12px] font-bold text-zinc-900 leading-tight">
                                                            {bribe.title}
                                                        </div>
                                                        <div className="mt-1 text-[8px] font-medium text-zinc-600 leading-snug">
                                                            {bribe.sub}
                                                        </div>
                                                    </div>

                                                    <div className="mt-4 text-center text-[8px] font-black tracking-[0.22em] text-pink-500 border-t border-zinc-50 pt-3">
                                                        {indexFromTop === 0 ? "SIMULATING..." : "WAITING..."}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {screen === 5 && (
                        <motion.div
                            key="s5"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="w-full flex flex-col items-center text-center"
                        >
                            {previewHugSequence === "hold" ? (
                                <>
                                    <h2 className="text-balance text-lg font-bold tracking-tight text-zinc-900 leading-tight px-4">
                                        Calibration required:<br /> I need a hug 🤍
                                    </h2>
                                    <p className="mx-auto mt-2 text-[10px] font-semibold text-zinc-900/70">
                                        press and hold the heart for 3 seconds.
                                    </p>

                                    <div className="mt-12 relative flex justify-center items-center h-44 w-44">
                                        <AnimatePresence>
                                            {showBlast && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.5 }}
                                                    animate={{ opacity: [0, 1, 0], scale: [0.6, 2.5] }}
                                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                                    className="absolute inset-0 rounded-full border-4 border-rose-300 bg-rose-400/20 z-20"
                                                />
                                            )}
                                        </AnimatePresence>

                                        <motion.div
                                            className="relative h-28 w-28 z-10 flex items-center justify-center"
                                            style={{
                                                scale: 1 + (hugProgress / 100) * 0.8
                                            }}
                                        >
                                            <svg className="h-full w-full drop-shadow-2xl" viewBox="0 0 256 256">
                                                <defs>
                                                    <linearGradient id="hugHeartPreview" x1="40" y1="28" x2="220" y2="236" gradientUnits="userSpaceOnUse">
                                                        <stop offset="0" stopColor="#ffffff" />
                                                        <stop offset="0.4" stopColor="#fb7185" />
                                                        <stop offset="1" stopColor="#f472b6" />
                                                    </linearGradient>
                                                </defs>
                                                <path
                                                    d="M128 226s-58-34-86-76c-18-27-15-63 7-85 20-20 52-18 72 2 4 4 6 8 7 10 1-2 3-6 7-10 20-20 52-22 72-2 22 22 25 58 7 85-28 42-86 76-86 76z"
                                                    fill="url(#hugHeartPreview)"
                                                />
                                            </svg>

                                            <span className="absolute text-[11px] font-black text-white drop-shadow-md">
                                                {Math.floor(hugProgress)}%
                                            </span>
                                        </motion.div>

                                        <div className="absolute inset-0 bg-rose-100 rounded-full blur-3xl opacity-40" />
                                    </div>

                                    <p className="mt-10 text-[9px] font-black text-zinc-300 uppercase tracking-[0.2em]">
                                        HOLDING FOR HUG...
                                    </p>
                                </>
                            ) : (
                                <div className="mt-4 flex flex-col items-center justify-center min-h-[280px]">
                                    <AnimatePresence mode="wait">
                                        <motion.img
                                            key={previewHugSequence}
                                            src={previewHugSequence === "hug2" ? "/assets/hug2.gif" : "/assets/hug1.gif"}
                                            className="h-40 w-auto rounded-3xl shadow-xl"
                                            initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 1.1 }}
                                            transition={{ type: "spring", damping: 15 }}
                                        />
                                    </AnimatePresence>
                                    <p className="mt-6 text-[10px] font-black text-rose-500 tracking-widest animate-pulse">
                                        MATCH FOUND ✨
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {screen === 6 && (
                        <motion.div key="s6" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="w-full text-center">
                            <div className="text-4xl mb-4 animate-bounce">✨🥳✨</div>
                            <h2 className="text-xl font-black text-emerald-600">Yayyyyy!!! ❤️</h2>
                            <p className="text-[11px] font-bold text-emerald-800/60 mt-2 px-6">
                                The tension was 📈, but the love is ♾️
                            </p>
                            <img src="/assets/bunny-kiss.gif" className="h-28 mx-auto mt-6 rounded-xl" alt="Bunny kiss" />
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
}