"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Heart, Menu, X } from "lucide-react";
import { useMemo, useState } from "react";

type NavItem = { href: string; label: string };

export function Navbar() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);

  const items = useMemo<NavItem[]>(() => {
    const base: NavItem[] = [
      { href: "/", label: "Home" },
      { href: "/create/proposal", label: "Proposal" },
      { href: "/create/birthday", label: "Birthday" },
      { href: "/puzzle", label: "Photo puzzle" },
      // { href: "/create/valentine", label: "Valentine" },
      { href: "/create/sorry", label: "Apology Era" },
    ];

    // On the home page, the Home link is redundant.
    if (pathname === "/") return base.filter((i) => i.href !== "/");
    return base;
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  return (
    <header className="relative border-b border-rose-200/50 bg-white/40 backdrop-blur lg:sticky lg:top-0 lg:z-50">
      <nav className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 py-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-base font-semibold tracking-tight text-zinc-900"
          aria-label="sendyourWishes home"
          onClick={() => setOpen(false)}
        >
          <span className="inline-flex items-center gap-1">
            <Heart className="h-5 w-5 text-rose-600" fill="currentColor" />
            <Heart className="h-5 w-5 text-pink-500" fill="currentColor" />
          </span>
          <span className="text-xl">sendyourWishes</span>
        </Link>

        <div className="hidden items-center gap-2 sm:flex">
          {items.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  "glass-pill text-sm font-semibold transition-colors " +
                  (active
                    ? "bg-rose-50 text-rose-800"
                    : "text-rose-700 hover:bg-rose-50")
                }
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <button
          type="button"
          className="glass-pill inline-flex h-10 w-10 items-center justify-center text-rose-700 sm:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="mobile-menu"
            initial={reduceMotion ? { opacity: 1 } : { height: 0, opacity: 0 }}
            animate={reduceMotion ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.25, ease: "easeOut" }}
            className="sm:hidden overflow-hidden border-t border-rose-200/50 bg-white/30 backdrop-blur"
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
                        "glass-pill w-full text-left text-sm font-semibold transition-colors " +
                        (active
                          ? "bg-rose-50 text-rose-800"
                          : "text-rose-700 hover:bg-rose-50")
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
