import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

const SpatialGyro = ({ palette, isDark, position = [18, 8, -12], scale = 1.4, speedScale = 1, arcadeActive }) => {
  const outerRingRef = useRef();
  const midRingRef = useRef();
  const innerRingRef = useRef();
  const coreRef = useRef();

  useFrame((_, delta) => {
    const s = delta * (arcadeActive?.current ? 0 : speedScale);
    if (outerRingRef.current) outerRingRef.current.rotation.z += s * 0.35;
    if (midRingRef.current) midRingRef.current.rotation.x += s * 0.45;
    if (innerRingRef.current) innerRingRef.current.rotation.y += s * 0.55;
    if (coreRef.current) {
      coreRef.current.rotation.x += s * 0.6;
      coreRef.current.rotation.y += s * 0.8;
    }
  });

  const wireColor = palette.accent || '#ff6a2b';
  const subColor = palette.fg;

  return (
    <group position={position} scale={scale}>
      {/* Outer Ring */}
      <group ref={outerRingRef}>
        <mesh>
          <torusGeometry args={[3.2, 0.02, 8, 48]} />
          <meshBasicMaterial color={wireColor} transparent opacity={isDark ? 0.6 : 0.4} />
        </mesh>
      </group>

      {/* Mid Ring */}
      <group ref={midRingRef} rotation={[Math.PI / 3, 0, 0]}>
        <mesh>
          <torusGeometry args={[2.5, 0.02, 8, 40]} />
          <meshBasicMaterial color={subColor} transparent opacity={isDark ? 0.5 : 0.3} />
        </mesh>
      </group>

      {/* Inner Ring */}
      <group ref={innerRingRef} rotation={[0, Math.PI / 3, 0]}>
        <mesh>
          <torusGeometry args={[1.8, 0.02, 8, 36]} />
          <meshBasicMaterial color={wireColor} transparent opacity={isDark ? 0.65 : 0.4} />
        </mesh>
      </group>

      {/* Core Wireframe Octahedron */}
      <mesh ref={coreRef}>
        <octahedronGeometry args={[0.9, 0]} />
        <meshBasicMaterial color={wireColor} wireframe transparent opacity={isDark ? 0.85 : 0.6} />
      </mesh>
    </group>
  );
};

export default SpatialGyro;
