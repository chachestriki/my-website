export const viceResell = {
  title: "Vice Resell",
  role: "Founder / CTO — 2023 – 2026 (acquired)",
  intro:
    "Fashion-industry software wrapped around a real warehouse: racks and shipping bags on one side, pricing and listing automation on the other.",
  community: {
    heading: "El servidor Nº1 de reventa de ropa en España",
    body: "Spain's biggest reselling-software community, on Whop at €20/month: sourcing playbooks, live drops and the automation members run on.",
    href: "https://whop.com/vice-resell/products/vice-resell/",
    rating: "5.0",
    ratings: "426 reviews",
  },
  blocks: [
    {
      heading: "What the software did",
      body: "Marketplace automation for 10,000+ resellers: listings from photos, pricing off live comparables, negotiation messaging that closed deals.",
    },
    {
      heading: "Fashion-specific problems",
      body: "Sizing and colourway normalisation, condition grading, brand taxonomies, counterfeit signals — the messy parts of apparel data.",
    },
    {
      heading: "How it was built",
      body: "Python around OpenAI APIs with rule-based guardrails: no LLM output touched money before passing deterministic price and inventory checks.",
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
