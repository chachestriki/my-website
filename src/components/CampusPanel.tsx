"use client";

import { motion } from "framer-motion";
import { EducationRoom } from "@/components/rooms";

export default function CampusPanel({ onClose }: { onClose: () => void }) {
  return (
    <motion.aside
      initial={{ x: 60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 60, opacity: 0 }}
      transition={{ type: "spring", stiffness: 240, damping: 30 }}
      className="absolute right-0 top-0 z-30 flex h-full w-full max-w-md flex-col gap-5 overflow-y-auto border-l-4 border-[#e0392b] bg-card/95 p-6 text-ink shadow-[-18px_0_40px_rgba(0,0,0,0.25)] backdrop-blur"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-teal">Education</p>
          <h2 className="text-2xl font-extrabold text-brass">Madrid &amp; Texas</h2>
        </div>
        <button
          onClick={onClose}
          aria-label="Close the panel"
          className="rounded-full border-2 border-brass/30 px-3 py-1.5 font-mono text-xs font-semibold text-brass transition hover:bg-brass hover:text-white"
        >
          esc ✕
        </button>
      </div>

      <EducationRoom />

      <p className="font-mono text-[10px] uppercase tracking-wider text-ink/40">
        West: Alcalá, Cibeles, the bear · East: the Capitol dome and the pumpjack
      </p>
    </motion.aside>
  );
}
