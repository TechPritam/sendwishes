"use client";

import { useId, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { savePendingCheckout } from "@/lib/checkout";
import { fileToDataUrl } from "@/lib/surprises";

export function PuzzleCreate() {
  const router = useRouter();
  const fileInputId = useId();

  const [message, setMessage] = useState<string>(
    "You did it. And just like this puzzle… you complete my heart. ♥",
  );
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const canContinue = useMemo(() => {
    return message.trim().length > 0 && photoUrl !== null && !uploading;
  }, [message, photoUrl, uploading]);

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10 sm:py-14">
      <header className="mx-auto max-w-3xl text-center">
        <p className="glass-pill inline-flex items-center gap-2 text-sm text-rose-700">
          <span className="text-base">♥</span>
          Create a Photo Puzzle
        </p>
        <h1 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
          Upload a photo
        </h1>
        <p className="mt-3 text-pretty text-sm text-zinc-600 sm:text-base">
          Add a hidden message, then pay to generate a unique puzzle link.
        </p>
      </header>

      <div className="glass-card mx-auto mt-10 max-w-3xl p-6 sm:p-8">
        <div className="grid gap-5">
          <div className="glass-soft p-4">
            <label htmlFor={fileInputId} className="block text-sm font-medium text-zinc-800">
              Choose an image
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

            {photoUrl ? (
              <div className="glass-panel mt-4 overflow-hidden p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoUrl}
                  alt="Selected"
                  className="h-40 w-full rounded-2xl object-cover"
                />
              </div>
            ) : null}
          </div>

          <div>
            <label htmlFor="message" className="text-sm font-medium text-zinc-800">
              Hidden message
            </label>
            <textarea
              id="message"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="glass-input mt-2 w-full resize-none"
              placeholder="Write the message they’ll unlock…"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            disabled={!canContinue}
            onClick={() => {
              if (!canContinue) return;
              savePendingCheckout({
                type: "puzzle",
                message: message.trim(),
                photoUrl,
                returnTo: "/puzzle",
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
    </div>
  );
}
