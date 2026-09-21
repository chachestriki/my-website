"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { boardEdges, boardNodes, roles, type BoardNode } from "@/data/cv";

const KIND_STYLE: Record<BoardNode["kind"], { fill: string; stroke: string; tag: string }> = {
  system: { fill: "#d9f2ea", stroke: "#2f9e8f", tag: "SYSTEM" },
  service: { fill: "#ffe2ea", stroke: "#d3607f", tag: "SERVICE" },
  agent: { fill: "#e9e2ff", stroke: "#8b7ac2", tag: "AGENT" },
  store: { fill: "#dfebff", stroke: "#5b8fd6", tag: "MARKET" },
};

const W = 100;
const H = 100;
const NODE_W = 22;
const NODE_H = 9;

function center(id: string) {
  const n = boardNodes.find((b) => b.id === id)!;
  return { x: n.x + NODE_W / 2, y: n.y + NODE_H / 2 };
}

function edgePath(fromId: string, toId: string) {
  const a = center(fromId);
  const b = center(toId);
  const mx = (a.x + b.x) / 2;
  return `M ${a.x} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`;
}

export default function IntegrationBoard() {
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const active = hovered ?? selected;
  const activeEdges = useMemo(
    () => new Set(boardEdges.filter((e) => e.from === active || e.to === active).map((e) => `${e.from}-${e.to}`)),
    [active],
  );

  const node = boardNodes.find((n) => n.id === selected) ?? null;
  const role = node ? roles.find((r) => r.id === node.roleId) ?? null : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      <div className="relative overflow-hidden rounded-2xl border-2 border-white bg-[#fff6ea] shadow-[0_6px_0_rgba(107,91,143,0.1)]">
        <div className="pointer-events-none absolute inset-0 opacity-[0.5] [background-image:linear-gradient(rgba(139,122,194,.1)_1px,transparent_1px),linear-gradient(90deg,rgba(139,122,194,.1)_1px,transparent_1px)] [background-size:28px_28px]" />
        <svg viewBox={`-2 -2 ${W + 4} ${H + 4}`} className="relative block h-full w-full" role="img" aria-label="Integration architecture diagram">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#d3607f" opacity="0.7" />
            </marker>
          </defs>

          {boardEdges.map((e) => {
            const d = edgePath(e.from, e.to);
            const key = `${e.from}-${e.to}`;
            const dim = active !== null && !activeEdges.has(key);
            return (
              <g key={key} opacity={dim ? 0.15 : 1}>
                <path d={d} fill="none" stroke="#d3607f" strokeWidth={0.28} strokeOpacity={0.55} markerEnd="url(#arrow)" />
                <circle r={0.75} fill="#2f9e8f">
                  <animateMotion dur={`${3 + (e.packet.length % 3)}s`} repeatCount="indefinite" path={d} />
                </circle>
              </g>
            );
          })}

          {boardEdges.map((e) => {
            const a = center(e.from);
            const b = center(e.to);
            const key = `${e.from}-${e.to}-label`;
            const dim = active !== null && !activeEdges.has(`${e.from}-${e.to}`);
            return (
              <text
                key={key}
                x={(a.x + b.x) / 2}
                y={(a.y + b.y) / 2 - 0.8}
                textAnchor="middle"
                fontSize={1.8}
                fill="#8b7ac2"
                opacity={dim ? 0.12 : 0.85}
                className="font-mono"
              >
                {e.label}
              </text>
            );
          })}

          {boardNodes.map((n) => {
            const s = KIND_STYLE[n.kind];
            const isActive = active === n.id;
            const dim = active !== null && !isActive && !boardEdges.some(
              (e) => (e.from === active && e.to === n.id) || (e.to === active && e.from === n.id),
            );
            return (
              <g
                key={n.id}
                transform={`translate(${n.x} ${n.y})`}
                opacity={dim ? 0.3 : 1}
                className="cursor-pointer"
                onMouseEnter={() => setHovered(n.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setSelected(n.id)}
                tabIndex={0}
                role="button"
                aria-label={`${n.label} — ${s.tag}`}
                onKeyDown={(ev) => {
                  if (ev.key === "Enter" || ev.key === " ") {
                    ev.preventDefault();
                    setSelected(n.id);
                  }
                }}
              >
                <rect
                  width={NODE_W}
                  height={NODE_H}
                  rx={1.4}
                  fill={s.fill}
                  stroke={s.stroke}
                  strokeWidth={isActive ? 0.6 : 0.3}
                />
                <rect width={NODE_W} height={1} rx={0.5} fill={s.stroke} opacity={0.5} />
                <text x={1.6} y={4.6} fontSize={2.2} fill="#4a3f63" className="font-semibold">
                  {n.label}
                </text>
                <text x={1.6} y={7.3} fontSize={1.7} fill={s.stroke} className="font-mono" opacity={0.9}>
                  {s.tag}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <motion.aside
        key={node?.id ?? "empty"}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border-2 border-white bg-[#fff6ea] p-5 shadow-[0_6px_0_rgba(107,91,143,0.1)]"
      >
        {node ? (
          <>
            <p className="font-mono text-xs uppercase tracking-widest text-teal">{KIND_STYLE[node.kind].tag}</p>
            <h3 className="mt-1 text-xl font-semibold text-brass">{node.label}</h3>
            {role && (
              <p className="mt-1 font-mono text-xs text-ink/50">
                {role.company} · {role.period}
              </p>
            )}
            <p className="mt-3 text-sm leading-relaxed text-ink/80">{node.blurb}</p>
            {role && (
              <>
                <p className="mt-5 font-mono text-xs uppercase tracking-widest text-ink/40">What I shipped</p>
                <ul className="mt-2 space-y-2 text-sm text-ink/75">
                  {role.highlights.map((h) => (
                    <li key={h} className="flex gap-2">
                      <span className="text-brass">▸</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {role.stack.map((s) => (
                    <span key={s} className="rounded border border-brass/25 px-2 py-0.5 font-mono text-[11px] text-brass/90">
                      {s}
                    </span>
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <p className="font-mono text-xs uppercase tracking-widest text-teal">Integration board</p>
            <h3 className="mt-1 text-xl font-semibold text-brass">Pick a node</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink/70">
              Every box is a system I&apos;ve wired into another one. The moving dots are real payloads —
              reservations, guest profiles, card authorizations, agent tool calls. Hover to isolate a
              subgraph, click to read the case study.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-ink/60">
              {Object.entries(KIND_STYLE).map(([k, v]) => (
                <li key={k} className="flex items-center gap-2 font-mono text-xs">
                  <span className="inline-block h-3 w-3 rounded-sm border" style={{ borderColor: v.stroke, background: v.fill }} />
                  {v.tag}
                </li>
              ))}
            </ul>
          </>
        )}
      </motion.aside>
    </div>
  );
}
