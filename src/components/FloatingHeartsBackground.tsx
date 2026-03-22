"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Heart } from "lucide-react";

type FloatingHeartsBackgroundProps = {
  count?: number;
};

function seededNumber(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function FloatingHeartsBackground({ count = 20 }: FloatingHeartsBackgroundProps) {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const rafRef = useRef<number | null>(null);
  const [parallax, setParallax] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || reduceMotion) return;

    function onMove(e: MouseEvent) {
      if (rafRef.current) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        const nx = (e.clientX / window.innerWidth) * 2 - 1;
        const ny = (e.clientY / window.innerHeight) * 2 - 1;
        setParallax({ x: nx * 10, y: ny * 6 });
      });
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [mounted, reduceMotion]);

  const hearts = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      // Deterministic (SSR-safe) randomness.
      const startX = seededNumber(i + 11) * 100;
      // Start roughly from the middle of the viewport (not from the bottom).
      // 38vh..78vh keeps the origin in the “middle band” across screen sizes.
      const startY = 38 + seededNumber(i + 99) * 40;
      const drift = 14 + seededNumber(i + 77) * 26;
      const size = 22 + seededNumber(i + 222) * 34;
      const duration = 9 + seededNumber(i + 333) * 9;
      const delay = seededNumber(i + 444) * 2;
      const opacityPeak = 0.35 + seededNumber(i + 555) * 0.35;
      const rotateBase = -12 + seededNumber(i + 666) * 24;
      return { id: i, startX, startY, drift, size, duration, delay, opacityPeak, rotateBase };
    });
  }, [count]);

  if (!mounted) return null;

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none overflow-hidden blur-[0.1px] opacity-50"
      aria-hidden
      animate={reduceMotion ? undefined : { x: parallax.x, y: parallax.y }}
      transition={{ type: "spring", stiffness: 120, damping: 22 }}
    >
      {hearts.map((h) => {
        if (reduceMotion) {
          return (
            <div
              key={h.id}
              className="absolute text-rose-400"
              style={{ left: `${h.startX}vw`, top: `${h.startY}vh`, opacity: 0.45 }}
            >
              <Heart size={h.size} fill="currentColor" className="drop-shadow-sm" />
            </div>
          );
        }

        return (
          <motion.div
            key={h.id}
            initial={{ y: `${h.startY}vh`, x: `${h.startX}vw`, opacity: 0, rotate: h.rotateBase }}
            animate={{
              y: "-10vh",
              opacity: [0, h.opacityPeak, h.opacityPeak, 0],
              x: [`${h.startX}vw`, `${h.startX + h.drift}vw`, `${h.startX - h.drift * 0.7}vw`, `${h.startX}vw`],
              rotate: [h.rotateBase, h.rotateBase + 10, h.rotateBase - 8, h.rotateBase + 6],
            }}
            transition={{
              duration: h.duration,
              delay: h.delay,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute text-pink-500/70 drop-shadow-sm"
          >
            <Heart size={h.size} fill="currentColor" />
          </motion.div>
        );
      })}
    </motion.div>
  );
}
