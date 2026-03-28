"use client";


import Link from "next/link";
import { Footer } from "@/app/_components/Footer";
import { ExperienceShell } from "@/app/create/_components/ExperienceShell";

import { MobilePreviewFrame } from "@/app/create/_components/MobilePreviewFrame";
import { CreateSorryNavbar } from "./CreateSorryNavbar";
import { SorryPreviewBackground } from "../../create/sorry/_components/SorryPreviewBackground";
import { SorryExperiencePreview } from "../../create/sorry/_components/SorryExperiencePreview";

import { useState } from "react";

export function CreateSorryLandingClient() {
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");
  const featureCards = [
    {
      title: "Personal",
      description: "Feels like you mean it.",
      icon: "🌿",
    },
    {
      title: "Gentle",
      description: "Softens the moment.",
      icon: "🫧",
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
    <ExperienceShell variant="sorry" align="start" paddingY="none">
      <CreateSorryNavbar />
      <main className="mx-auto w-full max-w-5xl px-6 pt-10 pb-12">
        <section className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div className="lg:col-start-1 lg:row-start-1 lg:mt-20">
            <h1 className="font-sans text-balance text-3xl font-semibold tracking-tight text-emerald-800 sm:text-5xl">
              Say sorry in a way that feels real.
            </h1>
            <p className="mt-4 text-pretty text-sm text-zinc-600 sm:text-base">
              Skip the awkward texts. Our interactive apology link helps you express your feelings with sincerity and a touch of playfulness. Send a custom link that opens the door to reconciliation.
            </p>
            {/* <div className="mt-8 space-y-4">
              <div>
                <label htmlFor="sorry-name" className="text-sm font-medium text-zinc-800">
                  Their name (optional)
                </label>
                <input
                  id="sorry-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="glass-input mt-2 w-full"
                  placeholder="e.g. Aanya"
                />
              </div>
              <div>
                <label htmlFor="sorry-reason" className="text-sm font-medium text-zinc-800">
                  What are you sorry for?
                </label>
                <textarea
                  id="sorry-reason"
                  rows={4}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="glass-input mt-2 w-full resize-none"
                  placeholder="e.g. forgetting our plan and not communicating"
                />
                <div className="mt-2 text-xs text-zinc-500">
                  Keep it simple and honest — no explanations, just ownership.
                </div>
              </div>
            </div> */}
          </div>

          <div className="lg:col-start-2 lg:row-start-1 lg:row-span-2">
            <MobilePreviewFrame
              title="Apology Era"
              subtitle="Live Preview"
              background={<SorryPreviewBackground />}
              removePadding
            >
              <div className="w-full  sm:max-w-[340px] mx-auto rounded-2xl shadow-xl bg-white/80">
                <SorryExperiencePreview name={name} reason={reason} />
              </div>
            </MobilePreviewFrame>
          </div>

          <div className="lg:col-start-1 lg:row-start-2">
            <Link
              href="/create/sorry/start"
              className="inline-flex h-12 w-full items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 text-base font-semibold text-white shadow-[0_0_18px_rgba(255,255,255,0.55)] transition-all hover:brightness-105 sm:w-auto"
            >
              Start the Apology ⚡
            </Link>
            <div className="mt-2 text-sm text-zinc-600">
              <div>👉 {"\u201cTakes less than 30 seconds\u201d"}</div>
              <div>👉 {"\u201cNo signup needed\u201d"}</div>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <div className="relative overflow-hidden rounded-3xl bg-white/60 p-6 ring-1 ring-emerald-100 backdrop-blur sm:p-8">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-70"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 10%, rgba(16,185,129,0.18), transparent 45%), radial-gradient(circle at 80% 30%, rgba(52,211,153,0.14), transparent 50%), radial-gradient(circle at 40% 85%, rgba(110,231,183,0.12), transparent 55%)",
              }}
            />
            <div className="relative">
              <h2 className="font-sans text-lg font-semibold text-emerald-800">Why choose us</h2>
              <p className="mt-2 text-sm text-zinc-700">
                A gentle interactive apology that feels personal — and takes seconds to share.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {featureCards.map((c) => (
                  <div
                    key={c.title}
                    className="rounded-3xl bg-white/70 p-5 ring-1 ring-emerald-100 backdrop-blur"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-emerald-800">{c.title}</div>
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
            <div className="relative overflow-hidden bg-white/35 py-14 ring-1 ring-emerald-100/60 backdrop-blur">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-80"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 50% 0%, rgba(16,185,129,0.18), transparent 55%), radial-gradient(circle at 0% 100%, rgba(52,211,153,0.14), transparent 55%), radial-gradient(circle at 100% 70%, rgba(110,231,183,0.12), transparent 60%)",
                }}
              />
              <div className="relative mx-auto w-full max-w-5xl px-6">
                <h2 className="font-sans text-balance text-center text-3xl font-semibold tracking-tight text-emerald-800 sm:text-4xl">
                  POV: You found the ultimate peace hack.
                </h2>
                <p className="mx-auto mt-5 max-w-3xl text-pretty text-center text-sm leading-relaxed text-zinc-700 sm:text-base">
                  Want to say sorry in a way that melts hearts? The Olive Branch is a custom digital apology designed to make forgiveness feel easy. Watch the final screen playfully nudge them toward a happy ending. Fully personalized, totally risk-free, and 100% unforgettable.
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