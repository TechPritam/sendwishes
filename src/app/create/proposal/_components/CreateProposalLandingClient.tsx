"use client";

import Link from "next/link";
import { Footer } from "@/app/_components/Footer";
import { ExperienceShell } from "@/app/create/_components/ExperienceShell";
import { MobilePreviewFrame } from "@/app/create/_components/MobilePreviewFrame";
import { CreateProposalNavbar } from "./CreateProposalNavbar";
import { ProposalPreviewBackground } from "./ProposalPreviewBackground";
import { ProposalPhonePreview } from "./ProposalPhonePreview";

export function CreateProposalLandingClient() {
  return (
    <ExperienceShell variant="proposal" align="start" paddingY="none">
      <CreateProposalNavbar />

      <main className="mx-auto w-full max-w-5xl px-6 pt-10 pb-12">
        <section className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div className="lg:col-start-1 lg:row-start-1 lg:mt-20">
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
              Say what words alone can{"'"}t — through an experience.
            </h1>
            <p className="mt-4 text-pretty text-sm text-zinc-600 sm:text-base">
              Stop sweating the {"\"No\""} and start planning the date. Our interactive confession links make rejection literally impossible.
              Send a custom link where every click leads back to you.
            </p>
          </div>

          <div className="lg:col-start-2 lg:row-start-1 lg:row-span-2">
            <MobilePreviewFrame
              title="Proposal"
              subtitle="Preview"
              background={<ProposalPreviewBackground />}
            >
              <ProposalPhonePreview
                question="Will you be mine forever?"
                recipient="her"
                message="I knew you couldn't say no!"
                yesText="Yes"
                noText="No"
              />
            </MobilePreviewFrame>
          </div>

          <div className="lg:col-start-1 lg:row-start-2">
            <Link
              href="/create/proposal/start"
              className="inline-flex h-12 w-full items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-pink-600 px-8 text-base font-semibold text-white shadow-[0_0_18px_rgba(255,255,255,0.55)] transition-all hover:brightness-105 sm:w-auto"
            >
              Start the Surprise ⚡
            </Link>
            {/* <div className="mt-3 text-xs font-semibold text-rose-700">
              Pro tip (this matters more than text)
            </div> */}
            <div className="mt-2 text-sm text-zinc-600">
              <div>👉 {"\u201cTakes less than 30 seconds\u201d"}</div>
              <div>👉 {"\u201cNo signup needed\u201d"}</div>
            </div>
          </div>
        </section>

        <section className="mt-12 glass-card p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-zinc-900">Why this works</h2>
          <p className="mt-3 text-sm text-zinc-700 leading-relaxed">
            Looking for creative or cute ways to ask someone to be your valentine or partner? The Perfect Proposal is a digital love letter and yes/no confession game.
            Fully customize your question and their name to create a personalized experience. We promise they {"won't"} be able to say no—the {"'No'"} button playfully dodges their taps,
            ending in a heartfelt celebration. It{"'"}s an ask-without-fear link that makes proposing online fun, risk-free, and unforgettable.
          </p>
        </section>

        <Footer />
      </main>
    </ExperienceShell>
  );
}
