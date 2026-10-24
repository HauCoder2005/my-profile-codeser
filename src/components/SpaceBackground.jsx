import React, { useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

import Rocket from './three/Rocket';
import CyberGrid from './three/CyberGrid';
import SpatialDust from './three/SpatialDust';
import { PALETTE, useIsDark, usePrefersReducedMotion } from './three/theme';

const damp = THREE.MathUtils.damp;

// Shared, mutable input state read inside useFrame (supports Desktop Mouse, Mobile Touch & Gyroscope without scroll stutter)
const useInputRefs = () => {
  const scroll = useRef(typeof window !== 'undefined' ? window.scrollY : 0);
  const maxScroll = useRef(0);
  const viewportHeight = useRef(typeof window !== 'undefined' ? window.innerHeight : 800);
  const viewportWidth = useRef(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const mouse = useRef({ x: 0, y: 0 });
  const targetInput = useRef({ x: 0, y: 0 });
  const gyroInput = useRef({ x: 0, y: 0, active: false });
  const touchDelta = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const onScroll = () => {
      scroll.current = window.scrollY;
    };

    let lastWidth = window.innerWidth;
    const measure = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      viewportWidth.current = w;
      // Mobile browsers show/hide the address bar while scrolling, changing innerHeight.
      // Only update viewportHeight when width also changes (orientation change or desktop resize)
      // so the 3D scene never jumps mid-scroll on mobile.
      if (Math.abs(w - lastWidth) > 1) {
        lastWidth = w;
        viewportHeight.current = h;
      }
      maxScroll.current = Math.max(0, document.documentElement.scrollHeight - h);
    };

    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(document.body);
    window.addEventListener('resize', measure, { passive: true });

    const isInsideArcade = (e) => {
      if (typeof window !== 'undefined' && window.__arcadeActive) return true;
      const target = e?.target;
      if (target && typeof target.closest === 'function') {
        return Boolean(target.closest('#arcade') || target.closest('[data-arcade]'));
      }
      return false;
    };

    // 1. Desktop cursor move (ignore touch pointers so mobile scrolling never snaps camera)
    const onPointerMove = (e) => {
      if (e.pointerType === 'touch') return;
      if (isInsideArcade(e)) {
        targetInput.current.x = 0;
        targetInput.current.y = 0;
        return;
      }
      const w = viewportWidth.current || window.innerWidth;
      const h = viewportHeight.current || window.innerHeight;
      targetInput.current.x = (e.clientX / w) * 2 - 1;
      targetInput.current.y = -((e.clientY / h) * 2 - 1);
    };

    // 2. Mobile touch: track smooth relative drag delta instead of jumping to raw screen coordinates
    let lastTouchX = null;
    let lastTouchY = null;

    const onTouchStart = (e) => {
      if (isInsideArcade(e)) {
        touchDelta.current.active = false;
        return;
      }
      if (e.touches && e.touches.length > 0) {
        lastTouchX = e.touches[0].clientX;
        lastTouchY = e.touches[0].clientY;
        touchDelta.current.active = true;
      }
    };

    const onTouchMove = (e) => {
      if (isInsideArcade(e) || !e.touches || e.touches.length === 0) return;
      const t = e.touches[0];
      if (lastTouchX !== null && lastTouchY !== null) {
        const w = viewportWidth.current || window.innerWidth;
        const h = viewportHeight.current || window.innerHeight;
        const dx = (t.clientX - lastTouchX) / w;
        const dy = (t.clientY - lastTouchY) / h;
        // Subtle horizontal/vertical sway that never fights page scrolling
        touchDelta.current.x = Math.max(-1, Math.min(1, touchDelta.current.x + dx * 1.6));
        touchDelta.current.y = Math.max(-0.6, Math.min(0.6, touchDelta.current.y - dy * 0.6));
      }
      lastTouchX = t.clientX;
      lastTouchY = t.clientY;
    };

    const onTouchEnd = () => {
      lastTouchX = null;
      lastTouchY = null;
      touchDelta.current.active = false;
    };

    // 3. Mobile Gyroscope / Device Orientation with smooth auto-calibrating baseline
    let baseBeta = null;
    let baseGamma = null;

    const onDeviceOrientation = (e) => {
      if (typeof window !== 'undefined' && window.__arcadeActive) return;
      if (e.gamma === null && e.beta === null) return;
      gyroInput.current.active = true;
      const gamma = e.gamma || 0;
      const beta = e.beta || 0;

      if (baseBeta === null || baseGamma === null) {
        baseBeta = beta;
        baseGamma = gamma;
      } else {
        baseBeta += (beta - baseBeta) * 0.008;
        baseGamma += (gamma - baseGamma) * 0.008;
      }

      const deltaGamma = gamma - baseGamma;
      const deltaBeta = beta - baseBeta;

      gyroInput.current.x = Math.max(-1.2, Math.min(1.2, deltaGamma / 15));
      gyroInput.current.y = -Math.max(-1.0, Math.min(1.0, deltaBeta / 15));
    };

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
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('touchcancel', onTouchEnd, { passive: true });
    window.addEventListener('deviceorientation', onDeviceOrientation, { passive: true });
    window.addEventListener('deviceorientationabsolute', onDeviceOrientation, { passive: true });
    window.addEventListener('touchstart', requestPermission, { passive: true });
    window.addEventListener('click', requestPermission, { passive: true });

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
      window.removeEventListener('deviceorientation', onDeviceOrientation);
      window.removeEventListener('deviceorientationabsolute', onDeviceOrientation);
      window.removeEventListener('touchstart', requestPermission);
      window.removeEventListener('click', requestPermission);
    };
  }, []);

  return { scroll, maxScroll, viewportHeight, mouse, targetInput, gyroInput, touchDelta };
};

