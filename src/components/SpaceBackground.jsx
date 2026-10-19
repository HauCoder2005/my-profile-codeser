import React, { useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

import Rocket from './three/Rocket';
import CyberGrid from './three/CyberGrid';
import SpatialDust from './three/SpatialDust';
import SpatialGyro from './three/SpatialGyro';
import { PALETTE, useIsDark, usePrefersReducedMotion } from './three/theme';

const damp = THREE.MathUtils.damp;

// Shared, mutable input state read inside useFrame (supports Mouse, Touch, Mobile Gyroscope & Arcade isolation)
const useInputRefs = () => {
  const scroll = useRef(0);
  const maxScroll = useRef(0);
  const viewportHeight = useRef(window.innerHeight);
  const viewportWidth = useRef(window.innerWidth);
  const mouse = useRef({ x: 0, y: 0 });
  const arcadeActive = useRef(false);
  const isPlayingArcade = useRef(false);
  const touchActiveOnArcade = useRef(false);
  const mouseOverArcade = useRef(false);

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

    let touchTimeout = null;

    const updateArcadeActive = () => {
      arcadeActive.current = isPlayingArcade.current || mouseOverArcade.current || touchActiveOnArcade.current;
      if (arcadeActive.current) {
        mouse.current.x = 0;
        mouse.current.y = 0;
      }
    };

    const onArcadeStatus = (e) => {
      if (e.detail?.isPlaying !== undefined) {
        isPlayingArcade.current = !!e.detail.isPlaying;
      }
      if (e.detail?.active !== undefined) {
        mouseOverArcade.current = !!e.detail.active;
      }
      updateArcadeActive();
    };
    window.addEventListener('arcade-status', onArcadeStatus);

    // 1. Desktop cursor / pointer move
    const onMove = (e) => {
      const isArcade = !!e.target?.closest?.('#arcade');
      mouseOverArcade.current = isArcade;
      updateArcadeActive();

      if (arcadeActive.current) {
        mouse.current.x = 0;
        mouse.current.y = 0;
        return;
      }

      mouse.current.x = (e.clientX / (viewportWidth.current || window.innerWidth)) * 2 - 1;
      mouse.current.y = -((e.clientY / (viewportHeight.current || window.innerHeight)) * 2 - 1);
    };

    // Immediate tap or click on arcade
    const onPointerDown = (e) => {
      const isArcade = !!e.target?.closest?.('#arcade');
      if (isArcade) {
        if (e.pointerType === 'touch') {
          touchActiveOnArcade.current = true;
          clearTimeout(touchTimeout);
        } else {
          mouseOverArcade.current = true;
        }
        updateArcadeActive();
      } else {
        if (touchActiveOnArcade.current && !isPlayingArcade.current) {
          touchActiveOnArcade.current = false;
          updateArcadeActive();
        }
      }
    };

    // 2. Mobile touch pan (joystick / touch drag fallback)
    const onTouch = (e) => {
      const isArcade = !!e.target?.closest?.('#arcade');
      if (isArcade) {
        touchActiveOnArcade.current = true;
        clearTimeout(touchTimeout);
        updateArcadeActive();
        mouse.current.x = 0;
        mouse.current.y = 0;
        return;
      }

      if (arcadeActive.current) return;

      if (e.touches && e.touches.length > 0) {
        const t = e.touches[0];
        mouse.current.x = (t.clientX / (viewportWidth.current || window.innerWidth)) * 2 - 1;
        mouse.current.y = -((t.clientY / (viewportHeight.current || window.innerHeight)) * 2 - 1);
      }
    };

    const onTouchEnd = (e) => {
      const isArcade = !!e.target?.closest?.('#arcade');
      if (isArcade) {
        // Keep active for grace period so rapid taps don't cause background flicker
        clearTimeout(touchTimeout);
        touchTimeout = setTimeout(() => {
          touchActiveOnArcade.current = false;
          updateArcadeActive();
        }, 1500);
      } else {
        clearTimeout(touchTimeout);
        touchActiveOnArcade.current = false;
        updateArcadeActive();
      }
    };

    // 3. Mobile Gyroscope / Device Orientation ("di điện thoại tới đâu thì nó xoay")
    let baseBeta = null;
    let baseGamma = null;

    const onDeviceOrientation = (e) => {
      if (arcadeActive.current) {
        mouse.current.x = 0;
        mouse.current.y = 0;
        return;
      }
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

      // Sensitivity: comfortable ±16 degree tilt gives full range
      const gx = Math.max(-2.2, Math.min(2.2, deltaGamma / 10));
      const gy = Math.max(-2.2, Math.min(2.2, deltaBeta / 10));

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
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onTouch, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('touchcancel', onTouchEnd, { passive: true });
    window.addEventListener('deviceorientation', onDeviceOrientation, { passive: true });
    window.addEventListener('deviceorientationabsolute', onDeviceOrientation, { passive: true });
    window.addEventListener('touchstart', requestPermission, { passive: true });
    window.addEventListener('touchend', requestPermission, { passive: true });
    window.addEventListener('click', requestPermission, { passive: true });

    return () => {
      clearTimeout(touchTimeout);
      window.removeEventListener('arcade-status', onArcadeStatus);
      resizeObserver.disconnect();
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
      window.removeEventListener('deviceorientation', onDeviceOrientation);
      window.removeEventListener('deviceorientationabsolute', onDeviceOrientation);
      window.removeEventListener('touchstart', requestPermission);
      window.removeEventListener('touchend', requestPermission);
      window.removeEventListener('click', requestPermission);
    };
  }, []);

  return { scroll, maxScroll, viewportHeight, mouse, arcadeActive };
};

