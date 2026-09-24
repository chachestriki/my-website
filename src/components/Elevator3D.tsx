"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import { Group, MathUtils, Mesh, MeshStandardMaterial, Vector3 } from "three";
import { C, DoorSign, Penguin } from "@/components/world";

const CABIN_W = 6.2;
const CABIN_H = 5.6;
const DOOR_W = CABIN_W / 2 - 0.1;
const START: [number, number, number] = [0, 0, -0.6];

/** the mobile hotel: one fixed cabin, the floor changes as you scroll */
export default function Elevator3D({ floor, label }: { floor: number; label: string }) {
  const targetRef = useRef<Vector3 | null>(null);
  const playerRef = useRef(new Vector3(...START));
  const [zoom, setZoom] = useState(60);

  useEffect(() => {
    const measure = () => setZoom(Math.min(window.innerWidth / 7.4, window.innerHeight / 7.2));
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <Canvas shadows dpr={[1, 1.5]} gl={{ antialias: true }} style={{ touchAction: "pan-y" }}>
      <color attach="background" args={["#14171a"]} />
      <OrthographicCamera makeDefault position={[0, 3.4, 12]} zoom={zoom} near={-60} far={120} />

      <hemisphereLight args={["#ffffff", "#3a3733", 0.7]} />
      <ambientLight intensity={0.35} />
      <spotLight position={[0, 7.5, 1.5]} angle={0.9} penumbra={0.8} intensity={60} castShadow />

      <Cabin floor={floor} label={label} />

      <Penguin
        targetRef={targetRef}
        posRef={playerRef}
        spots={[]}
        start={START}
        onNear={() => {}}
        onOpen={() => {}}
      />
    </Canvas>
  );
}

/** the cabin itself: doors that close while it travels and open on arrival */
function Cabin({ floor, label }: { floor: number; label: string }) {
  const left = useRef<Group>(null);
  const right = useRef<Group>(null);
  const strip = useRef<Mesh>(null);
  const previous = useRef(floor);
  /** 1 right after a floor change, decaying to 0 once the cabin has arrived */
  const travel = useRef(0);

  useFrame((state, delta) => {
    if (previous.current !== floor) {
      previous.current = floor;
      travel.current = 1;
    }
    travel.current = Math.max(0, travel.current - Math.min(delta, 0.05) * 1.7);
    const shut = Math.min(1, travel.current * 1.8);
    const slide = DOOR_W * 0.94 * (1 - shut);
    if (left.current) left.current.position.x = MathUtils.damp(left.current.position.x, -DOOR_W / 2 - slide, 9, delta);
    if (right.current) right.current.position.x = MathUtils.damp(right.current.position.x, DOOR_W / 2 + slide, 9, delta);
    if (strip.current) {
      const mat = strip.current.material as MeshStandardMaterial;
      mat.emissiveIntensity = 0.55 + Math.sin(state.clock.elapsedTime * 1.8) * 0.15;
    }
  });

  return (
    <group>
      {/* floor, ceiling and the three walls of the cabin */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <boxGeometry args={[CABIN_W, 0.2, 5.4]} />
        <meshStandardMaterial color={C.rug} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[1.5, 1.9, 44]} />
        <meshStandardMaterial color={C.rugEdge} roughness={0.7} metalness={0.3} />
      </mesh>
      <mesh position={[0, CABIN_H / 2, -2.6]} receiveShadow>
        <boxGeometry args={[CABIN_W, CABIN_H, 0.2]} />
        <meshStandardMaterial color={C.wall} roughness={0.85} />
      </mesh>
      <mesh position={[-CABIN_W / 2, CABIN_H / 2, 0.4]} receiveShadow>
        <boxGeometry args={[0.2, CABIN_H, 5.4]} />
        <meshStandardMaterial color={C.cream} roughness={0.85} />
      </mesh>
      <mesh position={[CABIN_W / 2, CABIN_H / 2, 0.4]} receiveShadow>
        <boxGeometry args={[0.2, CABIN_H, 5.4]} />
        <meshStandardMaterial color={C.cream} roughness={0.85} />
      </mesh>
      <mesh position={[0, CABIN_H, 0.4]}>
        <boxGeometry args={[CABIN_W, 0.2, 5.4]} />
        <meshStandardMaterial color={C.wall} roughness={0.9} />
      </mesh>
      <mesh position={[0, CABIN_H - 0.16, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.4, 2.4]} />
        <meshStandardMaterial color="#fffaf0" emissive="#fffaf0" emissiveIntensity={0.8} toneMapped={false} />
      </mesh>

      {/* the brass strip that breathes on the back wall */}
      <mesh ref={strip} position={[0, 3.4, -2.48]}>
        <planeGeometry args={[CABIN_W - 1.2, 0.18]} />
        <meshStandardMaterial color={C.gold} emissive={C.gold} emissiveIntensity={0.55} toneMapped={false} />
      </mesh>

      {/* brass handrail along the back wall */}
      <mesh position={[0, 1.7, -2.4]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.09, 0.09, CABIN_W - 0.8, 14]} />
        <meshStandardMaterial color={C.gold} roughness={0.35} metalness={0.7} />
      </mesh>

      {/* the floor plate above the doors */}
      <group position={[0, CABIN_H - 0.6, 2.6]}>
        <mesh position={[0, 0, -0.06]}>
          <boxGeometry args={[CABIN_W - 0.6, 1.5, 0.12]} />
          <meshStandardMaterial color={C.steelDark} roughness={0.7} />
        </mesh>
        <DoorSign label={label} color={C.gold} width={CABIN_W - 1} />
      </group>

      {/* the doors */}
      <group ref={left} position={[-DOOR_W / 2, CABIN_H / 2, 2.7]}>
        <Door />
      </group>
      <group ref={right} position={[DOOR_W / 2, CABIN_H / 2, 2.7]}>
        <Door />
      </group>
    </group>
  );
}

function Door() {
  return (
    <group>
      <mesh castShadow>
        <boxGeometry args={[DOOR_W, CABIN_H - 1.4, 0.16]} />
        <meshStandardMaterial color={C.wood} roughness={0.45} metalness={0.55} />
      </mesh>
      <mesh position={[0, 0, 0.1]}>
        <planeGeometry args={[DOOR_W - 0.5, CABIN_H - 2]} />
        <meshStandardMaterial color={C.cream} roughness={0.6} />
      </mesh>
    </group>
  );
}
