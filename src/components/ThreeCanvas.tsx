"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

const OrbMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color("#C9A96E") }, // Gold
    uColor2: { value: new THREE.Color("#FFFFFF") }, // White/Silver
  },
  vertexShader: `
    uniform float uTime;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    // Classic Perlin 3D Noise 
    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
    vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

    float cnoise(vec3 P){
      vec3 Pi0 = floor(P);
      vec3 Pi1 = Pi0 + vec3(1.0);
      Pi0 = mod(Pi0, 289.0);
      Pi1 = mod(Pi1, 289.0);
      vec3 Pf0 = fract(P);
      vec3 Pf1 = Pf0 - vec3(1.0);
      vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
      vec4 iy = vec4(Pi0.yy, Pi1.yy);
      vec4 iz0 = Pi0.zzzz;
      vec4 iz1 = Pi1.zzzz;

      vec4 ixy = permute(permute(ix) + iy);
      vec4 ixy0 = permute(ixy + iz0);
      vec4 ixy1 = permute(ixy + iz1);

      vec4 gx0 = ixy0 / 7.0;
      vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
      gx0 = fract(gx0);
      vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
      vec4 sz0 = step(gz0, vec4(0.0));
      gx0 -= sz0 * (step(0.0, gx0) - 0.5);
      gy0 -= sz0 * (step(0.0, gy0) - 0.5);

      vec4 gx1 = ixy1 / 7.0;
      vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
      gx1 = fract(gx1);
      vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
      vec4 sz1 = step(gz1, vec4(0.0));
      gx1 -= sz1 * (step(0.0, gx1) - 0.5);
      gy1 -= sz1 * (step(0.0, gy1) - 0.5);

      vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
      vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
      vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
      vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
      vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
      vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
      vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
      vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

      vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
      g000 *= norm0.x;
      g010 *= norm0.y;
      g100 *= norm0.z;
      g110 *= norm0.w;
      vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
      g001 *= norm1.x;
      g011 *= norm1.y;
      g101 *= norm1.z;
      g111 *= norm1.w;

      float n000 = dot(g000, Pf0);
      float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
      float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
      float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
      float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
      float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
      float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
      float n111 = dot(g111, Pf1);

      vec3 fade_xyz = fade(Pf0);
      vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
      vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
      float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
      return 2.2 * n_xyz;
    }

    void main() {
      vUv = uv;
      
      // Calculate displacement
      float noiseFreq = 1.0;
      float noiseAmp = 0.4;
      vec3 noisePos = vec3(position.x * noiseFreq + uTime * 0.2, position.y * noiseFreq + uTime * 0.3, position.z * noiseFreq);
      
      float displacement = cnoise(noisePos) * noiseAmp;
      vec3 newPosition = position + normal * displacement;
      
      // Approximate normal for shiny reflection
      vec3 offset = vec3(0.02, 0.0, 0.0);
      float dX = cnoise(noisePos + offset.xyy) * noiseAmp - displacement;
      float dY = cnoise(noisePos + offset.yxy) * noiseAmp - displacement;
      float dZ = cnoise(noisePos + offset.yyx) * noiseAmp - displacement;
      vec3 newNormal = normalize(normal - vec3(dX, dY, dZ) * 50.0);
      
      vNormal = normalize(normalMatrix * newNormal);
      vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      // Fresnel effect for that premium shiny liquid look
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);
      
      float fresnel = dot(viewDir, normal);
      fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
      fresnel = pow(fresnel, 2.5);
      
      // Mix gold and white based on fresnel and UV height
      vec3 color = mix(uColor1, uColor2, fresnel * 0.9 + vUv.y * 0.2);
      
      // Subtle specular highlight
      vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
      vec3 halfVector = normalize(lightDir + viewDir);
      float specular = pow(max(dot(normal, halfVector), 0.0), 100.0);
      
      color += vec3(1.0) * specular * 0.5;
      
      gl_FragColor = vec4(color, 0.85);
    }
  `,
  transparent: true,
  side: THREE.DoubleSide,
});

function LiquidOrb() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const scrollData = useRef({ y: 0, targetY: 0 });
  const mouseData = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useFrame((state, delta) => {
    if (!meshRef.current || !materialRef.current) return;
    materialRef.current.uniforms.uTime.value += delta;
    
    const { pointer } = state;
    mouseData.current.targetX = pointer.x;
    mouseData.current.targetY = pointer.y;
    mouseData.current.x += (mouseData.current.targetX - mouseData.current.x) * 0.05;
    mouseData.current.y += (mouseData.current.targetY - mouseData.current.y) * 0.05;
    
    const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight || 1);
    scrollData.current.targetY = scrollPercent;
    scrollData.current.y += (scrollData.current.targetY - scrollData.current.y) * 0.05;
    
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.05 + mouseData.current.x * 0.3 + scrollData.current.y * Math.PI;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.03 - mouseData.current.y * 0.3 + scrollData.current.y * Math.PI * 0.5;
    
    // Smooth breathing scale
    const baseScale = 1.0;
    const scaleBreath = baseScale + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    meshRef.current.scale.set(scaleBreath, scaleBreath, scaleBreath);
  });

  return (
    <mesh ref={meshRef}>
      {/* High-res icosahedron makes for a perfectly smooth sphere when displaced */}
      <icosahedronGeometry args={[1.5, 64]} />
      <primitive object={OrbMaterial} ref={materialRef} attach="material" />
    </mesh>
  );
}

function FloatingParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  
  const particlesCount = 800;
  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 20; 
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.2;
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
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.025} 
        color="#C9A96E" 
        transparent 
        opacity={0.4} 
        blending={THREE.AdditiveBlending} 
        depthWrite={false} 
      />
    </points>
  );
}

export default function ThreeCanvas() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.85]">
      <Canvas dpr={[1, 2]}>
        {/* Camera pushed back so it fits nicely and looks premium */}
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />
        <ambientLight intensity={1} />
        <LiquidOrb />
        <FloatingParticles />
      </Canvas>
    </div>
  );
}
