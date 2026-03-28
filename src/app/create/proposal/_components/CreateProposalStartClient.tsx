"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ExperienceShell } from "@/app/create/_components/ExperienceShell";
import { MobilePreviewFrame } from "@/app/create/_components/MobilePreviewFrame";
import { CreateProposalNavbar } from "./CreateProposalNavbar";
import { ProposalPreviewBackground } from "./ProposalPreviewBackground";
import { ProposalPhonePreview } from "./ProposalPhonePreview";

// Replace with your actual Cloudflare Worker URL
const API_URL = "https://send-your-wishes-be.send-your-wishes.workers.dev";

type Step = 1 | 2 | 3;
type QuestionChoice = "girlfriend" | "forever" | "custom";

const DEFAULT_QUESTIONS: Record<Exclude<QuestionChoice, "custom">, string> = {
  girlfriend: "Will you be my girlfriend?",
  forever: "Will you be forever mine?",
};

export function CreateProposalStartClient() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [isCreating, setIsCreating] = useState(false);

  const [theirName, setTheirName] = useState("");
  const [choice, setChoice] = useState<QuestionChoice>("girlfriend");
  const [customQuestion, setCustomQuestion] = useState("");

  const question = useMemo(() => {
    if (choice === "custom") return customQuestion;
    return DEFAULT_QUESTIONS[choice];
  }, [choice, customQuestion]);

  const canGoNext = useMemo(() => {
    if (step === 1) return theirName.trim().length > 0;
    if (step === 2) return question.trim().length > 0;
    return true;
  }, [question, step, theirName]);

  const personalizedMessage = useMemo(() => {
    const n = theirName.trim();
    if (!n) return "I knew you couldn't say no!";
    return `Hey ${n} — I knew you couldn't say no!`;
  }, [theirName]);

  async function handleCreateMagic() {
    if (isCreating) return;
    setIsCreating(true);

    const draftId = crypto.randomUUID();
    const config = {
      type: "proposal",
      name: theirName.trim(),
      question: question.trim(),
      recipient: "her",
      message: personalizedMessage.trim(),
      yesText: "Yes ✨️",
      noText: "No",
      photoUrl: null,
    };

    try {
      // 1. Save Draft to D1
      await fetch(`${API_URL}/api/save-draft`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: draftId, type: "proposal", config }),
      });

      // 2. Activate Link
      const res = await fetch(`${API_URL}/api/activate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draftId }),
      });

      if (!res.ok) throw new Error("Activation failed");
      
      const { slug } = await res.json();
      
      // 3. Redirect to the permanent cloud link
      router.push(`/share/${slug}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create magic. Please check your connection.");
      setIsCreating(false);
    }
  }

  function goBack() {
    if (step === 1) {
      router.push("/create/proposal");
      return;
    }
    setStep((prev) => (prev > 1 ? ((prev - 1) as Step) : prev));
  }

  return (
    <ExperienceShell variant="proposal" align="start" paddingY="none">
      <CreateProposalNavbar />
      <main className="mx-auto flex min-h-[calc(100dvh-72px)] w-full max-w-5xl items-center justify-center px-6 py-10">
        <div className="w-full max-w-3xl">
          <button type="button" onClick={goBack} className="glass-pill inline-flex items-center gap-2 text-sm font-semibold text-rose-700 hover:bg-white/80">
            <ChevronLeft className="h-4 w-4" /> Back
          </button>

          <div className="mt-5 glass-card p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm font-medium text-rose-700">Step {step} of 3</div>
              <div className="flex w-40 items-center gap-2">
                {[1, 2, 3].map((n) => (
                  <div key={n} className={"h-2 flex-1 rounded-full " + (n <= step ? "bg-rose-500" : "bg-rose-100")} />
                ))}
              </div>
            </div>

            <div className="mt-6">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="s1" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                    <h1 className="text-lg font-semibold text-[rgb(121_29_80)]">Who is this surprise for?</h1>
                    <input value={theirName} onChange={(e) => setTheirName(e.target.value)} placeholder="e.g. Aanya" className="glass-input mt-5 w-full" />
                    <div className="mt-6 flex justify-end">
                      <button disabled={!canGoNext} onClick={() => setStep(2)} className="rounded-full bg-rose-600 px-8 py-3 text-sm font-semibold text-white disabled:opacity-50 transition-all hover:bg-rose-700">Next</button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="s2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                    <h2 className="text-lg font-semibold text-[rgb(121_29_80)]">Pick a question</h2>
                    <div className="mt-5 grid gap-3">
                      {(["girlfriend", "forever", "custom"] as const).map((key) => (
                        <button key={key} type="button" onClick={() => setChoice(key)} className={"rounded-2xl p-4 text-left ring-1 transition " + (choice === key ? "bg-rose-50 ring-rose-300" : "bg-white/60 ring-rose-100")}>
                          <div className="font-medium text-[rgb(121_29_80)]">{key === "custom" ? "Custom Question" : DEFAULT_QUESTIONS[key as keyof typeof DEFAULT_QUESTIONS]}</div>
                        </button>
                      ))}
                    </div>
                    {choice === "custom" && <input value={customQuestion} onChange={(e) => setCustomQuestion(e.target.value)} placeholder="Write your own..." className="glass-input mt-4 w-full" />}
                    <div className="mt-6 flex justify-end gap-3">
                      <button type="button" onClick={goBack} className="glass-pill px-8 py-3 text-rose-700">Back</button>
                      <button disabled={!canGoNext} onClick={() => setStep(3)} className="rounded-full bg-rose-600 px-8 py-3 text-white transition-all hover:bg-rose-700">Preview</button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="s3" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                    <h2 className="text-lg font-semibold text-[rgb(121_29_80)]">Here’s the preview</h2>
                    <div className="mt-6">
                      <MobilePreviewFrame title="Proposal" removePadding background={<ProposalPreviewBackground />}>
                        <ProposalPhonePreview question={question} message={personalizedMessage} yesText="Yes ✨️" noText="No" />
                      </MobilePreviewFrame>
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                      <button type="button" onClick={goBack} className="glass-pill px-8 py-3 text-rose-700">Back</button>
                      <button 
                        type="button"
                        disabled={isCreating} 
                        onClick={handleCreateMagic} 
                        className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-8 py-3 lg:font-bold text-white shadow-lg transition-all hover:bg-rose-700 active:scale-95"
                      >
                        {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                        {isCreating ? "Creating..." : "Create Magic for Free"}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </ExperienceShell>
  );
}