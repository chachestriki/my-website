"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Ui } from "@/i18n/ui";

export function SiteNav({ labels }: { labels: Ui["nav"] }) {
  const path = usePathname();
  const links = [
    { href: "/about", label: labels.about },
    { href: "/experience", label: labels.experience },
    { href: "/projects", label: labels.projects },
    { href: "/skills", label: labels.skills },
    { href: "/education", label: labels.education },
    { href: "/contact", label: labels.contact },
  ];

  return (
    <nav className="side" aria-label={labels.menu}>
      <ul>
        {links.map((link) => {
          const active = path === link.href;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={active ? "pill on" : "pill"}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="side-bottom">
        <Link href="/">{labels.home}</Link>
        <Link href="/#new">{labels.news}</Link>
      </div>
    </nav>
  );
}

export { default } from "./PortfolioNav";
