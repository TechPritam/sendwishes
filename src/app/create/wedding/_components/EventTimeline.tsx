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
  return (
    <section className="py-20 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <span className="text-rose-400 uppercase tracking-[0.3em] text-xs font-semibold">The Celebration</span>
        <h2 className="font-serif text-4xl md:text-5xl text-rose-900 mt-4 italic underline underline-offset-12 decoration-rose-100">
          Wedding Functions
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {events.map((event, index) => (
          <motion.div
            key={event.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.8 }}
            className="group relative h-[450px] overflow-hidden rounded-2xl shadow-2xl border-4 border-white"
          >
            {/* Background Image */}
            <img
              src={`/assets/${event.name.toLowerCase().replace(/\s+/g, '-')}.png`}
              alt={event.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
    
            {/* Premium Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-rose-950/90 via-rose-900/40 to-transparent" />

            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="border-l-2 border-rose-300 pl-4"
              >
                <h3 className="font-serif text-3xl mb-2 tracking-wide capitalize">
                  {event.name}
                </h3>
                <div className="flex flex-col gap-1 opacity-90">
                  <p className="font-sans text-sm tracking-widest uppercase text-rose-100">
                    {new Date(event.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="font-serif italic text-lg text-white">
                    {event.time}
                  </p>
                </div>
              </motion.div>
            </div>
            
            {/* Decorative Corner Element */}
            <div className="absolute top-4 right-4 opacity-30 group-hover:opacity-100 transition-opacity">
               <div className="w-12 h-12 border-t border-r border-rose-200" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};