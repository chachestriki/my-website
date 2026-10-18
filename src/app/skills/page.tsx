import type { Metadata } from "next";
import { skills } from "@/data/cv";
import { es } from "@/i18n/es";
import { getLang } from "@/i18n/lang";
import { ui } from "@/i18n/ui";

export async function generateMetadata(): Promise<Metadata> {
  const t = ui[await getLang()].skills;
  return { title: t.title, description: t.description };
}

export default async function SkillsPage() {
  const lang = await getLang();
  const t = ui[lang].skills;

  return (
    <>
      <h1 className="page-title">{t.title}</h1>
      <p>{t.intro}</p>
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
    </>
  );
}
