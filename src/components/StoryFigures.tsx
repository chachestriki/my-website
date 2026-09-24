"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, OrthographicCamera } from "@react-three/drei";
import { Group, MathUtils, Mesh } from "three";

export type FigureId =
  | "garments"
  | "rings"
  | "bridge"
  | "ledger"
  | "wave"
  | "rack"
  | "arc"
  | "lattice"
  | "send";

const INK = "#20242a";
const BRASS = "#b08d4a";
const PAPER = "#f7f5f1";

type P = { p: RefObject<number> };

/** on a dark chapter the ink parts would vanish, so they are painted in paper instead */
const OnDark = createContext(false);

/** deterministic pseudo-random, so the geometry is identical on every render */
function rand(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

type Layer = { key: number; figure: FigureId; out: boolean };

/** the one canvas for the whole page: figures fly off into depth and the next one arrives from it */
export default function StoryFigures({
  figure,
  p,
  onDark = false,
}: {
  figure: FigureId | null;
  p: RefObject<number>;
  onDark?: boolean;
}) {
  const [layers, setLayers] = useState<Layer[]>(() =>
    figure ? [{ key: 0, figure, out: false }] : [],
  );
  const nextKey = useRef(1);

  useEffect(() => {
    setLayers((prev) => {
      const current = prev.find((l) => !l.out);
      if (current?.figure === figure) return prev;
      const leaving = prev.map((l) => (l.out ? l : { ...l, out: true }));
      if (!figure) return leaving;
      return [...leaving, { key: nextKey.current++, figure, out: false }];
    });
  }, [figure]);

  const drop = useCallback((key: number) => {
    setLayers((prev) => prev.filter((l) => l.key !== key));
  }, []);

  return (
    <Canvas dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
      <FitCamera />
      <hemisphereLight args={["#ffffff", "#c9c4bb", 1.1]} />
      <directionalLight position={[4, 6, 5]} intensity={1.5} />
      <directionalLight position={[-5, 2, -3]} intensity={0.5} color={BRASS} />
      <OnDark.Provider value={onDark}>
        {layers.map((l) => (
          <FigureLayer key={l.key} figure={l.figure} out={l.out} p={p} onGone={() => drop(l.key)} />
        ))}
      </OnDark.Provider>
    </Canvas>
  );
}

/** presence animation: 0 is far away in the distance, 1 is in front of the reader */
function FigureLayer({
  figure,
  out,
  p,
  onGone,
}: {
  figure: FigureId;
  out: boolean;
  p: RefObject<number>;
  onGone: () => void;
}) {
  const g = useRef<Group>(null);
  const presence = useRef(0.02);
  const gone = useRef(false);

  useFrame((_, delta) => {
    const step = Math.min(delta, 0.05);
    presence.current = MathUtils.damp(presence.current, out ? 0 : 1, 3.6, step);
    const k = presence.current;
    if (g.current) {
      g.current.scale.setScalar(Math.max(0.001, k));
      g.current.position.z = (1 - k) * -30;
      g.current.position.y = (1 - k) * 1.6;
      g.current.rotation.y = (1 - k) * 1.1;
    }
    if (out && k < 0.03 && !gone.current) {
      gone.current = true;
      onGone();
    }
  });

  return (
    <Float speed={1.1} rotationIntensity={0.14} floatIntensity={0.3}>
      <group ref={g} scale={0.02}>
        <Figure figure={figure} p={p} />
      </group>
    </Float>
  );
}

/** the figures span roughly 8 world units, so the zoom follows the smaller canvas side */
function FitCamera() {
  const { size } = useThree();
  const zoom = MathUtils.clamp(Math.min(size.width, size.height) / 8.5, 22, 92);
  return (
    <OrthographicCamera
      makeDefault
      position={[3.4, 3.2, 6]}
      zoom={zoom}
      near={-50}
      far={80}
      onUpdate={(c) => c.lookAt(0, 0, 0)}
    />
  );
}

function Figure({ figure, p }: { figure: FigureId; p: RefObject<number> }) {
  switch (figure) {
    case "garments":
      return <Garments p={p} />;
    case "rings":
      return <Rings p={p} />;
    case "bridge":
      return <Bridge p={p} />;
    case "ledger":
      return <Ledger p={p} />;
    case "wave":
      return <Wave p={p} />;
    case "rack":
      return <Rack p={p} />;
    case "arc":
      return <Arc p={p} />;
    case "lattice":
      return <Lattice p={p} />;
    case "send":
      return <Send p={p} />;
    default:
      return <Rings p={p} />;
  }
}

/* ---------------- vice resell: rails of hangers and clothes turning in the air ----------------
   scrolling pulls the two rails apart and opens them out                                        */
function Garments({ p }: P) {
  const spin = useRef<Group>(null);
  const rails = useRef<Group>(null);
  const ease = useEased(p);

  const pieces = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        ring: i % 2,
        angle: (i / 12) * Math.PI * 2 + (i % 2) * 0.26,
        drop: 0.6 + rand(i + 40) * 0.55,
        brass: i % 5 === 0,
      })),
    [],
  );

  useFrame((state, delta) => {
    const v = ease(delta);
    if (spin.current) spin.current.rotation.y = state.clock.elapsedTime * 0.26;
    if (rails.current) {
      rails.current.children.forEach((c, i) => {
        const dir = i === 0 ? 1 : -1;
        c.position.y = dir * (0.5 + v * 1.1);
        c.rotation.y = state.clock.elapsedTime * 0.5 * dir;
        c.scale.setScalar(1 + v * 0.2);
      });
    }
  });

  return (
    <group ref={spin}>
      {/* the pole the rails hang from */}
      <mesh>
        <cylinderGeometry args={[0.05, 0.05, 4.4, 16]} />
        <Metal color={BRASS} />
      </mesh>
      {[1, -1].map((s) => (
        <mesh key={s} position={[0, s * 2.25, 0]}>
          <sphereGeometry args={[0.16, 24, 16]} />
          <Metal color={BRASS} />
        </mesh>
      ))}

      <group ref={rails}>
        {[2.1, 2.8].map((radius, r) => (
          <group key={radius}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[radius, 0.035, 12, 96]} />
              <Metal color={BRASS} />
            </mesh>
            {pieces
              .filter((g) => g.ring === r)
              .map((g, i) => (
                <group key={i} position={[Math.cos(g.angle) * radius, 0, Math.sin(g.angle) * radius]}>
                  <mesh position={[0, -0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[0.12, 0.018, 8, 24]} />
                    <Metal color={BRASS} />
                  </mesh>
                  <mesh position={[0, -0.42 - g.drop / 2, 0]} rotation={[0, g.angle, 0]}>
                    <boxGeometry args={[0.46, g.drop, 0.09]} />
                    <Metal color={g.brass ? BRASS : PAPER} rough={0.9} />
                  </mesh>
                </group>
              ))}
          </group>
        ))}
      </group>
    </group>
  );
}

