"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ExperienceShell } from "@/app/create/_components/ExperienceShell";
import { MobilePreviewFrame } from "@/app/create/_components/MobilePreviewFrame";
import { CreateSorryNavbar } from "../_components/CreateSorryNavbar";
import { SorryPreviewBackground } from "../../create/sorry/_components/SorryPreviewBackground";
import { SorryExperiencePreview } from "../../create/sorry/_components/SorryExperiencePreview";

const API_URL = "https://send-your-wishes-be.send-your-wishes.workers.dev";

type Step = 1 | 2 | 3;

export function CreateSorryStartClient() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [isCreating, setIsCreating] = useState(false);

  const [theirName, setTheirName] = useState("");
  const [reason, setReason] = useState("");

  const canGoNext = useMemo(() => {
    if (step === 1) return theirName.trim().length > 0;
    if (step === 2) return reason.trim().length > 0;
    return true;
  }, [step, theirName, reason]);

  async function handleCreateMagic() {
    if (isCreating) return;
    setIsCreating(true);
    const draftId = crypto.randomUUID();
    const config = {
      type: "sorry",
      name: theirName.trim(),
      message: reason.trim(),
      photoUrl: null,
    };
    try {
      await fetch(`${API_URL}/api/save-draft`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: draftId, type: "sorry", config }),
      });
      const res = await fetch(`${API_URL}/api/activate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draftId }),
      });
      if (!res.ok) throw new Error("Activation failed");
      const { slug } = await res.json();
      router.push(`/share/${slug}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create magic. Please check your connection.");
      setIsCreating(false);
    }
  }

  function goBack() {
    if (step === 1) {
      router.push("/create/sorry");
      return;
    }
    setStep((prev) => (prev > 1 ? ((prev - 1) as Step) : prev));
  }

  return (
    <ExperienceShell variant="sorry" align="start" paddingY="none">
      <CreateSorryNavbar />
      <main className="mx-auto flex min-h-[calc(100dvh-72px)] w-full max-w-5xl items-center justify-center px-6 py-10">
        <div className="w-full max-w-3xl">
          <button type="button" onClick={goBack} className="glass-pill inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:bg-white/80">
            <ChevronLeft className="h-4 w-4" /> Back
          </button>
          <div className="mt-5 glass-card p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm font-medium text-emerald-700">Step {step} of 3</div>
              <div className="flex w-40 items-center gap-2">
                {[1, 2, 3].map((n) => (
                  <div key={n} className={"h-2 flex-1 rounded-full " + (n <= step ? "bg-emerald-500" : "bg-emerald-100")} />
                ))}
              </div>
            </div>
            <div className="mt-6">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="s1" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                    <h1 className="text-lg font-semibold text-emerald-800">Who is this apology for?</h1>
                    <input value={theirName} onChange={(e) => setTheirName(e.target.value)} placeholder="e.g. Aanya" className="glass-input mt-5 w-full" />
                    <div className="mt-6 flex justify-end">
                      <button disabled={!canGoNext} onClick={() => setStep(2)} className="rounded-full bg-emerald-600 px-8 py-3 text-sm font-semibold text-white disabled:opacity-50 transition-all hover:bg-emerald-700">Next</button>
                    </div>
                  </motion.div>
                )}
                {step === 2 && (
                  <motion.div key="s2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                    <h2 className="text-lg font-semibold text-emerald-800">What are you sorry for?</h2>
                    <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. forgetting our plan and not communicating" className="glass-input mt-5 w-full resize-none" rows={4} />
                    <div className="mt-6 flex justify-end gap-3">
                      <button type="button" onClick={goBack} className="glass-pill px-8 py-3 text-emerald-700">Back</button>
                      <button disabled={!canGoNext} onClick={() => setStep(3)} className="rounded-full bg-emerald-600 px-8 py-3 text-white transition-all hover:bg-emerald-700">Preview</button>
                    </div>
                  </motion.div>
                )}
                {step === 3 && (
                  <motion.div key="s3" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                    <h2 className="text-lg font-semibold text-emerald-800">Here’s the preview</h2>
                    <div className="mt-6">
                      <MobilePreviewFrame title="Apology Era" removePadding background={<SorryPreviewBackground />}>
                        <SorryExperiencePreview name={theirName} reason={reason} />
                      </MobilePreviewFrame>
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                      <button type="button" onClick={goBack} className="glass-pill px-8 py-3 text-emerald-700">Back</button>
                      <button
                        type="button"
                        disabled={isCreating}
                        onClick={handleCreateMagic}
                        className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-8 py-3 lg:font-bold text-white shadow-lg transition-all hover:bg-emerald-700 active:scale-95"
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