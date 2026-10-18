import type { Metadata } from "next";
import { RetroShell } from "@/components/RetroShell";
import { getLang } from "@/i18n/lang";
import { ui } from "@/i18n/ui";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return {
    title: {
      default: "Juan Diego Gómez",
      template: "%s — Juan Diego Gómez",
    },
    description: ui[lang].metaDescription,
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const lang = await getLang();
  return (
    <html lang={lang}>
      <body>
        <RetroShell lang={lang}>{children}</RetroShell>
      </body>
    </html>
  );
}
