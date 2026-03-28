"use client";

import confetti from "canvas-confetti";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useParams } from "next/navigation";
import { Fredoka } from "next/font/google";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FirstScreenCarousel } from "@/app/_components/FirstScreenCarousel";

const fredoka = Fredoka({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const GRAIN_DATA_URI =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E";

type SorryExperienceProps = {
    name?: string;
    reason: string;
};

type Screen = 1 | 2 | 3 | 4 | 5 | 6;
type PotatoOption = "drama" | "rock" | "exited" | "baby";

const SAD_DUDU_BUBU_GIFS = ["/assets/upset-bubu.gif", "/assets/sad-dudu.gif", "/assets/sad-dudu2.gif"] as const;

type Bribe = {
    id: string;
    title: string;
    subtitle: string;
    emoji: string;
    tier: 1 | 2;
};

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}

function randomBetween(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

function safeTrim(s: string | undefined | null) {
    return (s ?? "").trim();
}

type FallingEmoji = {
    id: number;
    emoji: string;
    size: number;
};

function FallingEmojiLayer({
    active,
    burst,
    bumperRef,
}: {
    active: boolean;
    burst: number;
    bumperRef: React.RefObject<HTMLElement | null>;
}) {
    const [items, setItems] = useState<FallingEmoji[]>([]);
    const elsRef = useRef(new Map<number, HTMLDivElement>());
    const physRef = useRef(
        new Map<
            number,
            { x: number; y: number; vx: number; vy: number; rot: number; vr: number; size: number; bornAt: number }
        >()
    );
    const rafRef = useRef<number | null>(null);
    const idRef = useRef(1);

    useEffect(() => {
        if (!active) {
            setItems([]);
            physRef.current.clear();
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
            return;
        }

        const tick = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            const bumper = bumperRef.current?.getBoundingClientRect();
            const now = typeof performance !== "undefined" ? performance.now() : Date.now();

            for (const [id, p] of physRef.current.entries()) {
                p.vy += 0.42;
                p.x += p.vx;
                p.y += p.vy;
                p.rot += p.vr;

                // walls
                if (p.x < 6) {
                    p.x = 6;
                    p.vx *= -0.72;
                } else if (p.x > w - p.size - 6) {
                    p.x = w - p.size - 6;
                    p.vx *= -0.72;
                }

                // bumper (roughly collide with the option cluster)
                if (bumper) {
                    const bx = bumper.left;
                    const by = bumper.top;
                    const bw = bumper.width;
                    const bh = bumper.height;
                    const inX = p.x + p.size > bx && p.x < bx + bw;
                    const inY = p.y + p.size > by && p.y < by + bh;
                    if (inX && inY && p.vy > 0) {
                        p.y = by - p.size - 2;
                        p.vy *= -0.62;
                        p.vx *= 0.86;
                    }
                }

                const el = elsRef.current.get(id);
                if (el) {
                    el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) rotate(${p.rot}deg)`;
                }

                if (p.y > h + 120 || now - p.bornAt > 4200) {
                    physRef.current.delete(id);
                    elsRef.current.delete(id);
                    setItems((prev) => prev.filter((it) => it.id !== id));
                }
            }

            rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        };
    }, [active, bumperRef]);

    useEffect(() => {
        if (!active) return;
        if (burst <= 0) return;
        const emojis = ["🥔", "💗", "💞", "💖", "✨"];
        const now = typeof performance !== "undefined" ? performance.now() : Date.now();
        const next: FallingEmoji[] = [];
        for (let i = 0; i < 10; i++) {
            const id = idRef.current++;
            const size = Math.round(randomBetween(22, 34));
            next.push({ id, emoji: emojis[Math.floor(Math.random() * emojis.length)] ?? "💗", size });
            physRef.current.set(id, {
                x: randomBetween(20, Math.max(40, window.innerWidth - 60)),
                y: randomBetween(-120, -30),
                vx: randomBetween(-2.2, 2.2),
                vy: randomBetween(-3.6, -0.8),
                rot: randomBetween(-12, 12),
                vr: randomBetween(-2.6, 2.6),
                size,
                bornAt: now,
            });
        }
        setItems((prev) => [...prev, ...next].slice(-36));
    }, [active, burst]);

    if (!active) return null;

    return (
        <div className="pointer-events-none fixed inset-0 z-[30]">
            {items.map((it) => (
                <div
                    key={it.id}
                    ref={(el) => {
                        if (!el) return;
                        elsRef.current.set(it.id, el);
                    }}
                    className="absolute left-0 top-0"
                    style={{ width: it.size, height: it.size, fontSize: it.size, willChange: "transform" }}
                    aria-hidden
                >
                    {it.emoji}
                </div>
            ))}
        </div>
    );
}

function readReceiptMap(): Record<string, { signedAt: string }> {
    if (typeof window === "undefined") return {};
    try {
        const raw = window.localStorage.getItem("sendwishes:receipts:sorry:v1");
        if (!raw) return {};
        const parsed = JSON.parse(raw) as unknown;
        if (typeof parsed !== "object" || parsed === null) return {};
        return parsed as Record<string, { signedAt: string }>;
    } catch {
        return {};
    }
}

function writeReceipt(id: string) {
    if (typeof window === "undefined") return;
    const all = readReceiptMap();
    all[id] = { signedAt: new Date().toISOString() };
    window.localStorage.setItem("sendwishes:receipts:sorry:v1", JSON.stringify(all));
}

function useHaptics() {
    const vibrate = useCallback((pattern: number | number[]) => {
        if (typeof navigator === "undefined") return;
        if (!("vibrate" in navigator)) return;
        try {
            navigator.vibrate?.(pattern);
        } catch {
            // ignore
        }
    }, []);

    return {
        light: useCallback((ms: number) => vibrate(ms), [vibrate]),
        heavyYes: useCallback(() => vibrate([28, 45, 28]), [vibrate]),
    };
}

function useKawaiiAudio() {
    const playWindChime = useCallback(() => {
        if (typeof window === "undefined") return;
        try {
            const AudioCtx = window.AudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();

            const master = ctx.createGain();
            master.gain.setValueAtTime(0.0001, ctx.currentTime);
            master.gain.exponentialRampToValueAtTime(0.22, ctx.currentTime + 0.02);
            master.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);
            master.connect(ctx.destination);

            const base = 880;
            const freqs = [1, 1.26, 1.5].map((m) => base * m);
            freqs.forEach((f, i) => {
                const osc = ctx.createOscillator();
                osc.type = "sine";
                osc.frequency.setValueAtTime(f, ctx.currentTime);
                const g = ctx.createGain();
                g.gain.setValueAtTime(0.0001, ctx.currentTime);
                g.gain.exponentialRampToValueAtTime(0.12 / (i + 1), ctx.currentTime + 0.02);
                g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.7);
                osc.connect(g);
                g.connect(master);
                osc.start();
                osc.stop(ctx.currentTime + 0.75);
            });

            window.setTimeout(() => ctx.close().catch(() => undefined), 900);
        } catch {
            // ignore
        }
    }, []);

    const playSubThud = useCallback(() => {
        if (typeof window === "undefined") return;
        try {
            const AudioCtx = window.AudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();

            const osc = ctx.createOscillator();
            osc.type = "sine";
            osc.frequency.setValueAtTime(78, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(36, ctx.currentTime + 0.14);

            const lp = ctx.createBiquadFilter();
            lp.type = "lowpass";
            lp.frequency.value = 160;

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.0001, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.22);

            osc.connect(lp);
            lp.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.24);
            osc.onended = () => ctx.close().catch(() => undefined);
        } catch {
            // ignore
        }
    }, []);

    const playYay = useCallback(() => {
        if (typeof window === "undefined") return;
        try {
            const AudioCtx = window.AudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(520, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);
            osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.16);
            gain.gain.setValueAtTime(0.0001, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.24);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.26);
            osc.onended = () => ctx.close().catch(() => undefined);
        } catch {
            // ignore
        }
    }, []);

    return { playWindChime, playSubThud, playYay };
}

export function SorryExperience({ name, reason }: SorryExperienceProps) {
    const reduceMotion = useReducedMotion() ?? false;
    const params = useParams<{ id: string }>();
    const id = params?.id ?? "";

    useEffect(() => {
        if (typeof document === "undefined") return;
        const prevHtml = document.documentElement.style.overflow;
        const prevBody = document.body.style.overflow;
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
        return () => {
            document.documentElement.style.overflow = prevHtml;
            document.body.style.overflow = prevBody;
        };
    }, []);

    const { light, heavyYes } = useHaptics();
    const { playWindChime, playSubThud, playYay } = useKawaiiAudio();

    const [screen, setScreen] = useState<Screen>(1);
    const [, setMelt] = useState(0.08);
    const bumpMelt = useCallback((amount: number) => {
        setMelt((m) => clamp(m + amount, 0.08, 1));
    }, []);

    useEffect(() => {
        // ensure the meter always rises as you progress
        const base = 0.08 + (screen - 1) * 0.12;
        setMelt((m) => Math.max(m, clamp(base, 0.08, 0.8)));
    }, [screen]);

    const lastInteractionAtRef = useRef<number>(Date.now());
    const [idleHint, setIdleHint] = useState<string | null>(null);
    const markInteracted = useCallback(() => {
        lastInteractionAtRef.current = Date.now();
        setIdleHint(null);
    }, []);

    useEffect(() => {
        if (screen !== 1 && screen !== 2) {
            setIdleHint(null);
            return;
        }
        const hint = screen === 2 ? "Is it the rock one? It’s the rock one, isn’t it? 🪨" : "Say yes. For the plot. 🎬";
        const t = window.setTimeout(() => {
            if (Date.now() - lastInteractionAtRef.current >= 2500) setIdleHint(hint);
        }, 2500);
        return () => window.clearTimeout(t);
    }, [screen]);

    const [selected, setSelected] = useState<Record<PotatoOption, boolean>>({
        drama: false,
        rock: false,
        exited: false,
        baby: false,
    });
    const selectedCount = Object.values(selected).filter(Boolean).length;

    const [potatoBurst, setPotatoBurst] = useState(0);
    const potatoBumperRef = useRef<HTMLDivElement | null>(null);

    const [giftStage, setGiftStage] = useState<"closed" | "open">("closed");
    const [giftSadGifIndex, setGiftSadGifIndex] = useState(0);
    const [claimed, setClaimed] = useState<Record<string, boolean>>({});
    const [giftContinueReady, setGiftContinueReady] = useState(false);

    const initialBribes = useMemo<Bribe[]>(
        () => [
            { id: "cuddles", title: "Unlimited Cuddles Pass", subtitle: "redeem anytime (no cooldown)", emoji: "🎟️", tier: 1 },
            { id: "blame", title: "I’ll take the blame for 3 fights", subtitle: "even if it’s my fault (again)", emoji: "🤝", tier: 1 },
            { id: "scratch", title: "1‑Hour Head Scratch Session", subtitle: "with dramatic eye contact", emoji: "💆‍♀️", tier: 1 },
            { id: "story", title: "I’ll post us on my story", subtitle: "yes, with a cute song", emoji: "📸", tier: 1 },
        ],
        []
    );
    const [deck, setDeck] = useState<Bribe[]>(initialBribes);
    const [swipeToast, setSwipeToast] = useState<"accept" | "reject" | null>(null);
    const [penguinShockKey, setPenguinShockKey] = useState(0);
    const [bribeSwipes, setBribeSwipes] = useState(0);

    const verdictRef = useRef<HTMLDivElement | null>(null);
    const noCubeRef = useRef<HTMLButtonElement | null>(null);
    const lastDodgeAtRef = useRef<number>(0);
    const emojiTrailIdRef = useRef(1);
    const [noPos, setNoPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [noDodges, setNoDodges] = useState(0);
    const [noGone, setNoGone] = useState(false);
    const [emojiTrail, setEmojiTrail] = useState<Array<{ x: number; y: number; id: number }>>([]);
    const [accepted, setAccepted] = useState(false);
    const [penguinOverlay, setPenguinOverlay] = useState(false);
    const [hugSequence, setHugSequence] = useState<"hold" | "hug2" | "hug1">("hold");
    const hugSequenceTimersRef = useRef<number[]>([]);

    const toName = useMemo(() => safeTrim(name) || "my favorite human", [name]);
    const safeReason = useMemo(() => safeTrim(reason) || "messing up", [reason]);

    const msgBody = useMemo(() => {
        const who = toName.toLowerCase().includes("bestie") ? toName : "fav person";
        const base =
            `Hey ${who}... ` +
            `My aura is literally -10,000 right now. I’m officially in my 'Apology Era.' Pick your bribe so we can go back to being the best duo again. 🎀✨`;
        void safeReason;
        return base;
    }, [safeReason, toName]);

    useEffect(() => {
        if (screen !== 3) return;
        setGiftStage("closed");
        setGiftSadGifIndex(0);
        setClaimed({});
        setGiftContinueReady(false);
    }, [screen]);

    useEffect(() => {
        if (screen !== 3) return;
        if (giftStage !== "open") {
            setGiftContinueReady(false);
            return;
        }
        const t = window.setTimeout(() => setGiftContinueReady(true), reduceMotion ? 120 : 1400);
        return () => window.clearTimeout(t);
    }, [giftStage, reduceMotion, screen]);

    useEffect(() => {
        if (screen !== 3) return;
        if (reduceMotion) return;
        const t = window.setInterval(() => {
            setGiftSadGifIndex((i) => (i + 1) % SAD_DUDU_BUBU_GIFS.length);
        }, 1500);
        return () => window.clearInterval(t);
    }, [reduceMotion, screen]);

    const clearHugSequenceTimers = useCallback(() => {
        hugSequenceTimersRef.current.forEach((t) => window.clearTimeout(t));
        hugSequenceTimersRef.current = [];
    }, []);

    useEffect(() => {
        if (screen !== 5) {
            clearHugSequenceTimers();
            setHugSequence("hold");
            return;
        }
        clearHugSequenceTimers();
        setHugSequence("hold");
    }, [clearHugSequenceTimers, screen]);

    const confettiTinyHearts = useCallback(() => {
        const anyConfetti = confetti as unknown as {
            (opts: Record<string, unknown>): void;
            shapeFromText?: (opts: { text: string; scalar?: number }) => unknown;
        };
        const tiny = anyConfetti.shapeFromText ? anyConfetti.shapeFromText({ text: "💗", scalar: 1.0 }) : undefined;
        anyConfetti({
            particleCount: 28,
            spread: 70,
            startVelocity: 26,
            ticks: 140,
            origin: { x: 0.5, y: 0.35 },
            colors: ["#fb7185", "#f472b6", "#a78bfa", "#ffffff"],
            shapes: tiny ? [tiny] : undefined,
            scalar: 0.9,
        });
    }, []);

    const kawaiiFinale = useCallback(() => {
        const anyConfetti = confetti as unknown as {
            (opts: Record<string, unknown>): void;
            shapeFromText?: (opts: { text: string; scalar?: number }) => unknown;
        };
        const heart = anyConfetti.shapeFromText ? anyConfetti.shapeFromText({ text: "💖", scalar: 1.15 }) : undefined;
        const star = anyConfetti.shapeFromText ? anyConfetti.shapeFromText({ text: "⭐", scalar: 1.05 }) : undefined;
        const panda = anyConfetti.shapeFromText ? anyConfetti.shapeFromText({ text: "🐼", scalar: 1.05 }) : undefined;

        anyConfetti({
            particleCount: 180,
            spread: 115,
            startVelocity: 58,
            ticks: 320,
            origin: { x: 0.5, y: 0.38 },
            colors: ["#fb7185", "#f472b6", "#a78bfa", "#fde68a", "#ffffff"],
            shapes: heart || star || panda ? [heart, star, panda].filter(Boolean) : undefined,
            scalar: 1.0,
        });
    }, []);

    const acceptYes = useCallback(() => {
        if (accepted) return;
        setAccepted(true);
        setPenguinOverlay(true);
        setMelt(1);
        heavyYes();
        playYay();
        kawaiiFinale();
        if (id) writeReceipt(id);
    }, [accepted, heavyYes, id, kawaiiFinale, playYay]);

    useEffect(() => {
        if (!accepted) return;
        const ms = reduceMotion ? 1100 : 760;
        const t = window.setInterval(() => kawaiiFinale(), ms);
        return () => window.clearInterval(t);
    }, [accepted, kawaiiFinale, reduceMotion]);

    const placeNoRandom = useCallback(() => {
        const wrap = verdictRef.current;
        const btn = noCubeRef.current;
        if (!wrap || !btn) return;
        const wrapRect = wrap.getBoundingClientRect();
        const btnRect = btn.getBoundingClientRect();
        const maxX = Math.max(0, wrapRect.width - btnRect.width);
        const maxY = Math.max(0, wrapRect.height - btnRect.height);
        const nextX = randomBetween(0, maxX);
        const nextY = randomBetween(70, Math.max(80, maxY));
        setNoPos({ x: clamp(nextX, 0, maxX), y: clamp(nextY, 70, maxY) });
    }, []);

    useEffect(() => {
        if (screen !== 6) return;
        setNoGone(false);
        setNoDodges(0);
        setEmojiTrail([]);
        emojiTrailIdRef.current = 1;
        const t = window.setTimeout(() => placeNoRandom(), 60);
        return () => window.clearTimeout(t);
    }, [placeNoRandom, screen]);

    const dodgeNoCube = useCallback(() => {
        if (accepted || noGone) return;
        const now = typeof performance !== "undefined" ? performance.now() : Date.now();
        if (now - lastDodgeAtRef.current < 220) return;
        lastDodgeAtRef.current = now;
        light(10);

        setEmojiTrail((prev) => {
            const next = [...prev, { x: noPos.x + 8, y: noPos.y + 12, id: emojiTrailIdRef.current++ }];
            return next.slice(-10);
        });

        setNoDodges((n) => {
            const next = n + 1;
            if (next >= 4) {
                setNoGone(true);
                return next;
            }
            window.setTimeout(() => placeNoRandom(), 0);
            return next;
        });
    }, [accepted, light, noGone, noPos.x, noPos.y, placeNoRandom]);

    const letterpressStyle: CSSProperties = {
        textShadow: "0 1px 0 rgba(255,255,255,0.35), 0 18px 45px rgba(0,0,0,0.25)",
    };

    const pinkLavaBackground = (
        <motion.div
            aria-hidden
            className="absolute inset-0"
            initial={false}
            animate={
                reduceMotion
                    ? undefined
                    : {
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                        filter: ["hue-rotate(0deg)", "hue-rotate(10deg)", "hue-rotate(0deg)"],
                    }
            }
            transition={reduceMotion ? undefined : { duration: 14, repeat: Infinity, ease: "easeInOut" }}
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
            animate={reduceMotion ? undefined : { backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
            transition={reduceMotion ? undefined : { duration: 16, repeat: Infinity, ease: "easeInOut" }}
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
            animate={reduceMotion ? undefined : { filter: ["saturate(1)", "saturate(1.15)", "saturate(1)"] }}
            transition={reduceMotion ? undefined : { duration: 10, repeat: Infinity, ease: "easeInOut" }}
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
            animate={reduceMotion ? undefined : { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={reduceMotion ? undefined : { duration: 8.5, repeat: Infinity, ease: "easeInOut" }}
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

    useEffect(() => {
        if (screen !== 4) return;
        setDeck(initialBribes);
        setSwipeToast(null);
        setBribeSwipes(0);
    }, [initialBribes, screen]);

    useEffect(() => {
        if (screen !== 4) return;
        if (bribeSwipes < 4) return;

        markInteracted();
        bumpMelt(0.06);
        const t = window.setTimeout(() => setScreen(5), reduceMotion ? 0 : 240);
        return () => window.clearTimeout(t);
    }, [bribeSwipes, bumpMelt, markInteracted, reduceMotion, screen]);

    return (
        <div className="fixed inset-0 h-dvh w-full overflow-hidden overscroll-none bg-pink-50">
            <AnimatePresence initial={false} mode="wait">
                <motion.div
                    key={`bg-${screen}`}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: reduceMotion ? 0.01 : 0.6, ease: "easeOut" }}
                >
                    {screen === 1 ? pinkLavaBackground : null}
                    {screen === 2 ? peachCloudBackground : null}
                    {screen === 3 ? glitterSandBackground : null}
                    {screen === 4 ? (
                        <div aria-hidden className="absolute inset-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/assets/penguin-spread-love.gif"
                                alt=""
                                className="absolute inset-0 h-full w-full object-cover opacity-35"
                                draggable={false}
                            />
                            {pinkLavaBackground}
                        </div>
                    ) : null}
                    {screen === 5 ? peachCloudBackground : null}
                    {screen === 6 ? sugarSparkleBackground : null}

                    <div
                        className="absolute inset-0 opacity-[0.12] mix-blend-overlay"
                        style={{ backgroundImage: `url(${GRAIN_DATA_URI})` }}
                    />
                </motion.div>
            </AnimatePresence>

            <FallingEmojiLayer active={screen === 2} burst={potatoBurst} bumperRef={potatoBumperRef} />

            <div className={fredoka.className + " relative z-10 flex h-dvh w-full items-center justify-center py-10 " + (screen != 6 ? "px-6" : "")}>
                {idleHint ? (
                    <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        className="pointer-events-none absolute left-5 top-6 z-[70] max-w-[240px]"
                    >
                        <div className="relative rounded-[1.4rem] border border-white/30 bg-white/22 p-4 backdrop-blur-xl">
                            <div className={fredoka.className + " text-xs font-semibold text-zinc-900/75"}>{idleHint}</div>
                            <div className="absolute -bottom-2 left-7 h-4 w-4 rotate-45 border-b border-r border-white/30 bg-white/22" />
                        </div>
                    </motion.div>
                ) : null}

                <AnimatePresence mode="wait">
                    {screen === 1 ? (
                        <motion.div
                            key="s1"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="w-full max-w-3xl text-center"
                        >
                            <div className="mx-auto flex w-full items-center justify-center">
                                <FirstScreenCarousel />
                            </div>

                            {/* <h1
                  className={fredoka.className + " mt-10 text-balance text-3xl font-semibold tracking-tight text-zinc-900 sm:text-5xl"}
                  style={letterpressStyle}
                >
                  Pls don't be mad at me... 🥺
                </h1> */}
                            <p
                                className={fredoka.className + " mx-auto mt-5 max-w-2xl text-pretty text-sm font-medium text-zinc-900/70 sm:text-base"}
                                style={letterpressStyle}
                            >
                                Someone who is basically a giant goofball sent this because they miss your face. Can we talk?
                            </p>

                            <div className="mt-12 flex justify-center">
                                <motion.button
                                    type="button"
                                    onClick={() => setScreen(2)}
                                    aria-label="Oki fine"
                                    className="relative inline-flex h-14 w-[min(70vw,420px)] items-center justify-center rounded-full"
                                    whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                                    onPointerDown={markInteracted}
                                >
                                    <div
                                        className="absolute inset-0 rounded-full"
                                        style={{
                                            background:
                                                "radial-gradient(circle at 30% 25%, rgba(193,40,181,0.95), rgba(251,113,133,0.9) 45%, rgba(244,114,182,0.65) 78%)",
                                        }}
                                    />
                                    <div
                                        aria-hidden
                                        className="absolute inset-0 rounded-full"
                                        style={{
                                            boxShadow: "inset 0 2px 6px rgba(255,255,255,0.55), inset 0 -10px 18px rgba(0,0,0,0.18)",
                                        }}
                                    />
                                    <span className={fredoka.className + " relative text-sm font-semibold tracking-tight text-white"}>
                                        Oki, fine. 💖
                                    </span>
                                </motion.button>
                            </div>
                        </motion.div>
                    ) : null}

                    {screen === 2 ? (
                        <motion.div
                            key="s2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="w-full max-w-3xl"
                        >
                            <div className="text-center">
                                <h2
                                    className={fredoka.className + " text-balance text-3xl font-semibold tracking-tight text-zinc-900 sm:text-5xl"}
                                    style={{ textShadow: "0 18px 45px rgba(0,0,0,0.55)" }}
                                >
                                    Why was I being such a potato? 🥔
                                </h2>
                            </div>

                            <div ref={potatoBumperRef} className="mt-6 flex flex-wrap items-center justify-center gap-5">
                                {([
                                    ["drama", "I was being a drama queen. 👑"],
                                    ["rock", "My last two brain cells were fighting. 🥊 🪨"],
                                    ["exited", "My brain just... exited the chat. 📉"],
                                    ["baby", "I'm just a baby, pls forgive. 🍼"],
                                ] as const).map(([key, label]) => {
                                    const isOn = selected[key];
                                    return (
                                        <motion.button
                                            key={key}
                                            type="button"
                                            onClick={() => {
                                                markInteracted();
                                                setSelected((prev) => {
                                                    const next = { ...prev, [key]: !prev[key] } as typeof prev;
                                                    const nowOn = next[key] === true;
                                                    if (nowOn) {
                                                        playWindChime();
                                                        light(12);
                                                        confettiTinyHearts();
                                                        bumpMelt(0.07);
                                                        setPotatoBurst((b) => b + 1);
                                                    }
                                                    return next;
                                                });
                                            }}
                                            whileHover={reduceMotion ? undefined : { y: -2, scale: 1.02 }}
                                            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                                            className={
                                                "relative flex h-[104px] w-[min(92vw,260px)] flex-col items-center justify-center rounded-full border backdrop-blur-xl transition-all " +
                                                (isOn
                                                    ? "border-white/40 bg-[rgb(135_38_38_/_25%)] shadow-xl shadow-pink-200/30"
                                                    : "border-white/25 bg-white/14 shadow-lg shadow-black/10")
                                            }
                                        >
                                            <div className={fredoka.className + " px-4 text-center text-sm font-semibold text-zinc-900/80"}>
                                                {label}
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </div>

                            <div className="mt-12 flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={() => setScreen(1)}
                                    className={fredoka.className + " text-xs font-semibold tracking-[0.2em] text-zinc-900/60"}
                                >
                                    BACK
                                </button>

                                <motion.button
                                    type="button"
                                    disabled={selectedCount === 0}
                                    onClick={() => {
                                        markInteracted();
                                        bumpMelt(0.06);
                                        setScreen(3);
                                    }}
                                    whileHover={reduceMotion || selectedCount === 0 ? undefined : { scale: 1.02 }}
                                    whileTap={reduceMotion || selectedCount === 0 ? undefined : { scale: 0.99 }}
                                    className={
                                        "relative inline-flex h-12 items-center justify-center rounded-full px-8 text-sm font-semibold " +
                                        "text-white ring-1 ring-white/30 backdrop-blur-xl " +
                                        (selectedCount > 0
                                            ? "bg-white/18 shadow-lg shadow-pink-200/30"
                                            : "bg-white/10 opacity-40")
                                    }
                                    style={{ backgroundImage: "linear-gradient(135deg, rgba(151,59,59,0.25), rgba(255,255,255,0.05))" }}
                                >
                                    <span className={fredoka.className}>CONTINUE ✨</span>
                                </motion.button>
                            </div>
                        </motion.div>
                    ) : null}

                    {screen === 3 ? (
                        <motion.div
                            key="s3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex w-full flex-col items-center px-4 pt-10"
                        >
                            {/* 1. Automated GIF Section */}
                            <div className="text-center">
                                <div className="mx-auto h-[120px] sm:h-[150px]">
                                    <motion.img
                                        src={SAD_DUDU_BUBU_GIFS[giftSadGifIndex]}
                                        alt="Cute Panda"
                                        className="mx-auto h-full w-auto"
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.2, duration: 0.5 }}
                                    />
                                </div>

                                <motion.h2
                                    className={fredoka.className + " mt-8 text-3xl font-bold text-zinc-900"}
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    Ab maan bhi jao...
                                </motion.h2>
                            </div>

                            {/* 2. The Auto-Revealing Content */}
                            <div className="relative mt-8 w-full max-w-[500px]">
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
                                    className="relative overflow-hidden rounded-[3rem] border border-white/40 bg-white/20 p-8 shadow-2xl backdrop-blur-3xl"
                                >
                                    {/* Subtle Background Glow for the Letter */}
                                    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-pink-200/20 to-purple-200/20 opacity-50" />

                                    <div className={fredoka.className + " relative text-center"}>
                                        {/* Main Message */}
                                        <p className="text-lg leading-relaxed font-semibold text-zinc-800/90">
                                            {msgBody}
                                        </p>

                                        {/* 2x2 Selection Grid */}
                                        <div className="mt-6 grid grid-cols-2 gap-4">
                                            {(
                                                [
                                                    ["drive", "🍦", "Late night Drive & Ice Cream"],
                                                    ["momos", "🥟", "Unlimited Momos Party"],
                                                    ["hugs", "🤗", "1-Hour Non-stop Jhappi (Hugs)"],
                                                    ["arijit", "🎶", "I'll play your favorite Arijit songs"],
                                                ] as const
                                            ).map(([k, emoji, label]) => {
                                                const isSelected = claimed[k] === true;
                                                return (
                                                    <motion.button
                                                        key={k}
                                                        type="button"
                                                        onClick={() => {
                                                            markInteracted();
                                                            setClaimed((prev) => {
                                                                const nextOn = !(prev[k] === true);
                                                                const next = { ...prev, [k]: nextOn };
                                                                if (nextOn) {
                                                                    bumpMelt(0.05);
                                                                    playWindChime();
                                                                }
                                                                return next;
                                                            });
                                                        }}
                                                        whileTap={{ scale: 0.95 }}
                                                        className={
                                                            "relative aspect-square w-full overflow-hidden rounded-3xl border bg-white/20 p-4 text-left backdrop-blur-md transition-all duration-200 " +
                                                            (isSelected
                                                                ? "border-pink-400/80 ring-2 ring-pink-300/40 shadow-lg shadow-pink-200/40"
                                                                : "border-white/45 shadow-sm shadow-black/5")
                                                        }
                                                    >
                                                        <div className="absolute inset-0 opacity-70" aria-hidden>
                                                            <div className="absolute -left-8 -top-10 h-28 w-28 rounded-full bg-white/35 blur-2xl" />
                                                            <div className="absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-pink-200/30 blur-2xl" />
                                                        </div>

                                                        {isSelected ? (
                                                            <div className="absolute right-3 top-3 rounded-full bg-white/65 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-pink-600 ring-1 ring-pink-200/70 backdrop-blur-md">
                                                                selected
                                                            </div>
                                                        ) : null}

                                                        <div className="relative flex h-full flex-col items-center justify-center text-center">
                                                            <div className="text-3xl" aria-hidden>
                                                                {emoji}
                                                            </div>
                                                            <div className="mt-3 text-sm font-extrabold leading-snug text-zinc-900/80">{label}</div>
                                                        </div>
                                                    </motion.button>
                                                );
                                            })}
                                        </div>

                                        {/* Auto-appearing Continue Button */}
                                        <AnimatePresence>
                                            {giftContinueReady && (
                                                <motion.button
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    onClick={() => {
                                                        playSubThud();
                                                        setScreen(4);
                                                    }}
                                                    className="mt-10 flex h-16 w-full items-center justify-center rounded-full bg-zinc-900 font-bold text-white shadow-xl hover:bg-zinc-800 transition-colors"
                                                >
                                                    Continue to Peace Treaty ✨
                                                </motion.button>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Footer Navigation */}
                            {/* <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.5 }}
      whileHover={{ opacity: 1 }}
      onClick={() => setScreen(2)}
      className={fredoka.className + " mt-12 text-xs font-bold tracking-widest text-zinc-500 uppercase"}
    >
      ← Go Back
    </motion.button> */}
                            <motion.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                onClick={() => {
                                    playSubThud();
                                    setScreen(4);
                                }}
                                className="mt-8 h-14 w-full rounded-full bg-gradient-to-r from-pink-400 to-rose-400 font-bold text-white shadow-lg shadow-pink-200 lg:w-[min(70vw,420px)] transition-transform hover:scale-[1.02]"
                            >
                                Continue ✨
                            </motion.button>
                        </motion.div>
                    ) : null}

                    {screen === 4 ? (
                        <motion.div
                            key="s4"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="w-full max-w-4xl"
                        >
                            <div className="text-center">
                                <h1 className={fredoka.className + " text-balance text-3xl font-semibold tracking-tight text-zinc-900 sm:text-5xl"}>
                                    My Forgiveness Bribe Inventory 🎁
                                </h1>
                                <div className={fredoka.className + " mt-4 text-sm font-medium text-zinc-900/70"}>
                                    swipe right to accept. swipe left to demand better.
                                </div>
                            </div>

                            <div className="relative mt-10 flex items-center justify-center">
                                <div className="relative h-[380px] w-[85vw] max-w-[520px]">
                                    <AnimatePresence>
                                        {swipeToast ? (
                                            <motion.div
                                                key={swipeToast}
                                                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                                                transition={{ duration: 0.22, ease: "easeOut" }}
                                                className={
                                                    "absolute left-1/2 top-[-18px] z-20 -translate-x-1/2 rounded-full px-5 py-2 text-sm font-bold ring-1 backdrop-blur-xl " +
                                                    (swipeToast === "accept"
                                                        ? "bg-emerald-50/70 text-emerald-900 ring-emerald-200/60"
                                                        : "bg-rose-50/70 text-rose-900 ring-rose-200/60")
                                                }
                                            >
                                                {swipeToast === "accept" ? "Accepted! ✅" : "Try harder! ❌"}
                                            </motion.div>
                                        ) : null}
                                    </AnimatePresence>

                                    {(deck.slice(0, 3) as Bribe[])
                                        .slice()
                                        .reverse()
                                        .map((card, revIndex, arr) => {
                                            const depth = arr.length - 1 - revIndex; // 0 = top (deck[0])
                                            const isTop = depth === 0;
                                            const tilt = isTop ? 0 : depth === 1 ? -4 : 4;
                                            const y = isTop ? 0 : depth * 10;
                                            return (
                                                <motion.div
                                                    key={card.id}
                                                    className="absolute inset-0"
                                                    style={{ zIndex: 10 - depth }}
                                                    initial={{ opacity: 0, scale: 0.98 }}
                                                    animate={{ opacity: 1, scale: 1, y }}
                                                    exit={{ opacity: 0, scale: 0.98 }}
                                                    transition={{ duration: reduceMotion ? 0.01 : 0.25, ease: "easeOut" }}
                                                >
                                                    <motion.div
                                                        drag={isTop ? "x" : false}
                                                        dragConstraints={{ left: 0, right: 0 }}
                                                        whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                                                        onDragStart={() => markInteracted()}
                                                        onDragEnd={(_, info) => {
                                                            if (!isTop) return;
                                                            const x = info.offset.x;
                                                            if (Math.abs(x) < 120) return;

                                                            setBribeSwipes((n) => n + 1);

                                                            if (x > 0) {
                                                                setSwipeToast("accept");
                                                                bumpMelt(0.09);
                                                                confettiTinyHearts();
                                                                playYay();
                                                                window.setTimeout(() => setSwipeToast(null), 650);
                                                                setDeck((prev) => prev.slice(1));
                                                            } else {
                                                                setSwipeToast("reject");
                                                                light(12);
                                                                setPenguinShockKey((k) => k + 1);
                                                                window.setTimeout(() => setSwipeToast(null), 650);
                                                                setDeck((prev) => {
                                                                    const [top, ...rest] = prev;
                                                                    if (!top) return prev;
                                                                    const upgraded: Bribe = {
                                                                        ...top,
                                                                        id: `${top.id}-v2-${Date.now()}`,
                                                                        tier: 2,
                                                                        title: "OK OK, how about this??",
                                                                        subtitle: `${top.subtitle} + extra boba + extra apologies 💖`,
                                                                        emoji: "🥺✨",
                                                                    };
                                                                    return [upgraded, ...rest];
                                                                });
                                                            }
                                                        }}
                                                        className="h-full w-full"
                                                    >
                                                        <div
                                                            className="h-full w-full rounded-[2.5rem] border border-white/35 bg-white/65 p-6 backdrop-blur-2xl"
                                                            style={{ boxShadow: "0 35px 90px rgba(0,0,0,0.18)", transform: `rotate(${tilt}deg)` }}
                                                        >
                                                            <div className="h-full rounded-[2rem] bg-white p-6 ring-1 ring-zinc-200">
                                                                <div className="flex items-start justify-between">
                                                                    <div className={fredoka.className + " text-xs font-semibold tracking-[0.2em] text-zinc-500"}>
                                                                        BRIBE #{Math.min(4, Math.max(1, 5 - deck.length))}
                                                                    </div>
                                                                    <div className="text-3xl" aria-hidden>
                                                                        {card.emoji}
                                                                    </div>
                                                                </div>
                                                                <div className={fredoka.className + " mt-6 text-balance text-2xl font-semibold text-zinc-900"}>
                                                                    {card.title}
                                                                </div>
                                                                <div className={fredoka.className + " mt-3 text-sm font-semibold text-zinc-600"}>
                                                                    {card.subtitle}
                                                                </div>

                                                                <div className={fredoka.className + " mt-8 text-center text-xs font-semibold tracking-[0.22em] text-zinc-500"}>
                                                                    {isTop ? "SWIPE → ACCEPT / ← REJECT" : ""}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                </motion.div>
                                            );
                                        })}

                                    {deck.length === 0 ? (
                                        <div className={fredoka.className + " absolute inset-0 flex items-center justify-center text-center text-sm font-semibold text-zinc-900/70"}>
                                            Bribes reviewed. Ready for the hug? 🥺
                                        </div>
                                    ) : null}
                                </div>
                            </div>

                            <div className="mt-10 flex items-center justify-start">
                                <button
                                    type="button"
                                    onClick={() => setScreen(3)}
                                    className={fredoka.className + " text-xs font-semibold tracking-[0.2em] text-zinc-900/60"}
                                >
                                    BACK
                                </button>
                            </div>

                            <motion.div
                                key={penguinShockKey}
                                className="pointer-events-none fixed inset-0 z-[25]"
                                initial={{ opacity: 0 }}
                                animate={penguinShockKey > 0 ? { opacity: [0, 0.16, 0] } : { opacity: 0 }}
                                transition={{ duration: 0.75, ease: "easeOut" }}
                                aria-hidden
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="/assets/penguin-spread-love.gif" alt="" className="h-full w-full object-cover" draggable={false} />
                            </motion.div>
                        </motion.div>
                    ) : null}

                    {screen === 5 ? (
                        <motion.div
                            key="s5"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="w-full max-w-4xl text-center"
                        >
                            {hugSequence === "hold" ? (
                                <>
                                    <h1 className={fredoka.className + " text-balance text-3xl font-semibold tracking-tight text-zinc-900 sm:text-6xl"}>
                                        Calibration required: I need a hug 🤍
                                    </h1>
                                    <div className={fredoka.className + " mx-auto mt-5 max-w-xl text-sm font-semibold text-zinc-900/70"}>
                                        press and hold the heart for 3 seconds.
                                    </div>

                                    <HugHold
                                        reduceMotion={reduceMotion}
                                        onComplete={() => {
                                            markInteracted();
                                            bumpMelt(0.14);
                                            heavyYes();

                                            clearHugSequenceTimers();
                                            setHugSequence("hug2");

                                            const t1 = window.setTimeout(() => setHugSequence("hug1"), reduceMotion ? 120 : 2000);
                                            const t2 = window.setTimeout(() => setScreen(6), reduceMotion ? 240 : 5000);
                                            hugSequenceTimersRef.current = [t1, t2];
                                        }}
                                    />
                                </>
                            ) : (
                                <div className="mt-8 flex items-center justify-center">
                                    <AnimatePresence mode="wait">
                                        <motion.img
                                            key={hugSequence}
                                            src={hugSequence === "hug2" ? "/assets/hug2.gif" : "/assets/hug1.gif"}
                                            alt={hugSequence === "hug2" ? "Hug" : "Hug"}
                                            className="h-[240px] w-auto select-none"
                                            initial={{ opacity: 0, scale: 0.98, y: 6 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.98, y: -6 }}
                                            transition={{ duration: reduceMotion ? 0.01 : 0.75, ease: "easeOut" }}
                                            draggable={false}
                                        />
                                    </AnimatePresence>
                                </div>
                            )}

                            {/* <div className="mt-10 flex justify-start">
                  <button
                    type="button"
                    onClick={() => setScreen(4)}
                    className={fredoka.className + " text-xs font-semibold tracking-[0.2em] text-zinc-900/60"}
                    disabled={hugSequence !== "hold"}
                  >
                    BACK
                  </button>
                </div> */}
                        </motion.div>
                    ) : null}

                    {screen === 6 ? (
                        //   <motion.div
                        //     key="s6"
                        //     initial={{ opacity: 0, y: 10 }}
                        //     animate={{ opacity: 1, y: 0 }}
                        //     exit={{ opacity: 0, y: -10 }}
                        //     transition={{ duration: 0.25, ease: "easeOut" }}
                        //     className="w-full max-w-4xl text-center"
                        //   >
                        //     <h1 className={fredoka.className + " text-balance text-3xl font-semibold tracking-tight text-zinc-900 sm:text-6xl"}>
                        //       Is the ice finally melted? 🧊🔥
                        //     </h1>

                        //     <div ref={verdictRef} className="relative mx-auto mt-12 min-h-[300px] w-full max-w-2xl">
                        //       <AnimatePresence>
                        //         {emojiTrail.map((p) => (
                        //           <motion.div
                        //             key={p.id}
                        //             className="absolute text-lg"
                        //             style={{ left: p.x, top: p.y }}
                        //             initial={{ opacity: 0, scale: 0.9 }}
                        //             animate={{ opacity: 0.85, scale: 1 }}
                        //             exit={{ opacity: 0 }}
                        //             transition={{ duration: reduceMotion ? 0.01 : 0.35, ease: "easeOut" }}
                        //             aria-hidden
                        //           >
                        //             😢
                        //           </motion.div>
                        //         ))}
                        //       </AnimatePresence>

                        //       {noGone ? null : (
                        //         <motion.button
                        //           ref={noCubeRef}
                        //           type="button"
                        //           onPointerEnter={dodgeNoCube}
                        //           onClick={dodgeNoCube}
                        //           className="absolute"
                        //           style={{ left: noPos.x, top: noPos.y }}
                        //           aria-label="No"
                        //           animate={reduceMotion ? undefined : { rotate: [0, -2, 2, -2, 0] }}
                        //           transition={reduceMotion ? undefined : { duration: 0.7, repeat: Infinity, ease: "easeInOut" }}
                        //         >
                        //           <div
                        //             className={
                        //               "h-12 w-12 rounded-xl border border-sky-200/70 bg-white/40 backdrop-blur-xl shadow-lg shadow-white/30 " +
                        //               (noDodges >= 3 ? "h-8 w-24 rounded-[999px] border-sky-200/40 bg-sky-50/35" : "")
                        //             }
                        //             style={{
                        //               boxShadow: "inset 0 2px 8px rgba(255,255,255,0.55), inset 0 -10px 16px rgba(0,0,0,0.08)",
                        //             }}
                        //           />
                        //           <div className={fredoka.className + " mt-2 text-[11px] font-semibold text-zinc-900/70"}>
                        //             {noDodges >= 3 ? "Wait, I'm melting..." : "NO"}
                        //           </div>
                        //         </motion.button>
                        //       )}

                        //       <motion.button
                        //         type="button"
                        //         onClick={acceptYes}
                        //         whileHover={reduceMotion || accepted ? undefined : { scale: 1.02 }}
                        //         whileTap={reduceMotion || accepted ? undefined : { scale: 0.99 }}
                        //         className={
                        //           "mx-auto inline-flex items-center justify-center rounded-full px-12 text-sm font-semibold tracking-tight text-white ring-1 ring-white/30 backdrop-blur-xl " +
                        //           (noGone
                        //             ? "h-16 bg-pink-500/70 text-base shadow-2xl shadow-pink-200/40"
                        //             : "h-14 bg-white/20")
                        //         }
                        //       >
                        //         <span className={fredoka.className}>{noGone ? "YES, I LOVE YOU" : "YES"}</span>
                        //       </motion.button>
                        //     </div>

                        //     <div className="mt-10 flex justify-start">
                        //       <button
                        //         type="button"
                        //         onClick={() => setScreen(5)}
                        //         className={fredoka.className + " text-xs font-semibold tracking-[0.2em] text-zinc-900/60"}
                        //       >
                        //         BACK
                        //       </button>
                        //     </div>

                        //     {penguinOverlay ? (
                        //       <div aria-hidden className="pointer-events-none fixed inset-0 z-[90]">
                        //         {/* eslint-disable-next-line @next/next/no-img-element */}
                        //         <img
                        //           src="/assets/penguin-spread-love.gif"
                        //           alt=""
                        //           className="h-full w-full object-cover opacity-70"
                        //           draggable={false}
                        //         />
                        //       </div>
                        //     ) : null}
                        //   </motion.div>

                        //             <motion.div
                        //     key="s6"
                        //     initial={{ opacity: 0 }}
                        //     animate={{ opacity: 1 }}
                        //     className="relative h-screen w-full overflow-hidden bg-zinc-950"
                        //     onPointerMove={(e) => {
                        //       // Logic for the "Thermal Paintbrush" cursor tracking
                        //       const rect = e.currentTarget.getBoundingClientRect();
                        //       const x = ((e.clientX - rect.left) / rect.width) * 100;
                        //       const y = ((e.clientY - rect.top) / rect.height) * 100;
                        //       e.currentTarget.style.setProperty("--x", `${x}%`);
                        //       e.currentTarget.style.setProperty("--y", `${y}%`);
                        //     }}
                        //     onClick={() => {
                        //       // Logic for "The Smash" clicks
                        //       if (noDodges < 5) setNoDodges(prev => prev + 1);
                        //       if (noDodges >= 4) setNoGone(true);
                        //     }}
                        //   >
                        //     {/* 1. THE HIDDEN REWARD (The GIF) */}
                        //     <div className="absolute inset-0 flex items-center justify-center">
                        //       <img
                        //         src="/assets/bunny-kiss.gif"
                        //         alt="Success"
                        //         className="h-full w-full object-cover"
                        //       />
                        //       {/* Warm Glow Overlay once melted */}
                        //       <motion.div 
                        //         animate={{ opacity: noGone ? 0 : 0.6 }}
                        //         className="absolute inset-0 bg-zinc-950" 
                        //       />
                        //     </div>

                        //     {/* 2. THE FROZEN BARRIER (Interactive Layer) */}
                        //     {!noGone && (
                        //       <motion.div
                        //         exit={{ y: 1000, rotate: 10, opacity: 0 }}
                        //         transition={{ duration: 0.8, ease: "backIn" }}
                        //         className="absolute inset-0 z-10 cursor-crosshair backdrop-blur-[40px]"
                        //         style={{
                        //           background: "rgba(200, 230, 255, 0.2)",
                        //           // This creates the "Defrost" hole where the mouse is
                        //           WebkitMaskImage: `radial-gradient(circle 150px at var(--x, 50%) var(--y, 50%), transparent 0%, black 100%)`,
                        //           maskImage: `radial-gradient(circle 150px at var(--x, 50%) var(--y, 50%), transparent 0%, black 100%)`,
                        //         }}
                        //       >
                        //         {/* Frost Texture Overlay */}
                        //         <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/ice-age.png')]" />

                        //         {/* Instructional Text - Fades as you click */}
                        //         <div className="flex h-full flex-col items-center justify-center text-center">
                        //           <motion.h2 
                        //             animate={{ opacity: [0.4, 0.7, 0.4] }}
                        //             transition={{ repeat: Infinity, duration: 2 }}
                        //             className={fredoka.className + " text-2xl font-light tracking-[0.4em] text-white pointer-events-none uppercase"}
                        //           >
                        //             {noDodges === 0 ? "Smash the Ice" : `Break it! (${5 - noDodges})`}
                        //           </motion.h2>
                        //         </div>

                        //         {/* Crack Effects: Spawns lines where you've clicked */}
                        //         {[...Array(noDodges)].map((_, i) => (
                        //           <motion.div
                        //             key={i}
                        //             initial={{ scale: 0, opacity: 0 }}
                        //             animate={{ scale: 1, opacity: 1 }}
                        //             className="absolute pointer-events-none"
                        //             style={{
                        //               top: `${20 + (i * 15)}%`,
                        //               left: `${15 + (i * 20)}%`,
                        //             }}
                        //           >
                        //             <svg width="200" height="200" viewBox="0 0 200 200" className="stroke-white/40 fill-none">
                        //               <path d="M0,100 L50,80 L100,120 L150,70 L200,100 M100,0 L120,50 L80,100 L130,150 L100,200" strokeWidth="1" />
                        //             </svg>
                        //           </motion.div>
                        //         ))}
                        //       </motion.div>
                        //     )}

                        //     {/* 3. POST-SMASH UI (Final Message) */}
                        //     {noGone && (
                        //       <motion.div 
                        //         initial={{ opacity: 0, y: 20 }}
                        //         animate={{ opacity: 1, y: 0 }}
                        //         className="absolute inset-x-0 bottom-20 z-20 text-center"
                        //       >
                        //         <h1 className={fredoka.className + " text-6xl font-black text-white drop-shadow-2xl"}>
                        //           FREEDOM! ❤️
                        //         </h1>
                        //         <button
                        //            onClick={() => setScreen(1)}
                        //            className="mt-6 text-[10px] font-bold tracking-widest text-white/60 hover:text-white"
                        //         >
                        //           START OVER
                        //         </button>
                        //       </motion.div>
                        //     )}

                        //     {/* Ambient Particle System (Cold air / Steam) */}
                        //     <div className="pointer-events-none absolute inset-0 z-[5]">
                        //       {[...Array(10)].map((_, i) => (
                        //         <motion.div
                        //           key={i}
                        //           animate={{ 
                        //             y: [-20, 20], 
                        //             x: [-10, 10],
                        //             opacity: [0, 0.3, 0] 
                        //           }}
                        //           transition={{ duration: 3 + i, repeat: Infinity, ease: "linear" }}
                        //           className="absolute h-32 w-32 bg-sky-200/20 blur-[60px] rounded-full"
                        //           style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
                        //         />
                        //       ))}
                        //     </div>
                        //             </motion.div>
                        <motion.div
                            key="s6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="relative h-screen w-full overflow-hidden bg-black"
                            onPointerMove={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const x = ((e.clientX - rect.left) / rect.width) * 100;
                                const y = ((e.clientY - rect.top) / rect.height) * 100;
                                e.currentTarget.style.setProperty("--x", `${x}%`);
                                e.currentTarget.style.setProperty("--y", `${y}%`);
                            }}
                            onClick={() => {
                                if (noDodges < 5) setNoDodges((prev) => prev + 1);
                                if (noDodges >= 4) setNoGone(true);
                            }}
                        >
                            {/* 1. THE REWARD LAYER */}
                            <div className="absolute inset-0 z-0 flex flex-col items-center justify-center bg-black px-6">
                                <AnimatePresence>
                                    {noGone && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex flex-col items-center w-full max-w-md"
                                        >
                                            {/* The Text Card (Matches Screenshot) */}
                                            <div className="w-full rounded-[32px] border border-zinc-800 bg-zinc-900/50 p-8 text-center backdrop-blur-xl">
                                                <h1 className={fredoka.className + " flex items-center justify-center gap-3 text-5xl font-bold text-white sm:text-6xl"}>
                                                    Yayyyy!!! <span className="text-red-500">❤️</span>
                                                </h1>
                                                <p className={fredoka.className + " mt-4 flex items-center justify-center gap-2 text-lg text-zinc-300 sm:text-xl"}>
                                                    The tension was 📈, but the love is ♾️
                                                </p>
                                            </div>

                                            {/* The Bunny GIF */}
                                            <motion.div
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ delay: 0.3 }}
                                                className="my-12"
                                            >
                                                <img
                                                    src="/assets/bunny-kiss.gif"
                                                    alt="Bunnies"
                                                    className="h-48 w-auto object-contain sm:h-64"
                                                />
                                            </motion.div>

                                            {/* The Animated "Back" Button */}
                                            <motion.button
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.8 }}
                                                onClick={() => setScreen(1)}
                                                className="group relative flex flex-col items-center"
                                            >
                                                <div className="rounded-full bg-white px-10 py-3 text-sm font-bold uppercase tracking-widest text-black transition-all group-hover:scale-110 group-active:scale-95">
                                                    CELEBRATE AGAIN
                                                </div>
                                                <p className="mt-4 text-[10px] font-medium tracking-[0.3em] text-zinc-500 uppercase">
                                                    Reset the magic
                                                </p>
                                            </motion.button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* 2. THE INTERACTIVE ICE BARRIER */}
                            <AnimatePresence>
                                {!noGone && (
                                    <motion.div
                                        key="ice-barrier"
                                        exit={{ y: "100%", opacity: 0 }}
                                        transition={{ duration: 0.8, ease: [0.32, 0, 0.67, 0] }}
                                        className="absolute inset-0 z-20 cursor-crosshair backdrop-blur-[60px]"
                                        style={{
                                            background: "rgba(255, 255, 255, 0.03)",
                                            WebkitMaskImage: `radial-gradient(circle 120px at var(--x, 50%) var(--y, 50%), transparent 0%, black 70%)`,
                                            maskImage: `radial-gradient(circle 120px at var(--x, 50%) var(--y, 50%), transparent 0%, black 70%)`,
                                        }}
                                    >
                                        <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                                            <h2 className={fredoka.className + " text-3xl font-black tracking-widest text-white/40 sm:text-5xl"}>
                                                {noDodges === 0 ? "SMASH TO UNLOCK" : "ALMOST THERE..."}
                                            </h2>
                                            {/* Progress Indicator */}
                                            <div className="mt-8 flex gap-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={`h-1 w-8 rounded-full transition-colors duration-300 ${noDodges > i ? 'bg-white shadow-[0_0_10px_white]' : 'bg-white/10'}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        {/* Steam Trail */}
                                        <div
                                            className="pointer-events-none absolute h-32 w-32 rounded-full bg-blue-400/10 blur-[40px]"
                                            style={{ left: 'calc(var(--x) - 64px)', top: 'calc(var(--y) - 64px)' }}
                                        />

                                        {/* Crack Lines */}
                                        {[...Array(noDodges)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1.2, opacity: 1 }}
                                                className="absolute pointer-events-none"
                                                style={{ top: `${20 + (i * 15)}%`, left: `${10 + (i * 20)}%` }}
                                            >
                                                <svg width="200" height="200" viewBox="0 0 200 200" className="stroke-white/10 fill-none">
                                                    <path d="M0,100 L50,80 L100,120 L150,70 L200,100 M100,0 L120,50 L80,100 L130,150 L100,200" strokeWidth="1" />
                                                </svg>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            </div>
        </div>
    );
}

function HugHold({
    reduceMotion,
    onComplete,
}: {
    reduceMotion: boolean;
    onComplete: () => void;
}) {
    const { light } = useHaptics();
    const [holding, setHolding] = useState(false);
    const [p, setP] = useState(0);
    const [blast, setBlast] = useState(false);
    const rafRef = useRef<number | null>(null);
    const blastTimerRef = useRef<number | null>(null);
    const startedAtRef = useRef<number>(0);
    const doneRef = useRef(false);

    const stop = useCallback(() => {
        setHolding(false);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
        startedAtRef.current = 0;
        if (!doneRef.current) setP(0);
    }, []);

    const start = useCallback(() => {
        if (doneRef.current) return;
        setHolding(true);
        setBlast(false);
        startedAtRef.current = typeof performance !== "undefined" ? performance.now() : Date.now();

        const tick = () => {
            const now = typeof performance !== "undefined" ? performance.now() : Date.now();
            const dt = now - startedAtRef.current;
            const next = clamp(dt / 3000, 0, 1);
            setP(next);
            if (next >= 1 && !doneRef.current) {
                doneRef.current = true;
                setHolding(false);
                setP(1);
                setBlast(true);
                light(12);

                try {
                    const anyConfetti = confetti as unknown as {
                        (opts: Record<string, unknown>): void;
                        shapeFromText?: (opts: { text: string; scalar?: number }) => unknown;
                    };
                    const heart = anyConfetti.shapeFromText ? anyConfetti.shapeFromText({ text: "💖", scalar: 1.15 }) : undefined;

                    anyConfetti({
                        particleCount: 90,
                        spread: 95,
                        startVelocity: 34,
                        ticks: 180,
                        origin: { x: 0.5, y: 0.55 },
                        colors: ["#fb7185", "#f472b6", "#ffffff"],
                        shapes: heart ? [heart] : undefined,
                        scalar: 1.0,
                    });
                    anyConfetti({
                        particleCount: 45,
                        angle: 60,
                        spread: 65,
                        startVelocity: 28,
                        ticks: 160,
                        origin: { x: 0.18, y: 0.62 },
                        colors: ["#fb7185", "#f472b6", "#ffffff"],
                        shapes: heart ? [heart] : undefined,
                        scalar: 0.95,
                    });
                    anyConfetti({
                        particleCount: 45,
                        angle: 120,
                        spread: 65,
                        startVelocity: 28,
                        ticks: 160,
                        origin: { x: 0.82, y: 0.62 },
                        colors: ["#fb7185", "#f472b6", "#ffffff"],
                        shapes: heart ? [heart] : undefined,
                        scalar: 0.95,
                    });
                } catch {
                    // ignore
                }

                if (typeof navigator !== "undefined" && "vibrate" in navigator) {
                    try {
                        navigator.vibrate?.([60, 80, 60, 80, 60]);
                    } catch {
                        // ignore
                    }
                }
                if (blastTimerRef.current) window.clearTimeout(blastTimerRef.current);
                blastTimerRef.current = window.setTimeout(() => onComplete(), reduceMotion ? 0 : 950);
                return;
            }
            rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);
    }, [light, onComplete, reduceMotion]);

    useEffect(() => {
        return () => {
            stop();
            if (blastTimerRef.current) window.clearTimeout(blastTimerRef.current);
            blastTimerRef.current = null;
        };
    }, [stop]);

    return (
        <div className="mt-10 flex items-center justify-center">
            <motion.button
                type="button"
                onPointerDown={() => (reduceMotion ? onComplete() : start())}
                onPointerUp={stop}
                onPointerLeave={stop}
                className="relative inline-flex h-44 w-44 items-center justify-center"
                aria-label="Hold to hug"
                animate={holding && !reduceMotion ? { scale: [1, 1.02, 1] } : undefined}
                transition={holding && !reduceMotion ? { duration: 0.8, repeat: Infinity, ease: "easeInOut" } : undefined}
            >
                <AnimatePresence>
                    {blast ? (
                        <motion.div key="blast" aria-hidden className="absolute inset-0">
                            <motion.div
                                className="absolute inset-0 rounded-full"
                                initial={{ opacity: 0, scale: 0.65 }}
                                animate={{ opacity: [0, 1, 0], scale: [0.7, 2.6] }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: reduceMotion ? 0.01 : 0.85, ease: "easeOut" }}
                                style={{
                                    background:
                                        "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.92), rgba(251,113,133,0.42) 30%, rgba(244,114,182,0.2) 52%, transparent 72%)",
                                    boxShadow: "0 0 110px rgba(244,114,182,0.55)",
                                }}
                            />
                            <motion.div
                                className="absolute inset-0 rounded-full"
                                initial={{ opacity: 0, scale: 0.85 }}
                                animate={{ opacity: [0, 0.9, 0], scale: [0.9, 3.2] }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: reduceMotion ? 0.01 : 0.95, ease: "easeOut" }}
                                style={{
                                    background:
                                        "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.55), rgba(255,255,255,0.12) 28%, transparent 60%)",
                                }}
                            />
                        </motion.div>
                    ) : null}
                </AnimatePresence>

                <motion.div
                    aria-hidden
                    className="absolute -inset-3"
                    animate={holding && !reduceMotion ? { opacity: [0.55, 0.9, 0.55] } : { opacity: 0.6 }}
                    transition={holding && !reduceMotion ? { duration: 0.9, repeat: Infinity, ease: "easeInOut" } : undefined}
                    style={{
                        filter: "blur(14px)",
                        background:
                            "radial-gradient(circle at 40% 30%, rgba(255,255,255,0.7), rgba(244,114,182,0.55) 40%, rgba(251,113,133,0.25) 70%, transparent 78%)",
                    }}
                />

                <motion.div
                    className="relative h-full w-full"
                    animate={reduceMotion ? undefined : { scale: 1 + p * 1.15 }}
                    transition={{ type: "spring", stiffness: 260, damping: 16, mass: 0.6 }}
                >
                    <svg
                        className="h-full w-full"
                        viewBox="0 0 256 256"
                        aria-hidden
                        focusable="false"
                    >
                        <defs>
                            <linearGradient id="hugHeartFill" x1="40" y1="28" x2="220" y2="236" gradientUnits="userSpaceOnUse">
                                <stop offset="0" stopColor="rgba(255,255,255,0.95)" />
                                <stop offset="0.35" stopColor="rgba(251,113,133,0.9)" />
                                <stop offset="0.75" stopColor="rgba(244,114,182,0.75)" />
                                <stop offset="1" stopColor="rgba(251,113,133,0.65)" />
                            </linearGradient>
                            <radialGradient
                                id="hugHeartShine"
                                cx="0"
                                cy="0"
                                r="1"
                                gradientUnits="userSpaceOnUse"
                                gradientTransform="translate(92 78) rotate(45) scale(140 140)"
                            >
                                <stop offset="0" stopColor="rgba(255,255,255,0.85)" />
                                <stop offset="0.4" stopColor="rgba(255,255,255,0.22)" />
                                <stop offset="0.9" stopColor="rgba(255,255,255,0)" />
                            </radialGradient>
                            <filter id="hugHeartShadow" x="-20%" y="-20%" width="140%" height="140%">
                                <feDropShadow dx="0" dy="18" stdDeviation="14" floodColor="rgba(0,0,0,0.22)" />
                            </filter>
                        </defs>

                        <path
                            d="M128 226s-58-34-86-76c-18-27-15-63 7-85 20-20 52-18 72 2 4 4 6 8 7 10 1-2 3-6 7-10 20-20 52-22 72-2 22 22 25 58 7 85-28 42-86 76-86 76z"
                            fill="url(#hugHeartFill)"
                            filter="url(#hugHeartShadow)"
                        />
                        <path
                            d="M128 226s-58-34-86-76c-18-27-15-63 7-85 20-20 52-18 72 2 4 4 6 8 7 10 1-2 3-6 7-10 20-20 52-22 72-2 22 22 25 58 7 85-28 42-86 76-86 76z"
                            fill="url(#hugHeartShine)"
                            opacity={0.7}
                        />
                        <path
                            d="M128 226s-58-34-86-76c-18-27-15-63 7-85 20-20 52-18 72 2 4 4 6 8 7 10 1-2 3-6 7-10 20-20 52-22 72-2 22 22 25 58 7 85-28 42-86 76-86 76z"
                            fill="none"
                            stroke="rgba(255,255,255,0.6)"
                            strokeWidth="2"
                        />

                        <motion.path
                            d="M128 226s-58-34-86-76c-18-27-15-63 7-85 20-20 52-18 72 2 4 4 6 8 7 10 1-2 3-6 7-10 20-20 52-22 72-2 22 22 25 58 7 85-28 42-86 76-86 76z"
                            fill="none"
                            stroke="rgba(255,255,255,0.55)"
                            strokeWidth="6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ opacity: 0.15 + p * 0.55 }}
                        />
                    </svg>
                </motion.div>

                <div className={fredoka.className + " relative text-center text-base font-semibold text-white"}>
                    {reduceMotion ? "HUG" : `${Math.round(p * 100)}%`}
                </div>
            </motion.button>
        </div>
    );
}
