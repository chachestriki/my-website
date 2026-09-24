"use client";

import { useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, PerspectiveCamera } from "@react-three/drei";
import { Group, MathUtils } from "three";

const INK = "#1a1d22";
const BRASS = "#c39a4f";
const PAPER = "#efeae0";
const GLASS = "#8fb6c9";

/** deterministic pseudo-random, so the monument is identical on every render */
function rand(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function Matte({
  color = PAPER,
  rough = 0.55,
  metal = 0,
  emissive,
}: {
  color?: string;
  rough?: number;
  metal?: number;
  emissive?: string;
}) {
  return (
    <meshStandardMaterial
      color={color}
      roughness={rough}
      metalness={metal}
      emissive={emissive ?? "#000000"}
      emissiveIntensity={emissive ? 1.4 : 0}
    />
  );
}

function Brass({ rough = 0.24 }: { rough?: number }) {
  return <meshStandardMaterial color={BRASS} roughness={rough} metalness={0.85} />;
}

/** the hotel on top of the floating slab, windows lit */
function Hotel() {
  const windows = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        face: i % 4,
        x: ((i % 3) - 1) * 0.34,
        y: 0.35 + Math.floor(i / 4) * 0.31,
        lit: rand(i) > 0.35,
      })),
    [],
  );

  return (
    <group position={[0, 0.9, 0]}>
      <mesh>
        <boxGeometry args={[1.35, 2.6, 1.35]} />
        <Matte color={PAPER} rough={0.7} />
      </mesh>
      {windows.map((w, i) => {
        const a = (w.face * Math.PI) / 2;
        const d = 0.69;
        return (
          <mesh
            key={i}
            position={[Math.sin(a) * d + Math.cos(a) * w.x, w.y - 0.9, Math.cos(a) * d - Math.sin(a) * w.x]}
            rotation={[0, a, 0]}
          >
            <boxGeometry args={[0.18, 0.2, 0.02]} />
            <Matte color={w.lit ? BRASS : INK} emissive={w.lit ? "#6b4d12" : undefined} rough={0.4} />
          </mesh>
        );
      })}
      {/* brass canopy and dome */}
      <mesh position={[0, -1.32, 0]}>
        <cylinderGeometry args={[1.15, 1.15, 0.1, 6]} />
        <Brass />
      </mesh>
      <mesh position={[0, 1.45, 0]}>
        <sphereGeometry args={[0.62, 28, 18, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <Brass rough={0.18} />
      </mesh>
      <mesh position={[0, 2.1, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
        <Brass />
      </mesh>
    </group>
  );
}

/** the torn slab of rock the whole thing stands on, with books fused underneath */
function Slab() {
  return (
    <group position={[0, -0.6, 0]}>
      <mesh>
        <cylinderGeometry args={[2.2, 1.5, 0.5, 9]} />
        <Matte color={PAPER} rough={0.9} />
      </mesh>
      <mesh position={[0, -0.7, 0]} rotation={[0, 0.4, 0]}>
        <coneGeometry args={[1.45, 1.6, 8]} />
        <Matte color={INK} rough={0.95} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0.55 - i * 0.12, -0.42 - i * 0.16, 0.5 + i * 0.1]} rotation={[0, i * 0.5, 0.06]}>
          <boxGeometry args={[0.75, 0.13, 0.55]} />
          <Matte color={i === 1 ? BRASS : PAPER} rough={0.8} />
        </mesh>
      ))}
    </group>
  );
}

/** rails of hangers and clothes orbiting the hotel */
function Rails() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        ring: i % 2,
        angle: (i / 13) * Math.PI * 2 + (i % 2) * 0.24,
        drop: 0.42 + rand(i + 40) * 0.5,
        brass: i % 6 === 0,
      })),
    [],
  );
  const rings = useRef<Group>(null);

  useFrame((state) => {
    rings.current?.children.forEach((c, i) => {
      const dir = i === 0 ? 1 : -1;
      c.rotation.y = state.clock.elapsedTime * 0.22 * dir;
      c.position.y = Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.12 + (i === 0 ? 0.9 : 0.1);
    });
  });

  return (
    <group ref={rings}>
      {[2.35, 3.05].map((radius, r) => (
        <group key={radius}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[radius, 0.028, 10, 96]} />
            <Brass />
          </mesh>
          {pieces
            .filter((g) => g.ring === r)
            .map((g, i) => (
              <group key={i} position={[Math.cos(g.angle) * radius, 0, Math.sin(g.angle) * radius]}>
                <mesh position={[0, -0.14, 0]} rotation={[Math.PI / 2, 0, 0]}>
                  <torusGeometry args={[0.1, 0.014, 8, 20]} />
                  <Brass />
                </mesh>
                <mesh position={[0, -0.34 - g.drop / 2, 0]} rotation={[0, g.angle, 0]}>
                  <boxGeometry args={[0.38, g.drop, 0.07]} />
                  <Matte color={g.brass ? BRASS : PAPER} rough={0.95} />
                </mesh>
              </group>
            ))}
        </group>
      ))}
    </group>
  );
}

