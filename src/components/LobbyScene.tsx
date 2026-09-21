"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LobbyArt from "@/components/LobbyArt";
import { AboutRoom, ConciergeRoom, ContactRoom, ExperienceRoom, ProjectsRoom } from "@/components/rooms";
import { profile } from "@/data/cv";

type Room = {
  id: string;
  object: string;
  title: string;
  subtitle: string;
  hint: string;
  /** position in % of the scene box */
  x: number;
  y: number;
  content: ReactNode;
};

const ROOMS: Room[] = [
  {
    id: "front-desk",
    object: "Front desk",
    title: "Check in",
    subtitle: "Who I am and what I'm for",
    hint: "The engineer behind the counter",
    x: 44,
    y: 71,
    content: <AboutRoom />,
  },
  {
    id: "key-rack",
    object: "Key rack",
    title: "The integration board",
    subtitle: "Every system I've wired to another",
    hint: "One key per system",
    x: 15.6,
    y: 32.5,
    content: <ProjectsRoom />,
  },
  {
    id: "terminal",
    object: "PMS terminal",
    title: "Career log",
    subtitle: "Roles, shipped work, stack",
    hint: "Opera Cloud, logged in",
    x: 66,
    y: 48.5,
    content: <ExperienceRoom />,
  },
  {
    id: "phone",
    object: "Voice line",
    title: "Ask the agent",
    subtitle: "A scripted version of what I built at Room Mate",
    hint: "Pick up the receiver",
    x: 34.2,
    y: 55,
    content: <ConciergeRoom />,
  },
  {
    id: "bell",
    object: "Service bell",
    title: "Get in touch",
    subtitle: "Email, phone, CV",
    hint: "Ring for service",
    x: 54.7,
    y: 56,
    content: <ContactRoom />,
  },
];

function Hotspot({ room, onOpen }: { room: Room; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      aria-label={`${room.object}: ${room.title}`}
      className="group absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
      style={{ left: `${room.x}%`, top: `${room.y}%` }}
    >
      <span className="relative flex h-10 w-10 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brass/25 [animation-duration:2.6s]" />
        <span className="absolute inline-flex h-7 w-7 rounded-full border border-brass/50" />
        <span className="relative inline-flex h-4 w-4 rounded-full border border-[#f4dfae] bg-brass shadow-[0_0_14px_4px_rgba(216,178,106,0.55)] transition group-hover:scale-125 group-focus-visible:scale-125" />
      </span>
      <span className="pointer-events-none absolute left-1/2 top-11 w-max max-w-[220px] -translate-x-1/2 rounded-lg border border-brass/30 bg-[#0b1223]/95 px-3 py-2 text-left opacity-0 shadow-xl shadow-black/50 backdrop-blur transition group-hover:opacity-100 group-focus-visible:opacity-100">
        <span className="block font-mono text-[10px] uppercase tracking-widest text-teal">{room.object}</span>
        <span className="block text-sm font-semibold text-brass">{room.title}</span>
        <span className="block text-xs text-white/60">{room.subtitle}</span>
      </span>
    </button>
  );
}

