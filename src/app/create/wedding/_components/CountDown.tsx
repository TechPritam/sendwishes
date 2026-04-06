"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { playfair, greatVibes, inter } from "@/app/fonts"; // adjust path

type CountdownProps = {
  targetDate: string | Date;
  groom: string;
  bride: string;
};

export const Countdown = ({ targetDate, groom, bride }: CountdownProps) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = +new Date(targetDate) - +new Date();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / 86400000),
          hours: Math.floor((diff / 3600000) % 24),
          minutes: Math.floor((diff / 60000) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="w-full flex flex-col items-center text-center px-4">

      {/* Heading */}
      <h2 className={`${playfair.className} text-4xl text-rose-900 mb-8 italic tracking-wide`}>
        Counting Down to Forever
      </h2>

      {/* Invitation Message */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="max-w-2xl mb-12"
      >
        <p className={`${inter.className} text-rose-700 text-base leading-relaxed tracking-wide`}>
          Excitement fills our hearts, and with the blessings of our families,
          we invite you to join us as we celebrate the beginning of our new journey together.
        </p>

        <p className={`${greatVibes.className} text-5xl text-rose-800 mt-6`}>
          {groom} & {bride}
        </p>

        <p className={`${inter.className} text-rose-600 text-sm mt-4 tracking-wide`}>
          Your presence will make our special day even more meaningful.
        </p>
      </motion.div>

      {/* Countdown */}
      <div className="flex divide-x divide-rose-100 bg-white/60 py-6 px-6 mb-18 mt-14 rounded-3xl backdrop-blur-sm border border-rose-50 shadow-sm">
        {[
          { val: timeLeft.days, label: "Days" },
          { val: timeLeft.hours, label: "Hours" },
          { val: timeLeft.minutes, label: "Mins" },
          { val: timeLeft.seconds, label: "Secs" }
        ].map((unit, i) => (
          <div key={i} className="flex flex-col items-center px-5">
            <span className={`${playfair.className} text-4xl text-rose-900`}>
              {unit.val.toString().padStart(2, '0')}
            </span>
            <span className="text-[10px] tracking-[0.2em] uppercase text-rose-400 mt-1">
              {unit.label}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
};