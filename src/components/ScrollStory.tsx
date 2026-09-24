"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import SiteNav from "@/components/SiteNav";
import AgentChat from "@/components/AgentChat";
import { education, profile, roles, skills } from "@/data/cv";
import type { FigureId } from "@/components/StoryFigures";

const StoryFigures = dynamic(() => import("@/components/StoryFigures"), { ssr: false });
const HeroMonument = dynamic(() => import("@/components/HeroMonument"), { ssr: false });

type Theme = { bg: string; fg: string; accent: string; dark: boolean };

type Chapter = {
  id: string;
  nav: string;
  figure: FigureId;
  theme: Theme;
  eyebrow: string;
  title: string;
  lead: string;
  metrics?: { value: string; label: string }[];
  bullets?: string[];
  tags?: string[];
};

const BLACK: Theme = { bg: "#0a0b0d", fg: "#f4f2ee", accent: "#c9a260", dark: true };
const PURPLE: Theme = { bg: "#3a1f63", fg: "#f6f1ff", accent: "#d8b4fe", dark: true };
const DEEP_PURPLE: Theme = { bg: "#241241", fg: "#f2ecff", accent: "#c4a1f7", dark: true };
const YELLOW: Theme = { bg: "#e9c53c", fg: "#1b1608", accent: "#6b3f12", dark: false };
const TEAL: Theme = { bg: "#0d3b45", fg: "#eafaf8", accent: "#6fd7c6", dark: true };
const SLATE: Theme = { bg: "#1b1f25", fg: "#eceff3", accent: "#9fb4cc", dark: true };
const BONE: Theme = { bg: "#efece5", fg: "#14171a", accent: "#8a6a33", dark: false };
const INK: Theme = { bg: "#111316", fg: "#f2f1ef", accent: "#c9a260", dark: true };

const byId = (id: string) => {
  const role = roles.find((r) => r.id === id);
  if (!role) throw new Error(`unknown role ${id}`);
  return role;
};

const roleChapter = (
  id: string,
  figure: FigureId,
  theme: Theme,
  metrics?: Chapter["metrics"],
): Chapter => {
  const r = byId(id);
  return {
    id: r.id,
    nav: r.company,
    figure,
    theme,
    eyebrow: `${r.period} · ${r.role}`,
    title: r.company,
    lead: r.summary,
    metrics,
    bullets: r.highlights,
    tags: r.stack,
  };
};

const chapters: Chapter[] = [
  roleChapter("room-mate", "bridge", PURPLE, [
    { value: "4.5M", label: "guests reached" },
    { value: "100+", label: "hotels" },
    { value: "3 yrs", label: "of hospitality integrations" },
  ]),
  roleChapter("mastel", "ledger", DEEP_PURPLE),
  roleChapter("vice-resell", "garments", YELLOW, [
    { value: "6,000+", label: "users" },
    { value: "5.0 ★", label: "over 426 reviews" },
    { value: "3", label: "marketplaces automated" },
  ]),
  roleChapter("odyn", "wave", TEAL),
  roleChapter("lenovo", "rack", SLATE),
  {
    id: "education",
    nav: "Education",
    figure: "arc",
    theme: BONE,
    eyebrow: "Education",
    title: "Madrid and Texas, same arc",
    lead: education.map((e) => `${e.degree} — ${e.school}, ${e.place}.`).join(" "),
  },
  {
    id: "stack",
    nav: "Stack",
    figure: "lattice",
    theme: INK,
    eyebrow: "Toolkit",
    title: "What I build with",
    lead: "Backend-leaning, infrastructure-comfortable, and increasingly agent-shaped.",
    tags: skills.flatMap((s) => s.items),
  },
  {
    id: "agent",
    nav: "Ask the agent",
    figure: "rings",
    theme: SLATE,
    eyebrow: "Live demo",
    title: "Ask an agent that read the CV",
    lead: "An LLM grounded only in this site's data. Five questions per visit.",
  },
  {
    id: "contact",
    nav: "Contact",
    figure: "send",
    theme: BLACK,
    eyebrow: "Contact",
    title: "Let's talk",
    lead: `${profile.location} · open to the right conversation.`,
  },
];

