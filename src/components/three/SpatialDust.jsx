import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const DUST_COUNT = 220;

const dustVertex = `
  attribute vec3 aVelocity;
  attribute float aScale;
  attribute float aAlpha;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform vec3 uCamPos;
  varying float vAlpha;

  void main() {
    vec3 boxSize = vec3(44.0, 32.0, 16.0);
    vec3 p = position + aVelocity * uTime;
    // GPU-accelerated modulo wrap inside 3D volume
    p = mod(p + boxSize * 0.5, boxSize) - boxSize * 0.5;

    // Follow camera in world coordinates
    vec3 worldPos = vec3(uCamPos.x + p.x, uCamPos.y + p.y, uCamPos.z - 10.0 + p.z);
    vec4 mv = viewMatrix * vec4(worldPos, 1.0);
    gl_Position = projectionMatrix * mv;
    vAlpha = aAlpha;
    gl_PointSize = clamp(aScale * uPixelRatio * (60.0 / -mv.z), 1.5, 9.0 * uPixelRatio);
  }
`;

const dustFragment = `
  uniform vec3 uColor;
  uniform vec3 uAccent;
  varying float vAlpha;

  void main() {
    vec2 c = gl_PointCoord - vec2(0.5);
    float dist = length(c);
    if (dist > 0.5) discard;
    float glow = smoothstep(0.5, 0.05, dist);
    vec3 color = mix(uColor, uAccent, 0.35);
    gl_FragColor = vec4(color, glow * vAlpha);
  }
`;

const SpatialDust = ({ palette, isDark, speedScale = 1 }) => {
  const pointsRef = useRef();

  const { positions, velocities, scales, alphas } = useMemo(() => {
    const pos = new Float32Array(DUST_COUNT * 3);
    const vel = new Float32Array(DUST_COUNT * 3);
    const sc = new Float32Array(DUST_COUNT);
    const al = new Float32Array(DUST_COUNT);

    for (let i = 0; i < DUST_COUNT; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 44;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 32;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 16;

      vel[i * 3 + 0] = (Math.random() - 0.5) * 0.8;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.6;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.8;

      sc[i] = 1.0 + Math.random() * 2.2;
      al[i] = 0.25 + Math.random() * 0.65;
    }

    return { positions: pos, velocities: vel, scales: sc, alphas: al };
  }, []);

  const uniforms = useMemo(() => ({
    uColor: { value: new THREE.Color() },
    uAccent: { value: new THREE.Color() },
    uTime: { value: 0 },
    uCamPos: { value: new THREE.Vector3() },
    uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 1.5) },
  }), []);

  useEffect(() => {
    uniforms.uColor.value.set(palette.dust || palette.fg);
    uniforms.uAccent.value.set(palette.accent || '#ff6a2b');
  }, [palette, uniforms]);

  useFrame(({ camera }, delta) => {
    uniforms.uTime.value += delta * speedScale;
    uniforms.uCamPos.value.copy(camera.position);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aVelocity" args={[velocities, 3]} />
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
