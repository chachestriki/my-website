export const viceResell = {
  title: "Vice Resell",
  role: "Founder / CTO — 2023 – 2026 (acquired)",
  intro:
    "A clothing floor, not a lobby: Vice Resell was fashion-industry software wrapped around a real warehouse. Racks, sorting tables and shipping bags on one side; pricing, listing and negotiation automation on the other.",
  community: {
    heading: "El servidor Nº1 de reventa de ropa en España",
    body: "Vice Resell is also the biggest reselling-software community in Spain, running on Whop at €20/month: sourcing playbooks, live drops, and the automation tooling that members use to go from zero to their first thousands a month in second-hand clothing.",
    href: "https://whop.com/vice-resell/products/vice-resell/",
    rating: "5.0",
    ratings: "426 reviews",
  },
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
    { value: "5.0 ★", label: "426 Whop reviews" },
    { value: "Acquired", label: "exit in 2026" },
  ],
  /** verbatim public reviews from the Whop listing */
  testimonials: [
    {
      quote: "Espectacular, recomiendo muchísimo entrar si estas buscando empezar en la reventa 👌👌",
      author: "@alexmesaa",
    },
    {
      quote:
        "Perfecto cien por cien recomendable para todo tipo de revendedores tanto principiantes como mas veteranos",
      author: "@amunozpro4",
    },
    { quote: "el mejor sitio para empezar", author: "Whop member" },
  ],
  photos: [
    { id: "stockroom", caption: "Sourcing in the stockroom", src: "/vice-resell/stockroom.jpg" },
    { id: "warehouse", caption: "Sorting day at the warehouse", src: "/vice-resell/warehouse.jpg" },
    { id: "studio-rails", caption: "Shoot rails, ready to list", src: "/vice-resell/studio-rails.jpg" },
    { id: "sorting-floor", caption: "Intake and grading", src: "/vice-resell/sorting-floor.jpg" },
    { id: "shipping", caption: "Orders going out", src: "/vice-resell/shipping.jpg" },
  ] as { id: string; caption: string; src: string | null }[],
};
