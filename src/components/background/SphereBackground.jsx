import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function RibbonSphere() {
  const groupRef = useRef();

  // Generate ribbon bands as curved tube geometries wrapped around a sphere
  const ribbons = useMemo(() => {
    const ribbonData = [];
    const count = 22;

    for (let i = 0; i < count; i++) {
      const phi = (i / count) * Math.PI * 2;
      const tilt = (i / count) * Math.PI;
      const points = [];
      const segments = 180;

      for (let j = 0; j <= segments; j++) {
        const theta = (j / segments) * Math.PI * 2;
        const radius = 2.4;

        // Ribbons wrap around sphere surface at varying orientations
        const x = radius * Math.sin(tilt) * Math.cos(theta) + radius * Math.cos(tilt) * Math.sin(theta * 0.5) * 0.3;
        const y = radius * Math.cos(tilt) * Math.cos(theta) - radius * Math.sin(tilt) * Math.sin(theta * 0.5) * 0.3;
        const z = radius * Math.sin(theta) * Math.cos(tilt * 0.7);

        points.push(new THREE.Vector3(x, y, z));
      }

      // Cyan to teal gradient via index
      const t = i / count;
      const color = new THREE.Color().setHSL(
        0.52 + t * 0.06,  // hue: 187–209 deg (cyan → teal)
        0.85,
        0.35 + t * 0.2    // slightly lighter as we go
      );

      ribbonData.push({ points, color, opacity: 0.3 + (1 - Math.abs(t - 0.5) * 2) * 0.55 });
    }
    return ribbonData;
  }, []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime();
      // Very slow, calm rotation — no dramatic movement
      groupRef.current.rotation.y = t * 0.04;
      groupRef.current.rotation.x = Math.sin(t * 0.02) * 0.06;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {ribbons.map((ribbon, i) => {
        const curve = new THREE.CatmullRomCurve3(ribbon.points, true);
        const tubeGeo = new THREE.TubeGeometry(curve, 200, 0.012, 4, true);
        return (
          <mesh key={i} geometry={tubeGeo}>
            <meshBasicMaterial
              color={ribbon.color}
              transparent
              opacity={ribbon.opacity}
              depthWrite={false}
            />
          </mesh>
        );
      })}

      {/* Core soft inner glow sphere */}
      <mesh>
        <sphereGeometry args={[2.38, 64, 64]} />
        <meshBasicMaterial
          color={new THREE.Color(0x0a2a2e)}
          transparent
          opacity={0.25}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function GlowHalo() {
  // Outer ambient glow via large transparent sphere
  return (
    <mesh position={[1, 0, 0]}>
      <sphereGeometry args={[3.8, 32, 32]} />
      <meshBasicMaterial
        color={new THREE.Color(0x06b6d4)}
        transparent
        opacity={0.03}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function SphereBackground() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 60% 50%, #030d0f 0%, #000000 65%)',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 7], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: '100%', height: '100%' }}
      >
        <GlowHalo />
        <RibbonSphere />
      </Canvas>

      {/* Left-side fade: keeps text overlay area clean and dark */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.45) 30%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
