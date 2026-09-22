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
  ViceResellRoom,
} from "@/components/rooms";
import ControlsLegend from "@/components/ControlsLegend";
import ViceResellPanel from "@/components/ViceResellPanel";
import CampusPanel from "@/components/CampusPanel";
import GalleryPanel from "@/components/GalleryPanel";
import HobbiesPanel from "@/components/HobbiesPanel";
import HatMark from "@/components/HatMark";
import Intro from "@/components/Intro";
import LofiToggle from "@/components/LofiToggle";
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

const Street3D = dynamic(() => import("@/components/Street3D"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#8fd0ff] font-mono text-sm text-white">
      Arriving…
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

/** rooms whose panel is already open when you walk in */
const GREETS: SceneId[] = ["factory", "campus"];

const CONTENT: Record<string, ReactNode> = {
  "front-desk": <AboutRoom />,
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
  /** the lobby stays behind the intro card until the visitor chooses to play */
  const [entered, setEntered] = useState(false);
  const [scene, setScene] = useState<SceneId | null>(null);
  /** the scene's own panel, opened from the stand inside the room — not fixed;
   *  these two rooms greet you with it open instead */
  const [panel, setPanel] = useState(false);
  const api = useRef<LobbyApi>({});
  const open = stations.find((s) => s.id === openId) ?? null;
  const close = useCallback(() => setOpenId(null), []);
  const onMove = useCallback(() => setMoved(true), []);
  const onOpen = useCallback((id: string) => {
    const s = stations.find((v) => v.id === id);
    const next = s?.kind === "scene" ? SCENES[id] : undefined;
    if (!next) return setOpenId(id);
    setScene(next);
    setNear(null);
    setPanel(GREETS.includes(next));
  }, []);
  const openPanel = useCallback(() => setPanel(true), []);
  const closePanel = useCallback(() => setPanel(false), []);
  const leaveScene = useCallback(() => {
    setPanel(false);
    setScene(null);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!entered && !scene) return;
      if (e.key === "Escape") {
        if (openId) return close();
        if (panel) return closePanel();
        return leaveScene();
      }
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
  }, [close, closePanel, entered, leaveScene, openId, panel, scene]);

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
          entered && (
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1.14, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.1, ease: "easeOut" }}
            >
              <Lobby3D api={api} onNear={setNear} onOpen={onOpen} onMove={onMove} moved={moved} />
            </motion.div>
          )
        )}

        {!moved && !scene && entered && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="pointer-events-none absolute left-1/2 top-28 z-20 -translate-x-1/2 rounded-full border-2 border-white bg-white/90 px-5 py-2.5 text-sm font-semibold text-brass shadow-[0_6px_0_rgba(107,91,143,0.15)]"
          >
            Walk to the glowing ring to open the career log
          </motion.div>
        )}

        <AnimatePresence>
          {!entered && !scene && (
            <motion.div
              key="street"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="absolute inset-0 z-30"
            >
              <Street3D onEnter={() => setEntered(true)} />
              <Intro />
            </motion.div>
          )}
        </AnimatePresence>

        {/* mounted once so the loop survives walking between rooms */}
        <div
          className={`pointer-events-none absolute z-30 transition-all ${
            scene
              ? panel
                ? "bottom-6 right-4 max-sm:hidden sm:right-[25.5rem]"
                : "bottom-6 right-6"
              : "right-6 top-24"
          }`}
        >
          <LofiToggle />
        </div>

        {!scene && entered && (
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

        {/* the only HUD column: sections with their number keys, then the controls */}
        {!scene && entered && (
        <aside className="pointer-events-none absolute right-6 top-40 z-20 flex w-60 flex-col gap-2">
          <div className="pointer-events-auto rounded-2xl border-2 border-white bg-white/85 p-3 shadow-[0_6px_0_rgba(107,91,143,0.12)]">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-ink/45">Sections</p>
            <ul className="space-y-1">
              {stations.map((s, i) => (
                <li key={s.id}>
                  <button
                    onClick={() => api.current.goTo?.(s.id)}
                    className={`flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-left font-mono text-[11px] font-semibold transition ${
                      near === s.id ? "bg-brass text-white" : "text-ink/70 hover:bg-brass/10 hover:text-brass"
                    }`}
                  >
                    <kbd
                      className={`rounded-md border-2 px-1.5 py-0.5 text-[10px] ${
                        near === s.id ? "border-white/40 text-white" : "border-brass/20 bg-white text-brass"
                      }`}
                    >
                      {i + 1}
                    </kbd>
                    <span className="flex-1 truncate">{s.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {moved && <ControlsLegend />}
        </aside>
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
