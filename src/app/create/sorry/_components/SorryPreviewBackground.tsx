"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Leaf } from "lucide-react";

function seededNumber(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function roundTo(n: number, digits: number) {
  return Number(n.toFixed(digits));
}

export function SorryPreviewBackground() {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const leaves = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const left = roundTo(seededNumber(i + 21) * 100, 3);
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
      <div className="pointer-events-none absolute inset-0" />
      {leaves.map((leaf) => (
        <motion.div
          key={leaf.id}
          initial={{
            opacity: 0,
            y: -leaf.drift,
            rotate: leaf.rotateBase,
          }}
          animate={mounted && !reduceMotion ? {
            opacity: [0, leaf.opacityPeak, 0],
            y: [0, leaf.drift, 0],
            rotate: [leaf.rotateBase, leaf.rotateBase + 18, leaf.rotateBase],
          } : {}}
          transition={{
            duration: leaf.duration,
            delay: leaf.delay,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            left: `${leaf.left}%`,
            top: `${leaf.top}%`,
            width: leaf.size,
            height: leaf.size,
            pointerEvents: "none",
          }}
        >
          <Leaf className="text-emerald-400/80" style={{ width: "100%", height: "100%" }} />
        </motion.div>
      ))}
    </div>
  );
}