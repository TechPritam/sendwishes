"use client";

import { useId, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { savePendingCheckout } from "@/lib/checkout";
import { fileToDataUrl } from "@/lib/surprises";
import { MobilePreviewFrame } from "@/app/create/_components/MobilePreviewFrame";
import { AnimatePresence, motion } from "framer-motion";
import { ExperienceShell } from "@/app/create/_components/ExperienceShell";

export function ValentineCreate() {
  const router = useRouter();
  const fileInputId = useId();

  const [name, setName] = useState<string>("");
  const [message, setMessage] = useState<string>(
    "Happy Valentine’s Day. I’m so lucky to have you. ♥",
  );
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const finalName = useMemo(() => name.trim(), [name]);
  const canContinue = useMemo(() => message.trim().length > 0 && !uploading, [message, uploading]);

  return (
    <ExperienceShell variant="valentine">
    <div className="mx-auto w-full max-w-5xl px-6 py-10 sm:py-14">
      <header className="mx-auto max-w-3xl text-center">
        <p className="glass-pill inline-flex items-center gap-2 text-sm text-rose-700">
          <span className="text-base">♥</span>
          Create a Valentine Gift
        </p>
        <h1 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
          A romantic card they can open
        </h1>
        <p className="mt-3 text-pretty text-sm text-zinc-600 sm:text-base">
          A simple, beautiful Valentine message (plus an optional photo). Pay to generate a unique link.
        </p>
      </header>

      <div className="mx-auto mt-10 grid max-w-5xl gap-6 lg:grid-cols-2">
        <div className="glass-card p-6 sm:p-8">
          <div className="glass-panel bg-white/60 p-5">
            <div className="text-sm font-semibold text-zinc-900">What you’re creating</div>
            <div className="mt-2 text-sm text-zinc-700">
              A Valentine surprise page with your message and an optional photo.
            </div>
          </div>

          <div className="mt-6 grid gap-5">
            <div>
              <label htmlFor="name" className="text-sm font-medium text-zinc-800">
                Their name (optional)
              </label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="glass-input mt-2 w-full"
                placeholder="e.g. Alex"
              />
            </div>

            <div>
              <label htmlFor="message" className="text-sm font-medium text-zinc-800">
                Your message
              </label>
              <textarea
                id="message"
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="glass-input mt-2 w-full resize-none"
                placeholder="Write something romantic…"
              />
            </div>

            <div className="glass-soft p-4">
              <label htmlFor={fileInputId} className="block text-sm font-medium text-zinc-800">
                Photo (optional)
              </label>
              <input
                id={fileInputId}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.currentTarget.files?.[0] ?? null;
                  if (!f) {
                    setPhotoUrl(null);
                    return;
                  }

                  setUploading(true);
                  fileToDataUrl(f)
                    .then((url) => setPhotoUrl(url))
                    .catch(() => setPhotoUrl(null))
                    .finally(() => setUploading(false));
                }}
                className="mt-2 block w-full text-sm file:mr-4 file:rounded-full file:border-0 file:bg-rose-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-rose-700"
              />
              <div className="mt-3 text-xs text-zinc-500">
                {uploading ? "Uploading…" : photoUrl ? "Photo ready" : "No photo selected"}
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
                  type: "valentine",
                  name: finalName,
                  message: message.trim(),
                  photoUrl,
                  returnTo: "/create/valentine",
                });
                router.push("/payment");
              }}
              className="inline-flex h-11 w-full items-center justify-center rounded-full bg-rose-600 px-7 text-sm font-semibold text-white shadow-sm shadow-rose-200/50 transition-colors hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              Continue to payment
            </button>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="inline-flex h-11 w-full items-center justify-center rounded-full bg-white px-7 text-sm font-semibold text-rose-700 ring-1 ring-rose-200 transition-colors hover:bg-rose-50 sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </div>

        <MobilePreviewFrame
          title="Valentine card"
          subtitle="Updates as you type"
        >
          <div className="flex h-full flex-col">
            <div className="glass-soft bg-white/60 p-4">
              <div className="text-xs font-semibold text-rose-700">To</div>
              <div className="mt-1 text-sm font-semibold text-zinc-900">
                {finalName || "Your favorite person"}
              </div>
            </div>

            <div className="mt-3 flex-1">
              <AnimatePresence>
                {photoUrl ? (
                  <motion.div
                    key="photo"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="glass-panel overflow-hidden p-2"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photoUrl}
                      alt="Preview"
                      className="h-44 w-full rounded-2xl object-cover"
                    />
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <motion.div
                layout
                className="glass-panel mt-3 bg-rose-50/60 p-5 ring-rose-200"
              >
                <div className="text-xs font-semibold text-rose-700">Message</div>
                <motion.div
                  key={message}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="mt-2 text-pretty text-sm text-zinc-800"
                >
                  {message.trim() || "Write your message…"}
                </motion.div>
              </motion.div>
            </div>

            <div className="mt-4 text-center text-[11px] font-semibold text-rose-700">
              Happy Valentine’s Day ♥
            </div>
          </div>
        </MobilePreviewFrame>
      </div>
    </div>
    </ExperienceShell>
  );
}
