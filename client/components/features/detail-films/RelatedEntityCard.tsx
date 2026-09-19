"use client"

import { useId, useState } from "react"
import { KIND_LABEL, type RelatedEntity } from "@/types/entities"

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
          className="col-start-1 row-start-1 flex min-h-40 flex-col justify-between gap-4 rounded-xl border border-[#E8D8C3] bg-[#FFFBF4] p-6 [backface-visibility:hidden]"
        >
          <span className="text-lg font-medium text-[#2A1810]">{entity.name}</span>
          <span className="text-[13px] font-medium tracking-[0.02em] text-[#B23A2E]">
            See details
          </span>
        </span>

        {/* Back */}
        <span
          id={detailsId}
          aria-hidden={!flipped}
          className="col-start-1 row-start-1 flex min-h-40 flex-col gap-3 rounded-xl bg-[#B23A2E] p-6 text-[#FDF6EC] [backface-visibility:hidden] [transform:rotateY(180deg)]"
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
