"use client";

import { useEffect, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { Html, OrthographicCamera, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { stations } from "@/data/stations";

export type LobbyApi = { goTo?: (id: string) => void; nudge?: (dx: number, dz: number) => void };

const C = {
  floor: "#f7e3d2",
  floorAlt: "#f2d6c0",
  rug: "#cfc2f2",
  rugEdge: "#b6a4e8",
  wall: "#ffe6ee",
  wallSide: "#dfeaff",
  wood: "#eaa46e",
  woodDark: "#d98b52",
  cream: "#fff6ea",
  mint: "#9fdcc6",
  sky: "#bcd8ff",
  pink: "#ffaec4",
  gold: "#ffd98a",
  plant: "#a9dfb6",
  plum: "#6b5b8f",
  skin: "#f6cdb0",
  hair: "#4b3a56",
};

const START: [number, number, number] = [1.5, 0, 7.4];
const FLOOR = { x: 12.5, z: 9 };
const TRIGGER = 2.3;
const SPEED = 7.5;

export default function Lobby3D({
  api,
  onNear,
  onOpen,
  onMove,
}: {
  api: MutableRefObject<LobbyApi>;
  onNear: (id: string | null) => void;
  onOpen: (id: string) => void;
  onMove: () => void;
}) {
  const targetRef = useRef<THREE.Vector3 | null>(null);
  const playerRef = useRef(new THREE.Vector3(...START));
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
      const s = stations.find((v) => v.id === id);
      if (s) {
        targetRef.current = new THREE.Vector3(s.stand[0], 0, s.stand[1]);
        onMove();
      }
    };
    ref.current.nudge = (dx, dz) => {
      const from = targetRef.current ?? playerRef.current;
      targetRef.current = new THREE.Vector3(
        THREE.MathUtils.clamp(from.x + dx, -FLOOR.x, FLOOR.x),
        0,
        THREE.MathUtils.clamp(from.z + dz, -FLOOR.z, FLOOR.z)
      );
      onMove();
    };
    return () => {
      ref.current.goTo = undefined;
      ref.current.nudge = undefined;
    };
  }, [api, onMove]);

  const walkTo = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    targetRef.current = new THREE.Vector3(
      THREE.MathUtils.clamp(e.point.x, -FLOOR.x, FLOOR.x),
      0,
      THREE.MathUtils.clamp(e.point.z, -FLOOR.z, FLOOR.z)
    );
    onMove();
  };

  return (
    <Canvas shadows dpr={[1, 1.5]} gl={{ antialias: true }} style={{ touchAction: "none" }}>
      <color attach="background" args={["#fdeee4"]} />
      <fog attach="fog" args={["#fdeee4", 46, 78]} />

      <OrthographicCamera
        makeDefault
        position={[20, 30, 20]}
        zoom={zoom}
        near={-60}
        far={140}
        onUpdate={(c) => c.lookAt(-0.5, 2.2, -0.5)}
      />

      <hemisphereLight args={["#ffffff", "#f3c9d6", 1.1]} />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[12, 20, 8]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-22}
        shadow-camera-right={22}
        shadow-camera-top={22}
        shadow-camera-bottom={-22}
      />

      <Lobby onFloorClick={walkTo} />

      {stations.map((s) => (
        <group key={s.id}>
          <Pad x={s.stand[0]} z={s.stand[1]} onClick={() => api.current.goTo?.(s.id)} />
          <Html position={s.label} center distanceFactor={26} zIndexRange={[20, 0]} className="pointer-events-none">
            <div className="whitespace-nowrap rounded-2xl border-2 border-white bg-white/90 px-3 py-1.5 text-center shadow-[0_6px_0_rgba(107,91,143,0.18)]">
              <span className="block font-mono text-[10px] uppercase tracking-widest text-teal">{s.object}</span>
              <span className="block text-sm font-bold text-brass">{s.title}</span>
            </div>
          </Html>
        </group>
      ))}

      <Player targetRef={targetRef} posRef={playerRef} onNear={onNear} onOpen={onOpen} />
    </Canvas>
  );
}

