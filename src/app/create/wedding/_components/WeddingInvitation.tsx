"use client";

import React, { useState, useRef } from "react";
import { motion, Variants } from "framer-motion";
import { EntryGuard } from "./EntryGuard";
import Hero from "./Hero";
import { GoldFoilScratch } from "./GoldFoilScratch";
import { Countdown } from "./CountDown";
import { Venue } from "./Venue";
import { RSVP } from "./RSVP";
import { EventTimeline } from "./EventTimeline";
import { OurStoryGallery } from "./OurStoryGallery";
import { WeddingFooter } from "./WeddingFooter";

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

  // useEffect(() => {
  //   // Intentionally empty: gallery motion is handled inside OurStoryGallery
  // }, []);

  const formattedDate = new Date(details.date).toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (

    <div
      className="min-h-screen relative selection:bg-rose-100 selection:text-rose-900 overflow-x-hidden font-sans"
      style={{
        backgroundImage: "url('/assets/pattern-1.png')",
        backgroundRepeat: 'repeat',
        backgroundSize: 'auto',
        backgroundPosition: 'top left',
        backgroundColor: '#FDFBF7',
      }}
    >
      {/* Only pattern-1.png as background. No other overlays. */}

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
          <section className="mt-24 px-6 max-w-7xl mx-auto">
            <Countdown targetDate={details.date} groom={details.groom} bride={details.bride} />
          </section>

          {/* SAVE THE DATE SECTION */}
          <section className="py-14 bg-transparent flex flex-col items-center rounded-t-[3rem] relative z-10 shadow-[0_-20px_50px_rgba(0,0,0,0.02)]">
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
            {/* <p className="mt-8 text-[10px] uppercase tracking-[0.3em] text-zinc-400 animate-bounce">
              Gently scratch the foil
            </p> */}
          </section>

          {details.events && details.events.length > 0 && (
            <div className="max-w-7xl mx-auto">
              <EventTimeline events={details.events} />
            </div>
          )}

          <div className="max-w-7xl mx-auto">
            <OurStoryGallery images={details.gallery} />
          </div>

          <div className="max-w-7xl mx-auto">
            <Venue location={details.location} />
          </div>

          {/* QUOTE SECTION */}
          <section className="py-24 px-8 text-center max-w-2xl mx-auto relative">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5 }}>
              <span className="text-rose-300 text-4xl font-serif">“</span>
              <p className="font-serif text-4xl md:text-4xl text-rose-900 italic leading-relaxed px-4">
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
          
          <div className="px-3 mb-8 max-w-5xl mx-auto">
            <RSVP />
          </div>

          {/* FOOTER */}
          <WeddingFooter
            groom={details.groom}
            bride={details.bride}
            closingMessage="We can't wait to see you!"
          />
        </motion.div>
      </div>
    </div>
  );
}