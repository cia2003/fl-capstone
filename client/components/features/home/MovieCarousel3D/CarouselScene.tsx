"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import type { Group } from "three";
import { ImagePlane } from "./ImagePlane";
import { useCarouselMotion, runCarouselAnimation } from "@/hooks/useCarouselMotion";
import { useCarouselInteraction } from "@/hooks/useCarouselInteraction";
import { useCarouselTextures } from "@/hooks/useCarouselTextures";
import type { CarouselSceneConfig } from "@/types/carouselsceneconfig";

const TMDB_IMAGE_HOSTS = new Set([
  "image.tmdb.org",
  "www.themoviedb.org",
]);

function textureUrl(imageUrl: string) {
  try {
    const url = new URL(imageUrl);

    const isTmdbPoster =
      url.protocol === "https:" &&
      TMDB_IMAGE_HOSTS.has(url.hostname) &&
      url.pathname.startsWith("/t/p/");

    if (isTmdbPoster) {
      return `/api/tmdb-image?url=${encodeURIComponent(
        url.toString(),
      )}`;
    }
  } catch {
    // Keep the original URL for relative or malformed URLs.
  }

  return imageUrl;
}

type CarouselSceneProps = {
  config: CarouselSceneConfig;
};

export function CarouselScene({
  config,
}: CarouselSceneProps) {
  const activePointerId = useRef<number |null>(null);
  const dragStartX = useRef(0)
  const dragStartY = useRef(0)
  const lastMouseX = useRef(0)

  const {
    images,
    radius,
    imageWidth,
    imageHeight,
    cornerRadius,
    bendAmount,
    centerOpacity,
    adjacentOpacity,
    farOpacity,
    friction,
    wheelSensitivity,
    dragSensitivity,
    enableSnapping,
    selectedIndex,
    onIndexChange,
    onImageClick,
  } = config;

  const groupRef = useRef<Group>(null);
  const { gl } = useThree();

  const {
    rotationRef,
    velocityRef,
    isDragging,
    isVerticalDrag,
    currentIndexRef,
    publishedIndexRef,
    snapTargetIndexRef,
    targetRotationRef,
    isSnapping,
    isSnapSuppressed,
    snapToIndex,
  } = useCarouselMotion({
    images,
    selectedIndex,
  });

  const textures = useCarouselTextures(
    images,
    textureUrl,
  );

  useCarouselInteraction({
    gl,
    images,
    wheelSensitivity,
    dragSensitivity,
    rotationRef,
    velocityRef,
    isDragging,
    isVerticalDrag,
    activePointerId,
    dragStartX,
    dragStartY,
    lastMouseX,
    currentIndexRef,
    publishedIndexRef,
    snapTargetIndexRef,
    targetRotationRef,
    isSnapping,
    isSnapSuppressed,
    snapToIndex,
    onImageClick,
  });

  useEffect(() => {
    if (
      selectedIndex === undefined ||
      !images.length
    ) {
      return;
    }

    publishedIndexRef.current = selectedIndex;

    if (
      selectedIndex !== currentIndexRef.current ||
      isSnapping.current
    ) {
      snapToIndex(selectedIndex);
    }
  }, [
    images.length,
    selectedIndex,
    publishedIndexRef,
    currentIndexRef,
    isSnapping,
    snapToIndex,
  ]);

  useFrame((_, delta) => {
    // runCarouselAnimation is a plain function (not a hook) that mutates
    // the refs above in place — safe to call every frame from here.
    runCarouselAnimation({
      groupRef,
      images,
      friction,
      enableSnapping,
      delta,
      rotationRef,
      velocityRef,
      isDragging,
      isVerticalDrag,
      currentIndexRef,
      publishedIndexRef,
      snapTargetIndexRef,
      targetRotationRef,
      isSnapping,
      isSnapSuppressed,
      snapToIndex,
      onIndexChange,
    });
  });

  if (
    !images.length ||
    textures.length !== images.length
  ) {
    return null;
  }

  return (
    <group
      ref={groupRef}
      position={[0, 0.5, 0]}
    >
      {images.map((image, index) => (
        <ImagePlane
          key={image}
          texture={textures[index]}
          index={index}
          total={images.length}
          currentIndexRef={currentIndexRef}
          radius={radius}
          imageWidth={imageWidth}
          imageHeight={imageHeight}
          cornerRadius={cornerRadius}
          bendAmount={bendAmount}
          centerOpacity={centerOpacity}
          adjacentOpacity={adjacentOpacity}
          farOpacity={farOpacity}
          onClick={() => onImageClick(index)}
        />
      ))}

      <pointLight
        position={[0, 2, 0]}
        intensity={0.5}
      />

      <ambientLight intensity={0.3} />
    </group>
  );
}