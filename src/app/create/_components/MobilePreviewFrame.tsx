"use client";

import { AnimatePresence, motion } from "framer-motion";
import { type ReactNode } from "react";

type MobilePreviewFrameProps = {
  title: string;
  subtitle?: string;
  background?: ReactNode;
  children: ReactNode;
};

export function MobilePreviewFrame({ title, subtitle, background, children }: MobilePreviewFrameProps) {
  return (
    // <div className="glass-card p-5 sm:p-6">
    <div>
      {/* <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-zinc-900">{title}</div>
          {subtitle ? (
            <div className="mt-1 text-xs text-zinc-600">{subtitle}</div>
          ) : null}
        </div>
        <div className="text-xs font-semibold text-rose-700">Live Preview</div>
      </div> */}

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="mt-5 mx-auto w-full max-w-[350px]"
      >
        <div className="relative aspect-[9/16] rounded-[52px] bg-zinc-900/90 p-2 shadow-xl shadow-zinc-900/10 ring-1 ring-zinc-900/10">
          {/* Side buttons */}
          <div aria-hidden className="pointer-events-none absolute left-[-3px] top-24 h-10 w-1.5 rounded-r bg-zinc-900/60" />
          <div aria-hidden className="pointer-events-none absolute left-[-3px] top-40 h-16 w-1.5 rounded-r bg-zinc-900/60" />
          <div aria-hidden className="pointer-events-none absolute right-[-3px] top-32 h-14 w-1.5 rounded-l bg-zinc-900/60" />

          <div className="glass-panel relative h-full w-full overflow-hidden rounded-[44px] bg-white/60">
            {background ? (
              <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
                {background}
              </div>
            ) : null}

            {/* Notch */}
            <div aria-hidden className="pointer-events-none absolute left-1/2 top-2 z-20 h-7 w-32 -translate-x-1/2 rounded-full bg-zinc-900/90 ring-1 ring-white/10" />
            <div aria-hidden className="pointer-events-none absolute left-1/2 top-4 z-20 h-1.5 w-12 -translate-x-1/2 rounded-full bg-zinc-700" />
            <div aria-hidden className="pointer-events-none absolute left-[calc(50%+34px)] top-4 z-20 h-2 w-2 rounded-full bg-zinc-700" />

            {/* Status / chrome */}
            <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-rose-300" />
                <div className="h-2 w-2 rounded-full bg-rose-200" />
                <div className="h-2 w-2 rounded-full bg-rose-100" />
              </div>
              <div className="text-[10px] font-semibold text-zinc-600">sendwishes</div>
            </div>

            <div className="absolute inset-0 z-10">
              <div className="h-full w-full p-4 pt-12">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={title}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="h-full"
                  >
                    {children}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Home indicator */}
            <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-2 z-10 flex justify-center">
              <div className="h-1 w-24 rounded-full bg-zinc-900/15" />
            </div>

            <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/70 to-transparent" />
          </div>
        </div>
      </motion.div>

      {/* <div className="mt-4 text-xs text-zinc-500">
        This is a mock mobile preview. Animations are approximate.
      </div> */}
    </div>
  );
}
