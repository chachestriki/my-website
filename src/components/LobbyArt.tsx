export default function LobbyArt() {
  const pigeonholes = Array.from({ length: 24 }, (_, i) => ({
    x: 100 + (i % 6) * 54,
    y: 170 + Math.floor(i / 6) * 64,
    hasKey: i % 3 !== 1,
  }));

  return (
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#141d35" />
          <stop offset="100%" stopColor="#0a1122" />
        </linearGradient>
        <linearGradient id="desk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a2a1c" />
          <stop offset="100%" stopColor="#1a1208" />
        </linearGradient>
        <linearGradient id="brassGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f0d08a" />
          <stop offset="100%" stopColor="#9c7b38" />
        </linearGradient>
        <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#d8b26a" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#d8b26a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="screenGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#4fd1c5" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#4fd1c5" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* back wall */}
      <rect x="0" y="0" width="1600" height="600" fill="url(#wall)" />
      {Array.from({ length: 10 }, (_, i) => (
        <rect key={i} x={i * 160} y="0" width="2" height="600" fill="#d8b26a" opacity="0.05" />
      ))}
      <rect x="0" y="588" width="1600" height="6" fill="#d8b26a" opacity="0.18" />

      {/* chandelier */}
      <line x1="800" y1="0" x2="800" y2="70" stroke="#d8b26a" strokeWidth="2" opacity="0.5" />
      <ellipse cx="800" cy="120" rx="240" ry="120" fill="url(#glow)" />
      {[-90, -45, 0, 45, 90].map((dx) => (
        <g key={dx}>
          <line x1="800" y1="70" x2={800 + dx} y2={96} stroke="#d8b26a" strokeWidth="1.5" opacity="0.5" />
          <circle cx={800 + dx} cy={100} r="7" fill="#f4dfae" opacity="0.9" />
          <circle cx={800 + dx} cy={100} r="18" fill="url(#glow)" />
        </g>
      ))}

      {/* neon sign */}
      <text
        x="800"
        y="250"
        textAnchor="middle"
        fontSize="42"
        letterSpacing="14"
        fill="url(#brassGrad)"
        fontFamily="var(--font-geist-mono), monospace"
      >
        HOTEL INTEGRACIÓN
      </text>
      <text
        x="800"
        y="286"
        textAnchor="middle"
        fontSize="16"
        letterSpacing="8"
        fill="#4fd1c5"
        opacity="0.75"
        fontFamily="var(--font-geist-mono), monospace"
      >
        EST. MADRID · OPEN 24/7
      </text>

      {/* key rack (left) */}
      <rect x="78" y="150" width="344" height="286" rx="8" fill="#12192e" stroke="#d8b26a" strokeOpacity="0.35" strokeWidth="2" />
      {pigeonholes.map((p, i) => (
        <g key={i}>
          <rect x={p.x} y={p.y} width="44" height="52" rx="3" fill="#0a0f1e" stroke="#d8b26a" strokeOpacity="0.2" />
          {p.hasKey && (
            <g opacity="0.9">
              <circle cx={p.x + 22} cy={p.y + 18} r="6" fill="none" stroke="#e8c98a" strokeWidth="2.5" />
              <path
                d={`M ${p.x + 22} ${p.y + 24} L ${p.x + 22} ${p.y + 42} M ${p.x + 22} ${p.y + 34} L ${p.x + 29} ${p.y + 34} M ${p.x + 22} ${p.y + 40} L ${p.x + 28} ${p.y + 40}`}
                stroke="#e8c98a"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </g>
          )}
        </g>
      ))}

      {/* elevator (right) */}
      <rect x="1240" y="170" width="250" height="420" rx="6" fill="#0d1426" stroke="#d8b26a" strokeOpacity="0.35" strokeWidth="2" />
      <line x1="1365" y1="190" x2="1365" y2="590" stroke="#d8b26a" strokeOpacity="0.25" strokeWidth="2" />
      <rect x="1300" y="132" width="130" height="26" rx="4" fill="#0a1020" stroke="#d8b26a" strokeOpacity="0.3" />
      <circle cx="1330" cy="145" r="5" fill="#4fd1c5" opacity="0.9" />
      <circle cx="1355" cy="145" r="5" fill="#d8b26a" opacity="0.35" />
      <circle cx="1380" cy="145" r="5" fill="#d8b26a" opacity="0.35" />
      <circle cx="1405" cy="145" r="5" fill="#d8b26a" opacity="0.35" />

      {/* floor */}
      <rect x="0" y="594" width="1600" height="306" fill="#080d1a" />
      <path d="M 250 900 L 600 730 L 1000 730 L 1350 900 Z" fill="#2a1f3d" opacity="0.55" />
      <path d="M 300 890 L 628 742 L 972 742 L 1300 890 Z" fill="none" stroke="#d8b26a" strokeOpacity="0.25" strokeWidth="2" />

      {/* reception desk */}
      <path d="M 445 690 L 470 520 L 1130 520 L 1155 690 Z" fill="url(#desk)" stroke="#d8b26a" strokeOpacity="0.4" strokeWidth="2" />
      <path d="M 424 520 L 1176 520 L 1180 548 L 420 548 Z" fill="#4a3620" />
      <path d="M 424 512 L 1176 512 L 1182 542 L 418 542 Z" fill="url(#brassGrad)" opacity="0.55" />
      <text
        x="800"
        y="625"
        textAnchor="middle"
        fontSize="24"
        letterSpacing="10"
        fill="#d8b26a"
        opacity="0.75"
        fontFamily="var(--font-geist-mono), monospace"
      >
        RECEPCIÓN
      </text>

      {/* terminal on desk */}
      <ellipse cx="1055" cy="450" rx="150" ry="110" fill="url(#screenGlow)" />
      <rect x="975" y="380" width="165" height="112" rx="6" fill="#050a14" stroke="#d8b26a" strokeOpacity="0.5" strokeWidth="2" />
      <rect x="985" y="390" width="145" height="92" rx="3" fill="#07131a" />
      {Array.from({ length: 7 }, (_, i) => (
        <rect
          key={i}
          x="994"
          y={400 + i * 12}
          width={Math.max(24, ((i * 37) % 110) + 20)}
          height="5"
          rx="2"
          fill="#4fd1c5"
          opacity={0.25 + (i % 3) * 0.2}
        />
      ))}
      <rect x="1040" y="492" width="36" height="20" fill="#1a1208" stroke="#d8b26a" strokeOpacity="0.4" />
      <rect x="1015" y="512" width="86" height="7" rx="3" fill="#2a1f14" stroke="#d8b26a" strokeOpacity="0.4" />

      {/* phone on desk */}
      <g>
        <rect x="500" y="486" width="94" height="30" rx="6" fill="#141020" stroke="#d8b26a" strokeOpacity="0.5" strokeWidth="2" />
        <rect x="492" y="470" width="110" height="16" rx="8" fill="#241c33" stroke="#d8b26a" strokeOpacity="0.55" strokeWidth="2" />
        <path d="M 600 500 q 26 10 4 18" fill="none" stroke="#d8b26a" strokeOpacity="0.4" strokeWidth="2" />
      </g>

      {/* service bell */}
      <g>
        <ellipse cx="875" cy="516" rx="34" ry="8" fill="url(#brassGrad)" opacity="0.8" />
        <path d="M 847 512 a 28 26 0 0 1 56 0 Z" fill="url(#brassGrad)" />
        <circle cx="875" cy="482" r="6" fill="#f4dfae" />
        <ellipse cx="875" cy="500" rx="70" ry="50" fill="url(#glow)" />
      </g>

      {/* plants */}
      {[
        { x: 120, y: 600 },
        { x: 1480, y: 610 },
      ].map((p) => (
        <g key={p.x} transform={`translate(${p.x} ${p.y})`}>
          <path d="M -26 0 L 26 0 L 18 70 L -18 70 Z" fill="#1b2438" stroke="#d8b26a" strokeOpacity="0.3" strokeWidth="2" />
          {[-40, -18, 0, 18, 40].map((a) => (
            <path
              key={a}
              d={`M 0 0 q ${a} -52 ${a * 1.5} -78`}
              fill="none"
              stroke="#2f7d68"
              strokeWidth="6"
              strokeLinecap="round"
              opacity="0.85"
            />
          ))}
        </g>
      ))}
    </svg>
  );
}
