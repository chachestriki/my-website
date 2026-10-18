"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { contentFor, copy, type Copy, type Lang } from "@/data/i18n";

const STORAGE_KEY = "jd-lang";

/** kept outside React so the stored choice is read once, on the client, without a cascading render */
let current: Lang | null = null;
const listeners = new Set<() => void>();

function snapshot(): Lang {
  if (current) return current;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "es" || stored === "en") current = stored;
  else current = navigator.language.toLowerCase().startsWith("es") ? "es" : "en";
  return current;
}

function serverSnapshot(): Lang {
  return "en";
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

function choose(lang: Lang) {
  current = lang;
  window.localStorage.setItem(STORAGE_KEY, lang);
  listeners.forEach((l) => l());
}

type LanguageValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Copy;
  content: ReturnType<typeof contentFor>;
};

const LanguageContext = createContext<LanguageValue | null>(null);

/** the whole site reads its copy from here; the choice survives reloads */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore(subscribe, snapshot, serverSnapshot);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo<LanguageValue>(
    () => ({ lang, setLang: choose, t: copy[lang], content: contentFor(lang) }),
    [lang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("useLanguage must be used inside LanguageProvider");
  return value;
}

/** shows the flag of the language you would switch to */
export function LanguageToggle({ className = "" }: { className?: string }) {
  const { lang, setLang, t } = useLanguage();
  const next: Lang = lang === "en" ? "es" : "en";

  return (
    <button
      type="button"
      onClick={() => setLang(next)}
      aria-label={t.switchTo}
      title={t.switchTo}
      className={`flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg border border-current/20 transition hover:border-current/50 ${className}`}
    >
      {next === "es" ? <SpainFlag /> : <UsFlag />}
    </button>
  );
}

function SpainFlag() {
  return (
    <svg viewBox="0 0 30 20" aria-hidden className="h-5 w-[30px] rounded-[3px]">
      <rect width="30" height="20" fill="#c60b1e" />
      <rect y="5" width="30" height="10" fill="#ffc400" />
    </svg>
  );
}

function UsFlag() {
  return (
    <svg viewBox="0 0 30 20" aria-hidden className="h-5 w-[30px] rounded-[3px]">
      <rect width="30" height="20" fill="#f7f7f7" />
      {[0, 2, 4, 6, 8, 10, 12].map((i) => (
        <rect key={i} y={i * (20 / 13)} width="30" height={20 / 13} fill="#b22234" />
      ))}
      <rect width="13" height={(20 / 13) * 7} fill="#3c3b6e" />
    </svg>
  );
}
