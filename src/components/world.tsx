"use client";

import { useEffect, useRef, useState, type MutableRefObject } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";

export type LobbyApi = {
  goTo?: (id: string) => void;
  /** screen-relative step: +right is screen right, +forward is screen up */
  nudge?: (right: number, forward: number) => void;
};

export type Spot = { id: string; stand: [number, number] };
export type Bounds = { minX: number; maxX: number; minZ: number; maxZ: number };

/** saturated cartoon palette shared by every scene */
export const C = {
  floor: "#ffcf9f",
  floorAlt: "#ffb476",
  rug: "#9d7bf0",
  rugEdge: "#6f4ae0",
  wall: "#ffadc9",
  wallSide: "#8fc0ff",
  wood: "#f4862c",
  woodDark: "#cc5f16",
  cream: "#ffe7bd",
  mint: "#2ecf9f",
  sky: "#4fa4ff",
  pink: "#ff5f92",
  gold: "#ffc01f",
  plant: "#3fbf62",
  plum: "#6b45cf",
  skin: "#f7bd8e",
  hair: "#3a2330",
  denim: "#3f6fd8",
  leather: "#a8521f",
  hat: "#e0a241",
  tux: "#2a2f4a",
  belly: "#fff6e6",
  beak: "#ff9a1f",
  scarf: "#ff3d6e",
  maroon: "#a02040",
  steel: "#5c6a86",
  steelDark: "#39445c",
  concrete: "#8e97ad",
  neon: "#00e5ff",
  magenta: "#ff2fa0",
  lime: "#b6ff3d",
};

export const CAM_OFFSET: [number, number, number] = [20, 30, 20];
/** screen-right and screen-up, in world xz, for the fixed isometric camera */
export const RIGHT = new THREE.Vector2(CAM_OFFSET[2], -CAM_OFFSET[0]).normalize();
export const FORWARD = new THREE.Vector2(-CAM_OFFSET[0], -CAM_OFFSET[2]).normalize();
export const TRIGGER = 2.3;
const SPEED = 7.5;

export function shortestAngle(a: number) {
  return Math.atan2(Math.sin(a), Math.cos(a));
}

/** click-to-walk + camera-relative keyboard steps, shared by the lobby and the factory */
export function useWalker({
  api,
  spots,
  bounds,
  start,
  onMove,
}: {
  api: MutableRefObject<LobbyApi>;
  spots: Spot[];
  bounds: Bounds;
  start: [number, number, number];
  onMove: () => void;
}) {
  const targetRef = useRef<THREE.Vector3 | null>(null);
  const playerRef = useRef(new THREE.Vector3(...start));
  const [zoom, setZoom] = useState(30);

  useEffect(() => {
    const fit = () => setZoom(Math.min(window.innerWidth / 36, window.innerHeight / 23));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  useEffect(() => {
    const ref = api;
    ref.current.goTo = (id) => {
      const s = spots.find((v) => v.id === id);
      if (s) {
        targetRef.current = new THREE.Vector3(s.stand[0], 0, s.stand[1]);
        onMove();
      }
    };
    ref.current.nudge = (right, forward) => {
      const from = targetRef.current ?? playerRef.current;
      const dx = RIGHT.x * right + FORWARD.x * forward;
      const dz = RIGHT.y * right + FORWARD.y * forward;
      targetRef.current = new THREE.Vector3(
        THREE.MathUtils.clamp(from.x + dx, bounds.minX, bounds.maxX),
        0,
        THREE.MathUtils.clamp(from.z + dz, bounds.minZ, bounds.maxZ)
      );
      onMove();
    };
    return () => {
      ref.current.goTo = undefined;
      ref.current.nudge = undefined;
    };
  }, [api, spots, bounds, onMove]);

  const walkTo = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    targetRef.current = new THREE.Vector3(
      THREE.MathUtils.clamp(e.point.x, bounds.minX, bounds.maxX),
      0,
      THREE.MathUtils.clamp(e.point.z, bounds.minZ, bounds.maxZ)
    );
    onMove();
  };

  return { targetRef, playerRef, walkTo, zoom };
}

/** `shift` pushes the framing towards screen-right, to keep the player clear of a side panel */
export function CameraRig({
  posRef,
  start,
  shift = 0,
}: {
  posRef: MutableRefObject<THREE.Vector3>;
  start: [number, number, number];
  shift?: number;
}) {
  const camera = useThree((s) => s.camera);
  const look = useRef(new THREE.Vector3(...start));

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    look.current.x = THREE.MathUtils.damp(look.current.x, posRef.current.x, 3.5, dt);
    look.current.z = THREE.MathUtils.damp(look.current.z, posRef.current.z, 3.5, dt);
    const cx = look.current.x + RIGHT.x * shift;
    const cz = look.current.z + RIGHT.y * shift;
    camera.position.set(cx + CAM_OFFSET[0], CAM_OFFSET[1], cz + CAM_OFFSET[2]);
    camera.lookAt(cx, 2.2, cz);
  });

  return null;
}

