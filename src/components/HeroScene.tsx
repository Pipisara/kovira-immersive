import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Scroll-driven camera movement
function ScrollCamera() {
  const { camera } = useThree();
  const scrollProgress = useRef(0);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        scrollProgress.current = self.progress;
      },
    });
    return () => trigger.kill();
  }, []);

  useFrame(() => {
    const p = scrollProgress.current;
    // Slowly orbit camera as user scrolls
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, Math.sin(p * Math.PI * 2) * 2, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, Math.cos(p * Math.PI) * 1.5, 0.05);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 6 + p * 2, 0.05);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// Shared mouse tracker
function useMousePosition() {
  const mouse = useRef(new THREE.Vector2(0, 0));
  const { viewport } = useThree();

  useFrame((state) => {
    mouse.current.x = state.pointer.x * viewport.width * 0.5;
    mouse.current.y = state.pointer.y * viewport.height * 0.5;
  });

  return mouse;
}

function FloatingShape({ position, scale, color, speed = 1, distort = 0.3, reactivity = 0.3 }: {
  position: [number, number, number];
  scale: number;
  color: string;
  speed?: number;
  distort?: number;
  reactivity?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouse = useMousePosition();
  const basePos = useMemo(() => new THREE.Vector3(...position), [position]);

  useFrame((state) => {
    if (meshRef.current) {
      // Rotation based on time and mouse position
      const timeRotationX = state.clock.elapsedTime * 0.15 * speed;
      const timeRotationY = state.clock.elapsedTime * 0.2 * speed;

      const mouseRotationX = mouse.current.y * 0.2 * reactivity;
      const mouseRotationY = mouse.current.x * 0.2 * reactivity;

      // Smooth rotation (slower response with 0.05 factor)
      const targetRotX = timeRotationX + mouseRotationX;
      const targetRotY = timeRotationY + mouseRotationY;

      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotX, 0.05);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotY, 0.05);

      // Position based on mouse position
      const targetX = basePos.x + mouse.current.x * reactivity * 1.5;
      const targetY = basePos.y + mouse.current.y * reactivity * 1.5;

      // Smooth position (slower response with 0.04 factor)
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.04);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.04);
    }
  });

  return (
    <Float speed={speed * 1.5} rotationIntensity={0.5} floatIntensity={1.5}>
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
      const targetRotY = state.clock.elapsedTime * 0.02 + state.pointer.x * 0.15;
      const targetRotX = state.clock.elapsedTime * 0.01 + state.pointer.y * 0.1;

      ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, targetRotY, 0.05);
      ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, targetRotX, 0.05);
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
      const targetRotY = state.clock.elapsedTime * 0.05 + state.pointer.x * 0.3;
      const targetRotX = state.pointer.y * 0.2;
      const targetRotZ = state.clock.elapsedTime * 0.03;

      ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, targetRotY, 0.05);
      ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, targetRotX, 0.05);
      ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, targetRotZ, 0.05);
    }
  });

  return (
    <mesh ref={ref} position={[0, 0, -2]} scale={3}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial color="#00d4ff" wireframe transparent opacity={0.08} />
    </mesh>
  );
}

function CursorLight() {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (lightRef.current) {
      const targetX = state.pointer.x * 5;
      const targetY = state.pointer.y * 5;

      lightRef.current.position.x = THREE.MathUtils.lerp(lightRef.current.position.x, targetX, 0.1);
      lightRef.current.position.y = THREE.MathUtils.lerp(lightRef.current.position.y, targetY, 0.1);
      lightRef.current.position.z = 3;
    }
  });

  return <pointLight ref={lightRef} intensity={0.4} color="#00d4ff" distance={12} />;
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 60 }}
      style={{ position: "fixed", inset: 0, zIndex: 0 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      <ScrollCamera />
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} color="#00d4ff" />
      <pointLight position={[-5, -5, -5]} intensity={0.3} color="#26b89f" />
      <CursorLight />

      <WireframeSphere />
      <ParticleField />

      <FloatingShape position={[-3, 1.5, 0]} scale={0.6} color="#00d4ff" speed={0.8} distort={0.4} reactivity={0.4} />
      <FloatingShape position={[3.5, -1, 1]} scale={0.45} color="#26b89f" speed={1.2} distort={0.3} reactivity={0.25} />
      <FloatingShape position={[-1.5, -2, 2]} scale={0.35} color="#00d4ff" speed={0.6} distort={0.5} reactivity={0.35} />
      <FloatingShape position={[2, 2.5, -1]} scale={0.5} color="#26b89f" speed={1} distort={0.2} reactivity={0.3} />
    </Canvas>
  );
}
