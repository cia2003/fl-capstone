import Link from "next/link";
import Image from "next/image";

export function Footer() {
    return (
        <footer className="bg-black py-4 text-white px-5 md:px-10 lg:px-16 min-[1440px]:px-24">
            <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-4 lg:grid-cols-2 py-section-mobile md:py-section-desktop md:gap-12">
                <div className="self-start">
                    <Link href="/" className="flex items-center gap-3 font-heading text-h2 text-white font-semibold no-underline">
                        <Image src="/images/logo.png" alt="" width={56} height={56} />
                        Ghibli Compass
                    </Link>
                    <p>Find your next favorite Studio Ghibli film!</p>                    
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 justify-between gap-4">
                    <div className="self-start">
                        <h2 className="text-h3 font-semibold text-yellow-400 ">Movies</h2>
                        <div className="border mb-4 w-20"></div>
                        <ul className="flex flex-col gap-1">
                            <li><Link href="/explore" className="no-underline hover:underline whitespace-nowrap text-white">All Movies</Link></li>
                            <li><Link href="/explore/release" className="no-underline hover:underline whitespace-nowrap text-white">By Release Year</Link></li>
                            <li><Link href="/explore/director" className="no-underline hover:underline whitespace-nowrap text-white">By Director</Link></li>
                        </ul>
                    </div>
                    <div className="self-start">
                        <h2 className="text-h3 font-semibold text-yellow-400">Explore</h2>
                        <div className="border mb-4 w-20"></div>
                        <ul className="flex flex-col gap-1">
                            <li><Link href="/find-my-film" className="no-underline hover:underline whitespace-nowrap text-white">Find My Film</Link></li>
                            <li><Link href="/watchlist" className="no-underline hover:underline whitespace-nowrap text-white">Watchlist</Link></li>
                        </ul>
                    </div>
                    <div className="self-start">
                        <h2 className="text-h3 font-semibold text-yellow-400">About</h2>
                        <div className="border mb-4 w-20"></div>
                        <ul className="flex flex-col gap-1">
                            <li><Link href="/about" className="no-underline hover:underline whitespace-nowrap text-white">About Ghibli Compass</Link></li>
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