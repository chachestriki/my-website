export type DoorQuestion = {
  /** short prompt shown on the locked door */
  question: string;
  options: string[];
  /** index into options */
  answer: number;
  /** one line shown once the door unlocks */
  note: string;
};

/** each scene door asks one question before it opens; keyed by station id */
export const doorQuiz: Record<string, DoorQuestion[]> = {
  factory: [
    {
      question: "In Python, what does a dict comprehension `{k: v for k, v in pairs}` do with duplicate keys?",
      options: ["Raises KeyError", "Keeps the last value", "Keeps the first value", "Stores a list of both"],
      answer: 1,
      note: "Later assignments overwrite earlier ones, same as a normal assignment.",
    },
    {
      question: "Which HTTP status should an API return when a request is well-formed but the user isn't allowed?",
      options: ["400", "401", "403", "404"],
      answer: 2,
      note: "401 is 'who are you?', 403 is 'I know who you are, still no'.",
    },
    {
      question: "What is the average time complexity of a hash-map lookup?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
      answer: 0,
      note: "Constant on average, linear in the pathological collision case.",
    },
  ],
  study: [
    {
      question: "What does SQL's `LEFT JOIN` keep that an `INNER JOIN` drops?",
      options: [
        "Rows of the right table with no match",
        "Rows of the left table with no match",
        "Duplicate rows",
        "NULL columns",
      ],
      answer: 1,
      note: "Unmatched left rows survive, padded with NULLs.",
    },
    {
      question: "In Git, which command rewrites your commits on top of another branch?",
      options: ["git merge", "git rebase", "git cherry", "git reset"],
      answer: 1,
      note: "Rebase replays commits; merge records a merge commit instead.",
    },
    {
      question: "What does `==` compare in JavaScript that `===` does not?",
      options: ["Nothing, they're identical", "Values after type coercion", "Object identity", "Prototypes"],
      answer: 1,
      note: "`==` coerces types first, which is why `0 == \"\"` is true.",
    },
  ],
  career: [
    {
      question: "What does an index on a database column mainly trade away?",
      options: ["Read speed", "Write speed and storage", "Consistency", "Type safety"],
      answer: 1,
      note: "Faster reads, slower writes and more disk.",
    },
    {
      question: "In React, what does a `key` on a list item do?",
      options: [
        "Sorts the list",
        "Identifies the element across renders",
        "Caches the component",
        "Sets the DOM id",
      ],
      answer: 1,
      note: "It lets the reconciler match elements between renders.",
    },
    {
      question: "Which one is NOT a property of a pure function?",
      options: ["Same input, same output", "No side effects", "Reads mutable global state", "Easy to test"],
      answer: 2,
      note: "Touching mutable globals is exactly what makes a function impure.",
    },
  ],
};
