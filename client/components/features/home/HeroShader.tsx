"use client"

import { useEffect, useRef } from "react"

// // Global Variable

// const RENDER_SCALE = 0.5;
// const REDUCED_MOTION_TIME = 8;

// type Three = Pick<
//     typeof import ("three"), 
//     | "WebGLRenderer"
//     | "Scene"
//     | "OrthographicCamera"
//     | "PlaneGeometry"
//     | "ShaderMaterial"
//     | "Mesh"
//     | "Vector2"
//     | "NoBlending"
// >

type HeroShaderProps = {
    className?: string;
    horizon?: number;
    intensity?: number;
}

export function HeroShader({
    className = "", 
    horizon = 0.35, 
    intensity = 0.85
}: HeroShaderProps) {
    return (
        <div></div>
    )
}