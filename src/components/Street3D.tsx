"use client";

import type { MutableRefObject } from "react";
import { useMemo } from "react";
import { Canvas, type ThreeEvent } from "@react-three/fiber";
import { Html, OrthographicCamera, RoundedBox } from "@react-three/drei";
import {
  Beacon,
  C,
  CAM_OFFSET,
  CameraRig,
  DoorSign,
  Pad,
  Penguin,
  useWalker,
  type LobbyApi,
} from "@/components/world";

const START: [number, number, number] = [0, 0, 9];
const BOUNDS = { minX: -11, maxX: 11, minZ: -1.5, maxZ: 11 };
/** the welcome mat in front of the revolving doors */
const DOOR: [number, number] = [0, 0.6];

/** the sidewalk you land on: the hotel front, its sign, and the way in */
export default function Street3D({
  api,
  onEnter,
}: {
  api: MutableRefObject<LobbyApi>;
  onEnter: () => void;
}) {
  const spots = useMemo(() => [{ id: "door", stand: DOOR }], []);
  const { targetRef, playerRef, walkTo, zoom } = useWalker({
    api,
    spots,
    bounds: BOUNDS,
    start: START,
    onMove: () => {},
    fit: 0.74,
  });

  return (
    <Canvas shadows dpr={[1, 1.5]} gl={{ antialias: true }} style={{ touchAction: "none" }}>
      <color attach="background" args={["#8fd0ff"]} />
      <fog attach="fog" args={["#8fd0ff", 46, 90]} />

      <OrthographicCamera makeDefault position={CAM_OFFSET} zoom={zoom} near={-120} far={220} />
      <CameraRig posRef={playerRef} start={START} shift={-3} />

      <hemisphereLight args={["#ffffff", "#ffb3cf", 0.9]} />
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[14, 22, 10]}
        intensity={2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={34}
        shadow-camera-bottom={-34}
      />

      <Block onFloorClick={walkTo} />
      <Beacon x={DOOR[0]} z={DOOR[1]} color={C.gold} />
      <Pad x={DOOR[0]} z={DOOR[1]} onClick={() => api.current.goTo?.("door")} />
      <Html position={[DOOR[0], 2.4, DOOR[1] + 2.6]} center zIndexRange={[10, 0]} className="pointer-events-none">
        <div className="whitespace-nowrap rounded-full border-2 border-white bg-white/90 px-4 py-1.5 text-sm font-bold text-brass shadow-[0_5px_0_rgba(107,91,143,0.14)]">
          Walk in →
        </div>
      </Html>

      <Penguin
        targetRef={targetRef}
        posRef={playerRef}
        spots={spots}
        start={START}
        facing={Math.PI}
        onNear={() => {}}
        onOpen={onEnter}
      />
    </Canvas>
  );
}

function Block({ onFloorClick }: { onFloorClick: (e: ThreeEvent<MouseEvent>) => void }) {
  return (
    <group>
      {/* road and sidewalk */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 6]}
        receiveShadow
        onClick={onFloorClick}
      >
        <planeGeometry args={[60, 20]} />
        <meshStandardMaterial color="#ffd9c0" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 17]} receiveShadow>
        <planeGeometry args={[60, 14]} />
        <meshStandardMaterial color="#6f5f8f" roughness={1} />
      </mesh>
      {[-18, -10, -2, 6, 14, 22].map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, -0.01, 17]}>
          <planeGeometry args={[4, 0.5]} />
          <meshStandardMaterial color={C.cream} roughness={1} />
        </mesh>
      ))}

      <Facade />
      {[-9.5, 9.5].map((x) => (
        <StreetLamp key={x} x={x} />
      ))}
      {[-7.5, 7.5].map((x) => (
        <Tree key={x} x={x} />
      ))}
      <Bench x={6.6} />
      <Taxi />
    </group>
  );
}