export function Pad({ x, z, onClick }: { x: number; z: number; onClick: () => void }) {
  return (
    <mesh
      position={[x, 0.035, z]}
      rotation={[-Math.PI / 2, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <circleGeometry args={[1.5, 40]} />
      <meshStandardMaterial color="#ffc7d8" transparent opacity={0.75} roughness={1} />
    </mesh>
  );
}

/** the "read about this place" stand: walk onto the pad (or press 1) to open a scene's panel */
export function InfoStand({
  x,
  z,
  color,
  onOpen,
}: {
  x: number;
  z: number;
  color: string;
  onOpen: () => void;
}) {
  const screen = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!screen.current) return;
    const mat = screen.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 0.7 + Math.sin(state.clock.elapsedTime * 2.6) * 0.3;
  });

  return (
    <group>
      <group position={[x, 0, z - 1.6]}>
        <mesh position={[0, 0.12, 0]} castShadow>
          <cylinderGeometry args={[0.7, 0.8, 0.24, 20]} />
          <meshStandardMaterial color={C.steelDark} roughness={0.8} />
        </mesh>
        <mesh position={[0, 1.1, 0]} castShadow>
          <cylinderGeometry args={[0.14, 0.14, 2, 12]} />
          <meshStandardMaterial color={C.steel} roughness={0.6} metalness={0.4} />
        </mesh>
        <mesh position={[0, 2.3, 0.1]} rotation={[-0.45, 0, 0]} castShadow>
          <boxGeometry args={[2.2, 1.5, 0.16]} />
          <meshStandardMaterial color={C.steelDark} roughness={0.7} />
        </mesh>
        <mesh ref={screen} position={[0, 2.34, 0.21]} rotation={[-0.45, 0, 0]}>
          <planeGeometry args={[1.9, 1.2]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} toneMapped={false} />
        </mesh>
      </group>
      <Pad x={x} z={z} onClick={onOpen} />
    </group>
  );
}

