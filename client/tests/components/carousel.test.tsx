import { act, render, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { MovieCarousel3DLoader } from "@/components/features/home/MovieCarousel3D/MovieCarousel3DLoader"
import { CarouselSkeleton } from "@/components/features/home/MovieCarousel3D/CarouselSkeleton"
import type { Film } from "@/types"

// CarouselSkeleton TETAP memakai implementasi aslinya (importOriginal),
// hanya dibungkus vi.fn supaya kita bisa mengecek kapan & dengan props
// apa ia dipanggil. Tidak ada perubahan sama sekali pada source aslinya.
vi.mock(
  "@/components/features/home/MovieCarousel3D/CarouselSkeleton",
  async (importOriginal) => {
    const actual =
      await importOriginal<
        typeof import("@/components/features/home/MovieCarousel3D/CarouselSkeleton")
      >()

    return {
      ...actual,
      CarouselSkeleton: vi.fn(actual.CarouselSkeleton),
    }
  },
)

// Fallback & carousel 3D di-stub total (bukan komponen yang sedang
// diuji perilakunya di sini), jadi aman diberi properti khusus test.
vi.mock(
  "@/components/features/home/MovieCarousel3D/CarouselFallback",
  () => ({
    __esModule: true,
    default: vi.fn(() => <div data-mock="carousel-fallback" />),
  }),
)

vi.mock(
  "@/components/features/home/MovieCarousel3D/MovieCarousel3D",
  () => ({
    MovieCarousel3D: vi.fn(() => <div data-mock="carousel-3d" />),
  }),
)

import CarouselFallback from "@/components/features/home/MovieCarousel3D/CarouselFallback"
import { MovieCarousel3D } from "@/components/features/home/MovieCarousel3D/MovieCarousel3D"

const mockedSkeleton = vi.mocked(CarouselSkeleton)
const mockedFallback = vi.mocked(CarouselFallback)
const mockedCarousel3D = vi.mocked(MovieCarousel3D)

let intersectionCallback: IntersectionObserverCallback = () => {}

class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null
  readonly rootMargin = ""
  readonly scrollMargin = ""
  readonly thresholds: ReadonlyArray<number> = []

  constructor(callback: IntersectionObserverCallback) {
    intersectionCallback = callback
  }

  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
  takeRecords = vi.fn(() => [])
}

function triggerIntersection(isIntersecting: boolean) {
  act(() => {
    intersectionCallback(
      [{ isIntersecting } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    )
  })
}

const films: Film[] = Array.from({ length: 12 }, (_, index) => ({
  id: `film-${index}`,
  title: `Film ${index}`,
})) as Film[]

describe("MovieCarousel3DLoader", () => {
  beforeEach(() => {
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver)
    // Reset jumlah panggilan mock tiap test, implementasi tetap dipertahankan.
    vi.clearAllMocks()

    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
  })

  it("memanggil CarouselSkeleton (implementasi asli) dengan height yang benar saat state 'checking'", () => {
    render(<MovieCarousel3DLoader films={films} />)

    expect(mockedSkeleton).toHaveBeenCalled()
    expect(mockedSkeleton.mock.calls[0][0]).toMatchObject({ height: 500 })
    expect(mockedFallback).not.toHaveBeenCalled()
    expect(mockedCarousel3D).not.toHaveBeenCalled()
  })

  it("belum memanggil Fallback/3D sebelum elemen masuk viewport", () => {
    render(<MovieCarousel3DLoader films={films} />)

    // Callback IntersectionObserver belum pernah dipicu -> state tetap 'checking'.
    expect(mockedSkeleton).toHaveBeenCalled()
    expect(mockedFallback).not.toHaveBeenCalled()
    expect(mockedCarousel3D).not.toHaveBeenCalled()
  })

  it("berhenti memanggil skeleton lalu berpindah ke fallback saat GPU tidak didukung", async () => {
    render(<MovieCarousel3DLoader films={films} />)

    expect(mockedSkeleton).toHaveBeenCalled()

    // navigator.gpu tidak ada di jsdom -> canRunCarousel3D() = false -> "fallback".
    triggerIntersection(true)

    // Selagi transisi berlangsung, komponen bisa render ulang beberapa kali
    // sambil masih di state 'checking' (setIsVisible/setHasEnteredViewport
    // dulu, baru state berpindah di effect berikutnya) -- jadi CarouselSkeleton
    // wajar terpanggil lagi di fase ini. Yang penting: begitu Fallback sudah
    // tampil, tidak ada panggilan skeleton baru SETELAH itu.
    await waitFor(() => {
      expect(mockedFallback).toHaveBeenCalled()
    })

    const callsAfterSettled = mockedSkeleton.mock.calls.length
    await waitFor(() => {
      expect(mockedSkeleton.mock.calls.length).toBe(callsAfterSettled)
    })

    expect(mockedCarousel3D).not.toHaveBeenCalled()
  })

  it("berpindah ke carousel 3D saat perangkat mendukungnya", async () => {
    Object.defineProperty(window.navigator, "gpu", {
      value: {},
      configurable: true,
    })
    Object.defineProperty(window.navigator, "hardwareConcurrency", {
      value: 8,
      configurable: true,
    })
    Object.defineProperty(window.navigator, "deviceMemory", {
      value: 8,
      configurable: true,
    })

    render(<MovieCarousel3DLoader films={films} />)

    triggerIntersection(true)

    await waitFor(() => {
      expect(mockedCarousel3D).toHaveBeenCalled()
    })

    const callsAfterSettled = mockedSkeleton.mock.calls.length
    await waitFor(() => {
      expect(mockedSkeleton.mock.calls.length).toBe(callsAfterSettled)
    })

    expect(mockedFallback).not.toHaveBeenCalled()
  })
})