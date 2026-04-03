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
  "/assets/wedding.jpg",
  "https://images.unsplash.com/photo-1519741497674-611481863552",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc",
];

// Animation Variant for Text Reveal
const textReveal: Variants = {
  hidden: { 
    opacity: 0, 
    y: 30 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 1.2, 
      ease: [0.22, 1, 0.36, 1] 
    } 
  }
};

export default function WeddingInvitation({ details }: { details: WeddingDetails }) {
  const [hasOpened, setHasOpened] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  const [imgIndex, setImgIndex] = useState(0);

  const carouselImages = useMemo(() => {
    const userImages = (details.gallery || []).filter(Boolean);
    return userImages.length > 0 ? userImages : FALLBACK_CAROUSEL_IMAGES;
  }, [details.gallery]);

  useEffect(() => {
    setImgIndex((prev) => Math.min(prev, Math.max(0, carouselImages.length - 1)));
  }, [carouselImages.length]);

  useEffect(() => {
    if (carouselImages.length <= 1) return;

    // Increased to 6 seconds for a premium, relaxed feel
    const imgTimer = setInterval(() => {
      setImgIndex((prev) => (prev + 1) % carouselImages.length);
    }, 3000);
    return () => clearInterval(imgTimer);
  }, [carouselImages.length]);

  const formattedDate = new Date(details.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-[#FDFBF7] min-h-screen relative selection:bg-rose-100 selection:text-rose-900 overflow-x-hidden font-sans">

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
          <section className="mt-20 px-6">
            <Countdown targetDate={details.date} groom={details.groom} bride={details.bride} />
          </section>

          {/* SAVE THE DATE SECTION */}
          <section className="py-24 bg-white flex flex-col items-center rounded-t-[3rem] relative z-10 shadow-[0_-20px_50px_rgba(0,0,0,0.02)]">
            <motion.h2 
              variants={textReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
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
            <EventTimeline events={details.events} />
          )}

        

          {/* OUR STORY / GALLERY SECTION */}
          <div className="mt-24 w-full">
            <div className="text-center px-6 mb-16">
              <motion.span 
                initial={{ opacity: 0, letterSpacing: "0.2em" }}
                whileInView={{ opacity: 1, letterSpacing: "0.4em" }}
                transition={{ duration: 1.5 }}
                viewport={{ once: true }}
                className="text-rose-400 uppercase text-[10px] font-bold mb-4 block"
              >
                A Journey of Love
              </motion.span>
              <motion.h2 
                variants={textReveal} 
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true }}
                className="font-serif text-4xl md:text-6xl text-rose-900 italic leading-tight"
              >
                Moments Wrapped in Time
              </motion.h2>
            </div>

            {/* Wide Cinematic Slider */}
            <div className="relative group px-10 md:px-12">
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 2 }}
                viewport={{ once: true }}
                className="relative w-full max-w-7xl mx-auto h-[55vh] md:h-[75vh] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.1)] bg-rose-50/20 rounded-none md:rounded-sm"
              >
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={imgIndex}
                    initial={{ opacity: 0, x: 50, scale: 1.05 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -50, scale: 1.05 }}
                    transition={{ 
                      duration: 1.8, 
                      ease: [0.4, 0, 0.2, 1] 
                    }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <div className="absolute inset-0 bg-rose-900/5 z-10 pointer-events-none mix-blend-multiply" />
                    <motion.img
                      src={carouselImages[imgIndex]}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        duration: 10, 
                        ease: "linear" 
                      }}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Decorative corner accents */}
                <div className="absolute top-10 left-10 w-16 h-16 border-t border-l border-white/40 z-20" />
                <div className="absolute bottom-10 right-10 w-16 h-16 border-b border-r border-white/40 z-20" />
              </motion.div>

              {/* Luxury Pagination Dots with Progress Fill */}
              <div className="flex justify-center items-center gap-6 mt-12">
                {carouselImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setImgIndex(idx)}
                    className="relative h-[2px] bg-rose-100 overflow-hidden transition-all duration-700 mb-5"
                    style={{ width: imgIndex === idx ? '80px' : '30px' }}
                  >
                    {imgIndex === idx && (
                      <motion.div 
                        key={`progress-${idx}`}
                        initial={{ x: "-100%" }}
                        animate={{ x: "0%" }}
                        transition={{ duration: 6, ease: "linear" }}
                        className="absolute inset-0 bg-rose-400"
                      />
                    )}
                    <div className="absolute inset-0 bg-rose-300 opacity-0 hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          </div>

         

          <Venue location={details.location} />

             {/* QUOTE SECTION */}
          <section className="py-24 px-8 text-center max-w-2xl mx-auto relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5 }}
              viewport={{ once: true }}
            >
              <span className="text-rose-300 text-4xl font-serif">“</span>
              <p className="font-serif text-2xl md:text-4xl text-rose-900 italic px-4 leading-relaxed">
                Big day, big vibes, <br/> big celebration! <br />
                <span className="text-xl md:text-2xl mt-4 block text-rose-700">Come eat, dance & celebrate with us!</span>
              </p>
            </motion.div>
            <div className="flex items-center justify-center gap-4 pt-12 px-4 max-w-xs mx-auto">
              <div className="h-[1px] flex-1 bg-rose-200" />
              <motion.span 
                animate={{ scale: [1, 1.2, 1] }} 
                transition={{ repeat: Infinity, duration: 2 }} 
                className="text-rose-400 text-2xl"
              >
                ❤
              </motion.span>
              <div className="h-[1px] flex-1 bg-rose-200" />
            </div>
            {/* <WavyDivider /> */}
          </section>
          
          <div className="px-3">
          <RSVP />
          </div>

          {/* FOOTER */}
          <footer className="py-40 text-center px-6 bg-[#FDFBF7]">
            <motion.div
               variants={textReveal} initial="hidden" whileInView="visible" viewport={{ once: true }}
            >
              <p className="font-serif text-2xl text-rose-900 italic mb-6">We can&apos;t wait to see you!</p>
              <h2 className="font-serif text-5xl md:text-7xl text-rose-800 tracking-tight">
                {details.groom} <span className="text-3xl md:text-4xl font-light text-rose-300 mx-2">&</span> {details.bride}
              </h2>
                <div className="flex items-center justify-center gap-4 pt-12 px-4 max-w-xs mx-auto">
              <div className="h-[1px] flex-1 bg-rose-200" />
              <motion.span 
                animate={{ scale: [1, 1.2, 1] }} 
                transition={{ repeat: Infinity, duration: 2 }} 
                className="text-rose-400 text-2xl"
              >
                ❤
              </motion.span>
              <div className="h-[1px] flex-1 bg-rose-200" />
            </div>
            </motion.div>
          </footer>
        </motion.div>
      </div>
    </div>
  );
}