function Player({
  targetRef,
  posRef,
  onNear,
  onOpen,
}: {
  targetRef: MutableRefObject<THREE.Vector3 | null>;
  posRef: MutableRefObject<THREE.Vector3>;
  onNear: (id: string | null) => void;
  onOpen: (id: string) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const legL = useRef<THREE.Mesh>(null);
  const legR = useRef<THREE.Mesh>(null);
  const armL = useRef<THREE.Mesh>(null);
  const armR = useRef<THREE.Mesh>(null);
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

    clock.current += dt * (walking ? 11 : 2.2);
    const swing = walking ? Math.sin(clock.current) * 0.5 : Math.sin(clock.current) * 0.04;
    if (legL.current) legL.current.rotation.x = swing;
    if (legR.current) legR.current.rotation.x = -swing;
    if (armL.current) armL.current.rotation.x = -swing * 0.8;
    if (armR.current) armR.current.rotation.x = swing * 0.8;
    g.position.set(posRef.current.x, walking ? Math.abs(Math.sin(clock.current)) * 0.09 : 0, posRef.current.z);

    const hit =
      stations.find(
        (s) => Math.hypot(s.stand[0] - posRef.current.x, s.stand[1] - posRef.current.z) < TRIGGER
      ) ?? null;
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
    <group ref={group} position={START} scale={1.25}>
      {/* legs */}
      <mesh ref={legL} position={[-0.19, 0.62, 0]} castShadow>
        <capsuleGeometry args={[0.15, 0.5, 4, 12]} />
        <meshStandardMaterial color="#8fa8e8" roughness={0.9} />
      </mesh>
      <mesh ref={legR} position={[0.19, 0.62, 0]} castShadow>
        <capsuleGeometry args={[0.15, 0.5, 4, 12]} />
        <meshStandardMaterial color="#8fa8e8" roughness={0.9} />
      </mesh>
      {/* body */}
      <mesh position={[0, 1.42, 0]} castShadow>
        <capsuleGeometry args={[0.42, 0.62, 6, 16]} />
        <meshStandardMaterial color={C.pink} roughness={0.85} />
      </mesh>
      <mesh ref={armL} position={[-0.5, 1.6, 0]} rotation={[0, 0, 0.18]} castShadow>
        <capsuleGeometry args={[0.12, 0.5, 4, 12]} />
        <meshStandardMaterial color="#ff97b3" roughness={0.9} />
      </mesh>
      <mesh ref={armR} position={[0.5, 1.6, 0]} rotation={[0, 0, -0.18]} castShadow>
        <capsuleGeometry args={[0.12, 0.5, 4, 12]} />
        <meshStandardMaterial color="#ff97b3" roughness={0.9} />
      </mesh>
      {/* head */}
      <mesh position={[0, 2.28, 0]} castShadow>
        <sphereGeometry args={[0.46, 28, 28]} />
        <meshStandardMaterial color={C.skin} roughness={0.85} />
      </mesh>
      <mesh position={[0, 2.44, -0.04]} castShadow>
        <sphereGeometry args={[0.47, 28, 28, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshStandardMaterial color={C.hair} roughness={0.9} />
      </mesh>
      <mesh position={[-0.16, 2.28, 0.4]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color="#3d3350" />
      </mesh>
      <mesh position={[0.16, 2.28, 0.4]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color="#3d3350" />
      </mesh>
    </group>
  );
}

function shortestAngle(a: number) {
  return Math.atan2(Math.sin(a), Math.cos(a));
}

function Pad({ x, z, onClick }: { x: number; z: number; onClick: () => void }) {
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

function Lobby({ onFloorClick }: { onFloorClick: (e: ThreeEvent<MouseEvent>) => void }) {
  return (
    <group>
      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow onClick={onFloorClick}>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color={C.floor} roughness={1} />
      </mesh>
      {/* lobby carpet area */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[FLOOR.x * 2 + 2, FLOOR.z * 2 + 2]} />
        <meshStandardMaterial color={C.cream} roughness={1} />
      </mesh>
      {/* chequered inlay */}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh key={i} position={[-8.75 + i * 2.5, 0.01, 6.5]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.5, 3]} />
          <meshStandardMaterial color={i % 2 ? C.floorAlt : C.cream} roughness={1} />
        </mesh>
      ))}
      {/* rug */}
      <mesh position={[0, 0.012, 1.4]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[5.2, 48]} />
        <meshStandardMaterial color={C.rug} roughness={1} />
      </mesh>
      <mesh position={[0, 0.018, 1.4]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4.1, 4.5, 48]} />
        <meshStandardMaterial color={C.rugEdge} roughness={1} />
      </mesh>

      {/* walls */}
      <mesh position={[0, 4, -10]} receiveShadow>
        <boxGeometry args={[27, 8, 0.6]} />
        <meshStandardMaterial color={C.wall} roughness={1} />
      </mesh>
      <mesh position={[-13.2, 4, 0]} receiveShadow>
        <boxGeometry args={[0.6, 8, 20]} />
        <meshStandardMaterial color={C.wallSide} roughness={1} />
      </mesh>
      {/* skirting */}
      <mesh position={[0, 0.3, -9.65]}>
        <boxGeometry args={[27, 0.6, 0.3]} />
        <meshStandardMaterial color={C.cream} roughness={1} />
      </mesh>

      <Reception />
      <KeyRack />
      <Terminal />
      <PhoneBooth />
      <BellDesk />
      <Elevator />
      <Plant x={-11} z={6.5} />
      <Plant x={11.5} z={4} />
      <Sofa />
      <LuggageCart />
      <CoffeeTable />
      <Suitcase x={-7.6} z={7.4} rot={0.6} color={C.pink} />
      <Suitcase x={-11.8} z={-6.2} rot={-0.3} color={C.sky} />
    </group>
  );
}

