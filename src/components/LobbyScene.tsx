"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Avatar from "@/components/Avatar";
import LobbyArt from "@/components/LobbyArt";
import { AboutRoom, ConciergeRoom, ContactRoom, ExperienceRoom, ProjectsRoom } from "@/components/rooms";
import { profile } from "@/data/cv";

type Room = {
  id: string;
  object: string;
  title: string;
  subtitle: string;
  /** the object's pin, in % of the 16:9 stage */
  x: number;
  y: number;
  /** where the character has to stand to trigger it */
  stand: { x: number; y: number };
  content: ReactNode;
};

/** Walkable floor, in % of the stage. */
const FLOOR = { top: 81, bottom: 96, left: 5, right: 95 };
/** How close (in stage %, x compressed) the character must get. */
const TRIGGER_RADIUS = 5;
/** Stage %-units per second. */
const SPEED = 26;

const ROOMS: Room[] = [
  {
    id: "front-desk",
    object: "Recepción",
    title: "Check in",
    subtitle: "Who I am and what I'm for",
    x: 44,
    y: 62,
    stand: { x: 44, y: 93 },
    content: <AboutRoom />,
  },
  {
    id: "key-rack",
    object: "Key rack",
    title: "The integration board",
    subtitle: "Every system I've wired to another",
    x: 15.6,
    y: 32.5,
    stand: { x: 11, y: 85 },
    content: <ProjectsRoom />,
  },
  {
    id: "terminal",
    object: "PMS terminal",
    title: "Career log",
    subtitle: "Roles, shipped work, stack",
    x: 66,
    y: 48.5,
    stand: { x: 80, y: 85 },
    content: <ExperienceRoom />,
  },
  {
    id: "phone",
    object: "Voice line",
    title: "Ask the agent",
    subtitle: "A scripted version of what I built at Room Mate",
    x: 34.2,
    y: 55,
    stand: { x: 26, y: 89 },
    content: <ConciergeRoom />,
  },
  {
    id: "bell",
    object: "Service bell",
    title: "Get in touch",
    subtitle: "Email, phone, CV",
    x: 54.7,
    y: 56,
    stand: { x: 62, y: 89 },
    content: <ContactRoom />,
  },
];

/** x is compressed because the stage is 16:9 — keeps the trigger circle round-ish. */
function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
  const dx = (a.x - b.x) * 0.56;
  const dy = a.y - b.y;
  return Math.hypot(dx, dy);
}

function clampToFloor(p: { x: number; y: number }) {
  return {
    x: Math.min(FLOOR.right, Math.max(FLOOR.left, p.x)),
    y: Math.min(FLOOR.bottom, Math.max(FLOOR.top, p.y)),
  };
}

