"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Heart, Menu, X } from "lucide-react";
import { useMemo, useState } from "react";

type NavItem = { href: string; label: string };

export function CreateProposalNavbar() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);

  const isBirthdayScreen = pathname === "/create/birthday" || pathname?.startsWith("/create/birthday/");

  const headerClass = isBirthdayScreen
    ? "sticky top-0 z-50 border-b border-[rgb(0_0_0_/50%)] bg-[rgb(97_95_117_/40%)] backdrop-blur"
    : "sticky top-0 z-50 border-b border-rose-200/50 bg-white/40 backdrop-blur";

  const pillBaseClass = isBirthdayScreen
    ? "rounded-full bg-white/10 px-4 py-2 ring-1 ring-white/15 backdrop-blur"
    : "glass-pill";

  const brandClass = isBirthdayScreen
    ? "inline-flex items-center gap-2 text-base font-semibold tracking-tight text-white"
    : "inline-flex items-center gap-2 text-base font-semibold tracking-tight text-zinc-900";

  const items = useMemo<NavItem[]>(() => {
    // On the birthday create flow, remove "Birthday" and show "Proposal".
    if (isBirthdayScreen) {
      return [
        { href: "/", label: "Home" },
        { href: "/create/proposal", label: "Proposal" },
        { href: "/puzzle", label: "Photo puzzels" },
      ];
    }

    return [
      { href: "/", label: "Home" },
      { href: "/birthday", label: "Birthday" },
      { href: "/puzzle", label: "Photo puzzels" },
    ];
  }, [isBirthdayScreen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/birthday") return pathname === "/birthday" || pathname?.startsWith("/create/birthday");
    if (href === "/puzzle") return pathname === "/puzzle" || pathname?.startsWith("/create/puzzle");
    return pathname?.startsWith(href);
  };

  return (
    <header className={headerClass}>
      <nav className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 py-4">
        <Link
          href="/"
          className={brandClass}
          aria-label="sendyourWishes home"
          onClick={() => setOpen(false)}
        >
          <span className="inline-flex items-center gap-1">
            <Heart className="h-5 w-5 text-rose-600" fill="currentColor" />
            <Heart className="h-5 w-5 text-pink-500" fill="currentColor" />
          </span>
          <span className="font-script text-xl">sendyourWishes</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-2 sm:flex">
          {items.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  pillBaseClass +
                  " text-sm font-semibold transition-colors " +
                  (isBirthdayScreen
                    ? active
                      ? " bg-white/15 text-white"
                      : " text-white/80 hover:bg-white/15"
                    : active
                      ? " bg-rose-50 text-rose-800"
                      : " text-rose-700 hover:bg-rose-50")
                }
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className={
            pillBaseClass +
            " inline-flex h-10 w-10 items-center justify-center sm:hidden " +
            (isBirthdayScreen ? "text-white/85" : "text-rose-700")
          }
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile dropdown */}
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="mobile-menu"
            initial={reduceMotion ? { opacity: 1 } : { height: 0, opacity: 0 }}
            animate={reduceMotion ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.25, ease: "easeOut" }}
            className={
              "sm:hidden overflow-hidden backdrop-blur " +
              (isBirthdayScreen
                ? "border-t border-[rgb(0_0_0_/50%)] bg-[rgb(97_95_117_/40%)]"
                : "border-t border-rose-200/50 bg-white/30")
            }
          >
            <div className="mx-auto w-full max-w-5xl px-6 py-3">
              <div className="flex flex-col gap-2">
                {items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={
                        pillBaseClass +
                        " w-full text-left text-sm font-semibold transition-colors " +
                        (isBirthdayScreen
                          ? active
                            ? " bg-white/15 text-white"
                            : " text-white/80 hover:bg-white/15"
                          : active
                            ? " bg-rose-50 text-rose-800"
                            : " text-rose-700 hover:bg-rose-50")
                      }
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
