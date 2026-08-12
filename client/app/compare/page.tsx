type Props = {
    searchParams: Promise<{
        breeds?: string;
    }>
}

export default async function Page({ searchParams }: Props) {
    const { breeds } = await searchParams
    const selectedBreeds = breeds?.split(",") ?? []
    return (
        <main role="main">
            <div className="page-section">
                <h1 className="font-heading text-h1 font-semibold">Compare Breeds Page</h1>
                <p className="font-body text-body">
                    Selected breeds:
                </p>
                <ul>
                    {
                        selectedBreeds.map((breed) => (
                            <li key={breed}>Breed {breed}</li>
                        )    
                            
                        )
                    }
                </ul>
            </div>
        </main>
    )
}