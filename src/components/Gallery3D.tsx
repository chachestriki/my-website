"use client";

import { Suspense, useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useLoader, type ThreeEvent } from "@react-three/fiber";
import { OrthographicCamera, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { C, CAM_OFFSET, CameraRig, Penguin, Pad, useWalker, type LobbyApi } from "@/components/world";
import { career, type CareerStop } from "@/data/career";

const START: [number, number, number] = [-14, 0, 3];
const BOUNDS = { minX: -18, maxX: 18, minZ: -4.4, maxZ: 5.5 };
const DESK: [number, number] = [0, 4.2];
const SPOTS = [{ id: "desk", stand: DESK }];
/** one painting every 6 units along the long wall */
const SLOT = 6;
const x0 = -((career.length - 1) * SLOT) / 2;

const WALL = "#faf7f2";
const WALL_DARK = "#dbd9d5";
const FLOOR = "#999187";
const RUNNER = "#5a554d";

export default function Gallery3D({
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
  const { targetRef, playerRef, walkTo, zoom } = useWalker({ api, spots, bounds: BOUNDS, start: START, onMove });

  return (
    <Canvas shadows dpr={[1, 1.5]} gl={{ antialias: true }} style={{ touchAction: "none" }}>
      <color attach="background" args={["#201e1c"]} />
      <fog attach="fog" args={["#201e1c", 52, 96]} />

      <OrthographicCamera makeDefault position={CAM_OFFSET} zoom={zoom * 0.88} near={-140} far={240} />
      <CameraRig posRef={playerRef} start={START} shift={panelOpen ? 8 : 0} />

      <hemisphereLight args={["#f8f5ee", "#2a2723", 0.8]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[14, 24, 12]} intensity={1.5} castShadow shadow-mapSize={[2048, 2048]} />

      <Hall onFloorClick={walkTo} />
      {career.map((stop, i) => (
        <Painting key={stop.id} stop={stop} x={x0 + i * SLOT} index={i} last={i === career.length - 1} />
      ))}
      <Desk />
      <Pad x={DESK[0]} z={DESK[1]} onClick={onDesk} />

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

function Hall({ onFloorClick }: { onFloorClick: (e: ThreeEvent<MouseEvent>) => void }) {
  const width = career.length * SLOT + 6;
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow onClick={onFloorClick}>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color={FLOOR} roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.01, 0.6]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[width, 5.2]} />
        <meshStandardMaterial color={RUNNER} roughness={1} />
      </mesh>

      {/* the long wall the career hangs on */}
      <mesh position={[0, 5, -7]} receiveShadow>
        <boxGeometry args={[width, 10, 0.6]} />
        <meshStandardMaterial color={WALL} roughness={1} />
      </mesh>
      <mesh position={[0, 0.5, -6.65]}>
        <boxGeometry args={[width, 1, 0.2]} />
        <meshStandardMaterial color={WALL_DARK} roughness={1} />
      </mesh>
      {/* back wall behind the camera side, kept low so the hall reads open */}
      <mesh position={[0, 2.4, 7.6]} receiveShadow>
        <boxGeometry args={[width, 4.8, 0.6]} />
        <meshStandardMaterial color={WALL_DARK} roughness={1} />
      </mesh>
      <mesh position={[-width / 2, 5, 0.3]} receiveShadow>
        <boxGeometry args={[0.6, 10, 15]} />
        <meshStandardMaterial color={WALL_DARK} roughness={1} />
      </mesh>
      {/* the right end is glass, so the hall doesn't close in on the camera */}
      <mesh position={[width / 2, 5, 0.3]}>
        <boxGeometry args={[0.3, 10, 15]} />
        <meshStandardMaterial color="#eff0f1" transparent opacity={0.18} roughness={0.1} metalness={0.1} />
      </mesh>
      {[-4.2, 0.3, 4.8].map((z) => (
        <mesh key={z} position={[width / 2, 5, z]}>
          <boxGeometry args={[0.36, 10, 0.16]} />
          <meshStandardMaterial color={C.gold} roughness={0.5} metalness={0.4} />
        </mesh>
      ))}
      {/* ceiling track lights */}
      {career.map((stop, i) => (
        <mesh key={stop.id} position={[x0 + i * SLOT, 8.6, -5.2]} rotation={[0.9, 0, 0]}>
          <coneGeometry args={[0.45, 0.8, 14]} />
          <meshStandardMaterial color={C.gold} emissive={C.gold} emissiveIntensity={0.7} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

/** a painted logo on canvas — a wordmark in the company's colour */
function usePaintedLogo(stop: CareerStop) {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 420;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#fdfcf9";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = stop.color;
    ctx.globalAlpha = 0.14;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;

    ctx.fillStyle = stop.color;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, 150, 76, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fdfcf9";
    ctx.font = "bold 86px ui-sans-serif, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(stop.company.slice(0, 1).toUpperCase(), canvas.width / 2, 156);

    ctx.fillStyle = "#23211e";
    ctx.font = "bold 54px ui-sans-serif, system-ui, sans-serif";
    ctx.fillText(stop.company, canvas.width / 2, 286);
    ctx.fillStyle = stop.color;
    ctx.font = "500 34px ui-monospace, monospace";
    ctx.fillText(stop.period, canvas.width / 2, 350);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  }, [stop]);
}

/** a real logo file, matted on the painted canvas */
function LogoCanvas({ src, color }: { src: string; color: string }) {
  const texture = useLoader(THREE.TextureLoader, src);

  return (
    <group>
      <mesh>
        <planeGeometry args={[3.9, 2.7]} />
        <meshStandardMaterial color="#fdfcf9" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[2.4, 2.4]} />
        <meshStandardMaterial map={texture} map-colorSpace={THREE.SRGBColorSpace} roughness={0.85} />
      </mesh>
      <mesh position={[0, -1.18, 0.02]}>
        <planeGeometry args={[3.9, 0.14]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
    </group>
  );
}

function Painting({ stop, x, index, last }: { stop: CareerStop; x: number; index: number; last: boolean }) {
  const texture = usePaintedLogo(stop);
  const node = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (node.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 2 + index) * 0.08;
      node.current.scale.setScalar(s);
    }
  });

  return (
    <group position={[x, 0, -6.6]}>
      {/* frame + canvas */}
      <RoundedBox args={[4.4, 3.2, 0.3]} radius={0.06} smoothness={3} position={[0, 5.4, 0]} castShadow>
        <meshStandardMaterial color={C.gold} roughness={0.45} metalness={0.35} />
      </RoundedBox>
      {stop.logo ? (
        <group position={[0, 5.4, 0.18]}>
          <Suspense
            fallback={
              <mesh>
                <planeGeometry args={[3.9, 2.7]} />
                <meshStandardMaterial color="#fdfcf9" roughness={0.9} />
              </mesh>
            }
          >
            <LogoCanvas src={stop.logo} color={stop.color} />
          </Suspense>
        </group>
      ) : (
        <mesh position={[0, 5.4, 0.18]}>
          <planeGeometry args={[3.9, 2.7]} />
          {texture ? (
            <meshStandardMaterial map={texture} roughness={0.9} />
          ) : (
            <meshStandardMaterial color={stop.color} roughness={0.9} />
          )}
        </mesh>
      )}

      {/* plaque */}
      <mesh position={[0, 3.45, 0.12]} castShadow>
        <boxGeometry args={[2.6, 0.5, 0.1]} />
        <meshStandardMaterial color={C.woodDark} roughness={0.8} />
      </mesh>
      <mesh position={[0, 3.45, 0.18]}>
        <planeGeometry args={[2.2, 0.16]} />
        <meshStandardMaterial color={stop.color} emissive={stop.color} emissiveIntensity={0.5} toneMapped={false} />
      </mesh>

      {/* the line: rail between stops plus a node under each painting */}
      <mesh ref={node} position={[0, 2.4, 0.2]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color={stop.color} emissive={stop.color} emissiveIntensity={0.9} toneMapped={false} />
      </mesh>
      {!last && (
        <mesh position={[SLOT / 2, 2.4, 0.16]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.05, SLOT, 8]} />
          <meshStandardMaterial color={C.cream} emissive={C.cream} emissiveIntensity={0.35} toneMapped={false} />
        </mesh>
      )}
    </group>
  );
}

/** the reading desk: stand here (or press 1) to open the panel */
function Desk() {
  const lamp = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!lamp.current) return;
    const mat = lamp.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 0.8 + Math.sin(state.clock.elapsedTime * 2.4) * 0.25;
  });

  return (
    <group position={[DESK[0], 0, DESK[1] - 1.4]}>
      <RoundedBox args={[3.2, 0.24, 1.4]} radius={0.07} smoothness={3} position={[0, 1.1, 0]} castShadow>
        <meshStandardMaterial color={C.wood} roughness={0.8} />
      </RoundedBox>
      {[-1.4, 1.4].map((sx) => (
        <mesh key={sx} position={[sx, 0.55, 0]} castShadow>
          <boxGeometry args={[0.22, 1.1, 1.1]} />
          <meshStandardMaterial color={C.woodDark} roughness={0.85} />
        </mesh>
      ))}
      <mesh position={[0, 1.28, 0]} rotation={[-0.9, 0, 0]} castShadow>
        <boxGeometry args={[1.8, 1.2, 0.08]} />
        <meshStandardMaterial color={C.cream} roughness={0.9} />
      </mesh>
      <mesh ref={lamp} position={[1.1, 1.5, 0]}>
        <sphereGeometry args={[0.24, 16, 16]} />
        <meshStandardMaterial color={C.gold} emissive={C.gold} emissiveIntensity={0.9} toneMapped={false} />
      </mesh>
      <pointLight position={[0, 3, 1]} intensity={45} color={C.gold} distance={14} />
    </group>
  );
}
