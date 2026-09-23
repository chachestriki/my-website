"use client";

import type { MutableRefObject } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { Html, OrthographicCamera, RoundedBox } from "@react-three/drei";
import { useMemo, useState } from "react";
import type * as THREE from "three";
import { stations } from "@/data/stations";
import {
  Beacon,
  C,
  CAM_OFFSET,
  CameraRig,
  DoorSign,
  Penguin,
  Pad,
  useWalker,
  type LobbyApi,
} from "@/components/world";

export type { LobbyApi };

const START: [number, number, number] = [1.5, 0, 9.4];
const BOUNDS = { minX: -15.6, maxX: 15.6, minZ: -11.5, maxZ: 11.5 };

export default function Lobby3D({
  api,
  onNear,
  onOpen,
  onMove,
  moved,
}: {
  api: MutableRefObject<LobbyApi>;
  onNear: (id: string | null) => void;
  onOpen: (id: string) => void;
  onMove: () => void;
  /** before the first step only the career door is labelled, to keep the first view calm */
  moved: boolean;
}) {
  const spots = useMemo(() => stations.map((s) => ({ id: s.id, stand: s.stand })), []);
  const { targetRef, playerRef, walkTo, zoom } = useWalker({
    api,
    spots,
    bounds: BOUNDS,
    start: START,
    onMove,
    fit: 1.06,
  });
  const first = stations.find((s) => s.id === "career");
  /** only the station the penguin is closest to wears its label */
  const [closest, setClosest] = useState<string | null>(null);

  return (
    <Canvas shadows dpr={[1, 1.5]} gl={{ antialias: true }} style={{ touchAction: "none" }}>
      <color attach="background" args={["#ffd9c0"]} />
      <fog attach="fog" args={["#ffd9c0", 48, 84]} />

      <OrthographicCamera makeDefault position={CAM_OFFSET} zoom={zoom} near={-120} far={220} />
      <CameraRig posRef={playerRef} start={START} />

      <hemisphereLight args={["#ffffff", "#ffb3cf", 0.85]} />
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[12, 20, 8]}
        intensity={1.9}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={34}
        shadow-camera-bottom={-34}
      />

      <Lobby onFloorClick={walkTo} />

      {!moved && first && <Beacon x={first.stand[0]} z={first.stand[1]} color={C.gold} />}

      <ClosestStation posRef={playerRef} onChange={setClosest} />

      {stations.map((s) => (
        <group key={s.id}>
          <Pad x={s.stand[0]} z={s.stand[1]} onClick={() => api.current.goTo?.(s.id)} />
          {(closest === s.id || (!moved && s.id === "career")) && (
          <Html position={s.label} center zIndexRange={[10, 0]} className="pointer-events-none">
            <div className="whitespace-nowrap rounded-2xl border-2 border-white bg-white/90 px-3 py-1.5 text-center shadow-[0_6px_0_rgba(107,91,143,0.18)]">
              <span className="block font-mono text-[10px] uppercase tracking-widest text-teal">{s.object}</span>
              <span className="block text-sm font-bold text-brass">{s.title}</span>
            </div>
          </Html>
          )}
        </group>
      ))}

      <Penguin
        targetRef={targetRef}
        posRef={playerRef}
        spots={spots}
        start={START}
        facing={Math.atan2((first?.stand[0] ?? 0) - START[0], (first?.stand[1] ?? 0) - START[2])}
        onNear={onNear}
        onOpen={onOpen}
      />
    </Canvas>
  );
}

