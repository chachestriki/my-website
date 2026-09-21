"use client";

import { Suspense, useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useLoader, type ThreeEvent } from "@react-three/fiber";
import { OrthographicCamera, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { C, CAM_OFFSET, CameraRig, InfoStand, Penguin, useWalker, type LobbyApi } from "@/components/world";
import { hobbies, type Memory } from "@/data/hobbies";

const SCALE = 0.8;
const START: [number, number, number] = [-6 * SCALE, 0, 5 * SCALE];
const BOUNDS = { minX: -13 * SCALE, maxX: 13 * SCALE, minZ: -5 * SCALE, maxZ: 7 * SCALE };
const DESK: [number, number] = [6 * SCALE, 4.6 * SCALE];

const RUG = "#8d3f5c";
const WALL = "#ffe0b8";
const WALL_DARK = "#f0c08f";
const FLOOR = "#b06a3a";
/** one memory frame every 5 units along the back wall */
const SLOT = 4.6;

export default function Hobbies3D({
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
      <color attach="background" args={["#3a2233"]} />
      <fog attach="fog" args={["#3a2233", 48, 92]} />

      <OrthographicCamera makeDefault position={CAM_OFFSET} zoom={zoom * 1.02} near={-140} far={240} />
      <CameraRig posRef={playerRef} start={START} shift={panelOpen ? 8 : 0} />

      <hemisphereLight args={["#fff0d2", "#3a2233", 0.85]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[12, 22, 12]} intensity={1.6} castShadow shadow-mapSize={[2048, 2048]} />

      <group scale={SCALE}>
        <LivingRoom onFloorClick={walkTo} />
        <GuitarCorner />
        <FamilyTree />
        {hobbies.memories.map((memory, i) => (
          <Frame key={memory.id} memory={memory} x={-12 + i * SLOT} index={i} />
        ))}
      </group>
      <InfoStand x={DESK[0]} z={DESK[1]} color={C.pink} onOpen={onDesk} />

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

function LivingRoom({ onFloorClick }: { onFloorClick: (e: ThreeEvent<MouseEvent>) => void }) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow onClick={onFloorClick}>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color={FLOOR} roughness={0.95} />
      </mesh>
      {/* floorboards */}
      {Array.from({ length: 12 }, (_, i) => (
        <mesh key={i} position={[-16.5 + i * 3, 0.01, 2]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.12, 22]} />
          <meshStandardMaterial color="#8c4f28" roughness={1} />
        </mesh>
      ))}
      <mesh position={[0, 0.02, 3.4]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[18, 9]} />
        <meshStandardMaterial color={RUG} roughness={1} />
      </mesh>

      <mesh position={[0, 6, -8]} receiveShadow>
        <boxGeometry args={[34, 12, 0.6]} />
        <meshStandardMaterial color={WALL} roughness={1} />
      </mesh>
      <mesh position={[-17, 6, 0.5]} receiveShadow>
        <boxGeometry args={[0.6, 12, 17]} />
        <meshStandardMaterial color={WALL_DARK} roughness={1} />
      </mesh>
      {/* the camera-side wall is glass so the room stays open */}
      <mesh position={[17, 6, 0.5]}>
        <boxGeometry args={[0.3, 12, 17]} />
        <meshStandardMaterial color="#bfe6ff" transparent opacity={0.16} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0.4, -7.6]}>
        <boxGeometry args={[34, 0.8, 0.3]} />
        <meshStandardMaterial color={C.cream} roughness={1} />
      </mesh>

      {/* couch facing the frames */}
      <group position={[-2, 0, 5.6]}>
        <RoundedBox args={[6, 1.1, 2.4]} radius={0.3} smoothness={4} position={[0, 0.8, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={C.mint} roughness={0.95} />
        </RoundedBox>
        <RoundedBox args={[6, 1.8, 0.7]} radius={0.28} smoothness={4} position={[0, 1.5, 1]} castShadow>
          <meshStandardMaterial color={C.mint} roughness={0.95} />
        </RoundedBox>
        <RoundedBox args={[1, 0.9, 0.9]} radius={0.2} smoothness={3} position={[-1.8, 1.6, 0.4]} castShadow>
          <meshStandardMaterial color={C.pink} roughness={0.95} />
        </RoundedBox>
      </group>
    </group>
  );
}

