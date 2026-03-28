"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";

type SorryPhonePreviewProps = {
  name?: string;
  reason?: string;
};

export function SorryPhonePreview({ name, reason }: SorryPhonePreviewProps) {
  const reduceMotion = useReducedMotion();
  const [accepted, setAccepted] = useState(false);

  const theirName = useMemo(() => name?.trim() || "my favorite human", [name]);
  const safeReason = useMemo(() => reason?.trim() || "(your reason goes here)", [reason]);

  const letterPreview =
    `Dear ${theirName},\n\n` +
    `I hate it when there’s distance between us. My world feels a little less bright when you aren't smiling at me. ` +
    `I'm truly sorry for ${safeReason}.\n\n` +
    `You deserve the best version of me, and I promise to keep working on being that person. ` +
    `Can we hit the reset button?`;

  return (
    <div className="flex h-full flex-col">
      <div className="glass-soft bg-white/60 p-4">
        <div className="text-xs font-semibold text-emerald-700">To</div>
        <div className="mt-1 text-sm font-semibold text-zinc-900">{theirName}</div>
      </div>
      <div className="mt-3 flex-1">
        <motion.div layout className="glass-panel bg-white/70 p-5 ring-emerald-200">
          <div className="text-xs font-semibold text-emerald-700">Letter</div>
          <AnimatePresence mode="wait">
            <motion.div
              key={letterPreview}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="mt-2 whitespace-pre-wrap text-pretty text-sm text-zinc-800"
            >
              {letterPreview}
            </motion.div>
          </AnimatePresence>
        </motion.div>
        <div className="mt-4 rounded-2xl bg-emerald-50/70 p-4 text-xs text-zinc-700 ring-1 ring-emerald-200">
          Final screen includes a playful Yes/No verdict.
        </div>
      </div>
      <div className="mt-4 text-center text-[11px] font-semibold text-emerald-700">
        Tap-friendly · calm · sincere
      </div>
    </div>
  );
}