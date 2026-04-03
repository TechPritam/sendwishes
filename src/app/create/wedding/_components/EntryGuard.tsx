"use client";
import { motion } from "framer-motion";
import { useState } from "react";

export const EntryGuard = ({ onOpen }: { onOpen: () => void }) => {
  const [isTriggered, setIsTriggered] = useState(false);

  const handleOpen = () => {
    setIsTriggered(true);
    // Notify parent to start music and reveal content
    onOpen();
  };

  return (
    <div className={`fixed inset-0 z-[1000] pointer-events-none ${isTriggered ? '' : 'pointer-events-auto'}`}>
      {!isTriggered && (
        <motion.div
          exit={{ opacity: 0, filter: "blur(10px)", scale: 0.8 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 z-[1011] flex flex-col items-center justify-center bg-[#FDFBF7]"
        >
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "100vh" }}
            transition={{ duration: 1, ease: "circOut" }}
            className="absolute left-1/2 -translate-x-1/2 w-[1px] bg-rose-200/40"
          />

          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 font-serif text-xl italic text-rose-800"
          >
            You are invited ❤️
          </motion.p>

          <button
            onClick={handleOpen}
            className="relative w-24 h-24 bg-white rounded-full shadow-[0_15px_40px_rgba(141,45,82,0.15)] flex items-center justify-center border border-rose-50 cursor-pointer active:scale-95 transition-transform"
          >
            <motion.div 
              animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 rounded-full border border-rose-300"
            />
            <span className="text-rose-600 text-3xl">❤</span>
          </button>
          
          <p className="mt-6 font-serif text-[10px] tracking-[0.5em] uppercase text-rose-400 font-bold">
            Tap to Open
          </p>
        </motion.div>
      )}

      <div className="absolute inset-0 flex w-full h-full">
        <motion.div
          initial={{ x: 0 }}
          animate={isTriggered ? { x: "-100%" } : { x: 0 }}
          transition={{ duration: 1.5, ease: [0.85, 0, 0.15, 1] }}
          className="w-1/2 h-full bg-[#FDFBF7] border-r border-rose-100 shadow-[20px_0_40px_rgba(0,0,0,0.02)]"
        />
        <motion.div
          initial={{ x: 0 }}
          animate={isTriggered ? { x: "100%" } : { x: 0 }}
          transition={{ duration: 1.5, ease: [0.85, 0, 0.15, 1] }}
          className="w-1/2 h-full bg-[#FDFBF7] border-l border-rose-100 shadow-[-20px_0_40px_rgba(0,0,0,0.02)]"
        />
      </div>
    </div>
  );
};