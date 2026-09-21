export const profile = {
  name: "Juan Diego Gómez",
  title: "Full-Stack / Python Software Engineer",
  location: "Madrid, España",
  email: "jd.oficial111@gmail.com",
  phone: "+34 608 253 656",
  tagline:
    "I build the plumbing between systems that were never meant to talk to each other.",
  summary:
    "Full-stack software engineer specializing in backend systems, hospitality integrations, and payment automation. I design scalable APIs and distributed services with Python, Docker, Kubernetes, PostgreSQL and cloud infrastructure — and increasingly, I put LLM agents on top of them.",
};

export type Role = {
  id: string;
  company: string;
  role: string;
  period: string;
  summary: string;
  highlights: string[];
  stack: string[];
};

export const roles: Role[] = [
  {
    id: "room-mate",
    company: "Room Mate Hospitality Group",
    role: "Full Stack Software Engineer",
    period: "2026 – Present",
    summary:
      "Enterprise hospitality integrations across the Oracle Opera Cloud ecosystem (OHIP) and Salesforce CRM, owning the architecture that connects PMS and CRM platforms.",
    highlights: [
      "Designed and owned the integration architecture between Oracle Opera Cloud PMS (OHIP) and Salesforce CRM: real-time sync of guest profiles, reservations, loyalty data and customer lifecycle information.",
      "Built an MCP tool layer exposing hotel operational systems to LLM agents via structured APIs, enabling agent-driven booking, guest and service operations.",
      "Integrated ElevenLabs voice agents into hotel operations for real-time conversational staff-facing and guest-facing interfaces.",
    ],
    stack: ["Python", "OHIP", "Salesforce", "MCP", "ElevenLabs", "OCI"],
  },
  {
    id: "mastel",
    company: "Mastel Hospitality",
    role: "Full Stack Software Engineer",
    period: "2023 – 2026",
    summary:
      "Automation and payment systems for international hotel chains including Marriott, Atlantis and Pestana, focused on reservations and guest profile workflows.",
    highlights: [
      "Designed Python services for credit-card check-in and deposit capture between FreedomPay and Opera Cloud PMS.",
      "Built idempotent REST APIs and event-driven jobs (Docker + Kubernetes on OCI) for real-time reconciliation.",
      "Created invoice and tax automation pipelines for hospitality groups including Homa Apartments and Pestana Hotels.",
    ],
    stack: ["Python", "FastAPI", "Kubernetes", "FreedomPay", "Opera Cloud", "PostgreSQL"],
  },
  {
    id: "vice-resell",
    company: "Vice Resell (Acquired)",
    role: "Founder / CTO",
    period: "2023 – 2026",
    summary:
      "An AI-driven marketplace automation platform serving 10,000+ users — pricing recommendations, listing generation and negotiation messaging.",
    highlights: [
      "Shipped LLM-powered systems combining OpenAI APIs with rule-based guardrails for reliability and controllability in production.",
      "Engineered automation pipelines for listing generation, pricing optimization and messaging workflows.",
      "Grew to 10,000+ users before acquisition.",
    ],
    stack: ["Python", "OpenAI API", "Marketplace APIs", "Automation"],
  },
  {
    id: "odyn",
    company: "Odyn AI",
    role: "Sales Engineer (Remote)",
    period: "2022 – 2023",
    summary:
      "Supported development and deployment of a speech-to-text and meeting summarisation product with Zoom and Teams integrations.",
    highlights: [
      "Ran technical deployments and integration work for Zoom/Teams customers.",
      "Bridged customer requirements and the engineering roadmap for STT pipelines.",
    ],
    stack: ["Speech-to-text", "Zoom API", "Teams API"],
  },
];

export const skills: { group: string; items: string[] }[] = [
  { group: "Backend", items: ["Python", "FastAPI", ".NET", "Flask", "REST APIs", "OAuth2"] },
  { group: "Frontend", items: ["Angular", "JavaScript", "TypeScript"] },
  {
    group: "Infrastructure",
    items: ["Docker", "Kubernetes", "CI/CD", "Microservices", "Kafka"],
  },
  { group: "Cloud", items: ["Oracle Cloud (OCI)", "GCP", "AWS", "Azure"] },
  { group: "Databases", items: ["PostgreSQL", "SQL", "MongoDB"] },
  {
    group: "Systems / Domain",
    items: ["Opera Cloud", "OHIP", "PMS / CRM / POS", "Salesforce"],
  },
  {
    group: "AI / Automation",
    items: [
      "OpenAI API",
      "MCP tool systems",
      "LLM agent workflows",
      "ElevenLabs speech pipelines",
      "Retrieval pipelines",
    ],
  },
];

