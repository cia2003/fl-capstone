import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-black py-4 text-white px-5 md:px-10 lg:px-16 min-[1440px]:px-24">
            <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-4 lg:grid-cols-2 py-section-mobile md:py-section-desktop md:gap-12">
                <div className="self-start">
                    <Link href="/" className="font-heading text-h2 font-semibold no-underline">Ghibli Compass</Link>
                    <p>Find your next favorite Studio Ghibli film!</p>                    
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 justify-between gap-4">
                    <div className="self-start">
                        <h2 className="text-h3 font-semibold">Movies</h2>
                        <ul className="flex flex-col gap-1">
                            <li><Link href="/health" className="no-underline hover:underline whitespace-nowrap">All Movies</Link></li>
                            <li><Link href="/find-my-film" className="no-underline hover:underline whitespace-nowrap">By Release Year</Link></li>
                            <li><Link href="/watchlist" className="no-underline hover:underline whitespace-nowrap">By Rating</Link></li>
                            <li><Link href="/watchlist" className="no-underline hover:underline whitespace-nowrap">By Runtime</Link></li>
                        </ul>
                    </div>
                    <div className="self-start">
                        <h2 className="text-h3 font-semibold">Explore</h2>
                        <ul className="flex flex-col gap-1">
                            <li><Link href="/health" className="no-underline hover:underline whitespace-nowrap">Find My Film</Link></li>
                            <li><Link href="/find-my-film" className="no-underline hover:underline whitespace-nowrap">Themes</Link></li>
                            <li><Link href="/watchlist" className="no-underline hover:underline whitespace-nowrap">Watchlist</Link></li>
                        </ul>
                    </div>
                    <div className="self-start">
                        <h2 className="text-h3 font-semibold">About</h2>
                        <ul className="flex flex-col gap-1">
                            <li><Link href="/health" className="no-underline hover:underline whitespace-nowrap">About Ghibli Compass</Link></li>
                            <li><Link href="/find-my-film" className="no-underline hover:underline whitespace-nowrap">About the Data</Link></li>
                            <li><Link href="/watchlist" className="no-underline hover:underline whitespace-nowrap">FAQ</Link></li>
                        </ul>
                    </div>                    
                </div>

            </div>
            <div>
                <p className="text-center text-sm text-white/50">© 2024 Ghibli Compass. All rights reserved.</p>
            </div>
        </footer>
    );
}