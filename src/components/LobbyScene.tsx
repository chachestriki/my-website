"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import {
  AboutRoom,
  CareerRoom,
  ConciergeRoom,
  ContactRoom,
  EducationRoom,
  HobbiesRoom,
  ProjectsRoom,
  ViceResellRoom,
} from "@/components/rooms";
import ControlsLegend from "@/components/ControlsLegend";
import DoorQuiz from "@/components/DoorQuiz";
import ViceResellPanel from "@/components/ViceResellPanel";
import CampusPanel from "@/components/CampusPanel";
import GalleryPanel from "@/components/GalleryPanel";
import HobbiesPanel from "@/components/HobbiesPanel";
import HatMark from "@/components/HatMark";
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

const Factory3D = dynamic(() => import("@/components/Factory3D"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#141a2b] font-mono text-sm text-[#00e5ff]">
      Clocking in…
    </div>
  ),
});

const Campus3D = dynamic(() => import("@/components/Campus3D"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#7fd0ff] font-mono text-sm text-white">
      Boarding the flight…
    </div>
  ),
});

const Gallery3D = dynamic(() => import("@/components/Gallery3D"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#2a1b2e] font-mono text-sm text-[#ffc01f]">
      Hanging the frames…
    </div>
  ),
});

const Hobbies3D = dynamic(() => import("@/components/Hobbies3D"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#3a2233] font-mono text-sm text-[#ff2fa0]">
      Plugging in…
    </div>
  ),
});

type SceneId = "factory" | "campus" | "gallery" | "hobbies";

/** which station opens which full 3D scene */
const SCENES: Record<string, SceneId> = {
  factory: "factory",
  study: "campus",
  career: "gallery",
  hobbies: "hobbies",
};

const CONTENT: Record<string, ReactNode> = {
  "front-desk": <AboutRoom />,
  "key-rack": <ProjectsRoom />,
  career: <CareerRoom />,
  phone: <ConciergeRoom />,
  bell: <ContactRoom />,
  study: <EducationRoom />,
  factory: <ViceResellRoom />,
  hobbies: <HobbiesRoom />,
};

