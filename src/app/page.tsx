import { Footer } from "./_components/Footer";
import { Navbar } from "./_components/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <section className="relative w-full overflow-hidden bg-gradient-to-br from-rose-50 via-white to-[rgb(189_0_103_/_40%)]">
          <div className="mx-auto w-full max-w-5xl px-6 pt-14 pb-16 sm:pt-20 sm:pb-20">
            <div className="mx-auto max-w-3xl text-center">
              <h3 className="text-balance text-base font-semibold tracking-tight text-[rgb(121_29_80)] sm:text-lg">
                Personalized Digital Keepsakes
              </h3>

              <h1 className="mb-6 mt-4 text-balance text-4xl font-semibold tracking-tight text-[rgb(121_29_80)] sm:text-6xl">
                <span className="block font-sans">Craft Magic. Send Love.</span>
                <span className="block font-script italic text-rose-700">Guarantee a Smile.</span>
              </h1>

              <h6 className="m-10 text-pretty text-sm font-medium leading-relaxed text-zinc-600 sm:text-base">
                Why send a card when you can send an experience? Our high-fidelity digital stationery combines elegant
                calligraphy with gamified surprises, turning simple messages into interactive memories they’ll want to play
                on repeat.
              </h6>

              <div className="m-14 grid gap-3 sm:grid-cols-3">
                <Link
                  href="/create/proposal"
                  className="inline-flex items-center justify-center rounded-2xl border border-rose-200 bg-white/70 px-5 py-4 text-sm font-semibold text-rose-700 ring-1 ring-white/30 transition-colors hover:bg-rose-50"
                >
                  The Perfect Proposal
                </Link>
                <Link
                  href="/create/birthday"
                  className="inline-flex items-center justify-center rounded-2xl border border-rose-200 bg-white/70 px-5 py-4 text-sm font-semibold text-rose-700 ring-1 ring-white/30 transition-colors hover:bg-rose-50"
                >
                  Virtual Birthday Bash
                </Link>
                <Link
                  href="/puzzle"
                  className="inline-flex items-center justify-center rounded-2xl border border-rose-200 bg-white/70 px-5 py-4 text-sm font-semibold text-rose-700 ring-1 ring-white/30 transition-colors hover:bg-rose-50"
                >
                  Surprise Photo Puzzle
                </Link>
              </div>
            </div>
          </div>

          {/* Wave / zigzag divider into the next section */}
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-px">
            <svg
              className="h-14 w-full fill-white sm:h-20"
              viewBox="0 0 1440 120"
              preserveAspectRatio="none"
            >
              <path d="M0,64 C120,96 240,96 360,64 C480,32 600,32 720,64 C840,96 960,96 1080,64 C1200,32 1320,32 1440,64 L1440,120 L0,120 Z" />
            </svg>
          </div>
        </section>

        <section className="w-full bg-gradient-to-b from-white via-rose-50/60 to-rose-50/20">
          <div className="mx-auto w-full max-w-5xl px-6 py-12 sm:py-16">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-sans text-balance text-2xl font-semibold tracking-tight text-[rgb(121_29_80)] sm:text-4xl">
                Why you’ll love it
              </h2>
              <p className="mt-3 text-pretty text-sm text-zinc-600 sm:text-base">
                Four reasons your message feels unforgettable.
              </p>
            </div>

            <div className="mx-auto mt-9 grid max-w-3xl gap-5 sm:grid-cols-2">
              {[
                { title: "Personal", description: "Feels like you wrote it.", icon: "💌" },
                { title: "Interactive", description: "Tap → react → smile.", icon: "✨" },
                { title: "Shareable", description: "Just send a link.", icon: "🔗" },
                { title: "Fast", description: "Create in under a minute.", icon: "⚡" },
              ].map((c) => (
                <div
                  key={c.title}
                  className="glass-card group relative overflow-hidden p-7 transition-transform duration-200 will-change-transform hover:-translate-y-0.5 hover:scale-[1.03] hover:bg-white/80 hover:shadow-xl hover:shadow-rose-200/40 sm:p-8"
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 20% 10%, rgba(244,63,94,0.12), transparent 45%), radial-gradient(circle at 90% 30%, rgba(236,72,153,0.10), transparent 55%)",
                    }}
                  />

                  <div className="relative">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/70 ring-1 ring-rose-200">
                      <div className="text-2xl" aria-hidden>
                        {c.icon}
                      </div>
                    </div>
                    <div className="mt-4 text-base font-semibold text-[rgb(121_29_80)]">{c.title}</div>
                    <div className="mt-1 text-sm text-zinc-700">{c.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer alignMobile="left" />
    </>
  );
}