"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { OurStoryGallery } from "../OurStoryGallery";
import { WeddingFooter } from "../WeddingFooter";
import { WeddingCurtainGuard } from "../TheaterEntryGuard";

type WeddingEvent = {
  name: string;
  date: string;
  time: string;
  location?: string;
};

export type WeddingTemplate2Details = {
  groom: string;
  bride: string;
  date: string;
  time: string;
  location: string;
  heroImage?: string;
  gallery?: string[];
  events?: WeddingEvent[];
  groomParents?: string;
  brideParents?: string;
  rsvpPhone?: string;
  dressCode?: string;
  weddingHashtag?: string;
  preWeddingVideoUrl?: string;
  groomPhoto?: string;
  bridePhoto?: string;
  groomMessage?: string;
  brideMessage?: string;
};

// Helper functions for formatting
const formatPrettyDate = (value: string) => {
  const date = new Date(value);
  return isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en-GB", {
    weekday: "long", day: "2-digit", month: "long", year: "numeric",
  }).format(date);
};

const DEFAULT_PRE_WEDDING_VIDEO_URL = "https://youtu.be/MkNtgoPr-TE?si=mwGrcvjXyUL_Be8D";

const getEventCardBackground = (eventName: string) => {
  const name = (eventName || "").toLowerCase();
  if (name.includes("haldi")) return "/assets/haldi-bg.png";
  if (name.includes("sangeet") || name.includes("vidaai") || name.includes("vidai")) return "/assets/doli.png";
  if (name.includes("shadi") || name.includes("barat")) return "/assets/barat.png";
  return "/assets/bg.png";
};

const toYouTubeEmbedUrl = (value?: string) => {
  if (!value) return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return `https://www.youtube.com/embed/${trimmed}`;
  try {
    const url = new URL(trimmed);
    const host = url.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id ? `https://www.youtube.com/embed/${id}` : trimmed;
    }
    if (host === "youtube.com" || host === "m.youtube.com") {
      if (url.pathname.startsWith("/embed/")) return trimmed;
      if (url.pathname === "/watch") {
        const id = url.searchParams.get("v");
        return id ? `https://www.youtube.com/embed/${id}` : trimmed;
      }
      if (url.pathname.startsWith("/shorts/")) {
        const id = url.pathname.split("/").filter(Boolean)[1];
        return id ? `https://www.youtube.com/embed/${id}` : trimmed;
      }
    }
    return trimmed;
  } catch { return trimmed; }
};

// --- ANIMATION VARIANTS (Fixed Types) ---
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.5,
    },
  },
};

