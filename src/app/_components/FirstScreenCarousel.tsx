"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type Slide = {
    src: string;
    title: string;
    message: string;
};

export function FirstScreenCarousel() {
    const reduceMotion = useReducedMotion() ?? false;

    const slides = useMemo<Slide[]>(
        () => [
            {
                src: "/assets/surrender-flag.gif",
                title: "I Surrender",
                message: "Okay, you win. I’m really sorry — can we reset?",
            },
            {
                src: "/assets/sorry.gif",
                title: "I Messed Up",
                message: "No excuses. Just a soft little sorry — from my heart.",
            },
            {
                src: "/assets/sorry2.gif",
                title: "Let Me Make It Right",
                message: "Tell me what you need. I’m listening.",
            },
        ],
        [],
    );

    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (reduceMotion) return;
        if (slides.length <= 1) return;

        const t = window.setInterval(() => {
            setActiveIndex((i) => (i + 1) % slides.length);
        }, 3200);

        return () => window.clearInterval(t);
    }, [reduceMotion, slides.length]);

    const activeSlide = slides[activeIndex];

    return (
        <div className="mx-auto w-full max-w-lg md:max-w-xl lg:max-w-2xl">
            <div className="grid gap-4 sm:grid-cols-[220px_1fr] sm:items-center md:grid-cols-[260px_1fr] md:gap-6">
                <div className="flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={activeSlide.src}
                            src={activeSlide.src}
                            alt={activeSlide.title}
                            draggable={false}
                            className="h-40 w-full object-contain sm:h-44 md:h-50 lg:h-72"
                            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
                            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                            exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                        />
                    </AnimatePresence>
                </div>

                <div>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeSlide.title}
                            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
                            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                            exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                        >
                            <div className="text-balance text-lg font-semibold tracking-tight text-zinc-900">
                                {activeSlide.title}
                            </div>
                            <div className="mt-2 mb-4 text-pretty text-sm leading-relaxed text-zinc-600">
                                {activeSlide.message}
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    <div className="m-auto w-fit flex items-center gap-2">
                        {slides.map((s, idx) => (
                            <button
                                key={s.src}
                                type="button"
                                aria-label={`Go to slide ${idx + 1}`}
                                onClick={() => setActiveIndex(idx)}
                                className={
                                    "h-2.5 w-2.5 rounded-full ring-1 ring-rose-200 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 " +
                                    (idx === activeIndex ? "bg-rose-500" : "bg-white/60")
                                }
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
