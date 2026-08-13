type Props = {
    params: Promise<{
        id: string;
    }>
}

export default async function Page( { params }: Props ) {
    const { id } = await params

    return (
        <main role="main" className="mx-5 md:mx-10 lg:mx-16 min-[1440px]:mx-24 min-h-[calc(100vh-64px)]">
            <section className="py-8 md:py-16 text-center">
                <h1 className="font-heading text-h1 font-semibold">welcome to breeds detail page</h1>
                <p className="font-body text-body leading-relaxed">Here is the breed {id} </p>
                <a href="/compare?breeds=a,b,c" className="font-body text-body font-semibold leading-relaxed text-blue-500">Go to compare detail</a>
            </section>
        </main>

    )
}
