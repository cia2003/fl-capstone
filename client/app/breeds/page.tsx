export default function Page() {
    return (
        <main role="main" className="mx-5 md:mx-10 lg:mx-16 min-[1440px]:mx-24 min-h-[calc(100vh-64px)]">
        <section className="py-8 md:py-16 text-center">
            <h1 className="font-heading text-h1 font-semibold">welcome to breeds page</h1>
            <a href="/breeds/1" className="font-body text-body font-semibold leading-relaxed text-blue-500">Go to breeds detail page</a>
        </section>
        </main>
    )
}