/** smoothed read of the chapter progress, so a flicked scroll still eases */
function useEased(p: RefObject<number>) {
  const v = useRef(0);
  return (delta: number) => {
    v.current = MathUtils.damp(v.current, p.current, 6, Math.min(delta, 0.05));
    return v.current;
  };
}

function Metal({ color = INK, rough = 0.32 }: { color?: string; rough?: number }) {
  const onDark = useContext(OnDark);
  const c = onDark && color === INK ? "#cfd3d8" : color;
  return <meshStandardMaterial color={c} roughness={rough} metalness={c === BRASS ? 0.75 : 0.25} />;
}

/* ---------------- hero: two rings locking into one mark ---------------- */
function Rings({ p }: P) {
  const a = useRef<Mesh>(null);
  const b = useRef<Mesh>(null);
  const ease = useEased(p);

  useFrame((_, delta) => {
    const v = ease(delta);
    if (a.current) {
      a.current.rotation.y += delta * 0.35;
      a.current.rotation.z = -0.5 + v * 0.5;
      a.current.position.x = -0.85 + v * 0.85;
    }
    if (b.current) {
      b.current.rotation.x += delta * 0.28;
      b.current.position.x = 0.85 - v * 0.85;
    }
  });

  return (
    <group>
      <mesh ref={a}>
        <torusGeometry args={[1.25, 0.1, 28, 120]} />
        <Metal />
      </mesh>
      <mesh ref={b} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.25, 0.1, 28, 120]} />
        <Metal color={BRASS} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.42, 0]} />
        <Metal color={PAPER} rough={0.6} />
      </mesh>
    </group>
  );
}

