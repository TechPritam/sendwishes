import Link from "next/link";
import { WEDDING_TEMPLATES } from "@/lib/weddingTemplates";

export default function WeddingTemplateChooserPage() {
  return (
    <main className="min-h-dvh bg-gradient-to-b from-rose-50 via-white to-rose-50/40">
      <div className="mx-auto w-full max-w-5xl px-6 pt-14 pb-16 sm:pt-20">
        <div className="mx-auto max-w-2xl text-center">
          {/* <div className="glass-pill mx-auto inline-flex items-center gap-2 text-[11px] font-semibold text-rose-700">
            Choose your style
          </div> */}
          <h1 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-[rgb(121_29_80)] sm:text-5xl">
            Pick a wedding invite template
          </h1>
          <p className="mt-3 text-pretty text-sm text-zinc-600 sm:text-base">
            Select a design first. Next you’ll add names, dates, photos and events.
          </p>
        </div>

      <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-2">
  {WEDDING_TEMPLATES.map((t) => (
    <Link
      key={t.id}
      href={t.comingSoon ? "#" : `/create/wedding?template=${t.id}`}
      className={`glass-card group overflow-hidden p-5 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-rose-200/40 ${t.comingSoon ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl ring-1 ring-rose-200 bg-white">
        {/* --- PRICE BADGE ON IMAGE --- */}
        <div className="absolute top-3 right-3 z-20 flex flex-col items-end">
          {!t.comingSoon && (
          <div className="bg-rose-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg mb-1">
            50% OFF
          </div>
          )}
        </div>

        <img
          src={t.thumbnailSrc}
          alt={t.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0"
        />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/90">
            {t.subtitle}
          </div>
          <div className="mt-1 text-lg font-semibold text-white">{t.title}</div>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm text-zinc-700 leading-relaxed line-clamp-2">{t.description}</p>
        
        <div className="mt-5 flex items-center justify-between">
          {/* --- PRICE SECTION --- */}
          {!t.comingSoon && (
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-400 line-through decoration-rose-300">
              ₹4,000
            </span>
            <span className="text-lg font-bold text-[rgb(121_29_80)]">
              ₹2,000
            </span>
          </div>
          )}

          <div className="inline-flex items-center justify-center rounded-2xl border border-rose-200 bg-white/70 px-4 py-2 text-xs font-semibold text-rose-700 transition-colors group-hover:bg-rose-50 shadow-sm">
            {t.comingSoon ? "Coming Soon" : "Use this template"}
          </div>

        </div>
      </div>
    </Link>
  ))}
</div>

        <div className="mx-auto mt-10 max-w-4xl text-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-2xl border border-rose-200 bg-white/60 px-5 py-3 text-sm font-semibold text-rose-700 ring-1 ring-white/30 transition-colors hover:bg-rose-50"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}