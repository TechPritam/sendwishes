"use client";

import { motion, useReducedMotion } from "framer-motion";

type FloatingHeartsProps = {
  className?: string;
  count?: number;
};

function seededNumber(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function FloatingHearts({ className, count = 14 }: FloatingHeartsProps) {
  const reduceMotion = useReducedMotion();

  const hearts = Array.from({ length: count }, (_, index) => {
    const left = Math.round(seededNumber(index + 1) * 100);
    const top = Math.round(seededNumber(index + 101) * 100);
    const size = 14 + Math.round(seededNumber(index + 1001) * 18);
    const duration = 10 + seededNumber(index + 2001) * 14;
    const delay = seededNumber(index + 3001) * 6;
    const opacity = 0.10 + seededNumber(index + 4001) * 0.20;

    return {
      id: index,
      left,
      top,
      size,
      duration,
      delay,
      opacity,
    };
  });

  return (
    <div
      aria-hidden
      className={
        "pointer-events-none absolute inset-0 overflow-hidden blur-[0.75px] opacity-70 " +
        (className ?? "")
      }
    >
      {hearts.map((heart) => {
        const baseClassName =
          "absolute select-none text-rose-300/70 drop-shadow-sm";

        if (reduceMotion) {
          return (
            <span
              key={heart.id}
              className={baseClassName}
              style={{
                left: `${heart.left}%`,
                top: `${heart.top}%`,
                fontSize: heart.size,
                opacity: heart.opacity,
              }}
            >
              ♥
            </span>
          );
        }

        return (
          <motion.span
            key={heart.id}
            className={baseClassName}
            style={{
              left: `${heart.left}%`,
              top: `${heart.top}%`,
              fontSize: heart.size,
              opacity: heart.opacity,
            }}
            initial={{ y: 24, scale: 0.95 }}
            animate={{ y: [-8, 20, -10], scale: [0.95, 1.02, 0.98] }}
            transition={{
              duration: heart.duration,
              delay: heart.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            ♥
          </motion.span>
        );
      })}
    </div>
  );
}
