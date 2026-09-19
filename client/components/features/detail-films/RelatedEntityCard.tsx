"use client"

import { useId, useState } from "react"
import { KIND_LABEL, type RelatedEntity } from "@/types/entities"

/**
 * Palet pemandangan (langit, matahari, bukit jauh, bukit dekat).
 * Warnanya diredam supaya tetap serasi dengan latar krem dan aksen merah kartu.
 */
const SCENES = [
  { sky: "#CFE3E8", sun: "#FBE7B5", far: "#8FB9A8", near: "#5E8C7A" }, // sage
  { sky: "#F4D9C6", sun: "#FFF3D6", far: "#D9A08C", near: "#B7705F" }, // peach
  { sky: "#D8DFF0", sun: "#FDEFD0", far: "#9BA7D0", near: "#6F7DB0" }, // dusk
  { sky: "#E9E2B8", sun: "#FFF6DA", far: "#B5C47F", near: "#76894A" }, // meadow
  { sky: "#F1CFCF", sun: "#FFF0DD", far: "#C98F9A", near: "#9C5E6E" }, // rose
  { sky: "#C9E4DE", sun: "#FFF1C9", far: "#7FB3B0", near: "#4F8785" }, // lagoon
]

/** Hash sederhana dan deterministik: nama yang sama selalu menghasilkan cover yang sama (aman untuk SSR). */
function hashOf(str: string) {
  let h = 5381
  for (let i = 0; i < str.length; i++) h = ((h * 33) ^ str.charCodeAt(i)) >>> 0
  return h
}

/**
 * Cover generatif: matahari + dua bukit + inisial.
 * Posisi matahari dan tinggi bukit ikut berubah per nama, jadi tiap kartu terasa berbeda.
 */
function EntityCover({ name }: { name: string }) {
  const h = hashOf(name)
  const scene = SCENES[h % SCENES.length]

  const sunX = 30 + ((h >>> 4) % 141) // 30..170
  const sunY = 28 + ((h >>> 21) % 22) // 28..49
  const sunR = 12 + ((h >>> 9) % 9) // 12..20
  const farLift = (h >>> 13) % 16
  const nearLift = (h >>> 17) % 12

  const initial = Array.from(name.trim())[0]?.toUpperCase() ?? ""

  return (
    <span className="relative min-h-32 flex-1 overflow-hidden rounded-lg">
      <svg
        viewBox="0 0 200 120"
        preserveAspectRatio="xMidYMax slice"
        aria-hidden="true"
        focusable="false"
        className="absolute inset-0 h-full w-full"
      >
        <rect width="200" height="120" fill={scene.sky} />
        <circle cx={sunX} cy={sunY} r={sunR} fill={scene.sun} />
        <path
          d={`M0 ${72 - farLift} C 50 ${50 - farLift}, 120 ${100 - farLift}, 200 ${62 - farLift} V120 H0 Z`}
          fill={scene.far}
        />
        <path
          d={`M0 ${98 - nearLift} C 60 ${78 - nearLift}, 130 ${112 - nearLift}, 200 ${88 - nearLift} V120 H0 Z`}
          fill={scene.near}
        />
      </svg>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-2 left-3 select-none text-[56px] font-medium leading-none text-[#FFFBF4]/90"
      >
        {initial}
      </span>
    </span>
  )
}

/**
 * Flip card.
 * - Mouse: hover to peek, click to pin.
 * - Touch / keyboard: tap, Enter or Space toggles.
 * Both faces share one grid cell, so the card is as tall as its taller face (no fixed heights).
 */
export function RelatedEntityCard({ entity }: { entity: RelatedEntity }) {
  const [hovered, setHovered] = useState(false)
  const [pinned, setPinned] = useState(false)
  const flipped = hovered || pinned
  const detailsId = useId()

  return (
    <button
      type="button"
      aria-label={`${entity.name} (${KIND_LABEL[entity.kind]})`}
      aria-expanded={flipped}
      aria-describedby={flipped ? detailsId : undefined}
      onClick={() => setPinned((p) => !p)}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") setHovered(true)
      }}
      onPointerLeave={() => setHovered(false)}
      className="block h-full w-full text-left [perspective:1000px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B23A2E]"
    >
      <span
        className="grid h-full transition-transform duration-500 ease-out [transform-style:preserve-3d] motion-reduce:transition-none"
        style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        {/* Front */}
        <span
          aria-hidden={flipped}
          className="col-start-1 row-start-1 flex min-h-56 flex-col gap-3 rounded-xl border border-[#E8D8C3] bg-[#FFFBF4] p-2.5 [backface-visibility:hidden]"
        >
          <EntityCover name={entity.name} />

          <span className="flex items-baseline justify-between gap-3 px-2.5 pb-2">
            <span className="text-lg font-medium text-[#2A1810]">{entity.name}</span>
            <span className="shrink-0 text-[13px] font-medium tracking-[0.02em] text-[#B23A2E]">
              See details
            </span>
          </span>
        </span>

        {/* Back */}
        <span
          id={detailsId}
          aria-hidden={!flipped}
          className="col-start-1 row-start-1 flex min-h-56 flex-col gap-3 rounded-xl bg-[#B23A2E] p-6 text-[#FDF6EC] [backface-visibility:hidden] [transform:rotateY(180deg)]"
        >
          <span className="text-lg font-medium">{entity.name}</span>

          {entity.description && (
            <span className="line-clamp-4 text-[15px] leading-snug">{entity.description}</span>
          )}

          {entity.details.map((d) => (
            <span key={d.label} className="flex justify-between gap-4">
              <span className="text-[13px] font-medium tracking-[0.02em]">{d.label}</span>
              <span className="text-right">{d.value}</span>
            </span>
          ))}

          {entity.details.length === 0 && !entity.description && (
            <span>No extra details in the API.</span>
          )}
        </span>
      </span>
    </button>
  )
}
