"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Heart, Menu, X, Leaf } from "lucide-react";
import { useMemo, useState } from "react";

type NavItem = { href: string; label: string };

export function CreateSorryNavbar() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);

  // Theme configuration for the "Sorry" flow
  const headerClass = "relative border-b border-emerald-200/50 bg-white/40 backdrop-blur lg:sticky lg:top-0 lg:z-50";
  const pillBaseClass = "glass-pill-emerald"; // Ensure this class exists in your CSS or use standard Tailwind below
  const brandClass = "inline-flex items-center gap-2 text-base font-semibold tracking-tight text-emerald-900";

  const items = useMemo<NavItem[]>(() => {
    return [
      { href: "/", label: "Home" },
      { href: "/proposal", label: "The Perfect Proposal" },
      { href: "/birthday", label: "Virtual Birthday" },
    ];
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/sorry") return pathname === "/sorry" || pathname?.startsWith("/create/sorry");
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
            <Leaf className="h-5 w-5 text-emerald-600" fill="currentColor" />
            <Heart className="h-5 w-5 text-emerald-400" fill="currentColor" />
          </span>
          <span className="font-script text-xl text-emerald-900">sendyourWishes</span>
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
                  "rounded-full px-4 py-2 text-sm font-semibold transition-colors backdrop-blur " +
                  (active
                    ? " bg-emerald-100 text-emerald-900 ring-1 ring-emerald-200"
                    : " text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800")
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
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 sm:hidden"
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
            className="sm:hidden overflow-hidden backdrop-blur border-t border-emerald-200/50 bg-white/60"
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
                        "w-full rounded-full px-4 py-3 text-left text-sm font-semibold transition-colors " +
                        (active
                          ? " bg-emerald-100 text-emerald-900 ring-1 ring-emerald-200"
                          : " text-emerald-700 hover:bg-emerald-50")
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