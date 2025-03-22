// pages/index.js
"use client"; // This ensures that the entire page renders on the client

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Fox from "../../components/Fox";

export default function Home() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas
        shadows
        camera={{ position: [0, 2, 5], fov: 50 }}
      >
        {/* Basic lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

        {/* Wrap Fox in Suspense to wait for asset loading */}
        <Suspense fallback={null}>
          <Fox position={[0, -1, 0]} />
        </Suspense>

        {/* Enable user interaction */}
        <OrbitControls />
      </Canvas>
    </div>
  );
}
