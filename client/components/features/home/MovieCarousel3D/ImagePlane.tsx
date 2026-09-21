"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, type MutableRefObject } from "react";
// import * as THREE from "three";
import { Texture, Mesh, FrontSide } from "three/webgpu"
import {
  abs,
  add,
  div,
  length,
  max,
  mix,
  positionLocal,
  smoothstep,
  sub,
  mul,
  texture as tslTexture,
  uv,
  vec4,
} from "three/tsl";
import { NodeMaterial } from "three/webgpu";

interface ImagePlaneProps {
  texture: Texture;
  index: number;
  total: number;
  currentIndexRef: MutableRefObject<number>;
  radius: number;
  imageWidth: number;
  imageHeight: number;
  cornerRadius: number;
  bendAmount: number;
  centerOpacity: number;
  adjacentOpacity: number;
  farOpacity: number;
  onClick?: () => void;
}

export function ImagePlane({
  texture: imageTexture,
  index,
  total,
  currentIndexRef,
  radius,
  imageWidth,
  imageHeight,
  cornerRadius,
  bendAmount,
  centerOpacity,
  adjacentOpacity,
  farOpacity,
  onClick,
}: ImagePlaneProps) {
  const meshRef = useRef<Mesh>(null);
  const { gl } = useThree()

  const angle = (index * Math.PI * 2) / total;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  const getImagePosition = () => {
    let distance = Math.abs(index - currentIndexRef.current);

    if (distance > total / 2) {
      distance = total - distance;
    }

    return distance;
  };

  const getOpacity = () => {
    const position = getImagePosition();

    if (position === 0) return centerOpacity;
    if (position === 1) return adjacentOpacity;
    return farOpacity;
  };

  useFrame(() => {
    if (meshRef.current) {
      // Face outward from the carousel centre.
      const dx = meshRef.current.position.x;
      const dz = meshRef.current.position.z;

      meshRef.current.rotation.y = Math.atan2(dx, dz);
    }

    roundedCornersMaterial.opacity = getOpacity();
  });

  const roundedCornersMaterial = useMemo(() => {
    const material = new NodeMaterial();

    const position = positionLocal;

    // CEMBUNG:
    // The edges move toward the carousel centre relative to the centre
    // of the plane, producing an outward-facing convex surface.
    const normalizedX = div(position.x, imageWidth * 0.5);
    const bendStrength = mul(bendAmount, 2.0);

    // Negative curvature = edges move inward toward the centre.
    const curvature = mul(
      mul(normalizedX, normalizedX),
      mul(bendStrength, -1.0)
    );

    const bentZ = add(position.z, curvature);

    material.positionNode = vec4(
      position.x,
      position.y,
      bentZ,
      1.0
    );

    const uvCoords = uv();
    const imageColor = tslTexture(imageTexture, uvCoords);

    const center = sub(uvCoords, 0.5);
    const d = length(
      max(
        sub(abs(center), 0.5 - cornerRadius),
        0.0
      )
    );

    const mask = smoothstep(
      cornerRadius + 0.01,
      cornerRadius - 0.01,
      d
    );

    const finalColor = mix(
      vec4(0, 0, 0, 0),
      imageColor,
      mask
    );

    material.colorNode = finalColor;
    material.transparent = true;

    // Keep the normal front face.
    material.side = FrontSide;

    return material;
  }, [
    imageTexture,
    cornerRadius,
    bendAmount,
    imageWidth,
  ]);

  return (
    <mesh
      ref={meshRef}
      position={[x, 0, z]}
      material={roundedCornersMaterial}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.();
      }}
      onPointerOver={() => {
        gl.domElement.style.cursor = "pointer";
      }
      }

      onPointerOut={
        () => {
          gl.domElement.style.cursor = "grab"
        }
      }
    >
      <planeGeometry
        args={[
          imageWidth,
          imageHeight,
          32,
          32,
        ]}
      />
    </mesh>
  );
}