/* ---------------- two systems wired together ---------------- */
function Bridge({ p }: P) {
  const packets = useRef<Group>(null);
  const beam = useRef<Mesh>(null);
  const ease = useEased(p);

  useFrame((state, delta) => {
    const v = ease(delta);
    if (beam.current) beam.current.scale.x = Math.max(0.001, v);
    if (packets.current) {
      packets.current.children.forEach((c, i) => {
        const t = (state.clock.elapsedTime * 0.45 + i * 0.33) % 1;
        c.position.x = -1.9 + t * 3.8 * v;
        c.visible = v > 0.08;
      });
    }
  });

  return (
    <group>
      <mesh position={[-2.3, 0, 0]}>
        <boxGeometry args={[1.1, 1.6, 1.1]} />
        <Metal />
      </mesh>
      <mesh position={[2.3, 0, 0]}>
        <boxGeometry args={[1.1, 1.6, 1.1]} />
        <Metal />
      </mesh>
      <mesh ref={beam} position={[0, 0, 0]}>
        <boxGeometry args={[3.6, 0.07, 0.07]} />
        <Metal color={BRASS} />
      </mesh>
      <group ref={packets}>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.13, 20, 20]} />
            <Metal color={BRASS} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* ---------------- a card, and the folio settling under it ---------------- */