/** the electric guitar on its stand, with a small amp and a pedal */
function GuitarCorner() {
  const guitar = useRef<THREE.Group>(null);
  const light = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (guitar.current) guitar.current.rotation.z = -0.22 + Math.sin(t * 1.3) * 0.02;
    if (light.current) {
      const mat = light.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.6 + Math.sin(t * 3) * 0.35;
    }
  });

  return (
    <group position={[-11, 0, 0.5]} scale={1.05}>
      {/* stand */}
      <mesh position={[0, 0.08, 0]} castShadow>
        <cylinderGeometry args={[1.1, 1.2, 0.16, 18]} />
        <meshStandardMaterial color={C.steelDark} roughness={0.8} />
      </mesh>

      <group ref={guitar} position={[0, 2.4, 0]} rotation={[0, Math.PI / 4, -0.22]}>
        {/* body */}
        <mesh position={[0, -0.6, 0]} scale={[1.15, 1, 0.32]} castShadow>
          <capsuleGeometry args={[0.95, 0.8, 8, 22]} />
          <meshStandardMaterial color={C.pink} roughness={0.35} metalness={0.25} />
        </mesh>
        <mesh position={[-0.1, -0.8, 0.22]} scale={[0.85, 0.8, 0.1]} castShadow>
          <capsuleGeometry args={[0.8, 0.6, 6, 18]} />
          <meshStandardMaterial color="#ffe7bd" roughness={0.5} />
        </mesh>
        {/* pickups and bridge */}
        {[-0.45, 0, 0.42].map((y) => (
          <mesh key={y} position={[0, y - 0.7, 0.42]} castShadow>
            <boxGeometry args={[0.9, 0.16, 0.12]} />
            <meshStandardMaterial color={C.steelDark} roughness={0.5} metalness={0.5} />
          </mesh>
        ))}
        {/* neck */}
        <mesh position={[0, 1.5, 0.1]} castShadow>
          <boxGeometry args={[0.34, 3.6, 0.18]} />
          <meshStandardMaterial color={C.wood} roughness={0.7} />
        </mesh>
        {/* frets */}
        {Array.from({ length: 10 }, (_, i) => (
          <mesh key={i} position={[0, 0.2 + i * 0.32, 0.2]}>
            <boxGeometry args={[0.34, 0.03, 0.02]} />
            <meshStandardMaterial color={C.gold} roughness={0.4} metalness={0.6} />
          </mesh>
        ))}
        {/* headstock and tuners */}
        <mesh position={[0.06, 3.55, 0.1]} rotation={[0, 0, 0.1]} castShadow>
          <boxGeometry args={[0.5, 0.8, 0.16]} />
          <meshStandardMaterial color={C.woodDark} roughness={0.7} />
        </mesh>
        {[-0.2, 0, 0.2].map((y) => (
          <mesh key={y} position={[0.3, 3.55 + y, 0.1]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
            <meshStandardMaterial color={C.steel} roughness={0.4} metalness={0.6} />
          </mesh>
        ))}
        {/* strings */}
        {[-0.1, -0.04, 0.02, 0.08].map((x) => (
          <mesh key={x} position={[x, 1.2, 0.22]}>
            <boxGeometry args={[0.015, 4.2, 0.015]} />
            <meshStandardMaterial color="#f4f4f4" roughness={0.3} metalness={0.7} />
          </mesh>
        ))}
      </group>

      {/* amp */}
      <group position={[3, 0, 1.4]} rotation={[0, -0.4, 0]}>
        <RoundedBox args={[2.6, 2.2, 1.4]} radius={0.12} smoothness={3} position={[0, 1.1, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={C.steelDark} roughness={0.9} />
        </RoundedBox>
        <mesh position={[0, 0.9, 0.72]}>
          <circleGeometry args={[0.7, 24]} />
          <meshStandardMaterial color="#1a1626" roughness={1} />
        </mesh>
        <mesh ref={light} position={[0.9, 1.95, 0.72]}>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshStandardMaterial color={C.magenta} emissive={C.magenta} emissiveIntensity={0.8} toneMapped={false} />
        </mesh>
        <pointLight position={[0, 2.4, 1.6]} intensity={22} color={C.magenta} distance={12} />
      </group>
    </group>
  );
}

/** the family tree painted on the back wall */
function useTreeTexture() {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 720;
    canvas.height = 520;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#fdf3e2";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#7a4a22";
    ctx.lineCap = "round";
    ctx.lineWidth = 26;
    ctx.beginPath();
    ctx.moveTo(360, 500);
    ctx.lineTo(360, 330);
    ctx.stroke();

    const rows: Array<[number, number[]]> = [
      [250, [180, 540]],
      [150, [110, 300, 430, 620]],
    ];
    ctx.lineWidth = 14;
    let from = [360];
    for (const [y, xs] of rows) {
      const prevY = y === 250 ? 330 : 250;
      xs.forEach((x, i) => {
        const parent = from[Math.floor((i / xs.length) * from.length)];
        ctx.beginPath();
        ctx.moveTo(parent, prevY);
        ctx.quadraticCurveTo(parent, y + 40, x, y);
        ctx.stroke();
      });
      from = xs;
    }

    const leaves: Array<[number, number, string]> = [
      [360, 330, "#2ecf9f"],
      [180, 250, "#3fbf62"],
      [540, 250, "#3fbf62"],
      [110, 150, "#7fd06a"],
      [300, 150, "#7fd06a"],
      [430, 150, "#7fd06a"],
      [620, 150, "#7fd06a"],
    ];
    for (const [x, y, color] of leaves) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 52, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fdf3e2";
      ctx.beginPath();
      ctx.arc(x, y, 34, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = "#3a2233";
    ctx.font = "bold 40px ui-sans-serif, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Family tree", 360, 70);
    ctx.fillStyle = "#a0522d";
    ctx.font = "500 26px ui-monospace, monospace";
    ctx.fillText("Madrid  ·  Texas", 360, 108);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  }, []);
}

