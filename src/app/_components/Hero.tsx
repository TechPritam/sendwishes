"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MobilePreviewFrame } from "@/app/create/_components/MobilePreviewFrame";
import { ProposalPreviewBackground } from "@/app/create/proposal/_components/ProposalPreviewBackground";
import { ProposalPhonePreview } from "@/app/create/proposal/_components/ProposalPhonePreview";

export function Hero() {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 pt-12 pb-10 sm:pt-16 sm:pb-14">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full"
      >
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div className="lg:pt-6">
            <p className="glass-pill inline-flex items-center gap-2 text-sm text-rose-700">
              <span className="text-base">♥</span>
              sendyourWishes
            </p>

            <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-zinc-900 sm:text-6xl">
              Turn a link into a moment they {"can't"} ignore
            </h1>

            <p className="mt-4 text-pretty text-base text-zinc-600 sm:text-lg">
              Romantic, playful, and beautifully personal—built for phones and made to be shared.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                <Link
                  href="/create/proposal"
                  className="inline-flex h-12 w-full items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-pink-600 px-7 text-sm font-semibold text-white shadow-[0_0_18px_rgba(255,255,255,0.55)] transition-all hover:brightness-105"
                >
                  Start with a Proposal
                </Link>
              </motion.div>

              <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                <Link
                  href="/create/birthday"
                  className="inline-flex h-12 w-full items-center justify-center rounded-full bg-white px-7 text-sm font-semibold text-rose-700 ring-1 ring-rose-200 transition-colors hover:bg-rose-50"
                >
                  Create a Birthday
                </Link>
              </motion.div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="glass-soft p-4">
                <div className="text-lg">💌</div>
                <div className="mt-2 text-sm font-semibold text-zinc-900">Personal</div>
                <div className="mt-1 text-xs text-zinc-600">Feels like you wrote it.</div>
              </div>
              <div className="glass-soft p-4">
                <div className="text-lg">✨</div>
                <div className="mt-2 text-sm font-semibold text-zinc-900">Interactive</div>
                <div className="mt-1 text-xs text-zinc-600">Tap → react → smile.</div>
              </div>
              <div className="glass-soft p-4">
                <div className="text-lg">🔗</div>
                <div className="mt-2 text-sm font-semibold text-zinc-900">Shareable</div>
                <div className="mt-1 text-xs text-zinc-600">Perfect for WhatsApp.</div>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 }}
            className="lg:pt-2"
          >
            <MobilePreviewFrame title="Proposal" subtitle="Preview" background={<ProposalPreviewBackground />}>
              <ProposalPhonePreview question="Will you be mine forever?" recipient="her" yesText="Yes" noText="No" />
            </MobilePreviewFrame>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
