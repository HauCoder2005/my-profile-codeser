import React, { useEffect, useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture, AdaptiveDpr } from '@react-three/drei';
import * as THREE from 'three';
import Rocket from './three/Rocket';
import { PALETTE, useIsDark, usePrefersReducedMotion } from './three/theme';

const damp = THREE.MathUtils.damp;

// Shared, mutable input state read inside useFrame (no React re-renders on scroll/mouse)
const useInputRefs = () => {
  const scroll = useRef(0);
  const maxScroll = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onScroll = () => { scroll.current = window.scrollY; };
    // Cached so useFrame never forces a layout read
    const measure = () => {
      maxScroll.current = document.documentElement.scrollHeight - window.innerHeight;
    };
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(document.body);
    window.addEventListener('resize', measure);
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return { scroll, maxScroll, mouse };
};

// World units the camera travels per scrolled pixel: the 3D scene scrolls at ~60% of the page speed (parallax)
const unitsPerPixel = () => 27 / window.innerHeight;

// 1. Camera rig: follows the scroll position and leans toward the cursor
const CameraRig = ({ scroll, mouse, reducedMotion }) => {
  useFrame(({ camera }, delta) => {
    const targetY = -scroll.current * unitsPerPixel();
    const mx = reducedMotion ? 0 : mouse.current.x;
    const my = reducedMotion ? 0 : mouse.current.y;

    camera.position.x = damp(camera.position.x, mx * 1.5, 2.5, delta);
    camera.position.y = damp(camera.position.y, targetY + my * 1.0, 4, delta);
    camera.rotation.y = damp(camera.rotation.y, -mx * 0.04, 2.5, delta);
    camera.rotation.x = damp(camera.rotation.x, my * 0.03, 2.5, delta);
  });
  return null;
};

// 2. Twinkling starfield (custom shader: per-star size + phase). Follows the camera at 85% so it feels far away.
const STAR_COUNT = 1800;

const starVertex = `
  attribute float aScale;
  attribute float aPhase;
  uniform float uTime;
  uniform float uPixelRatio;
  varying float vTwinkle;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    vTwinkle = 0.55 + 0.45 * sin(uTime * (0.6 + aPhase * 1.4) + aPhase * 6.2831);
    // Clamp so stars passing close to the camera don't balloon into big blurry discs
    gl_PointSize = min(aScale * uPixelRatio * (110.0 / -mv.z), 4.0 * uPixelRatio);
  }
`;

const starFragment = `
  uniform vec3 uColor;
  varying float vTwinkle;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.05, d) * vTwinkle;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

const Starfield = ({ palette, reducedMotion }) => {
  const pointsRef = useRef();

  const { positions, scales, phases } = useMemo(() => {
    const positions = new Float32Array(STAR_COUNT * 3);
    const scales = new Float32Array(STAR_COUNT);
    const phases = new Float32Array(STAR_COUNT);
    for (let i = 0; i < STAR_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
      // Mostly tiny stars, a few bright ones
      scales[i] = Math.random() < 0.06 ? 2.2 + Math.random() : 0.6 + Math.random() * 0.9;
      phases[i] = Math.random();
    }
    return { positions, scales, phases };
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    uColor: { value: new THREE.Color() },
  }), []);

  useEffect(() => {
    uniforms.uColor.value.set(palette.fg);
  }, [palette, uniforms]);

  useFrame(({ camera }, delta) => {
    const speed = reducedMotion ? 0.2 : 1;
    uniforms.uTime.value += delta * speed;
    const points = pointsRef.current;
    if (!points) return;
    points.position.y = camera.position.y * 0.85;
    points.rotation.y += delta * 0.012 * speed;
    points.rotation.x += delta * 0.004 * speed;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
      </bufferGeometry>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={starVertex}
        fragmentShader={starFragment}
        transparent
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
};

// 3. Rocket orbiting the sun
const WireframeSpaceship = ({ palette, config, centerRef, speedScale }) => {
  const groupRef = useRef();
  const fireRef = useRef();
  const time = useRef(0);
  const ahead = useMemo(() => new THREE.Vector3(), []);
  const { radius, speed, yOffset, orbitOffset, bankAngle } = config;

  const pathAt = (t, target) => {
    const c = centerRef.current;
    const angle = t * speed + orbitOffset;
    return target.set(
      Math.sin(angle) * radius + c.x,
      Math.cos(t * Math.abs(speed) * 0.5 + orbitOffset) * 5 + yOffset + c.y,
      Math.cos(angle) * radius + c.z
    );
  };

  useFrame((_, delta) => {
    time.current += delta * speedScale;
    const group = groupRef.current;
    if (!group) return;
    pathAt(time.current, group.position);
    // Nose points along the flight path, then bank for a bit of drama
    group.lookAt(pathAt(time.current + 0.1, ahead));
    group.rotateZ(bankAngle);
    if (fireRef.current) fireRef.current.scale.y = 1 + Math.sin(time.current * 12) * 0.25;
  });

  return (
    <group ref={groupRef}>
      <group rotation={[Math.PI / 2, 0, 0]}>
        <Rocket palette={palette} fireRef={fireRef} />
      </group>
    </group>
  );
};

// 4. Earth: continents shader + lat/long grid + fresnel atmosphere
const earthVertex = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const earthFragment = `
  uniform sampler2D map;
  uniform vec3 color;
  varying vec2 vUv;
  void main() {
    vec4 texColor = texture2D(map, vUv);
    // Specular map: oceans are light, land is dark
    float luminance = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
    float isLand = luminance < 0.5 ? 1.0 : 0.0;
    gl_FragColor = vec4(color, isLand);
  }