function FamilyTree() {
  const texture = useTreeTexture();
  return (
    <group position={[9.6, 6.6, -7.6]}>
      <RoundedBox args={[8.4, 6.4, 0.36]} radius={0.08} smoothness={3} castShadow>
        <meshStandardMaterial color={C.gold} roughness={0.45} metalness={0.35} />
      </RoundedBox>
      <mesh position={[0, 0, 0.22]}>
        <planeGeometry args={[7.6, 5.6]} />
        {texture ? (
          <meshStandardMaterial map={texture} roughness={0.9} />
        ) : (
          <meshStandardMaterial color="#fdf3e2" roughness={0.9} />
        )}
      </mesh>
    </group>
  );
}

/** a memory frame: the photo when there is one, a painted placeholder while there isn't */
function MemoryPhoto({ src }: { src: string }) {
  const texture = useLoader(THREE.TextureLoader, src);
  return (
    <mesh position={[0, 0, 0.2]}>
      <planeGeometry args={[3.5, 2.5]} />
      <meshStandardMaterial map={texture} map-colorSpace={THREE.SRGBColorSpace} roughness={0.85} />
    </mesh>
  );
}

function usePlaceholder(memory: Memory) {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 560;
    canvas.height = 400;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#fdf3e2";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = memory.color;
    ctx.globalAlpha = 0.16;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;

    ctx.strokeStyle = memory.color;
    ctx.lineWidth = 8;
    ctx.setLineDash([18, 14]);
    ctx.strokeRect(26, 26, canvas.width - 52, canvas.height - 52);
    ctx.setLineDash([]);

    ctx.fillStyle = "#3a2233";
    ctx.textAlign = "center";
    ctx.font = "bold 40px ui-sans-serif, system-ui, sans-serif";
    ctx.fillText(memory.title, canvas.width / 2, 190);
    ctx.fillStyle = memory.color;
    ctx.font = "500 26px ui-monospace, monospace";
    ctx.fillText(memory.when, canvas.width / 2, 240);
    ctx.fillStyle = "#3a2233";
    ctx.globalAlpha = 0.4;
    ctx.font = "500 22px ui-monospace, monospace";
    ctx.fillText("photo coming", canvas.width / 2, 300);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  }, [memory]);
}

function Frame({ memory, x, index }: { memory: Memory; x: number; index: number }) {
  const placeholder = usePlaceholder(memory);
  const dot = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (dot.current) dot.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2 + index) * 0.1);
  });

  return (
    <group position={[x, 0, -7.6]}>
      <RoundedBox args={[4, 3, 0.3]} radius={0.06} smoothness={3} position={[0, 4.6, 0]} castShadow>
        <meshStandardMaterial color={C.gold} roughness={0.45} metalness={0.35} />
      </RoundedBox>
      <group position={[0, 4.6, 0]}>
        {memory.src ? (
          <Suspense
            fallback={
              <mesh position={[0, 0, 0.2]}>
                <planeGeometry args={[3.5, 2.5]} />
                <meshStandardMaterial color="#fdf3e2" roughness={0.9} />
              </mesh>
            }
          >
            <MemoryPhoto src={memory.src} />
          </Suspense>
        ) : (
          <mesh position={[0, 0, 0.2]}>
            <planeGeometry args={[3.5, 2.5]} />
            {placeholder ? (
              <meshStandardMaterial map={placeholder} roughness={0.9} />
            ) : (
              <meshStandardMaterial color={memory.color} roughness={0.9} />
            )}
          </mesh>
        )}
      </group>

      {/* plaque with the colour of the story */}
      <mesh position={[0, 2.85, 0.14]} castShadow>
        <boxGeometry args={[2.4, 0.45, 0.1]} />
        <meshStandardMaterial color={C.woodDark} roughness={0.8} />
      </mesh>
      <mesh ref={dot} position={[0, 2.85, 0.22]}>
        <sphereGeometry args={[0.16, 14, 14]} />
        <meshStandardMaterial
          color={memory.color}
          emissive={memory.color}
          emissiveIntensity={0.9}
          toneMapped={false}
        />
      </mesh>

      {/* picture light */}
      <mesh position={[0, 6.8, -0.4]} rotation={[0.9, 0, 0]}>
        <coneGeometry args={[0.38, 0.7, 14]} />
        <meshStandardMaterial color={C.gold} emissive={C.gold} emissiveIntensity={0.7} toneMapped={false} />
      </mesh>
    </group>
  );
}
