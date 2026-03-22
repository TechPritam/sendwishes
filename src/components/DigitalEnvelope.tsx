"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export type DigitalEnvelopeProps = {
  reduceMotion?: boolean;
  onOpened?: () => void;
};

export function DigitalEnvelope({ reduceMotion = false, onOpened }: DigitalEnvelopeProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const ms = reduceMotion ? 120 : 820;
    const t = window.setTimeout(() => onOpened?.(), ms);
    return () => window.clearTimeout(t);
  }, [onOpened, open, reduceMotion]);

  return (
    <div className="mx-auto w-[min(88vw,460px)]">
      <div className="relative w-full" style={{ perspective: "2500px" }}>
        <motion.button
          type="button"
          onClick={() => {
            if (open) return;
            setOpen(true);
          }}
          aria-label="Open envelope"
          className={
            "relative h-[220px] w-full rounded-sm shadow-2xl" + (open ? "" : " cursor-pointer")
          }
        >
          {/* Body */}
          <div className="absolute inset-0 rounded-sm border-b border-rose-100 bg-white shadow-inner" />

          {/* Side folds */}
          <div
            className="absolute inset-0 bg-rose-50/25"
            style={{ clipPath: "polygon(0 0, 50% 50%, 0 100%)" }}
          />
          <div
            className="absolute inset-0 bg-rose-50/25"
            style={{ clipPath: "polygon(100% 0, 50% 50%, 100% 100%)" }}
          />

          {/* Bottom fold */}
          <div
            className="absolute inset-0 bg-white/75"
            style={{ clipPath: "polygon(0 100%, 50% 48%, 100% 100%)" }}
          />

          {/* Top flap */}
          <motion.div
            className="absolute inset-0 z-20 origin-top bg-gradient-to-b from-white to-rose-50 shadow-lg"
            initial={false}
            animate={{ rotateX: open ? -165 : 0 }}
            transition={{ duration: reduceMotion ? 0.18 : 0.9, ease: [0.4, 0, 0.2, 1] }}
            style={{
              clipPath: "polygon(0 0, 50% 60%, 100% 0)",
              backfaceVisibility: "hidden",
            }}
          />

          {/* Seal */}
          {!open ? (
            <div className="absolute left-1/2 top-[48%] z-40 -translate-x-1/2 -translate-y-1/2">
              <motion.div
                whileHover={reduceMotion ? undefined : { scale: 1.08, rotate: 4 }}
                className="flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-amber-300 bg-gradient-to-br from-rose-800 to-rose-950 text-white shadow-2xl"
              >
                <span className="text-3xl">❤</span>
              </motion.div>
            </div>
          ) : null}
        </motion.button>
      </div>
    </div>
  );
}
