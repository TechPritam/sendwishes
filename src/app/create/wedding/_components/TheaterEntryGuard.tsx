"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export const WeddingCurtainGuard = ({ onOpen }: { onOpen: () => void }) => {
  const [isOpened, setIsOpened] = useState(false);

  const handleOpen = () => {
    setIsOpened(true);
    onOpen();
  };

  // The "Sweep" animation - mimics light silk being pulled back
  const sweepTransition = {
    duration: 3.5,
    ease: "easeInOut" as const, // Gentle deceleration
  };

  return (
    <div className={`fixed inset-0 z-[1000] overflow-hidden ${isOpened ? 'pointer-events-none' : 'pointer-events-auto'}`}>
      
      {/* Interaction Layer */}
      <AnimatePresence>
        {!isOpened && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute inset-0 z-[1010] flex flex-col items-center justify-center"
          >
            {/* Elegant Seal/Button */}
            <motion.button
              onClick={handleOpen}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              className="relative w-32 h-32 flex items-center justify-center cursor-pointer"
            >
              {/* Spinning Decorative Border */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border border-dashed border-rose-300/60 rounded-full"
              />
              <div className="w-24 h-24 bg-white/80 backdrop-blur-md rounded-full shadow-xl border border-rose-100 flex flex-col items-center justify-center">
                <span className="text-rose-400 text-2xl">❤️</span>
                {/* <span className="text-[10px] tracking-widest uppercase mt-1 text-rose-800 font-medium">Open</span> */}
              </div>
            </motion.button>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              className="mt-8 font-serif italic text-rose-900 tracking-wider"
            >
              With Love, we invite you...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Curtains */}
      <div className="absolute inset-0 flex">
        {/* Left Silk Panel */}
        <motion.div
          initial={{ x: 0 }}
          animate={isOpened ? { 
            x: "-100%", 
            skewX: -5, // Mimics the bottom of the curtain trailing behind
            scale: 1.05
          } : { x: 0 }}
          transition={sweepTransition}
          className="relative w-1/2 h-full origin-top-left"
          style={{
            background: "linear-gradient(to right, #FDFBF7, #F5E6D3)",
            boxShadow: "20px 0 50px rgba(0,0,0,0.05)"
          }}
        >
          {/* Silk Sheen Overlay */}
          <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]" />
          
          {/* Decorative Vertical Lace Line */}
          <div className="absolute right-4 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-rose-200/40 to-transparent" />
        </motion.div>

        {/* Right Silk Panel */}
        <motion.div
          initial={{ x: 0 }}
          animate={isOpened ? { 
            x: "100%", 
            skewX: 5,
            scale: 1.05
          } : { x: 0 }}
          transition={sweepTransition}
          className="relative w-1/2 h-full origin-top-right"
          style={{
            background: "linear-gradient(to left, #FDFBF7, #F5E6D3)",
            boxShadow: "-20px 0 50px rgba(0,0,0,0.05)"
          }}
        >
          <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]" />
          
          {/* Decorative Vertical Lace Line */}
          <div className="absolute left-4 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-rose-200/40 to-transparent" />
        </motion.div>
      </div>

      {/* Overlay Glow */}
      <motion.div 
        animate={isOpened ? { opacity: 0 } : { opacity: 1 }}
        className="absolute inset-0 pointer-events-none bg-rose-50/20 mix-blend-overlay"
      />
    </div>
  );
};