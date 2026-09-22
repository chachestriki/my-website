"use client";

import { motion } from "framer-motion";
import HatMark from "@/components/HatMark";
import { profile } from "@/data/cv";

/** the card over the street: who this is, and the two ways in — the bullseye or the CV */
export default function Intro() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="pointer-events-none absolute inset-x-0 bottom-0 z-40 flex justify-center p-6"
    >
      <motion.div
        initial={{ y: 18, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 26 }}
        className="pointer-events-auto w-full max-w-lg rounded-3xl border-4 border-white bg-card/95 p-6 text-center shadow-[0_14px_0_rgba(107,91,143,0.18)]"
      >
        <HatMark className="mx-auto h-11 w-11" />
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-brass">{profile.name}</h1>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-ink/50">{profile.title}</p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink/75">{profile.tagline}</p>

        <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="/cv"
            className="w-full rounded-full border-2 border-brass bg-brass px-7 py-3 text-sm font-bold text-white shadow-[0_5px_0_rgba(107,91,143,0.25)] transition hover:brightness-110 sm:w-auto"
          >
            Read the CV
          </a>
        </div>

        <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-ink/40">
          Or press space and hit the bullseye to walk in
        </p>
      </motion.div>
    </motion.div>
  );
}
