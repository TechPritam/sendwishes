"use client";
import React, { useEffect, useRef, useState } from "react";

type ScratchCardProps = {
  children: React.ReactNode;
};

export default function ScratchCard({ children }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isScratched, setIsScratched] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (!parent) return;
    
    canvas.width = parent.offsetWidth;
    canvas.height = parent.offsetHeight;

    // Fill with Gold/Maroon "Scratch" Layer
    ctx.fillStyle = "#D4AF37"; // Gold color
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add some "texture" to the gold
    ctx.fillStyle = "#C5A059";
    for(let i=0; i<100; i++) {
        ctx.fillRect(Math.random()*canvas.width, Math.random()*canvas.height, 2, 2);
    }

    ctx.font = "20px serif";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("Scratch to Reveal", canvas.width/2, canvas.height/2 + 7);

    const scratch = (x: number, y: number) => {
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 30, 0, Math.PI * 2);
      ctx.fill();

      if (!isScratched) setIsScratched(true);
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e instanceof MouseEvent ? e.pageX : e.touches[0].pageX) - rect.left;
      const y = (e instanceof MouseEvent ? e.pageY : e.touches[0].pageY) - rect.top;
      scratch(x, y);
    };

    canvas.addEventListener("mousemove", handleMove);
    canvas.addEventListener("touchmove", handleMove, { passive: true });

    return () => {
      canvas.removeEventListener("mousemove", handleMove);
      canvas.removeEventListener("touchmove", handleMove);
    };
  }, [isScratched]);

  return (
    <div className="relative w-full h-40 rounded-2xl overflow-hidden shadow-inner bg-rose-50 flex items-center justify-center">
      {/* The Hidden Content */}
      <div className="text-center">
        {children}
      </div>
      
      {/* The Scratchable Layer */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 cursor-crosshair touch-none"
      />
    </div>
  );
}