function Reception() {
  return (
    <group position={[0, 0, -5]}>
      <RoundedBox args={[9, 1.9, 2.4]} radius={0.22} smoothness={4} position={[0, 0.95, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={C.wood} roughness={0.85} />
      </RoundedBox>
      <RoundedBox args={[9.6, 0.3, 2.9]} radius={0.12} smoothness={4} position={[0, 2, 0]} castShadow>
        <meshStandardMaterial color={C.cream} roughness={0.7} />
      </RoundedBox>
      <RoundedBox args={[7.4, 0.9, 0.16]} radius={0.06} smoothness={3} position={[0, 1.05, 1.24]} castShadow>
        <meshStandardMaterial color={C.pink} roughness={0.9} />
      </RoundedBox>
      {/* desk lamp */}
      <mesh position={[3.2, 2.35, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.5, 10]} />
        <meshStandardMaterial color={C.plum} roughness={0.8} />
      </mesh>
      <mesh position={[3.2, 2.72, 0]} castShadow>
        <coneGeometry args={[0.42, 0.5, 18]} />
        <meshStandardMaterial color={C.gold} roughness={0.7} emissive="#ffb703" emissiveIntensity={0.25} />
      </mesh>
      {/* guest book */}
      <RoundedBox args={[1, 0.12, 0.7]} radius={0.04} smoothness={3} position={[-2.6, 2.2, 0.2]} castShadow>
        <meshStandardMaterial color={C.sky} roughness={0.9} />
      </RoundedBox>
    </group>
  );
}

function KeyRack() {
  const keys = Array.from({ length: 16 }, (_, i) => i);
  return (
    <group position={[-12.6, 0, -2]} rotation={[0, Math.PI / 2, 0]}>
      <RoundedBox args={[6, 4.2, 0.4]} radius={0.16} smoothness={4} position={[0, 4, 0]} castShadow>
        <meshStandardMaterial color={C.cream} roughness={0.9} />
      </RoundedBox>
      {keys.map((i) => (
        <group key={i} position={[-2.25 + (i % 4) * 1.5, 5.3 - Math.floor(i / 4) * 1.1, 0.28]}>
          <mesh>
            <torusGeometry args={[0.17, 0.05, 10, 20]} />
            <meshStandardMaterial color={C.gold} roughness={0.5} metalness={0.2} />
          </mesh>
          <mesh position={[0, -0.32, 0]}>
            <boxGeometry args={[0.09, 0.42, 0.06]} />
            <meshStandardMaterial color={C.gold} roughness={0.5} metalness={0.2} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Terminal() {
  return (
    <group position={[9, 0, -4]} rotation={[0, -0.5, 0]}>
      <RoundedBox args={[3.4, 1.7, 1.8]} radius={0.16} smoothness={4} position={[0, 0.85, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={C.woodDark} roughness={0.9} />
      </RoundedBox>
      <RoundedBox args={[2.4, 1.6, 0.22]} radius={0.12} smoothness={4} position={[0, 2.6, -0.3]} castShadow>
        <meshStandardMaterial color={C.cream} roughness={0.8} />
      </RoundedBox>
      <mesh position={[0, 2.6, -0.16]}>
        <planeGeometry args={[2, 1.2]} />
        <meshStandardMaterial color={C.mint} emissive={C.mint} emissiveIntensity={0.4} roughness={1} />
      </mesh>
      <mesh position={[0, 1.78, -0.3]} castShadow>
        <cylinderGeometry args={[0.12, 0.3, 0.3, 12]} />
        <meshStandardMaterial color={C.plum} roughness={0.8} />
      </mesh>
      <RoundedBox args={[1.6, 0.12, 0.6]} radius={0.05} smoothness={3} position={[0, 1.78, 0.5]} castShadow>
        <meshStandardMaterial color={C.sky} roughness={0.9} />
      </RoundedBox>
    </group>
  );
}

function PhoneBooth() {
  return (
    <group position={[-8.4, 0, 3.6]} rotation={[0, 0.5, 0]}>
      <RoundedBox args={[2.6, 5.4, 2.2]} radius={0.3} smoothness={4} position={[0, 2.7, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={C.sky} roughness={0.9} />
      </RoundedBox>
      <mesh position={[0, 3.2, 1.12]}>
        <planeGeometry args={[1.8, 2.6]} />
        <meshStandardMaterial color="#eaf4ff" roughness={0.4} />
      </mesh>
      <RoundedBox args={[0.6, 0.9, 0.3]} radius={0.08} smoothness={3} position={[0, 2, 1.12]} castShadow>
        <meshStandardMaterial color={C.pink} roughness={0.9} />
      </RoundedBox>
      <RoundedBox args={[2.9, 0.5, 2.5]} radius={0.12} smoothness={3} position={[0, 5.6, 0]} castShadow>
        <meshStandardMaterial color={C.gold} roughness={0.8} />
      </RoundedBox>
    </group>
  );
}

function BellDesk() {
  return (
    <group position={[5.4, 0, 5]}>
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.1, 1.3, 1, 24]} />
        <meshStandardMaterial color={C.cream} roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.05, 0]} castShadow>
        <cylinderGeometry args={[1.25, 1.25, 0.16, 24]} />
        <meshStandardMaterial color={C.pink} roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.36, 0]} castShadow>
        <sphereGeometry args={[0.5, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={C.gold} roughness={0.35} metalness={0.35} />
      </mesh>
      <mesh position={[0, 1.88, 0]} castShadow>
        <sphereGeometry args={[0.12, 14, 14]} />
        <meshStandardMaterial color={C.gold} roughness={0.35} metalness={0.35} />
      </mesh>
    </group>
  );
}

function Elevator() {
  return (
    <group position={[-4.5, 0, -9.6]}>
      <RoundedBox args={[4.4, 6.4, 0.4]} radius={0.14} smoothness={4} position={[0, 3.2, 0]} castShadow>
        <meshStandardMaterial color={C.gold} roughness={0.6} metalness={0.15} />
      </RoundedBox>
      <mesh position={[0, 3.2, 0.24]}>
        <planeGeometry args={[3.6, 5.6]} />
        <meshStandardMaterial color="#ffeccb" roughness={0.8} />
      </mesh>
      <mesh position={[0, 3.2, 0.26]}>
        <planeGeometry args={[0.08, 5.6]} />
        <meshStandardMaterial color={C.woodDark} roughness={0.9} />
      </mesh>
    </group>
  );
}

function Plant({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.7, 0.55, 1.2, 18]} />
        <meshStandardMaterial color={C.pink} roughness={0.9} />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={i}
          position={[Math.cos((i / 5) * Math.PI * 2) * 0.35, 1.9, Math.sin((i / 5) * Math.PI * 2) * 0.35]}
          rotation={[Math.cos(i) * 0.35, i, Math.sin(i) * 0.35]}
          castShadow
        >
          <capsuleGeometry args={[0.25, 1.5, 4, 12]} />
          <meshStandardMaterial color={C.plant} roughness={0.95} />
        </mesh>
      ))}
    </group>
  );
}

function Sofa() {
  return (
    <group position={[9.5, 0, 6]} rotation={[0, -0.7, 0]}>
      <RoundedBox args={[4.4, 0.9, 1.9]} radius={0.3} smoothness={4} position={[0, 0.65, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={C.mint} roughness={0.95} />
      </RoundedBox>
      <RoundedBox args={[4.4, 1.5, 0.6]} radius={0.28} smoothness={4} position={[0, 1.2, -0.8]} castShadow>
        <meshStandardMaterial color={C.mint} roughness={0.95} />
      </RoundedBox>
      <RoundedBox args={[0.6, 1.1, 1.9]} radius={0.24} smoothness={4} position={[-2.1, 1, 0]} castShadow>
        <meshStandardMaterial color="#8ed0b8" roughness={0.95} />
      </RoundedBox>
      <RoundedBox args={[0.6, 1.1, 1.9]} radius={0.24} smoothness={4} position={[2.1, 1, 0]} castShadow>
        <meshStandardMaterial color="#8ed0b8" roughness={0.95} />
      </RoundedBox>
    </group>
  );
}

function CoffeeTable() {
  return (
    <group position={[12.4, 0, 1.4]}>
      <RoundedBox args={[2.6, 0.24, 2.6]} radius={0.1} smoothness={3} position={[0, 0.9, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={C.cream} roughness={0.85} />
      </RoundedBox>
      {[-1, 1].map((sx) =>
        [-1, 1].map((sz) => (
          <mesh key={`${sx}${sz}`} position={[sx * 1, 0.45, sz * 1]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 0.9, 10]} />
            <meshStandardMaterial color={C.wood} roughness={0.9} />
          </mesh>
        ))
      )}
      <mesh position={[0, 1.12, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.26, 0.2, 16]} />
        <meshStandardMaterial color={C.mint} roughness={0.9} />
      </mesh>
    </group>
  );
}

function Suitcase({ x, z, rot, color }: { x: number; z: number; rot: number; color: string }) {
  return (
    <group position={[x, 0, z]} rotation={[0, rot, 0]}>
      <RoundedBox args={[1.5, 1.1, 0.7]} radius={0.16} smoothness={4} position={[0, 0.58, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={color} roughness={0.9} />
      </RoundedBox>
      <mesh position={[0, 1.25, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.22, 0.06, 8, 18, Math.PI]} />
        <meshStandardMaterial color={C.gold} roughness={0.6} />
      </mesh>
    </group>
  );
}

function LuggageCart() {
  return (
    <group position={[-2.6, 0, 6.6]} rotation={[0, 0.4, 0]}>
      <RoundedBox args={[2.4, 0.2, 1.4]} radius={0.06} smoothness={3} position={[0, 0.55, 0]} castShadow>
        <meshStandardMaterial color={C.gold} roughness={0.5} metalness={0.2} />
      </RoundedBox>
      {[-1, 1].map((sx) =>
        [-1, 1].map((sz) => (
          <mesh key={`${sx}${sz}`} position={[sx * 1.05, 0.25, sz * 0.55]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.22, 0.14, 14]} />
            <meshStandardMaterial color={C.plum} roughness={0.9} />
          </mesh>
        ))
      )}
      <mesh position={[1.1, 1.6, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 2, 10]} />
        <meshStandardMaterial color={C.gold} roughness={0.5} metalness={0.2} />
      </mesh>
      <mesh position={[-1.1, 1.6, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 2, 10]} />
        <meshStandardMaterial color={C.gold} roughness={0.5} metalness={0.2} />
      </mesh>
      <RoundedBox args={[1.2, 0.8, 0.9]} radius={0.12} smoothness={3} position={[-0.3, 1.05, 0]} castShadow>
        <meshStandardMaterial color={C.sky} roughness={0.9} />
      </RoundedBox>
      <RoundedBox args={[0.9, 0.6, 0.8]} radius={0.1} smoothness={3} position={[0.7, 0.95, 0]} castShadow>
        <meshStandardMaterial color={C.pink} roughness={0.9} />
      </RoundedBox>
    </group>
  );
}
