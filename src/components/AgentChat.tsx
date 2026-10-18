"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/cv";
import { useLanguage } from "@/components/LanguageProvider";

/** questions allowed per visit, mirrored by /api/agent */
const MAX_QUESTIONS = 5;

type ChatTurn = { role: "user" | "assistant"; content: string };

export default function AgentChat() {
  const { lang, t } = useLanguage();
  const [log, setLog] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const feed = useRef<HTMLDivElement>(null);

  const opening: ChatTurn = { role: "assistant", content: t.agentOpening };
  const thread = log.length ? log : [opening];

  /** answers used when the live model can't be reached */
  const fallbackFor = (question: string) => {
    const hit = t.suggested.find((qa) => qa.q.toLowerCase() === question.trim().toLowerCase());
    return hit?.a ?? t.agentUnreachable(profile.email);
  };

  useEffect(() => {
    feed.current?.scrollTo({ top: feed.current.scrollHeight, behavior: "smooth" });
  }, [log, pending]);

  const left = MAX_QUESTIONS - thread.filter((l) => l.role === "user").length;
  const spent = left <= 0;

  async function ask(question: string) {
    const text = question.trim();
    if (!text || pending || spent) return;
    const next: ChatTurn[] = [...thread, { role: "user", content: text }];
    setLog(next);
    setInput("");
    setPending(true);
    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(1), lang }),
      });
      const data = (await res.json()) as { reply?: string };
      setLog((l) => [...l, { role: "assistant", content: data.reply ?? fallbackFor(text) }]);
    } catch {
      setLog((l) => [...l, { role: "assistant", content: fallbackFor(text) }]);
    } finally {
      setPending(false);
    }
  }

  const asked = new Set(thread.filter((l) => l.role === "user").map((l) => l.content));

  return (
    <div className="space-y-3 rounded-2xl border border-current/15 bg-current/5 p-4 backdrop-blur">
      <div
        ref={feed}
        className="max-h-56 space-y-3 overflow-y-auto pr-1"
        aria-live="polite"
      >
        {thread.map((l, i) => (
          <p
            key={i}
            className={l.role === "assistant" ? "text-sm opacity-85" : "text-sm text-[color:var(--chapter-accent)]"}
          >
            <span className="mr-2 font-mono text-[10px] uppercase tracking-widest opacity-50">
              {l.role === "assistant" ? t.agentAgent : t.agentYou}
            </span>
            {l.content}
          </p>
        ))}
        {pending && (
          <p className="font-mono text-[10px] uppercase tracking-widest opacity-50">{t.agentTyping}</p>
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
          placeholder={spent ? t.agentPlaceholderSpent : t.agentPlaceholder}
          aria-label={t.agentInputLabel}
          className="min-w-0 flex-1 rounded-full border border-current/20 bg-transparent px-4 py-2 text-sm outline-none placeholder:opacity-50 focus:border-[color:var(--chapter-accent)] disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={pending || spent || !input.trim()}
          className="rounded-full bg-[color:var(--chapter-fg)] px-4 py-2 text-sm font-semibold text-[color:var(--chapter-bg)] transition hover:opacity-80 disabled:opacity-40"
        >
          {t.agentAsk}
        </button>
      </form>

      {spent ? (
        <p className="text-sm opacity-80">
          {t.agentSpent(MAX_QUESTIONS)}{" "}
          <a href="/cv" className="text-[color:var(--chapter-accent)] underline-offset-4 hover:underline">
            {t.readCv}
          </a>{" "}
          {t.agentOr}{" "}
          <a
            href={`mailto:${profile.email}`}
            className="text-[color:var(--chapter-accent)] underline-offset-4 hover:underline"
          >
            {profile.email}
          </a>
          .
        </p>
      ) : (
        <>
          <p className="font-mono text-[10px] uppercase tracking-widest opacity-50">
            {t.agentLeft(left)}
          </p>
          <div className="flex flex-wrap gap-2">
            {t.suggested.filter((qa) => !asked.has(qa.q))
              .slice(0, 3)
              .map((qa) => (
                <button
                  key={qa.q}
                  onClick={() => void ask(qa.q)}
                  disabled={pending}
                  className="rounded-full border border-current/20 px-3 py-1.5 text-xs opacity-80 transition hover:border-[color:var(--chapter-accent)] hover:text-[color:var(--chapter-accent)] disabled:opacity-40"
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
