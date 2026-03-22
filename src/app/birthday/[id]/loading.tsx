export default function Loading() {
  return (
    <div className="relative min-h-dvh w-full overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-purple-950 to-black"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-fuchsia-500/30 via-pink-500/10 to-transparent"
      />
      <div className="relative z-10 flex min-h-dvh w-full items-center justify-center px-6 py-12">
        <div className="w-[min(92vw,520px)] rounded-3xl border border-white/15 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-xl">
          <div className="mx-auto mb-4 h-10 w-40 rounded-full bg-white/10" />
          <div className="mx-auto h-8 w-[min(78vw,420px)] rounded-2xl bg-white/10" />
          <div className="mx-auto mt-3 h-4 w-48 rounded-xl bg-white/10" />
          <div className="mx-auto mt-7 h-11 w-36 rounded-full bg-pink-600/70" />
        </div>
      </div>
    </div>
  );
}
