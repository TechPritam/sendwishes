"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const FALLBACK_CAROUSEL_IMAGES = [
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a",
  "https://images.unsplash.com/photo-1519741497674-611481863552",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc",
  "https://images.unsplash.com/photo-1522673607200-1c9488bb5963",
];

type OurStoryGalleryProps = {
  images?: string[];
  tone?: "rose" | "gold";
};

export function OurStoryGallery({ images, tone = "rose" }: OurStoryGalleryProps) {
  const [imgIndex, setImgIndex] = useState(0);

  const palette = useMemo(() => {
    if (tone === "gold") {
      return {
        bg: "from-[#faf9f6]",
        eyebrow: "text-[#b08d57]",
        title: "text-[#3b3b3b]",
        borderSoft: "border-black/10",
        borderHard: "border-white/70",
        dotOn: "bg-[#b08d57]",
        dotOff: "bg-[#b08d57]/30",
      } as const;
    }

    return {
      bg: "from-[#FDFBF7]",
      eyebrow: "text-rose-400",
      title: "text-rose-900",
      borderSoft: "border-rose-100",
      borderHard: "border-white",
      dotOn: "bg-rose-400",
      dotOff: "bg-rose-200",
    } as const;
  }, [tone]);

  const carouselImages = useMemo(() => {
    const userImages = (images || []).filter(Boolean);
    return userImages.length > 0 ? userImages : FALLBACK_CAROUSEL_IMAGES;
  }, [images]);

  const extendedImages = useMemo(
    () => [...carouselImages, ...carouselImages, ...carouselImages],
    [carouselImages]
  );

  useEffect(() => {
    if (carouselImages.length <= 1) return;
    const imgTimer = setInterval(() => {
      setImgIndex((prev) => (prev + 1) % carouselImages.length);
    }, 4000);
    return () => clearInterval(imgTimer);
  }, [carouselImages.length]);

  return (
    <section className="mt-26 w-full overflow-hidden">
      <div className="text-center px-6 mb-16">
        <span
          className={`${palette.eyebrow} uppercase text-[10px] tracking-[0.5em] font-bold mb-4 block`}
        >
          A Journey of Love
        </span>
        <h2 className={`font-serif text-4xl md:text-6xl ${palette.title} italic leading-tight`}>
          Moments Wrapped in Time
        </h2>
      </div>

      {/* WEB: INFINITE FILM REEL */}
      <div className="hidden md:block relative w-full h-[70vh]">
        <div
          className={`absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r ${palette.bg} to-transparent z-20 pointer-events-none`}
        />
        <div
          className={`absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l ${palette.bg} to-transparent z-20 pointer-events-none`}
        />

        <div className="flex items-center justify-center h-full overflow-hidden px-[25%]">
          <motion.div
            className="flex gap-8 cursor-grab active:cursor-grabbing"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          >
            {extendedImages.map((img, idx) => (
              <div key={idx} className="relative flex-shrink-0 w-[25vw] h-[55vh] group">
                <div
                  className={`absolute inset-0 bg-white shadow-xl rounded-sm border ${palette.borderSoft} -rotate-2 group-hover:rotate-0 transition-transform duration-700`}
                />
                <div
                  className={`absolute inset-0 bg-white p-3 shadow-sm border ${palette.borderSoft} rotate-1 group-hover:rotate-0 transition-transform duration-700`}
                >
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

      {/* MOBILE: CINEMATIC SLIDER */}
      <div className="md:hidden relative group px-6">
        <div
          className={`relative w-full aspect-[3/4] overflow-hidden shadow-2xl rounded-sm border-4 ${palette.borderHard}`}
        >
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
            <div
              key={idx}
              className={`h-1 transition-all duration-500 ${
                imgIndex === idx ? `w-8 ${palette.dotOn}` : `w-2 ${palette.dotOff}`
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}