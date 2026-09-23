"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { viceResell } from "@/data/viceResell";

export default function ViceResellPanel({ onClose }: { onClose: () => void }) {
  return (
    <motion.aside
      initial={{ x: 60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 60, opacity: 0 }}
      transition={{ type: "spring", stiffness: 240, damping: 30 }}
      className="absolute right-0 top-0 z-30 flex h-full w-full max-w-md flex-col gap-5 overflow-y-auto border-l-4 border-[#a39d93] bg-[#18191c]/95 p-6 text-[#fbfbfb] shadow-[-18px_0_40px_rgba(0,0,0,0.45)] backdrop-blur"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-[#757e8a]">Factory floor</p>
          <h2 className="text-2xl font-extrabold text-[#a39d93]">{viceResell.title}</h2>
          <p className="text-sm text-[#fbfbfb]/60">{viceResell.role}</p>
        </div>
        <button
          onClick={onClose}
          aria-label="Back to the lobby"
          className="rounded-full border-2 border-[#757e8a]/50 px-3 py-1.5 font-mono text-xs font-semibold text-[#757e8a] transition hover:bg-[#757e8a] hover:text-[#18191c]"
        >
          esc ✕
        </button>
      </div>

      <p className="text-sm leading-relaxed text-[#fbfbfb]/80">{viceResell.intro}</p>

      <div className="grid grid-cols-3 gap-2">
        {viceResell.stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-[#757e8a]/25 bg-white/5 p-3 text-center">
            <p className="text-base font-extrabold text-[#aba59c]">{s.value}</p>
            <p className="font-mono text-[9px] uppercase leading-tight tracking-wider text-[#fbfbfb]/50">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <a
        href={viceResell.community.href}
        target="_blank"
        rel="noreferrer"
        className="block rounded-2xl border border-[#a39d93]/40 bg-[#a39d93]/10 p-4 transition hover:bg-[#a39d93]/20"
      >
        <h3 className="text-sm font-extrabold text-[#d7d4d0]">{viceResell.community.heading}</h3>
        <span className="mt-1 inline-block font-mono text-[11px] text-[#757e8a]">whop.com/vice-resell →</span>
      </a>

      <div className="rounded-2xl border border-[#aba59c]/35 bg-white/5 p-3">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#757e8a]">
          {viceResell.earnings.heading}
        </p>
        <p className="text-lg font-extrabold text-[#aba59c]">{viceResell.earnings.value}</p>
        <Image
          src={viceResell.earnings.src}
          alt={`${viceResell.earnings.heading} — ${viceResell.earnings.value}`}
          width={1024}
          height={404}
          className="mt-2 w-full rounded-lg bg-white"
          sizes="400px"
        />
        <p className="mt-2 text-xs leading-relaxed text-[#fbfbfb]/65">{viceResell.earnings.body}</p>
      </div>

      <p className="text-sm leading-relaxed text-[#fbfbfb]/80">{viceResell.blocks[0].body}</p>

      <a
        href="/cv"
        className="inline-block rounded-full border border-[#757e8a]/50 px-4 py-2 text-center font-mono text-xs text-[#757e8a] transition hover:bg-[#757e8a] hover:text-[#18191c]"
      >
        the rest is in the CV →
      </a>
    </motion.aside>
  );
}
