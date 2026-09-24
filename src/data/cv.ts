export const profile = {
  name: "Juan Diego Gómez",
  title: "Full-Stack / Python Software Engineer",
  location: "Madrid, España",
  email: "jd.oficial111@gmail.com",
  phone: "+34 608 253 656",
  tagline:
    "I build the plumbing between systems that were never meant to talk to each other.",
  summary:
    "Backend-leaning full-stack engineer working on hospitality integrations, payment automation and LLM tooling. I connect Opera Cloud (OHIP), Salesforce and FreedomPay with idempotent Python services on Kubernetes, and expose them to AI agents through MCP. Before that I founded and sold Vice Resell, a resale automation platform with 6,000+ users.",
  github: "https://github.com/chachestriki",
  /** empty until the profile URL is confirmed; the nav hides the link while it is */
  linkedin: "",
  site: "https://jdlabajos.com",
};

export const languages = [
  { name: "Spanish", level: "native" },
  { name: "English", level: "bilingual — B.S. completed at Texas A&M" },
];

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
      "Own the integration architecture between Oracle Opera Cloud (OHIP) and Salesforce CRM across 100+ hotels and roughly 4.5M guest profiles, plus the AI tooling layer on top of it.",
    highlights: [
      "Own the Opera Cloud (OHIP) ↔ Salesforce integration: guest profiles, reservations and loyalty data synced in real time instead of by hand.",
      "Built an MCP server that turns Oracle's official OpenAPI specs into 3,000+ permissioned tools, so LLM agents can run booking and guest operations without ever seeing the OAuth credentials.",
      "Shipped ElevenLabs voice agents on top of that tool layer for staff- and guest-facing conversational flows.",
      "Built streaming consumers for OTA reservation flows (Booking, Expedia, Hotelbeds, Mirai, Keytel) into Opera, with hashing and offset tracking so replays never double-book.",
    ],
    stack: ["Python", "OHIP", "Salesforce", "MCP", "ElevenLabs", "OCI"],
  },
  {
    id: "mastel",
    company: "Mastel Hospitality",
    role: "Full Stack Software Engineer",
    period: "2023 – 2026",
    summary:
      "Payment and reservation automation for international hotel chains including Marriott, Atlantis and Pestana.",
    highlights: [
      "Automated credit-card check-in and deposit capture between FreedomPay and Opera Cloud, removing manual card handling at the front desk.",
      "Built idempotent REST APIs and event-driven jobs (Docker + Kubernetes on OCI) that reconcile payments against folios in real time.",
      "Shipped invoicing and tax pipelines for Homa Apartments and Pestana Hotels, replacing spreadsheet-based month-end work.",
    ],
    stack: ["Python", "FastAPI", "Kubernetes", "FreedomPay", "Opera Cloud", "PostgreSQL"],
  },
  {
    id: "vice-resell",
    company: "Vice Resell (Acquired)",
    role: "Founder / CTO",
    period: "2023 – 2026",
    summary:
      "Founded, built and sold the resale automation platform behind Spain's largest reselling community: 6,000+ users, listing generation, pricing and negotiation messaging.",
    highlights: [
      "Grew it to 6,000+ paying users and the biggest reselling community in Spain (5.0 ★ over 426 public reviews) before the 2026 acquisition.",
      "Automated the marketplaces end to end — Vinted, Wallapop and Vestiaire — with a Chrome extension and crosslisting backend that publish, reprice and message from one inventory.",
      "Built a RAG pipeline (FAISS over cleaned marketplace data + GPT-4 vision) that fills title, description, brand, category, colours and price from a photo.",
      "Kept LLM output behind deterministic price and inventory checks, because generated text should never be the last thing between a user and their money.",
    ],
    stack: ["Python", "FastAPI", "FAISS", "OpenAI API", "Next.js", "Supabase", "Chrome MV3"],
  },
  {
    id: "odyn",
    company: "Odyn AI",
    role: "Sales Engineer (Remote)",
    period: "2022 – 2023",
    summary:
      "Technical side of a Silicon Valley call-intelligence product: speech-to-text, text-to-speech and meeting analysis across Zoom, Google Meet and Microsoft Teams.",
    highlights: [
      "Ran deployments and integration work for customers on three meeting platforms.",
      "Turned what customers asked for in demos into requirements for the speech and sentiment pipelines.",
    ],
    stack: ["Speech-to-text", "Text-to-speech", "Zoom API", "Teams API"],
  },
  {
    id: "lenovo",
    company: "Lenovo",
    role: "Infrastructure Sales",
    period: "2021",
    summary:
      "Data-centre infrastructure sales: servers, storage and networking for enterprise customers.",
    highlights: [
      "Sized and quoted server, storage and networking configurations against customer workloads.",
      "First exposure to enterprise IT and to the buyers I now build integrations for.",
    ],
    stack: ["Data-centre infrastructure", "Enterprise IT"],
  },
];

export const skills: { group: string; items: string[] }[] = [
  { group: "Backend", items: ["Python", "FastAPI", ".NET", "Flask", "REST APIs", "OAuth2"] },
  { group: "Frontend", items: ["Angular", "Next.js", "JavaScript", "TypeScript"] },
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
      "RAG / FAISS vector search",
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
    degree: "B.S. Management & Technology — thesis on Instagram bot detection",
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
      "Where it started: resale marketplaces automated end-to-end — listing generation, pricing optimization and negotiation messaging for 6,000+ users.",
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
