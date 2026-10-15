"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

// Kinetic Prismatic Torus Knot & Orbital Gyroscope
// Ultra-luxurious Fresnel Shader with Deep Wine / Magenta (#781939, #9C1A4A),
// Radiant Gold (#C9A96E) and Specular Highlights.

const SculptureMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uColorWine: { value: new THREE.Color("#4A0E23") },
    uColorMagenta: { value: new THREE.Color("#9C1A4A") },
    uColorGold: { value: new THREE.Color("#C9A96E") },
    uColorHighlight: { value: new THREE.Color("#FFF2D8") },
  },
  vertexShader: `
    uniform float uTime;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColorWine;
    uniform vec3 uColorMagenta;
    uniform vec3 uColorGold;
    uniform vec3 uColorHighlight;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);

      // Multi-angle lighting
      vec3 light1 = normalize(vec3(cos(uTime * 0.4) * 5.0, 4.0, sin(uTime * 0.4) * 5.0));
      vec3 light2 = normalize(vec3(-3.0, -2.0, 4.0));

      // Specular & Diffuse
      float diff1 = max(dot(normal, light1), 0.0);
      float diff2 = max(dot(normal, light2), 0.0);
      vec3 halfDir = normalize(light1 + viewDir);
      float spec = pow(max(dot(normal, halfDir), 0.0), 32.0);

      // Fresnel Rim Glow
      float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 3.0);

      // Color gradation across the knot
      float knotPhase = sin(vUv.x * 6.28318 + uTime * 0.5) * 0.5 + 0.5;
      vec3 baseTone = mix(uColorWine, uColorMagenta, knotPhase);
      vec3 litColor = mix(baseTone, uColorGold, diff1 * 0.6 + diff2 * 0.3);

      // Add rim and specular sheen
      vec3 finalColor = litColor + (uColorHighlight * spec * 0.8) + (uColorGold * fresnel * 0.7);

      gl_FragColor = vec4(finalColor, 0.95);
    }
  `,
  transparent: true,
});

function KineticSculpture() {
  const knotRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    SculptureMaterial.uniforms.uTime.value = t;

    if (knotRef.current) {
      knotRef.current.rotation.x = t * 0.25;
      knotRef.current.rotation.y = t * 0.35;
      knotRef.current.rotation.z = Math.sin(t * 0.2) * 0.2;
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.4;
      ring1Ref.current.rotation.y = Math.sin(t * 0.3) * 0.5;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -t * 0.3;
      ring2Ref.current.rotation.z = t * 0.35;
    }

    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 0.8) * 0.12;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Kinetic Torus Knot */}
      <mesh ref={knotRef} material={SculptureMaterial}>
        <torusKnotGeometry args={[1.2, 0.34, 180, 32, 2, 3]} />
      </mesh>

      {/* Outer Orbital Gyro Ring 1 */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[2.3, 0.02, 16, 100]} />
        <meshStandardMaterial
          color="#C9A96E"
          metalness={0.9}
          roughness={0.15}
          emissive="#781939"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Outer Orbital Gyro Ring 2 */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[2.65, 0.015, 16, 100]} />
        <meshStandardMaterial
          color="#9C1A4A"
          metalness={0.95}
          roughness={0.2}
          emissive="#C9A96E"
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
}

function FloatingParticles() {
  const pointsRef = useRef<THREE.Points>(null);

  const particlesCount = 700;
  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 22;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.03;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.015) * 0.15;
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
        size={0.03}
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
        opacity: 0.95,
      }}
    >
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 8.5]} fov={45} />
        <ambientLight intensity={0.7} />
        <pointLight position={[5, 5, 5]} intensity={1.5} color="#FFF2D8" />
        <pointLight position={[-5, -4, -3]} intensity={1.2} color="#9C1A4A" />
        <KineticSculpture />
        <FloatingParticles />
      </Canvas>
    </div>
  );
}
