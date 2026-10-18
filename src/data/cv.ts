export const profile = {
  name: "Juan Diego Gómez",
  title: "Full-Stack / Python Software Engineer",
  location: "Madrid, Spain",
  email: "jd.oficial111@gmail.com",
  phone: "+34 608 253 656",
  linkedin: "https://www.linkedin.com/in/jdlabajos",
  github: "https://github.com/chachestriki",
  site: "https://jdlabajos.com",
  tagline:
    "I build the plumbing between systems that were never meant to talk to each other.",
  summary:
    "Full-stack software engineer specializing in backend systems, hospitality integrations, and payment automation. I design scalable APIs and distributed services with Python, Docker, Kubernetes, PostgreSQL and cloud infrastructure — and increasingly, I put LLM agents on top of them.",
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
      "An AI-driven marketplace for second-hand clothes, with a warehouse, a shop, and software for pricing, listings, and buyer messages. It reached more than 10,000 users, and was acquired.",
    highlights: [
      "Shipped LLM-powered systems combining OpenAI APIs with rule-based guardrails for reliability and controllability in production.",
      "Engineered automation pipelines for listing generation, pricing optimization and messaging workflows.",
      "Ran the warehouse, where the clothes were sorted, and the shop, where they hung on the racks. Both rooms are in the project pictures.",
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
  {
    id: "lenovo",
    company: "Lenovo",
    role: "Student / Intern, Infrastructure and Solutions Group (Sales)",
    period: "Jul 2022 – Aug 2022",
    summary:
      "First internship, in Madrid. A month with the datacenter and infrastructure sales group, next to the people who sell servers, storage, and the rest of that stack.",
    highlights: [
      "Supported client managers and overlay teams as they lined up infrastructure opportunities in enterprise and public-sector accounts.",
      "Watched a deal go through review: the product set, the pipeline, and the numbers the team was measured on.",
      "Kept notes and the reporting tools tidy so the sales effort stayed coordinated.",
    ],
    stack: ["Infrastructure sales", "Datacenter", "Pipeline reporting"],
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
    id: "tamu",
    school: "Texas A&M University",
    place: "College Station, TX",
    degree: "B.S. Computer Science and Business",
  },
  {
    id: "uc3m",
    school: "Universidad Carlos III",
    place: "Madrid, Spain",
    degree: "B.S. Management & Technology",
  },
];

export type Project = {
  id: string;
  name: string;
  period: string;
  where: string;
  status: "Live" | "Shipped" | "Acquired";
  summary: string;
  points: string[];
  stack: string[];
  images?: { src: string; alt: string }[];
  link?: { href: string; label: string };
  keywords: string[];
};

export const projects: Project[] = [
  {
    id: "opera-salesforce",
    name: "Opera Cloud ↔ Salesforce",
    period: "2026 – Present",
    where: "Room Mate Hospitality Group",
    status: "Live",
    summary:
      "The integration architecture between Oracle Opera Cloud PMS (OHIP) and Salesforce CRM. Opera stays the source of truth for reservations, guest profiles, and folios. Salesforce gets that data, and sends lifecycle updates back.",
    points: [
      "Real-time sync of guest profiles, reservations, loyalty data, and customer lifecycle information, in both directions.",
      "An OAuth2 and app-key gateway in front of Opera that normalizes payloads and lives with its rate limits.",
    ],
    stack: ["Python", "OHIP", "Salesforce", "OAuth2", "OCI"],
    keywords: ["Opera Cloud", "OHIP", "Salesforce", "OAuth2", "Python", "OCI", "PMS", "CRM"],
  },
  {
    id: "mcp-tools",
    name: "Hotel MCP Tool Layer",
    period: "2026 – Present",
    where: "Room Mate Hospitality Group",
    status: "Live",
    summary:
      "Hotel operations exposed to language-model agents as structured, permissioned tools, so an agent can book, look up a guest, or run a service request instead of handing it to a person.",
    points: [
      "Built the MCP tool layer on top of the same operational systems the PMS integration uses.",
      "Tools stay narrow and explicit: the agent calls a function, it does not get a raw database.",
    ],
    stack: ["Python", "MCP", "OHIP", "Salesforce"],
    keywords: ["MCP", "OHIP", "Salesforce", "Python", "PMS"],
  },
  {
    id: "vice-resell",
    name: "Vice Resell",
    period: "2023 – 2026",
    where: "Founder / CTO",
    status: "Acquired",
    summary:
      "An AI assistant for a second-hand clothing business: pricing, listing generation, and negotiation messages. The pictures are the warehouse, where the clothes were sorted, and the shop, where they hung on the racks. More than 10,000 users, then acquired.",
    points: [
      "LLM features on the OpenAI API, with rule-based guardrails so production behavior stayed controllable.",
      "Automation for listing copy, price updates, and buyer messages across resale marketplaces.",
    ],
    stack: ["Python", "OpenAI API", "Marketplace APIs"],
    keywords: ["OpenAI API", "OpenAI", "LLM", "Python", "warehouse", "shop"],
    images: [
      {
        src: "/projects/vice-resell-warehouse.jpg",
        alt: "The Vice Resell warehouse: bags of second-hand clothes on the floor, with people sorting them.",
      },
      {
        src: "/projects/vice-resell-racks.jpg",
        alt: "The Vice Resell shop: racks packed with second-hand jackets and sweatshirts.",
      },
    ],
    link: {
      href: "https://whop.com/vice-resell/",
      label: "Vice Resell on Whop",
    },
  },
  {
    id: "odyn",
    name: "Meeting Notes for Zoom & Teams",
    period: "2022 – 2023",
    where: "Odyn AI",
    status: "Shipped",
    summary:
      "Sales engineering for a speech-to-text and meeting-summary product. I ran deployments and kept customer requests tied to the engineering roadmap.",
    points: [
      "Technical deployments and integration work for Zoom and Microsoft Teams customers.",
      "Translated what buyers needed into work the speech-to-text pipeline could actually do.",
    ],
    stack: ["Speech-to-text", "Zoom API", "Teams API"],
    keywords: ["Speech-to-text", "speech-to-text", "Zoom", "Microsoft Teams", "Teams"],
    images: [
      {
        src: "/projects/odyn-discord.png",
        alt: "A Discord chat where Demo OdynAI summarizes Drew's sales call in English.",
      },
    ],
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