function Ledger({ p }: P) {
  const card = useRef<Mesh>(null);
  const plates = useRef<Group>(null);
  const ease = useEased(p);

  useFrame((_, delta) => {
    const v = ease(delta);
    if (card.current) {
      card.current.rotation.z = -0.5 + v * 0.42;
      card.current.rotation.y = 0.5 - v * 0.8;
      card.current.position.y = 1.5 - v * 0.9;
    }
    plates.current?.children.forEach((c, i) => {
      const local = MathUtils.clamp((v - i * 0.16) * 3.2, 0, 1);
      c.scale.setScalar(0.001 + local);
      c.position.y = -0.7 - i * 0.34;
    });
  });

  return (
    <group>
      <mesh ref={card} position={[0, 1.5, 0]}>
        <boxGeometry args={[2.3, 1.45, 0.09]} />
        <Metal color={BRASS} rough={0.28} />
      </mesh>
      <group ref={plates}>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i}>
            <boxGeometry args={[2.6, 0.16, 1.7]} />
            <Metal color={i === 1 ? PAPER : INK} rough={0.55} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Wave({ p }: P) {
  const bars = useRef<Group>(null);
  const ease = useEased(p);

  useFrame((state, delta) => {
    const v = ease(delta);
    bars.current?.children.forEach((c, i) => {
      const h = 0.3 + Math.abs(Math.sin(i * 0.8 + state.clock.elapsedTime * 1.6)) * 2.6 * v;
      c.scale.y = Math.max(0.05, h);
      c.position.y = c.scale.y / 2 - 1.2;
    });
  });

  return (
    <group ref={bars}>
      {Array.from({ length: 16 }, (_, i) => (
        <mesh key={i} position={[-3 + i * 0.4, 0, 0]}>
          <boxGeometry args={[0.18, 1, 0.18]} />
          <Metal color={i % 4 === 0 ? BRASS : INK} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------------- racked infrastructure sliding home ---------------- */
function Rack({ p }: P) {
  const slabs = useRef<Group>(null);
  const ease = useEased(p);

  useFrame((_, delta) => {
    const v = ease(delta);
    slabs.current?.children.forEach((c, i) => {
      const local = MathUtils.clamp((v - i * 0.13) * 3, 0, 1);
      c.position.z = MathUtils.lerp(2.6, 0, local);
    });
  });

  return (
    <group>
      <mesh position={[0, 0, -0.9]}>
        <boxGeometry args={[3.1, 4.2, 0.14]} />
        <Metal color={PAPER} rough={0.7} />
      </mesh>
      <group ref={slabs}>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} position={[0, 1.6 - i * 0.8, 0]}>
            <boxGeometry args={[2.7, 0.55, 1.5]} />
            <Metal color={i === 1 ? BRASS : INK} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* ---------------- Madrid and Texas on the same arc ---------------- */
function Arc({ p }: P) {
  const globe = useRef<Mesh>(null);
  const traveller = useRef<Mesh>(null);
  const ease = useEased(p);

  useFrame((_, delta) => {
    const v = ease(delta);
    if (globe.current) globe.current.rotation.y += delta * 0.18;
    if (traveller.current) {
      const a = Math.PI * (1 - v);
      traveller.current.position.set(Math.cos(a) * 2.5, Math.sin(a) * 2.5, 0);
    }
  });

  return (
    <group>
      <mesh ref={globe}>
        <sphereGeometry args={[1.7, 40, 40]} />
        <Metal color={INK} rough={0.55} />
      </mesh>
      <mesh rotation={[0, 0, 0]}>
        <torusGeometry args={[2.5, 0.035, 16, 120, Math.PI]} />
        <Metal color={BRASS} />
      </mesh>
      <mesh ref={traveller}>
        <sphereGeometry args={[0.16, 20, 20]} />
        <Metal color={BRASS} />
      </mesh>
    </group>
  );
}

/* ---------------- the stack, stacking ---------------- */
function Lattice({ p }: P) {
  const cubes = useRef<Group>(null);
  const cells = useMemo(
    () =>
      Array.from({ length: 27 }, (_, i) => ({
        pos: [((i % 3) - 1) * 1.05, (Math.floor(i / 3) % 3) - 1, (Math.floor(i / 9) - 1) * 1.05] as const,
        seed: rand(i + 7),
      })),
    [],
  );
  const ease = useEased(p);

  useFrame((_, delta) => {
    const v = ease(delta);
    if (!cubes.current) return;
    cubes.current.rotation.y = -0.6 + v * 1.5;
    cubes.current.children.forEach((c, i) => {
      const local = MathUtils.clamp(v * 1.6 - cells[i].seed * 0.6, 0, 1);
      c.scale.setScalar(0.02 + local * 0.9);
      c.position.y = MathUtils.lerp(cells[i].pos[1] + 3.5 * (1 - local), cells[i].pos[1], 1) * 1.05;
    });
  });

  return (
    <group ref={cubes}>
      {cells.map((c, i) => (
        <mesh key={i} position={[c.pos[0], c.pos[1] * 1.05, c.pos[2]]}>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <Metal color={i % 7 === 0 ? BRASS : INK} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------------- the last screen: a sheet folding into a send ---------------- */
function Send({ p }: P) {
  const flap = useRef<Mesh>(null);
  const note = useRef<Mesh>(null);
  const ease = useEased(p);

  useFrame((_, delta) => {
    const v = ease(delta);
    if (flap.current) flap.current.rotation.x = -v * 2.2;
    if (note.current) note.current.position.y = -0.2 + v * 1.5;
  });

  return (
    <group rotation={[0.1, -0.35, 0]}>
      <mesh ref={note} position={[0, -0.2, 0]}>
        <boxGeometry args={[2.2, 1.5, 0.05]} />
        <Metal color={PAPER} rough={0.7} />
      </mesh>
      <mesh position={[0, -0.6, 0.3]}>
        <boxGeometry args={[2.8, 1.8, 0.12]} />
        <Metal />
      </mesh>
      <mesh ref={flap} position={[0, 0.3, 0.3]}>
        <boxGeometry args={[2.8, 1.2, 0.08]} />
        <Metal color={BRASS} />
      </mesh>
    </group>
  );
}
