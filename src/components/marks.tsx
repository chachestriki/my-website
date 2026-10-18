const marks: Record<string, { letters: string; label: string; bg: string }> = {
  "room-mate": { letters: "RM", label: "Room Mate", bg: "#c45c26" },
  mastel: { letters: "MH", label: "Mastel", bg: "#1a4f8b" },
  "vice-resell": { letters: "VR", label: "Vice Resell", bg: "#6b2d5b" },
  odyn: { letters: "OD", label: "Odyn", bg: "#0d6b6b" },
  lenovo: { letters: "LN", label: "Lenovo", bg: "#c41212" },
};

export function ExperienceMark({ id }: { id: string }) {
  const mark = marks[id];
  if (!mark) return null;

  return (
    <svg className="mark" viewBox="0 0 64 64" role="img" aria-label={`${mark.label} mark`}>
      <rect width="64" height="64" fill={mark.bg} />
      <rect x="3" y="3" width="58" height="58" fill="none" stroke="#fff" strokeWidth="2" />
      <text
        x="32"
        y="40"
        textAnchor="middle"
        fill="#fff"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="20"
        fontWeight="700"
      >
        {mark.letters}
      </text>
    </svg>
  );
}

function Box({
  x,
  y,
  w,
  h,
  fill,
  title,
  sub,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  fill: string;
  title: string;
  sub?: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={fill} stroke="#111" strokeWidth="2" />
      <text
        x={x + w / 2}
        y={sub ? y + 28 : y + h / 2 + 5}
        textAnchor="middle"
        fill="#111"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="13"
        fontWeight="700"
      >
        {title}
      </text>
      {sub ? (
        <text
          x={x + w / 2}
          y={y + 46}
          textAnchor="middle"
          fill="#222"
          fontFamily="Courier New, Courier, monospace"
          fontSize="11"
        >
          {sub}
        </text>
      ) : null}
    </g>
  );
}

function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const pointsRight = x2 >= x1;
  const tip = pointsRight ? x2 : x2;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#111" strokeWidth="2" />
      <polygon
        points={
          pointsRight
            ? `${tip},${y2} ${tip - 8},${y2 - 5} ${tip - 8},${y2 + 5}`
            : `${tip},${y2} ${tip + 8},${y2 - 5} ${tip + 8},${y2 + 5}`
        }
        fill="#111"
      />
    </g>
  );
}

function Sheet({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 320 168" role="img" aria-label={label}>
      <rect width="320" height="168" fill="none" />
      {children}
    </svg>
  );
}

const captions: Record<string, string> = {
  "opera-salesforce": "Opera Cloud and Salesforce, trading guests and reservations.",
  "mcp-tools": "Hotel systems behind a tool layer, then an agent.",
};

export function sketchCaption(id: string) {
  return captions[id];
}

export function ProjectSketch({ id }: { id: string }) {
  const label = captions[id] ?? "Project diagram";

  if (id === "opera-salesforce") {
    return (
      <Sheet label={label}>
        <Box x={16} y={48} w={110} h={72} fill="#f4d7a1" title="Opera Cloud" sub="PMS" />
        <Box x={194} y={48} w={110} h={72} fill="#c5d8f6" title="Salesforce" sub="CRM" />
        <Arrow x1={126} y1={74} x2={186} y2={74} />
        <Arrow x1={186} y1={96} x2={126} y2={96} />
      </Sheet>
    );
  }

  if (id === "mcp-tools") {
    return (
      <Sheet label={label}>
        <Box x={12} y={50} w={80} h={64} fill="#f4d7a1" title="PMS" />
        <Box x={120} y={50} w={80} h={64} fill="#d7c4f2" title="Tools" sub="MCP" />
        <Box x={228} y={50} w={80} h={64} fill="#c8efd4" title="Agent" />
        <Arrow x1={92} y1={82} x2={120} y2={82} />
        <Arrow x1={200} y1={82} x2={228} y2={82} />
      </Sheet>
    );
  }

  return null;
}
