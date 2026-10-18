import type { Metadata } from "next";
import Link from "next/link";
import { profile } from "@/data/cv";
import { es } from "@/i18n/es";
import { getLang } from "@/i18n/lang";
import { ui } from "@/i18n/ui";

export async function generateMetadata(): Promise<Metadata> {
  const t = ui[await getLang()].about;
  return { title: t.title, description: t.description };
}

export default async function AboutPage() {
  const lang = await getLang();
  const t = ui[lang].about;
  const person = lang === "es" ? es.profile : profile;

  return (
    <>
      <h1 className="page-title">{t.title}</h1>
      <div className="about-hero">
        <div>
          <blockquote>{person.tagline}</blockquote>
          <p>{person.summary}</p>
          <p>{t.middle}</p>
        </div>
        <figure className="portrait">
          <img src="/about/god-guitar.png" alt={t.portraitAlt} />
          <figcaption>{t.portraitCaption}</figcaption>
        </figure>
      </div>

      <table className="facts">
        <tbody>
          <tr>
            <th scope="row">{t.name}</th>
            <td>{profile.name}</td>
          </tr>
          <tr>
            <th scope="row">{t.titleLabel}</th>
            <td>{person.title}</td>
          </tr>
          <tr>
            <th scope="row">{t.based}</th>
            <td>{person.location}</td>
          </tr>
          <tr>
            <th scope="row">{t.email}</th>
            <td>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </td>
          </tr>
          <tr>
            <th scope="row">{t.phone}</th>
            <td>
              <a href={`tel:${profile.phone.replace(/\s/g, "")}`}>{profile.phone}</a>
            </td>
          </tr>
          <tr>
            <th scope="row">LinkedIn</th>
            <td>
              <a href={profile.linkedin} target="_blank" rel="noreferrer">
                linkedin.com/in/jdlabajos
              </a>
            </td>
          </tr>
          <tr>
            <th scope="row">GitHub</th>
            <td>
              <a href={profile.github} target="_blank" rel="noreferrer">
                github.com/chachestriki
              </a>
            </td>
          </tr>
        </tbody>
      </table>

      {lang === "es" ? (
        <p>
          Lee la <Link href="/experience">experiencia</Link>, mira los{" "}
          <Link href="/projects">proyectos</Link> o <Link href="/contact">envía una nota</Link>. También
          hay un <Link href="/cv">currículum</Link> en texto, por si hace falta papel.
        </p>
      ) : (
        <p>
          Read the <Link href="/experience">experience</Link>, browse the{" "}
          <Link href="/projects">projects</Link>, or <Link href="/contact">send a note</Link>. A plain{" "}
          <Link href="/cv">résumé</Link> is there too, if you need paper.
        </p>
      )}
    </>
  );
}
