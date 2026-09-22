"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

type PostcardData = {
  caption: string;
  title: string;
  place: string;
  tilt: string;
  scene: ReactNode;
  story: string[];
};

function RiverScene({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 200"
      className={className}
      role="img"
      aria-label="A man swimming across a river between two mountains"
    >
      <rect width="320" height="200" fill="#eaf4ff" />
      <circle cx="252" cy="40" r="17" fill="#ffd98a" />
      <ellipse cx="70" cy="36" rx="26" ry="8" fill="#ffffff" />
      <ellipse cx="92" cy="30" rx="16" ry="6" fill="#ffffff" />
      <ellipse cx="210" cy="60" rx="18" ry="6" fill="#ffffff" opacity="0.8" />

      {/* left canyon wall */}
      <polygon points="-10,158 78,38 170,158" fill="#b6a4e8" />
      <polygon points="30,158 92,74 162,158" fill="#cfc2f2" />
      <polygon points="78,38 96,64 86,59 78,68 68,57 58,63" fill="#fff6ea" />

      {/* right canyon wall */}
      <polygon points="155,158 242,30 330,158" fill="#9fdcc6" />
      <polygon points="185,158 248,64 322,158" fill="#8ed0b8" />
      <polygon points="242,30 262,60 250,55 242,64 231,53 220,59" fill="#fff6ea" />

      {/* the river between them */}
      <path
        d="M0 152 C 55 142, 110 144, 160 154 C 210 164, 265 160, 320 150 L 320 200 L 0 200 Z"
        fill="#9cccf0"
      />
      <path
        d="M0 170 C 65 162, 125 166, 178 174 C 232 182, 282 178, 320 172 L 320 200 L 0 200 Z"
        fill="#7fbbe9"
      />
      <path
        d="M30 158 C 60 154, 90 155, 115 159"
        stroke="#eaf6ff"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M215 165 C 245 161, 275 161, 300 165"
        stroke="#eaf6ff"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* the swimmer */}
      <ellipse cx="160" cy="160" rx="20" ry="5" stroke="#eaf6ff" strokeWidth="2" fill="none" />
      <ellipse cx="160" cy="160" rx="32" ry="7" stroke="#eaf6ff" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path
        d="M138 158 C 144 150, 152 148, 158 151"
        stroke="#f6cdb0"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M168 155 C 176 148, 182 144, 186 138"
        stroke="#f6cdb0"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="160" cy="147" r="8" fill="#f6cdb0" />
      <path d="M152 145 A 8 8 0 0 1 168 144 L 167 140 A 9 9 0 0 0 153 141 Z" fill="#4b3a56" />
      <circle cx="157" cy="148" r="1" fill="#3d3350" />
      <circle cx="164" cy="148" r="1" fill="#3d3350" />
    </svg>
  );
}

