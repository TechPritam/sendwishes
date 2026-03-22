"use client";

import Link from "next/link";
import { Footer } from "@/app/_components/Footer";
import { ExperienceShell } from "@/app/create/_components/ExperienceShell";
import { MobilePreviewFrame } from "@/app/create/_components/MobilePreviewFrame";
import { CreateProposalNavbar } from "@/app/create/proposal/_components/CreateProposalNavbar";
import { BirthdayPhonePreview } from "@/app/create/birthday/_components/BirthdayPhonePreview";
import { BirthdayPreviewBackground } from "@/app/create/birthday/_components/BirthdayPreviewBackground";

export function CreateBirthdayLandingClient() {
  return (
    <ExperienceShell variant="birthday" background="midnight" align="start" paddingY="none">
      <CreateProposalNavbar />

      <main className="mx-auto w-full max-w-5xl px-6 pt-10 pb-12">
        <section className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div className="lg:col-start-1 lg:row-start-1 lg:mt-20">
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-5xl">
              Turn birthdays into an experience — not just a text.
            </h1>
            <p className="mt-4 text-pretty text-sm text-white/75 sm:text-base">
              Send a magical link that plays like a mini surprise: a reveal screen, celebration GIF, balloon pops,
              candles blown, cake cut — and a final envelope letter.
            </p>
          </div>

          <div className="lg:col-start-2 lg:row-start-1 lg:row-span-2">
            <MobilePreviewFrame title="Birthday" subtitle="Preview" background={<BirthdayPreviewBackground />}>
              <BirthdayPhonePreview />
            </MobilePreviewFrame>
          </div>

          <div className="lg:col-start-1 lg:row-start-2">
            <Link
              href="/create/birthday/start"
              className="inline-flex h-12 w-full items-center justify-center rounded-full bg-pink-600 px-8 text-base font-semibold text-white shadow-[0_0_18px_rgba(255,255,255,0.18)] transition-all hover:bg-pink-700 sm:w-auto"
            >
              Start the Surprise ⚡
            </Link>
            <div className="mt-2 text-sm text-white/70">
              <div>👉 {"\u201cTakes less than 30 seconds\u201d"}</div>
              <div>👉 {"\u201cNo signup needed\u201d"}</div>
            </div>
          </div>
        </section>

        <section className="mt-12 glass-card p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-zinc-900">Why this works</h2>
          <p className="mt-3 text-sm text-zinc-700 leading-relaxed">
            It feels personal because it’s interactive — the reveal moment, balloon pops, and candle wish build anticipation,
            then end with a heartfelt letter.
          </p>
        </section>

        <Footer />
      </main>
    </ExperienceShell>
  );
}
