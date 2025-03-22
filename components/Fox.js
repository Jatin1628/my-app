// components/Fox.js
"use client";

import React, { useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

export default function Fox(props) {
  const group = useRef();
  const gltf = useGLTF("/models/Fox.glb");
  const { animations, scene } = gltf; // try using gltf.scene
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    // Log the glTF data to inspect available keys
    console.log(gltf);
    // Play the first animation as a fallback if available
    if (actions && Object.keys(actions).length > 0) {
      const firstKey = Object.keys(actions)[0];
      actions[firstKey].play();
    }
  }, [actions, gltf]);

  // Ensure that the object is valid before rendering
  if (!scene) {
    return null;
  }

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={scene} scale={[0.035, 0.035, 0.035]} />
    </group>
  );
}

useGLTF.preload("../public/models/Fox.glb");