export const education = [
  {
    school: "Texas A&M University",
    place: "College Station, TX",
    degree: "B.S. Computer Science and Business",
  },
  {
    school: "Universidad Carlos III",
    place: "Madrid, ESP",
    degree: "B.S. Management & Technology",
  },
];

/* ---------------- Integration board ---------------- */

export type BoardNode = {
  id: string;
  label: string;
  kind: "system" | "service" | "agent" | "store";
  x: number; // 0-100 grid units
  y: number;
  roleId: string;
  blurb: string;
};

export type BoardEdge = {
  from: string;
  to: string;
  label: string;
  /** payload that animates along the wire */
  packet: string;
};

export const boardNodes: BoardNode[] = [
  {
    id: "opera",
    label: "Opera Cloud PMS",
    kind: "system",
    x: 8,
    y: 22,
    roleId: "room-mate",
    blurb:
      "Oracle's hotel property-management system. Source of truth for reservations, guest profiles and folios — reached through OHIP.",
  },
  {
    id: "ohip",
    label: "OHIP Gateway",
    kind: "service",
    x: 36,
    y: 12,
    roleId: "room-mate",
    blurb:
      "OAuth2 + app-key gateway in front of Opera. I designed the integration layer that normalizes its payloads and survives its rate limits.",
  },
  {
    id: "salesforce",
    label: "Salesforce CRM",
    kind: "system",
    x: 66,
    y: 20,
    roleId: "room-mate",
    blurb:
      "Real-time sync of guest profiles, reservations, loyalty data and customer lifecycle events, both directions.",
  },
  {
    id: "mcp",
    label: "MCP Tool Layer",
    kind: "service",
    x: 40,
    y: 46,
    roleId: "room-mate",
    blurb:
      "Hotel operations exposed to LLM agents as structured, permissioned tools — booking, guest and service operations executed by agents instead of humans.",
  },
  {
    id: "voice",
    label: "Voice Agent",
    kind: "agent",
    x: 70,
    y: 58,
    roleId: "room-mate",
    blurb:
      "Conversational front-end over operational systems for staff and guests, wired to the same MCP tools.",
  },
  {
    id: "freedompay",
    label: "FreedomPay",
    kind: "system",
    x: 6,
    y: 62,
    roleId: "mastel",
    blurb:
      "Card-present and card-on-file payments. Check-in authorizations and deposit capture flow through here.",
  },
  {
    id: "recon",
    label: "Reconciliation",
    kind: "service",
    x: 36,
    y: 76,
    roleId: "mastel",
    blurb:
      "Idempotent REST APIs and event-driven jobs on Docker + Kubernetes (OCI) reconciling payments against folios in real time.",
  },
  {
    id: "invoicing",
    label: "Invoice & Tax",
    kind: "service",
    x: 66,
    y: 86,
    roleId: "mastel",
    blurb:
      "Automated invoicing and tax handling for hospitality groups such as Homa Apartments and Pestana Hotels.",
  },
  {
    id: "marketplaces",
    label: "Marketplaces",
    kind: "store",
    x: 76,
    y: 38,
    roleId: "vice-resell",
    blurb:
      "Where it started: resale marketplaces automated end-to-end — listing generation, pricing optimization and negotiation messaging for 10,000+ users.",
  },
];

export const boardEdges: BoardEdge[] = [
  { from: "opera", to: "ohip", label: "reservations", packet: "RES" },
  { from: "ohip", to: "salesforce", label: "guest profiles", packet: "GUEST" },
  { from: "ohip", to: "mcp", label: "tools", packet: "TOOL" },
  { from: "mcp", to: "voice", label: "agent calls", packet: "SAY" },
  { from: "mcp", to: "salesforce", label: "lifecycle", packet: "LOY" },
  { from: "freedompay", to: "recon", label: "auth + capture", packet: "PAY" },
  { from: "recon", to: "opera", label: "folio posting", packet: "FOLIO" },
  { from: "recon", to: "invoicing", label: "settled txns", packet: "INV" },
  { from: "marketplaces", to: "mcp", label: "LLM playbook", packet: "LLM" },
];
