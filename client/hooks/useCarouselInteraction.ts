// hooks/useCarouselInteraction.ts

"use client";

import { useEffect } from "react";
import type { CarouselInteractionProps } from "@/types/carouselsceneconfig";

export function useCarouselInteraction({
  gl,
  images,
  wheelSensitivity,
  dragSensitivity,
  rotationRef,
  velocityRef,
  isDragging,
  isVerticalDrag,
  currentIndexRef,
  targetRotationRef,
  isSnapping,
  isSnapSuppressed,
  snapToIndex,
  onImageClick,
}: CarouselInteractionProps) {
  useEffect(() => {
    const canvas = gl.domElement;

    const previousTouchAction =
      canvas.style.touchAction;

    let activePointerId: number | null =
      null;
    
    let activePointerType: PointerEvent["pointerType"] | null = null

    let dragStartX = 0;
    let dragStartY = 0;
    let lastMouseX = 0;
    let lastMoveTime = 0;

    const handleWheel = (
      event: WheelEvent,
    ) => {
      if (event.deltaX === 0) return;

      event.preventDefault();

      const wheelForce =
        -event.deltaX *
        wheelSensitivity *
        0.00001;

      velocityRef.current += wheelForce;

      isSnapSuppressed.current = false;
      isSnapping.current = false;
    };

    const beginDrag = (
      clientX: number,
      clientY: number,
    ) => {
      isDragging.current = true;
      isVerticalDrag.current = false;

      dragStartX = clientX;
      dragStartY = clientY;
      lastMouseX = clientX;
      lastMoveTime = performance.now();

      // Stop any in-flight snap/inertia the moment the user grabs the carousel.
      isSnapping.current = false;
      velocityRef.current = 0;
    };

    const updateDrag = (
      clientX: number,
      clientY: number,
    ) => {
      if (!isDragging.current) return;

      const deltaX =
        clientX - dragStartX;

      const deltaY =
        clientY - dragStartY;

      if (
        !isVerticalDrag.current &&
        Math.abs(deltaY) > Math.abs(deltaX)
      ) {
        isVerticalDrag.current = true;

        velocityRef.current = 0;

        targetRotationRef.current =
          rotationRef.current;

        isSnapping.current = false;
        isSnapSuppressed.current = true;
      }

      if (isVerticalDrag.current) {
        return;
      }

      isSnapSuppressed.current = false;

      const now = performance.now();
      const dt = Math.max(
        now - lastMoveTime,
        1,
      );

      const frameDeltaX =
        clientX - lastMouseX;

      // Follow the pointer: translate horizontal pixel movement into
      // rotation directly, instead of only reacting on pointerup.
      const rotationDelta =
        frameDeltaX *
        dragSensitivity *
        0.01;

      rotationRef.current += rotationDelta;

      // Track instantaneous speed so we can hand off inertia on release.
      velocityRef.current =
        (rotationDelta / dt) * 16.67;

      lastMouseX = clientX;
      lastMoveTime = now;
    };

    const endDrag = () => {
      if (
        isDragging.current &&
        !isVerticalDrag.current
      ) {
        const dragDeltaX = lastMouseX - dragStartX;

        const dragDistance = Math.abs(
          lastMouseX - dragStartX,
        );

        const flickThreshold = 40;

        if (activePointerType === "touch") {
            if (dragDistance >= flickThreshold) {
                const direction = dragDeltaX < 0 ? 1 : -1;

                snapToIndex(
                    currentIndexRef.current + direction,
                )
            } else {
                snapToIndex(
                    currentIndexRef.current
                )
            }
        } else if (
            Math.abs(velocityRef.current) >
                0.0005 ||
            dragDistance >= flickThreshold
        ) {
            isSnapSuppressed.current = false;
        } else {
            snapToIndex(currentIndexRef.current)
        }
      }

      isDragging.current = false;
      isVerticalDrag.current = false;
    };

    const finishPointer = (
      pointerId: number,
    ) => {
      if (
        canvas.hasPointerCapture(
          pointerId,
        )
      ) {
        canvas.releasePointerCapture(
          pointerId,
        );
      }

      activePointerId = null;
      canvas.style.cursor = "grab";
    };

    const handlePointerDown = (
      event: PointerEvent,
    ) => {
      if (
        event.pointerType === "mouse" &&
        event.button !== 0
      ) {
        return;
      }

      activePointerId = event.pointerId;
      activePointerType = event.pointerType;

      beginDrag(
        event.clientX,
        event.clientY,
      );

      canvas.setPointerCapture(
        event.pointerId,
      );

      canvas.style.cursor = "grabbing";
    };

    const handlePointerMove = (
      event: PointerEvent,
    ) => {
      if (
        event.pointerId !==
        activePointerId
      ) {
        return;
      }

      updateDrag(
        event.clientX,
        event.clientY,
      );
    };

    const handlePointerEnd = (
      event: PointerEvent,
    ) => {
      if (
        event.pointerId !==
        activePointerId
      ) {
        return;
      }
      endDrag();
      finishPointer(event.pointerId);
    };

    const handlePointerCancel = (
      event: PointerEvent,
    ) => {
      if (
        event.pointerId !==
        activePointerId
      ) {
        return;
      }

      isDragging.current = false;
      isVerticalDrag.current = false;

      finishPointer(event.pointerId);
    };

    canvas.style.cursor = "grab";
    canvas.style.touchAction = "pan-y";

    canvas.addEventListener(
      "wheel",
      handleWheel,
      { passive: false },
    );

    canvas.addEventListener(
      "pointerdown",
      handlePointerDown,
    );

    canvas.addEventListener(
      "pointermove",
      handlePointerMove,
    );

    canvas.addEventListener(
      "pointerup",
      handlePointerEnd,
    );

    canvas.addEventListener(
      "pointercancel",
      handlePointerCancel,
    );

    return () => {
      canvas.removeEventListener(
        "wheel",
        handleWheel,
      );

      canvas.removeEventListener(
        "pointerdown",
        handlePointerDown,
      );

      canvas.removeEventListener(
        "pointermove",
        handlePointerMove,
      );

      canvas.removeEventListener(
        "pointerup",
        handlePointerEnd,
      );

      canvas.removeEventListener(
        "pointercancel",
        handlePointerCancel,
      );

      canvas.style.touchAction =
        previousTouchAction;
    };
  }, [
    gl.domElement,
    images,
    wheelSensitivity,
    dragSensitivity,
    rotationRef,
    velocityRef,
    isDragging,
    isVerticalDrag,
    currentIndexRef,
    targetRotationRef,
    isSnapping,
    isSnapSuppressed,
    snapToIndex,
    onImageClick,
  ]);
}