"use client";

import { useCallback, useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { OrthographicCamera, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { C, CAM_OFFSET, CameraRig, InfoStand, Pad, Penguin, useWalker, type LobbyApi } from "@/components/world";
import { projects, type Project } from "@/data/projects";

const START: [number, number, number] = [0, 0, 6.5];
const BOUNDS = { minX: -15, maxX: 15, minZ: -3.6, maxZ: 8 };
const DESK: [number, number] = [11, 6.4];
/** one board every 10 units along the wall, with its doorway pad in front */
const SLOT = 10;
const x0 = -((projects.length - 1) * SLOT) / 2;

const WALL = "#241a3a";
const FLOOR = "#33264f";

export default function Projects3D({
  api,
  onMove,
  onDesk,
  onEnter,
  panelOpen,
}: {
  api: MutableRefObject<LobbyApi>;
  onMove: () => void;
  onDesk: () => void;
  onEnter: (scene: Project["scene"]) => void;
  panelOpen: boolean;
}) {
  const spots = useMemo(
    () => [
      { id: "desk", stand: DESK },
      ...projects.map((p, i) => ({ id: p.id, stand: [x0 + i * SLOT, -1.4] as [number, number] })),
    ],
    [],
  );
  const { targetRef, playerRef, walkTo, zoom } = useWalker({ api, spots, bounds: BOUNDS, start: START, onMove });

  const onSpot = useCallback(
    (id: string) => {
      if (id === "desk") return onDesk();
      const project = projects.find((p) => p.id === id);
      if (project) onEnter(project.scene);
    },
    [onDesk, onEnter],
  );

  return (
    <Canvas shadows dpr={[1, 1.5]} gl={{ antialias: true }} style={{ touchAction: "none" }}>
      <color attach="background" args={["#181229"]} />
      <fog attach="fog" args={["#181229", 54, 100]} />

      <OrthographicCamera makeDefault position={CAM_OFFSET} zoom={zoom * 0.62} near={-140} far={240} />
      <CameraRig posRef={playerRef} start={START} shift={panelOpen ? 8 : 0} />

      <hemisphereLight args={["#cfe4ff", "#181229", 0.7]} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[14, 26, 14]} intensity={1.4} castShadow shadow-mapSize={[2048, 2048]} />

      <Showroom onFloorClick={walkTo} />
      {projects.map((project, i) => (
        <Board key={project.id} project={project} x={x0 + i * SLOT} index={i} onEnter={() => onEnter(project.scene)} />
      ))}
      <InfoStand x={DESK[0]} z={DESK[1]} color={C.neon} onOpen={onDesk} />

      <Penguin targetRef={targetRef} posRef={playerRef} spots={spots} start={START} onNear={() => {}} onOpen={onSpot} />
    </Canvas>
  );
}

/** the wall wordmark, painted once onto a canvas */
function useTitleTexture() {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1600;
    canvas.height = 300;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 210px ui-sans-serif, system-ui, sans-serif";
    ctx.lineWidth = 14;
    ctx.strokeStyle = "#00e5ff";
    ctx.strokeText("PROJECTS", canvas.width / 2, 150);
    ctx.fillStyle = "#fff6ea";
    ctx.fillText("PROJECTS", canvas.width / 2, 150);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  }, []);
}

function Showroom({ onFloorClick }: { onFloorClick: (e: ThreeEvent<MouseEvent>) => void }) {
  const title = useTitleTexture();
  const width = projects.length * SLOT + 10;

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow onClick={onFloorClick}>
        <planeGeometry args={[90, 90]} />
        <meshStandardMaterial color={FLOOR} roughness={0.9} metalness={0.1} />
      </mesh>
      {/* the walkway in front of the wall */}
      <mesh position={[0, 0.01, 1.6]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[width, 7]} />
        <meshStandardMaterial color="#3d2d5e" roughness={1} />
      </mesh>

      {/* the projects wall */}
      <mesh position={[0, 8, -6]} receiveShadow>
        <boxGeometry args={[width, 16, 0.8]} />
        <meshStandardMaterial color={WALL} roughness={1} />
      </mesh>
      <mesh position={[0, 11.2, -5.55]}>
        <planeGeometry args={[26, 4.9]} />
        {title ? (
          <meshStandardMaterial map={title} transparent emissive={C.neon} emissiveIntensity={0.25} toneMapped={false} />
        ) : (
          <meshStandardMaterial color="#fff6ea" />
        )}
      </mesh>
      <mesh position={[0, 9.4, -5.55]}>
        <planeGeometry args={[width - 4, 0.12]} />
        <meshStandardMaterial color={C.neon} emissive={C.neon} emissiveIntensity={1.2} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.6, -5.5]}>
        <boxGeometry args={[width, 1.2, 0.3]} />
        <meshStandardMaterial color="#3d2d5e" roughness={1} />
      </mesh>
    </group>
  );
}

