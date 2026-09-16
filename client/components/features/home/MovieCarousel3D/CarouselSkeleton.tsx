import { Skeleton } from "@/components/ui/Skeleton";

type CarouselSkeletonProps = {
  /** Jumlah kartu placeholder yang ditampilkan */
  cardCount?: number;
  /** Tinggi area canvas/carousel, samakan dengan komponen aslinya */
  height?: number;
  /** Tampilkan placeholder judul + deskripsi di atas */
  showHeader?: boolean;
  /** Tampilkan placeholder baris kontrol (panah, dots) di bawah */
  showControls?: boolean;
  className?: string;
};

export function CarouselSkeleton({
  cardCount = 5,
  height = 500,
  showHeader = true,
  showControls = true,
  className,
}: CarouselSkeletonProps) {
  return (
    <div className={className}>
      {showHeader && (
        <div className="mx-auto max-w-[1280px] pt-section-mobile md:pt-section-desktop">
          <Skeleton className="mb-4 h-7 w-48" />
          <Skeleton className="mb-6 h-4 w-full max-w-md" />
        </div>
      )}

      <div
        style={{ height }}
        className="flex w-full items-center justify-center gap-3 overflow-hidden"
      >
        {Array.from({ length: cardCount }).map((_, i) => {
          // kartu tengah lebih besar & lebih terang, meniru efek carousel 3D
          const distanceFromCenter = Math.abs(i - Math.floor(cardCount / 2));
          const scale = 1 - distanceFromCenter * 0.12;
          const opacity = 1 - distanceFromCenter * 0.2;

          return (
            <Skeleton
              key={i}
              className="aspect-[2.85/4.05] shrink-0 rounded-xl"
              style={{
                width: `${180 * scale}px`,
                opacity: Math.max(opacity, 0.4),
              }}
            />
          );
        })}
      </div>

      {showControls && (
        <div className="-mt-8 flex items-center justify-center gap-4 sm:-mt-18">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex gap-2">
            {Array.from({ length: cardCount }).map((_, i) => (
              <Skeleton key={i} className="h-2 w-2 rounded-full" />
            ))}
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      )}
    </div>
  );
}