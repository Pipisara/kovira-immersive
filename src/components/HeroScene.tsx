import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function FloatingShape({ position, scale, color, speed = 1, distort = 0.3 }: {
  position: [number, number, number];
  scale: number;
  color: string;
  speed?: number;
  distort?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.15 * speed;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2 * speed;
    }
  });

  return (
    <Float speed={speed * 1.5} rotationIntensity={0.4} floatIntensity={1.5}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial
          color={color}
          transparent
          opacity={0.6}
          distort={distort}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
}

function ParticleField() {
  const count = 200;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  const ref = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
      ref.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#00d4ff" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

function WireframeSphere() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.05;
      ref.current.rotation.z = state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <mesh ref={ref} position={[0, 0, -2]} scale={3}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial color="#00d4ff" wireframe transparent opacity={0.08} />
    </mesh>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 60 }}
      style={{ position: "absolute", inset: 0 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} color="#00d4ff" />
      <pointLight position={[-5, -5, -5]} intensity={0.3} color="#26b89f" />

      <WireframeSphere />
      <ParticleField />

      <FloatingShape position={[-3, 1.5, 0]} scale={0.6} color="#00d4ff" speed={0.8} distort={0.4} />
      <FloatingShape position={[3.5, -1, 1]} scale={0.45} color="#26b89f" speed={1.2} distort={0.3} />
      <FloatingShape position={[-1.5, -2, 2]} scale={0.35} color="#00d4ff" speed={0.6} distort={0.5} />
      <FloatingShape position={[2, 2.5, -1]} scale={0.5} color="#26b89f" speed={1} distort={0.2} />
    </Canvas>
  );
}
