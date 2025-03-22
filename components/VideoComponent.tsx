// pages/index.js
"use client"; // This ensures that the entire page renders on the client

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Fox from "../components/Fox";



const VideoComponent = () => {
  return (
    <div className='border border-gray-200 h-[30%] w-full rounded-lg  my-3 p-2 lg:w-[50%] lg:h-[58%]'>
       <div style={{ width: "100%", height: "100%" }}>
      <Canvas
        shadows
        camera={{ position: [0, 2, 5], fov: 50 }}
      >
        {/* Basic lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

        {/* Wrap Fox in Suspense to wait for asset loading */}
        <Suspense fallback={null}>
          <Fox position={[0.06, -1.2, 0]} />
        </Suspense>

        {/* Enable user interaction */}
        <OrbitControls />
      </Canvas>
    </div>
    </div>
  )
}

export default VideoComponent

