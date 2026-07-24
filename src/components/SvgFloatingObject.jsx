import React, { useMemo, useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import * as THREE from 'three';

const SvgFloatingObject = ({ svgUrl, position, rotation, scale = 1, isDark = true }) => {
  const meshGroupRef = useRef();
  
  // Load SVG
  const svg = useLoader(SVGLoader, svgUrl);
  
  // Convert SVG paths to ExtrudeGeometry
  const geometries = useMemo(() => {
    const geoms = [];
    svg.paths.forEach((path) => {
      const shapes = SVGLoader.createShapes(path);
      shapes.forEach((shape) => {
        const geometry = new THREE.ExtrudeGeometry(shape, {
          depth: 2,
          bevelEnabled: true,
          bevelThickness: 0.5,
          bevelSize: 0.2,
          bevelSegments: 2,
        });
        
        // Center the geometry
        geometry.computeBoundingBox();
        const bbox = geometry.boundingBox;
        if (bbox) {
          geometry.translate(
            -(bbox.max.x - bbox.min.x) / 2,
            -(bbox.max.y - bbox.min.y) / 2,
            -(bbox.max.z - bbox.min.z) / 2
          );
        }
        
        // Flip Y axis because SVG coordinates are top-left origin
        geometry.scale(0.02 * scale, -0.02 * scale, 0.02 * scale);
        
        geoms.push(geometry);
      });
    });
    return geoms;
  }, [svg, scale]);

  // Animation values setup (using useRef so they don't change on re-renders)
  const floatSpeed = useRef(Math.random() * 0.5 + 0.2);
  const rotSpeedX = useRef((Math.random() - 0.5) * 0.01);
  const rotSpeedY = useRef((Math.random() - 0.5) * 0.01);
  const rotSpeedZ = useRef((Math.random() - 0.5) * 0.01);
  
  // Store initial position for floating math
  const initialPosition = useRef([...position]);

  useFrame((state) => {
    if (!meshGroupRef.current) return;
    
    // Floating animation
    const time = state.clock.getElapsedTime();
    meshGroupRef.current.position.x = initialPosition.current[0] + Math.sin(time * floatSpeed.current * 0.8) * 0.5;
    meshGroupRef.current.position.y = initialPosition.current[1] + Math.cos(time * floatSpeed.current) * 0.5;
    
    // Gentle rotation
    meshGroupRef.current.rotation.x += rotSpeedX.current;
    meshGroupRef.current.rotation.y += rotSpeedY.current;
    meshGroupRef.current.rotation.z += rotSpeedZ.current;
  });

  const materialColor = isDark ? 0xffffff : 0x000000;

  return (
    <group position={position} rotation={rotation} ref={meshGroupRef}>
      {geometries.map((geom, index) => (
        <mesh key={index} geometry={geom}>
          {/* Strict monochrome material based on theme */}
          <meshStandardMaterial 
            color={materialColor} 
            roughness={0.2}
            metalness={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
};

export default SvgFloatingObject;
