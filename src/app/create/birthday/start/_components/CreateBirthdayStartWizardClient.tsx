"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { ExperienceShell } from "@/app/create/_components/ExperienceShell";
import { MobilePreviewFrame } from "@/app/create/_components/MobilePreviewFrame";
import { BirthdayPreviewBackground } from "@/app/create/birthday/_components/BirthdayPreviewBackground";
import { BirthdayPhonePreview } from "@/app/create/birthday/_components/BirthdayPhonePreview";
import { generateUuid, saveSurprise } from "@/lib/surprises";

type Step = "name" | "date" | "letter" | "preview" | "payment";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

function clampDay(raw: string): number | undefined {
  const n = Number(raw);
  if (!Number.isFinite(n)) return undefined;
  const d = Math.floor(n);
  if (d < 1 || d > 31) return undefined;
  return d;
}

function buildPrefillLetter(name: string, day: number | undefined, month: string | undefined) {
  const safeName = name.trim() || "you";
  const when = day && month ? `${day} ${month}` : day ? `${day}` : month ? `${month}` : "today";

  return (
    `Dear ${safeName},\n\n` +
    `Happy Birthday! \ud83c\udf89\n` +
    `On ${when}, I just want to remind you how special you are.\n\n` +
    `May your year be full of health, happiness, and beautiful surprises.\n` +
    `Keep smiling, keep shining.\n\n` +
    `With love,\n` +
    `\u2014 Your favourite human\n`
  );
}

function Modal({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
      <div aria-hidden className="absolute inset-0 bg-black/60" />
      <div className="relative w-full max-w-md rounded-3xl bg-white/10 p-6 ring-1 ring-white/15 backdrop-blur">
        {children}
      </div>
    </div>
  );
}

