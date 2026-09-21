"use client";

import { motion } from "framer-motion";
import HatMark from "@/components/HatMark";
import { profile } from "@/data/cv";

/** the first screen: who this is and the two ways out — play, or read the CV */
export default function Intro({ onEnter }: { onEnter: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="absolute inset-0 z-40 flex items-center justify-center bg-[#ffd9c0]/85 p-8 backdrop-blur-md"
    >
      <motion.div
        initial={{ y: 18, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 26 }}
        className="w-full max-w-xl rounded-3xl border-4 border-white bg-card/95 p-10 text-center shadow-[0_18px_0_rgba(107,91,143,0.18)]"
      >
        <HatMark className="mx-auto h-16 w-16" />
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-brass">{profile.name}</h1>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-ink/50">{profile.title}</p>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink/75">{profile.tagline}</p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            onClick={onEnter}
            className="w-full rounded-full border-2 border-brass bg-brass px-7 py-3 text-sm font-bold text-white shadow-[0_5px_0_rgba(107,91,143,0.25)] transition hover:brightness-110 sm:w-auto"
          >
            Enter the hotel →
          </button>
          <a
            href="/cv"
            className="w-full rounded-full border-2 border-brass/30 px-7 py-3 text-sm font-bold text-brass transition hover:bg-brass/10 sm:w-auto"
          >
            Read the CV
          </a>
        </div>

        <p className="mt-6 font-mono text-[10px] uppercase tracking-widest text-ink/40">
          A walkable lobby · click the floor to move
        </p>
      </motion.div>
    </motion.div>
  );
}
