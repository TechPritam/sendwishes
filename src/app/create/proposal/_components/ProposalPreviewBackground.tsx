"use client";

import { Heart } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

function seededNumber(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function roundTo(n: number, digits: number) {
  return Number(n.toFixed(digits));
}

export function ProposalPreviewBackground() {
  const reduceMotion = useReducedMotion();
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
                rotate: [
                  h.rotateBase,
                  roundTo(h.rotateBase + 10, 3),
                  roundTo(h.rotateBase - 8, 3),
                  roundTo(h.rotateBase + 6, 3),
                ],
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
