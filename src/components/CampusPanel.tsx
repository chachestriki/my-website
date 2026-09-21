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
          <p className="font-mono text-[11px] uppercase tracking-widest text-teal">Campus plaza</p>
          <h2 className="text-2xl font-extrabold text-brass">Madrid ↔ Texas</h2>
          <p className="text-sm text-ink/55">Business in Spain, computers in Texas</p>
        </div>
        <button
          onClick={onClose}
          aria-label="Back to the lobby"
          className="rounded-full border-2 border-brass/30 px-3 py-1.5 font-mono text-xs font-semibold text-brass transition hover:bg-brass hover:text-white"
        >
          esc ✕
        </button>
      </div>

      <EducationRoom />

      <p className="font-mono text-[10px] uppercase tracking-wider text-ink/40">
        Walk west for the Puerta de Alcalá, Cibeles and the bear · east for the Capitol dome, the
        water tower and the pumpjack
      </p>
    </motion.aside>
  );
}