export function CreateBirthdayStartWizardClient() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("name");

  const backPillClass =
    "inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/85 ring-1 ring-white/15 backdrop-blur transition-colors hover:bg-white/15";

  function goBackFrom(current: Step) {
    if (current === "name") {
      router.push("/create/birthday");
      return;
    }
    if (current === "date") {
      setStep("name");
      return;
    }
    if (current === "letter") {
      setStep("date");
      return;
    }
    if (current === "preview") {
      setStep("letter");
      return;
    }
    if (current === "payment") {
      setStep("preview");
      return;
    }
  }

  const [birthdayPerson, setBirthdayPerson] = useState<string>("");
  const [dayRaw, setDayRaw] = useState<string>("");
  const [month, setMonth] = useState<(typeof MONTHS)[number] | "">("");

  const day = useMemo(() => clampDay(dayRaw), [dayRaw]);

  const [letter, setLetter] = useState<string>("");
  const [letterTouched, setLetterTouched] = useState(false);

  const [upiId, setUpiId] = useState<string>("");

  const canGoNameNext = birthdayPerson.trim().length > 0;
  const canGoDateNext = Boolean(day) && month !== "";
  const canGoPreview = letter.trim().length > 0;
  const canPay = upiId.trim().length > 0;

  useEffect(() => {
    if (step !== "letter") return;
    if (letterTouched) return;

    const prefill = buildPrefillLetter(birthdayPerson, day, month === "" ? undefined : month);
    setLetter(prefill);
    // Intentionally keep letterTouched=false, so users can still get a fresh prefill
    // if they go back and change earlier steps.
  }, [birthdayPerson, day, letterTouched, month, step]);

  return (
    <ExperienceShell variant="birthday" background="midnight" align="center" paddingY="none">
      <button
        type="button"
        onClick={() => goBackFrom(step)}
        className="fixed left-5 top-5 z-[70] inline-flex h-11 items-center gap-2 rounded-full bg-pink-600 px-5 text-sm font-semibold text-white shadow-[0_0_18px_rgba(255,255,255,0.18)] transition-all hover:bg-pink-700"
        aria-label="Go back"
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </button>

      <main className="mx-auto flex w-full max-w-5xl flex-1 items-center justify-center px-6 py-6">
        <div className="mx-auto w-full max-w-3xl">
          {step === "letter" ? (
            <div className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/15 backdrop-blur sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-base font-semibold text-white">Write your letter</div>
                  <p className="mt-1 text-sm text-white/70">It’s prefilled already — edit it if you want.</p>
                </div>

                <div className="flex items-center gap-2">
                  {birthdayPerson.trim() ? (
                    <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80 ring-1 ring-white/15">
                      For {birthdayPerson.trim()}
                    </div>
                  ) : null}
                  {day && month ? (
                    <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80 ring-1 ring-white/15">
                      {day} {month}
                    </div>
                  ) : null}
                </div>
              </div>

              <textarea
                value={letter}
                onChange={(e) => {
                  setLetterTouched(true);
                  setLetter(e.target.value);
                }}
                rows={12}
                className="mt-4 w-full resize-none rounded-2xl bg-black/25 px-5 py-4 text-sm leading-relaxed text-white ring-1 ring-white/15 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500/60"
                placeholder="Write something sweet…"
              />

              <button
                type="button"
                disabled={!canGoPreview}
                onClick={() => setStep("preview")}
                className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-full bg-pink-600 px-8 text-base font-semibold text-white shadow-[0_0_18px_rgba(255,255,255,0.18)] transition-all hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                See Preview
              </button>
            </div>
          ) : null}

          {step === "preview" ? (
            <div className="grid gap-5">
              <div className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur sm:p-6">
                <div className="text-sm font-semibold text-white">Preview</div>
                <p className="mt-2 text-sm text-white/70">This is how the full surprise will look.</p>

                <div className="mt-4">
                  <MobilePreviewFrame title="Birthday" subtitle="Preview" background={<BirthdayPreviewBackground />}>
                    <BirthdayPhonePreview message={letter} />
                  </MobilePreviewFrame>
                </div>

                <button
                  type="button"
                  onClick={() => setStep("payment")}
                  className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-full bg-pink-600 px-8 text-base font-semibold text-white shadow-[0_0_18px_rgba(255,255,255,0.18)] transition-all hover:bg-pink-700"
                >
                  Create Magic @ ₹99
                </button>
              </div>
            </div>
          ) : null}

          {step === "payment" ? (
            <div className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/15 backdrop-blur">
              <div className="text-sm font-semibold text-white">Payment</div>
              <p className="mt-2 text-sm text-white/70">
                Fake payment screen. Enter any UPI ID to continue.
              </p>

              <div className="mt-4 rounded-2xl bg-black/20 p-4 ring-1 ring-white/10">
                <div className="text-xs font-semibold text-white/70">Summary</div>
                <div className="mt-2 text-sm text-white">
                  {birthdayPerson.trim() ? `Birthday for ${birthdayPerson.trim()}` : "Birthday"}
                </div>
                <div className="mt-1 text-xs text-white/70">
                  {day && month ? `${day} ${month}` : null}
                </div>
                <div className="mt-3 text-sm font-semibold text-white">₹99</div>
              </div>

              <label className="mt-4 block text-sm font-medium text-white">UPI ID</label>
              <input
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="mt-2 w-full rounded-2xl bg-black/25 px-4 py-3 text-sm text-white ring-1 ring-white/15 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500/60"
                placeholder="e.g. name@upi"
              />

              <button
                type="button"
                disabled={!canPay}
                onClick={() => {
                  if (!canPay) return;
                  const id = generateUuid();
                  saveSurprise({
                    id,
                    type: "birthday",
                    name: birthdayPerson.trim() || undefined,
                    message: letter,
                    photoUrl: null,
                  });
                  router.push(`/share/${id}`);
                }}
                className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-full bg-pink-600 px-8 text-base font-semibold text-white shadow-[0_0_18px_rgba(255,255,255,0.18)] transition-all hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Pay ₹99
              </button>
            </div>
          ) : null}
        </div>
      </main>

      {step === "name" ? (
        <Modal>
          <div className="text-base font-semibold text-white">Whose birthday is it?</div>
          <input
            autoFocus
            value={birthdayPerson}
            onChange={(e) => setBirthdayPerson(e.target.value)}
            className="mt-4 w-full rounded-2xl bg-black/25 px-4 py-3 text-sm text-white ring-1 ring-white/15 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500/60"
            placeholder="e.g. Pratiti"
          />
          <button
            type="button"
            disabled={!canGoNameNext}
            onClick={() => setStep("date")}
            className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-full bg-pink-600 px-8 text-base font-semibold text-white shadow-[0_0_18px_rgba(255,255,255,0.18)] transition-all hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Next
          </button>
        </Modal>
      ) : null}

      {step === "date" ? (
        <Modal>
          <div className="text-base font-semibold text-white">Birthday date</div>
          <p className="mt-2 text-sm text-white/70">Enter the day & month.</p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-white">Date</label>
              <input
                inputMode="numeric"
                value={dayRaw}
                onChange={(e) => setDayRaw(e.target.value)}
                className="mt-2 w-full rounded-2xl bg-black/25 px-4 py-3 text-sm text-white ring-1 ring-white/15 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500/60"
                placeholder="1-31"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-white">Month</label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value as (typeof MONTHS)[number] | "")}
                className="mt-2 w-full rounded-2xl bg-black/25 px-4 py-3 text-sm text-white ring-1 ring-white/15 focus:outline-none focus:ring-2 focus:ring-pink-500/60"
              >
                <option value="" disabled>
                  Select
                </option>
                {MONTHS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="button"
            disabled={!canGoDateNext}
            onClick={() => setStep("letter")}
            className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-full bg-pink-600 px-8 text-base font-semibold text-white shadow-[0_0_18px_rgba(255,255,255,0.18)] transition-all hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Next
          </button>
        </Modal>
      ) : null}
    </ExperienceShell>
  );
}
