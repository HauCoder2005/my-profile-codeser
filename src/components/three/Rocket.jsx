import React, { memo } from 'react';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

// Retro wireframe rocket, nose pointing along +Y.
// All hull parts are merged into one mesh + one edge outline, and materials are shared between rockets,
// so each rocket costs 3 draw calls instead of 13.
const place = (geometry, position, rotation = [0, 0, 0]) =>
  geometry.applyMatrix4(
    new THREE.Matrix4().compose(
      new THREE.Vector3(...position),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(...rotation)),
      new THREE.Vector3(1, 1, 1)
    )
  );

const hullGeometry = mergeGeometries([
  new THREE.CylinderGeometry(0.5, 0.5, 2.5, 8),
  place(new THREE.ConeGeometry(0.5, 1, 8), [0, 1.75, 0]),
  place(new THREE.CylinderGeometry(0.2, 0.3, 0.4, 8), [0, -1.4, 0]),
  place(new THREE.CylinderGeometry(0.2, 0.2, 0.1, 8), [0, 0.5, 0.5], [Math.PI / 2, 0, 0]),
  place(new THREE.BoxGeometry(0.6, 1.2, 0.05), [-0.6, -0.5, 0], [0, 0, Math.PI / 8]),
  place(new THREE.BoxGeometry(0.6, 1.2, 0.05), [0.6, -0.5, 0], [0, 0, -Math.PI / 8]),
]);
const edgesGeometry = new THREE.EdgesGeometry(hullGeometry, 15);
const flameGeometry = new THREE.ConeGeometry(0.3, 1, 8);

const flameMaterial = new THREE.MeshBasicMaterial({ color: '#ff7a2f', transparent: true, opacity: 0.85, toneMapped: false });

// One hull + edge material pair per theme palette
const materialCache = new Map();
const materialsFor = (palette) => {
  const key = `${palette.fg}|${palette.bg}`;
  if (!materialCache.has(key)) {
    materialCache.set(key, {
      // Push faces back slightly so the outline never z-fights with them
      hull: new THREE.MeshBasicMaterial({ color: palette.bg, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 }),
      edges: new THREE.LineBasicMaterial({ color: palette.fg }),
    });
  }
  return materialCache.get(key);
};

const Rocket = ({ palette, fireRef }) => {
  const materials = materialsFor(palette);
  return (
    <group>
      <mesh geometry={hullGeometry} material={materials.hull} />
      <lineSegments geometry={edgesGeometry} material={materials.edges} />
      <mesh ref={fireRef} geometry={flameGeometry} material={flameMaterial} position={[0, -2, 0]} rotation={[Math.PI, 0, 0]} />
    </group>
  );
};

export default memo(Rocket);
