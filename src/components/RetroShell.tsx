import Link from "next/link";
import { profile } from "@/data/cv";
import type { Lang } from "@/i18n/lang";
import { ui } from "@/i18n/ui";
import { LangSwitch } from "./LangSwitch";
import { RainbowMac } from "./RainbowMac";
import { SiteNav } from "./SiteNav";

export function RetroShell({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const t = ui[lang];

  return (
    <div className="page-bg">
      <a className="skip" href="#content">
        {t.skip}
      </a>
      <div className="site">
        <header className="mast">
          <Link href="/" className="brand">
            <RainbowMac />
            <span>
              <span className="brand-name">Juan Diego Gómez</span>
              <span className="brand-sub">
                {t.mastTitle} · {lang === "es" ? "Madrid, España" : profile.location}
              </span>
            </span>
          </Link>
          <LangSwitch lang={lang} label={t.langLabel} />
        </header>
        <div className="rainbow" aria-hidden="true" />
        <div className="frame">
          <SiteNav labels={t.nav} />
          <main id="content" className="main">
            {children}
          </main>
        </div>
        <footer className="foot">
          <p className="foot-links">
            <Link href="/">{t.footer.home}</Link>
            <Link href="/#new">{t.footer.news}</Link>
            <Link href="/contact">{t.footer.guestbook}</Link>
            <a href={`mailto:${profile.email}`}>{t.footer.email}</a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a href={profile.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <Link href="/cv">{t.footer.resume}</Link>
          </p>
          <p className="hits">
            {t.footer.visitor}{" "}
            <span className="odometer" aria-label="1995" title="001995">
              <span aria-hidden="true">0</span>
              <span aria-hidden="true">0</span>
              <span aria-hidden="true">1</span>
              <span aria-hidden="true">9</span>
              <span aria-hidden="true">9</span>
              <span aria-hidden="true">5</span>
            </span>
          </p>
        </footer>
      </div>
      <p className="netscape">
        {t.footer.netscape}
        <br />
        {t.footer.updated}
      </p>
    </div>
  );
}
