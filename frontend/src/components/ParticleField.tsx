/**
 * ParticleField — Immersive Three.js particle system for the Hero background.
 * Creates a flowing field of particles that respond subtly to mouse movement,
 * giving the hero section a living, breathing quality.
 */
import React, { useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ─── Particle Mesh Component ─────────────────────────────────────────────────
interface ParticlesProps {
  count?: number;
  mousePos: React.MutableRefObject<{ x: number; y: number }>;
}

const Particles: React.FC<ParticlesProps> = ({ count = 600, mousePos }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const { viewport } = useThree();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Generate stable random positions, speeds, and sizes
  const particles = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        // Spread particles across a wide area
        x: (Math.random() - 0.5) * viewport.width * 2.8,
        y: (Math.random() - 0.5) * viewport.height * 2.8,
        z: (Math.random() - 0.5) * 4,
        // Drift speed
        speedX: (Math.random() - 0.5) * 0.003,
        speedY: (Math.random() - 0.5) * 0.003,
        // Scale range: tiny dots to small spheres
        scale: 0.008 + Math.random() * 0.025,
        // Phase offset for organic oscillation
        phase: Math.random() * Math.PI * 2,
        // Base opacity (encoded as gray shade in material)
        opacity: 0.15 + Math.random() * 0.45,
      });
    }
    return data;
  }, [count, viewport.width, viewport.height]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const mesh = meshRef.current;
    if (!mesh) return;

    for (let i = 0; i < count; i++) {
      const p = particles[i];

      // Gentle drift + sinusoidal wobble
      const px = p.x + Math.sin(t * 0.3 + p.phase) * 0.15 + mousePos.current.x * 0.08 * (p.z + 2);
      const py = p.y + Math.cos(t * 0.25 + p.phase) * 0.12 + mousePos.current.y * 0.06 * (p.z + 2);
      const pz = p.z + Math.sin(t * 0.15 + p.phase * 2) * 0.3;

      // Slowly drift
      p.x += p.speedX;
      p.y += p.speedY;

      // Wrap around boundaries
      const boundX = viewport.width * 1.5;
      const boundY = viewport.height * 1.5;
      if (p.x > boundX) p.x = -boundX;
      if (p.x < -boundX) p.x = boundX;
      if (p.y > boundY) p.y = -boundY;
      if (p.y < -boundY) p.y = boundY;

      // Gentle breathing scale
      const scale = p.scale * (1 + Math.sin(t * 0.8 + p.phase) * 0.15);

      dummy.position.set(px, py, pz);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial
        color="#94a3b8"
        transparent
        opacity={0.5}
        depthWrite={false}
      />
    </instancedMesh>
  );
};

// ─── Connection Lines Component ──────────────────────────────────────────────
const ConnectionGrid: React.FC = () => {
  const lineRef = useRef<THREE.LineSegments>(null!);
  const { viewport } = useThree();

  // Create a subtle grid of faint connection lines
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions: number[] = [];
    const gridSize = 12;
    const spacing = viewport.width * 0.18;

    for (let i = -gridSize; i <= gridSize; i++) {
      // Horizontal lines
      positions.push(-gridSize * spacing, i * spacing, -3);
      positions.push(gridSize * spacing, i * spacing, -3);
      // Vertical lines
      positions.push(i * spacing, -gridSize * spacing, -3);
      positions.push(i * spacing, gridSize * spacing, -3);
    }

    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, [viewport.width]);

  return (
    <lineSegments ref={lineRef} geometry={geometry}>
      <lineBasicMaterial
        color="#cbd5e1"
        transparent
        opacity={0.07}
        depthWrite={false}
      />
    </lineSegments>
  );
};

// ─── Main Exported Canvas ────────────────────────────────────────────────────
export const ParticleField: React.FC = () => {
  const mousePos = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    // Normalized -1 to 1
    mousePos.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    mousePos.current.y = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
  }, []);

  return (
    <div
      className="absolute inset-0 z-0 pointer-events-auto"
      onMouseMove={handleMouseMove}
      style={{ pointerEvents: 'none' }}
    >
      <div className="w-full h-full" style={{ pointerEvents: 'auto' }} onMouseMove={handleMouseMove}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 60 }}
          dpr={[1, 1.5]}
          gl={{ antialias: false, alpha: true }}
          style={{
            background: 'transparent',
            pointerEvents: 'none',
          }}
        >
          <Particles count={500} mousePos={mousePos} />
          <ConnectionGrid />
        </Canvas>
      </div>
    </div>
  );
};
