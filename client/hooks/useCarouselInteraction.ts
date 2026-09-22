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
  activePointerId,
  dragStartX,
  dragStartY,
  lastMouseX,
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

    let activePointerType:
      | PointerEvent["pointerType"]
      | null = null;

    const handleWheel = (event: WheelEvent) => {
      // Only horizontal wheel input controls the carousel.
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

      dragStartX.current = clientX;
      dragStartY.current = clientY;
      lastMouseX.current = clientX;

      // Stop any existing snap/inertia when grabbing.
      velocityRef.current = 0;
      isSnapping.current = false;
    };

    const updateDrag = (
        clientX: number,
        clientY: number,
    ) => {
    if (!isDragging.current) return;

    const deltaX =
        clientX - dragStartX.current;

    const deltaY =
        clientY - dragStartY.current;

    /*
    * TOUCH
    *
    * Vertical movement owns the gesture.
    * This prevents a vertical mobile scroll from
    * accidentally becoming a carousel swipe.
    */
    if (activePointerType === "touch") {
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
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
        lastMouseX.current = clientX;

        return;
    }

    /*
    * MOUSE
    *
    * Keep the existing vertical-lock behaviour,
    * but allow horizontal dragging to control the carousel.
    */
    if (activePointerType === "mouse") {
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

        const frameDeltaX =
        clientX - lastMouseX.current;

        const rotationDelta =
        frameDeltaX *
        dragSensitivity *
        0.00001;

        rotationRef.current += rotationDelta;

        velocityRef.current = rotationDelta;

        lastMouseX.current = clientX;
    }
    };
    const endDrag = () => {
      if (
        !isDragging.current ||
        isVerticalDrag.current
      ) {
        isDragging.current = false;
        isVerticalDrag.current = false;
        return;
      }

      const deltaX =
        lastMouseX.current -
        dragStartX.current;

      const swipeThreshold = 40;

      if (
        Math.abs(deltaX) >=
        swipeThreshold
      ) {
        const direction =
          deltaX < 0 ? 1 : -1;

        const nextIndex =
          (
            currentIndexRef.current +
            direction +
            images.length
          ) % images.length;

        velocityRef.current = 0;
        isSnapSuppressed.current = false;

        snapToIndex(nextIndex);
      } else {
        /*
         * Not enough movement:
         * return to the current film.
         */
        velocityRef.current = 0;
        isSnapSuppressed.current = false;

        snapToIndex(
          currentIndexRef.current,
        );
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

      activePointerId.current = null;
      activePointerType = null;

      canvas.style.cursor = "grab";
    };

    const handlePointerDown = (
      event: PointerEvent,
    ) => {
      // Only respond to the primary mouse button.
      if (
        event.pointerType === "mouse" &&
        event.button !== 0
      ) {
        return;
      }

      activePointerId.current =
        event.pointerId;

      activePointerType =
        event.pointerType;

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
        activePointerId.current
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
        activePointerId.current
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
        activePointerId.current
      ) {
        return;
      }

      isDragging.current = false;
      isVerticalDrag.current = false;
      velocityRef.current = 0;

      finishPointer(event.pointerId);
    };

    canvas.style.cursor = "grab";

    /*
     * Allow normal vertical page scrolling on mobile.
     *
     * Horizontal movement is handled by Pointer Events.
     */
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
    activePointerId,
    dragStartX,
    dragStartY,
    lastMouseX,
    currentIndexRef,
    targetRotationRef,
    isSnapping,
    isSnapSuppressed,
    snapToIndex,
    onImageClick,
  ]);
}