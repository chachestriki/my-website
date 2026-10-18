import type { Metadata } from "next";
import Link from "next/link";
import { ExperienceMark } from "@/components/marks";
import { roles } from "@/data/cv";
import { es } from "@/i18n/es";
import { getLang } from "@/i18n/lang";
import { ui } from "@/i18n/ui";

export async function generateMetadata(): Promise<Metadata> {
  const t = ui[await getLang()].experience;
  return { title: t.title, description: t.description };
}

export default async function ExperiencePage() {
  const lang = await getLang();
  const t = ui[lang].experience;

  return (
    <>
      <h1 className="page-title">{t.title}</h1>
      <p>
        {t.intro} <Link href="/projects">{t.projects}</Link>
        {lang === "es" ? "." : " page."}
      </p>

      {roles.map((role) => {
        const copy = lang === "es" ? es.roles[role.id as keyof typeof es.roles] : null;
        return (
          <article key={role.id} id={role.id} className="card">
            <div className="job-head">
              <h2 className="job-title">
                <ExperienceMark id={role.id} />
                <span>{role.company}</span>
              </h2>
              <p className="when">{copy?.period ?? role.period}</p>
            </div>
            <p className="where">{copy?.role ?? role.role}</p>
            <p>{copy?.summary ?? role.summary}</p>
            <ul>
              {(copy?.highlights ?? role.highlights).map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
            <p className="stack">
              <b>{t.stack}:</b> {role.stack.join(" · ")}
            </p>
          </article>
        );
      })}
    </>
  );
}
