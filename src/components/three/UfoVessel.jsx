import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const TRAIL_LENGTH = 45;

const UfoVessel = ({ palette, isDark, speedScale = 1 }) => {
  const groupRef = useRef();
  const trailLineRef = useRef();
  const saucerRef = useRef();
  const time = useRef(0);

  // Position calculation along a smooth, elegant 3D celestial curve
  const pathAt = (t, target, widthScale = 1) => {
    // 3D Lissajous curve with depth variation that sweeps across the background
    const x = (Math.sin(t * 0.32) * 26 + Math.cos(t * 0.16) * 10) * widthScale;
    const y = Math.cos(t * 0.24) * 12 + Math.sin(t * 0.12) * 6;
    const z = -12 + Math.sin(t * 0.28) * 10;
    return target.set(x, y, z);
  };

  const nextPos = useMemo(() => new THREE.Vector3(), []);
  const currentPos = useMemo(() => new THREE.Vector3(), []);

  // Trail buffer: store previous positions & fading alpha colors
  const { positions, trailGeo } = useMemo(() => {
    const pos = new Float32Array(TRAIL_LENGTH * 3);
    const col = new Float32Array(TRAIL_LENGTH * 3);
    const geo = new THREE.BufferGeometry();

    const headColor = new THREE.Color(palette.accent || '#ff6a2b');
    const tailColor = new THREE.Color(palette.atmosphere || '#00e5ff');

    for (let i = 0; i < TRAIL_LENGTH; i++) {
      pos[i * 3 + 0] = 0;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = -12;

      // Color fade from head (bright accent) to tail (cool cyan / transparent fade)
      const ratio = i / TRAIL_LENGTH;
      const c = new THREE.Color().lerpColors(headColor, tailColor, ratio);
      // Darken toward tail so it fades out smoothly into space
      c.multiplyScalar(Math.pow(1 - ratio, 1.8));

      col[i * 3 + 0] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    return { positions: pos, trailGeo: geo };
  }, [palette]);

  useFrame(({ camera, size }, delta) => {
    const step = delta * speedScale;
    time.current += step;
    const t = time.current;

    const group = groupRef.current;
    if (!group) return;

    // On mobile portrait screens, scale the horizontal sweep so the UFO stays visible
    const isPortrait = size.width < size.height;
    const widthScale = isPortrait ? 0.45 : 1.0;

    // Follow camera Y slightly so the UFO stays visible as you scroll across sections
    const camYOffset = camera.position.y * 0.75;
    pathAt(t, currentPos, widthScale);
    currentPos.y += camYOffset;

    pathAt(t + 0.12, nextPos, widthScale);
    nextPos.y += camYOffset;

    group.position.copy(currentPos);
    group.lookAt(nextPos);

    // Aerodynamic bank angle based on turn curvature
    const bank = Math.cos(t * 0.32) * 0.55;
    group.rotateZ(-bank);

    // Saucer internal spin for classic flying saucer effect
    if (saucerRef.current) {
      saucerRef.current.rotation.y += step * 2.5;
    }

    // Update trailing light line ("vẽ các đường nhìn như các hình chạy phía sau")
    const pArr = positions;
    // Shift points back
    for (let i = TRAIL_LENGTH - 1; i > 0; i--) {
      pArr[i * 3 + 0] = pArr[(i - 1) * 3 + 0];
      pArr[i * 3 + 1] = pArr[(i - 1) * 3 + 1];
      pArr[i * 3 + 2] = pArr[(i - 1) * 3 + 2];
    }
    // Head point at UFO thruster position
    pArr[0] = currentPos.x;
    pArr[1] = currentPos.y;
    pArr[2] = currentPos.z;

    trailGeo.attributes.position.needsUpdate = true;
  });

  const accentColor = palette.accent || '#ff6a2b';
  const rimColor = isDark ? '#ffffff' : '#1c1915';

  return (
    <>
      {/* 1. Glowing Trail Drawn by the UFO ("vẽ các đường chạy phía sau") */}
      <line ref={trailLineRef} geometry={trailGeo}>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={isDark ? 0.95 : 0.65}
          linewidth={2}
          blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
          depthWrite={false}
        />
      </line>

      {/* 2. The 3D Flying Saucer with Alien Pilot */}
      <group ref={groupRef}>
        <group ref={saucerRef}>
          {/* Main Saucer Upper Disc */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[2.0, 0.4, 0.45, 24]} />
            <meshStandardMaterial
              color={isDark ? '#2a2f38' : '#e2dbcd'}
              metalness={0.8}
              roughness={0.25}
            />
          </mesh>

          {/* Saucer Outer Wireframe Rim */}
          <mesh position={[0, 0, 0]}>
            <torusGeometry args={[2.05, 0.08, 8, 24]} />
            <meshBasicMaterial color={accentColor} />
          </mesh>

          {/* Inverted Lower Hull Cone */}
          <mesh position={[0, -0.3, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[2.0, 0.5, 24, 1, true]} />
            <meshStandardMaterial
              color={isDark ? '#1a1d24' : '#cdc4b3'}
              metalness={0.9}
              roughness={0.3}
            />
          </mesh>

          {/* Perimeter LED Running Lights */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const lx = Math.cos(angle) * 1.95;
            const lz = Math.sin(angle) * 1.95;
            const isAccent = i % 2 === 0;
            return (
              <mesh key={i} position={[lx, 0, lz]}>
                <sphereGeometry args={[0.12, 10, 10]} />
                <meshBasicMaterial
                  color={isAccent ? accentColor : '#00e5ff'}
                  toneMapped={false}
                />
              </mesh>
            );
          })}

          {/* Bottom Anti-gravity Thruster Core */}
          <mesh position={[0, -0.55, 0]}>
            <cylinderGeometry args={[0.7, 0.4, 0.25, 16]} />
            <meshBasicMaterial color={accentColor} toneMapped={false} />
          </mesh>

          {/* Soft Anti-gravity Beam / Downward Cone of Light */}
          <mesh position={[0, -2.2, 0]} rotation={[0, 0, 0]}>
            <coneGeometry args={[1.6, 3.2, 16, 1, true]} />
            <meshBasicMaterial
              color={accentColor}
              transparent
              opacity={isDark ? 0.25 : 0.12}
              side={THREE.DoubleSide}
              depthWrite={false}
              blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
            />
          </mesh>
        </group>

        {/* ========================================================= */}
        {/* COCKPIT & THE ALIEN PILOT (Không xoay theo vành đĩa bay) */}
        {/* ========================================================= */}
        <group position={[0, 0.22, 0]}>
          {/* Glass Cockpit Dome */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[1.08, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            <meshStandardMaterial
              color="#80deea"
              transparent
              opacity={0.38}
              roughness={0.15}
              depthWrite={false}
            />
          </mesh>

          {/* Glass Specular Rim Ring */}
          <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.08, 0.03, 8, 24]} />
            <meshBasicMaterial color={rimColor} transparent opacity={0.6} />
          </mesh>

          {/* ALIEN BODY & SPACESUIT */}
          <mesh position={[0, 0.12, 0]}>
            <cylinderGeometry args={[0.32, 0.42, 0.35, 12]} />
            <meshStandardMaterial color={isDark ? '#37474f' : '#8d99ae'} />
          </mesh>

          {/* ALIEN HEAD (Pear/Teardrop shape) */}
          <mesh position={[0, 0.5, 0]} scale={[1, 1.25, 0.95]}>
            <sphereGeometry args={[0.38, 18, 18]} />
            <meshStandardMaterial
              color="#00e676"
              emissive="#00b0ff"
              emissiveIntensity={0.25}
              roughness={0.4}
            />
          </mesh>

          {/* ALIEN ANTENNA */}
          <group position={[0, 0.92, 0]}>
            <mesh position={[0.04, 0.08, 0]} rotation={[0, 0, -0.2]}>
              <cylinderGeometry args={[0.02, 0.02, 0.22, 8]} />
              <meshBasicMaterial color="#00e676" />
            </mesh>
            {/* Glowing Antenna Orb */}
            <mesh position={[0.08, 0.2, 0]}>
              <sphereGeometry args={[0.08, 12, 12]} />
              <meshBasicMaterial color="#ffeb3b" toneMapped={false} />
            </mesh>
          </group>

          {/* BIG GLOSSY OBSIDIAN ALIEN EYES */}
          {/* Left Eye */}
          <mesh position={[-0.14, 0.52, 0.28]} rotation={[0.15, -0.25, -0.15]} scale={[1, 1.4, 0.7]}>
            <sphereGeometry args={[0.11, 12, 12]} />
            <meshBasicMaterial color="#050811" />
          </mesh>

          {/* Right Eye */}
          <mesh position={[0.14, 0.52, 0.28]} rotation={[0.15, 0.25, 0.15]} scale={[1, 1.4, 0.7]}>
            <sphereGeometry args={[0.11, 12, 12]} />
            <meshBasicMaterial color="#050811" />
          </mesh>

          {/* Cockpit Instrument Console */}
          <mesh position={[0, 0.18, 0.42]} rotation={[-Math.PI / 4, 0, 0]}>
            <boxGeometry args={[0.55, 0.12, 0.06]} />
            <meshBasicMaterial color="#101826" />
          </mesh>
          {/* Console Mini Glowing LED */}
          <mesh position={[-0.16, 0.22, 0.44]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial color="#00e676" />
          </mesh>
          <mesh position={[0, 0.22, 0.44]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial color="#ff1744" />
          </mesh>
          <mesh position={[0.16, 0.22, 0.44]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial color="#00e5ff" />
          </mesh>
        </group>
      </group>
    </>
  );
};

export default UfoVessel;
