import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Edges, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// 1. Massive Cosmic Starfield Component
const Starfield = ({ isDark }) => {
  const pointsRef = useRef();
  
  // 8000 tiny stars
  const particlesCount = 8000;
  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      // Spread vastly across the axes
      pos[i * 3] = (Math.random() - 0.5) * 200; // X
      pos[i * 3 + 1] = (Math.random() - 0.5) * 200; // Y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 200; // Z
    }
    return pos;
  }, [particlesCount]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      // Slowly rotate the entire starfield for a flying/drifting illusion
      pointsRef.current.rotation.y += delta * 0.015;
      pointsRef.current.rotation.x += delta * 0.005;
    }
  });

  const color = isDark ? '#ffffff' : '#000000';

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
      <pointsMaterial color={color} size={0.15} transparent opacity={1.0} sizeAttenuation />
    </points>
  );
};

// 2. Procedural Wireframe Spaceship Component (Classic Retro Rocket)
const WireframeSpaceship = ({ isDark, config, centerPos }) => {
  const groupRef = useRef();
  const fireRef = useRef();
  const { radius, speed, yOffset, orbitOffset, bankAngle } = config;

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Current position
    const currentAngle = t * speed + orbitOffset;
    const x = Math.sin(currentAngle) * radius + centerPos[0];
    const y = Math.cos(t * Math.abs(speed) * 0.5 + orbitOffset) * 5 + yOffset + centerPos[1];
    const z = Math.cos(currentAngle) * radius + centerPos[2];

    // Next position (slightly ahead in time) to determine where to look
    const lookAheadTime = 0.1;
    const nextAngle = (t + lookAheadTime) * speed + orbitOffset;
    const nextX = Math.sin(nextAngle) * radius + centerPos[0];
    const nextY = Math.cos((t + lookAheadTime) * Math.abs(speed) * 0.5 + orbitOffset) * 5 + yOffset + centerPos[1];
    const nextZ = Math.cos(nextAngle) * radius + centerPos[2];

    if (groupRef.current) {
      groupRef.current.position.set(x, y, z);
      
      // Look at the next position so the nose points perfectly forward along the flight path
      groupRef.current.lookAt(nextX, nextY, nextZ);
      
      // Add banking/tilt roll based on the config for dynamic flight
      groupRef.current.rotateZ(bankAngle);
    }

    if (fireRef.current) {
      // Pulse the fire (scale Y dynamically)
      fireRef.current.scale.y = 1 + Math.sin(t * 10) * 0.2;
    }
  });

  const fgColor = isDark ? '#ffffff' : '#000000';
  const bgColor = isDark ? '#000000' : '#ffffff';

  return (
    <group ref={groupRef}>
      {/* Since lookAt points +Z to the target, we rotate the ship 90 degrees on X so its nose (+Y) points to +Z */}
      <group rotation={[Math.PI / 2, 0, 0]}>
        
        {/* Main Body (Aerodynamic stretch, low poly) */}
        <mesh>
          <cylinderGeometry args={[0.5, 0.5, 2.5, 8]} />
          <meshBasicMaterial color={bgColor} />
          <Edges color={fgColor} />
        </mesh>
        
        {/* Nose Cone */}
        <mesh position={[0, 1.75, 0]}>
          <coneGeometry args={[0.5, 1, 8]} />
          <meshBasicMaterial color={bgColor} />
          <Edges color={fgColor} />
        </mesh>

        {/* Window */}
        <mesh position={[0, 0.5, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.1, 8]} />
          <meshBasicMaterial color={bgColor} />
          <Edges color={fgColor} />
        </mesh>
        
        {/* Left Fin */}
        <mesh position={[-0.6, -0.5, 0]} rotation={[0, 0, Math.PI / 8]}>
          <boxGeometry args={[0.6, 1.2, 0.05]} />
          <meshBasicMaterial color={bgColor} />
          <Edges color={fgColor} />
        </mesh>
        
        {/* Right Fin */}
        <mesh position={[0.6, -0.5, 0]} rotation={[0, 0, -Math.PI / 8]}>
          <boxGeometry args={[0.6, 1.2, 0.05]} />
          <meshBasicMaterial color={bgColor} />
          <Edges color={fgColor} />
        </mesh>
        
        {/* Engine Nozzle */}
        <mesh position={[0, -1.4, 0]}>
          <cylinderGeometry args={[0.2, 0.3, 0.4, 8]} />
          <meshBasicMaterial color={bgColor} />
          <Edges color={fgColor} />
        </mesh>

        {/* Fire/Thrust */}
        <mesh ref={fireRef} position={[0, -2, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.3, 1, 8]} />
          <meshBasicMaterial color={fgColor} transparent opacity={0.6} />
        </mesh>

      </group>
    </group>
  );
};

