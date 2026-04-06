"use client";
import { motion } from "framer-motion";

export const Venue = ({ location }: { location: string }) => {
  return (
    <section className="py-24 px-6 bg-transparent relative">
      <div className="max-w-md mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <div className="flex justify-center mb-4 text-rose-400">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="10" r="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="font-serif text-4xl text-rose-900 mb-2 italic">The Venue</h2>
          <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-rose-400 font-bold mb-8">Where it all begins</p>
          <p className="font-serif text-xl text-zinc-700 leading-relaxed mb-8 px-4">
            {location}
          </p>
        </motion.div>

        {/* The Map Frame (Postcard Style) */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-2xl border-[12px] border-[rgb(223,223,223)] group"
        >
          <iframe
            width="100%"
            height="100%"
            style={{ filter: "sepia(20%) contrast(90%) grayscale(10%)" }}
            src={`https://www.google.com/maps?q=${encodeURIComponent(location)}&output=embed`}
            loading="lazy"
          ></iframe>
          
          <div className="absolute inset-0 pointer-events-none border border-black/5 rounded-lg shadow-inner" />
          
          <a 
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`}
            target="_blank"
            className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-rose-900 shadow-lg pointer-events-auto hover:bg-rose-900 hover:text-white transition-all"
          >
            Open in Maps
          </a>
        </motion.div>
      </div>
    </section>
  );
};