// hooks/useCarouselMotion.ts

"use client";

import { useCallback, useRef } from "react";
import type {
  CarouselMotionRefs,
} from "@/types/carouselsceneconfig";

import type { CarouselAnimationProps } from "@/types/carouselsceneconfig";

type Props = {
  images: string[];
  selectedIndex?: number;
};

export function useCarouselMotion({
  images,
  selectedIndex = 0,
}: Props) {
  const rotationRef = useRef(0);
  const velocityRef = useRef(0);

  const isDragging = useRef(false);
  const isVerticalDrag = useRef(false);

  const currentIndexRef = useRef(0);
  const publishedIndexRef =
    useRef(selectedIndex);

  const snapTargetIndexRef = useRef(0);
  const targetRotationRef = useRef(0);

  const isSnapping = useRef(false);
  const isSnapSuppressed = useRef(false);

  const snapToIndex = useCallback(
    (index: number) => {
      if (!images.length) return;

      const anglePerImage =
        (Math.PI * 2) / images.length;

      const targetRotation =
        -(index * anglePerImage);

      const currentRotation =
        rotationRef.current;

      const rotations = [
        targetRotation,
        targetRotation + Math.PI * 2,
        targetRotation - Math.PI * 2,
      ];

      targetRotationRef.current =
        rotations.reduce(
          (closest, rotation) =>
            Math.abs(
              rotation - currentRotation,
            ) <
            Math.abs(
              closest - currentRotation,
            )
              ? rotation
              : closest,
        );

      snapTargetIndexRef.current = index;
      velocityRef.current = 0;
      isSnapSuppressed.current = false;
      isSnapping.current = true;
    },
    [images.length],
  );

  const refs: CarouselMotionRefs = {
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
  };

  return {
    ...refs,
    snapToIndex,
  };
}

export function runCarouselAnimation({
  groupRef,
  images,
  friction,
  enableSnapping,
  delta,
  rotationRef,
  velocityRef,
  isDragging,
  currentIndexRef,
  publishedIndexRef,
  snapTargetIndexRef,
  targetRotationRef,
  isSnapping,
  isSnapSuppressed,
  snapToIndex,
  onIndexChange,
}: CarouselAnimationProps) {
  if (!groupRef.current || !images.length) {
    return;
  }

  const velocityThreshold = 0.002;

  const frictionFactor = Math.pow(
    friction,
    delta * 60,
  );

  if (!isDragging.current) {
    // Only decay velocity when the user isn't actively driving it;
    // while dragging, useCarouselInteraction sets velocityRef directly
    // each pointermove so we don't want friction fighting that here.
    velocityRef.current *= frictionFactor;
  }

  if (
    enableSnapping &&
    !isDragging.current &&
    !isSnapSuppressed.current &&
    !isSnapping.current &&
    Math.abs(velocityRef.current) <
      velocityThreshold
  ) {
    const anglePerImage =
      (Math.PI * 2) / images.length;

    const currentRotation =
      rotationRef.current;

    const currentAngle =
      -currentRotation;

    const normalizedAngle =
      ((currentAngle % (Math.PI * 2)) +
        Math.PI * 2) %
      (Math.PI * 2);

    const imageFloat =
      normalizedAngle / anglePerImage;

    const nearestImageIndex =
      Math.round(imageFloat) %
      images.length;

    snapToIndex(nearestImageIndex);
  }

  if (isSnapping.current) {
    let diff =
      targetRotationRef.current -
      rotationRef.current;

    if (Math.abs(diff) > Math.PI) {
      if (diff > 0) {
        diff -= Math.PI * 2;
      } else {
        diff += Math.PI * 2;
      }
    }

    const snapSpeed = 0.15;

    if (Math.abs(diff) < 0.005) {
      rotationRef.current =
        targetRotationRef.current;

      isSnapping.current = false;

      const settledIndex =
        snapTargetIndexRef.current;

      currentIndexRef.current =
        settledIndex;

      if (
        publishedIndexRef.current !==
        settledIndex
      ) {
        publishedIndexRef.current =
          settledIndex;

        onIndexChange(settledIndex);
      }
    } else {
      rotationRef.current +=
        diff * snapSpeed;
    }
  } else if (!isDragging.current) {
    // While actively dragging, rotationRef is already being updated
    // directly by useCarouselInteraction's pointermove handler — applying
    // velocity here too would double-count that movement.
    rotationRef.current +=
      velocityRef.current *
      delta *
      60;
  }

  groupRef.current.rotation.y =
    rotationRef.current;

  const anglePerImage =
    (Math.PI * 2) / images.length;

  const currentAngle =
    -rotationRef.current;

  const normalizedAngle =
    ((currentAngle % (Math.PI * 2)) +
      Math.PI * 2) %
    (Math.PI * 2);

  const newIndex =
    Math.round(
      normalizedAngle /
        anglePerImage,
    ) % images.length;

  currentIndexRef.current = newIndex;
}