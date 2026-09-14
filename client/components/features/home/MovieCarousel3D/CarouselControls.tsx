import type { Film } from "@/types"
import Link from "next/link"

export type CarouselControlValues = {
    radius: number
    imageWidth: number
    imageHeight: number
    cornerRadius: number
    bendAmount: number
    backgroundColor: string
    centerOpacity: number
    adjacentOpacity: number
    farOpacity: number
    friction: number
    wheelSensitivity: number
    dragSensitivity: number
    enableSnapping: boolean
}

type CarouselControlsProps = {
    activeIndex: number, 
    films: Film[],
    values: CarouselControlValues,
    onChange: <Key extends keyof CarouselControlValues>(key: Key, value: CarouselControlValues[Key]) => void,
    onPrevious: () => void, 
    onNext: () => void, 
    onSelect: (index: number) => void
}

export function CarouselControls({
    activeIndex, 
    films, 
    values,
    onChange,
    onPrevious, 
    onNext, 
    onSelect
}: CarouselControlsProps) {
    const activeFilm = films[activeIndex]
    return (
        <div className="mx-auto max-w-3xl px-4">
            {activeFilm && (
                <Link
                    href={`/films/${activeFilm.id}`}
                    className="mb-4 block text-center transition-opacity hover:opacity-80"
                >
                    <h3 className="font-heading text-lg font-semibold text-[#2A1810]">
                        {activeFilm.title}
                    </h3>
                    <p className="mt-1 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                        <span>★ {activeFilm.rt_score}%</span>
                        <span aria-hidden="true">·</span>
                        <span>{activeFilm.running_time} min</span>
                        <span aria-hidden="true">·</span>
                        <span>Dir. {activeFilm.director}</span>
                    </p>
                </Link>
            )}
            <div className="flex items-center justify-center gap-4">
            <button
                type="button"
                onClick={onPrevious}
                aria-label="Previous film"
                    className="flex size-10 items-center justify-center rounded-lg border-[1.5px] border-[#B23A2E] bg-transparent text-lg text-[#B23A2E] transition-colors hover:bg-[#B23A2E] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A017]"
            >‹</button>

            {/* Dots */}
            <div className="flex items-center gap-2" role="tablist" aria-label="Select film">
                {films.map((film, index) => {
                        const isActive = index === activeIndex

                        return (
                        <button
                        key={film.id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        aria-label={`Show ${film.title}`}
                        onClick={() => onSelect(index)}
                        className={`
                            h-2 rounded-full border-0 p-0
                            transition-all duration-200
                            ${
                            isActive
                                ? "w-5 bg-[#B23A2E]"
                                : "w-2 bg-[#E3D5C0] hover:bg-[#B23A2E]/50"
                            }
                        `}
                        />
                        );
                    })}
            </div>

            {/* Next */}
            <button
                type="button"
                onClick={onNext}
                aria-label="Next film"
                className="flex size-10 items-center justify-center rounded-lg border-[1.5px] border-[#B23A2E] bg-transparent text-lg text-[#B23A2E] transition-colors hover:bg-[#B23A2E] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A017]"
            >
                ›
                </button>
            </div>
        </div>
    )
}