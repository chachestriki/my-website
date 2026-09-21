"use client";

import { motion } from "framer-motion";
import { career } from "@/data/career";

export default function GalleryPanel({ onClose }: { onClose: () => void }) {
  return (
    <motion.aside
      initial={{ x: 60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 60, opacity: 0 }}
      transition={{ type: "spring", stiffness: 240, damping: 30 }}
      className="absolute right-0 top-0 z-30 flex h-full w-full max-w-sm flex-col gap-5 overflow-y-auto border-l-4 border-brass bg-card/95 p-6 text-ink shadow-[-18px_0_40px_rgba(0,0,0,0.3)] backdrop-blur"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-teal">Career hall</p>
          <h2 className="text-2xl font-extrabold text-brass">The line</h2>
        </div>
        <button
          onClick={onClose}
          aria-label="Close the panel"
          className="rounded-full border-2 border-brass/30 px-3 py-1.5 font-mono text-xs font-semibold text-brass transition hover:bg-brass hover:text-white"
        >
          esc ✕
        </button>
      </div>

      <ol className="relative space-y-4 border-l border-brass/25 pl-5">
        {career.map((s) => (
          <li key={s.id} className="relative">
            <span
              className="absolute -left-[26px] top-1.5 h-3 w-3 rounded-full border-2 border-[#fff6ea]"
              style={{ background: s.color }}
            />
            <div className="flex flex-wrap items-baseline gap-x-2">
              <h3 className="font-semibold text-brass">{s.company}</h3>
              <p className="font-mono text-[11px] text-ink/45">{s.period}</p>
            </div>
            <p className="text-xs text-ink/55">{s.role}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink/75">{s.note}</p>
          </li>
        ))}
      </ol>

      <a
        href="/cv"
        className="inline-block rounded-lg border border-brass/40 bg-brass/10 px-4 py-2 text-center text-sm text-brass transition hover:bg-brass/20"
      >
        Full CV →
      </a>
    </motion.aside>
  );
}
