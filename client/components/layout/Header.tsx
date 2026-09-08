import Link from "next/link";
import Image from "next/image";

export default function Header() {
    return (
        <header className="sticky top-0 z-50 border-b border-primary/20 bg-background p-5">
          <nav className="mx-auto flex flex-col max-w-[1280px] items-center justify-between gap-4 md:flex-row" aria-label="Main navigation">
            <Link href="/" className="flex items-center gap-2 font-heading text-h3 font-semibold no-underline">
                <Image src="/images/logo.png" alt="" width={40} height={40} />
                Ghibli Compass
            </Link>
            <div className="text-center">
                {/* <Link href="/health" className="rounded-button border-primary px-button-x py-button-y text-sm font-semibold no-underline">Health</Link> */}
                <Link href="/find-my-film" className="rounded-button border-primary px-button-x py-button-y text-sm font-semibold no-underline">Finding</Link> 
                <Link href="/watchlist" className="rounded-button border-primary px-button-x py-button-y text-sm font-semibold no-underline">Watchlist</Link>
                <Link href="/about" className="rounded-button border-primary px-button-x py-button-y text-sm font-semibold no-underline">About</Link> 
            </div>
            
          </nav>
        </header>
    )
}