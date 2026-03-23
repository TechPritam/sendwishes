"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

type FooterTone = "light" | "midnight";

type FooterAlignMobile = "center" | "left";

export function Footer({
  tone = "light",
  alignMobile = "center",
}: {
  tone?: FooterTone;
  alignMobile?: FooterAlignMobile;
}) {
  const year = new Date().getFullYear();

  const isMidnight = tone === "midnight";
  const footerClass = isMidnight
    ? "mt-20 w-full border-t border-[rgb(0_0_0_/50%)] bg-[rgb(97_95_117_/18%)]"
    : "mt-20 w-full border-t border-rose-200/70 bg-gradient-to-b from-white via-rose-50 to-rose-50";

  const titleClass = isMidnight ? "text-white" : "text-zinc-900";
  const mutedTextClass = isMidnight ? "text-white/70" : "text-zinc-700";
  const linkClass = isMidnight ? "text-white/75 hover:text-white" : "text-zinc-700 hover:text-rose-700";
  const dividerClass = isMidnight ? "border-white/15" : "border-rose-200/60";
  const copyrightClass = isMidnight ? "text-white/60" : "text-zinc-600";

  const containerAlignClass = alignMobile === "left" ? "text-left" : "text-center sm:text-left";
  const brandJustifyClass = alignMobile === "left" ? "justify-start" : "justify-center sm:justify-start";
  const copyAlignClass = alignMobile === "left" ? "text-left" : "text-center sm:text-left";

  return (
    <footer className={footerClass}>
      <div className="w-full px-6 py-14 lg:ml-16">
        <div className="mx-auto w-full max-w-5xl">
          <div className={"grid gap-10 sm:grid-cols-3 " + containerAlignClass}>
            <div className="sm:pr-6">
              <Link href="/" className={"inline-flex items-center gap-2 " + brandJustifyClass} aria-label="sendyourWishes home">
                <Heart className="h-5 w-5 text-rose-600" fill="currentColor" />
                <span className={"font-script text-xl " + titleClass}>sendyourWishes</span>
              </Link>
              <p className={"mt-3 max-w-sm text-sm " + mutedTextClass}>
                Made with love — and a little bit of magic.
              </p>
            </div>

            <div>
              <div className={"text-sm font-semibold " + titleClass}>Experiences</div>
              <div className="mt-4 grid gap-2 text-sm">
                <Link className={linkClass} href="/proposal">
                  The Perfect Proposal
                </Link>
                <Link className={linkClass} href="/puzzle">
                  Surprise Photo Puzzle
                </Link>
                <Link className={linkClass} href="/birthday">
                  Virtual Birthday Bash
                </Link>
              </div>
            </div>

            <div>
              <div className={"text-sm font-semibold " + titleClass}>Company</div>
              <div className="mt-4 grid gap-2 text-sm">
                <Link className={linkClass} href="/">
                  About Us
                </Link>
                <Link className={linkClass} href="/">
                  Privacy Policy
                </Link>
                <Link className={linkClass} href="/">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>

          <div className={"mt-12 border-t pt-6 text-xs " + dividerClass + " " + copyrightClass + " " + copyAlignClass}>
            © {year} sendyourWishes. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}