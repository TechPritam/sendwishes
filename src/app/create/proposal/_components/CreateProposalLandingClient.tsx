"use client";

import Link from "next/link";
import { Footer } from "@/app/_components/Footer";
import { ExperienceShell } from "@/app/create/_components/ExperienceShell";
import { MobilePreviewFrame } from "@/app/create/_components/MobilePreviewFrame";
import { CreateProposalNavbar } from "./CreateProposalNavbar";
import { ProposalPreviewBackground } from "./ProposalPreviewBackground";
import { ProposalPhonePreview } from "./ProposalPhonePreview";

export function CreateProposalLandingClient() {
  const featureCards = [
    {
      title: "Personal",
      description: "Feels like you wrote it.",
      icon: "💌",
    },
    {
      title: "Interactive",
      description: "Tap → react → smile.",
      icon: "✨",
    },
    {
      title: "Shareable",
      description: "Just send a link.",
      icon: "🔗",
    },
    {
      title: "Fast",
      description: "Create in under a minute.",
      icon: "⚡",
    },
  ] as const;

  return (
    <ExperienceShell variant="proposal" align="start" paddingY="none">
      <CreateProposalNavbar />

      <main className="mx-auto w-full max-w-5xl px-6 pt-10 pb-12">
        <section className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div className="lg:col-start-1 lg:row-start-1 lg:mt-20">
            <h1 className="font-sans text-balance text-3xl font-semibold tracking-tight text-[rgb(121_29_80)] sm:text-5xl">
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
                yesText="Yes ✨️"
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

        <section className="mt-12">
          <div className="relative overflow-hidden rounded-3xl bg-white/60 p-6 ring-1 ring-rose-100 backdrop-blur sm:p-8">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-70"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 10%, rgba(244,63,94,0.18), transparent 45%), radial-gradient(circle at 80% 30%, rgba(236,72,153,0.14), transparent 50%), radial-gradient(circle at 40% 85%, rgba(251,113,133,0.12), transparent 55%)",
              }}
            />

            <div className="relative">
              <h2 className="font-sans text-lg font-semibold text-[rgb(121_29_80)]">Why choose us</h2>
              <p className="mt-2 text-sm text-zinc-700">
                A tiny interactive experience that feels personal — and takes seconds to share.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {featureCards.map((c) => (
                  <div
                    key={c.title}
                    className="rounded-3xl bg-white/70 p-5 ring-1 ring-rose-100 backdrop-blur"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-[rgb(121_29_80)]">{c.title}</div>
                        <div className="mt-1 text-sm text-zinc-700">{c.description}</div>
                      </div>
                      <div className="text-xl" aria-hidden>
                        {c.icon}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-14">
          <div className="relative left-1/2 right-1/2 -mx-[50vw] w-[100dvw] overflow-x-clip">
            <div className="relative overflow-hidden bg-white/35 py-14 ring-1 ring-rose-100/60 backdrop-blur">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-80"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 50% 0%, rgba(244,63,94,0.18), transparent 55%), radial-gradient(circle at 0% 100%, rgba(236,72,153,0.14), transparent 55%), radial-gradient(circle at 100% 70%, rgba(251,113,133,0.12), transparent 60%)",
                }}
              />

              <div className="relative mx-auto w-full max-w-5xl px-6">
                <h2 className="font-sans text-balance text-center text-3xl font-semibold tracking-tight text-[rgb(121_29_80)] sm:text-4xl">
                  POV: You found the ultimate {"'Yes'"} hack.
                </h2>
                <p className="mx-auto mt-5 max-w-3xl text-pretty text-center text-sm leading-relaxed text-zinc-700 sm:text-base">
                  Looking for a way to ask them out without the {"'Seen'"} receipt anxiety? The Perfect Proposal is a custom
                  digital love letter designed to make {"\"No\""} impossible—literally. Watch the {"'No'"} button playfully dodge
                  their cursor until they finally give in to the magic. Fully personalized, totally risk-free, and 100%
                  unforgettable
                </p>
              </div>
            </div>
          </div>
        </section>

        <Footer alignMobile="left" />
      </main>
    </ExperienceShell>
  );
}