function BurritoScene({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 200"
      className={className}
      role="img"
      aria-label="A man selling burritos in a nightclub"
    >
      <rect width="320" height="200" fill="#3d3350" />

      {/* light beams */}
      <polygon points="160,34 30,200 115,200" fill="#ffaec4" opacity="0.2" />
      <polygon points="160,34 195,200 300,200" fill="#9fdcc6" opacity="0.2" />
      <polygon points="160,34 115,200 205,200" fill="#ffd98a" opacity="0.14" />

      {/* disco ball */}
      <line x1="160" y1="0" x2="160" y2="18" stroke="#8b7ac2" strokeWidth="2" />
      <circle cx="160" cy="30" r="14" fill="#b6a4e8" />
      <line x1="148" y1="26" x2="172" y2="26" stroke="#cfc2f2" strokeWidth="1.5" />
      <line x1="147" y1="32" x2="173" y2="32" stroke="#cfc2f2" strokeWidth="1.5" />
      <line x1="155" y1="18" x2="155" y2="42" stroke="#cfc2f2" strokeWidth="1.5" />
      <line x1="165" y1="18" x2="165" y2="42" stroke="#cfc2f2" strokeWidth="1.5" />

      {/* neon sign */}
      <text
        x="200"
        y="56"
        fontFamily="monospace"
        fontSize="13"
        fontWeight="bold"
        fill="#ffd98a"
        transform="rotate(-3 200 56)"
      >
        BURRITOS $3
      </text>
      <line x1="200" y1="62" x2="288" y2="56" stroke="#ffaec4" strokeWidth="2" opacity="0.8" />
      <text x="48" y="70" fontSize="15" fill="#9fdcc6" opacity="0.9">♪</text>
      <text x="68" y="56" fontSize="11" fill="#ffaec4" opacity="0.9">♫</text>

      {/* dance floor */}
      <rect y="168" width="320" height="32" fill="#322a44" />
      <line x1="0" y1="176" x2="320" y2="176" stroke="#3d3350" strokeWidth="1" />
      <line x1="0" y1="186" x2="320" y2="186" stroke="#3d3350" strokeWidth="1" />

      {/* dancers */}
      <circle cx="250" cy="112" r="9" fill="#554a75" />
      <rect x="242" y="122" width="16" height="36" rx="8" fill="#554a75" />
      <path d="M254 126 C 260 118, 264 110, 266 102" stroke="#554a75" strokeWidth="6" strokeLinecap="round" fill="none" />
      <circle cx="290" cy="120" r="9" fill="#554a75" />
      <rect x="282" y="130" width="16" height="32" rx="8" fill="#554a75" />
      <path d="M286 134 C 278 126, 274 118, 272 110" stroke="#554a75" strokeWidth="6" strokeLinecap="round" fill="none" />

      {/* me, holding the cooler */}
      <ellipse cx="128" cy="176" rx="30" ry="5" fill="#2a2338" />
      <rect x="112" y="152" width="9" height="22" rx="4" fill="#8fa8e8" />
      <rect x="125" y="152" width="9" height="22" rx="4" fill="#8fa8e8" />
      <rect x="106" y="110" width="34" height="46" rx="16" fill="#ffaec4" />
      <circle cx="123" cy="98" r="11" fill="#f6cdb0" />
      <path d="M112 98 A 11 11 0 0 1 134 98 Z" fill="#4b3a56" />
      <circle cx="119" cy="99" r="1.3" fill="#3d3350" />
      <circle cx="127" cy="99" r="1.3" fill="#3d3350" />

      {/* raised arm holding a burrito like a torch */}
      <path d="M134 116 C 142 108, 148 100, 152 90" stroke="#ff97b3" strokeWidth="7" strokeLinecap="round" fill="none" />
      <rect x="146" y="68" width="10" height="22" rx="5" transform="rotate(15 151 79)" fill="#eef1f7" />
      <rect x="148" y="80" width="10" height="8" rx="4" transform="rotate(15 153 84)" fill="#eaa46e" />

      {/* arm to the cooler */}
      <path d="M110 124 C 122 130, 134 134, 144 138" stroke="#ff97b3" strokeWidth="7" strokeLinecap="round" fill="none" />

      {/* cooler full of foil burritos */}
      <rect x="148" y="118" width="9" height="20" rx="4.5" fill="#eef1f7" />
      <rect x="161" y="114" width="9" height="24" rx="4.5" fill="#eef1f7" />
      <rect x="174" y="118" width="9" height="20" rx="4.5" fill="#eef1f7" />
      <rect x="142" y="134" width="56" height="30" rx="5" fill="#bcd8ff" />
      <rect x="142" y="134" width="56" height="9" rx="4" fill="#eaf4ff" />
      <text x="152" y="157" fontFamily="monospace" fontSize="8" fill="#3d3350">HOT</text>
    </svg>
  );
}

