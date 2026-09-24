"use client";

import { useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrthographicCamera } from "@react-three/drei";
import { Group, InstancedMesh, MathUtils, Mesh, Object3D } from "three";

export type FigureId =
  | "monument"
  | "rings"
  | "bridge"
  | "ledger"
  | "crowd"
  | "wave"
  | "rack"
  | "arc"
  | "lattice"
  | "send";

const INK = "#20242a";
const BRASS = "#b08d4a";
const PAPER = "#f7f5f1";

type P = { p: RefObject<number> };

/** deterministic pseudo-random, so the geometry is identical on every render */
function rand(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/** the one canvas for the whole page: the active chapter decides which figure is mounted */
export default function StoryFigures({ figure, p }: { figure: FigureId; p: RefObject<number> }) {
  return (
    <Canvas dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
      <OrthographicCamera makeDefault position={[3.4, 3.2, 6]} zoom={78} near={-50} far={80} />
      <hemisphereLight args={["#ffffff", "#c9c4bb", 1.1]} />
      <directionalLight position={[4, 6, 5]} intensity={1.5} />
      <directionalLight position={[-5, 2, -3]} intensity={0.5} color={BRASS} />
      <Float speed={1.1} rotationIntensity={0.14} floatIntensity={0.3}>
        <Figure figure={figure} p={p} />
      </Float>
    </Canvas>
  );
}

function Figure({ figure, p }: { figure: FigureId; p: RefObject<number> }) {
  switch (figure) {
    case "monument":
      return <Monument p={p} />;
    case "rings":
      return <Rings p={p} />;
    case "bridge":
      return <Bridge p={p} />;
    case "ledger":
      return <Ledger p={p} />;
    case "crowd":
      return <Crowd p={p} />;
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
      return <Monument p={p} />;
  }
}

/* ---------------- hero: the whole career as one floating object ----------------
   a hotel on a torn slab, ringed by rails of hangers and clothes, turning on its
   vertical axis; scrolling lifts the rails and opens the rings out                */
function Monument({ p }: P) {
  const spin = useRef<Group>(null);
  const rails = useRef<Group>(null);
  const ease = useEased(p);

  const windows = useMemo(
    () =>
      Array.from({ length: 5 * 4 * 2 }, (_, i) => {
        const floor = Math.floor(i / 8);
        const col = i % 4;
        const side = i % 8 < 4 ? 1 : -1;
        return { floor, col, side, lit: rand(i) > 0.35 };
      }),
    [],
  );

  const garments = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        ring: i % 2,
        angle: (i / 11) * Math.PI * 2 + (i % 2) * 0.28,
        drop: 0.55 + rand(i + 40) * 0.5,
        brass: i % 5 === 0,
      })),
    [],
  );

  useFrame((state, delta) => {
    const v = ease(delta);
    if (spin.current) spin.current.rotation.y = state.clock.elapsedTime * 0.28;
    if (rails.current) {
      rails.current.children.forEach((c, i) => {
        const dir = i === 0 ? 1 : -1;
        c.position.y = dir * (0.6 + v * 0.9);
        c.rotation.y = state.clock.elapsedTime * 0.5 * dir;
        c.scale.setScalar(1 + v * 0.18);
      });
    }
  });

  return (
    <group ref={spin} position={[0, -0.2, 0]}>
      {/* torn slab the whole thing floats on */}
      <mesh position={[0, -1.5, 0]}>
        <cylinderGeometry args={[2.3, 1.1, 0.7, 7]} />
        <Metal color={INK} rough={0.85} />
      </mesh>

      {/* the hotel */}
      <group position={[0, 0.35, 0]}>
        <mesh>
          <boxGeometry args={[1.5, 2.6, 1.5]} />
          <Metal color={PAPER} rough={0.65} />
        </mesh>
        <mesh position={[0, 1.55, 0]}>
          <coneGeometry args={[1.25, 0.6, 4]} />
          <Metal color={BRASS} />
        </mesh>
        <mesh position={[0, -1.15, 0.78]}>
          <boxGeometry args={[0.55, 0.9, 0.08]} />
          <Metal color={BRASS} />
        </mesh>
        {windows.map((w, i) => (
          <mesh
            key={i}
            position={[-0.5 + w.col * 0.33, -0.85 + w.floor * 0.5, w.side * 0.77]}
          >
            <boxGeometry args={[0.2, 0.26, 0.04]} />
            <meshStandardMaterial
              color={w.lit ? BRASS : INK}
              emissive={w.lit ? BRASS : "#000000"}
              emissiveIntensity={w.lit ? 0.5 : 0}
              roughness={0.4}
            />
          </mesh>
        ))}
      </group>

      {/* rails of hangers orbiting the building */}
      <group ref={rails}>
        {[2.6, 3.3].map((radius, r) => (
          <group key={radius}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[radius, 0.035, 12, 96]} />
              <Metal color={BRASS} />
            </mesh>
            {garments
              .filter((g) => g.ring === r)
              .map((g, i) => (
                <group
                  key={i}
                  position={[Math.cos(g.angle) * radius, 0, Math.sin(g.angle) * radius]}
                >
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
  return <meshStandardMaterial color={color} roughness={rough} metalness={color === BRASS ? 0.75 : 0.25} />;
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

/* ---------------- one seller becomes a community ---------------- */
function Crowd({ p }: P) {
  const mesh = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);
  const count = 160;
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const golden = Math.acos(1 - (2 * (i + 0.5)) / count);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        return {
          target: [
            Math.sin(golden) * Math.cos(theta) * 2,
            Math.sin(golden) * Math.sin(theta) * 2,
            Math.cos(golden) * 2,
          ] as const,
          scatter: [
            (rand(i) - 0.5) * 9,
            (rand(i + 101) - 0.5) * 7,
            (rand(i + 211) - 0.5) * 9,
          ] as const,
        };
      }),
    [],
  );
  const ease = useEased(p);

  useFrame((state, delta) => {
    const v = ease(delta);
    if (!mesh.current) return;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.12;
    seeds.forEach((s, i) => {
      const k = MathUtils.clamp(v * 1.5 - (i / count) * 0.5, 0, 1);
      dummy.position.set(
        MathUtils.lerp(s.scatter[0], s.target[0], k),
        MathUtils.lerp(s.scatter[1], s.target[1], k),
        MathUtils.lerp(s.scatter[2], s.target[2], k),
      );
      dummy.scale.setScalar(0.05 + k * 0.055);
      dummy.updateMatrix();
      mesh.current?.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
        <icosahedronGeometry args={[1, 0]} />
        <Metal color={BRASS} rough={0.4} />
      </instancedMesh>
      <mesh>
        <sphereGeometry args={[1.25, 40, 40]} />
        <Metal color={INK} rough={0.5} />
      </mesh>
    </group>
  );
}

/* ---------------- speech turning into structure ---------------- */
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
