"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { completeCheckout, readPendingCheckout, type PendingCheckout } from "@/lib/checkout";
import { ExperienceShell } from "@/app/create/_components/ExperienceShell";

function typeLabel(t: PendingCheckout["type"]) {
  if (t === "proposal") return "Proposal";
  if (t === "birthday") return "Birthday";
  if (t === "valentine") return "Valentine";
  return "Puzzle";
}

export function PaymentClient() {
  const router = useRouter();
  const [pending, setPending] = useState<PendingCheckout | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    setPending(readPendingCheckout());
    setLoaded(true);
  }, []);

  const summary = useMemo(() => {
    if (!pending) return null;
    const messagePreview = pending.message.trim().slice(0, 140);
    return {
      title: typeLabel(pending.type),
      name: pending.name?.trim() || "",
      hasPhoto: Boolean(pending.photoUrl),
      messagePreview,
    };
  }, [pending]);

  if (!loaded) {
    return (
      <ExperienceShell variant="valentine">
        <div className="mx-auto w-full max-w-5xl px-6 py-10 sm:py-14">
          <div className="glass-card mx-auto max-w-3xl p-8">
            <div className="text-sm font-medium text-rose-700">Loading…</div>
          </div>
        </div>
      </ExperienceShell>
    );
  }

  if (!pending || !summary) {
    return (
      <ExperienceShell variant="valentine">
        <div className="mx-auto w-full max-w-5xl px-6 py-10 sm:py-14">
          <div className="glass-card mx-auto max-w-3xl p-6 sm:p-8">
            <div className="text-lg font-semibold text-zinc-900">No checkout in progress</div>
            <div className="mt-2 text-sm text-zinc-600">
              Go back and start from a product page.
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="inline-flex h-11 w-full items-center justify-center rounded-full bg-rose-600 px-7 text-sm font-semibold text-white shadow-sm shadow-rose-200/50 transition-colors hover:bg-rose-700 sm:w-auto"
              >
                Back to home
              </button>
              <button
                type="button"
                onClick={() => router.push("/create/proposal")}
                className="inline-flex h-11 w-full items-center justify-center rounded-full bg-white px-7 text-sm font-semibold text-rose-700 ring-1 ring-rose-200 transition-colors hover:bg-rose-50 sm:w-auto"
              >
                Create a proposal
              </button>
            </div>
          </div>
        </div>
      </ExperienceShell>
    );
  }

  const shellVariant = pending.type === "proposal" || pending.type === "birthday" || pending.type === "valentine"
    ? pending.type
    : "valentine";

  return (
    <ExperienceShell variant={shellVariant}>
    <div className="mx-auto w-full max-w-5xl px-6 py-10 sm:py-14">
      <header className="mx-auto max-w-3xl text-center">
        <p className="glass-pill inline-flex items-center gap-2 text-sm text-rose-700">
          <span className="text-base">♥</span>
          Dummy Payment
        </p>
        <h1 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
          Almost there
        </h1>
        <p className="mt-3 text-pretty text-sm text-zinc-600 sm:text-base">
          This is a placeholder checkout step. Clicking Pay will generate your unique link.
        </p>
      </header>

      <div className="glass-card mx-auto mt-10 max-w-3xl p-6 sm:p-8">
        <div className="glass-panel bg-white/60 p-5">
          <div className="text-sm font-semibold text-zinc-900">Order summary</div>
          <div className="mt-3 text-sm text-zinc-700">
            <div>
              <span className="font-medium">Product:</span> {summary.title}
            </div>
            {summary.name ? (
              <div className="mt-1">
                <span className="font-medium">Name:</span> {summary.name}
              </div>
            ) : null}
            <div className="mt-1">
              <span className="font-medium">Photo:</span> {summary.hasPhoto ? "Included" : "None"}
            </div>
            <div className="mt-1">
              <span className="font-medium">Message:</span>{" "}
              {summary.messagePreview ? (
                <span className="text-zinc-700">“{summary.messagePreview}{pending.message.length > 140 ? "…" : ""}”</span>
              ) : (
                <span className="text-zinc-500">(empty)</span>
              )}
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-rose-50/70 p-4 text-sm text-zinc-700 ring-1 ring-rose-200">
            Amount: <span className="font-semibold text-rose-700">₹99</span> (dummy)
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            disabled={paying}
            onClick={() => {
              if (paying) return;
              setPaying(true);
              const id = completeCheckout(pending);
              router.push(`/share/${id}`);
            }}
            className="inline-flex h-11 w-full items-center justify-center rounded-full bg-rose-600 px-7 text-sm font-semibold text-white shadow-sm shadow-rose-200/50 transition-colors hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {paying ? "Processing…" : "Pay & generate link"}
          </button>
          <button
            type="button"
            disabled={paying}
            onClick={() => router.push(pending.returnTo || "/")}
            className="inline-flex h-11 w-full items-center justify-center rounded-full bg-white px-7 text-sm font-semibold text-rose-700 ring-1 ring-rose-200 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            Back
          </button>
        </div>
      </div>
    </div>
    </ExperienceShell>
  );
}
