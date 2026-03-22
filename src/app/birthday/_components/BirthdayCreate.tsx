"use client";

import { useId, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import { savePendingCheckout } from "@/lib/checkout";
import { fileToDataUrl } from "@/lib/surprises";
import { MobilePreviewFrame } from "@/app/create/_components/MobilePreviewFrame";
import { ExperienceShell } from "@/app/create/_components/ExperienceShell";

export function BirthdayCreate() {
  const router = useRouter();
  const fileInputId = useId();

  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [cakeType, setCakeType] = useState<string>("Chocolate");
  const [otherCakeType, setOtherCakeType] = useState<string>("");
  const [message, setMessage] = useState<string>("Happy Birthday! 🎂");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const finalName = useMemo(() => name.trim(), [name]);

  const finalMessage = useMemo(() => {
    const m = message.trim();
    return m.length > 0 ? m : "Happy Birthday!";
  }, [message]);

  const finalAge = useMemo(() => {
    const n = Number(age);
    if (!Number.isFinite(n)) return undefined;
    if (n <= 0) return undefined;
    return Math.floor(n);
  }, [age]);

  const finalCakeType = useMemo(() => {
    if (cakeType !== "Other") return cakeType;
    const t = otherCakeType.trim();
    return t.length > 0 ? t : "Other";
  }, [cakeType, otherCakeType]);

  const canContinue = useMemo(() => {
    return finalMessage.trim().length > 0 && !uploading;
  }, [finalMessage, uploading]);

  return (
    <ExperienceShell variant="birthday">
    <div className="mx-auto w-full max-w-5xl px-6 py-10 sm:py-14">
      <header className="mx-auto max-w-3xl text-center">
        <p className="glass-pill inline-flex items-center gap-2 text-sm text-rose-700">
          <span className="text-base">♥</span>
          Create a Birthday Surprise
        </p>
        <h1 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
          Build a mini birthday moment
        </h1>
        <p className="mt-3 text-pretty text-sm text-zinc-600 sm:text-base">
          Add the details, preview it live, then pay to generate a unique link.
        </p>
      </header>

      <div className="mx-auto mt-10 grid max-w-5xl gap-6 lg:grid-cols-2">
        <div className="glass-card p-6 sm:p-8">
          <div className="glass-panel bg-white/60 p-5">
            <div className="text-sm font-semibold text-zinc-900">What you’re creating</div>
            <div className="mt-2 text-sm text-zinc-700">
              A birthday surprise with a candle moment, your details, and your message.
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
                placeholder="e.g. Pratiti"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="age" className="text-sm font-medium text-zinc-800">
                  Age (optional)
                </label>
                <input
                  id="age"
                  inputMode="numeric"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="glass-input mt-2 w-full"
                  placeholder="e.g. 21"
                />
              </div>

              <div>
                <label htmlFor="cakeType" className="text-sm font-medium text-zinc-800">
                  Cake type
                </label>
                <select
                  id="cakeType"
                  value={cakeType}
                  onChange={(e) => setCakeType(e.target.value)}
                  className="glass-input mt-2 w-full"
                >
                  {[
                    "Chocolate",
                    "Vanilla",
                    "Strawberry",
                    "Red Velvet",
                    "Butterscotch",
                    "Other",
                  ].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {cakeType === "Other" ? (
              <div>
                <label htmlFor="otherCakeType" className="text-sm font-medium text-zinc-800">
                  Specify cake type
                </label>
                <input
                  id="otherCakeType"
                  value={otherCakeType}
                  onChange={(e) => setOtherCakeType(e.target.value)}
                  className="glass-input mt-2 w-full"
                  placeholder="e.g. Black Forest"
                />
              </div>
            ) : null}

            <div>
              <label htmlFor="message" className="text-sm font-medium text-zinc-800">
                Your message
              </label>
              <textarea
                id="message"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="glass-input mt-2 w-full resize-none"
                placeholder="Write something sweet…"
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
                  type: "birthday",
                  name: finalName,
                  age: finalAge,
                  cakeType: finalCakeType,
                  message: finalMessage,
                  photoUrl,
                  returnTo: "/create/birthday",
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

        <MobilePreviewFrame title="Birthday card" subtitle="Updates as you type">
          <div className="flex h-full flex-col">
            <div className="glass-soft bg-white/60 p-4">
              <div className="text-xs font-semibold text-rose-700">Birthday</div>
              <div className="mt-1 text-sm font-semibold text-zinc-900">
                {finalName ? `Happy Birthday, ${finalName}!` : "Happy Birthday!"}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {typeof finalAge === "number" ? (
                  <span className="glass-pill px-3 py-1 text-[11px] font-semibold text-rose-700">
                    Turning {finalAge}
                  </span>
                ) : null}
                {finalCakeType ? (
                  <span className="glass-pill px-3 py-1 text-[11px] font-semibold text-rose-700">
                    Cake: {finalCakeType}
                  </span>
                ) : null}
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
                      className="h-40 w-full rounded-2xl object-cover"
                    />
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <motion.div layout className="glass-panel mt-3 bg-rose-50/60 p-5 ring-rose-200">
                <div className="text-xs font-semibold text-rose-700">Message</div>
                <motion.div
                  key={message}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="mt-2 text-pretty text-sm text-zinc-800"
                >
                  {finalMessage}
                </motion.div>
              </motion.div>

              <div className="glass-soft mt-3 bg-white/60 p-4 text-center">
                <div className="text-xs font-semibold text-zinc-800">Tap to blow the candle</div>
                <div className="mt-2 text-2xl">🎂</div>
              </div>
            </div>

            <div className="mt-4 text-center text-[11px] font-semibold text-rose-700">
              Made with love ♥
            </div>
          </div>
        </MobilePreviewFrame>
      </div>
    </div>
    </ExperienceShell>
  );
}
