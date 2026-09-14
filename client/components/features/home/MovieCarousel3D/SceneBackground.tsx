// SceneBackground.tsx
"use client";

import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";

interface SceneBackgroundProps {
  color: string;
}

export function SceneBackground({ color }: SceneBackgroundProps) {
  const { scene } = useThree();

  useEffect(() => {
    scene.background = new THREE.Color(color);
  }, [scene, color]);

  return null;
}