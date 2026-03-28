"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

import { ProposalExperience } from "@/app/proposal/_components/ProposalExperience";
import { PhotoPuzzle } from "@/app/puzzle/_components/PhotoPuzzle";
import { VirtualBirthday } from "@/app/birthday/_components/VirtualBirthday";
import { ValentineExperience } from "@/app/valentine/_components/ValentineExperience";
import { SorryExperience } from "../sorry/_components//SorryExperince";
import { ExperienceShell } from "@/app/create/_components/ExperienceShell";
import { BirthdaySplash } from "@/components/BirthdaySplash";

// Replace with your actual Cloudflare Worker URL
const API_URL = "https://send-your-wishes-be.send-your-wishes.workers.dev";

type ExperienceType = "proposal" | "valentine" | "puzzle" | "sorry" | "birthday";

export function SurpriseResultClient({ expectedType }: { expectedType: ExperienceType }) {
  const params = useParams<{ id: string }>();
  const slug = params?.id;

  const [record, setRecord] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [birthdaySplashDone, setBirthdaySplashDone] = useState(false);

  useEffect(() => {
    if (!slug) return;

    async function fetchFromCloud() {
      try {
        const res = await fetch(`${API_URL}/api/card/${slug}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setRecord(data);
      } catch (err) {
        console.error("Fetch magic error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchFromCloud();
  }, [slug]);

  const shellVariant = useMemo(() => 
    ["proposal", "birthday", "valentine", "sorry"].includes(expectedType) ? expectedType : "valentine"
  , [expectedType]);

  const shellBackground = expectedType === "birthday" ? "midnight" : "default";

  if (expectedType === "birthday" && (!birthdaySplashDone)) {
    return <BirthdaySplash onComplete={() => setBirthdaySplashDone(true)} />;
  }

  if (loading) {
    return (
      <ExperienceShell variant={shellVariant as any} background={shellBackground}>
        <div className="flex h-[60vh] items-center justify-center">
          <motion.div 
            animate={{ opacity: [0.4, 1, 0.4] }} 
            transition={{ repeat: Infinity, duration: 1.5 }} 
            className="text-xl font-bold text-rose-500 tracking-widest"
          >
            FETCHING MAGIC...
          </motion.div>
        </div>
      </ExperienceShell>
    );
  }

  if (error || !record) {
    return (
      <ExperienceShell variant={shellVariant as any} background={shellBackground}>
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <div className="glass-card p-10">
            <h2 className="text-2xl font-bold text-zinc-900">404: Vibe Not Found 💔</h2>
            <p className="mt-2 text-zinc-600">This link has expired or never existed.</p>
            <button 
              onClick={() => window.location.href = '/'} 
              className="mt-6 inline-block rounded-full bg-rose-600 px-8 py-2 text-white font-semibold transition-all hover:bg-rose-700"
            >
              Create New Surprise
            </button>
          </div>
        </div>
      </ExperienceShell>
    );
  }

  return (
    <ExperienceShell variant={shellVariant as any} background={shellBackground}>
      <motion.div 
        initial={expectedType === "birthday" ? { opacity: 0 } : { opacity: 0, y: 10 }} 
        animate={expectedType === "birthday" ? { opacity: 1 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <div className="sr-only">{expectedType}</div>
        {record.type === "proposal" && (
          <ProposalExperience 
            question={record.question} 
            recipient={record.recipient} 
            message={record.message} 
            yesText={record.yesText} 
            noText={record.noText} 
          />
        )}
        {record.type === "sorry" && <SorryExperience name={record.name} reason={record.message} />}
        {record.type === "valentine" && <ValentineExperience name={record.name} message={record.message} photoUrl={record.photoUrl} />}
        {record.type === "puzzle" && (
          <PhotoPuzzle 
            imageUrl={record.photoUrl ?? "/puzzle-photo.svg"} 
            hiddenMessage={record.message} 
          />
        )}
        {record.type === "birthday" && (
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