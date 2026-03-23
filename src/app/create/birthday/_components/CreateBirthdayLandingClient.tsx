"use client";

import Link from "next/link";
import { Footer } from "@/app/_components/Footer";
import { ExperienceShell } from "@/app/create/_components/ExperienceShell";
import { MobilePreviewFrame } from "@/app/create/_components/MobilePreviewFrame";
import { CreateProposalNavbar } from "@/app/create/proposal/_components/CreateProposalNavbar";
import { BirthdayPhonePreview } from "@/app/create/birthday/_components/BirthdayPhonePreview";
import { BirthdayPreviewBackground } from "@/app/create/birthday/_components/BirthdayPreviewBackground";

export function CreateBirthdayLandingClient() {
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
    <ExperienceShell variant="birthday" background="midnight" align="start" paddingY="none">
      <CreateProposalNavbar />

      <main className="mx-auto w-full max-w-5xl px-6 pt-10 pb-12">
        <section className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div className="lg:col-start-1 lg:row-start-1 lg:mt-20">
            <h1 className="font-sans text-balance text-3xl font-semibold tracking-tight text-[rgb(146_130_193)] sm:text-5xl">
              Turn birthdays into an experience — not just a text.
            </h1>
            <h6 className="mt-4 text-pretty text-pretty text-sm font-medium leading-relaxed text-zinc-600 text-white/75 sm:text-base">
              Send a magical link that plays like a mini surprise: a reveal screen, celebration GIF, balloon pops,
              candles blown, cake cut — and a final envelope letter.
            </h6>
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

        <section className="mt-12">
          <div className="relative overflow-hidden rounded-3xl bg-white/10 p-6 ring-1 ring-white/15 backdrop-blur sm:p-8">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-70"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 10%, rgba(236,72,153,0.22), transparent 45%), radial-gradient(circle at 80% 30%, rgba(217,70,239,0.18), transparent 50%), radial-gradient(circle at 40% 85%, rgba(251,113,133,0.14), transparent 55%)",
              }}
            />

            <div className="relative">
              <h2 className="font-sans text-lg font-semibold text-[rgb(146_130_193)]">Why choose us</h2>
              <p className="mt-2 text-sm text-white/70">
                A tiny interactive birthday experience that feels personal — and takes seconds to share.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {featureCards.map((c) => (
                  <div
                    key={c.title}
                    className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-white">{c.title}</div>
                        <div className="mt-1 text-sm text-white/70">{c.description}</div>
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
            <div className="relative overflow-hidden border-y border-white/10 bg-white/5 py-14">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-85"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 50% 0%, rgba(236,72,153,0.22), transparent 55%), radial-gradient(circle at 0% 100%, rgba(217,70,239,0.18), transparent 55%), radial-gradient(circle at 100% 70%, rgba(251,113,133,0.14), transparent 60%)",
                }}
              />

              <div className="relative mx-auto w-full max-w-5xl px-6">
                <h2 className="font-sans text-balance text-center text-3xl font-semibold tracking-tight text-[rgb(146_130_193)] sm:text-4xl">
                  POV: You just planned the sweetest birthday surprise.
                </h2>
                <p className="mx-auto mt-5 max-w-3xl text-pretty text-center text-sm leading-relaxed text-white/75 sm:text-base">
                  Want to do more than just a “Happy Birthday” text? Send a magical link that plays like a mini surprise:
                  a reveal screen, celebration GIF, balloon pops, candles blown, cake cut — and a final envelope letter.
                  Fully personalized, super shareable, and unforgettable.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Footer tone="midnight" alignMobile="left" />
      </main>
    </ExperienceShell>
  );
}