/** reports which station the walker is nearest to, so only that one is labelled */
function ClosestStation({
  posRef,
  onChange,
}: {
  posRef: MutableRefObject<THREE.Vector3>;
  onChange: (id: string | null) => void;
}) {
  useFrame(() => {
    let best = stations[0];
    let bestDist = Infinity;
    for (const s of stations) {
      const d = Math.hypot(s.stand[0] - posRef.current.x, s.stand[1] - posRef.current.z);
      if (d < bestDist) {
        bestDist = d;
        best = s;
      }
    }
    onChange(best.id);
  });
  return null;
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
        <planeGeometry args={[34, 25]} />
        <meshStandardMaterial color={C.cream} roughness={1} />
      </mesh>
      {/* chequered inlay */}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh key={i} position={[-8.75 + i * 2.5, 0.01, 8.8]} rotation={[-Math.PI / 2, 0, 0]}>
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
      <mesh position={[0, 4, -12.5]} receiveShadow>
        <boxGeometry args={[34, 8, 0.6]} />
        <meshStandardMaterial color={C.wall} roughness={1} />
      </mesh>
      <mesh position={[-16.7, 4, 0]} receiveShadow>
        <boxGeometry args={[0.6, 8, 25]} />
        <meshStandardMaterial color={C.wallSide} roughness={1} />
      </mesh>
      {/* the camera-side wall is glazed, so it frames the room without hiding it */}
      <mesh position={[16.7, 4, 0]}>
        <boxGeometry args={[0.3, 8, 25]} />
        <meshStandardMaterial color="#bfe6ff" transparent opacity={0.2} roughness={0.15} />
      </mesh>
      {[-10, -5, 5, 10].map((z) => (
        <mesh key={z} position={[16.7, 4, z]}>
          <boxGeometry args={[0.36, 8, 0.18]} />
          <meshStandardMaterial color={C.gold} roughness={0.6} metalness={0.3} />
        </mesh>
      ))}
      {/* skirting */}
      <mesh position={[0, 0.3, -12.15]}>
        <boxGeometry args={[34, 0.6, 0.3]} />
        <meshStandardMaterial color={C.cream} roughness={1} />
      </mesh>

      <Reception />
      <KeyRack />
      <Terminal />
      <PhoneBooth />
      <BellDesk />
      <FreightDoor />
      <CampusDoor />
      <GalleryDoor />
      <LoungeDoor />
      <Plant x={-14} z={8.4} />
      <Plant x={14.6} z={5} />
      <Sofa />
      <LuggageCart />
      <CoffeeTable />
      <Suitcase x={-9.2} z={9.4} rot={0.6} color={C.pink} />
      <Suitcase x={-15} z={-8} rot={-0.3} color={C.sky} />
    </group>
  );
}

