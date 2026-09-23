"use client";

import { useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { OrthographicCamera, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { C, CAM_OFFSET, CameraRig, InfoStand, Penguin, useWalker, type LobbyApi } from "@/components/world";

/** the plaza is modelled at full size and shrunk so both halves fit on screen */
const SCALE = 0.62;
const START: [number, number, number] = [0, 0, 6 * SCALE];
const BOUNDS = { minX: -21 * SCALE, maxX: 21 * SCALE, minZ: -11 * SCALE, maxZ: 12 * SCALE };
const DESK: [number, number] = [0, 10 * SCALE];
const SPOTS = [{ id: "desk", stand: DESK }];

const MADRID = "#90887d";
const MADRID_SAND = "#e7dac0";
const MADRID_STONE = "#f6f1e7";
const TEXAS = "#403c36";
const TEXAS_SKY = "#757e8a";
const GRASS = "#5c8161";

export default function Campus3D({
  api,
  onMove,
  onDesk,
  panelOpen,
}: {
  api: MutableRefObject<LobbyApi>;
  onMove: () => void;
  onDesk: () => void;
  panelOpen: boolean;
}) {
  const spots = useMemo(() => SPOTS, []);
  const { targetRef, playerRef, walkTo, zoom } = useWalker({
    api,
    spots,
    bounds: BOUNDS,
    start: START,
    onMove,
  });

  return (
    <Canvas shadows dpr={[1, 1.5]} gl={{ antialias: true }} style={{ touchAction: "none" }}>
      <color attach="background" args={["#c6cacf"]} />
      <fog attach="fog" args={["#c6cacf", 70, 120]} />

      <OrthographicCamera makeDefault position={CAM_OFFSET} zoom={zoom * 0.72} near={-160} far={260} />
      <CameraRig posRef={playerRef} start={START} shift={panelOpen ? 10 : 0} />

      <hemisphereLight args={["#ffffff", "#e6d8bc", 1]} />
      <ambientLight intensity={0.45} />
      <directionalLight
        position={[16, 26, 10]}
        intensity={2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={34}
        shadow-camera-bottom={-34}
      />

      <group scale={SCALE}>
        <Ground onFloorClick={walkTo} />
        <MadridSide />
        <TexasSide />
        <Meridian />
      </group>
      <InfoStand x={DESK[0]} z={DESK[1]} color={C.gold} onOpen={onDesk} />

      <Penguin
        targetRef={targetRef}
        posRef={playerRef}
        spots={spots}
        start={START}
        onNear={() => {}}
        onOpen={onDesk}
      />
    </Canvas>
  );
}

function Ground({ onFloorClick }: { onFloorClick: (e: ThreeEvent<MouseEvent>) => void }) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow onClick={onFloorClick}>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial color={GRASS} roughness={1} />
      </mesh>
      {/* Madrid plaza paving */}
      <mesh position={[-12, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[22, 26]} />
        <meshStandardMaterial color={MADRID_SAND} roughness={1} />
      </mesh>
      {Array.from({ length: 28 }, (_, i) => (
        <mesh
          key={i}
          position={[-21.5 + (i % 7) * 3.2, 0.03, -11 + Math.floor(i / 7) * 6.4]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[2.9, 6]} />
          <meshStandardMaterial color={i % 2 ? "#dac69e" : MADRID_SAND} roughness={1} />
        </mesh>
      ))}
      {/* Texas campus concrete */}
      <mesh position={[12, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[22, 26]} />
        <meshStandardMaterial color="#e2dac9" roughness={1} />
      </mesh>
      {/* the meridian path down the middle, lifted clear of the paving */}
      <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[4.4, 26]} />
        <meshStandardMaterial color={MADRID_STONE} roughness={1} />
      </mesh>
    </group>
  );
}

/* ------------------------------ Madrid ------------------------------ */

function MadridSide() {
  return (
    <group>
      <PuertaDeAlcala />
      <OsoYMadrono />
      <Cibeles />
      <SpanishFlag x={-20} z={4} />
      <BusinessDesk />
      <Awning x={-19.5} z={-8.5} />
    </group>
  );
}

/** Puerta de Alcalá: five arches in granite */
function PuertaDeAlcala() {
  const gaps = [-4.6, -2.3, 0, 2.3, 4.6];
  return (
    <group position={[-12, 0, -9]}>
      <mesh position={[0, 4.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[13, 8.8, 2.2]} />
        <meshStandardMaterial color={MADRID_STONE} roughness={1} />
      </mesh>
      {gaps.map((x, i) => {
        const big = i === 2;
        return (
          <group key={x} position={[x, 0, 0]}>
            <mesh position={[0, big ? 2.7 : 2.1, 0]}>
              <boxGeometry args={[big ? 2.6 : 1.4, big ? 5.4 : 4.2, 2.6]} />
              <meshStandardMaterial color="#504b44" roughness={1} />
            </mesh>
            <mesh position={[0, big ? 5.4 : 4.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[big ? 1.3 : 0.7, big ? 1.3 : 0.7, 2.6, 20, 1, false, 0, Math.PI]} />
              <meshStandardMaterial color="#504b44" roughness={1} side={THREE.DoubleSide} />
            </mesh>
          </group>
        );
      })}
      {/* cornice, attic and finials */}
      <mesh position={[0, 9, 0]} castShadow>
        <boxGeometry args={[13.8, 0.8, 2.8]} />
        <meshStandardMaterial color="#fdfcf9" roughness={1} />
      </mesh>
      <mesh position={[0, 10.2, 0]} castShadow>
        <boxGeometry args={[7, 1.8, 2.2]} />
        <meshStandardMaterial color={MADRID_STONE} roughness={1} />
      </mesh>
      {[-5.6, 5.6].map((x) => (
        <mesh key={x} position={[x, 9.9, 0]} castShadow>
          <sphereGeometry args={[0.7, 18, 18]} />
          <meshStandardMaterial color="#fdfcf9" roughness={0.9} />
        </mesh>
      ))}
      {/* half-columns */}
      {[-6.1, -3.5, 3.5, 6.1].map((x) => (
        <mesh key={x} position={[x, 4, 1.2]} castShadow>
          <cylinderGeometry args={[0.55, 0.6, 8, 16]} />
          <meshStandardMaterial color="#fdfcf9" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

/** El Oso y el Madroño: the bear and the strawberry tree */
function OsoYMadrono() {
  const bear = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (bear.current) bear.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.4) * 0.05;
  });

  return (
    <group position={[-5.6, 0, 2.6]}>
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.5, 1.7, 0.9, 20]} />
        <meshStandardMaterial color="#585c61" roughness={1} />
      </mesh>
      {/* madroño trunk and canopy */}
      <mesh position={[0.5, 2.4, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.36, 3.2, 12]} />
        <meshStandardMaterial color={C.woodDark} roughness={1} />
      </mesh>
      <mesh position={[0.5, 4.4, 0]} castShadow>
        <sphereGeometry args={[1.5, 20, 20]} />
        <meshStandardMaterial color="#4c6f52" roughness={1} />
      </mesh>
      {Array.from({ length: 7 }, (_, i) => (
        <mesh
          key={i}
          position={[0.5 + Math.cos(i * 1.7) * 1.2, 4.4 + Math.sin(i * 2.3) * 1, Math.sin(i * 1.1) * 1.2]}
        >
          <sphereGeometry args={[0.18, 10, 10]} />
          <meshStandardMaterial color={MADRID} roughness={0.8} />
        </mesh>
      ))}
      {/* the bear, reaching up the trunk */}
      <group ref={bear} position={[-0.5, 0.9, 0.2]}>
        <mesh position={[0, 1, 0]} rotation={[0, 0, 0.25]} castShadow>
          <capsuleGeometry args={[0.55, 1.1, 6, 16]} />
          <meshStandardMaterial color="#322f2b" roughness={0.95} />
        </mesh>
        <mesh position={[0.35, 2.1, 0]} castShadow>
          <sphereGeometry args={[0.45, 18, 18]} />
          <meshStandardMaterial color="#322f2b" roughness={0.95} />
        </mesh>
        {[-0.28, 0.28].map((z) => (
          <mesh key={z} position={[0.3, 2.5, z]} castShadow>
            <sphereGeometry args={[0.16, 12, 12]} />
            <meshStandardMaterial color="#322f2b" roughness={0.95} />
          </mesh>
        ))}
        <mesh position={[0.8, 1.7, 0]} rotation={[0, 0, -0.9]} castShadow>
          <capsuleGeometry args={[0.18, 0.9, 4, 12]} />
          <meshStandardMaterial color="#322f2b" roughness={0.95} />
        </mesh>
      </group>
    </group>
  );
}

/** Cibeles: chariot, lions and a fountain that keeps running */
function Cibeles() {
  const jets = useRef<THREE.Group>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    jets.current?.children.forEach((c, i) => {
      c.scale.y = 0.6 + Math.abs(Math.sin(t * 3 + i * 0.8)) * 0.7;
    });
  });

  return (
    <group position={[-13.5, 0, 6.5]}>
      <mesh position={[0, 0.3, 0]} receiveShadow>
        <cylinderGeometry args={[4.2, 4.4, 0.6, 32]} />
        <meshStandardMaterial color={MADRID_STONE} roughness={1} />
      </mesh>
      <mesh position={[0, 0.62, 0]} receiveShadow>
        <cylinderGeometry args={[3.7, 3.7, 0.2, 32]} />
        <meshStandardMaterial color="#8a919b" roughness={0.35} metalness={0.1} />
      </mesh>
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[1.4, 1.8, 1.2, 20]} />
        <meshStandardMaterial color="#c9c5bf" roughness={1} />
      </mesh>
      {/* the goddess on her chariot */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <coneGeometry args={[0.7, 1.9, 14]} />
        <meshStandardMaterial color="#efe9dc" roughness={0.95} />
      </mesh>
      <mesh position={[0, 3.7, 0]} castShadow>
        <sphereGeometry args={[0.34, 16, 16]} />
        <meshStandardMaterial color="#efe9dc" roughness={0.95} />
      </mesh>
      {/* lions */}
      {[-1.9, 1.9].map((x) => (
        <group key={x} position={[x, 1.7, 0.9]} rotation={[0, x > 0 ? -0.3 : 0.3, 0]}>
          <mesh castShadow>
            <capsuleGeometry args={[0.36, 0.8, 4, 12]} />
            <meshStandardMaterial color="#dfd2b8" roughness={1} />
          </mesh>
          <mesh position={[0, 0.2, 0.55]} castShadow>
            <sphereGeometry args={[0.36, 14, 14]} />
            <meshStandardMaterial color="#dfd2b8" roughness={1} />
          </mesh>
        </group>
      ))}
      <group ref={jets}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <mesh
            key={i}
            position={[Math.cos((i / 6) * Math.PI * 2) * 2.7, 1.4, Math.sin((i / 6) * Math.PI * 2) * 2.7]}
            castShadow
          >
            <cylinderGeometry args={[0.08, 0.14, 1.6, 8]} />
            <meshStandardMaterial color="#dbdde0" transparent opacity={0.8} roughness={0.2} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** Carlos III business desk under a plaza awning */
function BusinessDesk() {
  return (
    <group position={[-18.5, 0, -2]} rotation={[0, 0.5, 0]}>
      <RoundedBox args={[3.6, 0.24, 1.9]} radius={0.08} smoothness={3} position={[0, 1.5, 0]} castShadow>
        <meshStandardMaterial color={C.wood} roughness={0.8} />
      </RoundedBox>
      {[-1.5, 1.5].map((sx) => (
        <mesh key={sx} position={[sx, 0.75, 0]} castShadow>
          <boxGeometry args={[0.22, 1.5, 1.5]} />
          <meshStandardMaterial color={C.woodDark} roughness={0.9} />
        </mesh>
      ))}
      {[C.maroon, C.mint, C.plum, C.gold].map((col, i) => (
        <RoundedBox
          key={col}
          args={[0.24, 1.1, 0.8]}
          radius={0.04}
          smoothness={3}
          position={[-1 + i * 0.3, 2.17, -0.4]}
          rotation={[0, 0, i === 3 ? 0.22 : 0]}
          castShadow
        >
          <meshStandardMaterial color={col} roughness={0.9} />
        </RoundedBox>
      ))}
      {/* café con leche and a P&L */}
      <mesh position={[1.1, 1.72, 0.4]} castShadow>
        <cylinderGeometry args={[0.18, 0.14, 0.24, 14]} />
        <meshStandardMaterial color={C.cream} roughness={0.7} />
      </mesh>
      <mesh position={[0.1, 1.63, 0.5]} rotation={[-Math.PI / 2, 0, 0.3]}>
        <planeGeometry args={[1, 0.7]} />
        <meshStandardMaterial color="#ffffff" roughness={1} />
      </mesh>
    </group>
  );
}

function Awning({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      {[-1.8, 1.8].map((sx) => (
        <mesh key={sx} position={[sx, 1.6, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.09, 3.2, 10]} />
          <meshStandardMaterial color={C.steel} metalness={0.4} roughness={0.5} />
        </mesh>
      ))}
      {Array.from({ length: 6 }, (_, i) => (
        <mesh key={i} position={[-1.85 + i * 0.75, 3.3, 0]} castShadow>
          <boxGeometry args={[0.72, 0.16, 3]} />
          <meshStandardMaterial color={i % 2 ? MADRID : "#fdfcf9"} roughness={0.95} />
        </mesh>
      ))}
    </group>
  );
}

function SpanishFlag({ x, z }: { x: number; z: number }) {
  const flag = useRef<THREE.Group>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    flag.current?.children.forEach((c, i) => {
      c.position.z = Math.sin(t * 2.5 + i * 0.7) * 0.18;
      c.rotation.y = Math.sin(t * 2.5 + i * 0.7) * 0.12;
    });
  });

  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 4, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.14, 8, 12]} />
        <meshStandardMaterial color="#fcfcfa" roughness={0.8} />
      </mesh>
      <group ref={flag} position={[0, 7, 0]}>
        {Array.from({ length: 6 }, (_, i) => (
          <mesh key={i} position={[0.35 + i * 0.6, 0, 0]} castShadow>
            <boxGeometry args={[0.6, 1.6, 0.06]} />
            <meshStandardMaterial color={i % 2 ? C.gold : MADRID} roughness={0.9} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* ------------------------------ Texas ------------------------------ */

function TexasSide() {
  return (
    <group>
      <Capitol />
      <Pumpjack />
      <WaterTower />
      <Longhorn />
      <CsBench />
      <Cactus x={6.4} z={7.4} />
      <Cactus x={19} z={-6.5} />
    </group>
  );
}

/** Texas State Capitol: pink granite block under a dome and a star */
function Capitol() {
  return (
    <group position={[13, 0, -8.5]}>
      <mesh position={[0, 2.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[14, 4.4, 5]} />
        <meshStandardMaterial color="#c9c5c0" roughness={1} />
      </mesh>
      <mesh position={[0, 5, 0]} castShadow>
        <boxGeometry args={[6.4, 1.6, 5.4]} />
        <meshStandardMaterial color="#d7d4d0" roughness={1} />
      </mesh>
      {/* portico */}
      {[-2.4, -0.8, 0.8, 2.4].map((x) => (
        <mesh key={x} position={[x, 2.2, 2.9]} castShadow>
          <cylinderGeometry args={[0.32, 0.36, 4.4, 14]} />
          <meshStandardMaterial color="#fbfbfb" roughness={1} />
        </mesh>
      ))}
      <mesh position={[0, 4.9, 2.9]} rotation={[0, 0, 0]} castShadow>
        <coneGeometry args={[3.4, 1.4, 4]} />
        <meshStandardMaterial color="#fbfbfb" roughness={1} />
      </mesh>
      {/* drum, dome, lantern, star */}
      <mesh position={[0, 6.5, 0]} castShadow>
        <cylinderGeometry args={[2.2, 2.4, 1.8, 24]} />
        <meshStandardMaterial color="#d7d4d0" roughness={1} />
      </mesh>
      <mesh position={[0, 8.4, 0]} castShadow>
        <sphereGeometry args={[2.2, 26, 18, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#aca69e" roughness={0.9} />
      </mesh>
      <mesh position={[0, 10.6, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.6, 1.2, 14]} />
        <meshStandardMaterial color="#fbfbfb" roughness={0.9} />
      </mesh>
      <mesh position={[0, 11.9, 0]} rotation={[0, 0, 0]} castShadow>
        <coneGeometry args={[0.9, 1.4, 5]} />
        <meshStandardMaterial color={C.gold} emissive="#ba9449" emissiveIntensity={0.4} roughness={0.6} />
      </mesh>
      {/* Aggie maroon banner across the front */}
      <mesh position={[0, 3.4, 2.56]}>
        <planeGeometry args={[7.4, 1.2]} />
        <meshStandardMaterial color={TEXAS} roughness={0.9} />
      </mesh>
      <mesh position={[0, 3.4, 2.54]}>
        <circleGeometry args={[0.5, 5]} />
        <meshStandardMaterial color={C.gold} roughness={0.7} />
      </mesh>
    </group>
  );
}

/** a pumpjack nodding away on the prairie */
function Pumpjack() {
  const beam = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (beam.current) beam.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.6) * 0.32;
  });

  return (
    <group position={[19, 0, 3]} rotation={[0, -0.5, 0]}>
      <mesh position={[0, 0.25, 0]} receiveShadow>
        <boxGeometry args={[5.4, 0.5, 2.6]} />
        <meshStandardMaterial color="#554f48" roughness={1} />
      </mesh>
      {[-0.7, 0.7].map((z) => (
        <mesh key={z} position={[0, 2, z]} rotation={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.22, 3.6, 0.22]} />
          <meshStandardMaterial color={C.steelDark} roughness={0.8} metalness={0.3} />
        </mesh>
      ))}
      <group ref={beam} position={[0, 3.8, 0]}>
        <mesh castShadow>
          <boxGeometry args={[6.4, 0.42, 0.5]} />
          <meshStandardMaterial color={TEXAS} roughness={0.8} />
        </mesh>
        <mesh position={[3.1, -0.4, 0]} castShadow>
          <boxGeometry args={[0.9, 1, 0.5]} />
          <meshStandardMaterial color={C.steelDark} roughness={0.8} />
        </mesh>
        <mesh position={[-3, -0.5, 0]} castShadow>
          <boxGeometry args={[1.2, 1.2, 0.7]} />
          <meshStandardMaterial color={C.gold} roughness={0.7} />
        </mesh>
      </group>
    </group>
  );
}

/** water tower with the lone star painted on the tank */
function WaterTower() {
  return (
    <group position={[7.5, 0, -3.5]}>
      {[
        [-1.2, -1.2],
        [1.2, -1.2],
        [-1.2, 1.2],
        [1.2, 1.2],
      ].map(([x, z]) => (
        <mesh key={`${x}:${z}`} position={[x, 3, z]} rotation={[z * 0.05, 0, -x * 0.05]} castShadow>
          <cylinderGeometry args={[0.14, 0.14, 6, 10]} />
          <meshStandardMaterial color={C.steel} metalness={0.4} roughness={0.6} />
        </mesh>
      ))}
      <mesh position={[0, 7, 0]} castShadow>
        <cylinderGeometry args={[2.2, 2.2, 2.6, 22]} />
        <meshStandardMaterial color="#fbfbfb" roughness={0.9} />
      </mesh>
      <mesh position={[0, 8.7, 0]} castShadow>
        <coneGeometry args={[2.3, 1.2, 22]} />
        <meshStandardMaterial color={C.steel} roughness={0.8} metalness={0.2} />
      </mesh>
      <mesh position={[0, 5.5, 0]} castShadow>
        <coneGeometry args={[2.2, 1.4, 22]} />
        <meshStandardMaterial color="#fbfbfb" roughness={0.9} />
      </mesh>
      <mesh position={[0, 7, 2.22]}>
        <circleGeometry args={[1.2, 5]} />
        <meshStandardMaterial color={TEXAS} roughness={0.9} />
      </mesh>
    </group>
  );
}

/** longhorn skull on a fence post */
function Longhorn() {
  return (
    <group position={[5.6, 0, 1.6]}>
      <mesh position={[0, 1.4, 0]} castShadow>
        <boxGeometry args={[0.5, 2.8, 0.5]} />
        <meshStandardMaterial color={C.woodDark} roughness={1} />
      </mesh>
      <mesh position={[0, 3.2, 0.1]} castShadow>
        <boxGeometry args={[1, 1.2, 0.6]} />
        <meshStandardMaterial color="#fdfcf9" roughness={0.9} />
      </mesh>
      <mesh position={[0, 2.5, 0.1]} castShadow>
        <coneGeometry args={[0.45, 0.9, 10]} />
        <meshStandardMaterial color="#fdfcf9" roughness={0.9} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 1.1, 3.7, 0.1]} rotation={[0, 0, s * -0.8]} castShadow>
          <torusGeometry args={[0.7, 0.12, 8, 18, Math.PI]} />
          <meshStandardMaterial color="#f8f4ec" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

/** the CS lab bench: where the software half of the degree happened */
function CsBench() {
  const screens = useRef<THREE.Group>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    screens.current?.children.forEach((c, i) => {
      const mat = (c as THREE.Mesh).material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.45 + Math.abs(Math.sin(t * 1.7 + i)) * 0.7;
    });
  });

  return (
    <group position={[15.5, 0, 6.5]} rotation={[0, -0.6, 0]}>
      <RoundedBox args={[5, 0.24, 2]} radius={0.08} smoothness={3} position={[0, 1.5, 0]} castShadow>
        <meshStandardMaterial color={C.cream} roughness={0.8} />
      </RoundedBox>
      {[-2.2, 2.2].map((sx) => (
        <mesh key={sx} position={[sx, 0.75, 0]} castShadow>
          <boxGeometry args={[0.22, 1.5, 1.6]} />
          <meshStandardMaterial color={TEXAS} roughness={0.9} />
        </mesh>
      ))}
      {[-1.4, 1.4].map((sx) => (
        <group key={sx} position={[sx, 1.62, -0.3]}>
          <mesh position={[0, 0.72, 0]} rotation={[-0.12, 0, 0]} castShadow>
            <boxGeometry args={[1.8, 1.15, 0.12]} />
            <meshStandardMaterial color="#26292d" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.2, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.26, 0.36, 12]} />
            <meshStandardMaterial color="#26292d" roughness={0.7} />
          </mesh>
        </group>
      ))}
      <group ref={screens}>
        {[-1.4, 1.4].map((sx) => (
          <mesh key={sx} position={[sx, 2.34, -0.21]} rotation={[-0.12, 0, 0]}>
            <planeGeometry args={[1.6, 0.98]} />
            <meshStandardMaterial color={C.mint} emissive={C.mint} emissiveIntensity={0.6} toneMapped={false} />
          </mesh>
        ))}
      </group>
      <RoundedBox args={[1.7, 0.08, 0.6]} radius={0.03} smoothness={3} position={[0, 1.66, 0.6]} castShadow>
        <meshStandardMaterial color={TEXAS_SKY} roughness={0.8} />
      </RoundedBox>
    </group>
  );
}

