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
    label: [0, 3.4, -7.4],
    stand: [0, -4],
  },
  {
    id: "career",
    object: "Gallery door",
    title: "Career log",
    subtitle: "The companies, in order",
    label: [6.4, 8.4, -11.9],
    stand: [6.4, -9.6],
    kind: "scene",
  },
  {
    id: "phone",
    object: "Voice line",
    title: "Ask the agent",
    subtitle: "A live LLM agent on my CV",
    label: [-10.6, 4.4, 0.4],
    stand: [-8.6, 0.6],
  },
  {
    id: "bell",
    object: "Service bell",
    title: "Get in touch",
    subtitle: "Email, phone, CV",
    label: [6.8, 3, 7],
    stand: [6.8, 5.2],
  },
  {
    id: "study",
    object: "Education door",
    title: "Education",
    subtitle: "Madrid and Texas",
    label: [14.9, 8.4, -1],
    stand: [13.9, -1],
    kind: "scene",
  },
  {
    id: "hobbies",
    object: "Lounge door",
    title: "Hobbies",
    subtitle: "Guitar, family, challenges",
    label: [-14.9, 8.4, -9],
    stand: [-13.7, -9],
    kind: "scene",
  },
  {
    id: "factory",
    object: "Freight door",
    title: "Vice Resell floor",
    subtitle: "The clothing floor",
    label: [-14.9, 8.4, 4.5],
    stand: [-13.9, 4.5],
    kind: "scene",
  },
];