export default function LobbyScene() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [pos, setPos] = useState({ x: 92, y: 95 });
  const [facing, setFacing] = useState<1 | -1>(1);
  const [walking, setWalking] = useState(false);
  const [near, setNear] = useState<string | null>(null);
  const [moved, setMoved] = useState(false);

  const target = useRef<{ x: number; y: number } | null>(null);
  const posRef = useRef(pos);
  const nearRef = useRef<string | null>(null);
  const armed = useRef(true);
  const hasMoved = useRef(false);

  const open = ROOMS.find((r) => r.id === openId) ?? null;
  const close = useCallback(() => setOpenId(null), []);

  const goTo = useCallback((p: { x: number; y: number }) => {
    const t = clampToFloor(p);
    target.current = t;
    hasMoved.current = true;
    setMoved(true);
    setWalking(true);
    if (Math.abs(t.x - posRef.current.x) > 0.4) setFacing(t.x > posRef.current.x ? 1 : -1);
  }, []);

  /* movement loop */
  useEffect(() => {
    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = target.current;

      if (t) {
        const cur = posRef.current;
        const dx = t.x - cur.x;
        const dy = t.y - cur.y;
        const d = Math.hypot(dx * 0.56, dy);
        if (d < 0.5) {
          target.current = null;
          setWalking(false);
        } else {
          const step = Math.min(1, (SPEED * dt) / d);
          const next = { x: cur.x + dx * step, y: cur.y + dy * step };
          posRef.current = next;
          setPos(next);
        }
      }

      // proximity
      const hit = ROOMS.find((r) => dist(posRef.current, r.stand) < TRIGGER_RADIUS) ?? null;
      const hitId = hit?.id ?? null;
      if (hitId !== nearRef.current) {
        nearRef.current = hitId;
        setNear(hitId);
        if (hitId === null) armed.current = true;
      }
      if (hitId && armed.current && hasMoved.current && !target.current) {
        armed.current = false;
        setOpenId(hitId);
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* keyboard: esc closes, 1-5 walk to a station, arrows nudge */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return close();
      const n = Number(e.key);
      if (n >= 1 && n <= ROOMS.length) return goTo(ROOMS[n - 1].stand);
      const nudge: Record<string, [number, number]> = {
        ArrowLeft: [-9, 0],
        ArrowRight: [9, 0],
        ArrowUp: [0, -6],
        ArrowDown: [0, 6],
        a: [-9, 0],
        d: [9, 0],
        w: [0, -6],
        s: [0, 6],
      };
      const v = nudge[e.key];
      if (v) {
        e.preventDefault();
        const from = target.current ?? posRef.current;
        goTo({ x: from.x + v[0], y: from.y + v[1] });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close, goTo]);

  const onStageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    goTo({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div className="relative min-h-dvh lobby-vignette">
      {/* ---------------- desktop / tablet: the walkable lobby ---------------- */}
      <div className="relative hidden h-dvh w-full items-center justify-center overflow-hidden md:flex">
        {/* fixed 16:9 stage so SVG art, floor pads and the character share coordinates */}
        <div
          className="relative aspect-video max-h-dvh w-full max-w-[calc(100dvh*16/9)] cursor-pointer select-none"
          onClick={onStageClick}
        >
          <LobbyArt />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 floor-grid opacity-40" />
          <Dust />

          {ROOMS.map((r) => (
            <Station key={r.id} room={r} active={near === r.id} onWalk={() => goTo(r.stand)} />
          ))}

          <Avatar x={pos.x} y={pos.y} facing={facing} walking={walking} />

          {!moved && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="pointer-events-none absolute left-1/2 top-[84%] -translate-x-1/2 rounded-full border border-brass/40 bg-black/60 px-4 py-2 font-mono text-xs text-brass backdrop-blur"
            >
              Click the floor to walk · get close to an object to open it
            </motion.div>
          )}
        </div>

        <header className="pointer-events-none absolute left-0 right-0 top-0 flex items-start justify-between p-6">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-brass">{profile.name}</h1>
            <p className="font-mono text-xs uppercase tracking-widest text-white/50">{profile.title}</p>
          </div>
          <nav className="pointer-events-auto flex items-center gap-3 text-xs">
            <span className="hidden font-mono text-white/35 lg:inline">1–5 / WASD</span>
            <a
              href="/cv"
              onClick={(e) => e.stopPropagation()}
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
              onClick={(e) => {
                e.stopPropagation();
                goTo(r.stand);
              }}
              className={`rounded-full border px-3 py-1.5 font-mono text-[11px] backdrop-blur transition ${
                near === r.id
                  ? "border-brass/70 bg-brass/20 text-brass"
                  : "border-white/10 bg-black/40 text-white/60 hover:border-brass/40 hover:text-brass"
              }`}
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
          <a href="/cv" className="block rounded-xl border border-white/10 p-4 text-center font-mono text-xs text-white/60">
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

function Station({ room, active, onWalk }: { room: Room; active: boolean; onWalk: () => void }) {
  return (
    <>
      {/* floor pad you can walk onto */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onWalk();
        }}
        aria-label={`Walk to ${room.object}: ${room.title}`}
        className="group absolute z-10 h-12 w-24 -translate-x-1/2 -translate-y-1/2 focus:outline-none"
        style={{ left: `${room.stand.x}%`, top: `${room.stand.y}%` }}
      >
        <span
          className={`absolute inset-0 rounded-[50%] border transition ${
            active ? "border-brass bg-brass/25" : "border-brass/45 bg-brass/10 group-hover:bg-brass/20"
          }`}
        />
        <span
          className={`absolute left-1/2 top-1/2 h-[120%] w-[112%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-brass/25 ${
            active ? "" : "animate-[pad-pulse_2.6s_ease-in-out_infinite]"
          }`}
        />
      </button>

      {/* label pinned to the object itself */}
      <div
        className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${room.x}%`, top: `${room.y}%` }}
      >
        <div
          className={`rounded-lg border px-2.5 py-1.5 text-center backdrop-blur transition ${
            active
              ? "border-brass/70 bg-[#0b1223]/95 shadow-lg shadow-black/50"
              : "border-brass/25 bg-[#0b1223]/70"
          }`}
        >
          <span className="block font-mono text-[10px] uppercase tracking-widest text-teal">{room.object}</span>
          <span className="block text-xs font-semibold text-brass">{room.title}</span>
        </div>
      </div>
    </>
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