`;

const atmosphereVertex = `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const atmosphereFragment = `
  uniform vec3 uColor;
  uniform float uStrength;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float rim = pow(1.0 - max(dot(vNormal, vView), 0.0), 2.5);
    gl_FragColor = vec4(uColor, rim * uStrength);
  }
`;

const EarthGlobe = ({ palette, isDark, radius }) => {
  const earthMap = useTexture('/images/earth-map.jpg');

  const landUniforms = useMemo(() => ({
    map: { value: earthMap },
    color: { value: new THREE.Color() },
  }), [earthMap]);

  const atmosphereUniforms = useMemo(() => ({
    uColor: { value: new THREE.Color() },
    uStrength: { value: 1 },
  }), []);

  useEffect(() => {
    landUniforms.color.value.set(palette.fg);
    atmosphereUniforms.uColor.value.set(palette.atmosphere);
    atmosphereUniforms.uStrength.value = isDark ? 1.2 : 0.5;
  }, [palette, isDark, landUniforms, atmosphereUniforms]);

  return (
    <group>
      <mesh>
        <sphereGeometry args={[radius * 0.98, 32, 32]} />
        <meshBasicMaterial color={palette.bg} />
      </mesh>
      <mesh rotation={[0, -Math.PI / 2, 0]}>
        <sphereGeometry args={[radius * 0.99, 48, 48]} />
        <shaderMaterial transparent uniforms={landUniforms} vertexShader={earthVertex} fragmentShader={earthFragment} />
      </mesh>
      <mesh>
        <sphereGeometry args={[radius, 18, 18]} />
        <meshBasicMaterial color={palette.fg} wireframe transparent opacity={0.5} />
      </mesh>
      <mesh scale={1.18}>
        <sphereGeometry args={[radius, 32, 32]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
          uniforms={atmosphereUniforms}
          vertexShader={atmosphereVertex}
          fragmentShader={atmosphereFragment}
        />
      </mesh>
    </group>
  );
};

// 5. Sun + Earth + Moon + alien bodies. Placed top-right of the hero (peeking around the portrait)
//    so it never sits behind the headline, then scrolls away with the camera.
const ALIENS = [
  { type: 'dodecahedron', radius: 35, speed: 0.03, yOffset: 8, rotSpeed: [0.6, 1.2, 0.3] },
  { type: 'spaceship', radius: 42, speed: 0.05, yOffset: -10, orbitOffset: 0, bankAngle: -Math.PI / 4 },
  { type: 'octahedron', radius: 30, speed: 0.04, yOffset: 15, rotSpeed: [1.2, 0.6, 0.6] },
];

// Soft radial-gradient texture for cheap glow sprites (a full-screen bloom pass was ~6x slower)
const glowTexture = (() => {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.25, 'rgba(255,255,255,0.45)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
})();

const Glow = ({ color, scale, opacity, isDark }) => (
  <sprite scale={scale}>
    <spriteMaterial
      map={glowTexture}
      color={color}
      transparent
      opacity={isDark ? opacity : opacity * 0.6}
      depthWrite={false}
      blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
      toneMapped={false}
    />
  </sprite>
);

const EARTH_ORBIT = 12;
const SUN_DEPTH = -30;
const SUN_LOOP_SECONDS = 45; // one lap around the screen
const SUN_START_ANGLE = Math.PI * 0.75; // start near the top-left, then travel clockwise

const CelestialSystem = ({ palette, isDark, speedScale }) => {
  const { size } = useThree();
  const aspect = size.width / size.height;

  // The sun travels a wide loop around the whole screen and follows the camera as you scroll,
  // so it (with Earth, Moon and the orbiting bodies) drifts past every section.
  const center = useMemo(() => new THREE.Vector3(), []);
  const centerRef = useRef(center);

  const sunRef = useRef();
  const earthRef = useRef();
  const moonRef = useRef();
  const alienRefs = useRef([]);
  const time = useRef(0);

  useFrame(({ camera }, delta) => {
    const step = delta * speedScale;
    time.current += step;
    const t = time.current;

    // Visible half-size of the screen at the sun's depth; the loop covers most of it
    const halfHeight = Math.tan(Math.PI / 6) * (camera.position.z - SUN_DEPTH);
    const halfWidth = halfHeight * aspect;
    const a = SUN_START_ANGLE - (t / SUN_LOOP_SECONDS) * Math.PI * 2;
    center.set(
      camera.position.x + Math.cos(a) * halfWidth * 0.8,
      camera.position.y + Math.sin(a) * halfHeight * 0.7 + Math.sin(a * 2) * halfHeight * 0.08,
      SUN_DEPTH
    );

    if (sunRef.current) {
      sunRef.current.position.copy(center);
      // Smaller on narrow (portrait) screens so it doesn't swallow the text
      sunRef.current.scale.setScalar(aspect < 1 ? 0.55 : 1);
      sunRef.current.rotation.y += step * 0.12;
      sunRef.current.rotation.x += step * 0.03;
    }

    let ex = 0, ey = 0, ez = 0;
    if (earthRef.current) {
      ex = center.x + Math.sin(t * 0.1) * EARTH_ORBIT;
      ey = center.y + Math.sin(t * 0.1) * 5;
      ez = center.z + Math.cos(t * 0.1) * EARTH_ORBIT;
      earthRef.current.position.set(ex, ey, ez);
      earthRef.current.rotation.y += step * 0.3;
    }

    if (moonRef.current) {
      moonRef.current.position.set(ex + Math.sin(t * 0.5) * 2.2, ey - Math.cos(t * 0.5) * 0.5, ez + Math.cos(t * 0.5) * 2.2);
      moonRef.current.rotation.y += step * 0.6;
    }

    alienRefs.current.forEach((mesh, i) => {
      const conf = ALIENS[i];
      if (!mesh || conf.type === 'spaceship') return;
      mesh.position.set(
        center.x + Math.sin(t * conf.speed + i * 10) * conf.radius,
        center.y + Math.cos(t * conf.speed * 0.5 + i * 10) * 5 + conf.yOffset,
        center.z + Math.cos(t * conf.speed + i * 10) * conf.radius
      );
      mesh.rotation.x += step * conf.rotSpeed[0];
      mesh.rotation.y += step * conf.rotSpeed[1];
      mesh.rotation.z += step * conf.rotSpeed[2];
    });
  });

  return (
    <>
      <group ref={sunRef}>
        <Glow color="#ff5a1f" scale={22} opacity={0.4} isDark={isDark} />
        <mesh>
          <icosahedronGeometry args={[6.2, 2]} />
          <meshBasicMaterial color="#ff4500" toneMapped={false} />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[6.5, 2]} />
          <meshBasicMaterial color="#ffd700" wireframe transparent opacity={0.6} toneMapped={false} />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[6.8, 0]} />
          <meshBasicMaterial color="#ffa500" wireframe transparent opacity={0.3} />
        </mesh>
      </group>

      <group ref={earthRef}>
        <EarthGlobe palette={palette} isDark={isDark} radius={1.2} />
      </group>

      <group ref={moonRef}>
        <mesh>
          <sphereGeometry args={[0.35, 24, 24]} />
          <meshBasicMaterial color={palette.moonCore} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshBasicMaterial color={palette.moonWire} wireframe transparent opacity={0.6} />
        </mesh>
      </group>

      {ALIENS.map((alien, i) =>
        alien.type === 'spaceship' ? (
          <WireframeSpaceship key={i} config={alien} palette={palette} centerRef={centerRef} speedScale={speedScale} />
        ) : (
          <mesh key={i} ref={(el) => (alienRefs.current[i] = el)}>
            {alien.type === 'dodecahedron' && <dodecahedronGeometry args={[2.5, 1]} />}
            {alien.type === 'octahedron' && <octahedronGeometry args={[2.0, 1]} />}
            <meshBasicMaterial color={palette.fg} wireframe transparent opacity={0.15} />
          </mesh>
        )
      )}
    </>
  );
};

