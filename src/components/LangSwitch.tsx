"use client";

import { useRouter } from "next/navigation";
import type { Lang } from "@/i18n/lang";

export function LangSwitch({ lang, label }: { lang: Lang; label: string }) {
  const router = useRouter();

  function choose(next: Lang) {
    if (next === lang) return;
    document.cookie = `lang=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
    router.refresh();
  }

  return (
    <div className="lang" role="group" aria-label={label}>
      <button type="button" className={lang === "es" ? "on" : undefined} aria-pressed={lang === "es"} onClick={() => choose("es")}>
        ES
      </button>
      <span className="lang-dash" aria-hidden="true">
        -
      </span>
      <button type="button" className={lang === "en" ? "on" : undefined} aria-pressed={lang === "en"} onClick={() => choose("en")}>
        EN
      </button>
    </div>
  );
}