function useBoardTexture(project: Project) {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 900;
    canvas.height = 560;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#120f1f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = project.color;
    ctx.lineWidth = 10;
    ctx.strokeRect(18, 18, canvas.width - 36, canvas.height - 36);

    ctx.fillStyle = project.color;
    ctx.font = "600 30px ui-monospace, monospace";
    ctx.fillText(project.role.toUpperCase(), 54, 92);
    ctx.fillStyle = "#6f6a86";
    ctx.fillText(project.period, 54, 136);

    ctx.fillStyle = "#fff6ea";
    ctx.font = "bold 74px ui-sans-serif, system-ui, sans-serif";
    ctx.fillText(project.name, 54, 232);

    ctx.fillStyle = "#c9c2dd";
    ctx.font = "400 30px ui-sans-serif, system-ui, sans-serif";
    const words = project.tag.split(" ");
    let line = "";
    let y = 300;
    for (const word of words) {
      const next = line ? `${line} ${word}` : word;
      if (ctx.measureText(next).width > canvas.width - 110) {
        ctx.fillText(line, 54, y);
        line = word;
        y += 40;
      } else {
        line = next;
      }
    }
    ctx.fillText(line, 54, y);

    ctx.fillStyle = project.color;
    ctx.font = "bold 62px ui-sans-serif, system-ui, sans-serif";
    ctx.fillText(project.stat.value, 54, 452);
    ctx.fillStyle = "#8f88a6";
    ctx.font = "400 26px ui-monospace, monospace";
    ctx.fillText(project.stat.label, 54, 496);

    ctx.fillStyle = "#fff6ea";
    ctx.font = "600 30px ui-monospace, monospace";
    ctx.textAlign = "right";
    ctx.fillText("walk in ↓", canvas.width - 54, 496);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  }, [project]);
}

function Board({
  project,
  x,
  index,
  onEnter,
}: {
  project: Project;
  x: number;
  index: number;
  onEnter: () => void;
}) {
  const texture = useBoardTexture(project);
  const arch = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!arch.current) return;
    const mat = arch.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 0.8 + Math.sin(state.clock.elapsedTime * 2 + index) * 0.3;
  });

  return (
    <group position={[x, 0, -5.4]}>
      <RoundedBox args={[8, 5, 0.4]} radius={0.1} smoothness={3} position={[0, 5.6, 0]} castShadow>
        <meshStandardMaterial color="#0f0c1a" roughness={0.8} />
      </RoundedBox>
      <mesh position={[0, 5.6, 0.22]}>
        <planeGeometry args={[7.6, 4.7]} />
        {texture ? (
          <meshStandardMaterial map={texture} roughness={0.85} />
        ) : (
          <meshStandardMaterial color={project.color} roughness={0.85} />
        )}
      </mesh>

      {/* the doorway you walk through to enter the project's room */}
      <mesh position={[0, 1.5, 0.1]}>
        <planeGeometry args={[4.4, 3]} />
        <meshStandardMaterial color="#080610" roughness={1} />
      </mesh>
      <mesh ref={arch} position={[0, 3.06, 0.14]}>
        <boxGeometry args={[4.8, 0.22, 0.14]} />
        <meshStandardMaterial
          color={project.color}
          emissive={project.color}
          emissiveIntensity={0.9}
          toneMapped={false}
        />
      </mesh>
      {[-2.4, 2.4].map((sx) => (
        <mesh key={sx} position={[sx, 1.5, 0.14]}>
          <boxGeometry args={[0.22, 3.2, 0.14]} />
          <meshStandardMaterial
            color={project.color}
            emissive={project.color}
            emissiveIntensity={0.7}
            toneMapped={false}
          />
        </mesh>
      ))}
      <pointLight position={[0, 3.4, 2.4]} intensity={30} color={project.color} distance={16} />
      <Pad x={0} z={4} onClick={onEnter} />
    </group>
  );
}