const navLinks = [{ id: "top", label: "Top" }, ...chapters.map((c) => ({ id: c.id, label: c.nav }))];

/** scroll-driven portfolio: the page repaints and the pinned figure animates as each chapter scrubs by */
export default function ScrollStory() {
  const [figure, setFigure] = useState<FigureId | null>(null);
  const [onDark, setOnDark] = useState(true);
  const progress = useRef(0);
  const hero = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const ids = ["top", ...chapters.map((c) => c.id)];
    const figures: (FigureId | null)[] = [null, ...chapters.map((c) => c.figure)];
    const themes = [BLACK, ...chapters.map((c) => c.theme)];
    const root = document.documentElement;
    let frame = 0;

    const read = () => {
      frame = 0;
      const mid = window.innerHeight * 0.45;
      let active = 0;
      let local = 0;
      ids.forEach((id, i) => {
        const el = document.getElementById(id);
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom > mid) {
          active = i;
          const span = Math.max(1, r.height - window.innerHeight);
          local = Math.min(1, Math.max(0, -r.top / span));
        }
      });

      progress.current = local;
      setFigure((f) => (f === figures[active] ? f : figures[active]));
      setScrolled(window.scrollY > 40);

      const t = themes[active];
      setOnDark((d) => (d === t.dark ? d : t.dark));
      root.style.setProperty("--chapter-bg", t.bg);
      root.style.setProperty("--chapter-fg", t.fg);
      root.style.setProperty("--chapter-accent", t.accent);

      if (hero.current) {
        const out = active === 0 ? local : 1;
        hero.current.style.opacity = `${1 - out}`;
        hero.current.style.transform = `scale(${1 - out * 0.12})`;
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
      root.style.removeProperty("--chapter-bg");
      root.style.removeProperty("--chapter-fg");
      root.style.removeProperty("--chapter-accent");
    };
  }, []);

  return (
    <main className="relative text-[color:var(--chapter-fg)]">
      <SiteNav links={navLinks} />

      {/* landing: the monument turns behind the wordmark */}
      <section id="top" className="relative min-h-[200vh]">
        <div className="sticky top-0 flex h-dvh items-center justify-center overflow-hidden">
          <div
            ref={hero}
            className="monument-stage pointer-events-none absolute inset-0 flex items-center justify-center will-change-transform"
          >
            <div
              className="monument-halo absolute aspect-square w-[130vw] max-w-[1100px] rounded-full opacity-40 md:w-[80vw]"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0deg, var(--chapter-accent) 90deg, transparent 200deg, var(--chapter-accent) 300deg, transparent 360deg)",
                maskImage: "radial-gradient(circle, transparent 54%, #000 56%, #000 60%, transparent 62%)",
                WebkitMaskImage:
                  "radial-gradient(circle, transparent 54%, #000 56%, #000 60%, transparent 62%)",
              }}
            />
            <div className="absolute inset-0">
              <HeroMonument p={progress} />
            </div>
          </div>

          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 34% at 50% 48%, rgba(8,9,11,0.82), rgba(8,9,11,0.35) 60%, transparent 78%)",
            }}
          />

          <div className="relative z-10 px-6 text-center">
            <h1 className="text-[clamp(3rem,13vw,9rem)] font-semibold leading-[0.9] tracking-tight drop-shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
              JD <span className="text-[color:var(--chapter-accent)]">Portfolio</span>
            </h1>
            <p className="mt-4 text-base opacity-80 sm:text-lg">
              {profile.name} · {profile.title}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href="/cv"
                className="rounded-full bg-[color:var(--chapter-fg)] px-5 py-2.5 text-sm font-semibold text-[color:var(--chapter-bg)] transition hover:opacity-80"
              >
                Read the CV
              </a>
              <a
                href="#room-mate"
                className="rounded-full border border-current/30 px-5 py-2.5 text-sm font-semibold transition hover:text-[color:var(--chapter-accent)]"
              >
                Start the story
              </a>
            </div>
            <p
              className={`mt-12 font-mono text-[11px] uppercase tracking-[0.3em] opacity-50 transition-opacity duration-500 ${scrolled ? "opacity-0" : ""}`}
            >
              scroll
            </p>
          </div>
        </div>
      </section>

      {/* the single canvas every chapter after the landing draws into */}
      {figure && (
        <div className="pointer-events-none fixed left-0 right-0 top-14 z-0 h-[30dvh] md:left-1/2 md:top-0 md:h-dvh md:w-1/2">
          <StoryFigures figure={figure} p={progress} onDark={onDark} />
        </div>
      )}

      {chapters.map((c) => (
        <section key={c.id} id={c.id} className="relative min-h-[220vh]">
          <div className="sticky top-[calc(30dvh+3.5rem)] flex min-h-[70dvh] items-start px-6 pb-16 pt-4 md:top-0 md:min-h-dvh md:w-1/2 md:items-center md:px-12 md:pb-0 md:pt-14">
            <div className="relative z-10 w-full">
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[color:var(--chapter-accent)]">
                {c.eyebrow}
              </p>
              <h2 className="mt-3 text-[clamp(1.8rem,4.5vw,3rem)] font-semibold leading-tight tracking-tight">
                {c.title}
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed opacity-80">{c.lead}</p>

              {c.metrics && (
                <dl className="mt-6 flex max-w-md flex-wrap gap-x-8 gap-y-4">
                  {c.metrics.map((m) => (
                    <div key={m.label}>
                      <dt className="text-[clamp(1.6rem,4vw,2.4rem)] font-semibold leading-none tracking-tight">
                        {m.value}
                      </dt>
                      <dd className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] opacity-60">
                        {m.label}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}

              {c.bullets && (
                <ul className="mt-6 max-w-md space-y-2.5">
                  {c.bullets.map((b) => (
                    <li key={b} className="flex gap-3 text-sm leading-relaxed opacity-75">
                      <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[color:var(--chapter-accent)]" />
                      {b}
                    </li>
                  ))}
                </ul>
              )}

              {c.tags && (
                <ul className="mt-6 flex max-w-md flex-wrap gap-2">
                  {c.tags.map((t) => (
                    <li
                      key={t}
                      className="rounded-full border border-current/25 px-3 py-1 font-mono text-[11px] uppercase tracking-wider opacity-70"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              )}

              {c.id === "agent" && (
                <div className="mt-6 w-full max-w-md">
                  <AgentChat />
                </div>
              )}

              {c.id === "contact" && (
                <div className="mt-6 space-y-2 font-mono text-sm opacity-80">
                  <a className="block hover:text-[color:var(--chapter-accent)]" href={`mailto:${profile.email}`}>
                    {profile.email}
                  </a>
                  <a
                    className="block hover:text-[color:var(--chapter-accent)]"
                    href={`tel:${profile.phone.replace(/\s/g, "")}`}
                  >
                    {profile.phone}
                  </a>
                  <a
                    className="block hover:text-[color:var(--chapter-accent)]"
                    href={profile.github}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {profile.github}
                  </a>
                  <a
                    className="block hover:text-[color:var(--chapter-accent)]"
                    href={profile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {profile.linkedin}
                  </a>
                  <a className="block hover:text-[color:var(--chapter-accent)]" href="/cv">
                    /cv
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>
      ))}

      <footer className="relative z-10 border-t border-current/15 px-6 py-8 text-center font-mono text-[11px] uppercase tracking-[0.25em] opacity-50">
        JD Portfolio · {profile.location}
      </footer>
    </main>
  );
}
