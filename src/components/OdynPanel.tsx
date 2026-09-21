"use client";

import { motion } from "framer-motion";
import { odyn } from "@/data/projects";

export default function OdynPanel({ onClose }: { onClose: () => void }) {
  return (
    <motion.aside
      initial={{ x: 60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 60, opacity: 0 }}
      transition={{ type: "spring", stiffness: 240, damping: 30 }}
      className="absolute right-0 top-0 z-30 flex h-full w-full max-w-sm flex-col gap-5 overflow-y-auto border-l-4 border-[#7c5cff] bg-[#171334]/95 p-6 text-[#e9e4ff] shadow-[-18px_0_40px_rgba(0,0,0,0.45)] backdrop-blur"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-[#9b86ff]">{odyn.role}</p>
          <h2 className="text-2xl font-extrabold text-white">{odyn.title}</h2>
        </div>
        <button
          onClick={onClose}
          aria-label="Close the panel"
          className="rounded-full border-2 border-[#7c5cff]/60 px-3 py-1.5 font-mono text-xs font-semibold text-[#9b86ff] transition hover:bg-[#7c5cff] hover:text-white"
        >
          esc ✕
        </button>
      </div>

      <p className="text-sm leading-relaxed text-[#cfc7ff]">{odyn.intro}</p>

      <div className="space-y-3">
        {odyn.blocks.map((b) => (
          <div key={b.heading} className="rounded-2xl border border-[#7c5cff]/35 bg-[#211a48]/70 p-4">
            <h3 className="font-mono text-xs uppercase tracking-widest text-[#9b86ff]">{b.heading}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-[#ddd7ff]">{b.body}</p>
          </div>
        ))}
      </div>

      <div>
        <h3 className="font-mono text-xs uppercase tracking-widest text-[#9b86ff]">Core values</h3>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {odyn.values.map((v) => (
            <span key={v} className="rounded-full border border-[#7c5cff]/40 px-2.5 py-1 text-xs text-[#cfc7ff]">
              {v}
            </span>
          ))}
        </div>
      </div>
    </motion.aside>
  );
}
