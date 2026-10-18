import type { Metadata } from "next";
import Link from "next/link";
import { profile } from "@/data/cv";
import { GREETING_FACT, LOBBY_LINES, TAKEOVER, llmsText } from "@/data/agentLobby";

export const metadata: Metadata = {
  title: `${TAKEOVER} — ${profile.name}`,
  description: `${GREETING_FACT} ${profile.name}, ${profile.title} in ${profile.location}.`,
};

/** the wing crawlers and assistants land on: the same facts as the site, in a shape a model can swallow whole */
export default function AgentLobbyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-teal">agent lobby</p>
      <h1 className="mt-3 text-3xl font-semibold text-brass">{TAKEOVER}</h1>

      <div className="mt-6 space-y-3 text-sm leading-relaxed text-ink/80">
        {LOBBY_LINES.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>

      <p className="mt-6 font-mono text-xs text-ink/55">
        <Link href="/" className="text-teal underline-offset-4 hover:underline">
          human entrance
        </Link>{" "}
        ·{" "}
        <Link href="/cv" className="text-teal underline-offset-4 hover:underline">
          CV
        </Link>{" "}
        ·{" "}
        <a href={`mailto:${profile.email}`} className="text-teal underline-offset-4 hover:underline">
          {profile.email}
        </a>
      </p>

      <pre className="mt-8 whitespace-pre-wrap border-t border-brass/25 pt-6 font-mono text-xs leading-relaxed text-ink/75">
        {llmsText()}
      </pre>
    </main>
  );
}
