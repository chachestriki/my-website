"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/cv";

/** questions allowed per visit, mirrored by /api/agent */
const MAX_QUESTIONS = 5;

const SUGGESTED: { q: string; a: string }[] = [
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
    a: "I founded and was CTO of an AI-driven marketplace automation platform that reached 6,000+ users before it was acquired. LLM-powered pricing recommendations, listing generation and negotiation messaging — always paired with rule-based systems, because pure LLM output isn't reliable enough to touch money.",
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
    "I'm an agent Juan wired into this page — same idea as the ones he builds for hotel operations, only this one has read his CV. Ask me anything about his work.",
};

/** answers used when the live model can't be reached */
function fallbackFor(question: string) {
  const hit = SUGGESTED.find((qa) => qa.q.toLowerCase() === question.trim().toLowerCase());
  return (
    hit?.a ??
    `The live agent is unreachable right now. Everything it would tell you is on this page and in the CV — and Juan answers directly at ${profile.email}.`
  );
}

export default function AgentChat() {
  const [log, setLog] = useState<ChatTurn[]>([OPENING]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const feed = useRef<HTMLDivElement>(null);

  useEffect(() => {
    feed.current?.scrollTo({ top: feed.current.scrollHeight, behavior: "smooth" });
  }, [log, pending]);

  const left = MAX_QUESTIONS - log.filter((l) => l.role === "user").length;
  const spent = left <= 0;

  async function ask(question: string) {
    const text = question.trim();
    if (!text || pending || spent) return;
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
    <div className="space-y-3 rounded-2xl border border-ink/10 bg-card/80 p-4 backdrop-blur">
      <div
        ref={feed}
        className="max-h-56 space-y-3 overflow-y-auto pr-1"
        aria-live="polite"
      >
        {log.map((l, i) => (
          <p key={i} className={l.role === "assistant" ? "text-sm text-ink/85" : "text-sm text-brass"}>
            <span className="mr-2 font-mono text-[10px] uppercase tracking-widest text-ink/35">
              {l.role === "assistant" ? "agent" : "you"}
            </span>
            {l.content}
          </p>
        ))}
        {pending && (
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink/35">agent is typing…</p>
        )}
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
          disabled={spent}
          placeholder={spent ? "Question limit reached" : "Ask about his stack, a project…"}
          aria-label="Ask the agent a question"
          className="min-w-0 flex-1 rounded-full border border-ink/15 bg-background px-4 py-2 text-sm outline-none placeholder:text-ink/35 focus:border-brass disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={pending || spent || !input.trim()}
          className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-background transition hover:bg-brass disabled:opacity-40"
        >
          Ask
        </button>
      </form>

      {spent ? (
        <p className="text-sm text-ink/70">
          That&apos;s the {MAX_QUESTIONS}-question limit for one visit.{" "}
          <a href="/cv" className="text-brass underline-offset-4 hover:underline">
            Read the CV
          </a>{" "}
          or write to{" "}
          <a href={`mailto:${profile.email}`} className="text-brass underline-offset-4 hover:underline">
            {profile.email}
          </a>
          .
        </p>
      ) : (
        <>
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink/35">
            {left} question{left === 1 ? "" : "s"} left
          </p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED.filter((qa) => !asked.has(qa.q))
              .slice(0, 3)
              .map((qa) => (
                <button
                  key={qa.q}
                  onClick={() => void ask(qa.q)}
                  disabled={pending}
                  className="rounded-full border border-ink/15 px-3 py-1.5 text-xs text-ink/70 transition hover:border-brass hover:text-brass disabled:opacity-40"
                >
                  {qa.q}
                </button>
              ))}
          </div>
        </>
      )}
    </div>
  );
}
