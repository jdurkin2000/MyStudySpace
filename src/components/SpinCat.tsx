"use client";
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber"; 
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Group } from "three";


interface SpinCatProps {
  width?: number;
  height?: number;
}

function SpinningCatModel() {
  const ref = useRef<Group>(null);
  const { scene } = useGLTF("/spincat.glb");

  useFrame(() => {
    if (ref.current) {
      ref.current.position.y = -1;
      ref.current.rotation.y -= 0.01;
    }
  });

  return <primitive object={scene} ref={ref} scale={0.11} />;
}

export default function SpinCat({ width, height }: SpinCatProps) {
  return (
    <Canvas
      style={{ width, height }}
      camera={{ position: [0, 1, 5], fov: 45 }}
    >
      <ambientLight intensity={1} />
      <SpinningCatModel />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={true}
        rotateSpeed={2}
      />
    </Canvas>
  );
}