const revealItem: Variants = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function PremiumWeddingTemplate({ details }: { details: WeddingTemplate2Details }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [hasEntered, setHasEntered] = useState(false);

  const safeWeddingTag = (details.weddingHashtag || "OurForever").replace(/#/g, "");

  const mapsUrl = useMemo(() => {
    const location = details.location || "Pimpale Nilakh, Pune";
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
  }, [details.location]);

  const preWeddingEmbedUrl = useMemo(() => {
    return (
      toYouTubeEmbedUrl(details.preWeddingVideoUrl) ||
      toYouTubeEmbedUrl(DEFAULT_PRE_WEDDING_VIDEO_URL)
    );
  }, [details.preWeddingVideoUrl]);

  useEffect(() => {
    const target = new Date(`${details.date}T${details.time || "00:00"}`);
    const interval = setInterval(() => {
      const now = new Date();
      const diff = Math.max(0, target.getTime() - now.getTime());
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / 1000 / 60) % 60),
        secs: Math.floor((diff / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [details.date, details.time]);

  const toggleMusic = () => {
    const el = audioRef.current;
    if (!el) return;
    const nextMuted = !isMuted;
    el.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted) el.play().catch(() => {});
  };

  const handleEnterTheater = () => {
    setHasEntered(true);
    // Scroll to top when preview is launched
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
    const el = audioRef.current;
    if (!el) return;
    el.muted = false;
    setIsMuted(false);
    el.play().catch(() => {});
  };

  return (
    <main className="relative min-h-screen bg-[#faf9f6] text-[#333] overflow-x-hidden">
      <WeddingCurtainGuard onOpen={handleEnterTheater} />
      
      <div
        className="fixed inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "url('/assets/432.jpg')",
          backgroundSize: "300px",
          backgroundRepeat: "repeat",
        }}
      />

      <audio ref={audioRef} src="/assets/kudmayi.mp3" loop muted />

      <AnimatePresence>
        {hasEntered && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="fixed top-5 right-5 z-[900] flex items-center gap-3"
          >
            <button
              type="button"
              onClick={toggleMusic}
              className="h-11 w-11 rounded-full bg-white/85 backdrop-blur-md border border-black/10 shadow-lg flex items-center justify-center text-[#b08d57]"
            >
              {isMuted ? "🔇" : "🎵"}
            </button>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="h-11 w-11 rounded-full bg-white/85 backdrop-blur-md border border-black/10 shadow-lg flex items-center justify-center text-[#b08d57]"
            >
              📍
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate={hasEntered ? "visible" : "hidden"}
        className="relative z-10"
      >
        {/* HERO SECTION */}
        <section className="relative min-h-screen w-full overflow-hidden flex flex-col items-center pt-12 pb-20">
          <motion.div variants={revealItem} className="relative z-20 flex flex-col items-center mb-8">
            <img
              src="https://amantrran.com/wp-content/uploads/2025/11/Ganeshji_new.png"
              alt="Lord Ganesh"
              className="w-[50px] md:w-32 h-auto drop-shadow-2xl mb-4"
            />
            <p className="font-serif italic text-[#b08d57] tracking-[0.2em] text-sm md:text-lg">
              || श्री गणेशाय नमः ||
            </p>
          </motion.div>

          <motion.div
            variants={revealItem}
            className="relative z-10 w-[85%] max-w-md aspect-[3/4] rounded-t-full border-8 border-white shadow-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
            <img
              src={details.heroImage || "https://images.unsplash.com/photo-1583939003579-730e3918a45a"}
              className="w-full h-full object-cover"
              alt="Groom and Bride"
            />
            <div className="absolute bottom-8 left-0 right-0 z-20 text-center text-white">
              <p className="uppercase tracking-[0.3em] text-[10px] mb-2 font-light">The Wedding Of</p>
              <h1 className="text-4xl md:text-5xl font-serif leading-tight">
                {details.groom} <br />
                <span className="italic text-2xl font-serif lowercase my-1 block">&</span>
                {details.bride}
              </h1>
            </div>
          </motion.div>

          <motion.div variants={revealItem} className="relative z-20 text-center mt-10 px-6 max-w-lg">
            <p className="font-serif text-[#b08d57] italic text-lg md:text-xl leading-relaxed">
              With hearts full of joy and the love of our elders, we cordially invite you to join us as we celebrate the wedding ceremony of {details.groom} and {details.bride}.
            </p>
            <div className="mt-16 flex items-center justify-center gap-4">
              <div className="h-[1px] w-8 bg-[#b08d57]/40" />
              ❤️
              <p className="uppercase tracking-[0.4em] text-xs font-bold text-gray-600">
                {details.location || "Pimpale Nilakh, Pune"}
              </p>
              ❤️
              <div className="h-[1px] w-8 bg-[#b08d57]/40"></div>
            </div>
          </motion.div>
        </section>

        {/* ANNOUNCEMENT */}
        <section className="relative py-4 px-6 text-center max-w-4xl mx-auto">
          <motion.div variants={revealItem} className="space-y-8">
            <p className="font-serif italic text-2xl text-[#b08d57] leading-relaxed">
              &quot;With Divine Blessings and Joyful Hearts, <br /> We Invite You To Grace Us With Your Presence...&quot;"
            </p>
            <div className="py-10 border-y border-[#b08d57]/20">
              <h2 className="text-3xl md:text-5xl font-serif tracking-tighter text-gray-800 uppercase">
                {formatPrettyDate(details.date)}
              </h2>
              <p className="mt-4 tracking-[0.3em] text-gray-500 uppercase text-sm italic">Witness The Beginning Of Our Forever</p>
            </div>
            
            <div className="grid grid-cols-4 gap-2 md:gap-8 max-w-lg mx-auto pt-8">
              {[
                { label: "Days", val: timeLeft.days },
                { label: "Hours", val: timeLeft.hours },
                { label: "Mins", val: timeLeft.mins },
                { label: "Secs", val: timeLeft.secs }
              ].map((unit, i) => (
                <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-black/5 my-10">
                  <span className="block text-3xl font-light text-[#b08d57]">{String(unit.val).padStart(2, '0')}</span>
                  <span className="text-[10px] uppercase tracking-tighter text-gray-400 font-bold">{unit.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* EVENTS GRID */}
        <section className="relative mt-8 py-24 px-6 overflow-hidden">
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              backgroundImage: "url('/assets/432.jpg')",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              opacity: 0.25,
            }}
          />
          <div className="relative z-10 max-w-5xl mx-auto">
            <motion.h2 variants={revealItem} className="text-center font-serif text-3xl tracking-[0.2em] mb-16 uppercase text-gray-700">The Celebration</motion.h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {details.events?.map((event, idx) => (
                <motion.div
                  key={idx}
                  variants={revealItem}
                  whileHover={{ y: -10 }}
                  className="relative overflow-hidden group rounded-[36px] shadow-xl shadow-black/5 border border-white/40 min-h-[260px]"
                  style={{
                    backgroundImage: `url('${getEventCardBackground(event.name)}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-black/70 group-hover:bg-black/50 transition-colors" />
                  <div className="relative z-10 p-8">
                    <h3 className="font-serif italic text-white text-2xl leading-snug mt-2">{event.name}</h3>
                    <div className="w-10 h-[0px] bg-white/40 my-14" />
                    <div className="space-y-2">
                      <p className="font-serif text-white/95 text-sm tracking-wide">{formatPrettyDate(details.date)}</p>
                      <p className="font-serif text-white/95 text-sm tracking-wide">{event.time}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <motion.div variants={revealItem} className="max-w-7xl mx-auto">
          <OurStoryGallery images={details.gallery} tone="gold" />
        </motion.div>

        {/* PRE-WEDDING VIDEO */}
        <motion.section variants={revealItem} className="py-24 px-6 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl mb-4">Pre‑Wedding Film</h2>
            <p className="italic text-[#b08d57] font-serif">A glimpse of our journey before forever</p>
          </div>
          <div className="bg-white/70 backdrop-blur-sm border border-black/5 rounded-3xl p-4 md:p-8 shadow-sm">
            <div className="relative w-full aspect-video overflow-hidden rounded-2xl border border-black/10">
              <iframe
                className="absolute inset-0 h-full w-full"
                src={preWeddingEmbedUrl}
                title="Pre-wedding video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </motion.section>

        {/* HASHTAG + QUOTE */}
        <motion.section variants={revealItem} className="py-16 px-6 max-w-2xl mx-auto text-center">
          <div className="bg-white/70 backdrop-blur-sm border border-black/5 rounded-3xl p-10 shadow-sm">
            <p className="text-[#b08d57] tracking-[0.3em] text-xs font-bold uppercase">#{safeWeddingTag}</p>
            <p className="mt-6 font-serif italic text-2xl text-gray-800 leading-relaxed">
              “In the garden of life, love is the most beautiful flower.”
            </p>
          </div>
        </motion.section>

        <motion.div variants={revealItem}>
          <WeddingFooter />
        </motion.div>
      </motion.div>
    </main>
  );
}