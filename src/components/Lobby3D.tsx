"use client";

import type { MutableRefObject } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { Html, OrthographicCamera, RoundedBox } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { stations } from "@/data/stations";
import { C, CAM_OFFSET, CameraRig, Cowboy, Pad, useWalker, type LobbyApi } from "@/components/world";


export type { LobbyApi };

const START: [number, number, number] = [1.5, 0, 7.4];
const BOUNDS = { minX: -12.5, maxX: 26.4, minZ: -9, maxZ: 9 };

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
  const spots = useMemo(() => stations.map((s) => ({ id: s.id, stand: s.stand })), []);
  const { targetRef, playerRef, walkTo, zoom } = useWalker({
    api,
    spots,
    bounds: BOUNDS,
    start: START,
    onMove,
  });

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

      {stations.map((s) => (
        <group key={s.id}>
          <Pad x={s.stand[0]} z={s.stand[1]} onClick={() => api.current.goTo?.(s.id)} />
          <Html position={s.label} center zIndexRange={[10, 0]} className="pointer-events-none">
            <div className="whitespace-nowrap rounded-2xl border-2 border-white bg-white/90 px-3 py-1.5 text-center shadow-[0_6px_0_rgba(107,91,143,0.18)]">
              <span className="block font-mono text-[10px] uppercase tracking-widest text-teal">{s.object}</span>
              <span className="block text-sm font-bold text-brass">{s.title}</span>
            </div>
          </Html>
        </group>
      ))}

      <Cowboy
        targetRef={targetRef}
        posRef={playerRef}
        spots={spots}
        start={START}
        onNear={onNear}
        onOpen={onOpen}
      />
    </Canvas>
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
        <planeGeometry args={[27, 20]} />
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
      {/* divider with an archway into the study wing */}
      <mesh position={[13.4, 1.4, -6.6]} receiveShadow>
        <boxGeometry args={[0.6, 2.8, 7]} />
        <meshStandardMaterial color={C.wallSide} roughness={1} />
      </mesh>
      <mesh position={[13.4, 1.4, 5.6]} receiveShadow>
        <boxGeometry args={[0.6, 2.8, 7]} />
        <meshStandardMaterial color={C.wallSide} roughness={1} />
      </mesh>
      {[-3.2, 2.2].map((z) => (
        <mesh key={z} position={[13.4, 2.6, z]} castShadow>
          <cylinderGeometry args={[0.45, 0.5, 5.2, 14]} />
          <meshStandardMaterial color={C.cream} roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[13.4, 5.4, -0.5]} castShadow>
        <boxGeometry args={[0.7, 0.8, 6.4]} />
        <meshStandardMaterial color={C.gold} roughness={0.8} />
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
      <StudyWing />
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
    <group position={[-9.4, 0, -9.6]}>
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
      {/* factory sign over the door */}
      <mesh position={[0, 7, 0.1]}>
        <planeGeometry args={[4.4, 0.9]} />
        <meshStandardMaterial color={C.magenta} emissive={C.magenta} emissiveIntensity={0.8} toneMapped={false} />
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

function StudyWing() {
  const plane = useRef<THREE.Group>(null);
  const globe = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (globe.current) globe.current.rotation.y = t * 0.5;
    if (plane.current) {
      const a = t * 0.7;
      plane.current.position.set(20 + Math.cos(a) * 4.6, 6.4 + Math.sin(a * 2) * 0.4, -1 + Math.sin(a) * 4.6);
      plane.current.rotation.y = -a;
    }
  });

  return (
    <group>
      {/* wing floor + split between Madrid and Texas */}
      <mesh position={[20, 0.006, -1]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 18]} />
        <meshStandardMaterial color={C.cream} roughness={1} />
      </mesh>
      <mesh position={[20, 0.014, -5.6]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[13, 8]} />
        <meshStandardMaterial color="#ffb03a" roughness={1} />
      </mesh>
      <mesh position={[20, 0.014, 3.6]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[13, 8]} />
        <meshStandardMaterial color="#3f72d8" roughness={1} />
      </mesh>

      {/* wing walls, only on the far sides so the camera can see in */}
      <mesh position={[20.5, 4, -10]} receiveShadow>
        <boxGeometry args={[15, 8, 0.6]} />
        <meshStandardMaterial color="#ff9f4a" roughness={1} />
      </mesh>
      <mesh position={[27.6, 4, -1]} receiveShadow>
        <boxGeometry args={[0.6, 8, 18]} />
        <meshStandardMaterial color="#6fb0ff" roughness={1} />
      </mesh>

      {/* Madrid: arched window over a plaza-tiled corner */}
      <mesh position={[20, 4.4, -9.6]}>
        <planeGeometry args={[4.4, 4.4]} />
        <meshStandardMaterial color="#ffe08a" roughness={1} emissive="#ffb703" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[20, 6.6, -9.58]}>
        <circleGeometry args={[2.2, 24, 0, Math.PI]} />
        <meshStandardMaterial color="#ffe08a" roughness={1} emissive="#ffb703" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[20, 4.4, -9.5]}>
        <planeGeometry args={[0.18, 4.4]} />
        <meshStandardMaterial color={C.maroon} roughness={0.9} />
      </mesh>

      {/* Madrid: Carlos III business desk */}
      <group position={[17, 0, -6]} rotation={[0, 0.3, 0]}>
        <RoundedBox args={[3.4, 0.24, 1.8]} radius={0.08} smoothness={3} position={[0, 1.5, 0]} castShadow>
          <meshStandardMaterial color={C.wood} roughness={0.8} />
        </RoundedBox>
        {[-1.4, 1.4].map((sx) => (
          <mesh key={sx} position={[sx, 0.75, 0]} castShadow>
            <boxGeometry args={[0.22, 1.5, 1.4]} />
            <meshStandardMaterial color={C.woodDark} roughness={0.9} />
          </mesh>
        ))}
        {[C.maroon, C.mint, C.plum, C.gold].map((col, i) => (
          <RoundedBox
            key={col}
            args={[0.22, 1.1, 0.8]}
            radius={0.04}
            smoothness={3}
            position={[-1 + i * 0.28, 2.17, -0.4]}
            rotation={[0, 0, i === 3 ? 0.22 : 0]}
            castShadow
          >
            <meshStandardMaterial color={col} roughness={0.9} />
          </RoundedBox>
        ))}
        {/* espresso cup */}
        <mesh position={[1, 1.72, 0.4]} castShadow>
          <cylinderGeometry args={[0.18, 0.14, 0.24, 14]} />
          <meshStandardMaterial color={C.cream} roughness={0.7} />
        </mesh>
      </group>

      {/* Texas: computer science bench */}
      <group position={[23.4, 0, 4.4]} rotation={[0, -0.5, 0]}>
        <RoundedBox args={[4, 0.24, 1.8]} radius={0.08} smoothness={3} position={[0, 1.5, 0]} castShadow>
          <meshStandardMaterial color={C.cream} roughness={0.8} />
        </RoundedBox>
        {[-1.7, 1.7].map((sx) => (
          <mesh key={sx} position={[sx, 0.75, 0]} castShadow>
            <boxGeometry args={[0.2, 1.5, 1.4]} />
            <meshStandardMaterial color={C.plum} roughness={0.9} />
          </mesh>
        ))}
        {[-1.1, 1.1].map((sx) => (
          <group key={sx} position={[sx, 1.62, -0.3]}>
            <mesh position={[0, 0.7, 0]} rotation={[-0.12, 0, 0]} castShadow>
              <boxGeometry args={[1.7, 1.1, 0.12]} />
              <meshStandardMaterial color="#1f2547" roughness={0.6} />
            </mesh>
            <mesh position={[0, 0.7, 0.08]} rotation={[-0.12, 0, 0]}>
              <planeGeometry args={[1.5, 0.92]} />
              <meshStandardMaterial color={C.mint} emissive={C.mint} emissiveIntensity={0.55} roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.16, 0]} castShadow>
              <cylinderGeometry args={[0.1, 0.24, 0.32, 12]} />
              <meshStandardMaterial color="#1f2547" roughness={0.7} />
            </mesh>
          </group>
        ))}
        <RoundedBox args={[1.6, 0.08, 0.6]} radius={0.03} smoothness={3} position={[0, 1.66, 0.5]} castShadow>
          <meshStandardMaterial color={C.sky} roughness={0.8} />
        </RoundedBox>
      </group>

      {/* Texas: lone star on the wall */}
      <mesh position={[27.25, 5, 4]} rotation={[0, -Math.PI / 2, 0]}>
        <circleGeometry args={[1.5, 5]} />
        <meshStandardMaterial color={C.gold} emissive="#ffb703" emissiveIntensity={0.3} roughness={0.7} />
      </mesh>

      {/* globe on a plinth, with a plane circling Madrid ↔ Texas */}
      <group position={[20, 0, -1]}>
        <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.1, 1.4, 1.6, 20]} />
          <meshStandardMaterial color={C.woodDark} roughness={0.9} />
        </mesh>
        <mesh ref={globe} position={[0, 2.6, 0]} castShadow>
          <sphereGeometry args={[1.2, 28, 28]} />
          <meshStandardMaterial color={C.sky} roughness={0.75} />
        </mesh>
        <mesh position={[0, 2.6, 0]} rotation={[0, 0, 0.4]}>
          <torusGeometry args={[1.45, 0.06, 10, 32]} />
          <meshStandardMaterial color={C.gold} roughness={0.5} metalness={0.3} />
        </mesh>
      </group>
      <group ref={plane}>
        <mesh castShadow>
          <capsuleGeometry args={[0.16, 0.7, 4, 10]} />
          <meshStandardMaterial color={C.cream} roughness={0.6} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <boxGeometry args={[0.08, 1.5, 0.34]} />
          <meshStandardMaterial color={C.scarf} roughness={0.7} />
        </mesh>
      </group>

      {/* pennants strung across the wing */}
      {Array.from({ length: 9 }, (_, i) => (
        <mesh
          key={i}
          position={[15 + i * 1.25, 6.6 - Math.sin((i / 8) * Math.PI) * 0.5, -9.2]}
          rotation={[0, 0, Math.PI]}
        >
          <coneGeometry args={[0.3, 0.7, 3]} />
          <meshStandardMaterial color={i % 2 ? C.maroon : C.gold} roughness={0.9} />
        </mesh>
      ))}

      <Plant x={15.4} z={6.4} />
    </group>
  );
}
