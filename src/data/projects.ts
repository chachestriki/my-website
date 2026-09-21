export type Project = {
  id: string;
  name: string;
  role: string;
  period: string;
  /** one line on the board */
  tag: string;
  blurb: string;
  bullets: string[];
  stat: { value: string; label: string };
  link?: { label: string; href: string };
  color: string;
  /** the room this board walks you into */
  scene: "factory" | "odyn" | "botlab";
};

/** the three I model; everything else lives in the CV */
export const projects: Project[] = [
  {
    id: "vice-resell",
    name: "Vice Resell",
    role: "Founder / CTO",
    period: "2023 – 2026 · acquired",
    tag: "Resale automation + Spain's biggest reselling community",
    blurb:
      "Marketplace automation for 10,000+ resellers: listings from photos, pricing off live comparables and negotiation messaging, sold as a €20/month community on Whop.",
    bullets: [
      "Python around OpenAI APIs with deterministic price and inventory guardrails.",
      "Apparel data: sizing and colourway normalisation, condition grading, counterfeit signals.",
      "5.0 ★ over 426 public reviews; acquired in 2026.",
    ],
    stat: { value: "10,000+", label: "resellers on the platform" },
    link: { label: "Whop listing", href: "https://whop.com/vice-resell/products/vice-resell/" },
    color: "#ff2fa0",
    scene: "factory",
  },
  {
    id: "odyn",
    name: "ODYN AI",
    role: "Sales engineer",
    period: "2022 – 2023",
    tag: "Call intelligence for Zoom, Meet and Teams",
    blurb:
      "A Silicon Valley AI company whose product listens to sales calls on Zoom, Google Meet and Microsoft Teams and learns from each one — reading client attitude, surfacing company intelligence and feeding it back to the team.",
    bullets: [
      "Speech-to-text and meeting summaries deployed into Zoom and Teams.",
      "Sentiment and attitude signals per call, turned into coaching for the sales floor.",
      "Sold and scoped the integrations customers actually ran.",
    ],
    stat: { value: "3", label: "meeting platforms integrated" },
    color: "#7c5cff",
    scene: "odyn",
  },
  {
    id: "botlab",
    name: "Instagram bot detection",
    role: "Bachelor thesis",
    period: "2022",
    tag: "Classifying automated accounts from public profile signals",
    blurb:
      "My degree project: a classifier that separates automated Instagram accounts from real people using public profile, posting and engagement signals.",
    bullets: [
      "Feature set built from posting cadence, follower/following ratios, caption reuse and engagement shape.",
      "Labelled dataset, train/test split and a supervised model scored on precision and recall, not raw accuracy.",
      "The interesting part is the cost asymmetry: flagging a real person is worse than missing a bot.",
    ],
    stat: { value: "2", label: "classes: bot or human" },
    color: "#2ecf9f",
    scene: "botlab",
  },
];

export const odyn = {
  title: "ODYN AI",
  role: "Sales engineer — 2022 – 2023",
  intro:
    "Silicon Valley AI company building call intelligence: the product analyses audio from Zoom, Google Meet and Microsoft Teams, and learns with every call.",
  blocks: [
    {
      heading: "The product",
      body: "Audio from every sales call becomes client-attitude signals, internal-collaboration cues and company intelligence the team can act on.",
    },
    {
      heading: "What I did",
      body: "Sales engineering: scoping the integrations with each meeting platform, running demos and turning what customers asked for into product requirements.",
    },
    {
      heading: "Beyond audio",
      body: "The roadmap went wider than calls — AI tooling per department, from sales and marketing through to customer service.",
    },
  ],
  values: ["Employees first", "Excellence", "Innovation", "Integrity", "Customer-centric", "Collaboration"],
};

export const botlab = {
  title: "Instagram bot detection",
  role: "Bachelor thesis — 2022",
  intro:
    "A supervised classifier that flags automated Instagram accounts from public signals: how often they post, who follows them back and how their engagement is shaped.",
  pipeline: [
    { step: "Collect", body: "Public profile, posting and engagement data per account." },
    { step: "Features", body: "Cadence, follower/following ratio, caption reuse, engagement shape." },
    { step: "Label", body: "A hand-labelled set of bot and human accounts to train against." },
    { step: "Classify", body: "Supervised model scored on precision and recall per class." },
  ],
  note: "Flagging a real person costs more than missing a bot, so the threshold is tuned for precision on the bot class.",
};
