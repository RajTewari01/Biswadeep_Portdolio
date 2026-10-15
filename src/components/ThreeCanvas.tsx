"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

// Luxury Celestial Shader for the Torus Knot
const SculptureMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uColorBase: { value: new THREE.Color("#18040C") },    // Obsidian Wine Base
    uColorMagenta: { value: new THREE.Color("#8B1538") }, // Velvet Deep Magenta
    uColorRose: { value: new THREE.Color("#C2185B") },    // Radiant Rose Magenta
    uColorGold: { value: new THREE.Color("#C9A96E") },    // Champagne Gold Accent
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColorBase;
    uniform vec3 uColorMagenta;
    uniform vec3 uColorRose;
    uniform vec3 uColorGold;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);

      // Elegant Fresnel rim effect for high-end refraction
      float fresnel = clamp(1.0 - max(dot(viewDir, normal), 0.0), 0.0, 1.0);
      float rim = pow(fresnel, 2.6);

      // Dynamic iridescent wave flow across UV coordinates
      float flow = sin(vUv.x * 8.0 + uTime * 0.7) * 0.5 + 0.5;
      float twist = cos(vUv.y * 6.0 - uTime * 0.5) * 0.5 + 0.5;

      // Base transition: Obsidian wine into velvet magenta
      vec3 color = mix(uColorBase, uColorMagenta, flow * 0.7 + 0.2);

      // Add rose magenta luminescence to the rim
      color = mix(color, uColorRose, rim * 0.85);

      // Add champagne gold refraction across surface twists
      color = mix(color, uColorGold, twist * rim * 0.7);

      // Specular diamond reflection
      vec3 lightDir = normalize(vec3(1.5, 2.5, 3.5));
      vec3 halfVec = normalize(lightDir + viewDir);
      float spec = pow(max(dot(normal, halfVec), 0.0), 60.0);
      color += vec3(1.0, 0.95, 0.9) * spec * 0.75;

      gl_FragColor = vec4(color, 0.95);
    }
  `,
  transparent: true,
  side: THREE.DoubleSide,
});

// Kinetic Prismatic Torus Knot Sculpture
function KineticSculpture() {
  const meshRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const mouseData = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const scrollData = useRef({ y: 0, targetY: 0 });

  useFrame((state, delta) => {
    if (!meshRef.current || !materialRef.current) return;
    materialRef.current.uniforms.uTime.value += delta;

    const { pointer } = state;
    mouseData.current.targetX = pointer.x;
    mouseData.current.targetY = pointer.y;
    mouseData.current.x += (mouseData.current.targetX - mouseData.current.x) * 0.04;
    mouseData.current.y += (mouseData.current.targetY - mouseData.current.y) * 0.04;

    const scrollPercent = typeof window !== "undefined"
      ? window.scrollY / (document.body.scrollHeight - window.innerHeight || 1)
      : 0;
    scrollData.current.targetY = scrollPercent;
    scrollData.current.y += (scrollData.current.targetY - scrollData.current.y) * 0.04;

    const t = state.clock.elapsedTime;

    // Fluid continuous rotation with mouse and scroll response
    meshRef.current.rotation.y = t * 0.12 + mouseData.current.x * 0.4 + scrollData.current.y * Math.PI;
    meshRef.current.rotation.x = t * 0.08 - mouseData.current.y * 0.3 + scrollData.current.y * Math.PI * 0.4;
    meshRef.current.rotation.z = Math.sin(t * 0.05) * 0.2;

    // Subtle natural breathing scale
    const breath = 1.0 + Math.sin(t * 0.6) * 0.04;
    meshRef.current.scale.set(breath, breath, breath);

    // Orbiting concentric rings with delicate motion
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.15 + mouseData.current.y * 0.2;
      ring1Ref.current.rotation.y = t * 0.2 + mouseData.current.x * 0.2;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -t * 0.12 - mouseData.current.x * 0.15;
      ring2Ref.current.rotation.z = t * 0.18 + mouseData.current.y * 0.15;
    }
  });

  return (
    <group>
      {/* Central Magnificent Torus Knot */}
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[1.4, 0.38, 160, 32, 2, 3]} />
        <primitive object={SculptureMaterial} ref={materialRef} attach="material" />
      </mesh>

      {/* Outer Delicate Orbital Rings */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[2.4, 0.012, 16, 120]} />
        <meshBasicMaterial color="#C9A96E" transparent opacity={0.35} />
      </mesh>
      <mesh ref={ring2Ref} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[2.0, 0.01, 16, 120]} />
        <meshBasicMaterial color="#C2185B" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

// Celestial Floating Particles in Champagne Gold and Rose
function FloatingParticles() {
  const pointsRef = useRef<THREE.Points>(null);

  const particlesCount = 700;
  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, [particlesCount]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.015;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.008) * 0.15;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesCount}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#C9A96E"
        transparent
        opacity={0.45}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function ThreeCanvas() {
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      style={{
        background: "radial-gradient(ellipse at 50% 45%, #781939 0%, #3D0C1D 45%, #090909 100%)",
      }}
    >
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 7.5]} fov={45} />
        <ambientLight intensity={1.2} />
        <directionalLight position={[4, 5, 4]} intensity={1.8} color="#FFEACC" />
        <pointLight position={[-4, -3, -2]} intensity={2.2} color="#C2185B" />
        <KineticSculpture />
        <FloatingParticles />
      </Canvas>
    </div>
  );
}
