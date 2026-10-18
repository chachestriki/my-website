import type { Metadata } from "next";
import { MailForm } from "@/components/MailForm";
import { profile } from "@/data/cv";
import { es } from "@/i18n/es";
import { getLang } from "@/i18n/lang";
import { ui } from "@/i18n/ui";

export async function generateMetadata(): Promise<Metadata> {
  const t = ui[await getLang()].contact;
  return { title: t.title, description: t.description };
}

export default async function ContactPage() {
  const lang = await getLang();
  const t = ui[lang].contact;
  const location = lang === "es" ? es.profile.location : profile.location;

  return (
    <>
      <h1 className="page-title">{t.title}</h1>
      <p>{t.intro}</p>

      <table className="facts">
        <tbody>
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
            <th scope="row">{t.where}</th>
            <td>{location}</td>
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

      <h2>{t.send}</h2>
      <MailForm email={profile.email} labels={t} />
    </>
  );
}
