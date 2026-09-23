"use client";

import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";

export type LobbyApi = {
  goTo?: (id: string) => void;
  /** screen-relative step: +right is screen right, +forward is screen up */
  nudge?: (right: number, forward: number) => void;
};

export type Spot = { id: string; stand: [number, number] };
export type Bounds = { minX: number; maxX: number; minZ: number; maxZ: number };

/** neutral hotel palette — whites, blacks and a single brass accent */
export const C = {
  floor: "#ecebe7",
  floorAlt: "#dedcd5",
  rug: "#1b1e22",
  rugEdge: "#8a6a33",
  wall: "#f6f5f2",
  wallSide: "#dfddd6",
  wood: "#8a6a33",
  woodDark: "#5b4620",
  cream: "#faf9f6",
  mint: "#4f6f66",
  sky: "#8095aa",
  pink: "#b08a4f",
  gold: "#c2a05a",
  plant: "#4f6b52",
  plum: "#2b3138",
  skin: "#e2c8ad",
  hair: "#17181b",
  denim: "#39435a",
  leather: "#6a5236",
  hat: "#c2a05a",
  tux: "#15181c",
  belly: "#ffffff",
  beak: "#c98b3a",
  scarf: "#6e2f33",
  maroon: "#5e2a2e",
  steel: "#5a6069",
  steelDark: "#33383f",
  concrete: "#9aa0a8",
  neon: "#9ab6cf",
  magenta: "#c2a05a",
  lime: "#b7c2a8",
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
  fit = 1,
}: {
  api: MutableRefObject<LobbyApi>;
  spots: Spot[];
  bounds: Bounds;
  start: [number, number, number];
  onMove: () => void;
  /** multiplier on the fitted zoom, to frame a room tighter or wider */
  fit?: number;
}) {
  const targetRef = useRef<THREE.Vector3 | null>(null);
  const playerRef = useRef(new THREE.Vector3(...start));
  const [zoom, setZoom] = useState(30);

  useEffect(() => {
    const measure = () =>
      setZoom(Math.min(window.innerWidth / 36, window.innerHeight / 23) * fit);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [fit]);

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
      <meshStandardMaterial color="#a8c6b1" transparent opacity={0.75} roughness={1} />
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

/** a door sign: the room's name painted on a lit board, plus an "extra" tag for quiz rooms */
export function DoorSign({
  label,
  extra = false,
  color,
  width = 4.4,
}: {
  label: string;
  extra?: boolean;
  color: string;
  width?: number;
}) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 220;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#1a1c1e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, 10);
    ctx.fillRect(0, canvas.height - 10, canvas.width, 10);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#fdfcf9";
    ctx.font = "800 104px ui-sans-serif, system-ui, sans-serif";
    ctx.fillText(label.toUpperCase(), canvas.width / 2, extra ? 92 : canvas.height / 2);
    if (extra) {
      ctx.fillStyle = color;
      ctx.font = "600 44px ui-monospace, monospace";
      ctx.fillText("side room · quiz", canvas.width / 2, 172);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  }, [color, extra, label]);

  if (!texture) return null;
  return (
    <mesh>
      <planeGeometry args={[width, width * 0.215]} />
      <meshStandardMaterial map={texture} emissiveMap={texture} emissive="#ffffff" emissiveIntensity={0.55} toneMapped={false} />
    </mesh>
  );
}

/** a pulsing ring with a bobbing arrow, dropped on the spot the visitor should try first */
export function Beacon({ x, z, color }: { x: number; z: number; color: string }) {
  const ring = useRef<THREE.Mesh>(null);
  const arrow = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ring.current) {
      const s = 1 + (t % 1.6) * 0.75;
      ring.current.scale.setScalar(s);
      (ring.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.75 - (t % 1.6) * 0.5);
    }
    if (arrow.current) arrow.current.position.y = 4.6 + Math.sin(t * 3) * 0.35;
  });

  return (
    <group position={[x, 0, z]}>
      <mesh ref={ring} position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 1.9, 40]} />
        <meshBasicMaterial color={color} transparent opacity={0.7} toneMapped={false} />
      </mesh>
      <mesh ref={arrow} position={[0, 4.6, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.6, 1.2, 4]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.9} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** the penguin in a stetson: walks to a target, waddles, flaps, tips his hat */
export function Penguin({
  targetRef,
  posRef,
  spots,
  start,
  facing = 0,
  onNear,
  onOpen,
}: {
  targetRef: MutableRefObject<THREE.Vector3 | null>;
  posRef: MutableRefObject<THREE.Vector3>;
  spots: Spot[];
  start: [number, number, number];
  /** initial heading in radians, so he can already look at the first door */
  facing?: number;
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
    <group ref={group} position={start} rotation={[0, facing, 0]} scale={1.25}>
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
          <meshStandardMaterial color="#17181b" />
        </mesh>
        <mesh position={[0.18, 2.28, 0.42]}>
          <sphereGeometry args={[0.075, 12, 12]} />
          <meshStandardMaterial color="#17181b" />
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
