import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-rose-200/50 bg-white/20">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-zinc-600">
          <span className="font-semibold text-zinc-900">sendyourWishes</span> — made with love.
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <Link className="text-rose-700 underline underline-offset-4" href="/create/proposal">
            Proposal
          </Link>
          <Link className="text-rose-700 underline underline-offset-4" href="/create/birthday">
            Birthday
          </Link>
          <Link className="text-rose-700 underline underline-offset-4" href="/create/valentine">
            Valentine
          </Link>
          <Link className="text-rose-700 underline underline-offset-4" href="/puzzle">
            Photo puzzels
          </Link>
        </div>
      </div>
    </footer>
  );
}
