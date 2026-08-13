const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

export async function getARandomImageCat() {
    const response = await fetch(`${BASE_URL}/images/search`, {
        headers: {
            Authorization: `Bearer ${API_KEY}`,
        },
    })

    if (!response.ok) {
        throw new Error("Failed to fetch images")
    }

    return response.json()
}

export async function getTenRandomImagesCat() {
    const response = await fetch(`${BASE_URL}/images/search?limit=10`, {
        headers: {
            Authorization: `Bearer ${API_KEY}`,
        },
    })

    console.log(`${BASE_URL}/images/search?limit=10`)

    if (!response.ok) {
        throw new Error("Failed to fetch images")
    }

    return response.json()
}