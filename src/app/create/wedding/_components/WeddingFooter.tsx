"use client";

import React from "react";

export type WeddingFooterProps = {
  groom?: string;
  bride?: string;
  closingMessage?: string;
  weddingHashtag?: string;
  quote?: string;
  year?: number;
  instagramUrl?: string;
  instagramHandle?: string;
  promoHref?: string;
  promoText?: string;
};

const DEFAULT_INSTAGRAM_URL = "https://www.instagram.com/sendwishes/";
const DEFAULT_INSTAGRAM_HANDLE = "@sendwishes";
const DEFAULT_PROMO_HREF = "/";
const DEFAULT_PROMO_TEXT = "Made with SendWishes — create your own in minutes.";

export function WeddingFooter({
  groom,
  bride,
  closingMessage,
  weddingHashtag,
  quote,
  year,
  instagramUrl = DEFAULT_INSTAGRAM_URL,
  instagramHandle = DEFAULT_INSTAGRAM_HANDLE,
  promoHref = DEFAULT_PROMO_HREF,
  promoText = DEFAULT_PROMO_TEXT,
}: WeddingFooterProps) {
  const safeTag = weddingHashtag ? weddingHashtag.replace(/#/g, "") : "";
  const displayYear = year ?? new Date().getFullYear();

  return (
    <footer className="bg-[#1a1a1a] text-white/50 py-20 px-6 text-center">
      <div className="">
        {/* {closingMessage ? (
          <p className="font-serif text-xl text-white/80 italic">{closingMessage}</p>
        ) : null}

        {groom && bride ? (
          <h2 className="font-serif text-4xl md:text-6xl text-white/90 tracking-tight">
            {groom}{" "}
            <span className="text-2xl md:text-3xl font-light text-[#b08d57] mx-2">&</span>{" "}
            {bride}
          </h2>
        ) : null}

        {safeTag ? (
          <p className="text-[#b08d57] tracking-[0.3em] text-xs font-bold uppercase">#{safeTag}</p>
        ) : null}

        {quote ? (
          <p className="max-w-xs mx-auto text-sm leading-relaxed italic">{quote}</p>
        ) : null} */}

        <div className="">
          <p className="text-[10px] uppercase tracking-widest">Digital Invitation • {displayYear}</p>

          <p className="text-xs">
            Follow us on{" "}
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[#b08d57] hover:underline"
            >
              Instagram {instagramHandle}
            </a>
          </p>

          <p className="text-xs">
            <a href={promoHref} className="text-white/70 hover:text-white hover:underline">
              {promoText}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}