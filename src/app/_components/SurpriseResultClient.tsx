"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

import { ProposalExperience } from "@/app/proposal/_components/ProposalExperience";
import { PhotoPuzzle } from "@/app/puzzle/_components/PhotoPuzzle";
import { VirtualBirthday } from "@/app/birthday/_components/VirtualBirthday";
import { ValentineExperience } from "@/app/valentine/_components/ValentineExperience";
import { SorryExperience } from "../sorry/_components/SorryExperince";
import { ExperienceShell } from "@/app/create/_components/ExperienceShell";
import { BirthdaySplash } from "@/components/BirthdaySplash";
import WeddingInvitation from "@/app/create/wedding/_components/WeddingInvitation";
import Template2 from "@/app/create/wedding/_components/templates/Template2";

// Replace with your actual Cloudflare Worker URL
const API_URL = "https://send-your-wishes-be.send-your-wishes.workers.dev";


type ExperienceType = "proposal" | "valentine" | "puzzle" | "sorry" | "birthday" | "wedding";

type RecordType =
  | { type: "proposal"; question: string; recipient: string; message: string; yesText: string; noText: string }
  | { type: "sorry"; name: string; message: string }
  | { type: "valentine"; name: string; message: string; photoUrl?: string }
  | { type: "puzzle"; photoUrl?: string; message: string }
  | { type: "birthday"; name?: string; age?: number; cakeType?: string; photoUrl?: string; message?: string }
  | {
      type: "wedding";
      name?: string;
      templateId?: "royal" | "hindu";
      groom: string;
      bride: string;
      date: string;
      time: string;
      location: string;
      groomParents?: string;
      brideParents?: string;
      rsvpPhone?: string;
      dressCode?: string;
      weddingHashtag?: string;
      preWeddingVideoUrl?: string;
      heroImage?: string;
      groomPhoto?: string;
      bridePhoto?: string;
      groomMessage?: string;
      brideMessage?: string;
      gallery?: string[];
      events?: { name: string; date: string; time: string; image: string }[];
    };


export function SurpriseResultClient({ expectedType }: { expectedType: ExperienceType }) {
  const params = useParams<{ id: string }>();
  const slug = params?.id;

  const [record, setRecord] = useState<RecordType | null>(null);
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


  const shellVariant = useMemo(() => {
    if (["proposal", "birthday", "valentine", "sorry"].includes(expectedType)) {
      return expectedType as "proposal" | "birthday" | "valentine" | "sorry";
    }
    return "valentine";
  }, [expectedType]);

  const shellBackground = expectedType === "birthday" ? "midnight" : "default";


  if (expectedType === "birthday" && (!birthdaySplashDone)) {
    return <BirthdaySplash onComplete={() => setBirthdaySplashDone(true)} />;
  }

  if (loading) {
    return (
      <ExperienceShell variant={shellVariant} background={shellBackground}>
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
      <ExperienceShell variant={shellVariant} background={shellBackground}>
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
    <ExperienceShell variant={shellVariant} background={shellBackground} paddingY={expectedType === "wedding" ? "none" : "default"}>
      <motion.div 
        initial={expectedType === "birthday" ? { opacity: 0 } : { opacity: 0, y: 10 }} 
        animate={expectedType === "birthday" ? { opacity: 1 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <div className="sr-only">{expectedType}</div>
        {record.type === "proposal" && "question" in record && "recipient" in record && "message" in record && "yesText" in record && "noText" in record && (
          <ProposalExperience 
            question={record.question} 
            recipient={record.recipient === "her" || record.recipient === "him" ? record.recipient : undefined} 
            message={record.message} 
            yesText={record.yesText} 
            noText={record.noText} 
          />
        )}
        {record.type === "sorry" && "name" in record && "message" in record && <SorryExperience name={record.name} reason={record.message} />}
        {record.type === "valentine" && "name" in record && "message" in record && (
          <ValentineExperience name={record.name} message={record.message} photoUrl={"photoUrl" in record ? record.photoUrl : undefined} />
        )}
        {record.type === "puzzle" && "message" in record && (
          <PhotoPuzzle 
            imageUrl={"photoUrl" in record && record.photoUrl ? record.photoUrl : "/puzzle-photo.svg"} 
            hiddenMessage={record.message} 
          />
        )}
        {record.type === "birthday" && (
          <VirtualBirthday 
            name={"name" in record && record.name ? record.name : ""} 
            age={"age" in record ? record.age : undefined} 
            cakeType={"cakeType" in record ? record.cakeType : undefined} 
            photoUrl={"photoUrl" in record ? record.photoUrl : undefined} 
            message={"message" in record ? record.message : undefined} 
          />
        )}
        {record.type === "wedding" && (
          record.templateId === "hindu" ? (
            <Template2
              details={{
                groom: record.groom,
                bride: record.bride,
                date: record.date,
                time: record.time,
                location: record.location,
                heroImage: record.heroImage,
                gallery: record.gallery,
                events: record.events?.map((e) => ({ name: e.name, date: e.date, time: e.time })),
                rsvpPhone: record.rsvpPhone,
                dressCode: record.dressCode,
                weddingHashtag: record.weddingHashtag,
                preWeddingVideoUrl: record.preWeddingVideoUrl,
              }}
            />
          ) : (
            <WeddingInvitation
              details={{
                groom: record.groom,
                bride: record.bride,
                date: record.date,
                time: record.time,
                location: record.location,
                heroImage: record.heroImage,
                gallery: record.gallery,
                events: record.events,
              }}
            />
          )
        )}
      </motion.div>
    </ExperienceShell>
  );
}