/** an open laptop */
function Laptop() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[0.6, 0.03, 0.42]} />
        <Matte color={INK} rough={0.4} metal={0.4} />
      </mesh>
      <group position={[0, 0, -0.21]} rotation={[-1.05, 0, 0]}>
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.6, 0.4, 0.025]} />
          <Matte color={INK} rough={0.4} metal={0.4} />
        </mesh>
        <mesh position={[0, 0.2, 0.016]}>
          <boxGeometry args={[0.54, 0.34, 0.005]} />
          <Matte color={GLASS} emissive="#20404c" rough={0.2} />
        </mesh>
      </group>
    </group>
  );
}

/** the wifi fan: three arcs and a dot */
function Wifi() {
  return (
    <group rotation={[0, 0, 0]}>
      {[0.22, 0.4, 0.58].map((r) => (
        <mesh key={r} rotation={[0, 0, Math.PI / 4]}>
          <torusGeometry args={[r, 0.028, 8, 32, Math.PI / 2]} />
          <Brass />
        </mesh>
      ))}
      <mesh>
        <sphereGeometry args={[0.07, 16, 16]} />
        <Brass />
      </mesh>
    </group>
  );
}

/** a radial burst mark, the way an AI logo reads from a distance */
function Burst() {
  return (
    <group>
      {Array.from({ length: 10 }, (_, i) => (
        <mesh key={i} rotation={[0, 0, (i / 10) * Math.PI * 2]}>
          <boxGeometry args={[0.055, 0.62, 0.055]} />
          <Matte color={BRASS} rough={0.3} metal={0.7} />
        </mesh>
      ))}
    </group>
  );
}

/** cubes, laptops, wifi fans and burst marks drifting around the monument */
function Debris() {
  const group = useRef<Group>(null);
  const items = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => {
        const a = (i / 18) * Math.PI * 2 + rand(i) * 0.5;
        const radius = 2.6 + rand(i + 3) * 1.9;
        return {
          kind: i % 4,
          pos: [Math.cos(a) * radius, -1.6 + rand(i + 9) * 4.2, Math.sin(a) * radius] as const,
          scale: 0.7 + rand(i + 21) * 0.7,
          spin: 0.15 + rand(i + 33) * 0.35,
          tilt: rand(i + 44) * Math.PI,
        };
      }),
    [],
  );

  useFrame((state, delta) => {
    group.current?.children.forEach((c, i) => {
      c.rotation.y += delta * items[i].spin;
      c.position.y = items[i].pos[1] + Math.sin(state.clock.elapsedTime * 0.6 + i) * 0.16;
    });
  });

  return (
    <group ref={group}>
      {items.map((it, i) => (
        <group key={i} position={[it.pos[0], it.pos[1], it.pos[2]]} scale={it.scale} rotation={[it.tilt, 0, 0]}>
          {it.kind === 0 && (
            <mesh rotation={[it.tilt, it.tilt, 0]}>
              <boxGeometry args={[0.42, 0.42, 0.42]} />
              <Matte color={i % 3 === 0 ? BRASS : PAPER} rough={0.6} metal={i % 3 === 0 ? 0.7 : 0} />
            </mesh>
          )}
          {it.kind === 1 && <Laptop />}
          {it.kind === 2 && <Wifi />}
          {it.kind === 3 && <Burst />}
        </group>
      ))}
    </group>
  );
}

/** the whole monument turning horizontally on its vertical axis */
function Monument({ p }: { p: RefObject<number> }) {
  const spin = useRef<Group>(null);
  const eased = useRef(0);

  useFrame((state, delta) => {
    eased.current = MathUtils.damp(eased.current, p.current, 5, Math.min(delta, 0.05));
    if (!spin.current) return;
    spin.current.rotation.y = state.clock.elapsedTime * 0.18;
    /** scrolling tips the monument away and drops it out of frame */
    spin.current.rotation.x = eased.current * 0.35;
    spin.current.position.y = -eased.current * 2.2;
  });

  return (
    <group ref={spin} scale={0.82}>
      <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.45}>
        <Hotel />
        <Slab />
        <Rails />
        <Debris />
      </Float>
    </group>
  );
}

/** the monument spans ~8 units, so narrow screens pull the camera back */
function FitCamera() {
  const { size } = useThree();
  const z = MathUtils.clamp(12 / Math.min(1, size.width / 900), 12, 21);
  return <PerspectiveCamera makeDefault fov={38} position={[0, 1.4, z]} onUpdate={(c) => c.lookAt(0, 0.3, 0)} />;
}

export default function HeroMonument({ p }: { p: RefObject<number> }) {
  return (
    <Canvas dpr={[1, 1.6]} gl={{ antialias: true, alpha: true }}>
      <FitCamera />
      <hemisphereLight args={["#ffffff", "#2a2118", 1.0]} />
      <directionalLight position={[5, 7, 6]} intensity={1.7} />
      <directionalLight position={[-6, 2, -4]} intensity={0.7} color={BRASS} />
      <pointLight position={[0, 1, 3]} intensity={18} distance={12} color="#ffd9a0" />
      <Monument p={p} />
    </Canvas>
  );
}
