import type { Metadata } from "next";
import Link from "next/link";
import { education, profile, roles, skills } from "@/data/cv";

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
        <p className="mt-1 text-sm uppercase tracking-widest text-white/60">{profile.title}</p>
        <p className="mt-3 font-mono text-xs text-white/55">
          {profile.location} · <a href={`tel:${profile.phone.replace(/\s/g, "")}`}>{profile.phone}</a> ·{" "}
          <a href={`mailto:${profile.email}`} className="underline-offset-4 hover:underline">
            {profile.email}
          </a>
        </p>
        <p className="mt-4 text-sm leading-relaxed text-white/80">{profile.summary}</p>
      </header>

      <section className="mt-8">
        <h2 className="font-mono text-xs uppercase tracking-widest text-teal">Skills</h2>
        <dl className="mt-3 space-y-2">
          {skills.map((g) => (
            <div key={g.group} className="flex flex-col gap-1 sm:flex-row sm:gap-4">
              <dt className="w-40 shrink-0 font-mono text-xs uppercase text-white/45">{g.group}</dt>
              <dd className="text-sm text-white/80">{g.items.join(" · ")}</dd>
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
                  {r.company} <span className="text-white/60">— {r.role}</span>
                </h3>
                <p className="font-mono text-xs text-white/50">{r.period}</p>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-white/75">{r.summary}</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/75 marker:text-brass/60">
                {r.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-mono text-xs uppercase tracking-widest text-teal">Education</h2>
        <ul className="mt-3 space-y-1 text-sm text-white/80">
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
