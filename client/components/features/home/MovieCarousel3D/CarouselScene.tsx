"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { TextureLoader, Group, Texture, RGBAFormat, SRGBColorSpace, DataTexture } from "three";
import { ImagePlane } from "./ImagePlane";

const TMDB_IMAGE_HOSTS = new Set(["image.tmdb.org", "www.themoviedb.org"]);

function textureUrl(imageUrl: string) {
  try {
    const url = new URL(imageUrl);
    const isTmdbPoster =
      url.protocol === "https:" &&
      TMDB_IMAGE_HOSTS.has(url.hostname) &&
      url.pathname.startsWith("/t/p/");

    if (isTmdbPoster) {
      return `/api/tmdb-image?url=${encodeURIComponent(url.toString())}`;
    }
  } catch {
    // Relative or malformed non-TMDB URLs retain their existing behaviour.
  }

  return imageUrl;
}

interface CarouselSceneProps {
  images?: string[];
  radius?: number;
  imageWidth?: number;
  imageHeight?: number;
  cornerRadius?: number;
  bendAmount?: number;
  centerOpacity?: number;
  adjacentOpacity?: number;
  farOpacity?: number;
  friction?: number;
  wheelSensitivity?: number;
  dragSensitivity?: number;
  enableSnapping?: boolean;
  selectedIndex?: number;
  onIndexChange?: (index: number) => void;
  onImageClick?: (index: number) => void
}

