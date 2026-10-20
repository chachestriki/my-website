import type { Metadata } from "next";
import Link from "next/link";
import { profile } from "@/data/cv";
import { es } from "@/i18n/es";
import { getLang } from "@/i18n/lang";
import { ui } from "@/i18n/ui";

export async function generateMetadata(): Promise<Metadata> {
  const t = ui[await getLang()].home;
  return { title: { absolute: t.title }, description: t.description };
}

export default async function Home() {
  const lang = await getLang();
  const t = ui[lang].home;
  const location = lang === "es" ? es.profile.location : profile.location;
  const tagline = lang === "es" ? es.profile.tagline : profile.tagline;

  return (
    <>
      <div className="hero">
        <div>
          <h1 className="welcome">{t.welcome}</h1>
          <p>
            {t.reached} <b>{profile.name}</b>, {t.engineer} {location}.
          </p>
          <p>{tagline}</p>
        </div>
        <figure className="shot">
          <img
            src="/about/god-guitar.png"
            alt={ui[lang].about.portraitAlt}
          />
          <figcaption>{t.caption}</figcaption>
        </figure>
      </div>

      <hr />

      <h2>{t.features}</h2>
      {t.items.map((feature) => (
        <article key={feature.href} className="feature">
          <h3>
            <Link href={feature.href}>{feature.title}</Link>
          </h3>
          <p>{feature.text}</p>
        </article>
      ))}

      <hr />

      <section id="new">
        <h2>{t.news}</h2>
        <ul className="news">
          {t.updates.map((item) => (
            <li key={`${item.year}-${item.href}`}>
              <span className="date">{item.year}</span> — {item.before}
              <Link href={item.href}>{item.label}</Link>
              {item.after}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
