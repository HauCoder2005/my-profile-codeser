import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Procedural infinite perspective grid with distance fog and glowing horizon
const gridVertex = `
  varying vec3 vWorldPosition;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const gridFragment = `
  #extension GL_OES_standard_derivatives : enable
  uniform vec3 uColor;
  uniform vec3 uHorizonColor;
  uniform float uTime;
  uniform float uScroll;
  uniform float uOpacity;
  uniform vec3 uCameraPos;
  varying vec3 vWorldPosition;
  varying vec2 vUv;

  void main() {
    vec2 coord = vWorldPosition.xz;
    // Smoothly coupled to damped camera Y + continuous forward drift (zero scroll jitter)
    coord.y += uTime * 1.8 + uScroll * 0.55;

    // Major grid lines (4.0 units)
    vec2 grid4 = abs(fract(coord * 0.25 - 0.5) - 0.5) / fwidth(coord * 0.25);
    float majorLine = 1.0 - min(min(grid4.x, grid4.y), 1.0);

    // Minor grid lines (1.0 unit)
    vec2 grid1 = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
    float minorLine = (1.0 - min(min(grid1.x, grid1.y), 1.0)) * 0.32;

    float gridPattern = max(majorLine, minorLine);

    // Distance from camera for smooth 3D depth attenuation
    float dist = distance(vWorldPosition, uCameraPos);

    // Fade out near camera so it never clips, and fade into distance horizon
    float nearFade = smoothstep(4.0, 16.0, dist);
    float farFade = smoothstep(105.0, 30.0, dist);
    float depthFade = nearFade * farFade;

    // Glowing horizon band where perspective lines converge (cubic instead of pow for mobile GPU speed)
    float h = smoothstep(38.0, 98.0, dist);
    float horizonBand = h * h * h;

    vec3 finalColor = mix(uColor, uHorizonColor, horizonBand * 1.4);
    float finalAlpha = (gridPattern * 0.68 + horizonBand * 0.32) * depthFade * uOpacity;

    gl_FragColor = vec4(finalColor, finalAlpha);
  }
`;

const CyberGrid = ({ palette, isDark, speedScale = 1 }) => {
  const floorRef = useRef();
  const time = useRef(0);

  const uniforms = useMemo(() => ({
    uColor: { value: new THREE.Color() },
    uHorizonColor: { value: new THREE.Color() },
    uTime: { value: 0 },
    uScroll: { value: 0 },
    uOpacity: { value: isDark ? 0.65 : 0.45 },
    uCameraPos: { value: new THREE.Vector3() },
  }), [isDark]);

  useEffect(() => {
    uniforms.uColor.value.set(palette.grid || palette.fg);
    uniforms.uHorizonColor.value.set(palette.gridHorizon || palette.accent || '#ff6a2b');
    uniforms.uOpacity.value = isDark ? 0.65 : 0.42;
  }, [palette, isDark, uniforms]);

  useFrame(({ camera, size }, delta) => {
    const dt = Math.min(delta, 0.05);
    time.current += dt * speedScale;
    uniforms.uTime.value = time.current;
    uniforms.uScroll.value = -camera.position.y;
    uniforms.uCameraPos.value.copy(camera.position);

    const isPortrait = size.width < size.height;
    // On mobile portrait, raise floor grid slightly so the 3D landscape lines are directly visible on phone
    const floorY = isPortrait ? camera.position.y - 10.5 : camera.position.y - 13.5;

    if (floorRef.current) {
      floorRef.current.position.y = floorY;
      floorRef.current.position.x = camera.position.x * 0.3;
    }
  });

  return (
    /* 3D Infinite Perspective Floor Grid */
    <mesh ref={floorRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -13.5, -25]}>
      <planeGeometry args={[130, 110, 1, 1]} />
      <shaderMaterial
        vertexShader={gridVertex}
        fragmentShader={gridFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        extensions={{ derivatives: true }}
      />
    </mesh>
  );
};

export default CyberGrid;
