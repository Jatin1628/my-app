"use client";
import React from "react";
import { Canvas } from "@react-three/fiber";
import { Experience } from "./Experience";

const VideoComponent = () => {
  return (
    <div className="border border-gray-200 h-[30%] w-full rounded-lg my-3 p-2 lg:w-[50%] lg:h-[58%]">
      <div style={{ width: "100%", height: "100%" }}>
        <Canvas shadows camera={{ position: [0, 0, 1], fov: 25 }}>
          <Experience />
        </Canvas>
      </div>
    </div>
  );
};

export default VideoComponent;