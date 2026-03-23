"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

type FloatingStarsBackgroundProps = {
  count?: number;
};

function seededNumber(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function FloatingStarsBackground({ count = 18 }: FloatingStarsBackgroundProps) {
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
        setParallax({ x: nx * 8, y: ny * 5 });
      });
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [mounted, reduceMotion]);

  const stars = useMemo(() => {
    const glyphs = ["✦", "✧", "⋆", "✩"];
    return Array.from({ length: count }, (_, i) => {
      const left = seededNumber(i + 17) * 100;
      const top = seededNumber(i + 97) * 100;
      const size = 10 + seededNumber(i + 211) * 22;
      const duration = 10 + seededNumber(i + 333) * 16;
      const delay = seededNumber(i + 444) * 2.5;
      const driftX = -18 + seededNumber(i + 555) * 36;
      const driftY = 22 + seededNumber(i + 666) * 44;
      const opacity = 0.12 + seededNumber(i + 777) * 0.25;
      const glyph = glyphs[i % glyphs.length] ?? "✦";
      return { id: i, left, top, size, duration, delay, driftX, driftY, opacity, glyph };
    });
  }, [count]);

  if (!mounted) return null;

  return (
    <motion.div
      aria-hidden
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      animate={reduceMotion ? undefined : { x: parallax.x, y: parallax.y }}
      transition={{ type: "spring", stiffness: 120, damping: 22 }}
    >
      {stars.map((s) => {
        const baseStyle: React.CSSProperties = {
          left: `${s.left}vw`,
          top: `${s.top}vh`,
          fontSize: s.size,
          opacity: s.opacity,
        };

        if (reduceMotion) {
          return (
            <span
              key={s.id}
              className="absolute select-none text-white"
              style={baseStyle}
            >
              {s.glyph}
            </span>
          );
        }

        return (
          <motion.span
            key={s.id}
            className="absolute select-none text-white"
            style={baseStyle}
            initial={{ y: 0, x: 0, scale: 0.98 }}
            animate={{
              y: [0, s.driftY, 0],
              x: [0, s.driftX, 0],
              opacity: [s.opacity, Math.min(0.55, s.opacity + 0.22), s.opacity],
              scale: [0.98, 1.06, 0.98],
            }}
            transition={{
              duration: s.duration,
              delay: s.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {s.glyph}
          </motion.span>
        );
      })}

      {/* Soft fade so stars don't overpower content */}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/20" />
    </motion.div>
  );
}