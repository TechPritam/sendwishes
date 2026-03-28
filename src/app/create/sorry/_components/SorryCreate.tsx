"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import { ExperienceShell } from "@/app/create/_components/ExperienceShell";
import { MobilePreviewFrame } from "@/app/create/_components/MobilePreviewFrame";
import { savePendingCheckout } from "@/lib/checkout";

export function SorryCreate() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [reason, setReason] = useState("");

    const theirName = useMemo(() => name.trim(), [name]);
    const safeReason = useMemo(() => reason.trim(), [reason]);

    const canContinue = safeReason.length > 0;

    const letterPreview = useMemo(() => {
        const to = theirName || "my favorite human";
        const why = safeReason || "(your reason goes here)";
        return (
            `Dear ${to},\n\n` +
            `I hate it when there’s distance between us. My world feels a little less bright when you aren't smiling at me. ` +
            `I'm truly sorry for ${why}.\n\n` +
            `You deserve the best version of me, and I promise to keep working on being that person. ` +
            `Can we hit the reset button?`
        );
    }, [safeReason, theirName]);

    return (
        <ExperienceShell variant="sorry">
            <div className="mx-auto w-full max-w-5xl px-6 py-10 sm:py-14">
                <header className="mx-auto max-w-3xl text-center">
                    <p className="glass-pill inline-flex items-center gap-2 text-sm text-emerald-700">
                        <span className="text-base">🌿</span>
                        THE APOLOGY ERA 🎀
                    </p>
                    <h1 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
                        A cute, humble way to say sorry
                    </h1>
                    <p className="mt-3 text-pretty text-sm text-zinc-600 sm:text-base">
                        Create a 5-screen reconciliation journey. Pay to generate a unique link you can send.
                    </p>
                </header>

                <div className="mx-auto mt-10 grid max-w-5xl gap-6 lg:grid-cols-2">
                    <div className="glass-card p-6 sm:p-8">
                        <div className="glass-panel bg-white/60 p-5">
                            <div className="text-sm font-semibold text-zinc-900">What you’re creating</div>
                            <div className="mt-2 text-sm text-zinc-700">
                                A calm, animated “olive branch” experience with a heartfelt letter and a playful final verdict.
                            </div>
                        </div>

                        <div className="mt-6 grid gap-5">
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
                                    rows={5}
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    className="glass-input mt-2 w-full resize-none"
                                    placeholder="e.g. forgetting our plan and not communicating"
                                />
                                <div className="mt-2 text-xs text-zinc-500">
                                    Keep it simple and honest — no explanations, just ownership.
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                            <button
                                type="button"
                                disabled={!canContinue}
                                onClick={() => {
                                    if (!canContinue) return;
                                    savePendingCheckout({
                                        type: "sorry",
                                        name: theirName,
                                        message: safeReason,
                                        photoUrl: null,
                                        returnTo: "/create/sorry",
                                    });
                                    router.push("/payment");
                                }}
                                className="inline-flex h-11 w-full items-center justify-center rounded-full bg-emerald-600 px-7 text-sm font-semibold text-white shadow-sm shadow-emerald-200/60 transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                            >
                                Continue to payment
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push("/")}
                                className="inline-flex h-11 w-full items-center justify-center rounded-full bg-white px-7 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200 transition-colors hover:bg-emerald-50 sm:w-auto"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>

                    <MobilePreviewFrame title="Olive branch" subtitle="Preview">
                        <div className="flex h-full flex-col">
                            <div className="glass-soft bg-white/60 p-4">
                                <div className="text-xs font-semibold text-emerald-700">To</div>
                                <div className="mt-1 text-sm font-semibold text-zinc-900">{theirName || "Your favorite person"}</div>
                            </div>

                            <div className="mt-3 flex-1">
                                <motion.div layout className="glass-panel bg-white/70 p-5 ring-emerald-200">
                                    <div className="text-xs font-semibold text-emerald-700">Letter</div>
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={letterPreview}
                                            initial={{ opacity: 0, y: 6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -6 }}
                                            transition={{ duration: 0.2, ease: "easeOut" }}
                                            className="mt-2 whitespace-pre-wrap text-pretty text-sm text-zinc-800"
                                        >
                                            {letterPreview}
                                        </motion.div>
                                    </AnimatePresence>
                                </motion.div>

                                <div className="mt-4 rounded-2xl bg-emerald-50/70 p-4 text-xs text-zinc-700 ring-1 ring-emerald-200">
                                    Final screen includes a playful Yes/No verdict.
                                </div>
                            </div>

                            <div className="mt-4 text-center text-[11px] font-semibold text-emerald-700">
                                Tap-friendly · calm · sincere
                            </div>
                        </div>
                    </MobilePreviewFrame>
                </div>
            </div>
        </ExperienceShell>
    );
}
