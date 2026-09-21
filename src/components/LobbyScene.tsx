"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { AboutRoom, ConciergeRoom, ContactRoom, ExperienceRoom, ProjectsRoom } from "@/components/rooms";
import ControlsLegend from "@/components/ControlsLegend";
import { stations } from "@/data/stations";
import { profile } from "@/data/cv";
import type { LobbyApi } from "@/components/Lobby3D";

const Lobby3D = dynamic(() => import("@/components/Lobby3D"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center font-mono text-sm text-brass">
      Opening the lobby…
    </div>
  ),
});

const CONTENT: Record<string, ReactNode> = {
  "front-desk": <AboutRoom />,
  "key-rack": <ProjectsRoom />,
  terminal: <ExperienceRoom />,
  phone: <ConciergeRoom />,
  bell: <ContactRoom />,
};

export default function LobbyScene() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [near, setNear] = useState<string | null>(null);
  const [moved, setMoved] = useState(false);

  const api = useRef<LobbyApi>({});
  const open = stations.find((s) => s.id === openId) ?? null;
  const close = useCallback(() => setOpenId(null), []);
  const onMove = useCallback(() => setMoved(true), []);
  const onOpen = useCallback((id: string) => setOpenId(id), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return close();
      const n = Number(e.key);
      if (n >= 1 && n <= stations.length) return api.current.goTo?.(stations[n - 1].id);
      const nudge: Record<string, [number, number]> = {
        ArrowLeft: [-3, 0],
        ArrowRight: [3, 0],
        ArrowUp: [0, -3],
        ArrowDown: [0, 3],
        a: [-3, 0],
        d: [3, 0],
        w: [0, -3],
        s: [0, 3],
      };
      const v = nudge[e.key];
      if (v) {
        e.preventDefault();
        api.current.nudge?.(v[0], v[1]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  return (
    <div className="relative min-h-dvh lobby-vignette">
      {/* ---------------- desktop / tablet: the walkable 3D lobby ---------------- */}
      <div className="relative hidden h-dvh w-full md:block">
        <Lobby3D api={api} onNear={setNear} onOpen={onOpen} onMove={onMove} />

        {!moved && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="pointer-events-none absolute bottom-24 left-1/2 -translate-x-1/2 rounded-full border-2 border-white bg-white/90 px-5 py-2.5 text-sm font-semibold text-brass shadow-[0_6px_0_rgba(107,91,143,0.15)]"
          >
            Click the floor to walk · get close to something to open it
          </motion.div>
        )}

        <ControlsLegend />

        <header className="pointer-events-none absolute left-0 right-0 top-0 flex items-start justify-between p-6">
          <div className="pointer-events-auto rounded-2xl border-2 border-white bg-white/85 px-4 py-2.5 shadow-[0_6px_0_rgba(107,91,143,0.12)]">
            <h1 className="text-xl font-extrabold tracking-tight text-brass">{profile.name}</h1>
            <p className="font-mono text-[11px] uppercase tracking-widest text-ink/50">{profile.title}</p>
          </div>
          <nav className="pointer-events-auto flex items-center gap-3 text-xs">
            <a
              href="/cv"
              className="rounded-full border-2 border-white bg-white/85 px-4 py-2 font-mono font-semibold text-brass shadow-[0_4px_0_rgba(107,91,143,0.12)] transition hover:bg-white"
            >
              Skip the lobby → CV
            </a>
          </nav>
        </header>

        <footer className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-center gap-2 p-5">
          {stations.map((s, i) => (
            <button
              key={s.id}
              onClick={() => api.current.goTo?.(s.id)}
              className={`pointer-events-auto rounded-full border-2 px-4 py-2 font-mono text-[11px] font-semibold shadow-[0_4px_0_rgba(107,91,143,0.12)] transition ${
                near === s.id
                  ? "border-brass bg-brass text-white"
                  : "border-white bg-white/85 text-ink/70 hover:text-brass"
              }`}
            >
              <span className={`mr-1.5 ${near === s.id ? "text-white/70" : "text-brass/70"}`}>{i + 1}</span>
              {s.object}
            </button>
          ))}
        </footer>
      </div>

      {/* ---------------- mobile: linear mode ---------------- */}
      <div className="md:hidden">
        <div className="space-y-2 px-5 pb-4 pt-8">
          <h1 className="text-2xl font-extrabold text-brass">{profile.name}</h1>
          <p className="font-mono text-xs uppercase tracking-widest text-ink/50">{profile.title}</p>
          <p className="pt-2 text-sm leading-relaxed text-ink/75">{profile.tagline}</p>
        </div>
        <div className="space-y-3 px-5 pb-10">
          {stations.map((s) => (
            <button
              key={s.id}
              onClick={() => setOpenId(s.id)}
              className="block w-full rounded-2xl border-2 border-white bg-card p-4 text-left shadow-[0_5px_0_rgba(107,91,143,0.12)] transition active:scale-[0.99]"
            >
              <span className="font-mono text-[10px] uppercase tracking-widest text-teal">{s.object}</span>
              <span className="mt-0.5 block text-base font-bold text-brass">{s.title}</span>
              <span className="block text-xs text-ink/60">{s.subtitle}</span>
            </button>
          ))}
          <a
            href="/cv"
            className="block rounded-2xl border-2 border-white bg-white/70 p-4 text-center font-mono text-xs text-ink/60"
          >
            Plain CV →
          </a>
        </div>
      </div>

      {/* ---------------- room overlay ---------------- */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-plum/35 p-0 backdrop-blur-sm md:items-center md:p-8"
            onClick={close}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={open.title}
              initial={{ y: 40, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 30, opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[92dvh] w-full max-w-4xl overflow-y-auto rounded-t-3xl border-4 border-white bg-card p-6 shadow-[0_18px_0_rgba(107,91,143,0.18)] md:rounded-3xl md:p-8"
            >
              <div className="mb-5 flex items-start justify-between gap-6">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-widest text-teal">{open.object}</p>
                  <h2 className="text-2xl font-extrabold text-brass">{open.title}</h2>
                  <p className="text-sm text-ink/55">{open.subtitle}</p>
                </div>
                <button
                  onClick={close}
                  aria-label="Close"
                  className="rounded-full border-2 border-brass/30 px-3 py-1.5 font-mono text-xs font-semibold text-brass transition hover:bg-brass hover:text-white"
                >
                  esc ✕
                </button>
              </div>
              {CONTENT[open.id]}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
