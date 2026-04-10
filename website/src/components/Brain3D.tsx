"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// ─── Voxel Brain Mesh ───
function VoxelBrain() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Voxel positions trimmed into a brain shape
  const voxels = useMemo(() => {
    const positions: [number, number, number][] = [];
    for (let x = -3; x <= 3; x++) {
      for (let y = -2; y <= 2; y++) {
        for (let z = -2; z <= 2; z++) {
          if (x === 0) continue;
          const dist = Math.sqrt((x * 0.7) ** 2 + (y * 1.2) ** 2 + (z * 1.1) ** 2);
          if (dist < 2.8 && dist > 0.5) {
            positions.push([x * 0.3, y * 0.3, z * 0.3]);
          }
        }
      }
    }
    // Brain stem
    positions.push([0, -0.8, -0.3], [0, -1.0, -0.3], [0, -1.2, -0.3]);
    return positions;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  // Theme colors matching the Rose palette
  const colors = useMemo(() => {
    const rosePrimary = new THREE.Color("#c4604a");
    const roseAccent = new THREE.Color("#d4735a");
    return voxels.map(() => {
      const color = Math.random() > 0.5 ? rosePrimary.clone() : roseAccent.clone();
      color.multiplyScalar(0.8 + Math.random() * 0.4); // Add depth variation
      return color;
    });
  }, [voxels]);

  useEffect(() => {
    if (meshRef.current) {
      colors.forEach((color, i) => meshRef.current!.setColorAt(i, color));
      meshRef.current.instanceColor!.needsUpdate = true;
    }
  }, [colors]);

  useFrame((state) => {
    if (!meshRef.current) return;
    voxels.forEach((pos, i) => {
      const [x, y, z] = pos;
      const wave = Math.sin(state.clock.elapsedTime * 2 + (x + y + z) * 2) * 0.05;
      const pulse = 1 + wave;
      dummy.position.set(x, y, z);
      dummy.scale.set(pulse, pulse, pulse);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, voxels.length]}
        castShadow
      >
        <boxGeometry args={[0.25, 0.25, 0.25]} />
        <meshStandardMaterial roughness={0.3} metalness={0.2} color="#ffffff" />
      </instancedMesh>
    </group>
  );
}

// ─── Digital particles ───
function DigitalParticles() {
  const count = 40;
  const mesh = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 6;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 6;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 3;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (mesh.current) mesh.current.rotation.y = state.clock.elapsedTime * 0.05;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#c4604a" size={0.03} transparent opacity={0.3} />
    </points>
  );
}

export function Brain3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 40 }}
      style={{ width: "100%", height: "100%" }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 5, 5]} intensity={2} color="#ffffff" />
      <pointLight position={[-2, -2, 2]} intensity={1} color="#d4735a" />
      <pointLight position={[2, 2, -2]} intensity={0.5} color="#c4604a" />
      
      <VoxelBrain />
      <DigitalParticles />
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        autoRotate={true} 
        autoRotateSpeed={3}
        rotateSpeed={0.8}
      />
    </Canvas>
  );
}