function Facade() {
  return (
    <group position={[0, 0, -2.2]}>
      {/* the building */}
      <RoundedBox args={[26, 16, 6]} radius={0.4} smoothness={4} position={[0, 8, -3.6]} castShadow receiveShadow>
        <meshStandardMaterial color={C.wall} roughness={0.92} />
      </RoundedBox>
      {/* windows, three floors */}
      {[11.6, 14.4].map((y) =>
        [-9, -5.4, 5.4, 9].map((x) => (
          <mesh key={`${x}-${y}`} position={[x, y, -0.55]}>
            <planeGeometry args={[2.4, 2.8]} />
            <meshStandardMaterial color={C.sky} emissive={C.sky} emissiveIntensity={0.35} roughness={0.5} />
          </mesh>
        ))
      )}

      {/* the entrance bay */}
      <RoundedBox args={[11, 7.4, 1.2]} radius={0.3} smoothness={4} position={[0, 3.7, -0.3]} castShadow>
        <meshStandardMaterial color={C.plum} roughness={0.85} />
      </RoundedBox>
      {[-1.7, 1.7].map((x) => (
        <group key={x}>
          <mesh position={[x, 3.3, 0.4]}>
            <planeGeometry args={[3.1, 6]} />
            <meshStandardMaterial color="#2b1c3f" roughness={0.6} metalness={0.1} />
          </mesh>
          <mesh position={[x + (x > 0 ? -1.3 : 1.3), 3.1, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 1.6, 10]} />
            <meshStandardMaterial color={C.gold} metalness={0.5} roughness={0.35} />
          </mesh>
        </group>
      ))}
      {/* awning */}
      <mesh position={[0, 7.4, 1.6]} rotation={[-0.42, 0, 0]} castShadow>
        <boxGeometry args={[12, 0.35, 4.2]} />
        <meshStandardMaterial color={C.pink} roughness={0.9} />
      </mesh>
      {[-5, -3, -1, 1, 3, 5].map((x) => (
        <mesh key={x} position={[x, 6.85, 3.35]} rotation={[-0.42, 0, 0]}>
          <planeGeometry args={[1.9, 0.9]} />
          <meshStandardMaterial color={C.cream} roughness={0.95} />
        </mesh>
      ))}

      {/* the marquee */}
      <group position={[0, 11.4, 0.6]}>
        <RoundedBox args={[19, 3.6, 0.5]} radius={0.2} smoothness={4} castShadow>
          <meshStandardMaterial color="#1b1430" roughness={0.7} />
        </RoundedBox>
        <group position={[0, 0, 0.3]}>
          <DoorSign label="JD Portfolio" color={C.gold} width={17.4} />
        </group>
      </group>
      <group position={[0, 8.9, 0.9]}>
        <DoorSign label="Come on in!" color={C.neon} width={10} />
      </group>

      {/* welcome mat */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 3]} receiveShadow>
        <planeGeometry args={[7, 3]} />
        <meshStandardMaterial color={C.rug} roughness={1} />
      </mesh>
    </group>
  );
}

function StreetLamp({ x }: { x: number }) {
  return (
    <group position={[x, 0, 4.4]}>
      <mesh position={[0, 3, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.22, 6, 10]} />
        <meshStandardMaterial color={C.plum} roughness={0.7} />
      </mesh>
      <mesh position={[0, 6.2, 0]} castShadow>
        <sphereGeometry args={[0.7, 18, 18]} />
        <meshStandardMaterial color={C.gold} emissive={C.gold} emissiveIntensity={0.8} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Tree({ x }: { x: number }) {
  return (
    <group position={[x, 0, 7.6]}>
      <mesh position={[0, 1.3, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.42, 2.6, 10]} />
        <meshStandardMaterial color={C.wood} roughness={0.95} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[Math.cos(i * 2.1) * 0.6, 3 + i * 0.8, Math.sin(i * 2.1) * 0.6]} castShadow>
          <sphereGeometry args={[1.35 - i * 0.2, 16, 16]} />
          <meshStandardMaterial color={C.plant} roughness={0.95} />
        </mesh>
      ))}
    </group>
  );
}

function Bench({ x }: { x: number }) {
  return (
    <group position={[x, 0, 8.6]}>
      <RoundedBox args={[3.4, 0.28, 1.1]} radius={0.1} smoothness={3} position={[0, 0.9, 0]} castShadow>
        <meshStandardMaterial color={C.wood} roughness={0.95} />
      </RoundedBox>
      <RoundedBox args={[3.4, 1, 0.24]} radius={0.1} smoothness={3} position={[0, 1.4, -0.45]} castShadow>
        <meshStandardMaterial color={C.wood} roughness={0.95} />
      </RoundedBox>
      {[-1.4, 1.4].map((dx) => (
        <mesh key={dx} position={[dx, 0.45, 0]} castShadow>
          <boxGeometry args={[0.22, 0.9, 1]} />
          <meshStandardMaterial color={C.plum} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function Taxi() {
  return (
    <group position={[-6, 0, 15.5]} rotation={[0, Math.PI / 2, 0]}>
      <RoundedBox args={[6.4, 1.5, 2.6]} radius={0.4} smoothness={4} position={[0, 1.1, 0]} castShadow>
        <meshStandardMaterial color={C.gold} roughness={0.75} />
      </RoundedBox>
      <RoundedBox args={[3.2, 1.3, 2.3]} radius={0.35} smoothness={4} position={[-0.3, 2.2, 0]} castShadow>
        <meshStandardMaterial color="#cfe9ff" roughness={0.4} />
      </RoundedBox>
      {[-2, 2].map((dx) =>
        [-1.2, 1.2].map((dz) => (
          <mesh key={`${dx}${dz}`} position={[dx, 0.6, dz]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.6, 0.6, 0.4, 14]} />
            <meshStandardMaterial color="#2b1c3f" roughness={0.9} />
          </mesh>
        ))
      )}
    </group>
  );
}
