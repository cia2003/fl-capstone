import { getTenRandomImagesCat } from "@/lib/api/catapi"

export default async function Page() {
    const cats = await getTenRandomImagesCat()

    return (
        <main role="main" className="mx-5 md:mx-10 lg:mx-16 min-[1440px]:mx-24 min-h-[calc(100vh-64px)]">
        <section className="py-8 md:py-16 text-center">
            <h1 className="font-heading text-h1 font-semibold pb-10">API Health Check</h1>
            <div className="grid grid-cols-[1fr] gap-4 md:grid-cols-[1fr_1fr]">
                {cats.map((img: any) => {
                    return (
                        <div key={img.id}>
                            <img src={img.url} alt="cat-image" className="object-cover p-5 justify-self-center border-2 rounded-sm w-100 h-100" />
                        </div>
                    )
                })}
            </div>
        </section>
        </main>        
    )

}