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

      <a
        href={viceResell.community.href}
        target="_blank"
        rel="noreferrer"
        className="block rounded-2xl border border-[#ff2fa0]/40 bg-[#ff2fa0]/10 p-4 transition hover:bg-[#ff2fa0]/20"
      >
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#b6ff3d]">
          Community · {viceResell.community.rating} ★ · {viceResell.community.ratings}
        </p>
        <h3 className="mt-1 text-sm font-extrabold text-[#ff8fd0]">{viceResell.community.heading}</h3>
        <p className="mt-1 text-sm leading-relaxed text-[#e8f0ff]/80">{viceResell.community.body}</p>
        <span className="mt-2 inline-block font-mono text-[11px] text-[#00e5ff]">whop.com/vice-resell →</span>
      </a>

      <div className="rounded-2xl border border-[#b6ff3d]/35 bg-white/5 p-3">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#00e5ff]">
          {viceResell.earnings.heading}
        </p>
        <p className="text-lg font-extrabold text-[#b6ff3d]">{viceResell.earnings.value}</p>
        <Image
          src={viceResell.earnings.src}
          alt={`${viceResell.earnings.heading} — ${viceResell.earnings.value}`}
          width={1024}
          height={404}
          className="mt-2 w-full rounded-lg bg-white"
          sizes="400px"
        />
        <p className="mt-2 text-xs leading-relaxed text-[#e8f0ff]/65">{viceResell.earnings.body}</p>
      </div>

      {viceResell.blocks.map((b) => (
        <div key={b.heading}>
          <h3 className="font-mono text-[11px] uppercase tracking-widest text-[#00e5ff]">{b.heading}</h3>
          <p className="mt-1 text-sm leading-relaxed text-[#e8f0ff]/80">{b.body}</p>
        </div>
      ))}

      <div>
        <h3 className="font-mono text-[11px] uppercase tracking-widest text-[#00e5ff]">What members say</h3>
        <div className="mt-2 space-y-2">
          {viceResell.testimonials.map((t) => (
            <figure key={t.author} className="rounded-2xl border border-[#00e5ff]/20 bg-white/5 p-3">
              <blockquote className="text-sm leading-relaxed text-[#e8f0ff]/85">“{t.quote}”</blockquote>
              <figcaption className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[#b6ff3d]">
                {t.author}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-mono text-[11px] uppercase tracking-widest text-[#00e5ff]">Photos</h3>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {viceResell.photos.map((p) => (
            <div
              key={p.id}
              className="relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-xl border-2 border-[#ff2fa0]/40 bg-white/5"
            >
              {p.src ? (
                <>
                  <Image src={p.src} alt={p.caption} fill className="object-cover" sizes="200px" />
                  <span className="absolute inset-x-0 bottom-0 bg-black/55 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-white">
                    {p.caption}
                  </span>
                </>
              ) : (
                <span className="px-2 text-center font-mono text-[10px] uppercase tracking-wider text-[#e8f0ff]/45">
                  {p.caption}
                </span>
              )}
            </div>
          ))}
        </div>

      </div>
    </motion.aside>
  );
}
