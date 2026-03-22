"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type PartyConfettiBackgroundPreviewProps = {
  count?: number;
};

function seededNumber(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function PartyConfettiBackgroundPreview({ count = 54 }: PartyConfettiBackgroundPreviewProps) {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const pieces = useMemo(() => {
    const colors = ["#f472b6", "#e879f9", "#fb7185", "#f87171", "#c084fc", "#38bdf8"];

    return Array.from({ length: count }, (_, i) => {
      const isHeart = seededNumber(i + 456) > 0.5;
      const left = Math.round(seededNumber(i + 11) * 100);
      const top = Math.round(seededNumber(i + 73) * 100);
      const size = isHeart ? 13 + seededNumber(i + 131) * 9 : 5 + seededNumber(i + 131) * 5;
      const duration = 14 + seededNumber(i + 211) * 18;
      const delay = seededNumber(i + 389) * 8;
      const rotate = Math.round(seededNumber(i + 557) * 360);
      const color = colors[i % colors.length];
      const opacityBase = 0.18 + seededNumber(i + 911) * 0.25;

      return { id: i, left, top, size, duration, delay, rotate, color, opacityBase, isHeart };
    });
  }, [count]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
      {mounted
        ? pieces.map((p) => {
            const style = {
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              height: p.size,
              position: "absolute" as const,
            };

            const renderParticle = () => {
              if (p.isHeart) {
                return (
                  <svg
                    viewBox="0 0 24 24"
                    fill={p.color}
                    style={{ width: "100%", height: "100%", filter: "drop-shadow(0 0 2px rgba(255,255,255,0.2))" }}
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                );
              }
              return (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: p.color,
                    borderRadius: "2px",
                    rotate: `${p.rotate}deg`,
                  }}
                />
              );
            };

            if (reduceMotion) {
              return (
                <div key={p.id} style={{ ...style, opacity: p.opacityBase }}>
                  {renderParticle()}
                </div>
              );
            }

            return (
              <motion.div
                key={p.id}
                style={style}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [p.opacityBase, p.opacityBase + 0.35, p.opacityBase],
                  x: [0, 20, -20, 0],
                  y: [0, -26, 26, 0],
                  rotate: [0, 30, -30, 0],
                  scale: p.isHeart ? [1, 1.18, 1] : [1, 1, 1],
                }}
                transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" }}
              >
                {renderParticle()}
              </motion.div>
            );
          })
        : null}
    </div>
  );
}
