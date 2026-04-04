"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { EntryGuard } from "./EntryGuard";
import Hero from "./Hero";
import { GoldFoilScratch } from "./GoldFoilScratch";
import { Countdown } from "./CountDown";
import { Venue } from "./Venue";
import { RSVP } from "./RSVP";
import { EventTimeline } from "./EventTimeline";

interface WeddingDetails {
  groom: string;
  bride: string;
  date: string;
  time: string;
  location: string;
  heroImage?: string;
  gallery?: string[];
  events?: { name: string; date: string; time: string; image: string }[];
}

const FALLBACK_CAROUSEL_IMAGES = [
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a",
  "https://images.unsplash.com/photo-1519741497674-611481863552",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc",
  "https://images.unsplash.com/photo-1522673607200-1c9488bb5963",
];

const textReveal: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } 
  }
};

export default function WeddingInvitation({ details }: { details: WeddingDetails }) {
  const [hasOpened, setHasOpened] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [imgIndex, setImgIndex] = useState(0);

  const carouselImages = useMemo(() => {
    const userImages = (details.gallery || []).filter(Boolean);
    return userImages.length > 0 ? userImages : FALLBACK_CAROUSEL_IMAGES;
  }, [details.gallery]);

  // Triple the images for the infinite web reel effect
  const extendedImages = [...carouselImages, ...carouselImages, ...carouselImages];

  const handleStartExperience = () => {
    setHasOpened(true);
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio play blocked", e));
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  useEffect(() => {
    if (carouselImages.length <= 1) return;
    const imgTimer = setInterval(() => {
      setImgIndex((prev) => (prev + 1) % carouselImages.length);
    }, 4000);
    return () => clearInterval(imgTimer);
  }, [carouselImages.length]);

  const formattedDate = new Date(details.date).toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="bg-[#FDFBF7] min-h-screen relative selection:bg-rose-100 selection:text-rose-900 overflow-x-hidden font-sans">
      {/* 1. PAPER TEXTURE OVERLAY */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-[60] bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />

      <audio ref={audioRef} src="/assets/din-shagna-daa_.mp3" loop />

      {hasOpened && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={toggleMute}
          className="fixed top-6 right-6 z-[1100] w-12 h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center border border-rose-100 shadow-xl text-xl"
        >
          {isMuted ? "🔇" : "🎵"}
        </motion.button>
      )}

      <EntryGuard onOpen={handleStartExperience} />

      <div className="relative z-0">
        <Hero groom={details.groom} bride={details.bride} heroImage={details.heroImage} />

        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={hasOpened ? { y: 0, opacity: 1 } : { y: 80, opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <section className="mt-20 px-6 max-w-7xl mx-auto">
            <Countdown targetDate={details.date} groom={details.groom} bride={details.bride} />
          </section>

          {/* SAVE THE DATE SECTION */}
          <section className="py-24 bg-white flex flex-col items-center rounded-t-[3rem] relative z-10 shadow-[0_-20px_50px_rgba(0,0,0,0.02)]">
            <motion.h2 
              variants={textReveal} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="font-serif text-3xl text-rose-900 mb-12 italic underline underline-offset-8"
            >
              Save the Date
            </motion.h2>
            <GoldFoilScratch>
              <div className="flex flex-col items-center">
                <h3 className="font-serif text-2xl text-rose-900 text-center">{formattedDate}</h3>
                <div className="w-16 h-[1px] bg-rose-100 my-3" />
                <p className="font-serif text-lg text-rose-800 font-bold">{details.time}</p>
              </div>
            </GoldFoilScratch>
            <p className="mt-8 text-[10px] uppercase tracking-[0.3em] text-zinc-400 animate-bounce">
              Gently scratch the foil
            </p>
          </section>

          {details.events && details.events.length > 0 && (
            <div className="max-w-7xl mx-auto">
              <EventTimeline events={details.events} />
            </div>
          )}

          {/* OUR STORY / GALLERY SECTION */}
          <div className="mt-32 w-full overflow-hidden">
            <div className="text-center px-6 mb-16">
              <span className="text-rose-400 uppercase text-[10px] tracking-[0.5em] font-bold mb-4 block">A Journey of Love</span>
              <h2 className="font-serif text-4xl md:text-6xl text-rose-900 italic leading-tight">Moments Wrapped in Time</h2>
            </div>

            {/* --- WEB VIEW: INFINITE FILM REEL --- */}
            <div className="hidden md:block relative w-full h-[70vh]">
              {/* Spacing Containers: 25% Side Spacing */}
              <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#FDFBF7] to-transparent z-20 pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[#FDFBF7] to-transparent z-20 pointer-events-none" />

              {/* The 50% Stage */}
              <div className="flex items-center justify-center h-full overflow-hidden px-[25%]">
                 <motion.div 
                  className="flex gap-8 cursor-grab active:cursor-grabbing"
                  animate={{ x: ["0%", "-50%"] }}
                  transition={{ 
                    duration: 40, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                 >
                   {extendedImages.map((img, idx) => (
                     <div key={idx} className="relative flex-shrink-0 w-[25vw] h-[55vh] group">
                        {/* Background Shadow Card */}
                        <div className="absolute inset-0 bg-white shadow-xl rounded-sm border border-rose-50 -rotate-2 group-hover:rotate-0 transition-transform duration-700" />
                        {/* Main Image Frame */}
                        <div className="absolute inset-0 bg-white p-3 shadow-sm border border-rose-100 rotate-1 group-hover:rotate-0 transition-transform duration-700">
                          <img 
                            src={img} 
                            className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" 
                            alt={`Gallery ${idx}`} 
                          />
                        </div>
                     </div>
                   ))}
                 </motion.div>
              </div>
            </div>

            {/* --- MOBILE VIEW: CINEMATIC SLIDER --- */}
            <div className="md:hidden relative group px-6">
              <div className="relative w-full aspect-[3/4] overflow-hidden shadow-2xl rounded-sm border-4 border-white">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={imgIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <img src={carouselImages[imgIndex]} className="w-full h-full object-cover" alt="" />
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="flex justify-center gap-2 mt-6 mb-6">
                {carouselImages.map((_, idx) => (
                  <div key={idx} className={`h-1 transition-all duration-500 ${imgIndex === idx ? 'w-8 bg-rose-400' : 'w-2 bg-rose-200'}`} />
                ))}
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto">
            <Venue location={details.location} />
          </div>

          {/* QUOTE SECTION */}
          <section className="py-24 px-8 text-center max-w-2xl mx-auto relative">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5 }}>
              <span className="text-rose-300 text-4xl font-serif">“</span>
              <p className="font-serif text-2xl md:text-4xl text-rose-900 italic leading-relaxed px-4">
                Big day, big vibes, <br/> big celebration! <br />
                <span className="text-xl md:text-2xl mt-4 block text-rose-700">Come eat, dance & celebrate with us!</span>
              </p>
            </motion.div>
            <div className="flex items-center justify-center gap-4 pt-12 px-4 max-w-xs mx-auto">
              <div className="h-[1px] flex-1 bg-rose-200" />
              <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="text-rose-400 text-2xl">❤</motion.span>
              <div className="h-[1px] flex-1 bg-rose-200" />
            </div>
          </section>
          
          <div className="px-3 max-w-5xl mx-auto">
            <RSVP />
          </div>

          {/* FOOTER */}
          <footer className="py-48 text-center px-6 bg-[#FDFBF7]">
            <motion.div variants={textReveal} initial="hidden" whileInView="visible">
              <p className="font-serif text-2xl text-rose-900 italic mb-6">We can&apos;t wait to see you!</p>
              <h2 className="font-serif text-5xl md:text-8xl text-rose-800 tracking-tight">
                {details.groom} <span className="text-3xl md:text-4xl font-light text-rose-300 mx-2">&</span> {details.bride}
              </h2>
              <div className="flex items-center justify-center gap-4 pt-12 px-4 max-w-xs mx-auto">
                <div className="h-[1px] flex-1 bg-rose-200" />
                <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="text-rose-400 text-2xl">❤</motion.span>
                <div className="h-[1px] flex-1 bg-rose-200" />
              </div>
            </motion.div>
          </footer>
        </motion.div>
      </div>
    </div>
  );
}