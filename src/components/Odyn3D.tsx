"use client";

import { useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { OrthographicCamera, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { C, CAM_OFFSET, CameraRig, InfoStand, Penguin, useWalker, type LobbyApi } from "@/components/world";
import { odyn } from "@/data/projects";

const START: [number, number, number] = [-6, 0, 6];
const BOUNDS = { minX: -11, maxX: 11, minZ: -3.5, maxZ: 7.5 };
const DESK: [number, number] = [7, 5.4];

const PURPLE = "#7c5cff";
const WALL = "#1b1733";
const FLOOR = "#2a2447";
const BARS = 22;

export default function Odyn3D({
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
      <color attach="background" args={["#14112a"]} />
      <fog attach="fog" args={["#14112a", 50, 94]} />

      <OrthographicCamera makeDefault position={CAM_OFFSET} zoom={zoom * 0.95} near={-140} far={240} />
      <CameraRig posRef={playerRef} start={START} shift={panelOpen ? 8 : 0} />

      <hemisphereLight args={["#dfe6ff", "#14112a", 0.75]} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[12, 24, 12]} intensity={1.35} castShadow shadow-mapSize={[2048, 2048]} />

      <MeetingRoom onFloorClick={walkTo} />
      <CallWall />
      <Table />
      <InfoStand x={DESK[0]} z={DESK[1]} color={PURPLE} onOpen={onDesk} />

      <Penguin targetRef={targetRef} posRef={playerRef} spots={spots} start={START} onNear={() => {}} onOpen={onDesk} />
    </Canvas>
  );
}

function MeetingRoom({ onFloorClick }: { onFloorClick: (e: ThreeEvent<MouseEvent>) => void }) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow onClick={onFloorClick}>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color={FLOOR} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.01, 1.8]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial color="#332b57" roughness={1} />
      </mesh>

      <mesh position={[0, 7, -6]} receiveShadow>
        <boxGeometry args={[28, 14, 0.6]} />
        <meshStandardMaterial color={WALL} roughness={1} />
      </mesh>
      <mesh position={[-14, 7, 0.5]} receiveShadow>
        <boxGeometry args={[0.6, 14, 14]} />
        <meshStandardMaterial color="#221d3f" roughness={1} />
      </mesh>
      {/* the office-glass side, so the room stays open to the camera */}
      <mesh position={[14, 7, 0.5]}>
        <boxGeometry args={[0.3, 14, 14]} />
        <meshStandardMaterial color="#bfe6ff" transparent opacity={0.14} roughness={0.1} />
      </mesh>
      {[-4.5, 0.5, 5.5].map((z) => (
        <mesh key={z} position={[14, 7, z]}>
          <boxGeometry args={[0.36, 14, 0.16]} />
          <meshStandardMaterial color={PURPLE} emissive={PURPLE} emissiveIntensity={0.5} toneMapped={false} />
        </mesh>
      ))}
      {/* a skyline outside the glass */}
      {[2, -1, 4, 0.5, 3].map((h, i) => (
        <mesh key={i} position={[18 + (i % 2) * 2.5, 4 + h, -6 + i * 3.4]}>
          <boxGeometry args={[3, 8 + h * 2, 3]} />
          <meshStandardMaterial color="#2c2550" roughness={1} emissive="#3d3470" emissiveIntensity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

/** the wall screen: waveform, per-call tiles and the value strip */
function CallWall() {
  const bars = useRef<THREE.Group>(null);
  const gauge = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (bars.current) {
      bars.current.children.forEach((bar, i) => {
        const h = 0.4 + Math.abs(Math.sin(t * 2.4 + i * 0.5)) * 2.4;
        bar.scale.y = h;
        bar.position.y = 5.4 + (h * 0.5 - 0.5) * 0.5;
      });
    }
    if (gauge.current) {
      gauge.current.scale.x = 0.55 + Math.sin(t * 0.7) * 0.35;
      gauge.current.position.x = -3.4 + gauge.current.scale.x * 3.4;
    }
  });

  return (
    <group position={[-2, 0, -5.6]}>
      <RoundedBox args={[15, 8.4, 0.4]} radius={0.16} smoothness={3} position={[0, 6.6, 0]} castShadow>
        <meshStandardMaterial color="#0e0b1c" roughness={0.75} />
      </RoundedBox>
      <mesh position={[0, 6.6, 0.22]}>
        <planeGeometry args={[14.2, 7.6]} />
        <meshStandardMaterial color="#12102a" roughness={0.9} />
      </mesh>

      {/* live waveform */}
      <group ref={bars} position={[0, 0, 0.3]}>
        {Array.from({ length: BARS }, (_, i) => (
          <mesh key={i} position={[-6.4 + i * 0.6, 5.4, 0]}>
            <boxGeometry args={[0.3, 1, 0.08]} />
            <meshStandardMaterial color={PURPLE} emissive={PURPLE} emissiveIntensity={1} toneMapped={false} />
          </mesh>
        ))}
      </group>

      {/* attitude gauge */}
      <mesh position={[0, 8.6, 0.3]}>
        <planeGeometry args={[7, 0.5]} />
        <meshStandardMaterial color="#251f47" roughness={1} />
      </mesh>
      <mesh ref={gauge} position={[-1.5, 8.6, 0.34]} scale={[0.6, 1, 1]}>
        <planeGeometry args={[7, 0.34]} />
        <meshStandardMaterial color={C.mint} emissive={C.mint} emissiveIntensity={0.8} toneMapped={false} />
      </mesh>

      {/* the three meeting platforms it listens to */}
      {["#2d8cff", "#00ac47", "#5b5fc7"].map((color, i) => (
        <group key={color} position={[-4.6 + i * 4.6, 3.2, 0.3]}>
          <mesh>
            <planeGeometry args={[3.8, 2.2]} />
            <meshStandardMaterial color="#1b1738" roughness={1} />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <circleGeometry args={[0.52, 24]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.7} toneMapped={false} />
          </mesh>
          <mesh position={[0, -0.95, 0.02]}>
            <planeGeometry args={[3.4, 0.1]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} toneMapped={false} />
          </mesh>
        </group>
      ))}

      {/* the values strip along the bottom of the wall */}
      {odyn.values.map((value, i) => (
        <mesh key={value} position={[-6 + i * 2.4, 1.4, 0.3]}>
          <planeGeometry args={[2, 0.36]} />
          <meshStandardMaterial color={PURPLE} emissive={PURPLE} emissiveIntensity={0.35} toneMapped={false} />
        </mesh>
      ))}
      <pointLight position={[0, 6, 4]} intensity={60} color={PURPLE} distance={26} />
    </group>
  );
}

/** the meeting table with a laptop still in the call */
function Table() {
  const dot = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!dot.current) return;
    const mat = dot.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 0.5 + Math.abs(Math.sin(state.clock.elapsedTime * 2)) * 0.8;
  });

  return (
    <group position={[-2, 0, 1.6]}>
      <RoundedBox args={[10, 0.3, 3.6]} radius={0.12} smoothness={3} position={[0, 1.2, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#efe7ff" roughness={0.5} />
      </RoundedBox>
      {[-4, 4].map((sx) => (
        <mesh key={sx} position={[sx, 0.6, 0]} castShadow>
          <boxGeometry args={[0.4, 1.2, 2.4]} />
          <meshStandardMaterial color={C.steelDark} roughness={0.7} metalness={0.3} />
        </mesh>
      ))}
      {[-3.2, -1, 1.2, 3.4].map((sx) =>
        [-2.8, 2.8].map((sz) => (
          <group key={`${sx}-${sz}`} position={[sx, 0, sz]}>
            <RoundedBox args={[1.3, 0.24, 1.3]} radius={0.1} smoothness={3} position={[0, 1, 0]} castShadow>
              <meshStandardMaterial color={PURPLE} roughness={0.85} />
            </RoundedBox>
            <RoundedBox
              args={[1.3, 1.5, 0.2]}
              radius={0.1}
              smoothness={3}
              position={[0, 1.7, sz > 0 ? 0.55 : -0.55]}
              castShadow
            >
              <meshStandardMaterial color={PURPLE} roughness={0.85} />
            </RoundedBox>
            <mesh position={[0, 0.5, 0]} castShadow>
              <cylinderGeometry args={[0.12, 0.16, 1, 10]} />
              <meshStandardMaterial color={C.steelDark} roughness={0.7} />
            </mesh>
          </group>
        )),
      )}

      {/* laptop, mid-call */}
      <group position={[0.6, 1.35, 0]}>
        <RoundedBox args={[2, 0.1, 1.4]} radius={0.04} smoothness={3} castShadow>
          <meshStandardMaterial color={C.steel} roughness={0.5} metalness={0.5} />
        </RoundedBox>
        <RoundedBox args={[2, 1.3, 0.08]} radius={0.04} smoothness={3} position={[0, 0.65, -0.7]} rotation={[-0.3, 0, 0]} castShadow>
          <meshStandardMaterial color={C.steelDark} roughness={0.6} />
        </RoundedBox>
        <mesh position={[0, 0.66, -0.63]} rotation={[-0.3, 0, 0]}>
          <planeGeometry args={[1.8, 1.1]} />
          <meshStandardMaterial color={PURPLE} emissive={PURPLE} emissiveIntensity={0.7} toneMapped={false} />
        </mesh>
        <mesh ref={dot} position={[0.8, 1.15, -0.9]}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshStandardMaterial color="#ff3d6e" emissive="#ff3d6e" emissiveIntensity={0.9} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}