// World units the camera travels per scrolled pixel: the 3D scene scrolls at ~60% of the page speed (parallax)
const unitsPerPixel = (viewportHeight) => 27 / (viewportHeight.current || 800);

// 1. Camera rig: Buttery-smooth scroll tracking + Desktop mouse parallax + Mobile gyro/touch + autonomous zero-G float
const CameraRig = ({ scroll, viewportHeight, mouse, targetInput, gyroInput, touchDelta, reducedMotion, speedScale = 1 }) => {
  const floatTime = useRef(0);
  const smoothDt = useRef(1 / 60);

  useFrame(({ camera, size }, delta) => {
    const rawDt = Math.min(delta, 0.05);
    smoothDt.current += (rawDt - smoothDt.current) * 0.25;
    const dt = smoothDt.current;

    const isPortrait = size.width < size.height;
    const isArcadeActive = Boolean(typeof window !== 'undefined' && window.__arcadeActive);

    // Smoothly decay mobile touch offset inside the frame loop (no setInterval jitter)
    if (!touchDelta.current.active) {
      touchDelta.current.x = damp(touchDelta.current.x, 0, 3.5, dt);
      touchDelta.current.y = damp(touchDelta.current.y, 0, 3.5, dt);
    }

    // Combine desktop pointer, mobile gyro, and touch sway smoothly
    let desiredX = targetInput.current.x;
    let desiredY = targetInput.current.y;
    if (isPortrait) {
      desiredX = (gyroInput.current.active ? gyroInput.current.x : 0) + touchDelta.current.x;
      desiredY = (gyroInput.current.active ? gyroInput.current.y : 0) + touchDelta.current.y;
    }
    if (reducedMotion || isArcadeActive) {
      desiredX = 0;
      desiredY = 0;
    }

    mouse.current.x = damp(mouse.current.x, desiredX, 4.5, dt);
    mouse.current.y = damp(mouse.current.y, desiredY, 4.5, dt);

    const mx = mouse.current.x;
    const my = mouse.current.y;
    const targetY = -scroll.current * unitsPerPixel(viewportHeight);

    floatTime.current += dt * (reducedMotion ? 0.2 : speedScale);
    const ft = floatTime.current;

    // Gentle zero-G camera breathing so the whole space feels weightless
    const floatX = Math.sin(ft * 0.35) * 1.1 + Math.cos(ft * 0.18) * 0.55;
    const floatY = Math.cos(ft * 0.29) * 0.85 + Math.sin(ft * 0.15) * 0.45;
    const floatRotY = Math.sin(ft * 0.22) * 0.018;
    const floatRotX = Math.cos(ft * 0.24) * 0.014;
    const floatRotZ = Math.sin(ft * 0.19) * 0.01;

    if (isPortrait) {
      const posMultiplier = 2.2;
      const rotYMultiplier = 0.09;
      const rotXMultiplier = 0.065;

      const targetX = mx * posMultiplier + floatX * 0.65;
      const targetCamY = targetY + my * 1.1 + floatY * 0.65;

      camera.position.x = damp(camera.position.x, targetX, 3.2, dt);
      camera.position.y = damp(camera.position.y, targetCamY, 4.5, dt);
      camera.position.z = damp(camera.position.z, 24.5, 3.2, dt);

      camera.rotation.y = damp(camera.rotation.y, -mx * rotYMultiplier + floatRotY, 3.2, dt);
      camera.rotation.x = damp(camera.rotation.x, my * rotXMultiplier + floatRotX, 3.2, dt);
      camera.rotation.z = damp(camera.rotation.z, floatRotZ, 3.2, dt);
    } else {
      const posMultiplier = 2.8;
      const rotYMultiplier = 0.095;
      const rotXMultiplier = 0.06;

      const targetX = mx * posMultiplier + floatX;
      const targetCamY = targetY + my * 1.2 + floatY;

      camera.position.x = damp(camera.position.x, targetX, 3.2, dt);
      camera.position.y = damp(camera.position.y, targetCamY, 4.5, dt);
      camera.position.z = damp(camera.position.z, 24.5, 3.2, dt);

      camera.rotation.y = damp(camera.rotation.y, -mx * rotYMultiplier + floatRotY, 3.2, dt);
      camera.rotation.x = damp(camera.rotation.x, my * rotXMultiplier + floatRotX, 3.2, dt);
      camera.rotation.z = damp(camera.rotation.z, floatRotZ, 3.2, dt);
    }
  });
  return null;
};

