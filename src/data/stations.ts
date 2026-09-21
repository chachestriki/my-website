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
    subtitle: "Who I am",
    label: [0, 3.4, -5],
    stand: [0, -1.6],
  },
  {
    id: "projects",
    object: "Projects wall",
    title: "Projects",
    subtitle: "Vice Resell, ODYN AI, bot detection",
    label: [-5.2, 9.2, -9.4],
    stand: [-5.2, -7.2],
    kind: "scene",
  },
  {
    id: "career",
    object: "Gallery door",
    title: "Career log",
    subtitle: "The companies, in order",
    label: [5.2, 8.4, -9.4],
    stand: [5.2, -7.2],
    kind: "scene",
  },
  {
    id: "phone",
    object: "Voice line",
    title: "Ask the agent",
    subtitle: "A scripted voice agent",
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
    object: "Education door",
    title: "Education",
    subtitle: "Madrid and Texas",
    label: [11.4, 8.4, -1],
    stand: [10.4, -1],
    kind: "scene",
  },
  {
    id: "hobbies",
    object: "Lounge door",
    title: "Hobbies",
    subtitle: "Guitar, family, challenges",
    label: [-11.4, 8.4, -7.4],
    stand: [-10.2, -7.4],
    kind: "scene",
  },
  {
    id: "factory",
    object: "Freight door",
    title: "Vice Resell floor",
    subtitle: "The clothing floor",
    label: [-11.4, 8.4, 4.5],
    stand: [-10.4, 4.5],
    kind: "scene",
  },
];
