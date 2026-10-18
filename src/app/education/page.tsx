import type { Metadata } from "next";
import { SchoolLogo } from "@/components/SchoolLogo";
import { education } from "@/data/cv";
import { es } from "@/i18n/es";
import { getLang } from "@/i18n/lang";
import { ui } from "@/i18n/ui";

export async function generateMetadata(): Promise<Metadata> {
  const t = ui[await getLang()].education;
  return { title: t.title, description: t.description };
}

export default async function EducationPage() {
  const lang = await getLang();
  const t = ui[lang].education;

  return (
    <>
      <h1 className="page-title">{t.title}</h1>
      <p>{t.intro}</p>
      {education.map((item) => {
        const copy = lang === "es" ? es.education[item.id as keyof typeof es.education] : null;
        const school = copy?.school ?? item.school;
        return (
          <article key={item.id} className="card school">
            <SchoolLogo id={item.id} label={school} />
            <div>
              <h2>{school}</h2>
              <p className="where">{copy?.place ?? item.place}</p>
              <p>{copy?.degree ?? item.degree}</p>
            </div>
          </article>
        );
      })}
    </>
  );
}