// 2. Twinkling starfield (custom shader: per-star size + phase). Follows the camera at 88% so it feels deep in space.
const STAR_COUNT = 1500;

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
    gl_PointSize = min(aScale * uPixelRatio * (110.0 / -mv.z), 3.8 * uPixelRatio);
  }
`;

const starFragment = `
  uniform vec3 uColor;
  varying float vTwinkle;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float dSq = dot(c, c);
    if (dSq > 0.25) discard;
    float alpha = smoothstep(0.25, 0.01, dSq) * vTwinkle;
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
      scales[i] = Math.random() < 0.06 ? 2.1 + Math.random() : 0.6 + Math.random() * 0.85;
      phases[i] = Math.random();
    }
    return { positions, scales, phases };
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 1.5) },
    uColor: { value: new THREE.Color() },
  }), []);

  useEffect(() => {
    uniforms.uColor.value.set(palette.fg);
  }, [palette, uniforms]);

  useFrame(({ camera }, delta) => {
    const dt = Math.min(delta, 0.05);
    const speed = reducedMotion ? 0.2 : speedScale;
    uniforms.uTime.value += dt * speed;
    const points = pointsRef.current;
    if (!points) return;
    points.position.y = camera.position.y * 0.88;
    points.rotation.y += dt * 0.025 * speed;
    points.rotation.x += dt * 0.01 * speed;
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

// 3. Free-roaming Wireframe Spaceship: glides on a smooth 3D Lissajous flight path across space
const WireframeSpaceship = ({ palette, config, centerRef, speedScale }) => {
  const groupRef = useRef();
  const fireRef = useRef();
  const time = useRef(0);
  const currentPos = useMemo(() => new THREE.Vector3(), []);
  const aheadPos = useMemo(() => new THREE.Vector3(), []);
  const { radiusX, radiusY, radiusZ, speed, yOffset, orbitOffset, bankAngle } = config;

  const evalPath = (t, c, target) => {
    const a = t * speed + orbitOffset;
    // Multi-frequency 3D curve so the rocket roams freely and organically through space
    const x = c.x + Math.sin(a) * radiusX + Math.cos(a * 0.5 + 1.2) * (radiusX * 0.28);
    const y = c.y + yOffset + Math.sin(a * 0.7 + orbitOffset) * radiusY + Math.cos(a * 1.3) * (radiusY * 0.35);
    const z = c.z + Math.cos(a) * radiusZ + Math.sin(a * 0.6) * 5.0;
    return target.set(x, y, z);
  };

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    time.current += dt * speedScale;
    const group = groupRef.current;
    if (!group) return;

    const t = time.current;
    const c = centerRef.current;
    evalPath(t, c, currentPos);
    evalPath(t + 0.08, c, aheadPos);

    group.position.copy(currentPos);
    group.lookAt(aheadPos);
    group.rotateZ(bankAngle + Math.sin(t * 0.7) * 0.18);

    if (fireRef.current) {
      fireRef.current.scale.y = 1 + Math.sin(t * 15) * 0.32;
    }
  });

  return (
    <group ref={groupRef}>
      <group rotation={[Math.PI / 2, 0, 0]}>
        <Rocket palette={palette} fireRef={fireRef} />
      </group>
    </group>
  );
};