// 6. Wireframe debris scattered along the scroll path, mostly in the side margins,
//    so every section has something drifting past as you scroll.
const DEBRIS_GEOMETRIES = [
  new THREE.IcosahedronGeometry(1.4, 0),
  new THREE.OctahedronGeometry(1.2, 0),
  new THREE.TetrahedronGeometry(1.3, 0),
  new THREE.TorusGeometry(1, 0.3, 6, 12),
  new THREE.DodecahedronGeometry(1.2, 0),
];

const Debris = ({ palette, speedScale }) => {
  const groupRef = useRef();
  const { size } = useThree();
  const aspect = size.width / size.height;
  const items = useMemo(() => Array.from({ length: 18 }, (_, i) => {
    const side = i % 2 === 0 ? 1 : -1;
    const z = -6 - Math.random() * 18;
    // Half the visible width at this depth (camera at z=25, fov 60) -> hug the screen edges
    const halfWidth = Math.tan(Math.PI / 6) * (25 - z) * aspect;
    return {
      geometry: DEBRIS_GEOMETRIES[i % DEBRIS_GEOMETRIES.length],
      position: [side * halfWidth * (0.88 + Math.random() * 0.15), -28 - i * 11 - Math.random() * 6, z],
      scale: 0.6 + Math.random() * 1.1,
      spin: [(Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 0.3],
      bob: Math.random() * Math.PI * 2,
    };
  }), [aspect]);

  useFrame(({ clock }, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const step = delta * speedScale;
    group.children.forEach((mesh, i) => {
      const item = items[i];
      mesh.rotation.x += item.spin[0] * step;
      mesh.rotation.y += item.spin[1] * step;
      mesh.rotation.z += item.spin[2] * step;
      mesh.position.y = item.position[1] + Math.sin(clock.elapsedTime * 0.4 * speedScale + item.bob) * 0.6;
    });
  });

  return (
    <group ref={groupRef}>
      {items.map((item, i) => (
        <mesh key={i} geometry={item.geometry} position={item.position} scale={item.scale}>
          <meshBasicMaterial color={palette.fg} wireframe transparent opacity={0.18} />
        </mesh>
      ))}
    </group>
  );
};

// 7. Ringed planet waiting at the bottom of the page (next to the contact section)
const RingedPlanet = ({ palette, isDark, speedScale, maxScroll }) => {
  const ref = useRef();
  const { size } = useThree();
  const isPortrait = size.width < size.height;
  // Left edge of the screen at the planet's depth (camera z=25 -> planet z=-22)
  const x = -Math.tan(Math.PI / 6) * 47 * (size.width / size.height) * (isPortrait ? 0.95 : 0.75);

  useFrame((_, delta) => {
    const planet = ref.current;
    if (!planet) return;
    // Sit just below the camera's final resting point, on the left side
    planet.position.set(x, -maxScroll.current * unitsPerPixel() - 6, -22);
    planet.rotation.y += delta * 0.08 * speedScale;
  });

  return (
    <group ref={ref} rotation={[0.35, 0, 0.25]}>
      <Glow color="#ff6a2b" scale={26} opacity={0.25} isDark={isDark} />
      <mesh>
        <icosahedronGeometry args={[5, 2]} />
        <meshBasicMaterial color={palette.bg} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[5.05, 2]} />
        <meshBasicMaterial color={palette.fg} wireframe transparent opacity={0.35} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[7, 10, 64, 3]} />
        <meshBasicMaterial color="#ff7a2f" wireframe transparent opacity={0.6} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
    </group>
  );
};

const SpaceBackground = () => {
  const isDark = useIsDark();
  const reducedMotion = usePrefersReducedMotion();
  const { scroll, maxScroll, mouse } = useInputRefs();
  const palette = isDark ? PALETTE.dark : PALETTE.light;
  const speedScale = reducedMotion ? 0.15 : 1;

  return (
    <div className="fixed inset-0 -z-50 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 25], fov: 60 }}
        dpr={[1, 1.75]}
        performance={{ min: 0.5 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <AdaptiveDpr pixelated={false} />
        <CameraRig scroll={scroll} mouse={mouse} reducedMotion={reducedMotion} />
        <Suspense fallback={null}>
          <Starfield palette={palette} reducedMotion={reducedMotion} />
          <CelestialSystem palette={palette} isDark={isDark} speedScale={speedScale} />
          <Debris palette={palette} speedScale={speedScale} />
          <RingedPlanet palette={palette} isDark={isDark} speedScale={speedScale} maxScroll={maxScroll} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default SpaceBackground;
