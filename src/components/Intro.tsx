"use client";

import { motion } from "framer-motion";
import HatMark from "@/components/HatMark";
import { profile } from "@/data/cv";

/** the card in the street's bottom-left corner: who this is, and the two ways in — the bullseye or the CV */
export default function Intro() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="pointer-events-none absolute bottom-0 left-0 z-40 p-6"
    >
      <motion.div
        initial={{ y: 18, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 26 }}
        className="pointer-events-auto max-w-sm rounded-3xl border-4 border-white bg-card/95 p-5 shadow-[0_14px_0_rgba(20,23,26,0.18)]"
      >
        <HatMark className="h-10 w-10" />
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-brass">{profile.name}</h1>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-ink/50">{profile.title}</p>
        <p className="mt-3 text-sm leading-relaxed text-ink/75">{profile.tagline}</p>

        <a
          href="/cv"
          className="mt-4 inline-block rounded-full border-2 border-brass bg-brass px-6 py-2.5 text-sm font-bold text-white shadow-[0_5px_0_rgba(20,23,26,0.25)] transition hover:brightness-110"
        >
          Read the CV
        </a>

        <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-ink/40">
          Or press space and hit the bullseye to walk in
        </p>
      </motion.div>
    </motion.div>
  );
}
