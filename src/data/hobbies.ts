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
  intro: "Guitar and family, one frame each.",
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
  ],
  goals: ["Lead the platform side of an integration team, and ship open source other engineers depend on."],
};
