"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TAKEOVER } from "@/data/agentLobby";

const SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

const MARKS = Array.from({ length: 18 }, (_, i) => ({
  left: `${(i * 37) % 95}%`,
  delay: (i % 6) * 0.12,
  size: 18 + ((i * 13) % 42),
}));

/** the Konami code: ↑ ↑ ↓ ↓ ← → ← → B A takes the page over for a few seconds */
export default function KonamiEgg() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let hit = 0;

    const onKey = (e: KeyboardEvent) => {
      const target = e.target;
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return;

      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      hit = key === SEQUENCE[hit] ? hit + 1 : key === SEQUENCE[0] ? 1 : 0;

      if (hit === SEQUENCE.length) {
        hit = 0;
        setOpen(true);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => setOpen(false), 6000);
    return () => window.clearTimeout(id);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[80] flex items-center justify-center overflow-hidden bg-black/90 text-center"
        >
          {MARKS.map((m, i) => (
            <motion.span
              key={i}
              initial={{ y: "110vh", opacity: 0 }}
              animate={{ y: "-20vh", opacity: [0, 1, 1, 0] }}
              transition={{ duration: 3.4, delay: m.delay, repeat: Infinity, ease: "linear" }}
              style={{ left: m.left, fontSize: m.size }}
              className="absolute font-mono font-bold text-[#c9a260]"
            >
              jd
            </motion.span>
          ))}

          <motion.p
            initial={{ scale: 0.7 }}
            animate={{ scale: 1 }}
            className="relative max-w-2xl px-8 font-mono text-2xl font-bold uppercase tracking-[0.2em] text-[#f4f2ee] sm:text-4xl"
          >
            {TAKEOVER}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
