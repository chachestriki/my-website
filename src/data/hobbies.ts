export type Memory = {
  id: string;
  title: string;
  when: string;
  /** the challenge or the story behind the photo */
  note: string;
  color: string;
  /** a photo of mine; the frame paints a placeholder while it's missing */
  src?: string;
};

export const hobbies: {
  heading: string;
  intro: string;
  memories: Memory[];
  goals: string[];
} = {
  heading: "Off the clock",
  intro: "Guitar, family and the challenges I set myself. One frame per story.",
  /** drop files in public/hobbies/ and set `src` to wire a photo into its frame */
  memories: [
    {
      id: "guitar",
      title: "Electric guitar",
      when: "since 2015",
      note: "Self-taught on a Strat. Learned to practise the boring part slowly — same as debugging.",
      color: "#ff2fa0",
    },
    {
      id: "family",
      title: "Family tree",
      when: "Madrid ↔ Texas",
      note: "Two countries in the same branch: the reason I studied on both sides of the ocean.",
      color: "#ffc01f",
    },
    {
      id: "sport",
      title: "The long ride",
      when: "2024",
      note: "Trained for months for one distance I couldn't do the first time. Finished it.",
      color: "#2ecf9f",
    },
    {
      id: "build",
      title: "Ship something in a weekend",
      when: "every few months",
      note: "A rule I keep: an idea has to be live and usable before Monday, however small.",
      color: "#4fa4ff",
    },
  ],
  goals: [
    "Lead the platform side of an integration team.",
    "Play a full set live, no sheet.",
    "One open-source tool other engineers actually depend on.",
  ],
};
