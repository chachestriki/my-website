"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const CONTROLS: { keys: string[]; action: string }[] = [
  { keys: ["click"], action: "walk to that spot" },
  { keys: ["W", "A", "S", "D"], action: "step around" },
  { keys: ["↑", "←", "↓", "→"], action: "step around" },
  { keys: ["1", "–", "5"], action: "go to a station" },
  { keys: ["esc"], action: "close a room" },
];

export default function ControlsLegend() {
  const [open, setOpen] = useState(true);

  return (
    <div className="pointer-events-auto absolute bottom-20 left-5 z-20 w-56">
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="mb-2 rounded-2xl border-2 border-white bg-white/85 p-3 shadow-[0_6px_0_rgba(107,91,143,0.12)]"
          >
            <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-ink/45">Controls</p>
            <ul className="space-y-1.5">
              {CONTROLS.map((c) => (
                <li key={c.action + c.keys.join("")} className="flex items-center gap-2">
                  <span className="flex gap-1">
                    {c.keys.map((k) => (
                      <kbd
                        key={k}
                        className="rounded-md border-2 border-brass/20 bg-white px-1.5 py-0.5 font-mono text-[10px] font-semibold text-brass"
                      >
                        {k}
                      </kbd>
                    ))}
                  </span>
                  <span className="text-[11px] text-ink/60">{c.action}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="rounded-full border-2 border-white bg-white/85 px-3 py-1.5 font-mono text-[11px] font-semibold text-brass shadow-[0_4px_0_rgba(107,91,143,0.12)] transition hover:bg-white"
      >
        {open ? "hide controls" : "? controls"}
      </button>
    </div>
  );
}