export default function LobbyScene() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [near, setNear] = useState<string | null>(null);
  const [moved, setMoved] = useState(false);
  const [scene, setScene] = useState<SceneId | null>(null);
  /** the scene's own panel, opened from the stand inside the room — not fixed */
  const [panel, setPanel] = useState(false);
  /** the door whose keycard question is on screen, and the doors already answered */
  const [locked, setLocked] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [quizSeed, setQuizSeed] = useState(0);

  const api = useRef<LobbyApi>({});
  const open = stations.find((s) => s.id === openId) ?? null;
  const close = useCallback(() => setOpenId(null), []);
  const onMove = useCallback(() => setMoved(true), []);
  const enterScene = useCallback((id: string) => {
    setScene(SCENES[id] ?? null);
    setNear(null);
    setPanel(false);
    setLocked(null);
  }, []);
  const onOpen = useCallback(
    (id: string) => {
      const s = stations.find((v) => v.id === id);
      if (s?.kind === "scene") {
        if (unlocked.includes(id)) return enterScene(id);
        setQuizSeed(Math.floor(Math.random() * 1000));
        return setLocked(id);
      }
      setOpenId(id);
    },
    [enterScene, unlocked],
  );
  const unlockDoor = useCallback(() => {
    if (!locked) return;
    setUnlocked((prev) => (prev.includes(locked) ? prev : [...prev, locked]));
    enterScene(locked);
  }, [enterScene, locked]);
  const openPanel = useCallback(() => setPanel(true), []);
  const closePanel = useCallback(() => setPanel(false), []);
  const leaveScene = useCallback(() => {
    setScene(null);
    setPanel(false);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (locked) return setLocked(null);
        if (openId) return close();
        if (panel) return closePanel();
        return leaveScene();
      }
      if (locked) return;
      const n = Number(e.key);
      if (scene && n === 1) return setPanel((p) => !p);
      if (!scene && n >= 1 && n <= stations.length) return api.current.goTo?.(stations[n - 1].id);
      /* screen-relative: +right walks right on screen, +forward walks away from the camera */
      const nudge: Record<string, [number, number]> = {
        ArrowLeft: [-3, 0],
        ArrowRight: [3, 0],
        ArrowUp: [0, 3],
        ArrowDown: [0, -3],
        a: [-3, 0],
        d: [3, 0],
        w: [0, 3],
        s: [0, -3],
      };
      const v = nudge[e.key];
      if (v) {
        e.preventDefault();
        api.current.nudge?.(v[0], v[1]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close, closePanel, leaveScene, locked, openId, panel, scene]);

  const lockedStation = stations.find((s) => s.id === locked) ?? null;

  return (
    <div className="relative min-h-dvh lobby-vignette">
      {/* ---------------- desktop / tablet: the walkable 3D lobby ---------------- */}
      <div className="relative hidden h-dvh w-full overflow-hidden md:block">
        {scene ? (
          <motion.div
            key={scene}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            {scene === "factory" && (
              <Factory3D api={api} onMove={onMove} onDesk={openPanel} panelOpen={panel} />
            )}
            {scene === "campus" && (
              <Campus3D api={api} onMove={onMove} onDesk={openPanel} panelOpen={panel} />
            )}
            {scene === "gallery" && (
              <Gallery3D api={api} onMove={onMove} onDesk={openPanel} panelOpen={panel} />
            )}
            {scene === "hobbies" && (
              <Hobbies3D api={api} onMove={onMove} onDesk={openPanel} panelOpen={panel} />
            )}

            <AnimatePresence>
              {panel && scene === "factory" && <ViceResellPanel onClose={closePanel} />}
              {panel && scene === "campus" && <CampusPanel onClose={closePanel} />}
              {panel && scene === "gallery" && <GalleryPanel onClose={closePanel} />}
              {panel && scene === "hobbies" && <HobbiesPanel onClose={closePanel} />}
            </AnimatePresence>

            {!panel && (
              <div className="pointer-events-none absolute bottom-6 left-1/2 z-20 -translate-x-1/2 rounded-full border-2 border-white/70 bg-black/45 px-4 py-2 font-mono text-[11px] font-semibold text-white">
                walk to the stand · or press 1 to read
              </div>
            )}

            <button
              onClick={leaveScene}
              className={`absolute left-6 top-6 z-30 rounded-full border-2 px-4 py-2 font-mono text-xs font-semibold transition ${
                scene === "factory"
                  ? "border-[#00e5ff]/60 bg-[#141a2b]/80 text-[#00e5ff] hover:bg-[#00e5ff] hover:text-[#141a2b]"
                  : "border-white bg-white/85 text-brass hover:bg-brass hover:text-white"
              }`}
            >
              ← back to the lobby
            </button>
          </motion.div>
        ) : (
          <Lobby3D api={api} onNear={setNear} onOpen={onOpen} onMove={onMove} />
        )}

        {!moved && !scene && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="pointer-events-none absolute bottom-24 left-1/2 z-20 -translate-x-1/2 rounded-full border-2 border-white bg-white/90 px-5 py-2.5 text-sm font-semibold text-brass shadow-[0_6px_0_rgba(107,91,143,0.15)]"
          >
            Click the floor to walk · get close to something to open it
          </motion.div>
        )}

        {!scene && <ControlsLegend />}

        {!scene && (
        <header className="pointer-events-none absolute left-0 right-0 top-0 z-20 flex items-start justify-between p-6">
          <div className="pointer-events-auto flex items-center gap-3 rounded-2xl border-2 border-white bg-white/85 px-4 py-2.5 shadow-[0_6px_0_rgba(107,91,143,0.12)]">
            <HatMark className="h-9 w-9 shrink-0" />
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-brass">{profile.name}</h1>
              <p className="font-mono text-[11px] uppercase tracking-widest text-ink/50">{profile.title}</p>
            </div>
          </div>
          <nav className="pointer-events-auto flex items-center gap-3 text-xs">
            <span className="rounded-full border-2 border-white bg-white/85 px-4 py-2 font-mono font-semibold text-teal shadow-[0_4px_0_rgba(107,91,143,0.12)]">
              Currently 2026
            </span>
            <a
              href="/cv"
              className="rounded-full border-2 border-white bg-white/85 px-4 py-2 font-mono font-semibold text-brass shadow-[0_4px_0_rgba(107,91,143,0.12)] transition hover:bg-white"
            >
              Skip the lobby → CV
            </a>
          </nav>
        </header>
        )}

        {!scene && (
        <footer className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-wrap items-center justify-center gap-2 p-5">
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
              {s.kind === "scene" && !unlocked.includes(s.id) && (
                <span className={`ml-1.5 text-[9px] ${near === s.id ? "text-white/70" : "text-ink/40"}`}>
                  locked
                </span>
              )}
            </button>
          ))}
        </footer>
        )}
      </div>

      {/* ---------------- mobile: linear mode ---------------- */}
      <div className="md:hidden">
        <div className="space-y-2 px-5 pb-4 pt-8">
          <HatMark className="h-10 w-10" />
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

      {/* ---------------- the door's keycard question ---------------- */}
      <AnimatePresence>
        {lockedStation && (
          <DoorQuiz
            key={lockedStation.id}
            stationId={lockedStation.id}
            doorName={lockedStation.title}
            seed={quizSeed}
            onUnlock={unlockDoor}
            onCancel={() => setLocked(null)}
          />
        )}
      </AnimatePresence>

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