/** the penguin in a stetson: walks to a target, waddles, flaps, tips his hat */
export function Penguin({
  targetRef,
  posRef,
  spots,
  start,
  onNear,
  onOpen,
}: {
  targetRef: MutableRefObject<THREE.Vector3 | null>;
  posRef: MutableRefObject<THREE.Vector3>;
  spots: Spot[];
  start: [number, number, number];
  onNear: (id: string | null) => void;
  onOpen: (id: string) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const legL = useRef<THREE.Mesh>(null);
  const legR = useRef<THREE.Mesh>(null);
  const armL = useRef<THREE.Mesh>(null);
  const armR = useRef<THREE.Mesh>(null);
  const torso = useRef<THREE.Group>(null);
  const hat = useRef<THREE.Group>(null);
  const near = useRef<string | null>(null);
  const armed = useRef(true);
  const moved = useRef(false);
  const clock = useRef(0);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const dt = Math.min(delta, 0.05);
    const t = targetRef.current;
    let walking = false;

    if (t) {
      moved.current = true;
      const dir = new THREE.Vector3(t.x - posRef.current.x, 0, t.z - posRef.current.z);
      const len = dir.length();
      if (len < 0.12) {
        targetRef.current = null;
      } else {
        walking = true;
        dir.normalize();
        posRef.current.addScaledVector(dir, Math.min(len, SPEED * dt));
        g.rotation.y = THREE.MathUtils.damp(
          g.rotation.y,
          g.rotation.y + shortestAngle(Math.atan2(dir.x, dir.z) - g.rotation.y),
          12,
          dt
        );
      }
    }

    clock.current += dt * (walking ? 9 : 2);
    const swing = walking ? Math.sin(clock.current) : Math.sin(clock.current) * 0.08;
    if (legL.current) legL.current.position.z = 0.06 + swing * 0.26;
    if (legR.current) legR.current.position.z = 0.06 - swing * 0.26;
    if (armL.current) armL.current.rotation.x = -swing * 0.5;
    if (armR.current) armR.current.rotation.x = swing * 0.5;
    if (torso.current) {
      /* the waddle: the whole body rocks side to side over the standing foot */
      torso.current.rotation.z = swing * (walking ? 0.17 : 0.03);
      torso.current.scale.y = 1 + Math.sin(clock.current * 2) * (walking ? 0.025 : 0.01);
    }
    if (hat.current) {
      hat.current.rotation.z = Math.sin(clock.current + 0.6) * (walking ? 0.12 : 0.03);
      hat.current.position.y = 2.6 + Math.abs(Math.sin(clock.current)) * (walking ? 0.07 : 0.015);
    }
    g.position.set(posRef.current.x, walking ? Math.abs(Math.sin(clock.current)) * 0.09 : 0, posRef.current.z);

    const hit =
      spots.find((s) => Math.hypot(s.stand[0] - posRef.current.x, s.stand[1] - posRef.current.z) < TRIGGER) ??
      null;
    const id = hit?.id ?? null;
    if (id !== near.current) {
      near.current = id;
      onNear(id);
      if (id === null) armed.current = true;
    }
    if (id && armed.current && moved.current && !targetRef.current) {
      armed.current = false;
      onOpen(id);
    }
  });

  return (
    <group ref={group} position={start} scale={1.25}>
      {/* webbed feet */}
      <mesh ref={legL} position={[-0.22, 0.16, 0.06]} castShadow>
        <boxGeometry args={[0.34, 0.16, 0.56]} />
        <meshStandardMaterial color={C.beak} roughness={0.8} />
      </mesh>
      <mesh ref={legR} position={[0.22, 0.16, 0.06]} castShadow>
        <boxGeometry args={[0.34, 0.16, 0.56]} />
        <meshStandardMaterial color={C.beak} roughness={0.8} />
      </mesh>

      <group ref={torso}>
        {/* body and white front */}
        <mesh position={[0, 1.15, 0]} castShadow>
          <capsuleGeometry args={[0.6, 0.85, 8, 20]} />
          <meshStandardMaterial color={C.tux} roughness={0.85} />
        </mesh>
        <mesh position={[0, 1.1, 0.16]} scale={[0.82, 1.02, 0.7]} castShadow>
          <capsuleGeometry args={[0.52, 0.8, 8, 20]} />
          <meshStandardMaterial color={C.belly} roughness={0.9} />
        </mesh>
        {/* bandana */}
        <mesh position={[0, 1.78, 0.18]} rotation={[0.25, 0, 0]} castShadow>
          <coneGeometry args={[0.38, 0.4, 3]} />
          <meshStandardMaterial color={C.scarf} roughness={0.9} />
        </mesh>

        {/* flippers */}
        <mesh ref={armL} position={[-0.62, 1.3, 0]} rotation={[0, 0, 0.32]} scale={[1, 1, 0.45]} castShadow>
          <capsuleGeometry args={[0.13, 0.62, 4, 12]} />
          <meshStandardMaterial color={C.tux} roughness={0.85} />
        </mesh>
        <mesh ref={armR} position={[0.62, 1.3, 0]} rotation={[0, 0, -0.32]} scale={[1, 1, 0.45]} castShadow>
          <capsuleGeometry args={[0.13, 0.62, 4, 12]} />
          <meshStandardMaterial color={C.tux} roughness={0.85} />
        </mesh>

        {/* head */}
        <mesh position={[0, 2.18, 0]} castShadow>
          <sphereGeometry args={[0.52, 28, 28]} />
          <meshStandardMaterial color={C.tux} roughness={0.85} />
        </mesh>
        <mesh position={[0, 2.1, 0.26]} scale={[0.78, 0.86, 0.6]} castShadow>
          <sphereGeometry args={[0.46, 24, 24]} />
          <meshStandardMaterial color={C.belly} roughness={0.9} />
        </mesh>
        <mesh position={[-0.18, 2.28, 0.42]}>
          <sphereGeometry args={[0.075, 12, 12]} />
          <meshStandardMaterial color="#1a1626" />
        </mesh>
        <mesh position={[0.18, 2.28, 0.42]}>
          <sphereGeometry args={[0.075, 12, 12]} />
          <meshStandardMaterial color="#1a1626" />
        </mesh>
        {/* beak */}
        <mesh position={[0, 2.06, 0.5]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <coneGeometry args={[0.17, 0.4, 12]} />
          <meshStandardMaterial color={C.beak} roughness={0.7} />
        </mesh>

        {/* stetson */}
        <group ref={hat} position={[0, 2.6, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.92, 0.98, 0.09, 28]} />
            <meshStandardMaterial color={C.hat} roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.24, 0]} castShadow>
            <cylinderGeometry args={[0.42, 0.5, 0.48, 24]} />
            <meshStandardMaterial color={C.hat} roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.12, 0]}>
            <cylinderGeometry args={[0.52, 0.52, 0.12, 24]} />
            <meshStandardMaterial color={C.maroon} roughness={0.9} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
