"use client";
import { motion } from "framer-motion";
import { greatVibes } from "@/app/fonts";

type HeroProps = {
  groom: string;
  bride: string;
  heroImage?: string;
};

import { useEffect, useState } from "react";

export default function Hero({ groom, bride, heroImage }: HeroProps) {
  const imageSrc = heroImage || "/assets/wedding.jpg";
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Show indicator only if near the top (within 40px)
      setShowScrollIndicator(window.scrollY < 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#FDFBF7]">
      {/* 1. PAPER TEXTURE OVERLAY */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-50 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />

      {/* --- DESKTOP UI --- */}
      <div className="hidden md:flex w-full h-full relative items-center justify-between px-12 lg:px-32">
        {/* DREAMY AMBIENT GLOW */}
        <div className="absolute right-[15%] top-[20%] w-[500px] h-[500px] bg-rose-200/30 rounded-full blur-[120px] z-0" />

        {/* LEFT SIDE: OVERLAPPING TYPOGRAPHY */}
        <div className="w-[50%] z-20 flex flex-col items-center text-center relative translate-x-10">
          <motion.div
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="uppercase tracking-[1em] text-[10px] text-rose-400 font-bold mb-14 block ml-4">
              The Wedding of
            </span>

            <h1
              className={`${greatVibes.className} text-[clamp(5rem,8vw,10rem)] text-rose-950 leading-none tracking-tighter font-light drop-shadow-sm mb-14`}
              style={{ fontFamily: `'Great Vibes', 'Great Vibes Fallback', cursive` }}
            >
              {groom}
            </h1>
            
            <div className="relative h-12 flex items-center justify-center">
                <div className="w-40 h-[1px] bg-gradient-to-r from-transparent via-rose-200 to-transparent" />
                <span className="absolute font-script text-7xl text-rose-500/60 lowercase italic -rotate-12 z-30">
                  and
                </span>
            </div>

            <h1
              className={`${greatVibes.className} mt-8 text-[clamp(5rem,8vw,10rem)] text-rose-950 leading-none tracking-tighter font-light drop-shadow-sm`}
              style={{ fontFamily: `'Great Vibes', 'Great Vibes Fallback', cursive` }}
            >
              {bride}
            </h1>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2 }}
              className="mt-16 flex flex-col items-center"
            >
               <div className="w-1 h-12 bg-gradient-to-b from-rose-200 to-transparent mb-6" />
               <p className="font-serif text-lg text-rose-800/50 italic tracking-wide max-w-xs leading-relaxed">
                 Together with our families, we invite you to join us as we celebrate our love.
               </p>
            </motion.div>
          </motion.div>
        </div>

        {/* RIGHT SIDE: THE TILTED PORTRAIT */}
        <div className="w-[50%] h-full flex items-center justify-center relative -translate-x-10">
          <motion.div 
            initial={{ y: 60, opacity: 0, rotate: 6 }}
            animate={{ y: 0, opacity: 1, rotate: -4 }}
            transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-[70%] aspect-[3/4.5] bg-white p-6 shadow-[0_100px_180px_rgba(141,45,82,0.12)] border border-rose-50 flex flex-col group"
          >
            <div className="flex-1 overflow-hidden relative border border-zinc-100">
                <img 
                  src={imageSrc} 
                  className="w-full h-full object-cover grayscale-[15%] hover:grayscale-0 transition-all duration-[5s] group-hover:scale-110" 
                  alt="Portrait"
                />
            </div>
            <div className="mt-6 flex flex-col items-center gap-2">
                <span className="text-[10px] tracking-[0.5em] text-rose-300 font-bold uppercase">Save The Date</span>
                <div className="w-1.5 h-1.5 rounded-full bg-rose-200 animate-pulse" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* --- MOBILE UI --- */}
      <div className="md:hidden relative w-full h-full flex flex-col items-center justify-center px-6">
  <div className="absolute inset-0">
    <img src={imageSrc} className="w-full h-full object-cover" alt="" />
    {/* LAYER 1: The Scrim 
       A slightly heavier top gradient ensures the "You are invited" text 
       is safe even if the couple's heads are at the top of the photo.
    */}
    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#FDFBF7]" />
  </div>

  <div className="relative z-10 text-center text-white">
    {/* LAYER 2: The Invitation Text
       Added 'drop-shadow-md' and a slight tracking increase for legibility.
    */}
    <p className="uppercase tracking-[0.5em] text-[10px] font-bold mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
      You are invited
    </p>

    {/* LAYER 3: The Names
       Using a custom drop-shadow that acts like a 'text-stroke' to define 
       the edges of the serif font. 
    */}
    <h1 className="font-serif text-6xl italic drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] leading-tight">
      {groom}
    </h1>
    
    <div className="font-serif text-3xl my-2 text-rose-200 italic drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
      &
    </div>
    
    <h1 className="font-serif text-6xl drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] leading-tight">
      {bride}
    </h1>
  </div>
</div>
      {/* Bottom Center Scroll Indicator (disappears on scroll) */}
      {showScrollIndicator && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center pointer-events-none select-none">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="w-8 h-8 flex items-center justify-center"
          >
            <svg width="32" height="52" viewBox="0 0 32 52" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 8V24" stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M10 18L16 24L22 18" stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </div>
      )}
    </section>
  );
}