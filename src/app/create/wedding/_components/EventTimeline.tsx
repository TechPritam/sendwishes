"use client";

import React from "react";
import { motion } from "framer-motion";

interface Event {
  name: string;
  date: string;
  time: string;
  image: string;
}

interface EventTimelineProps {
  events: Event[];
}

export const EventTimeline = ({ events }: EventTimelineProps) => {
  if (!events || events.length === 0) return null;

  // DYNAMIC GRID LOGIC:
  // 1-3 events: Single row (grid-cols-1 to grid-cols-3)
  // 4 events: 2x2 grid
  const getGridConfig = () => {
    const count = events.length;
    if (count === 1) return "md:grid-cols-1 max-w-xl";
    if (count === 2) return "md:grid-cols-2 max-w-5xl";
    if (count === 3) return "md:grid-cols-3 max-w-7xl";
    if (count === 4) return "md:grid-cols-2 max-w-5xl"; // Balanced 2x2
    return "md:grid-cols-2 max-w-5xl";
  };

  return (
    <section className="py-24 px-4 mx-auto relative overflow-hidden">
      {/* SECTION HEADER */}
      <div className="text-center mb-20">
        <motion.span 
          initial={{ opacity: 0, letterSpacing: "0.1em" }}
          whileInView={{ opacity: 1, letterSpacing: "0.4em" }}
          className="text-rose-400 uppercase text-[10px] font-bold mb-4 block"
        >
          The Celebration
        </motion.span>
        <h2 className="font-serif text-4xl md:text-6xl text-rose-900 italic">
          Wedding Functions
        </h2>
        <div className="h-[1px] w-16 bg-rose-200 mx-auto mt-6" />
      </div>

      {/* DYNAMIC GRID CONTAINER */}
      <div className={`grid grid-cols-1 gap-10 mx-auto transition-all duration-700 ${getGridConfig()}`}>
        {events.map((event, index) => (
          <motion.div
            key={event.name}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="group relative h-[500px] overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-[6px] border-white transition-all duration-500 hover:shadow-[0_30px_70px_rgba(141,45,82,0.2)]"
          >
            {/* Background Image - Keeping your exact path logic */}
            <img
              src={`/assets/${event.name.toLowerCase().replace(/\s+/g, '-')}.png`}
              alt={event.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
            />
    
            {/* Premium Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-rose-950/95 via-rose-900/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-10 text-white">
              <motion.div 
                initial={{ x: -10, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="border-l-[3px] border-rose-400 pl-6"
              >
                <h3 className="font-serif text-4xl mb-3 tracking-wide capitalize drop-shadow-md">
                  {event.name}
                </h3>
                <div className="flex flex-col gap-1.5">
                  <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-rose-200 font-semibold">
                    {new Date(event.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="font-serif italic text-xl text-white/90">
                    {event.time}
                  </p>
                </div>
              </motion.div>
            </div>
            
            {/* Decorative Corner Element */}
            <div className="absolute top-6 right-6 opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
               <div className="w-10 h-10 border-t-2 border-r-2 border-rose-100" />
            </div>

            {/* Inner Glass Shine Effect (Rich Add-on) */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-gradient-to-tr from-white/5 via-white/10 to-transparent pointer-events-none" />
          </motion.div>
        ))}
      </div>
    </section>
  );
};