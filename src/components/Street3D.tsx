"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrthographicCamera, RoundedBox } from "@react-three/drei";
import { Group, Vector3 } from "three";
import { C, CAM_OFFSET, CameraRig, DoorSign, Penguin } from "@/components/world";

/** the range, laid out along z so the arrow crosses the screen towards the doors */
const TARGET_Z = 1.6;
const BOW_Z = 7.8;
const START: [number, number, number] = [0, 0, BOW_Z];
/** the arrow leaves flat at this height: you time the bobbing target onto the line */
const AIM_Y = 3.2;
const BOB_LOW = 1.9;
const BOB_HIGH = 5;
const FLIGHT = 0.42;
const BULLSEYE = 0.45;
const RING = 1.25;
const RINGS: [number, string][] = [
  [1.5, C.cream],
  [1.1, C.sky],
  [0.7, C.cream],
  [0.34, C.pink],
];

/** the sidewalk you land on: the hotel front, its sign, and the way in */
export default function Street3D({ onEnter }: { onEnter: () => void }) {
  /* the penguin stands still on the range: the only way in is the bullseye or the CV card */
  const targetRef = useRef<Vector3 | null>(null);
  const playerRef = useRef(new Vector3(...START));
  const [zoom, setZoom] = useState(30);

  useEffect(() => {
    const measure = () => setZoom(Math.min(window.innerWidth / 36, window.innerHeight / 23) * 0.74);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <Canvas shadows dpr={[1, 1.5]} gl={{ antialias: true }} style={{ touchAction: "none" }}>
      <color attach="background" args={["#d0d3d7"]} />
      <fog attach="fog" args={["#d0d3d7", 46, 90]} />

      <OrthographicCamera makeDefault position={CAM_OFFSET} zoom={zoom} near={-120} far={220} />
      <CameraRig posRef={playerRef} start={START} shift={-3} />

      <hemisphereLight args={["#ffffff", "#ebe9e7", 0.9]} />
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

      <Block />
      <Range onBullseye={onEnter} />

      <Penguin
        targetRef={targetRef}
        posRef={playerRef}
        spots={[]}
        start={START}
        facing={Math.PI}
        onNear={() => {}}
        onOpen={() => {}}
      />
    </Canvas>
  );
}

/** the bullseye that bobs in front of the doors, the bow, and the arrow you loose at it */
function Range({ onBullseye }: { onBullseye: () => void }) {
  const target = useRef<Group>(null);
  const arrow = useRef<Group>(null);
  const flight = useRef<number | null>(null);
  const wonRef = useRef(false);
  const [won, setWon] = useState(false);
  const [shots, setShots] = useState(0);
  const [note, setNote] = useState<string | null>(null);

  const shoot = useCallback(() => {
    if (wonRef.current || flight.current !== null) return;
    flight.current = 0;
    setNote(null);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      e.preventDefault();
      shoot();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shoot]);

  useFrame((state, dt) => {
    const mid = (BOB_LOW + BOB_HIGH) / 2;
    if (target.current && !wonRef.current) {
      target.current.position.y = mid + Math.sin(state.clock.elapsedTime * 1.5) * ((BOB_HIGH - BOB_LOW) / 2);
    }
    if (flight.current === null || !arrow.current) return;
    flight.current = Math.min(1, flight.current + dt / FLIGHT);
    arrow.current.visible = true;
    arrow.current.position.set(0, AIM_Y, BOW_Z + (TARGET_Z - BOW_Z) * flight.current);
    if (flight.current < 1) return;
    flight.current = null;
    arrow.current.visible = false;
    const miss = Math.abs((target.current?.position.y ?? 0) - AIM_Y);
    setShots((n) => n + 1);
    if (miss < BULLSEYE) {
      wonRef.current = true;
      setWon(true);
      setNote("Bullseye — the doors are opening");
      window.setTimeout(onBullseye, 900);
      return;
    }
    setNote(miss < RING ? "Outer ring — shoot again" : "Wide — shoot again");
  });

  return (
    <group>
      <group ref={target} position={[0, 3.2, TARGET_Z]} rotation={[-0.45, Math.PI / 4, 0]} onClick={shoot}>
        {RINGS.map(([r, color], i) => (
          <mesh key={r} position={[0, 0, 0.03 * i]}>
            <circleGeometry args={[r, 40]} />
            <meshStandardMaterial color={color} roughness={0.85} />
          </mesh>
        ))}
      </group>
      <mesh position={[0, 0.9, TARGET_Z]} castShadow>
        <cylinderGeometry args={[0.12, 0.16, 1.8, 10]} />
        <meshStandardMaterial color={C.wood} roughness={0.9} />
      </mesh>

      {/* the bow the penguin holds, and the arrow in flight */}
      <mesh position={[0.95, 2.2, BOW_Z]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <torusGeometry args={[0.9, 0.09, 8, 24, Math.PI * 1.2]} />
        <meshStandardMaterial color={C.wood} roughness={0.8} />
      </mesh>
      <group ref={arrow} position={[0, AIM_Y, BOW_Z]} visible={false}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 1.5, 8]} />
          <meshStandardMaterial color={C.woodDark} roughness={0.8} />
        </mesh>
        <mesh position={[0, 0, -0.9]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.16, 0.5, 10]} />
          <meshStandardMaterial color={C.gold} metalness={0.4} roughness={0.4} />
        </mesh>
      </group>

      <Html position={[0, 7.4, TARGET_Z]} center zIndexRange={[10, 0]} className="pointer-events-none">
        <div className="w-72 space-y-1 text-center">
          <div className="rounded-full border-2 border-white bg-white/90 px-4 py-1.5 text-sm font-bold text-brass shadow-[0_5px_0_rgba(20,23,26,0.14)]">
            Hit the bullseye to come in
          </div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-ink/70">
            {note ?? `space or click the target · ${shots} shot${shots === 1 ? "" : "s"}`}
          </div>
          {shots >= 5 && !won && (
            <button
              onClick={onBullseye}
              className="pointer-events-auto rounded-full border-2 border-ink/25 bg-white/80 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-ink/70 transition hover:bg-ink hover:text-white"
            >
              or just walk in →
            </button>
          )}
        </div>
      </Html>
    </group>
  );
}

function Block() {
  return (
    <group>
      {/* road and sidewalk */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 6]} receiveShadow>
        <planeGeometry args={[60, 20]} />
        <meshStandardMaterial color="#f2f1f0" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 17]} receiveShadow>
        <planeGeometry args={[60, 14]} />
        <meshStandardMaterial color="#5a6069" roughness={1} />
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
            <meshStandardMaterial color="#282622" roughness={0.6} metalness={0.1} />
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
          <meshStandardMaterial color="#1a1c1e" roughness={0.7} />
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
        <meshStandardMaterial color="#f9fafa" roughness={0.4} />
      </RoundedBox>
      {[-2, 2].map((dx) =>
        [-1.2, 1.2].map((dz) => (
          <mesh key={`${dx}${dz}`} position={[dx, 0.6, dz]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.6, 0.6, 0.4, 14]} />
            <meshStandardMaterial color="#282622" roughness={0.9} />
          </mesh>
        ))
      )}
    </group>
  );
}
