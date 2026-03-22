"use client";

import { PartyConfettiBackgroundPreview } from "./PartyConfettiBackgroundPreview";

export function BirthdayPreviewBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, rgba(15,23,42,1), rgba(88,28,135,0.95), rgba(0,0,0,1))",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at top, rgba(217,70,239,0.28), rgba(236,72,153,0.08), transparent 60%)",
        }}
      />

      <PartyConfettiBackgroundPreview />

      <div aria-hidden className="absolute inset-0 bg-black/10" />
    </div>
  );
}
