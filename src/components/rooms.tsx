"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import IntegrationBoard from "@/components/IntegrationBoard";
import Postcards from "@/components/postcards";
import { career } from "@/data/career";
import { education, profile, skills } from "@/data/cv";
import { hobbies } from "@/data/hobbies";
import { viceResell } from "@/data/viceResell";

export function AboutRoom() {
  return (
    <div className="space-y-6">
      <p className="text-lg leading-relaxed text-ink/85">{profile.tagline}</p>
      <p className="text-sm leading-relaxed text-ink/70">{profile.summary}</p>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { k: "10,000+", v: "users on the automation platform I founded and sold" },
          { k: "4", v: "hotel groups running on integrations I designed" },
          { k: "2", v: "degrees: CS & Business (Texas A&M), Management & Tech (UC3M)" },
        ].map((s) => (
          <div key={s.k} className="rounded-xl border border-brass/20 bg-white/70 p-4">
            <p className="font-mono text-2xl text-brass">{s.k}</p>
            <p className="mt-1 text-xs leading-relaxed text-ink/60">{s.v}</p>
          </div>
        ))}
      </div>

      <div>
        <h3 className="font-mono text-xs uppercase tracking-widest text-teal">Toolbox</h3>
        <div className="mt-3 space-y-3">
          {skills.map((g) => (
            <div key={g.group} className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:gap-4">
              <p className="w-40 shrink-0 font-mono text-xs uppercase text-ink/40">{g.group}</p>
              <div className="flex flex-wrap gap-1.5">
                {g.items.map((i) => (
                  <span key={i} className="rounded border border-ink/10 bg-white/70 px-2 py-0.5 text-xs text-ink/80">
                    {i}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-mono text-xs uppercase tracking-widest text-teal">Systems I&apos;ve wired together</h3>
        <div className="mt-3">
          <IntegrationBoard />
        </div>
      </div>

      <Postcards />
    </div>
  );
}

export function CareerRoom() {
  return (
    <div className="space-y-5">
      <ol className="relative space-y-4 border-l border-brass/25 pl-6">
        {career.map((s, i) => (
          <motion.li
            key={s.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="relative"
          >
            <span
              className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full border-2 border-[#fff6ea]"
              style={{ background: s.color }}
            />
            <div className="flex flex-wrap items-baseline gap-x-3">
              <h3 className="font-semibold text-brass">{s.company}</h3>
              <p className="font-mono text-xs text-ink/50">{s.period}</p>
            </div>
            <p className="text-xs text-ink/55">{s.role}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink/80">{s.note}</p>
          </motion.li>
        ))}
      </ol>
      <a
        href="/cv"
        className="inline-block rounded-lg border border-brass/40 bg-brass/10 px-4 py-2 text-sm text-brass transition hover:bg-brass/20"
      >
        Full CV →
      </a>
    </div>
  );
}

const CONCIERGE_QA: { q: string; a: string }[] = [
  {
    q: "What do you actually do all day?",
    a: "I design and own integrations between hospitality systems: Opera Cloud PMS via OHIP, Salesforce CRM, FreedomPay. Concretely: schema mapping, OAuth2 plumbing, idempotency keys, event-driven reconciliation jobs on Kubernetes, and lately an MCP tool layer so LLM agents can execute those workflows.",
  },
  {
    q: "What's the MCP tool layer about?",
    a: "Hotel operations are locked behind clunky enterprise APIs. I expose them as structured, permissioned MCP tools, so an agent can look up a reservation, modify a profile, or trigger a service request through the same validated path a staff member would use — with guardrails and audit instead of free-form API access.",
  },
  {
    q: "Tell me about Vice Resell.",
    a: "I founded and was CTO of an AI-driven marketplace automation platform that reached 10,000+ users before it was acquired. LLM-powered pricing recommendations, listing generation and negotiation messaging — always paired with rule-based systems, because pure LLM output isn't reliable enough to touch money.",
  },
  {
    q: "Hardest problem you've shipped?",
    a: "Credit-card check-in and deposit capture between FreedomPay and Opera Cloud. Payments and PMS folios disagree constantly, retries are unavoidable, and double-charging a guest is unacceptable — so everything had to be idempotent and reconcilable in real time.",
  },
  {
    q: "Are you available?",
    a: `Based in Madrid, open to the right conversation. Email ${profile.email} and I'll reply.`,
  },
];

type ChatTurn = { role: "user" | "assistant"; content: string };

const OPENING: ChatTurn = {
  role: "assistant",
  content:
    "I'm the agent Juan wired into this lobby — same idea as the ones he puts on hotel operations, only this one has read his CV. Ask me anything about his work.",
};

/** answers used when the live model can't be reached */
function fallbackFor(question: string) {
  const hit = CONCIERGE_QA.find((qa) => qa.q.toLowerCase() === question.trim().toLowerCase());
  return (
    hit?.a ??
    `The live agent is unreachable right now. Everything it would tell you is in the rooms of this site and in the CV — and Juan answers directly at ${profile.email}.`
  );
}

export function ConciergeRoom() {
  const [log, setLog] = useState<ChatTurn[]>([OPENING]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const feed = useRef<HTMLDivElement>(null);

  useEffect(() => {
    feed.current?.scrollTo({ top: feed.current.scrollHeight, behavior: "smooth" });
  }, [log, pending]);

  async function ask(question: string) {
    const text = question.trim();
    if (!text || pending) return;
    const next: ChatTurn[] = [...log, { role: "user", content: text }];
    setLog(next);
    setInput("");
    setPending(true);
    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(1) }),
      });
      const data = (await res.json()) as { reply?: string };
      setLog((l) => [...l, { role: "assistant", content: data.reply ?? fallbackFor(text) }]);
    } catch {
      setLog((l) => [...l, { role: "assistant", content: fallbackFor(text) }]);
    } finally {
      setPending(false);
    }
  }

  const asked = new Set(log.filter((l) => l.role === "user").map((l) => l.content));

  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed text-ink/70">
        A live LLM agent grounded in Juan&apos;s CV, projects and career — it only answers from what&apos;s on this site.
      </p>
      <div
        ref={feed}
        className="max-h-80 space-y-3 overflow-y-auto rounded-xl border border-brass/20 bg-[#fff6ea] p-4"
        aria-live="polite"
      >
        {log.map((l, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={l.role === "assistant" ? "text-sm text-ink/85" : "text-sm text-brass"}
          >
            <span className="mr-2 font-mono text-[11px] uppercase text-ink/35">
              {l.role === "assistant" ? "agent" : "you"}
            </span>
            {l.content}
          </motion.div>
        ))}
        {pending && <p className="font-mono text-[11px] uppercase tracking-widest text-ink/35">agent is typing…</p>}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void ask(input);
        }}
        className="flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about his stack, a project, availability…"
          aria-label="Ask the agent a question"
          className="min-w-0 flex-1 rounded-full border border-brass/35 bg-white/70 px-4 py-2 text-sm text-ink outline-none placeholder:text-ink/35 focus:border-brass"
        />
        <button
          type="submit"
          disabled={pending || !input.trim()}
          className="rounded-full border-2 border-brass bg-brass px-4 py-2 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-40"
        >
          Ask
        </button>
      </form>
      <div className="flex flex-wrap gap-2">
        {CONCIERGE_QA.filter((qa) => !asked.has(qa.q)).map((qa) => (
          <button
            key={qa.q}
            onClick={() => void ask(qa.q)}
            disabled={pending}
            className="rounded-full border border-brass/35 px-3 py-1.5 text-xs text-brass/90 transition hover:bg-brass/15 disabled:opacity-40"
          >
            {qa.q}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ContactRoom() {
  const links = [
    { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
    { label: "Phone", value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, "")}` },
    { label: "Location", value: profile.location, href: null },
  ];
  return (
    <div className="space-y-5">
      <p className="text-sm leading-relaxed text-ink/70">Ring the bell.</p>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.label} className="flex items-baseline gap-4">
            <span className="w-24 shrink-0 font-mono text-xs uppercase text-ink/40">{l.label}</span>
            {l.href ? (
              <a href={l.href} className="text-brass underline-offset-4 hover:underline">
                {l.value}
              </a>
            ) : (
              <span className="text-ink/80">{l.value}</span>
            )}
          </li>
        ))}
      </ul>
      <a
        href="/cv"
        className="inline-block rounded-lg border border-brass/40 bg-brass/10 px-4 py-2 text-sm text-brass transition hover:bg-brass/20"
      >
        Read the CV →
      </a>
    </div>
  );
}

export function HobbiesRoom() {
  return (
    <div className="space-y-5">
      <p className="text-sm leading-relaxed text-ink/75">{hobbies.intro}</p>
      <ul className="grid gap-3 sm:grid-cols-2">
        {hobbies.memories.map((m) => (
          <li key={m.id} className="rounded-2xl border-2 border-white bg-white/60 p-4">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <h3 className="font-semibold text-brass">{m.title}</h3>
              <p className="font-mono text-[11px] text-ink/45">{m.when}</p>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-ink/75">{m.note}</p>
          </li>
        ))}
      </ul>
      <div>
        <h3 className="font-mono text-xs uppercase tracking-widest text-teal">Next up</h3>
        <ul className="mt-2 space-y-1 text-sm text-ink/75">
          {hobbies.goals.map((g) => (
            <li key={g}>· {g}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function EducationRoom() {
  const wings = [
    {
      city: "Madrid",
      flag: "🇪🇸",
      school: education.find((e) => e.place.includes("Madrid")),
      tint: "from-[#ffb03a]/25",
      accent: "text-[#c0392b]",
      notes: ["Finance and strategy next to systems and data."],
    },
    {
      city: "Texas",
      flag: "🤠",
      school: education.find((e) => e.place.includes("TX")),
      tint: "from-[#3f72d8]/25",
      accent: "text-[#2f5fbf]",
      notes: ["Algorithms, systems and databases, project by project."],
    },
  ];

  return (
    <div className="space-y-6">
      <p className="text-sm leading-relaxed text-ink/75">
        Business in Madrid, computers in Texas.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {wings.map((w) => (
          <div
            key={w.city}
            className={`rounded-2xl border border-brass/20 bg-gradient-to-b ${w.tint} to-white/60 p-5`}
          >
            <p className="font-mono text-xs uppercase tracking-widest text-teal">
              {w.flag} {w.city}
            </p>
            <h3 className={`mt-1 text-lg font-extrabold ${w.accent}`}>{w.school?.school}</h3>
            <p className="text-sm text-ink/70">{w.school?.degree}</p>
            <p className="font-mono text-[11px] text-ink/45">{w.school?.place}</p>
            <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-ink/75">
              {w.notes.map((n) => (
                <li key={n} className="flex gap-2">
                  <span className="text-brass">·</span>
                  {n}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ViceResellRoom() {
  return (
    <div className="space-y-5">
      <p className="text-sm leading-relaxed text-ink/75">{viceResell.intro}</p>
      <div className="grid gap-3 sm:grid-cols-3">
        {viceResell.stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-brass/20 bg-white/70 p-4">
            <p className="font-mono text-xl text-brass">{s.value}</p>
            <p className="mt-1 text-xs leading-relaxed text-ink/60">{s.label}</p>
          </div>
        ))}
      </div>
      {viceResell.blocks.map((b) => (
        <div key={b.heading}>
          <h3 className="font-mono text-xs uppercase tracking-widest text-teal">{b.heading}</h3>
          <p className="mt-1 text-sm leading-relaxed text-ink/75">{b.body}</p>
        </div>
      ))}
    </div>
  );
}