const POSTCARDS: PostcardData[] = [
  {
    caption: "Río Grande · Big Bend, TX",
    title: "How I swam to Mexico",
    place: "Big Bend, West Texas",
    tilt: "-rotate-2",
    scene: <RiverScene className="block w-full rounded-sm" />,
    story: [
      "On a road trip through West Texas I ended up in Big Bend National Park, where the Rio Grande slips through a canyon — one wall is the United States, the other is Mexico, and in between there's maybe thirty meters of slow green water.",
      "There's an official crossing at Boquillas with a little rowboat ferry, but it wasn't running that day. So I did the reasonable thing: sealed my clothes and passport in a dry bag, held it over my head, and swam.",
      "The water was colder and the current pushier than it looked from the bank. Halfway across, treading water between two canyon walls, it hit me that I was literally swimming between two countries.",
      "On the far side I wrung out my shirt, walked into Boquillas del Carmen, and ate the best enchiladas of my life in a town you can only reach by boat or border post. Then I swam back. Time in Mexico: about two hours. Border crossings by breaststroke: one. Regrets: zero.",
    ],
  },
  {
    caption: "Northgate · College Station, TX",
    title: "The burrito hustle",
    place: "College Station, Texas",
    tilt: "rotate-2",
    scene: <BurritoScene className="block w-full rounded-sm" />,
    story: [
      "At Texas A&M my student visa said I wasn't allowed to work. What it didn't say was anything about a cooler full of burritos at 1 a.m. in Northgate — the bar strip across from campus.",
      "I'd spend the afternoon making fifty bean-and-cheese and egg burritos in my apartment kitchen, wrap them in foil, stack them in a cooler, and walk the clubs. After midnight, a dance floor full of hungry college students will pay cash for anything warm.",
      "Three dollars a burrito, sold out most nights. It paid my groceries and taught me more about demand, pricing and reading a customer than half my business degree.",
      "Still the best proof I have that constraints are just product requirements.",
    ],
  },
];

function Postcard({ data }: { data: PostcardData }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`group block w-48 ${data.tilt} rounded-md border border-ink/10 bg-white p-2 pb-2.5 shadow-[0_8px_0_rgba(107,91,143,0.12)] transition hover:rotate-0 hover:shadow-[0_10px_0_rgba(107,91,143,0.18)]`}
      >
        {data.scene}
        <span className="mt-2 block font-mono text-[10px] uppercase tracking-wider text-ink/50 transition group-hover:text-brass">
          {data.caption}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-end justify-center bg-plum/40 p-0 backdrop-blur-sm md:items-center md:p-8"
            onClick={() => setOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={data.title}
              initial={{ y: 40, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 30, opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border-4 border-white bg-card p-6 shadow-[0_18px_0_rgba(107,91,143,0.18)] md:rounded-3xl md:p-8"
            >
              <div className="mb-5 flex items-start justify-between gap-6">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-widest text-teal">
                    Postcard · true story
                  </p>
                  <h2 className="text-2xl font-extrabold text-brass">{data.title}</h2>
                  <p className="text-sm text-ink/55">{data.place}</p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="rounded-full border-2 border-brass/30 px-3 py-1.5 font-mono text-xs font-semibold text-brass transition hover:bg-brass hover:text-white"
                >
                  esc ✕
                </button>
              </div>

              <div className="overflow-hidden rounded-2xl border-2 border-white shadow-[0_6px_0_rgba(107,91,143,0.12)]">
                {data.scene}
              </div>

              <div className="mt-5 space-y-4 text-sm leading-relaxed text-ink/80">
                {data.story.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function Postcards() {
  return (
    <div>
      <h3 className="font-mono text-xs uppercase tracking-widest text-teal">Postcards</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink/70">
        True stories from off the clock — click a postcard.
      </p>
      <div className="mt-3 flex flex-wrap gap-5">
        {POSTCARDS.map((p) => (
          <Postcard key={p.title} data={p} />
        ))}
      </div>
    </div>
  );
}
