"use client";
import { motion } from "framer-motion";

type HeroProps = {
  groom: string;
  bride: string;
  heroImage?: string;
};

const FALLBACK_HERO_IMAGE = "/assets/wedding.jpg";

export default function Hero({ groom, bride, heroImage }: HeroProps) {
  const imageSrc = heroImage || FALLBACK_HERO_IMAGE;

  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#FDFBF7]">
      {/* Cinematic Background Zoom */}
      <motion.div 
        initial={{ scale: 1.25 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <img 
          src={imageSrc} 
          className="w-full h-full object-cover opacity-90" 
          alt="Wedding"
        />
        
        {/* THE "LEGIBILITY SHIELD" */}
        {/* This multi-layered gradient ensures text is readable on white OR dark images */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-[#FDFBF7]" />
        <div className="absolute inset-0 bg-black/4 backdrop-brightness-90" />
      </motion.div>

      <div className="relative z-10 text-center px-4">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="uppercase tracking-[0.5em] text-[10px] text-white md:text-rose-800 font-bold mb-6 drop-shadow-md"
        >
          You are invited to the wedding of
        </motion.p>

        {/* Staggered Name Reveal with High-Contrast Text Shadows */}
        <motion.div
           initial={{ opacity: 0, filter: "blur(10px)" }}
           animate={{ opacity: 1, filter: "blur(0px)" }}
           transition={{ delay: 1.5, duration: 1.5, ease: "easeOut" }}
           className="space-y-2 select-none"
        >
          <h1 className="font-serif text-7xl text-white md:text-rose-900 drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
            {groom}
          </h1>
          
          <div className="font-serif text-3xl text-rose-300 italic drop-shadow-sm">
            &
          </div>
          
          <h1 className="font-serif text-7xl text-white md:text-rose-900 drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
            {bride}
          </h1>
        </motion.div>
      </div>
    </section>
  );
}