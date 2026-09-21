"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { doorQuiz, type DoorQuestion } from "@/data/doorQuiz";

/** the keycard puzzle on a scene door: one question, four options, wrong answers just retry */
export default function DoorQuiz({
  stationId,
  doorName,
  /** rolled by the caller so each attempt can ask a different question */
  seed,
  onUnlock,
  onCancel,
}: {
  stationId: string;
  doorName: string;
  seed: number;
  onUnlock: () => void;
  onCancel: () => void;
}) {
  const pool: DoorQuestion[] = doorQuiz[stationId] ?? [];
  const [picked, setPicked] = useState<number | null>(null);

  const question: DoorQuestion | undefined = pool.length ? pool[seed % pool.length] : undefined;

  if (!question) return null;

  const correct = picked !== null && picked === question.answer;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-plum/45 p-6 backdrop-blur-sm"
      onClick={onCancel}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`Keycard check — ${doorName}`}
        initial={{ y: 24, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 18, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-3xl border-4 border-white bg-card p-6 shadow-[0_18px_0_rgba(107,91,143,0.18)]"
      >
        <p className="font-mono text-[11px] uppercase tracking-widest text-teal">
          Keycard check · {doorName}
        </p>
        <h2 className="mt-1 text-lg font-extrabold leading-snug text-brass">{question.question}</h2>

        <div className="mt-4 grid gap-2">
          {question.options.map((option, i) => {
            const isPicked = picked === i;
            const state = !isPicked
              ? "border-white bg-white/80 text-ink/75 hover:border-brass/40 hover:text-brass"
              : i === question.answer
                ? "border-teal bg-teal/15 text-teal"
                : "border-[#e0392b]/60 bg-[#e0392b]/10 text-[#b02418]";
            return (
              <button
                key={option}
                onClick={() => setPicked(i)}
                disabled={correct}
                className={`rounded-2xl border-2 px-4 py-2.5 text-left text-sm font-semibold transition disabled:cursor-default ${state}`}
              >
                <span className="mr-2 font-mono text-[11px] text-brass/60">{String.fromCharCode(65 + i)}</span>
                {option}
              </button>
            );
          })}
        </div>

        {picked !== null && (
          <p className={`mt-3 text-sm ${correct ? "text-teal" : "text-[#b02418]"}`}>
            {correct ? question.note : "Not that one — try again."}
          </p>
        )}

        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            onClick={onCancel}
            className="rounded-full border-2 border-brass/25 px-4 py-2 font-mono text-xs font-semibold text-brass/70 transition hover:bg-brass/10"
          >
            esc ✕ stay in the lobby
          </button>
          <button
            onClick={onUnlock}
            disabled={!correct}
            className="rounded-full border-2 border-brass bg-brass px-5 py-2 font-mono text-xs font-semibold text-white transition disabled:border-white disabled:bg-white/70 disabled:text-ink/35"
          >
            open the door →
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
