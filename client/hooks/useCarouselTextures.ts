"use client";

import { useEffect, useState } from "react";
import {
  DataTexture,
  RGBAFormat,
  SRGBColorSpace,
  Texture,
  TextureLoader,
} from "three";

function createFallbackTexture() {
  const texture = new DataTexture(
    new Uint8Array([
      226,
      226,
      226,
      255,
    ]),
    1,
    1,
    RGBAFormat,
  );

  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;

  return texture;
}

export function useCarouselTextures(
  images: string[],
  textureUrl: (url: string) => string,
) {
  const [textures, setTextures] =
    useState<Texture[]>(() =>
      images.map(() => createFallbackTexture()),
    );

  useEffect(() => {
    let cancelled = false;

    const loader = new TextureLoader();

    loader.crossOrigin = "anonymous";

    // Create fallback texture for every slot.
    const initialTextures = images.map(() =>
      createFallbackTexture(),
    );

    setTextures(initialTextures);

    images.forEach((image, index) => {
      loader.load(
        textureUrl(image),

        // Success
        (texture) => {
          if (cancelled) {
            texture.dispose();
            return;
          }

          texture.colorSpace = SRGBColorSpace;
          texture.needsUpdate = true;

          setTextures((current) => {
            const next = [...current];

            // Dispose the fallback texture
            // that occupied this slot.
            next[index]?.dispose();

            next[index] = texture;

            return next;
          });
        },

        // Progress
        undefined,

        // Error
        () => {
          // Keep the existing fallback texture.
          // Nothing else needs to happen.
        },
      );
    });

    return () => {
      cancelled = true;

      initialTextures.forEach((texture) => {
        texture.dispose();
      });
    };
  }, [images, textureUrl]);

  return textures;
}
