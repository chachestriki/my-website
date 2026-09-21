export type CareerStop = {
  id: string;
  company: string;
  /** what goes on the plaque under the painting */
  role: string;
  period: string;
  note: string;
  /** brand-ish colour the painting is done in */
  color: string;
  /** real logo hung in the frame; painted wordmark when absent */
  logo?: string;
};

/** the hall, in the order I walked it */
export const career: CareerStop[] = [
  {
    id: "lenovo",
    company: "Lenovo",
    role: "First tech job",
    period: "2021",
    note: "Hardware, big-company process, first taste of enterprise.",
    color: "#e2231a",
  },
  {
    id: "agency",
    company: "BNiels Media",
    role: "Web & campaigns",
    period: "2021 – 2022",
    note: "Sites, tracking and campaigns — where the commercial side clicked.",
    color: "#5aa9e6",
    logo: "/career/bniels-media.jpg",
  },
  {
    id: "mastel",
    company: "Mastel Hospitality",
    role: "Full-stack engineer",
    period: "2023 – 2026",
    note: "Payments and PMS automation: FreedomPay ↔ Opera Cloud, on Kubernetes.",
    color: "#1f7ae0",
  },
  {
    id: "vice-resell",
    company: "Vice Resell",
    role: "Founder / CTO",
    period: "2023 – 2026",
    note: "Resale automation for 10,000+ users. Acquired.",
    color: "#ff2fa0",
    logo: "/career/vice-resell.jpg",
  },
  {
    id: "odyn",
    company: "ODYN AI",
    role: "Sales engineer",
    period: "2022 – 2023",
    note: "Speech-to-text and meeting summaries, deployed into Zoom and Teams.",
    color: "#7c5cff",
    logo: "/career/odyn.jpg",
  },
  {
    id: "room-mate",
    company: "Room Mate Hotels",
    role: "Full-stack engineer",
    period: "2026 – now",
    note: "Opera Cloud ↔ Salesforce, plus an MCP tool layer for LLM agents.",
    color: "#f2a33c",
  },
];
