"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import IntegrationBoard from "@/components/IntegrationBoard";
import { education, profile, roles, skills } from "@/data/cv";

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
        <h3 className="font-mono text-xs uppercase tracking-widest text-teal">Mission</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink/75">
          Legacy operational systems — PMS, CRM, POS, payment gateways — hold the real business
          logic of entire industries, and almost none of it is reachable by modern software or by
          agents. I build the layer that makes it reachable: typed APIs, idempotent jobs, and MCP
          tools that let an LLM actually <em>do</em> the work instead of describing it.
        </p>
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
        <h3 className="font-mono text-xs uppercase tracking-widest text-teal">Education</h3>
        <ul className="mt-2 space-y-1 text-sm text-ink/75">
          {education.map((e) => (
            <li key={e.school}>
              <span className="text-brass">{e.school}</span> — {e.degree}{" "}
              <span className="text-ink/40">({e.place})</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function ProjectsRoom() {
  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed text-ink/70">
        This is the back office of the hotel — the wiring diagram behind the front desk. Hover a
        node to isolate what it touches; click it for the case study.
      </p>
      <IntegrationBoard />
    </div>
  );
}

export function ExperienceRoom() {
  return (
    <div className="space-y-6">
      <p className="font-mono text-xs uppercase tracking-widest text-teal">
        PMS terminal · career log
      </p>
      <ol className="relative space-y-6 border-l border-brass/25 pl-6">
        {roles.map((r, i) => (
          <motion.li
            key={r.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="relative"
          >
            <span className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full border-2 border-brass bg-[#fff6ea]" />
            <div className="flex flex-wrap items-baseline gap-x-3">
              <h3 className="text-lg font-semibold text-brass">{r.company}</h3>
              <p className="font-mono text-xs text-ink/50">{r.period}</p>
            </div>
            <p className="text-sm text-ink/60">{r.role}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink/80">{r.summary}</p>
            <ul className="mt-2 space-y-1.5 text-sm text-ink/70">
              {r.highlights.map((h) => (
                <li key={h} className="flex gap-2">
                  <span className="text-brass/70">▸</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {r.stack.map((s) => (
                <span key={s} className="rounded border border-brass/25 px-2 py-0.5 font-mono text-[11px] text-brass/90">
                  {s}
                </span>
              ))}
            </div>
          </motion.li>
        ))}
      </ol>
      <a
        href="/cv"
        className="inline-block rounded-lg border border-brass/40 bg-brass/10 px-4 py-2 text-sm text-brass transition hover:bg-brass/20"
      >
        Open the plain-text CV →
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

export function ConciergeRoom() {
  const [log, setLog] = useState<{ role: "guest" | "agent"; text: string }[]>([
    { role: "agent", text: "Good evening. I'm the voice agent Juan wired into this lobby. Ask me anything from the list." },
  ]);
  const asked = new Set(log.filter((l) => l.role === "guest").map((l) => l.text));

  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed text-ink/70">
        At Room Mate I put ElevenLabs voice agents on top of hotel operations. This is the same idea,
        scripted — no API key required.
      </p>
      <div className="max-h-80 space-y-3 overflow-y-auto rounded-xl border border-brass/20 bg-[#fff6ea] p-4">
        {log.map((l, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={l.role === "agent" ? "text-sm text-ink/85" : "text-sm text-brass"}
          >
            <span className="mr-2 font-mono text-[11px] uppercase text-ink/35">
              {l.role === "agent" ? "agent" : "you"}
            </span>
            {l.text}
          </motion.div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {CONCIERGE_QA.filter((qa) => !asked.has(qa.q)).map((qa) => (
          <button
            key={qa.q}
            onClick={() =>
              setLog((l) => [...l, { role: "guest", text: qa.q }, { role: "agent", text: qa.a }])
            }
            className="rounded-full border border-brass/35 px-3 py-1.5 text-xs text-brass/90 transition hover:bg-brass/15"
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
      <p className="text-sm leading-relaxed text-ink/70">
        Ring the bell. I read everything that isn&apos;t a recruiter template.
      </p>
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
