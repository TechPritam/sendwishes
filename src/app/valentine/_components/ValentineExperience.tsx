"use client";

import { motion } from "framer-motion";

type ValentineExperienceProps = {
  name?: string;
  message: string;
  photoUrl?: string | null;
};

export function ValentineExperience({ name, message, photoUrl }: ValentineExperienceProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mx-auto w-full max-w-5xl px-6 py-10 sm:py-14"
    >
      <header className="mx-auto max-w-3xl text-center">
        <p className="glass-pill inline-flex items-center gap-2 text-sm text-rose-700">
          <span className="text-base">♥</span>
          Valentine
        </p>
        <h1 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
          {name?.trim() ? `For ${name.trim()}` : "A little love note"}
        </h1>
        <p className="mt-3 text-pretty text-sm text-zinc-600 sm:text-base">
          Open slowly. Read twice.
        </p>
      </header>

      <div className="glass-card mx-auto mt-10 max-w-3xl overflow-hidden p-0">
        {photoUrl ? (
          <div className="glass-panel rounded-none bg-white/60 p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoUrl}
              alt="Valentine"
              className="h-64 w-full rounded-3xl object-cover sm:h-80"
            />
          </div>
        ) : null}

        <div className="p-6 sm:p-10">
          <div className="text-xs font-medium text-rose-700">From me to you</div>
          <div className="mt-3 text-pretty text-base text-zinc-800 sm:text-lg">
            {message}
          </div>
          <div className="mt-6 text-sm text-zinc-600">Happy Valentine’s Day. ♥</div>
        </div>
      </div>
    </motion.div>
  );
}