export function CarouselScene({
  images = [],
  radius = 5,
  imageWidth = 3,
  imageHeight = 4,
  cornerRadius = 0.15,
  bendAmount = 0.3,
  centerOpacity = 1.0,
  adjacentOpacity = 0.7,
  farOpacity = 0.3,
  friction = 0.95,
  wheelSensitivity = 0.002,
  enableSnapping = true,
  selectedIndex,
  onIndexChange,
  onImageClick,
}: CarouselSceneProps) {
  const groupRef = useRef<Group>(null);
  const { gl } = useThree();

  // Smooth rotation state
  const rotationRef = useRef(0);
  const velocityRef = useRef(0);
  const isDragging = useRef(false);
  const isVerticalDrag = useRef(false);
  const activePointerId = useRef<number | null>(null);
  const dragStartX = useRef(0);
  const dragStartY = useRef(0);
  const lastMouseX = useRef(0);
  const currentIndexRef = useRef(0);
  const publishedIndexRef = useRef(selectedIndex ?? 0);
  const snapTargetIndexRef = useRef(0);
  const targetRotationRef = useRef(0);
  const isSnapping = useRef(false);
  const isSnapSuppressed = useRef(false);

  const [textures, setTextures] = useState<Texture[]>([]);

  const handleImageClick =(index: number) => {
    const dragDistance = Math.abs(lastMouseX.current - dragStartX.current);

    if (dragDistance > 5) return;
    onImageClick?.(index)
  }
  const snapToIndex = (index: number) => {
    if (!images.length) return;

    const anglePerImage = (Math.PI * 2) / images.length;
    const targetRotation = -(index * anglePerImage);
    const currentRotation = rotationRef.current;
    const rotations = [
      targetRotation,
      targetRotation + Math.PI * 2,
      targetRotation - Math.PI * 2,
    ];

    targetRotationRef.current = rotations.reduce((closest, rotation) =>
      Math.abs(rotation - currentRotation) < Math.abs(closest - currentRotation)
        ? rotation
        : closest,
    );
    snapTargetIndexRef.current = index;
    velocityRef.current = 0;
    isSnapSuppressed.current = false;
    isSnapping.current = true;
  };

  useEffect(() => {
    let cancelled = false;
    const loader = new TextureLoader();
    // OLD / DEBUG: `crossOrigin = "anonymous"` relied on TMDB returning CORS
    // headers. Textures now load through the same-origin Next.js proxy instead.
    loader.crossOrigin = "anonymous";

    const fallbackTexture = () => {
      const texture = new DataTexture(
        new Uint8Array([226, 226, 226, 255]),
        1,
        1,
        RGBAFormat,
      );
      texture.colorSpace = SRGBColorSpace;
      texture.needsUpdate = true;
      return texture;
    };

    const loadedTextures = images.map(
      (image) =>
        new Promise<Texture>((resolve) => {
          loader.load(
            textureUrl(image),
            (texture) => {
              texture.colorSpace = SRGBColorSpace;
              resolve(texture);
            },
            undefined,
            () => resolve(fallbackTexture()),
          );
        }),
    );

    Promise.all(loadedTextures).then((loaded) => {
      if (!cancelled) setTextures(loaded);
      else loaded.forEach((texture) => texture.dispose());
    });

    return () => {
      cancelled = true;
    };
  }, [images]);

  // Arrow and dot navigation use the same animated snap target as wheel/drag.
  useEffect(() => {
    if (selectedIndex === undefined || !images.length) return;

    publishedIndexRef.current = selectedIndex;
    if (selectedIndex !== currentIndexRef.current || isSnapping.current) {
      snapToIndex(selectedIndex);
    }
  }, [images.length, selectedIndex]);

  // Mouse wheel handler
  const handleWheel = (event: WheelEvent) => {
    // A wheel gesture only drives the carousel on its horizontal axis.
    // Vertical scrolling is left alone so it can continue to scroll the page.
    if (event.deltaX === 0) return;

    event.preventDefault();
    const wheelForce = -event.deltaX * wheelSensitivity * 0.00001;
    velocityRef.current += wheelForce;
    isSnapSuppressed.current = false;
    isSnapping.current = false;
  };

  const beginDrag = (clientX: number, clientY: number) => {
    isDragging.current = true;
    isVerticalDrag.current = false;
    dragStartX.current = clientX;
    dragStartY.current = clientY;
    lastMouseX.current = clientX;
  };

  const updateDrag = (clientX: number, clientY: number) => {
    if (!isDragging.current) return;

    const deltaX = clientX - dragStartX.current;
    const deltaY = clientY - dragStartY.current;

    // A vertical gesture must never become a carousel swipe, even if it later
    // moves horizontally. Carousel drag direction is determined from X only.
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      isVerticalDrag.current = true;
      // A vertical gesture owns this interaction. Stop any wheel momentum or
      // in-progress snap immediately so it cannot move the carousel.
      velocityRef.current = 0;
      targetRotationRef.current = rotationRef.current;
      isSnapping.current = false;
      isSnapSuppressed.current = true;
    }

    // Keep the drag position on the horizontal axis only. In particular, do
    // not use deltaY as a substitute rotation when the gesture is vertical.
    if (!isVerticalDrag.current) {
      isSnapSuppressed.current = false;
      lastMouseX.current = clientX;
    }
  };

  const endDrag = () => {
    if (isDragging.current && !isVerticalDrag.current) {
      const deltaX = lastMouseX.current - dragStartX.current;
      const swipeThreshold = 40;

      if (Math.abs(deltaX) >= swipeThreshold) {
        isSnapSuppressed.current = false;
        const direction = deltaX < 0 ? 1 : -1;
        const nextIndex =
          (currentIndexRef.current + direction + images.length) % images.length;
        snapToIndex(nextIndex);
      }
    }
    isDragging.current = false;
    isVerticalDrag.current = false;
  };

  // Pointer Events provide the same axis-locking behaviour for both mouse and
  // touch interactions. Wheel input deliberately remains on its own handler.
  const handlePointerDown = (event: PointerEvent) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    activePointerId.current = event.pointerId;
    beginDrag(event.clientX, event.clientY);
    gl.domElement.setPointerCapture(event.pointerId);
    gl.domElement.style.cursor = "grabbing";
  };

  const handlePointerMove = (event: PointerEvent) => {
    if (event.pointerId !== activePointerId.current) return;
    updateDrag(event.clientX, event.clientY);
  };

  const handlePointerEnd = (event: PointerEvent) => {
    if (event.pointerId !== activePointerId.current) return;

    endDrag();
    finishPointer(event.pointerId);
  };

  const finishPointer = (pointerId: number) => {
    if (gl.domElement.hasPointerCapture(pointerId)) {
      gl.domElement.releasePointerCapture(pointerId);
    }
    activePointerId.current = null;
    gl.domElement.style.cursor = "grab";
  };

  const handlePointerCancel = (event: PointerEvent) => {
    if (event.pointerId !== activePointerId.current) return;

    isDragging.current = false;
    isVerticalDrag.current = false;
    finishPointer(event.pointerId);
  };

  // Event listeners setup
  useEffect(() => {
    const canvas = gl.domElement;
    const previousTouchAction = canvas.style.touchAction;

    canvas.style.cursor = "grab";
    canvas.style.touchAction = "pan-y";
    canvas.addEventListener("wheel", handleWheel, { passive: false });
    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerup", handlePointerEnd);
    canvas.addEventListener("pointercancel", handlePointerCancel);

    return () => {
      canvas.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", handlePointerEnd);
      canvas.removeEventListener("pointercancel", handlePointerCancel);
      canvas.style.touchAction = previousTouchAction;
    };
  }, [gl.domElement]);

  // Smooth animation with friction and snapping
  useFrame((state, delta) => {
    if (groupRef.current) {
      const velocityThreshold = 0.002;

      // Apply friction using delta time for frame-rate independence
      const frictionFactor = Math.pow(friction, delta * 60); // Normalize to 60fps
      velocityRef.current *= frictionFactor;

      // Check if we should start snapping
      if (
        enableSnapping &&
        !isDragging.current &&
        !isSnapSuppressed.current &&
        !isSnapping.current &&
        Math.abs(velocityRef.current) < velocityThreshold
      ) {
        // Calculate which image we're closest to
        const anglePerImage = (Math.PI * 2) / images.length;
        const currentRotation = rotationRef.current;

        // Simple and reliable snapping logic
        const currentAngle = -currentRotation; // Convert back to positive angle
        const normalizedAngle =
          ((currentAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);

        // Find which image we're closest to
        const imageFloat = normalizedAngle / anglePerImage;
        const nearestImageIndex = Math.round(imageFloat) % images.length;

        snapToIndex(nearestImageIndex);
      }

      // Handle snapping animation
      if (isSnapping.current) {
        let diff = targetRotationRef.current - rotationRef.current;

        // Handle wraparound - choose shortest path
        if (Math.abs(diff) > Math.PI) {
          if (diff > 0) {
            diff -= Math.PI * 2;
          } else {
            diff += Math.PI * 2;
          }
        }

        const snapSpeed = 0.15;

        if (Math.abs(diff) < 0.005) {
          rotationRef.current = targetRotationRef.current;
          isSnapping.current = false;

          const settledIndex = snapTargetIndexRef.current;
          currentIndexRef.current = settledIndex;
          if (publishedIndexRef.current !== settledIndex) {
            publishedIndexRef.current = settledIndex;
            onIndexChange?.(settledIndex);
          }
        } else {
          rotationRef.current += diff * snapSpeed;
        }
      } else {
        // Update rotation normally with delta time
        rotationRef.current += velocityRef.current * delta * 60; // Normalize to 60fps
      }

      // Apply smooth rotation to the group
      groupRef.current.rotation.y = rotationRef.current;

      // Update current index based on rotation
      const anglePerImage = (Math.PI * 2) / images.length;
      const currentAngle = -rotationRef.current;
      const normalizedAngle =
        ((currentAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      const newIndex =
        Math.round(normalizedAngle / anglePerImage) % images.length;

      currentIndexRef.current = newIndex;
    }
  });

  if (!images.length || textures.length !== images.length) return null;

  return (
    <group ref={groupRef} position={[0, 0.5, 0]}>
      {images.map((image, index) => (
        <ImagePlane
          key={`${image}-${index}`}
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
          onClick={() => handleImageClick(index)}
        />
      ))}

      {/* Center light */}
      <pointLight position={[0, 2, 0]} intensity={0.5} />
      <ambientLight intensity={0.3} />
    </group>
  );
}
