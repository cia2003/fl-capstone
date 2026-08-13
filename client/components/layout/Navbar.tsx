export function Navbar() {
    return (
        <nav className="text-center flex flex-col sm:flex-row">
            <a href="/" className="font-body text-body font-semibold leading-relaxed text-blue-500 px-5">Home</a>
            <a href="/breeds" className="font-body text-body font-semibold leading-relaxed text-blue-500 px-5">Explore</a> 
            <a href="/profile" className="font-body text-body font-semibold leading-relaxed text-blue-500 px-5">Quiz</a>
            <a href="/health" className="font-body text-body font-semibold leading-relaxed text-blue-500 px-5">Health</a>
        </nav>
    )
}