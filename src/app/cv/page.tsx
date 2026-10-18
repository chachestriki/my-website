import type { Metadata } from "next";
import Link from "next/link";
import { SchoolLogo } from "@/components/SchoolLogo";
import { education, profile, roles, skills } from "@/data/cv";
import { es } from "@/i18n/es";
import { getLang } from "@/i18n/lang";
import { ui } from "@/i18n/ui";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  const person = lang === "es" ? es.profile : profile;
  return { title: ui[lang].cv.title, description: person.summary };
}

export default async function CvPage() {
  const lang = await getLang();
  const t = ui[lang].cv;
  const person = lang === "es" ? es.profile : profile;

  return (
    <>
      <h1 className="page-title">{profile.name}</h1>
      <p className="where">{person.title}</p>
      <p>
        {person.location}
        {" · "}
        <a href={`tel:${profile.phone.replace(/\s/g, "")}`}>{profile.phone}</a>
        {" · "}
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
        {" · "}
        <a href={profile.linkedin} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        {" · "}
        <a href={profile.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
      </p>
      <p>{person.summary}</p>
      <p className="hint">{t.print}</p>

      <h2>{t.experience}</h2>
      {roles.map((role) => {
        const copy = lang === "es" ? es.roles[role.id as keyof typeof es.roles] : null;
        return (
          <article key={role.id}>
            <div className="job-head">
              <h3>
                {role.company} — {copy?.role ?? role.role}
              </h3>
              <p className="when">{copy?.period ?? role.period}</p>
            </div>
            <ul>
              {(copy?.highlights ?? role.highlights).map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </article>
        );
      })}

      <h2>{t.skills}</h2>
      <table className="facts">
        <tbody>
          {skills.map((group) => (
            <tr key={group.group}>
              <th scope="row">{lang === "es" ? (es.skillGroups[group.group] ?? group.group) : group.group}</th>
              <td>
                {group.items
                  .map((item) => (lang === "es" ? (es.skillItems[item] ?? item) : item))
                  .join(" · ")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>{t.education}</h2>
      <ul className="school-list">
        {education.map((item) => {
          const copy = lang === "es" ? es.education[item.id as keyof typeof es.education] : null;
          const school = copy?.school ?? item.school;
          return (
            <li key={item.id} className="school-line">
              <SchoolLogo id={item.id} label={school} />
              <span>
                <b>{school}</b>, {copy?.place ?? item.place} — {copy?.degree ?? item.degree}
              </span>
            </li>
          );
        })}
      </ul>

      <p>
        <Link href="/">{t.back}</Link>
      </p>
    </>
  );
}
