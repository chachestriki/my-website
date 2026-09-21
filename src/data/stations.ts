export type Station = {
  id: string;
  object: string;
  title: string;
  subtitle: string;
  /** where the label floats, in world units */
  label: [number, number, number];
  /** where the character has to stand for the room to open */
  stand: [number, number];
  /** "room" opens the overlay, "scene" swaps the whole 3D world */
  kind?: "room" | "scene";
};

export const stations: Station[] = [
  {
    id: "front-desk",
    object: "Recepción",
    title: "Check in",
    subtitle: "Who I am and what I'm for",
    label: [0, 3.4, -5],
    stand: [0, -1.6],
  },
  {
    id: "key-rack",
    object: "Key rack",
    title: "The integration board",
    subtitle: "Every system I've wired to another",
    label: [-10.4, 4.2, -2],
    stand: [-8.2, -2],
  },
  {
    id: "terminal",
    object: "PMS terminal",
    title: "Career log",
    subtitle: "Roles, shipped work, stack",
    label: [8.8, 3.6, -4],
    stand: [7.4, -1.4],
  },
  {
    id: "phone",
    object: "Voice line",
    title: "Ask the agent",
    subtitle: "A scripted version of what I built at Room Mate",
    label: [-7.6, 4.4, 3.6],
    stand: [-5.6, 3.8],
  },
  {
    id: "bell",
    object: "Service bell",
    title: "Get in touch",
    subtitle: "Email, phone, CV",
    label: [5.4, 3, 5],
    stand: [5.4, 3.2],
  },
  {
    id: "study",
    object: "Campus door",
    title: "Madrid ↔ Texas",
    subtitle: "Walk out onto the campus plaza",
    label: [11.5, 8.4, -9.4],
    stand: [11.5, -7.2],
    kind: "scene",
  },
  {
    id: "factory",
    object: "Freight door",
    title: "Vice Resell floor",
    subtitle: "Walk into the clothing factory",
    label: [-9.4, 8.4, -9.4],
    stand: [-9.4, -7.2],
    kind: "scene",
  },
];
