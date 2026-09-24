"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { profile } from "@/data/cv";
import { LanguageToggle, useLanguage } from "@/components/LanguageProvider";

export type NavLink = { id: string; label: string };

/** fixed bar: the wordmark on the left, the language flag and the burger on the right */
export default function SiteNav({ links }: { links: NavLink[] }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  const external = [
    { href: profile.github, label: "GitHub" },
    { href: profile.linkedin, label: "LinkedIn" },
    { href: "/cv", label: t.cv },
    { href: `mailto:${profile.email}`, label: t.email },
  ].filter((l) => l.href.length > 0);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-current/10 bg-[color:var(--chapter-bg)]/70 text-[color:var(--chapter-fg)] backdrop-blur-xl transition-colors duration-700">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
          <a href="#top" className="font-semibold tracking-tight">
            JD <span className="text-[color:var(--chapter-accent)]">Portfolio</span>
          </a>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <button
              aria-label={open ? t.closeMenu : t.openMenu}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] rounded-lg border border-current/20 transition hover:border-current/50"
            >
              <span
                className={`h-[1.5px] w-4 bg-current transition-transform duration-300 ${open ? "translate-y-[6.5px] rotate-45" : ""}`}
              />
              <span
                className={`h-[1.5px] w-4 bg-current transition-opacity duration-200 ${open ? "opacity-0" : ""}`}
              />
              <span
                className={`h-[1.5px] w-4 bg-current transition-transform duration-300 ${open ? "-translate-y-[6.5px] -rotate-45" : ""}`}
              />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.2, 0.7, 0.2, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-[color:var(--chapter-bg)]/95 px-8 pt-14 text-[color:var(--chapter-fg)] backdrop-blur-xl"
          >
            <ul className="mx-auto w-full max-w-6xl space-y-1">
              {links.map((l, i) => (
                <motion.li
                  key={l.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.3 }}
                >
                  <a
                    href={`#${l.id}`}
                    onClick={() => setOpen(false)}
                    className="block py-1.5 text-3xl font-semibold tracking-tight opacity-85 transition hover:text-[color:var(--chapter-accent)] hover:opacity-100 sm:text-4xl"
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>

            <div className="mx-auto mt-10 flex w-full max-w-6xl flex-wrap gap-x-6 gap-y-2 border-t border-current/15 pt-6 font-mono text-xs uppercase tracking-widest opacity-70">
              {external.map((e) => (
                <a
                  key={e.label}
                  href={e.href}
                  target={e.href.startsWith("http") ? "_blank" : undefined}
                  rel={e.href.startsWith("http") ? "noreferrer" : undefined}
                  className="transition hover:text-[color:var(--chapter-accent)]"
                >
                  {e.label} ↗
                </a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