function Dust() {
  const motes = Array.from({ length: 18 }, (_, i) => ({
    left: (i * 37) % 100,
    top: 30 + ((i * 53) % 60),
    dur: 9 + ((i * 7) % 11),
    delay: (i * 1.7) % 9,
    size: 1 + (i % 3),
  }));
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {motes.map((m, i) => (
        <span
          key={i}
          className="dust absolute rounded-full bg-brass/60"
          style={{
            left: `${m.left}%`,
            top: `${m.top}%`,
            width: m.size,
            height: m.size,
            animationDuration: `${m.dur}s`,
            animationDelay: `${m.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function LobbyScene() {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = ROOMS.find((r) => r.id === openId) ?? null;

  const close = useCallback(() => setOpenId(null), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      const n = Number(e.key);
      if (n >= 1 && n <= ROOMS.length) setOpenId(ROOMS[n - 1].id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  return (
    <div className="relative min-h-dvh lobby-vignette">
      {/* ---------------- desktop / tablet: the lobby ---------------- */}
      <div className="relative hidden h-dvh w-full items-center justify-center overflow-hidden md:flex">
        {/* fixed 16:9 stage so SVG art and HTML hotspots always share coordinates */}
        <div className="relative aspect-video max-h-dvh w-full max-w-[calc(100dvh*16/9)]">
          <LobbyArt />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 floor-grid opacity-40" />
          <Dust />

          {ROOMS.map((r) => (
            <Hotspot key={r.id} room={r} onOpen={() => setOpenId(r.id)} />
          ))}
        </div>

        <header className="absolute left-0 right-0 top-0 flex items-start justify-between p-6">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-brass">{profile.name}</h1>
            <p className="font-mono text-xs uppercase tracking-widest text-white/50">{profile.title}</p>
          </div>
          <nav className="flex items-center gap-3 text-xs">
            <span className="hidden font-mono text-white/35 lg:inline">press 1–5</span>
            <a
              href="/cv"
              className="rounded-lg border border-brass/35 px-3 py-1.5 font-mono text-brass/90 transition hover:bg-brass/15"
            >
              Skip the lobby → CV
            </a>
          </nav>
        </header>

        <footer className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-center gap-2 p-5">
          {ROOMS.map((r, i) => (
            <button
              key={r.id}
              onClick={() => setOpenId(r.id)}
              className="rounded-full border border-white/10 bg-black/40 px-3 py-1.5 font-mono text-[11px] text-white/60 backdrop-blur transition hover:border-brass/40 hover:text-brass"
            >
              <span className="mr-1.5 text-brass/70">{i + 1}</span>
              {r.object}
            </button>
          ))}
        </footer>
      </div>

      {/* ---------------- mobile: linear mode ---------------- */}
      <div className="md:hidden">
        <div className="space-y-2 px-5 pb-4 pt-8">
          <h1 className="text-2xl font-semibold text-brass">{profile.name}</h1>
          <p className="font-mono text-xs uppercase tracking-widest text-white/50">{profile.title}</p>
          <p className="pt-2 text-sm leading-relaxed text-white/75">{profile.tagline}</p>
        </div>
        <div className="space-y-3 px-5 pb-10">
          {ROOMS.map((r) => (
            <button
              key={r.id}
              onClick={() => setOpenId(r.id)}
              className="block w-full rounded-xl border border-brass/25 bg-white/[0.03] p-4 text-left transition active:scale-[0.99]"
            >
              <span className="font-mono text-[10px] uppercase tracking-widest text-teal">{r.object}</span>
              <span className="mt-0.5 block text-base font-semibold text-brass">{r.title}</span>
              <span className="block text-xs text-white/60">{r.subtitle}</span>
            </button>
          ))}
          <a
            href="/cv"
            className="block rounded-xl border border-white/10 p-4 text-center font-mono text-xs text-white/60"
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
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm md:items-center md:p-8"
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
              className="max-h-[92dvh] w-full max-w-4xl overflow-y-auto rounded-t-2xl border border-brass/25 bg-[#0a1020] p-6 shadow-2xl shadow-black/60 md:rounded-2xl md:p-8"
            >
              <div className="mb-5 flex items-start justify-between gap-6">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-widest text-teal">{open.object}</p>
                  <h2 className="text-2xl font-semibold text-brass">{open.title}</h2>
                  <p className="text-sm text-white/55">{open.subtitle}</p>
                </div>
                <button
                  onClick={close}
                  aria-label="Close"
                  className="rounded-lg border border-white/15 px-3 py-1.5 font-mono text-xs text-white/60 transition hover:border-brass/40 hover:text-brass"
                >
                  esc ✕
                </button>
              </div>
              {open.content}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