// 3. Earth Shader Material & Component
const EarthShaderMaterial = ({ isDark, map }) => {
  const fgColor = isDark ? '#ffffff' : '#000000';
  
  const uniforms = useMemo(() => ({
    map: { value: map },
    color: { value: new THREE.Color(fgColor) }
  }), [map, fgColor]); // Added fgColor to dependency array for safety

  useEffect(() => {
    uniforms.color.value.set(fgColor);
  }, [fgColor, uniforms]);

  return (
    <shaderMaterial
      transparent
      uniforms={uniforms}
      vertexShader={`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `}
      fragmentShader={`
        uniform sampler2D map;
        uniform vec3 color;
        varying vec2 vUv;
        void main() {
          vec4 texColor = texture2D(map, vUv);
          // Specular map: Oceans are white/light, Land is black/dark
          float luminance = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
          // If it's dark, it's land
          float isLand = luminance < 0.5 ? 1.0 : 0.0;
          gl_FragColor = vec4(color, isLand);
        }
      `}
    />
  );
};

const EarthGlobe = ({ isDark, radius }) => {
  const fgColor = isDark ? '#ffffff' : '#000000';
  const bgColor = isDark ? '#000000' : '#ffffff';
  const earthMap = useTexture('/images/earth-map.jpg');

  return (
    <group>
      {/* Background Core */}
      <mesh>
        <sphereGeometry args={[radius * 0.98, 32, 32]} />
        <meshBasicMaterial color={bgColor} />
      </mesh>
      
      {/* Continents Texture */}
      <mesh rotation={[0, -Math.PI / 2, 0]}>
        <sphereGeometry args={[radius * 0.99, 32, 32]} />
        <EarthShaderMaterial isDark={isDark} map={earthMap} />
      </mesh>
      
      {/* Wireframe Lat/Long Grid to match the image */}
      <mesh>
        <sphereGeometry args={[radius, 18, 18]} />
        <meshBasicMaterial color={fgColor} wireframe transparent opacity={0.6} />
      </mesh>
    </group>
  );
};

