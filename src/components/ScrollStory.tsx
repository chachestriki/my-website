"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import SiteNav from "@/components/SiteNav";
import AgentChat from "@/components/AgentChat";
import { education, profile, roles, skills } from "@/data/cv";
import type { FigureId } from "@/components/StoryFigures";

const StoryFigures = dynamic(() => import("@/components/StoryFigures"), { ssr: false });

type Chapter = {
  id: string;
  nav: string;
  figure: FigureId;
  eyebrow: string;
  title: string;
  lead: string;
  bullets?: string[];
  tags?: string[];
};

const byId = (id: string) => {
  const role = roles.find((r) => r.id === id);
  if (!role) throw new Error(`unknown role ${id}`);
  return role;
};

const roleChapter = (id: string, figure: FigureId): Chapter => {
  const r = byId(id);
  return {
    id: r.id,
    nav: r.company,
    figure,
    eyebrow: `${r.period} · ${r.role}`,
    title: r.company,
    lead: r.summary,
    bullets: r.highlights,
    tags: r.stack,
  };
};

const chapters: Chapter[] = [
  roleChapter("room-mate", "bridge"),
  roleChapter("mastel", "ledger"),
  roleChapter("vice-resell", "crowd"),
  roleChapter("odyn", "wave"),
  roleChapter("lenovo", "rack"),
  {
    id: "education",
    nav: "Education",
    figure: "arc",
    eyebrow: "Education",
    title: "Madrid and Texas, same arc",
    lead: education.map((e) => `${e.degree} — ${e.school}, ${e.place}.`).join(" "),
  },
  {
    id: "stack",
    nav: "Stack",
    figure: "lattice",
    eyebrow: "Toolkit",
    title: "What I build with",
    lead: "Backend-leaning, infrastructure-comfortable, and increasingly agent-shaped.",
    tags: skills.flatMap((s) => s.items),
  },
  {
    id: "agent",
    nav: "Ask the agent",
    figure: "rings",
    eyebrow: "Live demo",
    title: "Ask an agent that read the CV",
    lead: "An LLM grounded only in this site's data. Five questions per visit.",
  },
  {
    id: "contact",
    nav: "Contact",
    figure: "send",
    eyebrow: "Contact",
    title: "Let's talk",
    lead: `${profile.location} · open to the right conversation.`,
  },
];

const navLinks = [{ id: "top", label: "Top" }, ...chapters.map((c) => ({ id: c.id, label: c.nav }))];

/** scroll-driven portfolio: one pinned figure per chapter, animated by how far you are into it */
export default function ScrollStory() {
  const [figure, setFigure] = useState<FigureId>("monument");
  const progress = useRef(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const ids = ["top", ...chapters.map((c) => c.id)];
    const figures: FigureId[] = ["monument", ...chapters.map((c) => c.figure)];
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
    };
  }, []);

  return (
    <main className="relative bg-background text-ink">
      <SiteNav links={navLinks} />

      {/* the single canvas every chapter draws into */}
      <div className="pointer-events-none fixed left-0 right-0 top-14 z-0 h-[40dvh] md:left-1/2 md:top-0 md:h-dvh md:w-1/2">
        <StoryFigures figure={figure} p={progress} />
      </div>

      <Panel id="top" tall>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-brass">JD Portfolio</p>
        <h1 className="mt-4 text-[clamp(2.4rem,7vw,4.5rem)] font-semibold leading-[1.02] tracking-tight">
          {profile.name}
        </h1>
        <p className="mt-3 text-lg text-ink/70">{profile.title}</p>
        <p className="mt-6 max-w-md text-balance text-base leading-relaxed text-ink/75">{profile.tagline}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="/cv"
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-background transition hover:bg-brass"
          >
            Read the CV
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="rounded-full border border-ink/20 px-5 py-2.5 text-sm font-semibold transition hover:border-brass hover:text-brass"
          >
            {profile.email}
          </a>
        </div>
        <p
          className={`mt-10 font-mono text-[11px] uppercase tracking-[0.25em] text-ink/40 transition-opacity duration-500 ${scrolled ? "opacity-0" : "opacity-100"}`}
        >
          scroll
        </p>
      </Panel>

      {chapters.map((c) => (
        <Panel key={c.id} id={c.id}>
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-brass">{c.eyebrow}</p>
          <h2 className="mt-3 text-[clamp(1.8rem,4.5vw,3rem)] font-semibold leading-tight tracking-tight">
            {c.title}
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-ink/75">{c.lead}</p>
          {c.bullets && (
            <ul className="mt-5 max-w-md space-y-2.5">
              {c.bullets.map((b) => (
                <li key={b} className="flex gap-3 text-sm leading-relaxed text-ink/70">
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-brass" />
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
                  className="rounded-full border border-ink/15 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-ink/55"
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
            <div className="mt-6 space-y-2 font-mono text-sm text-ink/70">
              <a className="block hover:text-brass" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
              <a className="block hover:text-brass" href={`tel:${profile.phone.replace(/\s/g, "")}`}>
                {profile.phone}
              </a>
              <a className="block hover:text-brass" href={profile.github} target="_blank" rel="noreferrer">
                {profile.github}
              </a>
              <a className="block hover:text-brass" href="/cv">
                /cv
              </a>
            </div>
          )}
        </Panel>
      ))}

      <footer className="relative z-10 border-t border-ink/10 px-6 py-8 text-center font-mono text-[11px] uppercase tracking-[0.25em] text-ink/40">
        JD Portfolio · {profile.location}
      </footer>
    </main>
  );
}

/** a chapter: tall enough to scrub, with the copy pinned while you scroll through it */
function Panel({ id, tall, children }: { id: string; tall?: boolean; children: React.ReactNode }) {
  return (
    <section id={id} className={tall ? "relative min-h-[180vh]" : "relative min-h-[220vh]"}>
      <div className="sticky top-[40dvh] flex min-h-[60dvh] items-start px-6 pb-16 pt-8 md:top-0 md:min-h-dvh md:w-1/2 md:items-center md:px-12 md:pb-0 md:pt-14">
        <div className="relative z-10 w-full">{children}</div>
      </div>
    </section>
  );
}