function Cactus({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 1.8, 0]} castShadow>
        <capsuleGeometry args={[0.5, 2.4, 6, 14]} />
        <meshStandardMaterial color="#4c6f52" roughness={1} />
      </mesh>
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * 0.85, 2.1, 0]} rotation={[0, 0, (s * Math.PI) / 2]} castShadow>
            <capsuleGeometry args={[0.3, 0.7, 4, 12]} />
            <meshStandardMaterial color="#55795c" roughness={1} />
          </mesh>
          <mesh position={[s * 1.2, 2.9, 0]} castShadow>
            <capsuleGeometry args={[0.3, 1.1, 4, 12]} />
            <meshStandardMaterial color="#55795c" roughness={1} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* --------------------------- the meridian --------------------------- */

/** globe, plane and the two-flag arch that ties the sides together */
function Meridian() {
  const plane = useRef<THREE.Group>(null);
  const globe = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (globe.current) globe.current.rotation.y = t * 0.4;
    if (plane.current) {
      const a = t * 0.55;
      plane.current.position.set(Math.cos(a) * 7.5, 7.5 + Math.sin(a * 2) * 0.7, 2 + Math.sin(a) * 4.5);
      plane.current.rotation.set(0, -a, Math.sin(a) * 0.25);
    }
  });

  return (
    <group>
      <group position={[0, 0, 2]}>
        <mesh position={[0, 1, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.5, 1.9, 2, 22]} />
          <meshStandardMaterial color={MADRID_STONE} roughness={1} />
        </mesh>
        <mesh ref={globe} position={[0, 3.6, 0]} castShadow>
          <sphereGeometry args={[1.7, 30, 30]} />
          <meshStandardMaterial color={TEXAS_SKY} roughness={0.75} />
        </mesh>
        <mesh position={[0, 3.6, 0]} rotation={[0, 0, 0.4]}>
          <torusGeometry args={[2, 0.08, 10, 34]} />
          <meshStandardMaterial color={C.gold} roughness={0.5} metalness={0.3} />
        </mesh>
      </group>
      <group ref={plane}>
        <mesh castShadow>
          <capsuleGeometry args={[0.22, 1, 4, 12]} />
          <meshStandardMaterial color={C.cream} roughness={0.6} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <boxGeometry args={[0.1, 2.2, 0.45]} />
          <meshStandardMaterial color={C.scarf} roughness={0.7} />
        </mesh>
      </group>

      {/* 8,000 km marker between the two halves */}
      <mesh position={[0, 0.09, -6]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.4, 0.35]} />
        <meshStandardMaterial color={C.plum} roughness={1} />
      </mesh>
      <mesh position={[0, 0.09, 9]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.4, 0.35]} />
        <meshStandardMaterial color={C.plum} roughness={1} />
      </mesh>
    </group>
  );
}
