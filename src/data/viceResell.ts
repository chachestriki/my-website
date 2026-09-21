export const viceResell = {
  title: "Vice Resell",
  role: "Founder / CTO — 2023 – 2026 (acquired)",
  intro:
    "A clothing floor, not a lobby: Vice Resell was fashion-industry software. Garments and sneakers moving through racks and conveyors are the physical side of what the platform automated — pricing, listing, and negotiation for resellers moving thousands of units.",
  blocks: [
    {
      heading: "What the software did",
      body: "An AI-driven marketplace automation platform for 10,000+ resellers: LLM-generated listings from photos and SKUs, pricing recommendations off live comparable sales, and negotiation messaging that closed deals without a human in the thread.",
    },
    {
      heading: "Fashion-specific problems",
      body: "Sizing and colourway normalisation across marketplaces, deadstock vs. worn condition grading, brand and silhouette taxonomies, seasonal demand curves, and counterfeit signals — the messy parts of apparel data that generic commerce tooling ignores.",
    },
    {
      heading: "How it was built",
      body: "Python services around OpenAI APIs, always paired with rule-based guardrails: no LLM output touched money unless it passed deterministic price bands and inventory checks. Marketplace APIs and scrapers fed a normalised catalogue that everything else read from.",
    },
  ],
  stats: [
    { value: "10,000+", label: "resellers on the platform" },
    { value: "Acquired", label: "exit in 2026" },
    { value: "3 yrs", label: "founder and CTO" },
  ],
  /** photo slots — drop files in /public/vice-resell and set `src` */
  photos: [
    { id: "floor", caption: "Warehouse floor", src: null },
    { id: "racks", caption: "Racks and intake", src: null },
    { id: "sneakers", caption: "Sneaker inventory", src: null },
    { id: "product", caption: "Product screenshot", src: null },
    { id: "pricing", caption: "Pricing dashboard", src: null },
    { id: "team", caption: "Team", src: null },
  ] as { id: string; caption: string; src: string | null }[],
};
