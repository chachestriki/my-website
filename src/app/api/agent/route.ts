import { SYSTEM_PROMPT } from "@/data/agentContext";
import { profile } from "@/data/cv";

export const runtime = "nodejs";

type ChatMessage = { role: "user" | "assistant"; content: string };

type Body = { messages?: unknown; lang?: unknown };

const MODEL = "gpt-4o-mini";
const MAX_TURNS = 12;
const MAX_CHARS = 600;
/** questions allowed per conversation, mirrored by the room's UI */
const MAX_QUESTIONS = 5;

function parseMessages(body: Body): ChatMessage[] | null {
  if (!Array.isArray(body.messages)) return null;
  const out: ChatMessage[] = [];
  for (const raw of body.messages.slice(-MAX_TURNS)) {
    if (typeof raw !== "object" || raw === null) return null;
    const { role, content } = raw as { role?: unknown; content?: unknown };
    if (role !== "user" && role !== "assistant") return null;
    if (typeof content !== "string" || !content.trim()) return null;
    out.push({ role, content: content.slice(0, MAX_CHARS) });
  }
  return out.length ? out : null;
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return Response.json({ error: "invalid json" }, { status: 400 });
  }

  const messages = parseMessages(body);
  if (!messages) return Response.json({ error: "invalid messages" }, { status: 400 });

  const spanish = body.lang === "es";

  if (messages.filter((m) => m.role === "user").length > MAX_QUESTIONS) {
    return Response.json(
      {
        reply: spanish
          ? `Ese es el límite de ${MAX_QUESTIONS} preguntas por visita. El resto está en el CV — y Juan responde directamente en ${profile.email}.`
          : `That's the ${MAX_QUESTIONS}-question limit for one visit. The rest is in the CV — and Juan answers directly at ${profile.email}.`,
        limited: true,
      },
      { status: 429 }
    );
  }

  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return Response.json({
      reply: spanish
        ? `El agente en vivo está apagado ahora mismo (no hay API key configurada), así que esta es la respuesta de reserva. Todo lo que te contaría está en esta web, y Juan responde directamente en ${profile.email}.`
        : `The live agent is off right now (no API key configured), so this is the scripted fallback. Everything it would tell you is on this site, and Juan answers directly at ${profile.email}.`,
      demo: true,
    });
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.4,
      max_tokens: 320,
      messages: [
        {
          role: "system",
          content: spanish ? `${SYSTEM_PROMPT}\n\nAlways answer in Spanish.` : SYSTEM_PROMPT,
        },
        ...messages,
      ],
    }),
  });

  if (!res.ok) {
    return Response.json({ error: "upstream error" }, { status: 502 });
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const reply = data.choices?.[0]?.message?.content?.trim();
  if (!reply) return Response.json({ error: "empty reply" }, { status: 502 });

  return Response.json({ reply, demo: false });
}