// World units the camera travels per scrolled pixel: the 3D scene scrolls at ~60% of the page speed (parallax)
const unitsPerPixel = (viewportHeight) => 27 / viewportHeight.current;

// 1. Camera rig: Smooth desktop mouse parallax & immersive Mobile Gyroscope VR camera
const CameraRig = ({ scroll, viewportHeight, mouse, reducedMotion, arcadeActive }) => {
  useFrame(({ camera, size }, delta) => {
    const isPortrait = size.width < size.height;
    const targetY = -scroll.current * unitsPerPixel(viewportHeight);
    const isArcade = arcadeActive?.current;
    const mx = (reducedMotion || isArcade) ? 0 : mouse.current.x;
    const my = (reducedMotion || isArcade) ? 0 : mouse.current.y;

    if (isPortrait) {
      // Mobile portrait AR/VR window
      const rotYMultiplier = isArcade ? 0 : 0.85;
      const rotXMultiplier = isArcade ? 0 : 0.65;
      const rotZMultiplier = isArcade ? 0 : 0.12;
      const posMultiplier = isArcade ? 0 : 8.2;
      const dampRate = isArcade ? 6.0 : 4.5;

      const targetX = mx * posMultiplier;
      const targetCamY = targetY + my * (isArcade ? 0 : 5.2);
      const targetZ = 24.5 - (isArcade ? 0 : Math.min(Math.hypot(mx, my) * 1.5, 2.2));

      camera.position.x = damp(camera.position.x, targetX, dampRate, delta);
      camera.position.y = damp(camera.position.y, targetCamY, dampRate, delta);
      camera.position.z = damp(camera.position.z, targetZ, dampRate * 0.8, delta);

      camera.rotation.y = damp(camera.rotation.y, -mx * rotYMultiplier, dampRate, delta);
      camera.rotation.x = damp(camera.rotation.x, my * rotXMultiplier, dampRate, delta);
      camera.rotation.z = damp(camera.rotation.z, -mx * rotZMultiplier, dampRate * 0.9, delta);
    } else {
      // Desktop cursor: buttery smooth, subtle cinematic parallax with zero hitching
      const targetX = isArcade ? 0 : mx * 1.8;
      const targetCamY = targetY + (isArcade ? 0 : my * 0.9);
      const dampRate = isArcade ? 4.5 : 2.4;

      camera.position.x = damp(camera.position.x, targetX, dampRate, delta);
      camera.position.y = damp(camera.position.y, targetCamY, dampRate, delta);
      camera.position.z = damp(camera.position.z, 24.5, dampRate, delta);

      camera.rotation.y = damp(camera.rotation.y, isArcade ? 0 : -mx * 0.08, dampRate, delta);
      camera.rotation.x = damp(camera.rotation.x, isArcade ? 0 : my * 0.05, dampRate, delta);
      camera.rotation.z = damp(camera.rotation.z, 0, dampRate, delta);
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

const Starfield = ({ palette, reducedMotion, speedScale = 1, arcadeActive }) => {
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
    const s = arcadeActive?.current ? 0 : (reducedMotion ? 0.2 : speedScale);
    uniforms.uTime.value += delta * s;
    const points = pointsRef.current;
    if (!points) return;
    points.position.y = camera.position.y * 0.85;
    points.rotation.y += delta * 0.012 * s;
    points.rotation.x += delta * 0.004 * s;
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
const WireframeSpaceship = ({ palette, config, centerRef, speedScale, arcadeActive }) => {
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
    const s = arcadeActive?.current ? 0 : speedScale;
    time.current += delta * s;
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

const CelestialSystem = ({ palette, isDark, speedScale, arcadeActive }) => {
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
    const step = delta * (arcadeActive?.current ? 0 : speedScale);
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
          <WireframeSpaceship key={i} config={alien} palette={palette} centerRef={centerRef} speedScale={speedScale} arcadeActive={arcadeActive} />
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

const Debris = ({ palette, speedScale, arcadeActive }) => {
  const groupRef = useRef();
  const time = useRef(0);
  const items = useMemo(() => Array.from({ length: 18 }, (_, i) => ({
    geometry: DEBRIS_GEOMETRIES[i % DEBRIS_GEOMETRIES.length],
    side: i % 2 === 0 ? 1 : -1,
    edge: 0.88 + Math.random() * 0.15, // share of the half screen width: hugs the edges
    y: -28 - i * 11 - Math.random() * 6,
    z: -6 - Math.random() * 18,
    scale: 0.6 + Math.random() * 1.1,
    spin: [(Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 0.3],
    // Free drift: a slow Lissajous loop with its own speed and phase
    drift: [1.2 + Math.random() * 1.5, 1.5 + Math.random() * 2],
    driftSpeed: [0.08 + Math.random() * 0.1, 0.06 + Math.random() * 0.08],
    phase: Math.random() * Math.PI * 2,
  })), []);

  useFrame(({ size }, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const step = delta * (arcadeActive?.current ? 0 : speedScale);
    time.current += step;
    const t = time.current;
    const aspect = size.width / size.height;
    group.children.forEach((mesh, i) => {
      const item = items[i];
      // Half the visible width at this depth (camera at z=25, fov 60)
      const halfWidth = Math.tan(Math.PI / 6) * (25 - item.z) * aspect;
      mesh.position.set(
        item.side * halfWidth * item.edge + Math.sin(t * item.driftSpeed[0] + item.phase) * item.drift[0],
        item.y + Math.sin(t * item.driftSpeed[1] + item.phase * 1.7) * item.drift[1],
        item.z
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
          <meshBasicMaterial color={palette.fg} wireframe transparent opacity={0.18} />
        </mesh>
      ))}
    </group>
  );
};

// 7. Ringed planet waiting at the bottom of the page (next to the contact section)
const RingedPlanet = ({ palette, isDark, speedScale, maxScroll, viewportHeight, arcadeActive }) => {
  const ref = useRef();
  const { size } = useThree();
  const isPortrait = size.width < size.height;
  // Left edge of the screen at the planet's depth (camera z=25 -> planet z=-22)
  const x = -Math.tan(Math.PI / 6) * 47 * (size.width / size.height) * (isPortrait ? 0.95 : 0.75);

  useFrame((_, delta) => {
    const planet = ref.current;
    if (!planet) return;
    // Sit just below the camera's final resting point, on the left side
    planet.position.set(x, -maxScroll.current * unitsPerPixel(viewportHeight) - 6, -22);
    planet.rotation.y += delta * 0.08 * (arcadeActive?.current ? 0 : speedScale);
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
  const { scroll, maxScroll, viewportHeight, mouse, arcadeActive } = useInputRefs();
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
        <CameraRig scroll={scroll} viewportHeight={viewportHeight} mouse={mouse} reducedMotion={reducedMotion} arcadeActive={arcadeActive} />
        <CyberGrid palette={palette} isDark={isDark} scroll={scroll} speedScale={speedScale} arcadeActive={arcadeActive} />
        <SpatialDust palette={palette} isDark={isDark} speedScale={speedScale} arcadeActive={arcadeActive} />
        <SpatialGyro palette={palette} isDark={isDark} position={[16, 7, -10]} speedScale={speedScale} arcadeActive={arcadeActive} />
        <Starfield palette={palette} reducedMotion={reducedMotion} speedScale={speedScale} arcadeActive={arcadeActive} />
        <CelestialSystem palette={palette} isDark={isDark} speedScale={speedScale} arcadeActive={arcadeActive} />
        <Debris palette={palette} speedScale={speedScale} arcadeActive={arcadeActive} />
        <RingedPlanet palette={palette} isDark={isDark} speedScale={speedScale} maxScroll={maxScroll} viewportHeight={viewportHeight} arcadeActive={arcadeActive} />
      </Canvas>
    </div>
  );
};

export default SpaceBackground;
