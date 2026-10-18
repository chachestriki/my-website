import type { Metadata } from "next";
import Link from "next/link";
import { getLang } from "@/i18n/lang";
import { ui } from "@/i18n/ui";

export async function generateMetadata(): Promise<Metadata> {
  const t = ui[await getLang()].missing;
  return { title: t.title };
}

export default async function NotFound() {
  const t = ui[await getLang()].missing;
  return (
    <>
      <h1 className="page-title">404</h1>
      <p>{t.body}</p>
      <p>
        <Link href="/">{t.back}</Link>
      </p>
    </>
  );
}
