import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const DUST_COUNT = 160;

const dustVertex = `
  attribute vec3 aVelocity;
  attribute float aScale;
  attribute float aAlpha;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform vec3 uCamPos;
  varying float vAlpha;

  void main() {
    vec3 boxSize = vec3(46.0, 36.0, 18.0);
    // Free-floating 3D velocity + zero-G harmonic turbulence + true depth parallax with camera
    vec3 swirl = vec3(
      sin(uTime * 0.45 + position.y * 0.18) * 1.6,
      cos(uTime * 0.38 + position.x * 0.18) * 1.6,
      sin(uTime * 0.32 + position.z * 0.22) * 1.0
    );
    vec3 p = position + aVelocity * uTime + swirl - vec3(uCamPos.x * 0.45, uCamPos.y * 0.55, 0.0);
    // GPU-accelerated modulo wrap inside 3D volume
    p = mod(p + boxSize * 0.5, boxSize) - boxSize * 0.5;

    // Smoothly fade near volume boundaries so wrapped particles never pop
    vec3 edgeDist = (boxSize * 0.5) - abs(p);
    float edgeFade = smoothstep(0.0, 3.5, min(edgeDist.x, min(edgeDist.y, edgeDist.z)));

    // Position volume relative to camera
    vec3 worldPos = vec3(uCamPos.x + p.x, uCamPos.y + p.y, uCamPos.z - 11.0 + p.z);
    vec4 mv = viewMatrix * vec4(worldPos, 1.0);
    gl_Position = projectionMatrix * mv;
    vAlpha = aAlpha * edgeFade;
    gl_PointSize = clamp(aScale * uPixelRatio * (56.0 / -mv.z), 1.5, 6.5 * uPixelRatio);
  }
`;

const dustFragment = `
  uniform vec3 uColor;
  uniform vec3 uAccent;
  varying float vAlpha;

  void main() {
    vec2 c = gl_PointCoord - vec2(0.5);
    float distSq = dot(c, c);
    if (distSq > 0.25) discard;
    float glow = smoothstep(0.25, 0.01, distSq);
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
      pos[i * 3 + 0] = (Math.random() - 0.5) * 46;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 36;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 18;

      vel[i * 3 + 0] = (Math.random() - 0.5) * 1.1;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.9;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.8;

      sc[i] = 1.0 + Math.random() * 2.0;
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
    const dt = Math.min(delta, 0.05);
    uniforms.uTime.value += dt * speedScale;
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
