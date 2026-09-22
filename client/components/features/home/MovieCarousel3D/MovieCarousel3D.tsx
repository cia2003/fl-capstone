"use client";

import { Canvas, type GLProps } from "@react-three/fiber";
import { useImperativeHandle, useState, useMemo, Suspense, useRef, type Ref } from "react";
import { WebGPURenderer, WebGPURendererParameters, PCFShadowMap } from "three/webgpu"
import type { Film } from "@/types";
import { CarouselControls, type CarouselControlValues } from "./CarouselControls";
import { CarouselScene } from "./CarouselScene";
import { useRouter } from "next/navigation";

type R3FDefaultGLProps = Parameters<
    Extract<GLProps, (...args: never[]) => unknown>
>[0];

export type MovieCarousel3DHandle = {
    goToPrevious: () => void;
    goToNext: () => void;
    focusActiveSlide: () => void;
};

async function createWebGpuRenderer(props: R3FDefaultGLProps) {
    const renderer = new WebGPURenderer(
        { ...props, alpha: true } as WebGPURendererParameters
    )

    await renderer.init()
    
    renderer.shadowMap.type = PCFShadowMap
    renderer.setClearColor(0x000000, 0)

    return renderer
}


const defaultControls: CarouselControlValues = {
    radius: 5.8,
    imageWidth: 2.85,
    imageHeight: 4.05,
    cornerRadius: 0.05,
    bendAmount: 0.1,
    backgroundColor: "transparent",
    centerOpacity: 1.0,
    adjacentOpacity: 0.9,
    farOpacity: 0.8,
    friction: 90,
    wheelSensitivity: 100,
    dragSensitivity: 300,
    enableSnapping: true,
};

export function MovieCarousel3D({
    films,
    isPaused = false,
    ref,
}: {
    films: Film[];
    isPaused?: boolean;
    ref?: Ref<MovieCarousel3DHandle>;
}) {
    const router = useRouter()
    const [activeIndex, setActiveIndex] = useState(0);
    const [controls, setControls] = useState(defaultControls);
    const topFilms = useMemo(() => films.slice(0, 9), [films]);
    const activeSlideRef = useRef<HTMLButtonElement>(null);

    const images = useMemo(
    () => topFilms.map((film) => film.image),
    [topFilms]
    );

    const handleFilmClick = (index: number) => {
        const film = topFilms[index];
        if (film) router.push(`/films/${film.id}`)
    }
    function updateControl<Key extends keyof CarouselControlValues>(key: Key, value: CarouselControlValues[Key]) {
        setControls((current) => ({ ...current, [key]: value }));
    }

    useImperativeHandle(
        ref,
        () => ({
            goToPrevious: () =>
                setActiveIndex((i) => (i - 1 + topFilms.length) % topFilms.length),
            goToNext: () => setActiveIndex((i) => (i + 1) % topFilms.length),
            focusActiveSlide: () => {
                requestAnimationFrame(() => activeSlideRef.current?.focus());
            },
        }),
        [topFilms.length],
    );

  return (

    <section className="mx-5 md:mx-10 lg:mx-16 min-[1440px]:mx-24">
        <div className="mx-auto max-w-[1280px] pt-section-mobile md:pt-section-desktop">
            <h2 className="mb-4 text-2xl font-semibold">Top Movies</h2>
            <p className="mb-6 text-sm text-muted-foreground">
                Explore the top-rated Studio Ghibli movies based on their Rotten Tomatoes scores.
            </p>
        </div>

        <div className="relative h-[500px] w-full">
            <Canvas
                camera={{ position: [0, 0, 11], fov: 55 }}
                shadows={false}
                gl={createWebGpuRenderer}
                frameloop={isPaused ? "never" : "always"}
                style={{
                    width: "100%",
                    height: "100%",
                    background: "transparent",
                }}
            >
                <Suspense fallback={null}>
                    <CarouselScene
                        images={images}
                        selectedIndex={activeIndex}
                        onIndexChange={setActiveIndex}
                        radius={controls.radius}
                        imageWidth={controls.imageWidth}
                        imageHeight={controls.imageHeight}
                        cornerRadius={controls.cornerRadius}
                        bendAmount={controls.bendAmount}
                        centerOpacity={controls.centerOpacity}
                        adjacentOpacity={controls.adjacentOpacity}
                        farOpacity={controls.farOpacity}
                        friction={controls.friction / 100}
                        wheelSensitivity={controls.wheelSensitivity}
                        dragSensitivity={controls.dragSensitivity}
                        enableSnapping={controls.enableSnapping}
                        onImageClick={handleFilmClick}
                    />
                </Suspense>
            </Canvas>
            {topFilms[activeIndex] && (
                <button
                    ref={activeSlideRef}
                    type="button"
                    tabIndex={-1}
                    aria-label={`Open ${topFilms[activeIndex].title}`}
                    onClick={() => handleFilmClick(activeIndex)}
                    className="pointer-events-none absolute left-1/2 top-[200px] h-[min(56vw,360px)] w-[min(38vw,250px)] -translate-x-1/2 -translate-y-1/2 rounded-xl focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-accent"
                />
            )}
        </div>
        <div className="-mt-8 sm:-mt-18">
            <CarouselControls
                activeIndex={activeIndex}
                films={topFilms}
                values={controls}
                onChange={updateControl}
                onPrevious={() => setActiveIndex((index) => (index - 1 + topFilms.length) % topFilms.length)}
                onNext={() => setActiveIndex((index) => (index + 1) % topFilms.length)}
                onSelect={setActiveIndex}
            />
        </div>
        </section>

  );
}