import type { Metadata } from "next";
import Link from "next/link";
import { education, profile, roles, skills } from "@/data/cv";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: `CV — ${profile.name}`,
  description: profile.summary,
};

export default function CvPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-14 print:py-0">
      <Link href="/" className="font-mono text-xs text-teal hover:underline print:hidden">
        ← back to the lobby
      </Link>

      <header className="mt-6 border-b border-brass/25 pb-5">
        <h1 className="text-3xl font-semibold text-brass">{profile.name}</h1>
        <p className="mt-1 text-sm uppercase tracking-widest text-ink/60">{profile.title}</p>
        <p className="mt-3 font-mono text-xs text-ink/55">
          {profile.location} · <a href={`tel:${profile.phone.replace(/\s/g, "")}`}>{profile.phone}</a> ·{" "}
          <a href={`mailto:${profile.email}`} className="underline-offset-4 hover:underline">
            {profile.email}
          </a>
        </p>
        <p className="mt-4 text-sm leading-relaxed text-ink/80">{profile.summary}</p>
      </header>

      <section className="mt-8">
        <h2 className="font-mono text-xs uppercase tracking-widest text-teal">Skills</h2>
        <dl className="mt-3 space-y-2">
          {skills.map((g) => (
            <div key={g.group} className="flex flex-col gap-1 sm:flex-row sm:gap-4">
              <dt className="w-40 shrink-0 font-mono text-xs uppercase text-ink/45">{g.group}</dt>
              <dd className="text-sm text-ink/80">{g.items.join(" · ")}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-10">
        <h2 className="font-mono text-xs uppercase tracking-widest text-teal">Experience</h2>
        <div className="mt-4 space-y-7">
          {roles.map((r) => (
            <article key={r.id}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-lg font-semibold text-brass">
                  {r.company} <span className="text-ink/60">— {r.role}</span>
                </h3>
                <p className="font-mono text-xs text-ink/50">{r.period}</p>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-ink/75">{r.summary}</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink/75 marker:text-brass/60">
                {r.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-mono text-xs uppercase tracking-widest text-teal">Projects</h2>
        <div className="mt-4 space-y-5">
          {projects.map((p) => (
            <article key={p.id}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-lg font-semibold text-brass">
                  {p.name} <span className="text-ink/60">— {p.role}</span>
                </h3>
                <p className="font-mono text-xs text-ink/50">{p.period}</p>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-ink/75">{p.blurb}</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink/75 marker:text-brass/60">
                {p.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              {p.link && (
                <a
                  href={p.link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-block font-mono text-xs text-teal underline-offset-4 hover:underline"
                >
                  {p.link.label} →
                </a>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-mono text-xs uppercase tracking-widest text-teal">Education</h2>
        <ul className="mt-3 space-y-1 text-sm text-ink/80">
          {education.map((e) => (
            <li key={e.school}>
              <span className="text-brass">{e.school}</span>, {e.place} — {e.degree}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
