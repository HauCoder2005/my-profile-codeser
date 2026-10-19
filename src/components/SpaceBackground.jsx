import React, { useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

import Rocket from './three/Rocket';
import CyberGrid from './three/CyberGrid';
import SpatialDust from './three/SpatialDust';
import { PALETTE, useIsDark, usePrefersReducedMotion } from './three/theme';

const damp = THREE.MathUtils.damp;

// Shared, mutable input state read inside useFrame (supports Mouse, Touch, Mobile Gyroscope & Arcade isolation)
// Shared, mutable input state read inside useFrame (supports Mouse, Touch & Mobile Gyroscope)
const useInputRefs = () => {
  const scroll = useRef(0);
  const maxScroll = useRef(0);
  const viewportHeight = useRef(window.innerHeight);
  const viewportWidth = useRef(window.innerWidth);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onScroll = () => { scroll.current = window.scrollY; };
    const measure = () => {
      viewportWidth.current = window.innerWidth;
      viewportHeight.current = window.innerHeight;
      maxScroll.current = document.documentElement.scrollHeight - window.innerHeight;
    };
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(document.body);
    window.addEventListener('resize', measure);

    let isTouching = false;
    let touchEndTimer = null;
    let decayTimer = null;
    let hasGyro = false;

    const isInsideArcade = (e) => {
      if (typeof window !== 'undefined' && window.__arcadeActive) return true;
      const target = e?.target;
      if (target && typeof target.closest === 'function') {
        return Boolean(target.closest('#arcade') || target.closest('[data-arcade]'));
      }
      return false;
    };

    // 1. Desktop cursor / pointer move
    const onMove = (e) => {
      if (isInsideArcade(e)) {
        mouse.current.x *= 0.88;
        mouse.current.y *= 0.88;
        return;
      }
      mouse.current.x = (e.clientX / (viewportWidth.current || window.innerWidth)) * 2 - 1;
      mouse.current.y = -((e.clientY / (viewportHeight.current || window.innerHeight)) * 2 - 1);
    };

    // 2. Mobile touch pan (joystick / touch drag)
    const onTouch = (e) => {
      if (isInsideArcade(e)) {
        mouse.current.x *= 0.88;
        mouse.current.y *= 0.88;
        return;
      }
      isTouching = true;
      clearTimeout(touchEndTimer);
      clearInterval(decayTimer);
      if (e.touches && e.touches.length > 0) {
        const t = e.touches[0];
        mouse.current.x = (t.clientX / (viewportWidth.current || window.innerWidth)) * 2 - 1;
        mouse.current.y = -((t.clientY / (viewportHeight.current || window.innerHeight)) * 2 - 1);
      }
    };

    const onTouchEnd = () => {
      clearTimeout(touchEndTimer);
      clearInterval(decayTimer);
      touchEndTimer = setTimeout(() => {
        isTouching = false;
        if (!hasGyro) {
          decayTimer = setInterval(() => {
            mouse.current.x *= 0.94;
            mouse.current.y *= 0.94;
            if (Math.abs(mouse.current.x) < 0.01 && Math.abs(mouse.current.y) < 0.01) {
              mouse.current.x = 0;
              mouse.current.y = 0;
              clearInterval(decayTimer);
            }
          }, 16);
        }
      }, 300);
    };

    // 3. Mobile Gyroscope / Device Orientation
    let baseBeta = null;
    let baseGamma = null;

    const onDeviceOrientation = (e) => {
      if (e.gamma !== null || e.beta !== null) hasGyro = true;
      // When user is actively touching or arcade is active, let background float freely without gyro shaking
      if (isTouching || (typeof window !== 'undefined' && window.__arcadeActive)) return;
      if (e.gamma === null && e.beta === null) return;
      const gamma = e.gamma || 0; // Left-to-right tilt [-90, 90]
      const beta = e.beta || 0;   // Front-to-back tilt [-180, 180]

      if (baseBeta === null || baseGamma === null) {
        baseBeta = beta;
        baseGamma = gamma;
      } else {
        baseBeta += (beta - baseBeta) * 0.005;
        baseGamma += (gamma - baseGamma) * 0.005;
      }

      const deltaGamma = gamma - baseGamma;
      const deltaBeta = beta - baseBeta;

      // Sensitivity: comfortable range
      const gx = Math.max(-1.5, Math.min(1.5, deltaGamma / 12));
      const gy = Math.max(-1.5, Math.min(1.5, deltaBeta / 12));

      mouse.current.x = gx;
      mouse.current.y = -gy;
    };

    // Auto-request iOS 13+ permission on first user gesture (touch or click)
    let permissionRequested = false;
    const requestPermission = () => {
      if (permissionRequested) return;
      permissionRequested = true;
      if (
        typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function'
      ) {
        DeviceOrientationEvent.requestPermission()
          .then((state) => {
            if (state === 'granted') {
              window.addEventListener('deviceorientation', onDeviceOrientation, { passive: true });
            }
          })
          .catch(() => {});
      }
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('touchmove', onTouch, { passive: true });
    window.addEventListener('touchstart', onTouch, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('touchcancel', onTouchEnd, { passive: true });
    window.addEventListener('deviceorientation', onDeviceOrientation, { passive: true });
    window.addEventListener('deviceorientationabsolute', onDeviceOrientation, { passive: true });
    window.addEventListener('touchstart', requestPermission, { passive: true });
    window.addEventListener('touchend', requestPermission, { passive: true });
    window.addEventListener('click', requestPermission, { passive: true });

    return () => {
      clearTimeout(touchEndTimer);
      clearInterval(decayTimer);
      resizeObserver.disconnect();
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('touchstart', onTouch);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
      window.removeEventListener('deviceorientation', onDeviceOrientation);
      window.removeEventListener('deviceorientationabsolute', onDeviceOrientation);
      window.removeEventListener('touchstart', requestPermission);
      window.removeEventListener('touchend', requestPermission);
      window.removeEventListener('click', requestPermission);
    };
  }, []);

  return { scroll, maxScroll, viewportHeight, mouse };
};

// World units the camera travels per scrolled pixel: the 3D scene scrolls at ~60% of the page speed (parallax)
const unitsPerPixel = (viewportHeight) => 27 / viewportHeight.current;

// 1. Camera rig: Smooth desktop mouse parallax & comfortable Mobile Gyroscope VR camera with autonomous float
const CameraRig = ({ scroll, viewportHeight, mouse, reducedMotion, speedScale = 1 }) => {
  const floatTime = useRef(0);

  useFrame(({ camera, size }, delta) => {
    const isPortrait = size.width < size.height;
    const targetY = -scroll.current * unitsPerPixel(viewportHeight);
    const isArcadeActive = Boolean(typeof window !== 'undefined' && window.__arcadeActive);
    const mx = (reducedMotion || isArcadeActive) ? 0 : mouse.current.x;
    const my = (reducedMotion || isArcadeActive) ? 0 : mouse.current.y;

    floatTime.current += delta * (reducedMotion ? 0.25 : speedScale);
    const ft = floatTime.current;

    // Organic zero-G deep space autonomous floating drift (multi-frequency Lissajous curves)
    const floatX = Math.sin(ft * 0.42) * 1.5 + Math.cos(ft * 0.21) * 0.8;
    const floatY = Math.cos(ft * 0.36) * 1.2 + Math.sin(ft * 0.17) * 0.6;
    const floatRotY = Math.sin(ft * 0.26) * 0.025;
    const floatRotX = Math.cos(ft * 0.28) * 0.018;
    const floatRotZ = Math.sin(ft * 0.22) * 0.015;

    if (isPortrait) {
      // Mobile portrait: comfortable, immersive viewport parallax + autonomous float
      const rotYMultiplier = 0.12; // ~6.9 deg max tilt
      const rotXMultiplier = 0.09; // ~5.1 deg max tilt
      const posMultiplier = 2.8;   // comfortable 2.8 units
      const dampRate = 2.4;

      const targetX = mx * posMultiplier + floatX * 0.7;
      const targetCamY = targetY + my * 1.6 + floatY * 0.7;
      const targetZ = 24.5;

      camera.position.x = damp(camera.position.x, targetX, dampRate, delta);
      camera.position.y = damp(camera.position.y, targetCamY, dampRate, delta);
      camera.position.z = damp(camera.position.z, targetZ, dampRate, delta);

      camera.rotation.y = damp(camera.rotation.y, -mx * rotYMultiplier + floatRotY, dampRate, delta);
      camera.rotation.x = damp(camera.rotation.x, my * rotXMultiplier + floatRotX, dampRate, delta);
      camera.rotation.z = damp(camera.rotation.z, floatRotZ, dampRate, delta);
    } else {
      // Desktop cursor: buttery smooth, cinematic parallax + autonomous float
      const posMultiplier = 3.6;
      const rotYMultiplier = 0.13;
      const rotXMultiplier = 0.08;
      const dampRate = 2.4;

      const targetX = mx * posMultiplier + floatX;
      const targetCamY = targetY + my * 1.5 + floatY;
      const targetZ = 24.5;

      camera.position.x = damp(camera.position.x, targetX, dampRate, delta);
      camera.position.y = damp(camera.position.y, targetCamY, dampRate, delta);
      camera.position.z = damp(camera.position.z, targetZ, dampRate, delta);

      camera.rotation.y = damp(camera.rotation.y, -mx * rotYMultiplier + floatRotY, dampRate, delta);
      camera.rotation.x = damp(camera.rotation.x, my * rotXMultiplier + floatRotX, dampRate, delta);
      camera.rotation.z = damp(camera.rotation.z, floatRotZ, dampRate, delta);
    }
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

const Starfield = ({ palette, reducedMotion, speedScale = 1 }) => {
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
    const speed = reducedMotion ? 0.2 : speedScale;
    uniforms.uTime.value += delta * speed;
    const points = pointsRef.current;
    if (!points) return;
    points.position.y = camera.position.y * 0.85;
    points.rotation.y += delta * 0.035 * speed;
    points.rotation.x += delta * 0.015 * speed;
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
      Math.cos(t * Math.abs(speed) * 0.6 + orbitOffset) * 6 + yOffset + c.y,
      Math.cos(angle) * radius + c.z
    );
  };

  useFrame((_, delta) => {
    time.current += delta * speedScale;
    const group = groupRef.current;
    if (!group) return;
    pathAt(time.current, group.position);
    // Nose points along the flight path, then bank for dynamic space flight
    group.lookAt(pathAt(time.current + 0.1, ahead));
    group.rotateZ(bankAngle);
    if (fireRef.current) fireRef.current.scale.y = 1 + Math.sin(time.current * 16) * 0.35;
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
  const earthMap = useMemo(() => {
    const loader = new THREE.TextureLoader();
    return loader.load('/images/earth-map.jpg');
  }, []);

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
  { type: 'dodecahedron', radius: 28, speed: 0.18, yOffset: 7, rotSpeed: [0.9, 1.4, 0.6] },
  { type: 'spaceship', radius: 36, speed: 0.24, yOffset: -8, orbitOffset: 0, bankAngle: -Math.PI / 4 },
  { type: 'octahedron', radius: 24, speed: 0.20, yOffset: 12, rotSpeed: [1.4, 0.8, 0.9] },
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

const EARTH_ORBIT = 13.5;
const SUN_DEPTH = -30;
const SUN_LOOP_SECONDS = 32; // visible and lively orbit across the sky
const SUN_START_ANGLE = Math.PI * 0.75;

const CelestialSystem = ({ palette, isDark, speedScale }) => {
  const { size } = useThree();
  const aspect = size.width / size.height;

  // The sun travels a wide loop around the whole screen and follows the camera with depth parallax lag
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

    // Visible half-size of the screen at the sun's depth
    const halfHeight = Math.tan(Math.PI / 6) * (camera.position.z - SUN_DEPTH);
    const halfWidth = halfHeight * aspect;
    const a = SUN_START_ANGLE - (t / SUN_LOOP_SECONDS) * Math.PI * 2;

    // True 3D depth parallax relative to camera:
    // camera.position.x * 0.35 gives 65% depth parallax separation from camera
    // camera.position.y * 0.85 gently drifts past all sections as you scroll
    center.set(
      camera.position.x * 0.35 + Math.cos(a) * halfWidth * 0.72 + Math.sin(t * 0.22) * 2.5,
      camera.position.y * 0.85 + Math.sin(a) * halfHeight * 0.65 + Math.cos(t * 0.18) * 2.0,
      SUN_DEPTH
    );

    if (sunRef.current) {
      sunRef.current.position.copy(center);
      // Gentle breathing scale and lively multi-axis wireframe spin
      const baseScale = (aspect < 1 ? 0.6 : 1.0) * (1 + Math.sin(t * 1.5) * 0.03);
      sunRef.current.scale.setScalar(baseScale);
      sunRef.current.rotation.y += step * 0.22;
      sunRef.current.rotation.x += step * 0.07;
      sunRef.current.rotation.z += step * 0.04;
    }

    let ex = 0, ey = 0, ez = 0;
    if (earthRef.current) {
      ex = center.x + Math.sin(t * 0.24) * EARTH_ORBIT;
      ey = center.y + Math.cos(t * 0.2) * 5.5;
      ez = center.z + Math.cos(t * 0.24) * EARTH_ORBIT;
      earthRef.current.position.set(ex, ey, ez);
      earthRef.current.rotation.y += step * 0.55;
      earthRef.current.rotation.x = Math.sin(t * 0.15) * 0.18;
    }

    if (moonRef.current) {
      moonRef.current.position.set(
        ex + Math.sin(t * 1.1) * 2.6,
        ey + Math.sin(t * 0.85) * 0.8,
        ez + Math.cos(t * 1.1) * 2.6
      );
      moonRef.current.rotation.y += step * 1.1;
    }

    alienRefs.current.forEach((mesh, i) => {
      const conf = ALIENS[i];
      if (!mesh || conf.type === 'spaceship') return;
      mesh.position.set(
        center.x + Math.sin(t * conf.speed + i * 10) * conf.radius,
        center.y + Math.cos(t * conf.speed * 0.5 + i * 10) * 6 + conf.yOffset,
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
//    so every section has something drifting past as you scroll. Each piece wanders on its own
//    slow loop. The layout is rolled once: resizing only rescales it, so pieces never jump around.
const DEBRIS_GEOMETRIES = [
  new THREE.IcosahedronGeometry(1.4, 0),
  new THREE.OctahedronGeometry(1.2, 0),
  new THREE.TetrahedronGeometry(1.3, 0),
  new THREE.TorusGeometry(1, 0.3, 6, 12),
  new THREE.DodecahedronGeometry(1.2, 0),
];

const Debris = ({ palette, speedScale }) => {
  const groupRef = useRef();
  const time = useRef(0);
  const items = useMemo(() => Array.from({ length: 24 }, (_, i) => ({
    geometry: DEBRIS_GEOMETRIES[i % DEBRIS_GEOMETRIES.length],
    side: i % 2 === 0 ? 1 : -1,
    edge: 0.52 + Math.random() * 0.42, // comfortably placed in margin windows
    y: -18 - i * 9.5 - Math.random() * 5,
    z: -4 - Math.random() * 20,
    scale: 0.7 + Math.random() * 1.1,
    spin: [
      (Math.random() > 0.5 ? 1 : -1) * (0.5 + Math.random() * 0.8),
      (Math.random() > 0.5 ? 1 : -1) * (0.6 + Math.random() * 0.9),
      (Math.random() > 0.5 ? 1 : -1) * (0.3 + Math.random() * 0.5),
    ],
    // Free drift: 3D Lissajous floating motion
    drift: [2.5 + Math.random() * 2.5, 2.8 + Math.random() * 2.8, 1.8 + Math.random() * 1.8],
    driftSpeed: [0.32 + Math.random() * 0.32, 0.26 + Math.random() * 0.28, 0.2 + Math.random() * 0.25],
    phase: Math.random() * Math.PI * 2,
  })), []);

  useFrame(({ size, camera }, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const step = delta * speedScale;
    time.current += step;
    const t = time.current;
    const aspect = size.width / size.height;

    // React to camera horizontal motion with gentle depth parallax
    const camLagX = camera.position.x * 0.22;

    group.children.forEach((mesh, i) => {
      const item = items[i];
      const halfWidth = Math.tan(Math.PI / 6) * (25 - item.z) * aspect;
      mesh.position.set(
        item.side * halfWidth * item.edge + Math.sin(t * item.driftSpeed[0] + item.phase) * item.drift[0] + camLagX,
        item.y + Math.sin(t * item.driftSpeed[1] + item.phase * 1.6) * item.drift[1],
        item.z + Math.cos(t * item.driftSpeed[2] + item.phase) * item.drift[2]
      );
      mesh.rotation.x += item.spin[0] * step;
      mesh.rotation.y += item.spin[1] * step;
      mesh.rotation.z += item.spin[2] * step;
    });
  });

  return (
    <group ref={groupRef}>
      {items.map((item, i) => (
        <mesh key={i} geometry={item.geometry} scale={item.scale}>
          <meshBasicMaterial color={palette.fg} wireframe transparent opacity={0.22} />
        </mesh>
      ))}
    </group>
  );
};

// 7. Ringed planet waiting at the bottom of the page (next to the contact section)
const RingedPlanet = ({ palette, isDark, speedScale, maxScroll, viewportHeight }) => {
  const ref = useRef();
  const time = useRef(0);
  const { size } = useThree();
  const isPortrait = size.width < size.height;
  const baseX = -Math.tan(Math.PI / 6) * 47 * (size.width / size.height) * (isPortrait ? 0.92 : 0.72);

  useFrame((_, delta) => {
    const planet = ref.current;
    if (!planet) return;
    const s = delta * speedScale;
    time.current += s;
    const t = time.current;
    const targetY = -maxScroll.current * unitsPerPixel(viewportHeight) - 6;
    planet.position.set(
      baseX + Math.sin(t * 0.35) * 2.0,
      targetY + Math.cos(t * 0.28) * 1.6,
      -22 + Math.sin(t * 0.22) * 1.8
    );
    planet.rotation.y += s * 0.16;
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
  const { scroll, maxScroll, viewportHeight, mouse } = useInputRefs();
  const palette = isDark ? PALETTE.dark : PALETTE.light;
  const speedScale = reducedMotion ? 0.15 : 1;

  return (
    <div className="fixed inset-0 -z-50 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 24.5], fov: 68 }}
        dpr={[1, 1.25]}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance', stencil: false }}
      >
        <fog attach="fog" args={[palette.bg, 32, 130]} />
        <ambientLight intensity={isDark ? 1.4 : 1.1} />
        <directionalLight position={[12, 18, 14]} intensity={isDark ? 1.5 : 1.1} />
        <CameraRig scroll={scroll} viewportHeight={viewportHeight} mouse={mouse} reducedMotion={reducedMotion} speedScale={speedScale} />
        <CyberGrid palette={palette} isDark={isDark} scroll={scroll} speedScale={speedScale} />
        <SpatialDust palette={palette} isDark={isDark} speedScale={speedScale} />
        <Starfield palette={palette} reducedMotion={reducedMotion} speedScale={speedScale} />
        <CelestialSystem palette={palette} isDark={isDark} speedScale={speedScale} />
        <Debris palette={palette} speedScale={speedScale} />
        <RingedPlanet palette={palette} isDark={isDark} speedScale={speedScale} maxScroll={maxScroll} viewportHeight={viewportHeight} />
      </Canvas>
    </div>
  );
};

export default SpaceBackground;
