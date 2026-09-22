import { career } from "@/data/career";
import { education, profile, roles, skills } from "@/data/cv";
import { hobbies } from "@/data/hobbies";
import { projects } from "@/data/projects";

/** everything the agent is allowed to know, flattened out of the site's own data */
export function buildKnowledgeBase(): string {
  const who = [
    `Name: ${profile.name}`,
    `Title: ${profile.title}`,
    `Location: ${profile.location}`,
    `Email: ${profile.email}`,
    `Phone: ${profile.phone}`,
    `Tagline: ${profile.tagline}`,
    `Summary: ${profile.summary}`,
  ].join("\n");

  const experience = roles
    .map((r) =>
      [
        `${r.company} — ${r.role} (${r.period})`,
        r.summary,
        ...r.highlights.map((h) => `- ${h}`),
        `Stack: ${r.stack.join(", ")}`,
      ].join("\n"),
    )
    .join("\n\n");

  const timeline = career.map((c) => `${c.period} · ${c.company} — ${c.role}: ${c.note}`).join("\n");

  const flagship = projects
    .map((p) =>
      [
        `${p.name} — ${p.role} (${p.period})`,
        p.blurb,
        ...p.bullets.map((b) => `- ${b}`),
        `Headline number: ${p.stat.value} ${p.stat.label}`,
        p.link ? `Link: ${p.link.label} ${p.link.href}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    )
    .join("\n\n");

  const studies = education.map((e) => `${e.degree} — ${e.school}, ${e.place}`).join("\n");

  const abilities = skills.map((s) => `${s.group}: ${s.items.join(", ")}`).join("\n");

  const offClock = [
    hobbies.intro,
    ...hobbies.memories.map((m) => `- ${m.title} (${m.when}): ${m.note}`),
    `Goals: ${hobbies.goals.join(" · ")}`,
  ].join("\n");

  return [
    `## Who he is\n${who}`,
    `## Experience\n${experience}`,
    `## Career timeline\n${timeline}`,
    `## Flagship projects\n${flagship}`,
    `## Education\n${studies}`,
    `## Skills\n${abilities}`,
    `## Off the clock\n${offClock}`,
  ].join("\n\n");
}

export const SYSTEM_PROMPT = `You are the concierge agent of Juan Diego Gómez's interactive portfolio, talking to recruiters and engineers who are exploring his site.

Rules:
- Answer only from the dossier below. If something is not in it, say you don't have that detail and point to ${profile.email}.
- Speak about Juan in the third person, warm but concise: two to four sentences, no bullet lists unless asked.
- Be concrete: name systems, numbers and companies from the dossier instead of generic praise.
- Reply in the language the visitor writes in (Spanish or English).
- Never invent metrics, clients, dates, salaries or links.

# Dossier
${buildKnowledgeBase()}`;
