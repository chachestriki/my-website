"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/** the target bobs up and down over this range, in svg units around CENTER_Y */
const AMPLITUDE = 70;
const PERIOD = 2600;
const CENTER_Y = 210;
const TARGET_X = 700;
const BOW_X = 150;
const FLIGHT = 340;
/** vertical distance from the target's centre that still counts as a bullseye / a ring */
const BULLSEYE = 14;
const RING = 42;

type Shot = { y: number; start: number };
type Result = "bullseye" | "ring" | "miss";

function targetY(t: number) {
  return CENTER_Y + Math.sin((t / PERIOD) * Math.PI * 2) * AMPLITUDE;
}

/** the archery range you shoot through to get into the hotel */
export default function ArcheryGate({ onWin, onSkip }: { onWin: () => void; onSkip: () => void }) {
  const [y, setY] = useState(CENTER_Y);
  const [shot, setShot] = useState<Shot | null>(null);
  const [arrowT, setArrowT] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [misses, setMisses] = useState(0);
  const [won, setWon] = useState(false);
  const shotRef = useRef<Shot | null>(null);
  const wonRef = useRef(false);

  useEffect(() => {
    let raf = 0;
    const loop = (t: number) => {
      const current = shotRef.current;
      if (!wonRef.current && !current) setY(targetY(t));
      if (current) {
        const p = Math.min(1, (t - current.start) / FLIGHT);
        setArrowT(p);
        if (p >= 1) {
          const d = Math.abs(current.y - targetY(t));
          const hit: Result = d < BULLSEYE ? "bullseye" : d < RING ? "ring" : "miss";
          setResult(hit);
          shotRef.current = null;
          setShot(null);
          setArrowT(0);
          if (hit === "bullseye") {
            wonRef.current = true;
            setWon(true);
            window.setTimeout(onWin, 1100);
          }
          if (hit !== "bullseye") setMisses((m) => m + 1);
        } else {
          setY(targetY(t));
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [onWin]);

  const shoot = useCallback(() => {
    if (shotRef.current || wonRef.current) return;
    const next = { y, start: performance.now() };
    shotRef.current = next;
    setShot(next);
    setResult(null);
  }, [y]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        shoot();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shoot]);

  const arrowX = shot ? BOW_X + 60 + (TARGET_X - BOW_X - 60) * arrowT : BOW_X + 40;
  const arrowY = shot ? shot.y : y;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#8fd0ff] px-6"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 p-8 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-[0_3px_0_rgba(107,91,143,0.35)] sm:text-4xl">
          To enter JD&apos;s Portfolio you must hit the bullseye!
        </h2>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-widest text-white/80">
          click or press space · the bow tracks the target, so loose when it slows at the top or the bottom
        </p>
      </div>

      <button
        onClick={shoot}
        aria-label="Shoot an arrow at the target"
        className="w-full max-w-4xl cursor-crosshair"
      >
        <svg viewBox="0 0 840 420" className="w-full">
          <defs>
            <linearGradient id="gate-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a8e0ff" />
              <stop offset="100%" stopColor="#ffe7bd" />
            </linearGradient>
          </defs>
          <rect width="840" height="420" rx="28" fill="url(#gate-sky)" />
          <circle cx="120" cy="80" r="34" fill="#ffc01f" />
          <ellipse cx="640" cy="72" rx="58" ry="24" fill="#ffffff" opacity="0.85" />
          <ellipse cx="596" cy="80" rx="34" ry="18" fill="#ffffff" opacity="0.85" />
          <rect y="330" width="840" height="90" fill="#3fbf62" />
          <rect y="330" width="840" height="10" fill="#2ea34f" />

          {/* the target on its stand, bobbing */}
          <g transform={`translate(${TARGET_X} ${y})`}>
            <rect x="-6" y="0" width="12" height={340 - y + 30} fill="#a8521f" />
            <circle r="86" fill="#fff6e6" stroke="#6b45cf" strokeWidth="6" />
            <circle r="64" fill="#4fa4ff" />
            <circle r="42" fill="#fff6e6" />
            <circle r="22" fill="#ff5f92" />
            <circle r="9" fill="#ffc01f" />
          </g>

          {/* the penguin archer */}
          <g transform={`translate(${BOW_X} ${CENTER_Y + 40})`}>
            <ellipse cx="0" cy="96" rx="44" ry="10" fill="#2ea34f" opacity="0.35" />
            <ellipse cx="0" cy="40" rx="42" ry="54" fill="#2a2f4a" />
            <ellipse cx="4" cy="46" rx="26" ry="40" fill="#fff6e6" />
            <circle cx="0" cy="-16" r="30" fill="#2a2f4a" />
            <circle cx="10" cy="-20" r="5" fill="#fff6e6" />
            <circle cx="11" cy="-20" r="2.6" fill="#2a2f4a" />
            <path d="M24 -12 l18 6 -18 7 z" fill="#ff9a1f" />
            <ellipse cx="0" cy="-40" rx="36" ry="9" fill="#e0a241" />
            <path d="M-20 -42 q20 -26 40 0 z" fill="#e0a241" />
            <path d="M-22 -41 h44" stroke="#a8521f" strokeWidth="4" />
            <ellipse cx="-12" cy="92" rx="16" ry="7" fill="#ff9a1f" />
            <ellipse cx="18" cy="92" rx="16" ry="7" fill="#ff9a1f" />
            <g transform={`translate(40 ${arrowY - CENTER_Y - 40})`}>
              <path d="M0 -52 q26 52 0 104" stroke="#a8521f" strokeWidth="7" fill="none" strokeLinecap="round" />
              <path d="M0 -52 L0 52" stroke="#fff6e6" strokeWidth="2.5" />
            </g>
          </g>

          {/* the arrow: nocked, then in flight */}
          <g transform={`translate(${arrowX} ${arrowY})`}>
            <rect x="-52" y="-2.5" width="86" height="5" rx="2.5" fill="#a8521f" />
            <path d="M34 -9 l20 9 -20 9 z" fill="#5c6a86" />
            <path d="M-52 -9 l16 9 -16 9 z" fill="#ff3d6e" />
          </g>
        </svg>
      </button>

      <div className="mt-5 flex min-h-[3.5rem] flex-col items-center gap-3">
        {result === "bullseye" && (
          <p className="rounded-full border-2 border-white bg-white/90 px-5 py-2 text-sm font-bold text-brass">
            Bullseye! The doors are opening…
          </p>
        )}
        {result === "ring" && (
          <p className="rounded-full border-2 border-white/70 bg-white/70 px-5 py-2 text-sm font-semibold text-brass">
            So close — you clipped a ring. Loose at the top or the bottom of the swing.
          </p>
        )}
        {result === "miss" && (
          <p className="rounded-full border-2 border-white/70 bg-white/70 px-5 py-2 text-sm font-semibold text-brass">
            Missed. Wait for the target to slow down at the end of its swing.
          </p>
        )}
        <div className="flex items-center gap-4">
          {misses >= 3 && !won && (
            <button
              onClick={onSkip}
              className="rounded-full border-2 border-white/70 px-4 py-2 font-mono text-[11px] font-semibold text-white transition hover:bg-white/20"
            >
              skip into the lobby →
            </button>
          )}
          <a
            href="/cv"
            className="rounded-full border-2 border-white/70 px-4 py-2 font-mono text-[11px] font-semibold text-white transition hover:bg-white/20"
          >
            read the CV instead
          </a>
        </div>
      </div>
    </motion.div>
  );
}
