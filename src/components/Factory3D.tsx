"use client";

import { useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { OrthographicCamera, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { C, CAM_OFFSET, CameraRig, InfoStand, Penguin, useWalker, type LobbyApi } from "@/components/world";

/** the floor is modelled at full size and shrunk so the whole plant fits on screen */
const SCALE = 0.72;
const START: [number, number, number] = [-2 * SCALE, 0, 7.2 * SCALE];
const BOUNDS = { minX: -16 * SCALE, maxX: 18 * SCALE, minZ: -8 * SCALE, maxZ: 8.5 * SCALE };
const GARMENT_COLORS = [C.magenta, C.neon, C.lime, C.gold, C.scarf, C.sky, C.plum, C.mint];
const DESK: [number, number] = [3 * SCALE, 7.4 * SCALE];
const SPOTS = [{ id: "desk", stand: DESK }];

export default function Factory3D({
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
      <color attach="background" args={["#141a2b"]} />
      <fog attach="fog" args={["#141a2b", 44, 82]} />

      <OrthographicCamera makeDefault position={CAM_OFFSET} zoom={zoom} near={-120} far={220} />
      <CameraRig posRef={playerRef} start={START} shift={panelOpen ? 7 : 0} />

      <hemisphereLight args={["#9fd4ff", "#2b1d4a", 0.7]} />
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[10, 22, 6]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={26}
        shadow-camera-bottom={-26}
      />
      <pointLight position={[-8, 7, -2]} intensity={90} color={C.magenta} distance={26} />
      <pointLight position={[8, 7, 2]} intensity={90} color={C.neon} distance={26} />

      <group scale={SCALE}>
        <FactoryShell onFloorClick={walkTo} />
        <GarmentRail z={-5.6} speed={1.1} />
        <GarmentRail z={-2.4} speed={-0.85} />
        <ShoeConveyor x={6} y={1.1} z={3.6} speed={3.2} />
        <ShoeConveyor x={6} y={2.4} z={1.4} speed={-2.4} />
        <SewingRow />
        <ShelfWall />
        <HangerAisle x={-11} />
        <HangerAisle x={-6.5} />
        <PackingBench />
        <PhotoStudio />
      </group>
      <InfoStand x={DESK[0]} z={DESK[1]} color={C.neon} onOpen={onDesk} />

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

function FactoryShell({ onFloorClick }: { onFloorClick: (e: ThreeEvent<MouseEvent>) => void }) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow onClick={onFloorClick}>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color={C.concrete} roughness={1} />
      </mesh>
      {/* hazard walkway stripes */}
      {Array.from({ length: 14 }, (_, i) => (
        <mesh key={i} position={[-13 + i * 2, 0.01, 7]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.1, 2.4]} />
          <meshStandardMaterial color={i % 2 ? C.gold : C.steelDark} roughness={1} />
        </mesh>
      ))}
      {/* walls */}
      <mesh position={[1, 5, -9.4]} receiveShadow>
        <boxGeometry args={[40, 10, 0.6]} />
        <meshStandardMaterial color={C.steelDark} roughness={1} />
      </mesh>
      <mesh position={[-17.4, 5, 0]} receiveShadow>
        <boxGeometry args={[0.6, 10, 20]} />
        <meshStandardMaterial color={C.steel} roughness={1} />
      </mesh>
      {/* corrugated ribs */}
      {Array.from({ length: 20 }, (_, i) => (
        <mesh key={i} position={[-17 + i * 2, 5, -9.05]}>
          <boxGeometry args={[0.22, 9, 0.16]} />
          <meshStandardMaterial color={C.steel} roughness={0.9} metalness={0.2} />
        </mesh>
      ))}
      {/* neon sign */}
      <mesh position={[0, 8, -9]}>
        <planeGeometry args={[11, 1.6]} />
        <meshStandardMaterial color={C.magenta} emissive={C.magenta} emissiveIntensity={1.4} toneMapped={false} />
      </mesh>
      <mesh position={[0, 6.6, -9]}>
        <planeGeometry args={[7, 0.32]} />
        <meshStandardMaterial color={C.neon} emissive={C.neon} emissiveIntensity={1.3} toneMapped={false} />
      </mesh>
      {/* ceiling strip lights */}
      {[-8, 0, 8].map((x) => (
        <mesh key={x} position={[x, 9.4, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[1.2, 0.2, 16]} />
          <meshStandardMaterial color="#ffffff" emissive="#dff6ff" emissiveIntensity={0.9} toneMapped={false} />
        </mesh>
      ))}
      {/* pallets of boxes */}
      {[
        [-15, -6.4],
        [-15, -3.4],
        [11.5, -6.6],
      ].map(([x, z]) => (
        <group key={`${x}:${z}`} position={[x, 0, z]}>
          <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.4, 0.4, 2.4]} />
            <meshStandardMaterial color={C.woodDark} roughness={1} />
          </mesh>
          <RoundedBox args={[2, 1.2, 2]} radius={0.06} smoothness={3} position={[0, 1, 0]} castShadow>
            <meshStandardMaterial color={C.wood} roughness={0.95} />
          </RoundedBox>
          <mesh position={[0, 1, 1.02]}>
            <planeGeometry args={[1.2, 0.5]} />
            <meshStandardMaterial color={C.magenta} emissive={C.magenta} emissiveIntensity={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** overhead rail with hangers of garments sliding along it */
function GarmentRail({ z, speed }: { z: number; speed: number }) {
  const group = useRef<THREE.Group>(null);
  const span = 26;

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    g.children.forEach((child, i) => {
      const base = (i / g.children.length) * span;
      const x = (((base + t * speed) % span) + span) % span;
      child.position.x = x - span / 2;
      child.rotation.z = Math.sin(t * 2 + i) * 0.09;
    });
  });

  return (
    <group position={[0, 0, z]}>
      <mesh position={[0, 5.2, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, span, 12]} />
        <meshStandardMaterial color={C.steel} roughness={0.5} metalness={0.6} />
      </mesh>
      {[-9, 0, 9].map((x) => (
        <mesh key={x} position={[x, 7.2, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 4, 10]} />
          <meshStandardMaterial color={C.steelDark} roughness={0.7} metalness={0.4} />
        </mesh>
      ))}
      <group ref={group}>
        {Array.from({ length: 14 }, (_, i) => (
          <group key={i} position={[0, 5.2, 0]}>
            <mesh position={[0, -0.18, 0]}>
              <torusGeometry args={[0.16, 0.035, 8, 16]} />
              <meshStandardMaterial color={C.steel} metalness={0.7} roughness={0.35} />
            </mesh>
            <mesh position={[0, -0.5, 0]} rotation={[0, 0, Math.PI]} castShadow>
              <coneGeometry args={[0.5, 0.5, 4]} />
              <meshStandardMaterial color={GARMENT_COLORS[i % GARMENT_COLORS.length]} roughness={0.9} />
            </mesh>
            <mesh position={[0, -1.35, 0]} rotation={[0, 0, Math.PI]} castShadow>
              <coneGeometry args={[0.85, 1.6, 4]} />
              <meshStandardMaterial color={GARMENT_COLORS[i % GARMENT_COLORS.length]} roughness={0.9} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

/** a conveyor layer with shoes riding along it */
function ShoeConveyor({ x, y, z, speed }: { x: number; y: number; z: number; speed: number }) {
  const shoes = useRef<THREE.Group>(null);
  const rollers = useRef<THREE.Group>(null);
  const span = 18;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (shoes.current) {
      shoes.current.children.forEach((child, i) => {
        const base = (i / shoes.current!.children.length) * span;
        const x = (((base + t * speed) % span) + span) % span;
        child.position.x = x - span / 2;
        child.position.y = Math.sin(t * 6 + i) * 0.03;
      });
    }
    if (rollers.current) rollers.current.children.forEach((c) => (c.rotation.x = t * speed * 2));
  });

  return (
    <group position={[x, y, z]}>
      {/* belt */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[span, 0.24, 1.8]} />
        <meshStandardMaterial color={C.steelDark} roughness={0.8} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.14, 0]} receiveShadow>
        <boxGeometry args={[span, 0.06, 1.5]} />
        <meshStandardMaterial color="#20263c" roughness={1} />
      </mesh>
      {/* legs */}
      {[-7.5, -2.5, 2.5, 7.5].map((lx) => (
        <mesh key={lx} position={[lx, -y / 2, 0]} castShadow>
          <boxGeometry args={[0.24, y, 0.24]} />
          <meshStandardMaterial color={C.steel} roughness={0.7} metalness={0.3} />
        </mesh>
      ))}
      <group ref={rollers}>
        {Array.from({ length: 9 }, (_, i) => (
          <mesh key={i} position={[-8 + i * 2, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.13, 0.13, 1.6, 10]} />
            <meshStandardMaterial color={C.steel} metalness={0.7} roughness={0.35} />
          </mesh>
        ))}
      </group>
      <group ref={shoes} position={[0, 0.3, 0]}>
        {Array.from({ length: 10 }, (_, i) => (
          <group key={i} rotation={[0, i % 2 ? 0.3 : -0.2, 0]}>
            <RoundedBox args={[0.95, 0.3, 0.45]} radius={0.12} smoothness={3} castShadow>
              <meshStandardMaterial color={GARMENT_COLORS[(i + 3) % GARMENT_COLORS.length]} roughness={0.7} />
            </RoundedBox>
            <RoundedBox args={[0.5, 0.36, 0.44]} radius={0.14} smoothness={3} position={[-0.2, 0.26, 0]} castShadow>
              <meshStandardMaterial color={C.cream} roughness={0.8} />
            </RoundedBox>
            <mesh position={[0, -0.18, 0]}>
              <boxGeometry args={[1, 0.1, 0.48]} />
              <meshStandardMaterial color={C.cream} roughness={0.9} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

/** workbenches with blinking terminals — the software side of the floor */
function SewingRow() {
  const screens = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    screens.current?.children.forEach((c, i) => {
      const mesh = c as THREE.Mesh;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.5 + Math.abs(Math.sin(t * 1.6 + i)) * 0.8;
    });
  });

  return (
    <group position={[0, 0, -7.4]}>
      {[-7, -1.5, 4, 9.5].map((x, i) => (
        <group key={x} position={[x, 0, 0]}>
          <RoundedBox args={[3.2, 0.2, 1.6]} radius={0.06} smoothness={3} position={[0, 1.5, 0]} castShadow>
            <meshStandardMaterial color={C.steel} roughness={0.7} metalness={0.3} />
          </RoundedBox>
          {[-1.4, 1.4].map((sx) => (
            <mesh key={sx} position={[sx, 0.75, 0]} castShadow>
              <boxGeometry args={[0.18, 1.5, 1.2]} />
              <meshStandardMaterial color={C.steelDark} roughness={0.8} />
            </mesh>
          ))}
          {/* sewing head */}
          <group position={[0.8, 1.6, 0]}>
            <mesh position={[0, 0.35, 0]} castShadow>
              <boxGeometry args={[1.1, 0.5, 0.5]} />
              <meshStandardMaterial color={i % 2 ? C.magenta : C.neon} roughness={0.6} />
            </mesh>
            <mesh position={[-0.45, 0.16, 0]} castShadow>
              <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
              <meshStandardMaterial color={C.cream} metalness={0.5} roughness={0.4} />
            </mesh>
          </group>
        </group>
      ))}
      <group ref={screens}>
        {[-7, -1.5, 4, 9.5].map((x, i) => (
          <mesh key={x} position={[x - 0.9, 2.3, -0.4]} rotation={[-0.15, 0.2, 0]}>
            <planeGeometry args={[1.3, 0.85]} />
            <meshStandardMaterial
              color={i % 2 ? C.lime : C.neon}
              emissive={i % 2 ? C.lime : C.neon}
              emissiveIntensity={0.8}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** floor-to-ceiling shelving packed with folded stock, like the stockroom photos */
function ShelfWall() {
  const stacks = useMemo(
    () =>
      Array.from({ length: 4 * 5 * 4 }, (_, i) => ({
        color: GARMENT_COLORS[(i * 5 + (i % 7)) % GARMENT_COLORS.length],
        h: 0.3 + ((i * 37) % 5) * 0.06,
        tilt: (((i * 17) % 7) - 3) * 0.02,
      })),
    []
  );

  return (
    <group position={[-16.2, 0, -1]} rotation={[0, Math.PI / 2, 0]}>
      {/* four bays of shelving */}
      {[-6.6, -2.2, 2.2, 6.6].map((x, bay) => (
        <group key={x} position={[x, 0, 0]}>
          {[-2.1, 2.1].map((sx) => (
            <mesh key={sx} position={[sx, 3.2, 0]} castShadow>
              <boxGeometry args={[0.18, 6.4, 1.6]} />
              <meshStandardMaterial color={C.steelDark} roughness={0.8} metalness={0.3} />
            </mesh>
          ))}
          {[0.9, 2.2, 3.5, 4.8, 6.1].map((y, shelf) => (
            <group key={y}>
              <mesh position={[0, y, 0]} castShadow receiveShadow>
                <boxGeometry args={[4.2, 0.12, 1.5]} />
                <meshStandardMaterial color={C.steel} roughness={0.7} metalness={0.25} />
              </mesh>
              {[-1.5, -0.5, 0.5, 1.5].map((sx, col) => {
                const s = stacks[(bay * 5 + shelf) * 4 + col];
                return (
                  <mesh key={sx} position={[sx, y + 0.06 + s.h / 2, 0]} rotation={[0, s.tilt, 0]} castShadow>
                    <boxGeometry args={[0.9, s.h, 1.2]} />
                    <meshStandardMaterial color={s.color} roughness={0.95} />
                  </mesh>
                );
              })}
            </group>
          ))}
        </group>
      ))}
    </group>
  );
}

/** a dense double rail of hanging garments — the aisles you squeeze through */
function HangerAisle({ x }: { x: number }) {
  const garments = useMemo(
    () =>
      Array.from({ length: 2 * 26 }, (_, i) => ({
        color: GARMENT_COLORS[(i * 3 + (i % 5)) % GARMENT_COLORS.length],
        len: 1.3 + ((i * 13) % 6) * 0.14,
        turn: ((i * 29) % 11) * 0.06,
      })),
    []
  );
  const span = 9;

  return (
    <group position={[x, 0, 2.5]}>
      {/* frame */}
      {[-span / 2 + 0.3, span / 2 - 0.3].map((z) => (
        <group key={z} position={[0, 0, z]}>
          {[-0.75, 0.75].map((sx) => (
            <mesh key={sx} position={[sx, 2.2, 0]} castShadow>
              <cylinderGeometry args={[0.09, 0.09, 4.4, 10]} />
              <meshStandardMaterial color={C.steel} roughness={0.5} metalness={0.6} />
            </mesh>
          ))}
          <mesh position={[0, 4.4, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.07, 0.07, 1.6, 8]} />
            <meshStandardMaterial color={C.steel} roughness={0.5} metalness={0.6} />
          </mesh>
        </group>
      ))}
      {[-0.75, 0.75].map((rx, row) => (
        <group key={rx} position={[rx, 0, 0]}>
          <mesh position={[0, 3.6, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.07, span, 10]} />
            <meshStandardMaterial color={C.steel} roughness={0.4} metalness={0.7} />
          </mesh>
          {Array.from({ length: 26 }, (_, i) => {
            const g = garments[row * 26 + i];
            const z = -span / 2 + 0.3 + i * ((span - 0.6) / 25);
            return (
              <group key={i} position={[0, 3.6, z]} rotation={[0, g.turn, 0]}>
                <mesh position={[0, -0.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
                  <torusGeometry args={[0.13, 0.03, 6, 12]} />
                  <meshStandardMaterial color={C.steel} metalness={0.7} roughness={0.35} />
                </mesh>
                <mesh position={[0, -0.42, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                  <boxGeometry args={[0.7, 0.12, 0.28]} />
                  <meshStandardMaterial color={C.cream} roughness={0.9} />
                </mesh>
                <mesh position={[0, -0.42 - g.len / 2, 0]} castShadow>
                  <boxGeometry args={[0.66, g.len, 0.22]} />
                  <meshStandardMaterial color={g.color} roughness={0.95} />
                </mesh>
              </group>
            );
          })}
        </group>
      ))}
      {/* size markers on the floor of the aisle */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.2, span]} />
        <meshStandardMaterial color="#7a8399" roughness={1} />
      </mesh>
    </group>
  );
}

/** packing bench: polybags, tape and labelled parcels going out */
function PackingBench() {
  return (
    <group position={[-2.5, 0, 7]} rotation={[0, 0.25, 0]}>
      <RoundedBox args={[5.2, 0.22, 2.2]} radius={0.06} smoothness={3} position={[0, 1.5, 0]} castShadow>
        <meshStandardMaterial color={C.wood} roughness={0.9} />
      </RoundedBox>
      {[-2.3, 2.3].map((sx) => (
        <mesh key={sx} position={[sx, 0.75, 0]} castShadow>
          <boxGeometry args={[0.2, 1.5, 1.8]} />
          <meshStandardMaterial color={C.steelDark} roughness={0.85} />
        </mesh>
      ))}
      {/* stacked mailing bags waiting for pickup */}
      {Array.from({ length: 9 }, (_, i) => (
        <mesh
          key={i}
          position={[-1.9 + (i % 3) * 0.95, 1.72 + Math.floor(i / 3) * 0.22, -0.4 + (i % 2) * 0.3]}
          rotation={[0, ((i * 31) % 9) * 0.08, 0]}
          castShadow
        >
          <boxGeometry args={[0.8, 0.2, 1]} />
          <meshStandardMaterial color={i % 3 === 0 ? C.cream : C.magenta} roughness={0.85} />
        </mesh>
      ))}
      {/* label printer */}
      <RoundedBox args={[0.9, 0.5, 0.7]} radius={0.06} smoothness={3} position={[1.9, 1.85, 0.3]} castShadow>
        <meshStandardMaterial color={C.steelDark} roughness={0.7} />
      </RoundedBox>
      <mesh position={[1.9, 2.12, 0.62]} rotation={[-0.5, 0, 0]}>
        <planeGeometry args={[0.6, 0.4]} />
        <meshStandardMaterial color={C.lime} emissive={C.lime} emissiveIntensity={0.7} toneMapped={false} />
      </mesh>
      {/* bagged orders on the floor */}
      {[
        [-3.4, 1.6],
        [-3.9, 0.4],
        [3.4, 1.2],
      ].map(([px, pz]) => (
        <mesh key={`${px}:${pz}`} position={[px, 0.35, pz]} rotation={[0, px, 0]} castShadow>
          <boxGeometry args={[1.3, 0.7, 1]} />
          <meshStandardMaterial color={C.cream} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

/** the shoot corner: cyclorama, softboxes, tripod and a product riser */
function PhotoStudio() {
  const flash = useRef<THREE.Mesh>(null);
  const turntable = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (turntable.current) turntable.current.rotation.y = t * 0.7;
    if (flash.current) {
      const mat = flash.current.material as THREE.MeshStandardMaterial;
      const pulse = Math.max(0, Math.sin(t * 0.9) ** 12);
      mat.emissiveIntensity = 0.6 + pulse * 6;
    }
  });

  return (
    <group position={[14, 0, 3]}>
      {/* seamless white backdrop curving into the floor */}
      <mesh position={[0, 3.5, -3.4]} receiveShadow>
        <boxGeometry args={[9, 7, 0.3]} />
        <meshStandardMaterial color="#f4f6fa" roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.9, -2.5]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <cylinderGeometry args={[1.4, 1.4, 9, 20, 1, true, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#f4f6fa" roughness={0.95} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.03, 0.2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[9, 5]} />
        <meshStandardMaterial color="#eef1f6" roughness={1} />
      </mesh>

      {/* softboxes on stands */}
      {[-3.2, 3.2].map((x) => (
        <group key={x} position={[x, 0, 1.4]} rotation={[0, x > 0 ? -0.5 : 0.5, 0]}>
          <mesh position={[0, 1.7, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.09, 3.4, 10]} />
            <meshStandardMaterial color={C.steelDark} roughness={0.7} metalness={0.3} />
          </mesh>
          {[0, 2.1, 4.2].map((a) => (
            <mesh key={a} position={[Math.cos(a) * 0.5, 0.3, Math.sin(a) * 0.5]} rotation={[0.5, -a, 0]} castShadow>
              <boxGeometry args={[0.08, 0.08, 1.1]} />
              <meshStandardMaterial color={C.steelDark} roughness={0.8} />
            </mesh>
          ))}
          <mesh position={[0, 3.6, -0.25]} rotation={[0.35, 0, 0]} castShadow>
            <boxGeometry args={[1.9, 1.9, 0.5]} />
            <meshStandardMaterial color={C.steelDark} roughness={0.8} />
          </mesh>
          <mesh position={[0, 3.45, 0.05]} rotation={[0.35, 0, 0]}>
            <planeGeometry args={[1.7, 1.7]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.1} toneMapped={false} />
          </mesh>
        </group>
      ))}
      <pointLight position={[0, 4, 2]} intensity={120} color="#ffffff" distance={16} />

      {/* camera on a tripod */}
      <group position={[0, 0, 3.6]}>
        {[0, 2.1, 4.2].map((a) => (
          <mesh key={a} position={[Math.cos(a) * 0.45, 0.85, Math.sin(a) * 0.45]} rotation={[Math.cos(a) * 0.25, 0, -Math.sin(a) * 0.25]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 1.8, 8]} />
            <meshStandardMaterial color={C.steelDark} roughness={0.7} metalness={0.3} />
          </mesh>
        ))}
        <RoundedBox args={[1.1, 0.75, 0.7]} radius={0.08} smoothness={3} position={[0, 2, 0]} castShadow>
          <meshStandardMaterial color="#1c2133" roughness={0.6} />
        </RoundedBox>
        <mesh position={[0, 2, -0.6]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.34, 0.7, 16]} />
          <meshStandardMaterial color="#12151f" roughness={0.4} metalness={0.5} />
        </mesh>
        <mesh ref={flash} position={[0, 2.5, 0]}>
          <sphereGeometry args={[0.16, 12, 12]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.6} toneMapped={false} />
        </mesh>
      </group>

      {/* product riser with a pair turning on it */}
      <mesh position={[0, 0.35, -0.6]} castShadow receiveShadow>
        <cylinderGeometry args={[1.3, 1.4, 0.7, 24]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
      <group ref={turntable} position={[0, 0.7, -0.6]}>
        {[-0.4, 0.4].map((z, i) => (
          <group key={z} position={[0, 0.2, z]} rotation={[0, i ? 0.2 : -0.15, 0]}>
            <RoundedBox args={[1.1, 0.34, 0.5]} radius={0.14} smoothness={3} castShadow>
              <meshStandardMaterial color={i ? C.magenta : C.neon} roughness={0.6} />
            </RoundedBox>
            <RoundedBox args={[0.55, 0.4, 0.48]} radius={0.15} smoothness={3} position={[-0.25, 0.3, 0]} castShadow>
              <meshStandardMaterial color={C.cream} roughness={0.8} />
            </RoundedBox>
          </group>
        ))}
      </group>

      {/* rail of shoot-ready pieces parked beside the set */}
      <group position={[4.6, 0, 2.4]} rotation={[0, -0.35, 0]}>
        {[-1.4, 1.4].map((z) => (
          <mesh key={z} position={[0, 1.7, z]} castShadow>
            <cylinderGeometry args={[0.07, 0.07, 3.4, 10]} />
            <meshStandardMaterial color={C.steel} roughness={0.5} metalness={0.6} />
          </mesh>
        ))}
        <mesh position={[0, 3.4, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 3, 10]} />
          <meshStandardMaterial color={C.steel} roughness={0.4} metalness={0.7} />
        </mesh>
        {Array.from({ length: 9 }, (_, i) => (
          <group key={i} position={[0, 3.4, -1.3 + i * 0.32]}>
            <mesh position={[0, -0.36, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <boxGeometry args={[0.66, 0.12, 0.26]} />
              <meshStandardMaterial color={C.cream} roughness={0.9} />
            </mesh>
            <mesh position={[0, -1.2, 0]} castShadow>
              <boxGeometry args={[0.62, 1.6, 0.2]} />
              <meshStandardMaterial color={GARMENT_COLORS[(i * 2) % GARMENT_COLORS.length]} roughness={0.95} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
