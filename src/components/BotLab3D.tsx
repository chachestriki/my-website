"use client";

import { useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { OrthographicCamera, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { C, CAM_OFFSET, CameraRig, InfoStand, Penguin, useWalker, type LobbyApi } from "@/components/world";
import { botlab } from "@/data/projects";

const START: [number, number, number] = [-6, 0, 6];
const BOUNDS = { minX: -11, maxX: 11, minZ: -3.5, maxZ: 7.5 };
const DESK: [number, number] = [7, 5.4];

const GREEN = "#2ecf9f";
const RED = "#ff3d6e";
const WALL = "#12241f";
const FLOOR = "#1b302a";
/** the labelled wall: 6 x 3 accounts, a fifth of them bots */
const COLS = 6;
const ROWS = 3;

export default function BotLab3D({
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
  const spots = useMemo(() => [{ id: "desk", stand: DESK }], []);
  const { targetRef, playerRef, walkTo, zoom } = useWalker({ api, spots, bounds: BOUNDS, start: START, onMove });

  return (
    <Canvas shadows dpr={[1, 1.5]} gl={{ antialias: true }} style={{ touchAction: "none" }}>
      <color attach="background" args={["#0d1a16"]} />
      <fog attach="fog" args={["#0d1a16", 50, 94]} />

      <OrthographicCamera makeDefault position={CAM_OFFSET} zoom={zoom * 0.95} near={-140} far={240} />
      <CameraRig posRef={playerRef} start={START} shift={panelOpen ? 8 : 0} />

      <hemisphereLight args={["#d8ffee", "#0d1a16", 0.75]} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[12, 24, 12]} intensity={1.35} castShadow shadow-mapSize={[2048, 2048]} />

      <Lab onFloorClick={walkTo} />
      <AccountWall />
      <Pipeline />
      <InfoStand x={DESK[0]} z={DESK[1]} color={GREEN} onOpen={onDesk} />

      <Penguin targetRef={targetRef} posRef={playerRef} spots={spots} start={START} onNear={() => {}} onOpen={onDesk} />
    </Canvas>
  );
}

function Lab({ onFloorClick }: { onFloorClick: (e: ThreeEvent<MouseEvent>) => void }) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow onClick={onFloorClick}>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color={FLOOR} roughness={0.95} />
      </mesh>
      {/* lab floor grid */}
      {Array.from({ length: 10 }, (_, i) => (
        <mesh key={i} position={[-11 + i * 2.5, 0.01, 2]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.06, 14]} />
          <meshStandardMaterial color="#25453b" roughness={1} />
        </mesh>
      ))}

      <mesh position={[0, 7, -6]} receiveShadow>
        <boxGeometry args={[28, 14, 0.6]} />
        <meshStandardMaterial color={WALL} roughness={1} />
      </mesh>
      <mesh position={[-14, 7, 0.5]} receiveShadow>
        <boxGeometry args={[0.6, 14, 14]} />
        <meshStandardMaterial color="#16302a" roughness={1} />
      </mesh>
      <mesh position={[14, 7, 0.5]}>
        <boxGeometry args={[0.3, 14, 14]} />
        <meshStandardMaterial color="#bfe6ff" transparent opacity={0.12} roughness={0.1} />
      </mesh>
    </group>
  );
}

/** the profile grid: each card is scored live, bots flagged red */
function AccountWall() {
  const cards = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!cards.current) return;
    cards.current.children.forEach((card, i) => {
      const scan = (Math.sin(t * 0.6 - i * 0.35) + 1) / 2;
      card.scale.setScalar(0.96 + scan * 0.06);
    });
  });

  return (
    <group position={[-2.5, 0, -5.6]}>
      <RoundedBox args={[16, 9, 0.4]} radius={0.16} smoothness={3} position={[0, 6.4, 0]} castShadow>
        <meshStandardMaterial color="#0c1c17" roughness={0.85} />
      </RoundedBox>

      <group ref={cards}>
        {Array.from({ length: COLS * ROWS }, (_, i) => {
          const bot = i % 5 === 2;
          const col = i % COLS;
          const row = Math.floor(i / COLS);
          const color = bot ? RED : GREEN;
          return (
            <group key={i} position={[-6.5 + col * 2.6, 9 - row * 2.5, 0.24]}>
              <mesh>
                <planeGeometry args={[2.2, 2.1]} />
                <meshStandardMaterial color="#14322a" roughness={1} />
              </mesh>
              {/* avatar circle and two text lines */}
              <mesh position={[-0.6, 0.45, 0.02]}>
                <circleGeometry args={[0.36, 20]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} toneMapped={false} />
              </mesh>
              <mesh position={[0.35, 0.55, 0.02]}>
                <planeGeometry args={[1, 0.16]} />
                <meshStandardMaterial color="#6f8f85" roughness={1} />
              </mesh>
              <mesh position={[0.2, 0.25, 0.02]}>
                <planeGeometry args={[0.7, 0.12]} />
                <meshStandardMaterial color="#456b60" roughness={1} />
              </mesh>
              {/* the verdict bar */}
              <mesh position={[0, -0.6, 0.02]}>
                <planeGeometry args={[1.8, 0.3]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.7} toneMapped={false} />
              </mesh>
            </group>
          );
        })}
      </group>
      <pointLight position={[0, 6, 4]} intensity={55} color={GREEN} distance={26} />
    </group>
  );
}

/** collect → features → label → classify, as lit nodes on a bench */
function Pipeline() {
  const pulse = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!pulse.current) return;
    const t = state.clock.elapsedTime % 4;
    pulse.current.position.x = -4.5 + (t / 4) * 9;
  });

  return (
    <group position={[-2, 0, 2.6]}>
      <RoundedBox args={[12, 0.3, 2.6]} radius={0.1} smoothness={3} position={[0, 1.2, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#e7fff6" roughness={0.6} />
      </RoundedBox>
      {[-5, 5].map((sx) => (
        <mesh key={sx} position={[sx, 0.6, 0]} castShadow>
          <boxGeometry args={[0.4, 1.2, 2]} />
          <meshStandardMaterial color={C.steelDark} roughness={0.75} />
        </mesh>
      ))}

      {/* the rail the sample travels along */}
      <mesh position={[0, 1.45, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 9.4, 8]} />
        <meshStandardMaterial color={GREEN} emissive={GREEN} emissiveIntensity={0.4} toneMapped={false} />
      </mesh>
      <mesh ref={pulse} position={[-4.5, 1.45, 0]}>
        <sphereGeometry args={[0.2, 14, 14]} />
        <meshStandardMaterial color={C.lime} emissive={C.lime} emissiveIntensity={1} toneMapped={false} />
      </mesh>

      {botlab.pipeline.map((stage, i) => (
        <group key={stage.step} position={[-4.5 + i * 3, 1.35, 0]}>
          <RoundedBox args={[1.9, 1.2, 1.2]} radius={0.12} smoothness={3} position={[0, 0.6, 0]} castShadow>
            <meshStandardMaterial color="#1f4a3f" roughness={0.8} />
          </RoundedBox>
          <mesh position={[0, 1.24, 0]}>
            <boxGeometry args={[1.5, 0.12, 0.9]} />
            <meshStandardMaterial
              color={i === botlab.pipeline.length - 1 ? RED : GREEN}
              emissive={i === botlab.pipeline.length - 1 ? RED : GREEN}
              emissiveIntensity={0.8}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
