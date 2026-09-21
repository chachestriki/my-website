"use client";

import { useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { OrthographicCamera, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { C, CAM_OFFSET, CameraRig, Cowboy, useWalker, type LobbyApi } from "@/components/world";

const START: [number, number, number] = [-2, 0, 7.2];
const BOUNDS = { minX: -13, maxX: 13, minZ: -8, maxZ: 8.5 };
const GARMENT_COLORS = [C.magenta, C.neon, C.lime, C.gold, C.scarf, C.sky, C.plum, C.mint];
const NO_SPOTS: { id: string; stand: [number, number] }[] = [];

export default function Factory3D({ api, onMove }: { api: MutableRefObject<LobbyApi>; onMove: () => void }) {
  const spots = useMemo(() => NO_SPOTS, []);
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
      <CameraRig posRef={playerRef} start={START} />

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

      <FactoryShell onFloorClick={walkTo} />
      <GarmentRail z={-5.6} speed={1.1} />
      <GarmentRail z={-2.4} speed={-0.85} />
      <ShoeConveyor y={1.1} z={3.6} speed={3.2} />
      <ShoeConveyor y={2.4} z={1.4} speed={-2.4} />
      <SewingRow />

      <Cowboy
        targetRef={targetRef}
        posRef={playerRef}
        spots={spots}
        start={START}
        onNear={() => {}}
        onOpen={() => {}}
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
      <mesh position={[0, 5, -9.4]} receiveShadow>
        <boxGeometry args={[30, 10, 0.6]} />
        <meshStandardMaterial color={C.steelDark} roughness={1} />
      </mesh>
      <mesh position={[-14.4, 5, 0]} receiveShadow>
        <boxGeometry args={[0.6, 10, 20]} />
        <meshStandardMaterial color={C.steel} roughness={1} />
      </mesh>
      {/* corrugated ribs */}
      {Array.from({ length: 15 }, (_, i) => (
        <mesh key={i} position={[-14 + i * 2, 5, -9.05]}>
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
        [-11, -6.4],
        [-11, -3.4],
        [11.5, -6],
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
function ShoeConveyor({ y, z, speed }: { y: number; z: number; speed: number }) {
  const shoes = useRef<THREE.Group>(null);
  const rollers = useRef<THREE.Group>(null);
  const span = 26;

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
    <group position={[0, y, z]}>
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
      {[-10, -3, 4, 11].map((x) => (
        <mesh key={x} position={[x, -y / 2, 0]} castShadow>
          <boxGeometry args={[0.24, y, 0.24]} />
          <meshStandardMaterial color={C.steel} roughness={0.7} metalness={0.3} />
        </mesh>
      ))}
      <group ref={rollers}>
        {Array.from({ length: 13 }, (_, i) => (
          <mesh key={i} position={[-12 + i * 2, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
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
