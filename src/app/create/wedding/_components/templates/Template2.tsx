"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, Variants, useScroll, useTransform } from "framer-motion";
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
  if (name.includes("sangeet") || name.includes("vidaai") || name.includes("vidai")) return "/assets/sangeet.jpg";
  if (name.includes("shadi") || name.includes("barat")) return "/assets/doli.png";
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

const revealItem: Variants = {
  hidden: { 
    opacity: 1, 
    scale: 0.9,
    y: 40,
    filter: "blur(1px)" 
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { 
      duration: 1.5, 
      ease: [0.22, 1, 0.36, 1] 
    },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export default function PremiumWeddingTemplate({ details }: { details: WeddingTemplate2Details }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [hasEntered, setHasEntered] = useState(false);

  const { scrollY } = useScroll();
  const iconOpacity = useTransform(scrollY, [0, 100], [0.6, 0]);

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
    <main className="relative min-h-screen bg-[#faf9f6] text-[#2d2d2d] overflow-x-hidden selection:bg-[#c4a661] selection:text-white">
      {/* Premium Font Imports */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:italic,wght@300;400;500;600&family=Montserrat:wght@300;400;600&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap');
        
        .font-display { font-family: 'Playfair Display', serif; }
        .font-body { font-family: 'Cormorant Garamond', serif; }
        .font-accent { font-family: 'Montserrat', sans-serif; }
      `}</style>

      <WeddingCurtainGuard onOpen={handleEnterTheater} />
      
      <div
        className="fixed inset-0 z-0 opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage: "url('/assets/432.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
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
              className="h-12 w-12 rounded-full bg-white/90 backdrop-blur-md border border-[#c4a661]/30 shadow-xl flex items-center justify-center text-[#5D3A03]"
            >
              {isMuted ? "🔇" : "🎵"}
            </button>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="h-12 w-12 rounded-full bg-white/90 backdrop-blur-md border border-[#c4a661]/30 shadow-xl flex items-center justify-center text-[#5D3A03]"
            >
              📍
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10">
        {/* HERO SECTION */}
        <section className="relative min-h-screen w-full overflow-hidden flex flex-col items-center pt-10 pb-10">
          <motion.div 
            variants={revealItem} 
            initial="hidden"
            whileInView="visible"
            viewport={{ amount: 0.3 }}
            className="relative z-20 flex flex-col items-center mb-10"
          >
            <img
              src="https://amantrran.com/wp-content/uploads/2025/11/Ganeshji_new.png"
              alt="Lord Ganesh"
              className="w-[50px] md:w-32 h-auto drop-shadow-2xl mb-4"
            />
            <p className="font-body italic text-[#8B6E32] tracking-[0.3em] text-base md:text-xl font-medium">
              || श्री गणेशाय नमः ||
            </p>
          </motion.div>

          <motion.div
            variants={revealItem}
            initial="hidden"
            whileInView="visible"
            viewport={{ amount: 0.2 }}
            className="relative z-10 w-[85%] max-w-md aspect-[3/4] rounded-t-full border-[10px] border-white shadow-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10" />
            <img
              src={details.heroImage || "https://images.unsplash.com/photo-1583939003579-730e3918a45a"}
              className="w-full h-full object-cover"
              alt="Groom and Bride"
            />
            <div className="absolute bottom-10 left-0 right-0 z-20 text-center text-white px-4">
              <p className="font-accent uppercase tracking-[0.4em] text-[11px] mb-3 font-light opacity-90">The Wedding Of</p>
              <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight">
                {details.groom} <br />
                <span className="font-body italic text-3xl font-light lowercase my-2 block">&</span>
                {details.bride}
              </h1>
            </div>
          </motion.div>

          <motion.div 
            variants={revealItem} 
            initial="hidden"
            whileInView="visible"
            viewport={{ amount: 0.5 }}
            className="relative z-20 text-center mt-12 px-6 max-w-xl"
          >
            <p className="font-body text-[#5D3A03] italic text-xl md:text-2xl leading-relaxed">
              With hearts full of joy and the love of our elders, we cordially invite you to join us as we celebrate the wedding ceremony of  <br></br><span className="font-display not-italic font-bold text-[#8B6E32]"> {details.groom}</span> and <span className="font-display not-italic font-bold text-[#8B6E32]">{details.bride}</span>.
            </p>
          </motion.div>

          <motion.div 
            style={{ opacity: iconOpacity }}
            className="mt-2 flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-1 opacity-40"
            >
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#5D3A03" strokeWidth="1.5">
                <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
              </svg>
            </motion.div>
          </motion.div>

           <motion.div 
             variants={revealItem} 
             initial="hidden"
             whileInView="visible"
             viewport={{ amount: 0.8 }}
             className="relative z-20 text-center "
           >
            <div className=" ">
              {/* <div className="h-[1px] w-10 bg-[#c4a661]/40" /> */}
              {/* <p className="font-accent uppercase text-xl text-[10px] font-bold text-[#8B6E32]">
                {"  || शुभ मंगल सावधान || "}
              </p> */}
               <img
              src="/assets/fere-Photoroom.png"
              alt="Fere Photoroom"
              className="h-auto drop-shadow-2xl mb-4"
            />
              {/* <div className="h-[1px] w-10 bg-[#c4a661]/40"></div> */}
            </div>
          </motion.div>
        </section>

        {/* ANNOUNCEMENT */}
        <section className="relative py-10 px-6 text-center max-w-5xl mx-auto">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ amount: 0.2 }}
            className="space-y-12"
          >
            <motion.p variants={revealItem} className="font-body italic text-2xl text-[#5D3A03] leading-relaxed max-w-3xl mx-auto">
              {`" With Divine Blessings and Joyful Hearts, We Invite You To Grace Us With Your Presence..."`}
            </motion.p>
            <motion.div variants={revealItem} className="py-12 border-y border-[#c4a661]/30">
              <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tight text-[#1a1a1a] uppercase">
                {formatPrettyDate(details.date)}
              </h2>
              <p className="mt-5 font-accent tracking-[0.5em] text-[#8B6E32] uppercase text-xs font-semibold">Witness The Beginning Of Our Forever</p>
            </motion.div>
            
            <motion.div variants={revealItem} className="grid grid-cols-4 gap-3 md:gap-8 max-w-2xl mx-auto pt-8">
              {[
                { label: "Days", val: timeLeft.days },
                { label: "Hours", val: timeLeft.hours },
                { label: "Mins", val: timeLeft.mins },
                { label: "Secs", val: timeLeft.secs }
              ].map((unit, i) => (
                <div key={i} className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-[#c4a661]/10">
                  <span className="block text-3xl md:text-4xl font-display font-bold text-[#8B6E32]">{String(unit.val).padStart(2, '0')}</span>
                  <span className="text-[10px] font-accent uppercase tracking-widest text-[#5D3A03] font-bold opacity-60">{unit.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* EVENTS GRID */}
        <section className="relative mt-12 py-24 px-6">
          <div className="relative z-10 max-w-6xl mx-auto">
            <motion.h2 
              variants={revealItem} 
              initial="hidden"
              whileInView="visible"
              className="text-center font-display text-4xl tracking-[0.1em] mb-20 uppercase font-bold text-[#1a1a1a]"
            >
              The Celebration
            </motion.h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {details.events?.map((event, idx) => (
                <motion.div
                  key={idx}
                  variants={revealItem}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ amount: 0.1 }}
                  whileHover={{ y: -15, transition: { duration: 0.4 } }}
                  className="relative overflow-hidden group rounded-[40px] shadow-2xl border border-white/40 min-h-[320px]"
                  style={{
                    backgroundImage: `url('${getEventCardBackground(event.name)}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80 transition-all duration-500 group-hover:from-black/50" />
                  <div className="relative z-10 p-10 h-full flex flex-col justify-end">
                    <h3 className="font-display text-white text-3xl font-bold mb-4">{event.name}</h3>
                    <div className="w-12 h-[2px] bg-[#c4a661] mb-6 transition-all duration-500 group-hover:w-24" />
                    <div className="space-y-1">
                      <p className="font-body italic text-white/90 text-lg">{formatPrettyDate(details.date)}</p>
                      <p className="font-accent text-white/80 text-xs tracking-widest font-semibold">{event.time}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <motion.div 
          variants={revealItem} 
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.1 }}
          className="max-w-7xl mx-auto my-16"
        >
          <OurStoryGallery images={details.gallery} tone="gold" />
        </motion.div>

        {/* PRE-WEDDING VIDEO */}
        <motion.section 
          variants={revealItem} 
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.2 }}
          className="py-24 px-6 max-w-5xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="font-display text-5xl font-bold mb-6">Pre‑Wedding Film</h2>
            <p className="font-body italic text-2xl text-[#8B6E32]">A glimpse of our journey before forever</p>
          </div>
          <div className="bg-white p-3 md:p-6 rounded-[40px] shadow-2xl border border-[#c4a661]/10">
            <div className="relative w-full aspect-video overflow-hidden rounded-[30px]">
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
        <motion.section 
          variants={revealItem} 
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.5 }}
          className="py-20 px-6 max-w-3xl mx-auto text-center"
        >
          <div className="bg-[#fdfbf7] border border-[#c4a661]/20 rounded-[50px] py-16 px-10 shadow-inner">
            <p className="font-accent text-[#8B6E32] tracking-[0.5em] text-xs font-black uppercase mb-8">#{safeWeddingTag}</p>
            <p className="font-body italic text-3xl md:text-4xl text-[#1a1a1a] leading-relaxed">
              “In the garden of life, <br/> love is the most beautiful flower.”
            </p>
          </div>
        </motion.section>

        <motion.div 
          variants={revealItem}
          initial="hidden"
          whileInView="visible"
        >
          <WeddingFooter />
        </motion.div>
      </div>
    </main>
  );
}