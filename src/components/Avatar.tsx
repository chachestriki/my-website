"use client";

/** Depth-scaled walking character. Coordinates are % of the 16:9 stage. */
export default function Avatar({
  x,
  y,
  facing,
  walking,
}: {
  x: number;
  y: number;
  facing: 1 | -1;
  walking: boolean;
}) {
  // near the back wall the character is smaller — cheap fake perspective
  const depth = Math.min(1, Math.max(0, (y - 81) / 15));
  const scale = 0.78 + depth * 0.42;

  return (
    <div
      className="pointer-events-none absolute z-20 will-change-transform"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%, -100%) scale(${scale})`,
        transformOrigin: "bottom center",
      }}
    >
      <svg width="86" height="140" viewBox="0 0 86 140" aria-label="You, walking through the lobby" role="img">
        <ellipse cx="43" cy="133" rx="24" ry="6" fill="#000" opacity="0.45" />
        <g transform={`scale(${facing} 1) translate(${facing === -1 ? -86 : 0} 0)`}>
          <g className={walking ? "animate-[walkbob_0.42s_ease-in-out_infinite]" : undefined}>
            {/* legs */}
            <g className={walking ? "animate-[legswing_0.42s_ease-in-out_infinite]" : undefined} style={{ transformOrigin: "43px 96px" }}>
              <rect x="33" y="92" width="9" height="38" rx="4" fill="#1d2a45" />
            </g>
            <g
              className={walking ? "animate-[legswing_0.42s_ease-in-out_infinite_reverse]" : undefined}
              style={{ transformOrigin: "43px 96px" }}
            >
              <rect x="45" y="92" width="9" height="38" rx="4" fill="#243354" />
            </g>
            {/* torso: concierge-ish jacket */}
            <path d="M 27 52 q 16 -8 32 0 l 5 44 q -21 7 -42 0 Z" fill="#2a1f3d" stroke="#d8b26a" strokeOpacity="0.5" strokeWidth="1.5" />
            <path d="M 43 46 L 43 96" stroke="#d8b26a" strokeOpacity="0.45" strokeWidth="1.2" />
            {/* arms */}
            <g className={walking ? "animate-[legswing_0.42s_ease-in-out_infinite_reverse]" : undefined} style={{ transformOrigin: "30px 58px" }}>
              <rect x="20" y="54" width="8" height="36" rx="4" fill="#33264a" />
            </g>
            <g className={walking ? "animate-[legswing_0.42s_ease-in-out_infinite]" : undefined} style={{ transformOrigin: "58px 58px" }}>
              <rect x="58" y="54" width="8" height="36" rx="4" fill="#33264a" />
            </g>
            {/* head */}
            <circle cx="43" cy="33" r="15" fill="#e8c9a6" />
            <path d="M 28 30 q 15 -18 30 0 q -6 -8 -15 -8 q -9 0 -15 8 Z" fill="#2b1d16" />
            <circle cx="49" cy="34" r="1.8" fill="#1a1208" />
            <circle cx="39" cy="34" r="1.8" fill="#1a1208" />
            {/* bellhop collar */}
            <path d="M 31 50 l 12 6 l 12 -6" fill="none" stroke="#d8b26a" strokeWidth="2" />
          </g>
        </g>
      </svg>
    </div>
  );
}
