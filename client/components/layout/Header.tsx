import Link from "next/link";

export default function Header() {
    return (
        <header className="mx-5 border-b border-primary/20 py-5 md:mx-10 lg:mx-16 min-[1440px]:mx-24">
          <nav className="mx-auto flex flex-col max-w-[1280px] items-center justify-between gap-4 md:flex-row" aria-label="Main navigation">
            <Link href="/" className="font-heading text-h3 font-semibold no-underline">Ghibli Compass</Link>
            <div className="text-center">
                <Link href="/health" className="rounded-button border-primary px-button-x py-button-y text-sm font-semibold no-underline">Health</Link>
                <Link href="/find-my-film" className="rounded-button border-primary px-button-x py-button-y text-sm font-semibold no-underline">Finding</Link> 
                <Link href="/watchlist" className="rounded-button border-primary px-button-x py-button-y text-sm font-semibold no-underline">Watchlist</Link> 
            </div>
            
          </nav>
        </header>
    )
}