// 4. Earth: continents shader + lat/long grid + fresnel atmosphere (memoized low-overhead geometries)
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
    float d = 1.0 - max(dot(vNormal, vView), 0.0);
    float rim = d * d * sqrt(d);
    gl_FragColor = vec4(uColor, rim * uStrength);
  }
`;

const EarthGlobe = ({ palette, isDark, radius }) => {
  const earthMap = useMemo(() => {
    const loader = new THREE.TextureLoader();
    return loader.load('/images/earth-map.jpg');
  }, []);

  const geos = useMemo(() => ({
    core: new THREE.SphereGeometry(radius * 0.98, 20, 20),
    land: new THREE.SphereGeometry(radius * 0.99, 28, 28),
    wire: new THREE.SphereGeometry(radius, 14, 14),
    atmo: new THREE.SphereGeometry(radius, 20, 20),
  }), [radius]);

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
      <mesh geometry={geos.core}>
        <meshBasicMaterial color={palette.bg} />
      </mesh>
      <mesh geometry={geos.land} rotation={[0, -Math.PI / 2, 0]}>
        <shaderMaterial transparent uniforms={landUniforms} vertexShader={earthVertex} fragmentShader={earthFragment} />
      </mesh>
      <mesh geometry={geos.wire}>
        <meshBasicMaterial color={palette.fg} wireframe transparent opacity={0.5} />
      </mesh>
      <mesh geometry={geos.atmo} scale={1.18}>
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

// 5. Celestial System: Sun + Earth + Moon + free-roaming cosmic bodies & spacecraft
const ALIENS = [
  {
    type: 'dodecahedron',
    radiusX: 30,
    radiusY: 11,
    radiusZ: 24,
    speed: 0.14,
    yOffset: 6,
    phase: 0.4,
    rotSpeed: [0.65, 1.05, 0.45],
  },
  {
    type: 'spaceship',
    radiusX: 36,
    radiusY: 9,
    radiusZ: 30,
    speed: 0.19,
    yOffset: -6,
    orbitOffset: 0.5,
    bankAngle: -Math.PI / 5,
  },
  {
    type: 'octahedron',
    radiusX: 25,
    radiusY: 13,
    radiusZ: 22,
    speed: 0.16,
    yOffset: 10,
    phase: 2.3,
    rotSpeed: [1.0, 0.6, 0.75],
  },
  {
    type: 'icosahedron',
    radiusX: 34,
    radiusY: 14,
    radiusZ: 20,
    speed: 0.12,
    yOffset: -12,
    phase: 4.1,
    rotSpeed: [0.55, 0.85, 0.5],
  },
];

// Soft radial-gradient texture for cheap glow sprites
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
const SUN_LOOP_SECONDS = 44;
const SUN_START_ANGLE = Math.PI * 0.75;

const SUN_GEOS = {
  core: new THREE.IcosahedronGeometry(6.2, 2),
  innerWire: new THREE.IcosahedronGeometry(6.5, 2),
  outerWire: new THREE.IcosahedronGeometry(6.8, 0),
};
const MOON_GEOS = {
  core: new THREE.SphereGeometry(0.35, 16, 16),
  wire: new THREE.SphereGeometry(0.4, 12, 12),
};
const ALIEN_GEOS = {
  dodecahedron: new THREE.DodecahedronGeometry(2.4, 1),
  octahedron: new THREE.OctahedronGeometry(2.0, 1),
  icosahedron: new THREE.IcosahedronGeometry(1.9, 0),
};

const CelestialSystem = ({ palette, isDark, speedScale }) => {
  const { size } = useThree();
  const aspect = size.width / size.height;

  const center = useMemo(() => new THREE.Vector3(0, 0, SUN_DEPTH), []);
  const centerRef = useRef(center);

  const sunRef = useRef();
  const earthRef = useRef();
  const moonRef = useRef();
  const alienRefs = useRef([]);
  const time = useRef(0);

  useFrame(({ camera }, delta) => {
    const dt = Math.min(delta, 0.05);
    const step = dt * speedScale;
    time.current += step;
    const t = time.current;

    const halfHeight = Math.tan(Math.PI / 6) * (camera.position.z - SUN_DEPTH);
    const halfWidth = halfHeight * aspect;
    const a = SUN_START_ANGLE - (t / SUN_LOOP_SECONDS) * Math.PI * 2;

    // Follow camera Y 1:1 so the celestial system stays in view across every section,
    // while wandering freely in a wide 3D Lissajous curve across the sky.
    const targetCenterX =
      camera.position.x * 0.45 +
      Math.cos(a) * halfWidth * 0.72 +
      Math.sin(t * 0.19) * (halfWidth * 0.14);
    const targetCenterY =
      camera.position.y +
      Math.sin(a) * halfHeight * 0.62 +
      Math.sin(a * 2) * halfHeight * 0.12 +
      Math.cos(t * 0.16) * 2.2;
    const targetCenterZ = SUN_DEPTH + Math.sin(t * 0.15) * 3.5;

    center.x = damp(center.x, targetCenterX, 3.5, dt);
    center.y = damp(center.y, targetCenterY, 4.5, dt);
    center.z = damp(center.z, targetCenterZ, 3.5, dt);

    if (sunRef.current) {
      sunRef.current.position.copy(center);
      const baseScale = (aspect < 1 ? 0.6 : 1.0) * (1 + Math.sin(t * 1.2) * 0.03);
      sunRef.current.scale.setScalar(baseScale);
      sunRef.current.rotation.y += step * 0.18;
      sunRef.current.rotation.x += step * 0.06;
      sunRef.current.rotation.z += step * 0.035;
    }

    let ex = 0, ey = 0, ez = 0;
    if (earthRef.current) {
      ex = center.x + Math.sin(t * 0.22) * EARTH_ORBIT;
      ey = center.y + Math.cos(t * 0.18) * 5.2 + Math.sin(t * 0.31) * 1.2;
      ez = center.z + Math.cos(t * 0.22) * EARTH_ORBIT;
      earthRef.current.position.set(ex, ey, ez);
      earthRef.current.rotation.y += step * 0.48;
      earthRef.current.rotation.x = Math.sin(t * 0.14) * 0.18;
    }

    if (moonRef.current) {
      moonRef.current.position.set(
        ex + Math.sin(t * 0.95) * 2.6,
        ey + Math.sin(t * 0.75) * 0.85,
        ez + Math.cos(t * 0.95) * 2.6
      );
      moonRef.current.rotation.y += step * 0.95;
    }

    alienRefs.current.forEach((mesh, i) => {
      const conf = ALIENS[i];
      if (!mesh || conf.type === 'spaceship') return;
      const p = conf.phase || i * 2.1;
      const ang = t * conf.speed + p;
      // Independent multi-harmonic 3D free-roaming trajectories
      mesh.position.set(
        center.x + Math.sin(ang) * conf.radiusX + Math.cos(ang * 0.6 + p) * 5.5,
        center.y + conf.yOffset + Math.cos(ang * 0.75 + p) * conf.radiusY + Math.sin(ang * 1.3) * 3.0,
        center.z + Math.cos(ang) * conf.radiusZ + Math.sin(ang * 0.5 + p) * 4.5
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
        <mesh geometry={SUN_GEOS.core}>
          <meshBasicMaterial color="#ff4500" toneMapped={false} />
        </mesh>
        <mesh geometry={SUN_GEOS.innerWire}>
          <meshBasicMaterial color="#ffd700" wireframe transparent opacity={0.6} toneMapped={false} />
        </mesh>
        <mesh geometry={SUN_GEOS.outerWire}>
          <meshBasicMaterial color="#ffa500" wireframe transparent opacity={0.3} />
        </mesh>
      </group>

      <group ref={earthRef}>
        <EarthGlobe palette={palette} isDark={isDark} radius={1.2} />
      </group>

      <group ref={moonRef}>
        <mesh geometry={MOON_GEOS.core}>
          <meshBasicMaterial color={palette.moonCore} />
        </mesh>
        <mesh geometry={MOON_GEOS.wire}>
          <meshBasicMaterial color={palette.moonWire} wireframe transparent opacity={0.6} />
        </mesh>
      </group>

      {ALIENS.map((alien, i) =>
        alien.type === 'spaceship' ? (
          <WireframeSpaceship key={i} config={alien} palette={palette} centerRef={centerRef} speedScale={speedScale} />
        ) : (
          <mesh key={i} ref={(el) => (alienRefs.current[i] = el)} geometry={ALIEN_GEOS[alien.type]}>
            <meshBasicMaterial color={palette.fg} wireframe transparent opacity={0.16} />
          </mesh>
        )
      )}
    </>
  );
};

// 6. Free-Floating 3D Wireframe Debris:
//    Objects roam freely in all 3 dimensions (continuous zero-G drift + multi-harmonic Lissajous curves)
//    and wrap seamlessly outside the vertical frustum so every section on mobile and desktop is alive with motion.
const DEBRIS_GEOMETRIES = [
  new THREE.IcosahedronGeometry(1.35, 0),
  new THREE.OctahedronGeometry(1.2, 0),
  new THREE.TetrahedronGeometry(1.25, 0),
  new THREE.TorusGeometry(0.95, 0.28, 6, 12),
  new THREE.DodecahedronGeometry(1.15, 0),
];

const DEBRIS_COUNT = 22;
const DEBRIS_SPAN_Y = 96; // Wraps at ±48 units from camera (well beyond the ±28 visible vertical frustum)

const Debris = ({ palette, speedScale }) => {
  const groupRef = useRef();
  const time = useRef(0);

  const sharedMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({ wireframe: true, transparent: true, opacity: 0.2 }),
    []
  );

  useEffect(() => {
    sharedMaterial.color.set(palette.fg);
  }, [palette.fg, sharedMaterial]);

  const items = useMemo(
    () =>
      Array.from({ length: DEBRIS_COUNT }, (_, i) => {
        const side = i % 2 === 0 ? 1 : -1;
        return {
          geometry: DEBRIS_GEOMETRIES[i % DEBRIS_GEOMETRIES.length],
          side,
          // Base horizontal band (0.35 to 0.92 of halfWidth) + wide free roaming amplitude
          anchorX: 0.38 + ((i * 0.6180339) % 1) * 0.54,
          roamXRatio: 0.22 + Math.random() * 0.26,
          roamXWorld: 2.2 + Math.random() * 3.2,
          // Evenly distributed across the 96-unit vertical volume + continuous vertical velocity & wave
          baseY: -DEBRIS_SPAN_Y * 0.5 + (i / DEBRIS_COUNT) * DEBRIS_SPAN_Y,
          velY: (i % 3 === 0 ? 1 : -1) * (0.45 + Math.random() * 0.75),
          roamY: 3.5 + Math.random() * 4.5,
          // Depth & Z roaming
          baseZ: -5 - (i % 6) * 3.2 - Math.random() * 2.5,
          roamZ: 2.0 + Math.random() * 2.8,
          scale: 0.65 + Math.random() * 0.95,
          spin: [
            (Math.random() > 0.5 ? 1 : -1) * (0.35 + Math.random() * 0.55),
            (Math.random() > 0.5 ? 1 : -1) * (0.4 + Math.random() * 0.6),
            (Math.random() > 0.5 ? 1 : -1) * (0.25 + Math.random() * 0.45),
          ],
          freqX1: 0.16 + Math.random() * 0.16,
          freqX2: 0.09 + Math.random() * 0.11,
          freqY1: 0.14 + Math.random() * 0.15,
          freqY2: 0.08 + Math.random() * 0.1,
          freqZ: 0.13 + Math.random() * 0.14,
          phase: (i * 2.39996) + Math.random() * 0.5,
        };
      }),
    []
  );

  useFrame(({ size, camera }, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const dt = Math.min(delta, 0.05);
    const step = dt * speedScale;
    time.current += step;
    const t = time.current;
    const aspect = size.width / size.height;

    const camX = camera.position.x;
    const camY = camera.position.y;
    const halfSpan = DEBRIS_SPAN_Y * 0.5;

    for (let i = 0; i < group.children.length; i++) {
      const mesh = group.children[i];
      const item = items[i];
      const p = item.phase;

      // Dynamic depth Z with smooth harmonic float
      const z = item.baseZ + Math.cos(t * item.freqZ + p) * item.roamZ;

      // Visible half-width at this object's depth
      const halfWidth = Math.tan(Math.PI / 6) * (24.5 - z) * aspect;

      // Free 2-harmonic horizontal roaming across the viewport & side margins (works on both mobile & desktop)
      const x =
        camX * 0.25 +
        item.side * halfWidth * item.anchorX +
        Math.sin(t * item.freqX1 + p) * (halfWidth * item.roamXRatio) +
        Math.cos(t * item.freqX2 + p * 1.7) * item.roamXWorld;

      // Continuous free vertical drift + 2-harmonic wave, wrapped seamlessly around camera.position.y
      const rawWorldY =
        item.baseY +
        t * item.velY +
        Math.sin(t * item.freqY1 + p * 1.3) * item.roamY +
        Math.cos(t * item.freqY2 + p * 2.1) * (item.roamY * 0.5);

      // Parallax relative to camera (0.85 depth factor) wrapped smoothly within [-halfSpan, +halfSpan]
      const relY = ((((rawWorldY - camY * 0.85) + halfSpan) % DEBRIS_SPAN_Y) + DEBRIS_SPAN_Y) % DEBRIS_SPAN_Y - halfSpan;
      const y = camY + relY;

      mesh.position.set(x, y, z);
      mesh.rotation.x += item.spin[0] * step;
      mesh.rotation.y += item.spin[1] * step;
      mesh.rotation.z += item.spin[2] * step;
    }
  });

  return (
    <group ref={groupRef}>
      {items.map((item, i) => (
        <mesh key={i} geometry={item.geometry} material={sharedMaterial} scale={item.scale} />
      ))}
    </group>
  );
};

// 7. Ringed planet waiting at the bottom of the page (next to the contact section)
const PLANET_GEOS = {
  core: new THREE.IcosahedronGeometry(5, 2),
  wire: new THREE.IcosahedronGeometry(5.05, 2),
  ring: new THREE.RingGeometry(7, 10, 48, 2),
};

const RingedPlanet = ({ palette, isDark, speedScale, maxScroll, viewportHeight }) => {
  const ref = useRef();
  const time = useRef(0);
  const { size } = useThree();
  const isPortrait = size.width < size.height;
  const baseX = -Math.tan(Math.PI / 6) * 47 * (size.width / size.height) * (isPortrait ? 0.88 : 0.72);

  useFrame((_, delta) => {
    const planet = ref.current;
    if (!planet) return;
    const dt = Math.min(delta, 0.05);
    const s = dt * speedScale;
    time.current += s;
    const t = time.current;
    const targetY = -maxScroll.current * unitsPerPixel(viewportHeight) - 6;

    planet.position.set(
      baseX + Math.sin(t * 0.28) * 2.8 + Math.cos(t * 0.15) * 1.2,
      targetY + Math.cos(t * 0.24) * 2.0 + Math.sin(t * 0.14) * 0.8,
      -22 + Math.sin(t * 0.2) * 2.2
    );
    planet.rotation.y += s * 0.16;
    planet.rotation.x = 0.35 + Math.sin(t * 0.22) * 0.07;
    planet.rotation.z = 0.25 + Math.cos(t * 0.18) * 0.06;
  });

  return (
    <group ref={ref} rotation={[0.35, 0, 0.25]}>
      <Glow color="#ff6a2b" scale={26} opacity={0.25} isDark={isDark} />
      <mesh geometry={PLANET_GEOS.core}>
        <meshBasicMaterial color={palette.bg} />
      </mesh>
      <mesh geometry={PLANET_GEOS.wire}>
        <meshBasicMaterial color={palette.fg} wireframe transparent opacity={0.35} />
      </mesh>
      <mesh geometry={PLANET_GEOS.ring} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color="#ff7a2f" wireframe transparent opacity={0.6} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
    </group>
  );
};

const SpaceBackground = () => {
  const isDark = useIsDark();
  const reducedMotion = usePrefersReducedMotion();
  const { scroll, maxScroll, viewportHeight, mouse, targetInput, gyroInput, touchDelta } = useInputRefs();
  const palette = isDark ? PALETTE.dark : PALETTE.light;
  const speedScale = reducedMotion ? 0.15 : 1;

  return (
    <div className="fixed inset-0 -z-50 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 24.5], fov: 66 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', stencil: false }}
      >
        <fog attach="fog" args={[palette.bg, 32, 130]} />
        <CameraRig
          scroll={scroll}
          viewportHeight={viewportHeight}
          mouse={mouse}
          targetInput={targetInput}
          gyroInput={gyroInput}
          touchDelta={touchDelta}
          reducedMotion={reducedMotion}
          speedScale={speedScale}
        />
        <CyberGrid palette={palette} isDark={isDark} speedScale={speedScale} />
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
