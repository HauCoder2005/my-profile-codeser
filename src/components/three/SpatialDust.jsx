import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const DUST_COUNT = 150;

const dustVertex = `
  attribute float aScale;
  attribute float aAlpha;
  uniform float uPixelRatio;
  varying float vAlpha;

  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    vAlpha = aAlpha;
    // Exaggerated scale when closer to camera lens
    gl_PointSize = clamp(aScale * uPixelRatio * (60.0 / -mv.z), 1.5, 9.0 * uPixelRatio);
  }
`;

const dustFragment = `
  uniform vec3 uColor;
  uniform vec3 uAccent;
  varying float vAlpha;

  void main() {
    // Soft circular glowing particle
    vec2 c = gl_PointCoord - vec2(0.5);
    float dist = length(c);
    if (dist > 0.5) discard;
    float glow = smoothstep(0.5, 0.05, dist);
    
    // Core highlight
    vec3 color = mix(uColor, uAccent, 0.35);
    gl_FragColor = vec4(color, glow * vAlpha);
  }
`;

const SpatialDust = ({ palette, isDark, speedScale = 1 }) => {
  const pointsRef = useRef();

  // Create particles in a box around the camera frustum:
  // Camera is at z ~ 24, looking toward -Z.
  // We place dust from z = 6 to z = 22 (right in front of the camera lens!).
  const { positions, velocities, scales, alphas } = useMemo(() => {
    const pos = new Float32Array(DUST_COUNT * 3);
    const vel = new Float32Array(DUST_COUNT * 3);
    const sc = new Float32Array(DUST_COUNT);
    const al = new Float32Array(DUST_COUNT);

    for (let i = 0; i < DUST_COUNT; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 44; // x: -22 to 22
      pos[i * 3 + 1] = (Math.random() - 0.5) * 32; // y: -16 to 16
      pos[i * 3 + 2] = 6 + Math.random() * 16;     // z: 6 to 22 (near camera)

      vel[i * 3 + 0] = (Math.random() - 0.5) * 0.4;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.3;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.5;

      sc[i] = 1.0 + Math.random() * 2.2;
      al[i] = 0.25 + Math.random() * 0.65;
    }

    return { positions: pos, velocities: vel, scales: sc, alphas: al };
  }, []);

  const uniforms = useMemo(() => ({
    uColor: { value: new THREE.Color() },
    uAccent: { value: new THREE.Color() },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
  }), []);

  useEffect(() => {
    uniforms.uColor.value.set(palette.dust || palette.fg);
    uniforms.uAccent.value.set(palette.accent || '#ff6a2b');
  }, [palette, uniforms]);

  useFrame(({ camera }, delta) => {
    const points = pointsRef.current;
    if (!points) return;

    const geo = points.geometry;
    const posAttr = geo.attributes.position;
    const pArr = posAttr.array;
    const step = delta * speedScale;

    // Follow camera position in X and Y so dust volume stays around viewer as you scroll
    points.position.x = camera.position.x;
    points.position.y = camera.position.y;

    for (let i = 0; i < DUST_COUNT; i++) {
      let x = pArr[i * 3 + 0] + velocities[i * 3 + 0] * step;
      let y = pArr[i * 3 + 1] + velocities[i * 3 + 1] * step;
      let z = pArr[i * 3 + 2] + velocities[i * 3 + 2] * step;

      // Wrap around bounds relative to camera center
      if (x > 22) x = -22;
      else if (x < -22) x = 22;

      if (y > 16) y = -16;
      else if (y < -16) y = 16;

      if (z > 22) z = 6;
      else if (z < 6) z = 22;

      pArr[i * 3 + 0] = x;
      pArr[i * 3 + 1] = y;
      pArr[i * 3 + 2] = z;
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
        <bufferAttribute attach="attributes-aAlpha" args={[alphas, 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={dustVertex}
        fragmentShader={dustFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
      />
    </points>
  );
};

export default SpatialDust;
