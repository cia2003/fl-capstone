type Props = {
    params: Promise<{
        id: string;
    }>
}

export default async function Page( { params }: Props ) {
    const { id } = await params

    return (
        <main role="main">
            <div className="page-section">
                <h1 className="font-heading text-h1 font-semibold">welcome to breeds detail page</h1>
                <p className="font-body text-body">Here is the breed {id} </p>
                <a href="/compare?breeds=a,b,c">Go to compare detail</a>
            </div>
        </main>

    )
}