"use client"
import dynamic from "next/dynamic";

const Canvas = dynamic(
  () => import("@react-three/fiber").then((mod) => mod.Canvas),
  { ssr: false }
);

export default function TestCanvas() {
  return (
    <Canvas>
      {/* Your scene goes here */}
      <ambientLight intensity={0.5} />
    </Canvas>
  );
}
