"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

import { getSurprise, type ExperienceType, type SurpriseRecord } from "@/lib/surprises";
import { ProposalExperience } from "@/app/proposal/_components/ProposalExperience";
import { PhotoPuzzle } from "@/app/puzzle/_components/PhotoPuzzle";
import { VirtualBirthday } from "@/app/birthday/_components/VirtualBirthday";
import { ValentineExperience } from "@/app/valentine/_components/ValentineExperience";
import { ExperienceShell } from "@/app/create/_components/ExperienceShell";
import { BirthdaySplash } from "@/components/BirthdaySplash";

type SurpriseResultClientProps = {
  expectedType: ExperienceType;
};

function titleFor(t: ExperienceType) {
  if (t === "proposal") return "Proposal";
  if (t === "valentine") return "Valentine";
  if (t === "puzzle") return "Photo Puzzle";
  return "Birthday";
}

export function SurpriseResultClient({ expectedType }: SurpriseResultClientProps) {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [record, setRecord] = useState<SurpriseRecord | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [birthdaySplashDone, setBirthdaySplashDone] = useState(false);

  useEffect(() => {
    if (!id) return;
    const r = getSurprise(id);
    setRecord(r);
    setLoaded(true);
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setBirthdaySplashDone(false);
  }, [id]);

  const pageTitle = useMemo(() => titleFor(expectedType), [expectedType]);

  const shellVariant = expectedType === "proposal" || expectedType === "birthday" || expectedType === "valentine"
    ? expectedType
    : "valentine";

  const shellBackground = expectedType === "birthday" ? "midnight" : "default";

  const showBirthdaySplash = expectedType === "birthday" && (!loaded || !birthdaySplashDone);

  if (showBirthdaySplash) {
    return <BirthdaySplash onComplete={() => setBirthdaySplashDone(true)} />;
  }

  if (!loaded) {
    return (
      <ExperienceShell variant={shellVariant} background={shellBackground}>
        <div className="mx-auto max-w-3xl px-6 py-16">
          <div className="glass-card p-8">
            <div className="text-sm font-medium text-rose-700">Loading…</div>
          </div>
        </div>
      </ExperienceShell>
    );
  }

  if (!record || record.type !== expectedType) {
    return (
      <ExperienceShell variant={shellVariant} background={shellBackground}>
        <div className="mx-auto max-w-3xl px-6 py-16">
          <div className="glass-card p-8">
            <div className="text-lg font-semibold text-zinc-900">Not found</div>
            <div className="mt-2 text-sm text-zinc-600">
              This link isn’t available on this device yet (we’re using localStorage for now).
            </div>
            <div className="mt-5 rounded-2xl bg-rose-50/70 p-4 text-sm text-zinc-700 ring-1 ring-rose-200">
              Tip: Create and pay from the same browser, then open the generated link.
            </div>
          </div>
        </div>
      </ExperienceShell>
    );
  }

  return (
    <ExperienceShell variant={shellVariant} background={shellBackground}>
      <motion.div
      initial={expectedType === "birthday" ? { opacity: 0 } : { opacity: 0, y: 10 }}
      animate={expectedType === "birthday" ? { opacity: 1 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <div className="sr-only">{pageTitle}</div>
        {record.type === "proposal" ? (
          <ProposalExperience
            question={record.question}
            recipient={record.recipient}
            message={record.message}
            yesText={record.yesText}
            noText={record.noText}
          />
        ) : record.type === "valentine" ? (
          <ValentineExperience name={record.name} message={record.message} photoUrl={record.photoUrl} />
        ) : record.type === "puzzle" ? (
          <PhotoPuzzle
            imageUrl={record.photoUrl ?? "/puzzle-photo.svg"}
            hiddenMessage={record.message}
          />
        ) : (
          <VirtualBirthday
            name={record.name ?? ""}
            age={record.age}
            cakeType={record.cakeType}
            photoUrl={record.photoUrl}
            message={record.message}
          />
        )}
      </motion.div>
    </ExperienceShell>
  );
}
