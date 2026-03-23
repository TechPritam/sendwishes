"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { generateUuid, saveSurprise } from "@/lib/surprises";
import { ExperienceShell } from "@/app/create/_components/ExperienceShell";
import { MobilePreviewFrame } from "@/app/create/_components/MobilePreviewFrame";
import { CreateProposalNavbar } from "./CreateProposalNavbar";
import { ProposalPreviewBackground } from "./ProposalPreviewBackground";
import { ProposalPhonePreview } from "./ProposalPhonePreview";

type Step = 1 | 2 | 3;

type QuestionChoice = "girlfriend" | "forever" | "custom";

const DEFAULT_QUESTIONS: Record<Exclude<QuestionChoice, "custom">, string> = {
  girlfriend: "Will you be my girlfriend?",
  forever: "Will you be forever mine?",
};

export function CreateProposalStartClient() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);

  const [theirName, setTheirName] = useState("");
  const [choice, setChoice] = useState<QuestionChoice>("girlfriend");
  const [customQuestion, setCustomQuestion] = useState("");

  const question = useMemo(() => {
    if (choice === "custom") return customQuestion;
    return DEFAULT_QUESTIONS[choice];
  }, [choice, customQuestion]);

  const canGoNext = useMemo(() => {
    if (step === 1) return theirName.trim().length > 0;
    if (step === 2) {
      const q = question.trim();
      return q.length > 0;
    }
    return true;
  }, [question, step, theirName]);

  function goBack() {
    if (step === 1) {
      router.push("/create/proposal");
      return;
    }
    setStep((prev) => (prev > 1 ? ((prev - 1) as Step) : prev));
  }

  function goNext() {
    if (!canGoNext) return;
    setStep((prev) => (prev < 3 ? ((prev + 1) as Step) : prev));
  }

  const personalizedMessage = useMemo(() => {
    const n = theirName.trim();
    if (!n) return "I knew you couldn't say no!";
    return `Hey ${n} — I knew you couldn't say no!`;
  }, [theirName]);

  return (
    <ExperienceShell variant="proposal" align="start" paddingY="none">
      <CreateProposalNavbar />

      <main className="mx-auto flex min-h-[calc(100dvh-72px)] w-full max-w-5xl items-center justify-center px-6 py-10">
        <div className="w-full max-w-3xl">
          <button
            type="button"
            onClick={goBack}
            className="glass-pill inline-flex items-center gap-2 text-sm font-semibold text-rose-700 hover:bg-white/80"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>

          <div className="mt-5 glass-card p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm font-medium text-rose-700">Step {step} of 3</div>
              <div className="flex w-40 items-center gap-2" aria-hidden>
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className={"h-2 flex-1 rounded-full " + (n <= step ? "bg-rose-500" : "bg-rose-100")}
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
                    <h1 className="text-lg font-semibold text-[rgb(121_29_80)]">Who is this surprise for?</h1>
                    <p className="mt-1 text-sm text-zinc-600">Just their name — we{"'"}ll personalize the vibe.</p>

                    <div className="mt-5">
                      <label htmlFor="their-name" className="text-sm font-medium text-zinc-800">
                        Their name
                      </label>
                      <input
                        id="their-name"
                        value={theirName}
                        onChange={(e) => setTheirName(e.target.value)}
                        placeholder="e.g. Aanya"
                        className="glass-input mt-2 w-full"
                      />
                    </div>

                    <div className="mt-6 flex justify-end">
                      <button
                        type="button"
                        disabled={!canGoNext}
                        onClick={goNext}
                        className="inline-flex h-11 items-center justify-center rounded-full bg-rose-600 px-8 text-sm font-semibold text-white shadow-sm shadow-rose-200/50 transition-colors hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Next
                      </button>
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
                    <h2 className="text-lg font-semibold text-[rgb(121_29_80)]">Pick a question</h2>
                    <p className="mt-1 text-sm text-zinc-600">Choose one — or write your own.</p>

                    <div className="mt-5 grid gap-3">
                      {([
                        { key: "girlfriend", label: DEFAULT_QUESTIONS.girlfriend },
                        { key: "forever", label: DEFAULT_QUESTIONS.forever },
                        { key: "custom", label: "Custom" },
                      ] as const).map((q) => {
                        const selected = choice === q.key;
                        return (
                          <button
                            key={q.key}
                            type="button"
                            onClick={() => setChoice(q.key)}
                            className={
                              "rounded-2xl p-4 text-left ring-1 transition " +
                              (selected
                                ? "bg-rose-50 ring-rose-300"
                                : "bg-white/60 ring-rose-100 hover:bg-rose-50/60")
                            }
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="font-medium text-[rgb(121_29_80)]">{q.label}</div>
                              <div className={"text-sm " + (selected ? "text-rose-600" : "text-rose-300")}>
                                ♥
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {choice === "custom" ? (
                      <div className="mt-5">
                        <label htmlFor="custom-question" className="text-sm font-medium text-zinc-800">
                          Your custom question
                        </label>
                        <input
                          id="custom-question"
                          value={customQuestion}
                          onChange={(e) => setCustomQuestion(e.target.value)}
                          placeholder="e.g. Will you go on a date with me?"
                          className="glass-input mt-2 w-full"
                        />
                      </div>
                    ) : null}

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                      <button
                        type="button"
                        onClick={goBack}
                        className="glass-pill inline-flex h-11 items-center justify-center px-8 text-sm font-semibold text-rose-700 hover:bg-white/80"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        disabled={!canGoNext}
                        onClick={() => setStep(3)}
                        className="inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-pink-600 px-8 text-sm font-semibold text-white shadow-[0_0_18px_rgba(255,255,255,0.55)] transition-all hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        See your surprise
                      </button>
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
                    <h2 className="text-lg font-semibold text-[rgb(121_29_80)]">Here’s the preview</h2>
                    <p className="mt-1 text-sm text-zinc-600">If it feels right, create the magic.</p>

                    <div className="mt-6">
                      <MobilePreviewFrame
                        title="Proposal"
                        subtitle="Preview"
                        background={<ProposalPreviewBackground />}
                      >
                        <ProposalPhonePreview
                          question={question}
                          recipient="her"
                          message={personalizedMessage}
                          yesText="Yes ✨️"
                          noText="No"
                        />
                      </MobilePreviewFrame>
                    </div>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                      <button
                        type="button"
                        onClick={goBack}
                        className="glass-pill inline-flex h-11 items-center justify-center px-8 text-sm font-semibold text-rose-700 hover:bg-white/80"
                      >
                        Back
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const id = generateUuid();
                          saveSurprise({
                            id,
                            type: "proposal",
                            name: theirName.trim() || undefined,
                            question: question.trim(),
                            recipient: "her",
                            message: personalizedMessage.trim(),
                            yesText: "Yes ✨️",
                            noText: "No",
                            photoUrl: null,
                          });
                          router.push(`/share/${id}`);
                        }}
                        className="inline-flex h-11 items-center justify-center rounded-full bg-rose-600 px-8 text-sm font-semibold text-white shadow-sm shadow-rose-200/50 transition-colors hover:bg-rose-700"
                      >
                        Create Magic for Free
                      </button>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </ExperienceShell>
  );
}