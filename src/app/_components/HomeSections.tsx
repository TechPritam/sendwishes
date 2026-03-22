import Link from "next/link";
import { Cake, Heart, Puzzle, Sparkles } from "lucide-react";

function ProductCard({
  title,
  description,
  href,
  icon: Icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Link
      href={href}
      className="group block"
    >
      <div className="glass-card relative h-full overflow-hidden p-6 transition will-change-transform group-hover:-translate-y-0.5 group-hover:bg-white/80 group-hover:shadow-xl group-hover:shadow-rose-200/40">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-rose-50/60 via-white/20 to-pink-50/50 opacity-0 transition-opacity group-hover:opacity-100"
        />

        <div className="relative flex h-full flex-col">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="glass-soft inline-flex h-11 w-11 items-center justify-center ring-rose-200">
                <Icon className="h-5 w-5 text-rose-700" />
              </div>
              <div>
                <div className="text-lg font-semibold tracking-tight text-zinc-900">{title}</div>
                <div className="mt-1 text-xs font-medium text-rose-700">Made for mobile</div>
              </div>
            </div>

            <div className="glass-pill px-3 py-1 text-xs font-semibold text-rose-700">♥</div>
          </div>

          <div className="mt-4 text-sm text-zinc-600 leading-relaxed">{description}</div>

          <div className="mt-6 flex items-center justify-between">
            <div className="text-xs text-zinc-500">Takes ~30 seconds</div>
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-rose-700">
              Create now
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function MainProducts() {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-10 sm:py-14">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-balance text-2xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
          Choose your surprise
        </h2>
        <p className="mt-3 text-pretty text-sm text-zinc-600 sm:text-base">
          Pick a vibe—each one is designed to feel cute, romantic, and unforgettable.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ProductCard
          title="Proposal"
          description="A playful, unrejectable moment with a big YES." 
          href="/create/proposal"
          icon={Heart}
        />
        <ProductCard
          title="Birthday"
          description="Cake, candles, and a mini celebration on-screen." 
          href="/create/birthday"
          icon={Cake}
        />
        <ProductCard
          title="Valentine"
          description="A romantic card + optional photo reveal." 
          href="/create/valentine"
          icon={Sparkles}
        />
        <ProductCard
          title="Photo Puzzle"
          description="Turn a photo into a little game they must solve." 
          href="/puzzle"
          icon={Puzzle}
        />
      </div>
    </section>
  );
}
