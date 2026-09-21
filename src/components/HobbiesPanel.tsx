"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { hobbies } from "@/data/hobbies";

export default function HobbiesPanel({ onClose }: { onClose: () => void }) {
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
          <p className="font-mono text-[11px] uppercase tracking-widest text-teal">Hobbies</p>
          <h2 className="text-2xl font-extrabold text-brass">{hobbies.heading}</h2>
        </div>
        <button
          onClick={onClose}
          aria-label="Close the panel"
          className="rounded-full border-2 border-brass/30 px-3 py-1.5 font-mono text-xs font-semibold text-brass transition hover:bg-brass hover:text-white"
        >
          esc ✕
        </button>
      </div>

      <p className="text-sm leading-relaxed text-ink/75">{hobbies.intro}</p>

      <ul className="space-y-4">
        {hobbies.memories.map((m) => (
          <li key={m.id} className="rounded-2xl border-2 border-white bg-white/60 p-3">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <h3 className="font-semibold text-brass">{m.title}</h3>
              <p className="font-mono text-[11px] text-ink/45">{m.when}</p>
            </div>
            {m.src ? (
              <Image
                src={m.src}
                alt={m.title}
                width={640}
                height={460}
                className="mt-2 w-full rounded-lg"
                sizes="360px"
              />
            ) : (
              <div
                className="mt-2 flex h-24 items-center justify-center rounded-lg border-2 border-dashed font-mono text-[10px] uppercase tracking-widest"
                style={{ borderColor: `${m.color}66`, color: `${m.color}` }}
              >
                photo coming
              </div>
            )}
            <p className="mt-2 text-sm leading-relaxed text-ink/75">{m.note}</p>
          </li>
        ))}
      </ul>

      <div>
        <h3 className="font-mono text-xs uppercase tracking-widest text-teal">Next up</h3>
        <ul className="mt-2 space-y-1 text-sm text-ink/75">
          {hobbies.goals.map((g) => (
            <li key={g}>· {g}</li>
          ))}
        </ul>
      </div>
    </motion.aside>
  );
}
