"use client";

import { motion } from "framer-motion";
import { botlab } from "@/data/projects";

export default function BotLabPanel({ onClose }: { onClose: () => void }) {
  return (
    <motion.aside
      initial={{ x: 60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 60, opacity: 0 }}
      transition={{ type: "spring", stiffness: 240, damping: 30 }}
      className="absolute right-0 top-0 z-30 flex h-full w-full max-w-sm flex-col gap-5 overflow-y-auto border-l-4 border-[#2ecf9f] bg-[#10231e]/95 p-6 text-[#dcf5ec] shadow-[-18px_0_40px_rgba(0,0,0,0.45)] backdrop-blur"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-[#6fe3bd]">{botlab.role}</p>
          <h2 className="text-2xl font-extrabold text-white">{botlab.title}</h2>
        </div>
        <button
          onClick={onClose}
          aria-label="Close the panel"
          className="rounded-full border-2 border-[#2ecf9f]/60 px-3 py-1.5 font-mono text-xs font-semibold text-[#6fe3bd] transition hover:bg-[#2ecf9f] hover:text-[#10231e]"
        >
          esc ✕
        </button>
      </div>

      <p className="text-sm leading-relaxed text-[#bfe9da]">{botlab.intro}</p>

      <ol className="space-y-3">
        {botlab.pipeline.map((s, i) => (
          <li key={s.step} className="rounded-2xl border border-[#2ecf9f]/30 bg-[#16352c]/70 p-4">
            <h3 className="font-mono text-xs uppercase tracking-widest text-[#6fe3bd]">
              {i + 1}. {s.step}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-[#d4f2e7]">{s.body}</p>
          </li>
        ))}
      </ol>

      <p className="rounded-2xl border border-[#ff3d6e]/40 bg-[#331a24]/60 p-4 text-sm leading-relaxed text-[#ffd5df]">
        {botlab.note}
      </p>
    </motion.aside>
  );
}
