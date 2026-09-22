"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, type MutableRefObject } from "react";
import { Texture, Mesh, FrontSide, NodeMaterial } from "three/webgpu";
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
  uniform,
  uv,
  vec4,
} from "three/tsl";

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
  /** RGB (0-1 range) shown before the image texture is ready. */
  placeholderColor?: [number, number, number];
  onClick?: () => void;
}

// A texture handed to us by a loader is usually the *same* object the
// whole time — the loader mutates `.image` once the network fetch and
// decode finish, rather than swapping in a new Texture instance. So we
// can't tell "loaded" apart from "still loading" just by texture identity;
// we have to inspect the underlying image each frame.
function isTextureImageDecoded(tex: Texture | null | undefined) {
  const image = tex?.image as
    | HTMLImageElement
    | ImageBitmap
    | HTMLCanvasElement
    | HTMLVideoElement
    | undefined;

  if (!image) return false;

  // HTMLImageElement: only "complete" once the network+decode finished,
  // and naturalWidth stays 0 until real pixel data exists (avoids the
  // brief window where `complete` is true but dimensions are still 0).
  if ("complete" in image) {
    const el = image as HTMLImageElement;
    return el.complete && el.naturalWidth > 0;
  }

  // ImageBitmap / canvas / video: width is already meaningful once the
  // object exists.
  if ("width" in image) {
    return image.width > 0;
  }

  return true;
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
  placeholderColor = [0.16, 0.16, 0.19],
  onClick,
}: ImagePlaneProps) {
  const meshRef = useRef<Mesh>(null);
  const { gl } = useThree();

  // Plain-JS eased value driving the uniform, plus a small "hold" counter
  // so we don't start revealing on the very first frame the decode
  // finishes — that's exactly the frame most likely to still be missing
  // its GPU upload, which is what made images look blank despite data
  // and UI already being present.
  const revealRef = useRef(0);
  const readyStreakRef = useRef(0);

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

  const {
    material: roundedCornersMaterial,
    revealUniform,
  } = useMemo(() => {
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
      mul(bendStrength, -1.0),
    );

    const bentZ = add(position.z, curvature);

    material.positionNode = vec4(position.x, position.y, bentZ, 1.0);

    const uvCoords = uv();
    const imageColor = tslTexture(imageTexture, uvCoords);

    const center = sub(uvCoords, 0.5);
    const d = length(max(sub(abs(center), 0.5 - cornerRadius), 0.0));

    const mask = smoothstep(cornerRadius + 0.01, cornerRadius - 0.01, d);

    // Same rounded-corner mask applied to both layers, so the card's
    // shape is visible immediately (as the placeholder) and never pops
    // or resizes when the real image fades in on top of it.
    const placeholderLayer = mix(
      vec4(0, 0, 0, 0),
      vec4(placeholderColor[0], placeholderColor[1], placeholderColor[2], 1.0),
      mask,
    );

    const imageLayer = mix(vec4(0, 0, 0, 0), imageColor, mask);

    const reveal = uniform(0);

    material.colorNode = mix(placeholderLayer, imageLayer, reveal);
    material.transparent = true;

    // Keep the normal front face.
    material.side = FrontSide;

    return { material, revealUniform: reveal };
  }, [
    imageTexture,
    cornerRadius,
    bendAmount,
    imageWidth,
    placeholderColor,
  ]);

  useFrame((_, delta) => {
    if (meshRef.current) {
      // Face outward from the carousel centre.
      const dx = meshRef.current.position.x;
      const dz = meshRef.current.position.z;

      meshRef.current.rotation.y = Math.atan2(dx, dz);
    }

    roundedCornersMaterial.opacity = getOpacity();

    // Require the image to read as decoded for a couple of consecutive
    // frames before we start revealing it, giving the GPU upload time to
    // land so we never crossfade into a still-blank texture.
    const decoded = isTextureImageDecoded(imageTexture);

    readyStreakRef.current = decoded ? readyStreakRef.current + 1 : 0;

    const target = readyStreakRef.current > 1 ? 1 : 0;
    const fadeSpeed = 8; // higher = snappier crossfade

    revealRef.current +=
      (target - revealRef.current) * Math.min(1, delta * fadeSpeed);

    revealUniform.value = revealRef.current;
  });

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
      }}
      onPointerOut={() => {
        gl.domElement.style.cursor = "grab";
      }}
    >
      <planeGeometry args={[imageWidth, imageHeight, 32, 32]} />
    </mesh>
  );
}