function Reception() {
  return (
    <group position={[0, 0, -7.4]}>
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
    <group position={[-16.1, 0, -2]} rotation={[0, Math.PI / 2, 0]}>
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
    <group position={[11, 0, -6]} rotation={[0, -0.5, 0]}>
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
    <group position={[-11.4, 0, 0.4]} rotation={[0, 0.5, 0]}>
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
    <group position={[6.8, 0, 7]}>
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

/** the door out to the Vice Resell floor */
function FreightDoor() {
  return (
    <group position={[-16.4, 0, 4.5]} rotation={[0, Math.PI / 2, 0]}>
      <RoundedBox args={[4.4, 6.4, 0.4]} radius={0.14} smoothness={4} position={[0, 3.2, 0]} castShadow>
        <meshStandardMaterial color={C.gold} roughness={0.6} metalness={0.15} />
      </RoundedBox>
      <mesh position={[0, 3.2, 0.24]}>
        <planeGeometry args={[3.6, 5.6]} />
        <meshStandardMaterial color={C.steelDark} roughness={0.8} metalness={0.3} />
      </mesh>
      {[1.2, 2.6, 4].map((y) => (
        <mesh key={y} position={[0, y, 0.26]}>
          <planeGeometry args={[3.4, 0.3]} />
          <meshStandardMaterial color={C.gold} roughness={0.6} />
        </mesh>
      ))}
      <Handle y={3.2} x={1.5} />
      <group position={[0, 7.1, 0.1]}>
        <DoorSign label="Vice Resell" color={C.magenta} width={4.8} />
      </group>
    </group>
  );
}

/** the door into the hobbies lounge */
function LoungeDoor() {
  return (
    <group position={[-16.4, 0, -9]} rotation={[0, Math.PI / 2, 0]}>
      <RoundedBox args={[4.2, 6.4, 0.4]} radius={0.16} smoothness={4} position={[0, 3.2, 0]} castShadow>
        <meshStandardMaterial color={C.mint} roughness={0.8} />
      </RoundedBox>
      <mesh position={[0, 3.2, 0.24]}>
        <planeGeometry args={[3.4, 5.4]} />
        <meshStandardMaterial color="#2c1c3a" roughness={0.9} />
      </mesh>
      {/* a guitar silhouette on the door: body, neck and headstock */}
      <mesh position={[0, 2.2, 0.28]}>
        <circleGeometry args={[0.85, 28]} />
        <meshStandardMaterial color={C.pink} emissive={C.pink} emissiveIntensity={0.5} toneMapped={false} />
      </mesh>
      <mesh position={[0, 4, 0.28]}>
        <planeGeometry args={[0.34, 2.8]} />
        <meshStandardMaterial color={C.gold} emissive={C.gold} emissiveIntensity={0.4} toneMapped={false} />
      </mesh>
      <mesh position={[0, 5.5, 0.28]}>
        <planeGeometry args={[0.6, 0.7]} />
        <meshStandardMaterial color={C.gold} emissive={C.gold} emissiveIntensity={0.4} toneMapped={false} />
      </mesh>
      <Handle y={3.2} x={1.4} />
      <group position={[0, 7, 0.1]}>
        <DoorSign label="Hobbies" color={C.mint} width={4.6} extra />
      </group>
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
    <group position={[12, 0, 8]} rotation={[0, -0.7, 0]}>
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
    <group position={[15.4, 0, 1.4]}>
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
    <group position={[-3, 0, 8.6]} rotation={[0, 0.4, 0]}>
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

/** the push bar every door gets, so a doorway reads as a door */
function Handle({ x, y }: { x: number; y: number }) {
  return (
    <group position={[x, y, 0.3]}>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.09, 1.3, 10]} />
        <meshStandardMaterial color={C.gold} roughness={0.4} metalness={0.5} />
      </mesh>
      {[-0.6, 0.6].map((dy) => (
        <mesh key={dy} position={[0, dy, -0.12]} rotation={[0, Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.26, 8]} />
          <meshStandardMaterial color={C.gold} roughness={0.4} metalness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

/** the door into the career hall */
function GalleryDoor() {
  return (
    <group position={[6.4, 0, -12.1]}>
      <RoundedBox args={[4.2, 6.6, 0.4]} radius={0.16} smoothness={4} position={[0, 3.3, 0]} castShadow>
        <meshStandardMaterial color={C.plum} roughness={0.8} />
      </RoundedBox>
      <mesh position={[0, 3.3, 0.24]}>
        <planeGeometry args={[3.4, 5.6]} />
        <meshStandardMaterial color="#2a1b2e" roughness={0.9} />
      </mesh>
      {/* three little frames hinting at the hall inside */}
      {[-1, 0, 1].map((i) => (
        <mesh key={i} position={[i * 1.05, 3.8, 0.26]}>
          <planeGeometry args={[0.8, 1]} />
          <meshStandardMaterial color={C.gold} emissive={C.gold} emissiveIntensity={0.35} toneMapped={false} />
        </mesh>
      ))}
      <Handle y={3.3} x={1.4} />
      <group position={[0, 7.1, 0.1]}>
        <DoorSign label="Career log" color={C.gold} width={4.6} />
      </group>
    </group>
  );
}

/** the door out to the education campus */
function CampusDoor() {
  return (
    <group position={[16.4, 0, -1]} rotation={[0, -Math.PI / 2, 0]}>
      <RoundedBox args={[4.6, 6.8, 0.4]} radius={0.16} smoothness={4} position={[0, 3.4, 0]} castShadow>
        <meshStandardMaterial color={C.wood} roughness={0.8} />
      </RoundedBox>
      {/* glazed double door showing daylight outside */}
      <mesh position={[0, 3.4, 0.24]}>
        <planeGeometry args={[3.8, 5.8]} />
        <meshStandardMaterial color="#bfe6ff" emissive="#8fd4ff" emissiveIntensity={0.55} roughness={0.3} />
      </mesh>
      <mesh position={[0, 3.4, 0.26]}>
        <planeGeometry args={[0.12, 5.8]} />
        <meshStandardMaterial color={C.woodDark} roughness={0.9} />
      </mesh>
      <mesh position={[0, 6.9, 0.16]}>
        <circleGeometry args={[2.3, 24, 0, Math.PI]} />
        <meshStandardMaterial color="#ffe08a" emissive="#ffb703" emissiveIntensity={0.4} roughness={0.9} />
      </mesh>
      <Handle y={3.4} x={1.6} />
      <group position={[0, 8.1, 0.16]}>
        <DoorSign label="Education" color={C.sky} width={4.8} extra />
      </group>
      {/* pennants over the doorway, half Spain, half Texas */}
      {Array.from({ length: 7 }, (_, i) => (
        <mesh key={i} position={[-2.4 + i * 0.8, 7.4 - Math.sin((i / 6) * Math.PI) * 0.35, 0.3]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.26, 0.6, 3]} />
          <meshStandardMaterial color={i < 3 ? C.maroon : C.gold} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}
