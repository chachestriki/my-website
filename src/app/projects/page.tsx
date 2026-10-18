import type { Metadata } from "next";
import Link from "next/link";
import { Emphasize } from "@/components/Emphasize";
import { ProjectSketch, sketchCaption } from "@/components/marks";
import { projects } from "@/data/cv";
import { es } from "@/i18n/es";
import { getLang } from "@/i18n/lang";
import { ui } from "@/i18n/ui";

export async function generateMetadata(): Promise<Metadata> {
  const t = ui[await getLang()].projects;
  return { title: t.title, description: t.description };
}

export default async function ProjectsPage() {
  const lang = await getLang();
  const t = ui[lang].projects;

  return (
    <>
      <h1 className="page-title">{t.title}</h1>
      <p>
        {t.intro} <Link href="/experience">{t.experience}</Link>
        {lang === "es" ? "." : " page."}
      </p>

      {projects.map((project) => {
        const copy = lang === "es" ? es.projects[project.id as keyof typeof es.projects] : null;
        const summary = copy?.summary ?? project.summary;
        const points = copy?.points ?? project.points;
        const words = [...project.stack, ...(copy?.keywords ?? project.keywords)];
        const caption = lang === "es" ? es.sketches[project.id] : sketchCaption(project.id);

        const visual = project.images?.length ? (
          <div className={project.images.length > 1 ? "card-photos two" : "card-photos"}>
            {project.images.map((image, index) => (
              <figure key={image.src}>
                <img
                  src={image.src}
                  alt={(copy?.alts?.[index] ?? image.alt)}
                />
              </figure>
            ))}
          </div>
        ) : caption ? (
          <figure className="diagram">
            <ProjectSketch id={project.id} />
            <figcaption>{caption}</figcaption>
          </figure>
        ) : null;

        return (
          <article key={project.id} id={project.id} className="card">
            <div className="card-head">
              <h2>
                {project.name}
                <span className={`status ${project.status.toLowerCase()}`}>
                  {lang === "es" ? es.status[project.status] : project.status}
                </span>
              </h2>
              <p className="when">{copy?.period ?? project.period}</p>
            </div>
            {visual ? (
              <div className="card-split">
                {visual}
                <div className="card-copy">
                  <p className="where">{copy?.where ?? project.where}</p>
                  <p>
                    <Emphasize text={summary} words={words} />
                  </p>
                  <ul>
                    {points.map((point) => (
                      <li key={point}>
                        <Emphasize text={point} words={words} />
                      </li>
                    ))}
                  </ul>
                  <p className="stack">
                    <b>{t.stack}:</b>{" "}
                    {project.stack.map((item, index) => (
                      <span key={item}>
                        {index > 0 ? " · " : null}
                        <b>{item}</b>
                      </span>
                    ))}
                  </p>
                  {project.link ? (
                    <p>
                      <a href={project.link.href} target="_blank" rel="noreferrer">
                        {copy?.link ?? project.link.label}
                      </a>
                    </p>
                  ) : null}
                </div>
              </div>
            ) : null}
          </article>
        );
      })}
    </>
  );
}
