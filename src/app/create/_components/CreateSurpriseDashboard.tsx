"use client";

import { useId, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  buildExperienceUrl,
  fileToDataUrl,
  generateUuid,
  saveSurprise,
  type ExperienceType,
} from "@/lib/surprises";

type Category = "Proposal" | "Birthday" | "Puzzle";

type Step = 1 | 2 | 3 | 4;

function categoryToExperienceType(category: Category): ExperienceType {
  if (category === "Proposal") return "proposal";
  if (category === "Birthday") return "birthday";
  return "puzzle";
}

export function CreateSurpriseDashboard() {
  const fileInputId = useId();
  const [step, setStep] = useState<Step>(1);

  const [category, setCategory] = useState<Category | "">("");
  const [message, setMessage] = useState<string>("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [generatedId, setGeneratedId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const canGoNext = useMemo(() => {
    if (step === 1) return category !== "";
    if (step === 2) return message.trim().length > 0;
    if (step === 3) return photoUrl !== null;
    return false;
  }, [step, category, message, photoUrl]);

  function goBack() {
    setGeneratedUrl(null);
    setStep((prev) => (prev > 1 ? ((prev - 1) as Step) : prev));
  }

  function goNext() {
    if (!canGoNext) return;
    setStep((prev) => (prev < 4 ? ((prev + 1) as Step) : prev));
  }

  function generateLink() {
    if (!category) return;
    const id = generateUuid();
    const type = categoryToExperienceType(category);

    saveSurprise({
      id,
      type,
      message: message.trim(),
      photoUrl,
    });

    setGeneratedId(id);
    setGeneratedUrl(buildExperienceUrl(type, id));
    setStep(4);
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10 sm:py-14">
      <header className="mx-auto max-w-3xl text-center">
        <p className="glass-pill inline-flex items-center gap-2 text-sm text-rose-700">
          <span className="text-base">♥</span>
          Create Your Surprise
        </p>
        <h1 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
          Let’s build a sweet little moment
        </h1>
        <p className="mt-3 text-pretty text-sm text-zinc-600 sm:text-base">
          Choose a vibe, write your message, add a photo, and generate a shareable
          link.
        </p>
      </header>

      <div className="glass-card mx-auto mt-10 max-w-3xl p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div className="text-sm font-medium text-rose-700">Step {step} of 4</div>
          <div className="flex w-44 items-center gap-2" aria-hidden>
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className={
                  "h-2 flex-1 rounded-full " +
                  (n <= step ? "bg-rose-500" : "bg-rose-100")
                }
              />
            ))}
          </div>
        </div>

        <div className="mt-6">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
              >
                <h2 className="text-lg font-semibold text-zinc-900">
                  1) Choose a category
                </h2>
                <p className="mt-1 text-sm text-zinc-600">
                  Pick the kind of surprise you’re creating.
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {(["Proposal", "Birthday", "Puzzle"] as const).map((c) => {
                    const selected = category === c;
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCategory(c)}
                        className={
                          "rounded-2xl p-4 text-left ring-1 transition " +
                          (selected
                            ? "bg-rose-50 ring-rose-300"
                            : "bg-white/60 ring-rose-100 hover:bg-rose-50/60")
                        }
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-zinc-900">{c}</div>
                          <div
                            className={
                              "text-sm " +
                              (selected ? "text-rose-600" : "text-rose-300")
                            }
                          >
                            ♥
                          </div>
                        </div>
                        <div className="mt-1 text-sm text-zinc-600">
                          {c === "Proposal"
                            ? "A sweet question, beautifully delivered."
                            : c === "Birthday"
                              ? "A cute message with a celebratory vibe."
                              : "A playful surprise with a little mystery."}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            ) : null}

            {step === 2 ? (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
              >
                <h2 className="text-lg font-semibold text-zinc-900">
                  2) Enter a custom message
                </h2>
                <p className="mt-1 text-sm text-zinc-600">
                  Keep it romantic, funny, or totally you.
                </p>

                <div className="mt-5">
                  <label
                    htmlFor="message"
                    className="text-sm font-medium text-zinc-800"
                  >
                    Your message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write something they’ll want to read twice…"
                    className="glass-input mt-2 w-full resize-none"
                  />
                  <div className="mt-2 text-xs text-zinc-500">
                    Selected category: {category || "—"}
                  </div>
                </div>
              </motion.div>
            ) : null}

            {step === 3 ? (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
              >
                <h2 className="text-lg font-semibold text-zinc-900">
                  3) Upload a photo
                </h2>
                <p className="mt-1 text-sm text-zinc-600">
                  Add a picture that makes them smile.
                </p>

                <div className="glass-soft mt-5 p-4">
                  <label
                    htmlFor={fileInputId}
                    className="block text-sm font-medium text-zinc-800"
                  >
                    Choose an image
                  </label>
                  <input
                    id={fileInputId}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.currentTarget.files?.[0] ?? null;
                      setGeneratedUrl(null);
                      setGeneratedId(null);
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
                    {uploading
                      ? "Preparing photo…"
                      : photoUrl
                        ? "Photo selected"
                        : "No file selected yet."}
                  </div>
                </div>
              </motion.div>
            ) : null}

            {step === 4 ? (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
              >
                <h2 className="text-lg font-semibold text-zinc-900">
                  4) Success!
                </h2>
                <p className="mt-1 text-sm text-zinc-600">
                  Your surprise link is ready to share.
                </p>

                <div className="glass-soft mt-5 bg-rose-50/70 p-4 ring-rose-200">
                  <div className="text-xs font-medium text-rose-700">
                    Shareable URL
                  </div>
                  <div className="mt-2 break-all rounded-2xl bg-white/70 p-3 text-sm font-medium text-zinc-900 ring-1 ring-rose-100">
                    {generatedUrl ?? "—"}
                  </div>
                  <div className="mt-3 text-xs text-zinc-500">
                    {generatedId
                      ? "Saved locally (localStorage) for now."
                      : "(Generate a link to save your surprise.)"}
                  </div>
                </div>

                <div className="glass-soft mt-6 grid gap-3 p-4">
                  <div className="text-sm font-medium text-zinc-900">
                    Summary
                  </div>
                  <div className="text-sm text-zinc-700">
                    <span className="font-medium">Category:</span> {category}
                  </div>
                  <div className="text-sm text-zinc-700">
                    <span className="font-medium">Message:</span> {message}
                  </div>
                  <div className="text-sm text-zinc-700">
                    <span className="font-medium">Photo:</span> {photoUrl ? "Included" : "None"}
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 1}
            className="inline-flex h-11 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-rose-700 ring-1 ring-rose-200 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Back
          </button>

          {step < 4 ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              {step === 3 ? (
                <button
                  type="button"
                  onClick={generateLink}
                  disabled={!canGoNext}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-rose-600 px-6 text-sm font-semibold text-white shadow-sm shadow-rose-200/50 transition-colors hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Generate Link
                </button>
              ) : (
                <button
                  type="button"
                  onClick={goNext}
                  disabled={!canGoNext}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-rose-600 px-6 text-sm font-semibold text-white shadow-sm shadow-rose-200/50 transition-colors hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setCategory("");
                setMessage("");
                setPhotoUrl(null);
                setGeneratedUrl(null);
                setGeneratedId(null);
              }}
              className="inline-flex h-11 items-center justify-center rounded-full bg-rose-600 px-6 text-sm font-semibold text-white shadow-sm shadow-rose-200/50 transition-colors hover:bg-rose-700"
            >
              Create another
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
