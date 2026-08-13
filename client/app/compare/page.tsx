type Props = {
    searchParams: Promise<{
        breeds?: string;
    }>
}

export default async function Page({ searchParams }: Props) {
    const { breeds } = await searchParams
    const selectedBreeds = breeds?.split(",") ?? []
    return (
        <main role="main" className="mx-5 md:mx-10 lg:mx-16 min-[1440px]:mx-24 min-h-[calc(100vh-64px)]">
            <section className="py-8 md:py-16 text-center">
                <h1 className="font-heading text-h1 font-semibold">Compare Breeds Page</h1>
                <p className="font-body text-body leading-relaxed">
                    Selected breeds:
                </p>
                <ul>
                    {
                        selectedBreeds.map((breed) => (
                            <li key={breed} className="font-body text-body font-semibold leading-relaxed">Breed {breed}</li>
                        )    
                            
                        )
                    }
                </ul>
            </section>
        </main>
    )
}
