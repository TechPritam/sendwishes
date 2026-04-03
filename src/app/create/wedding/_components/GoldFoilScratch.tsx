"use client";
import React, { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";

export const GoldFoilScratch: React.FC<{ children: React.ReactNode, onComplete?: () => void }> = ({ children, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isScratched, setIsScratched] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.parentElement?.offsetWidth || 320;
    canvas.height = canvas.parentElement?.offsetHeight || 176;

    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, "#D4AF37"); 
    grad.addColorStop(0.5, "#F1D279"); 
    grad.addColorStop(1, "#D4AF37");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle texture for gold
    ctx.fillStyle = "rgba(255,255,255,0.1)";
    for(let i=0; i<50; i++) {
        ctx.fillRect(Math.random()*canvas.width, Math.random()*canvas.height, 2, 2);
    }

    ctx.font = "italic 16px serif"; 
    ctx.fillStyle = "white"; 
    ctx.textAlign = "center";
    ctx.fillText("Scratch to reveal date", canvas.width / 2, canvas.height / 2);

    const handleMove = (event: MouseEvent | TouchEvent) => {
      if (isScratched) return;
      const rect = canvas.getBoundingClientRect();
      const { clientX, clientY } =
        event instanceof MouseEvent
          ? event
          : (event.touches[0] ?? event.changedTouches[0] ?? { clientX: 0, clientY: 0 });
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath(); 
      ctx.arc(x, y, 25, 0, Math.PI * 2); 
      ctx.fill();
      
      const data = ctx.getImageData(0,0, canvas.width, canvas.height).data;
      let count = 0;
      for(let i=3; i<data.length; i+=40) if(data[i] === 0) count++;
      
      if(count > (data.length/40)*0.45) { // 45% scratched
        setIsScratched(true);
        triggerMiniHeartBurst();
        onComplete?.();
      }
    };

    const triggerMiniHeartBurst = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      
      // Create a local confetti instance to keep it refined
      const heart = confetti.shapeFromText({ text: '❤️', scalar: 2 });

      // Burst 1: Left side of card
      confetti({
        particleCount: 15,
        scalar: 0.7,
        angle: 60,
        spread: 55,
        origin: { 
            x: (rect.left + rect.width * 0.2) / window.innerWidth, 
            y: (rect.top + rect.height * 0.5) / window.innerHeight 
        },
        shapes: [heart],
        colors: ['#8D2D52']
      });

      // Burst 2: Right side of card
      confetti({
        particleCount: 15,
        scalar: 0.7,
        angle: 120,
        spread: 55,
        origin: { 
            x: (rect.left + rect.width * 0.8) / window.innerWidth, 
            y: (rect.top + rect.height * 0.5) / window.innerHeight 
        },
        shapes: [heart],
        colors: ['#8D2D52']
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (e.buttons !== 1) return;
      handleMove(e);
    };
    const handleTouchMove = (e: TouchEvent) => handleMove(e);

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isScratched, onComplete]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-[320px] h-44 mx-auto rounded-2xl overflow-hidden shadow-2xl bg-[#FFFDF9] border border-rose-100/50"
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
        {isScratched && (
            <motion.p 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-rose-400 font-bold uppercase text-[10px] tracking-[0.3em] mb-2"
            >
                You are invited!
            </motion.p>
        )}
        <div className={isScratched ? "scale-110 transition-transform duration-700" : ""}>
            {children}
        </div>
      </div>
      
      <canvas 
        ref={canvasRef} 
        className={`absolute inset-0 z-10 touch-none transition-opacity duration-1000 ${isScratched ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} 
      />
    </div>
  );
};