// 4. Solar System & Alien Outer Globes
const CelestialSystem = ({ isDark }) => {
  const sunCenterRef = useRef();
  const earthOrbitRef = useRef();
  const moonRef = useRef();
  
  // Array of refs for the alien outer globes
  const alienRefs = useRef([]);

  const fgColor = isDark ? '#ffffff' : '#000000';

  // The massive Sun's fixed position (slightly off-center)
  const centerPos = [-8, 0, -10];

  // Configuration for alien bodies / spaceships (SLOWED DOWN, INCREASED RADIUS)
  const aliens = useMemo(() => [
    { type: 'dodecahedron', radius: 35, speed: 0.03, yOffset: 8, rotSpeed: [0.01, 0.02, 0.005] },
    { type: 'spaceship', radius: 42, speed: 0.05, yOffset: -10, orbitOffset: 0, bankAngle: -Math.PI / 4 },
    { type: 'octahedron', radius: 30, speed: 0.04, yOffset: 15, rotSpeed: [0.02, 0.01, 0.01] },
    { type: 'dodecahedron', radius: 38, speed: 0.02, yOffset: -5, rotSpeed: [0.005, 0.03, 0.02] },
    { type: 'spaceship', radius: 48, speed: -0.03, yOffset: 5, orbitOffset: Math.PI, bankAngle: Math.PI / 4 }
  ], []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Giant Sun: Slow, majestic rotation
    if (sunCenterRef.current) {
      sunCenterRef.current.rotation.y += 0.002;
      sunCenterRef.current.rotation.x += 0.0005;
    }

    // Earth (orbiting the massive Sun)
    let eX = 0, eY = 0, eZ = 0;
    if (earthOrbitRef.current) {
      eX = centerPos[0] + Math.sin(t * 0.1) * 22;
      eY = centerPos[1] + Math.sin(t * 0.1) * 5; 
      eZ = centerPos[2] + Math.cos(t * 0.1) * 22;
      earthOrbitRef.current.position.set(eX, eY, eZ);
      earthOrbitRef.current.rotation.y += 0.005;
      earthOrbitRef.current.rotation.x += 0.002;
    }

    // The Moon (orbiting the Earth)
    if (moonRef.current) {
      moonRef.current.position.set(
        eX + Math.sin(t * 0.5) * 2,
        eY + Math.cos(t * 0.5) * -0.5, // Inclined lunar orbit
        eZ + Math.cos(t * 0.5) * 2
      );
      moonRef.current.rotation.x += 0.01;
      moonRef.current.rotation.y += 0.01;
    }

    // Alien Outer Globes: Far out, eerie rotations
    alienRefs.current.forEach((ref, index) => {
      if (ref) {
        const conf = aliens[index];
        if (conf.type !== 'spaceship') {
          // Wide orbits around the center
          ref.position.set(
            centerPos[0] + Math.sin(t * conf.speed + index * 10) * conf.radius,
            centerPos[1] + Math.cos(t * conf.speed * 0.5 + index * 10) * 5 + conf.yOffset,
            centerPos[2] + Math.cos(t * conf.speed + index * 10) * conf.radius
          );
          // Erratic, multi-axis spins
          ref.rotation.x += conf.rotSpeed[0];
          ref.rotation.y += conf.rotSpeed[1];
          ref.rotation.z += conf.rotSpeed[2];
        }
      }
    });
  });

  return (
    <>
      {/* MASSIVE SUN (Center of this system, matching orange style) */}
      <group ref={sunCenterRef} position={centerPos}>
        <mesh>
          <icosahedronGeometry args={[6.2, 2]} />
          <meshBasicMaterial color="#FF4500" />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[6.5, 2]} />
          <meshBasicMaterial color="#FFD700" wireframe transparent opacity={0.6} />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[6.8, 0]} />
          <meshBasicMaterial color="#FFA500" wireframe transparent opacity={0.3} />
        </mesh>
      </group>

      {/* ORBITING EARTH */}
      <group ref={earthOrbitRef}>
        <EarthGlobe isDark={isDark} radius={1.2} />
      </group>

      {/* THE MOON (Orbiting Earth, matching grey style) */}
      <group ref={moonRef}>
        <mesh>
          <sphereGeometry args={[0.35, 32, 32]} />
          <meshBasicMaterial color={isDark ? '#333333' : '#888888'} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshBasicMaterial color={isDark ? '#888888' : '#333333'} wireframe transparent opacity={0.6} />
        </mesh>
      </group>

      {/* ALIEN OUTER GLOBES & SPACESHIPS */}
      {aliens.map((alien, i) => {
        if (alien.type === 'spaceship') {
          return (
            <WireframeSpaceship 
              key={`alien-${i}`} 
              config={alien} 
              isDark={isDark} 
              centerPos={centerPos} 
            />
          );
        }

        return (
          <mesh key={`alien-${i}`} ref={(el) => (alienRefs.current[i] = el)}>
            {/* Complex math geometries for alien look */}
            {alien.type === 'dodecahedron' && <dodecahedronGeometry args={[2.5, 1]} />}
            {alien.type === 'octahedron' && <octahedronGeometry args={[2.0, 1]} />}
            <meshBasicMaterial color={fgColor} wireframe transparent opacity={0.15} />
          </mesh>
        );
      })}
    </>
  );
};

const SpaceBackground = () => {
  const [isDark, setIsDark] = useState(true);

  // Sync theme
  useEffect(() => {
    const root = document.documentElement;
    const updateTheme = () => setIsDark(root.classList.contains('dark'));
    
    updateTheme(); // Initial
    
    const observer = new MutationObserver(updateTheme);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed inset-0 -z-50 pointer-events-none transition-colors duration-300">
      <Canvas camera={{ position: [0, 0, 25], fov: 60 }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <Starfield isDark={isDark} />
          <CelestialSystem isDark={isDark} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default SpaceBackground;
