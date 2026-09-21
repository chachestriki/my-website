"use client";

import { motion } from "framer-motion";
import { projects } from "@/data/projects";

export default function ProjectsPanel({ onClose }: { onClose: () => void }) {
  return (
    <motion.aside
      initial={{ x: 60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 60, opacity: 0 }}
      transition={{ type: "spring", stiffness: 240, damping: 30 }}
      className="absolute right-0 top-0 z-30 flex h-full w-full max-w-sm flex-col gap-5 overflow-y-auto border-l-4 border-teal bg-card/95 p-6 text-ink shadow-[-18px_0_40px_rgba(0,0,0,0.3)] backdrop-blur"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-teal">Projects</p>
          <h2 className="text-2xl font-extrabold text-brass">Three I&apos;d show first</h2>
        </div>
        <button
          onClick={onClose}
          aria-label="Close the panel"
          className="rounded-full border-2 border-brass/30 px-3 py-1.5 font-mono text-xs font-semibold text-brass transition hover:bg-brass hover:text-white"
        >
          esc ✕
        </button>
      </div>

      <p className="text-sm leading-relaxed text-ink/75">
        Walk through a board to enter that project&apos;s room.
      </p>

      <ul className="space-y-4">
        {projects.map((p) => (
          <li key={p.id} className="rounded-2xl border-2 border-white bg-white/60 p-4">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <h3 className="font-semibold text-brass">{p.name}</h3>
              <p className="font-mono text-[11px] text-ink/45">{p.period}</p>
            </div>
            <p className="font-mono text-[11px] uppercase tracking-widest" style={{ color: p.color }}>
              {p.role}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink/75">{p.blurb}</p>
            <ul className="mt-2 space-y-1 text-xs leading-relaxed text-ink/65">
              {p.bullets.map((b) => (
                <li key={b}>· {b}</li>
              ))}
            </ul>
            <p className="mt-2 font-mono text-xs text-ink/50">
              <span className="text-base font-bold" style={{ color: p.color }}>
                {p.stat.value}
              </span>{" "}
              {p.stat.label}
            </p>
            {p.link && (
              <a
                href={p.link.href}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block rounded-lg border border-brass/40 bg-brass/10 px-3 py-1.5 text-xs text-brass transition hover:bg-brass/20"
              >
                {p.link.label} →
              </a>
            )}
          </li>
        ))}
      </ul>

      <a
        href="/cv"
        className="rounded-lg border border-brass/40 bg-brass/10 px-4 py-2 text-center text-sm text-brass transition hover:bg-brass/20"
      >
        Full CV →
      </a>
    </motion.aside>
  );
}
