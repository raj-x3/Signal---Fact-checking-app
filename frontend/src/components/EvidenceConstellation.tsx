/**
 * EvidenceConstellation — Interactive 3D Evidence Hologram & Node Graph
 * Powered by Three.js & @react-three/fiber.
 * Visualizes citations, archival evidence nodes, and stance vectors in real-time 3D space.
 */
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface ConstellationProps {
  filter: 'all' | 'supported' | 'contradicted' | 'unverified';
}

const NodeGraph: React.FC<{ filter: ConstellationProps['filter'] }> = ({ filter }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const ringRef1 = useRef<THREE.Mesh>(null!);
  const ringRef2 = useRef<THREE.Mesh>(null!);
  const ringRef3 = useRef<THREE.Mesh>(null!);

  // Dynamic color palette based on active evidence filter
  const themeColor = useMemo(() => {
    switch (filter) {
      case 'supported':
        return { primary: '#10b981', secondary: '#34d399', light: '#a7f3d0' };
      case 'contradicted':
        return { primary: '#f43f5e', secondary: '#fb7185', light: '#fecdd3' };
      case 'unverified':
        return { primary: '#f59e0b', secondary: '#fbbf24', light: '#fef3c7' };
      case 'all':
      default:
        return { primary: '#2563eb', secondary: '#06b6d4', light: '#cffafe' };
    }
  }, [filter]);

  // Generate 3D nodes representing evidence sources
  const nodes = useMemo(() => {
    const items = [];
    const count = 28;
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      const radius = 2.4 + (i % 3) * 0.3;
      items.push({
        position: new THREE.Vector3(
          radius * Math.cos(theta) * Math.sin(phi),
          radius * Math.sin(theta) * Math.sin(phi),
          radius * Math.cos(phi)
        ),
        size: 0.06 + (i % 4) * 0.025,
        pulseSpeed: 1 + (i % 5) * 0.5,
      });
    }
    return items;
  }, []);

  // Generate connection line geometry between nearby nodes
  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions: number[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = nodes[i].position.distanceTo(nodes[j].position);
        if (dist < 1.6) {
          positions.push(
            nodes[i].position.x, nodes[i].position.y, nodes[i].position.z,
            nodes[j].position.x, nodes[j].position.y, nodes[j].position.z
          );
        }
      }
    }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, [nodes]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.12;
      groupRef.current.rotation.x = Math.sin(t * 0.08) * 0.15;
    }
    if (ringRef1.current) ringRef1.current.rotation.z = t * 0.25;
    if (ringRef2.current) ringRef2.current.rotation.x = -t * 0.18;
    if (ringRef3.current) ringRef3.current.rotation.y = t * 0.22;
  });

  return (
    <group ref={groupRef}>
      {/* Central Core Holographic Geodesic Sphere */}
      <mesh>
        <icosahedronGeometry args={[1.2, 2]} />
        <meshBasicMaterial
          color={themeColor.primary}
          wireframe
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Inner Glowing Core */}
      <mesh>
        <sphereGeometry args={[0.7, 16, 16]} />
        <meshBasicMaterial
          color={themeColor.secondary}
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Orbiting Gyroscope Radar Rings */}
      <mesh ref={ringRef1} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[2.0, 0.012, 8, 64]} />
        <meshBasicMaterial color={themeColor.primary} transparent opacity={0.4} />
      </mesh>

      <mesh ref={ringRef2} rotation={[-Math.PI / 3, Math.PI / 6, 0]}>
        <torusGeometry args={[2.5, 0.01, 8, 64]} />
        <meshBasicMaterial color={themeColor.secondary} transparent opacity={0.3} />
      </mesh>

      <mesh ref={ringRef3} rotation={[Math.PI / 6, -Math.PI / 4, 0]}>
        <torusGeometry args={[2.9, 0.008, 8, 64]} />
        <meshBasicMaterial color={themeColor.primary} transparent opacity={0.25} />
      </mesh>

      {/* Evidence Source Nodes (Spheres with Stance Coloring) */}
      {nodes.map((node, idx) => (
        <mesh key={idx} position={node.position}>
          <sphereGeometry args={[node.size, 12, 12]} />
          <meshBasicMaterial
            color={idx % 3 === 0 ? themeColor.primary : themeColor.secondary}
            transparent
            opacity={0.85}
          />
        </mesh>
      ))}

      {/* Connecting Neural/Citation Beams */}
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial
          color={themeColor.light}
          transparent
          opacity={0.25}
        />
      </lineSegments>
    </group>
  );
};

export const EvidenceConstellation: React.FC<ConstellationProps> = ({ filter }) => {
  return (
    <div className="w-full h-full min-h-[180px] sm:min-h-[220px] relative pointer-events-none select-none">
      <Canvas
        camera={{ position: [0, 0, 6.2], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.6}>
          <NodeGraph filter={filter} />
        </Float>
      </Canvas>
    </div>
  );
};
