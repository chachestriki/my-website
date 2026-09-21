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
      className="absolute right-0 top-0 z-30 flex h-full w-full max-w-md flex-col gap-5 overflow-y-auto border-l-4 border-[#ff2fa0] bg-[#141a2b]/95 p-6 text-[#e8f0ff] shadow-[-18px_0_40px_rgba(0,0,0,0.45)] backdrop-blur"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-[#00e5ff]">Factory floor</p>
          <h2 className="text-2xl font-extrabold text-[#ff2fa0]">{viceResell.title}</h2>
          <p className="text-sm text-[#e8f0ff]/60">{viceResell.role}</p>
        </div>
        <button
          onClick={onClose}
          aria-label="Back to the lobby"
          className="rounded-full border-2 border-[#00e5ff]/50 px-3 py-1.5 font-mono text-xs font-semibold text-[#00e5ff] transition hover:bg-[#00e5ff] hover:text-[#141a2b]"
        >
          esc ✕
        </button>
      </div>

      <p className="text-sm leading-relaxed text-[#e8f0ff]/80">{viceResell.intro}</p>

      <div className="grid grid-cols-3 gap-2">
        {viceResell.stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-[#00e5ff]/25 bg-white/5 p-3 text-center">
            <p className="text-base font-extrabold text-[#b6ff3d]">{s.value}</p>
            <p className="font-mono text-[9px] uppercase leading-tight tracking-wider text-[#e8f0ff]/50">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {viceResell.blocks.map((b) => (
        <div key={b.heading}>
          <h3 className="font-mono text-[11px] uppercase tracking-widest text-[#00e5ff]">{b.heading}</h3>
          <p className="mt-1 text-sm leading-relaxed text-[#e8f0ff]/80">{b.body}</p>
        </div>
      ))}

      <div>
        <h3 className="font-mono text-[11px] uppercase tracking-widest text-[#00e5ff]">Photos</h3>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {viceResell.photos.map((p) => (
            <div
              key={p.id}
              className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-[#ff2fa0]/40 bg-white/5"
            >
              {p.src ? (
                <Image src={p.src} alt={p.caption} fill className="object-cover" sizes="200px" />
              ) : (
                <span className="px-2 text-center font-mono text-[10px] uppercase tracking-wider text-[#e8f0ff]/45">
                  {p.caption}
                </span>
              )}
            </div>
          ))}
        </div>
        <p className="mt-2 font-mono text-[10px] text-[#e8f0ff]/35">
          Drop images in /public/vice-resell and point each slot at them in src/data/viceResell.ts
        </p>
      </div>
    </motion.aside>
  );
}
