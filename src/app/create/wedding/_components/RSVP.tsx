"use client";
import { motion } from "framer-motion";

export const RSVP = () => (
  <section className="py-24 px-10 bg-white shadow-[0_-20px_50px_rgba(0,0,0,0.03)] rounded-t-[3rem]">
    <div className="max-w-md mx-auto text-center">
      <h2 className="font-serif text-4xl text-rose-900 mb-10 italic">Will you join us?</h2>
      <div className="space-y-8 text-left">
        {['Name', 'Email'].map(field => (
          <div key={field} className="border-b border-rose-100">
            <label className="text-[10px] uppercase tracking-widest text-rose-400 font-bold">{field}</label>
            <input type="text" className="w-full py-3 bg-transparent outline-none font-serif text-lg" placeholder={`Your ${field}`} />
          </div>
        ))}
        <div className="border-b border-rose-100">
          <label className="text-[10px] uppercase tracking-widest text-rose-400 font-bold">Message</label>
          <textarea className="w-full py-3 bg-transparent outline-none font-serif text-lg h-24 resize-none" placeholder="Your wishes..." />
        </div>
        
        <button className="w-full m-auto bg-rose-700 text-white py-2 rounded-2xl font-semibold tracking-[0.2em] shadow-xl transition-transform hover:scale-[1.02]">SEND</button>
      </div>
    </div>
  </section>
);