import z from "zod";


export const recommendationSchema = z.object({
    recommendations: z.array(
        z.object({
            filmId: z.string(), 
            score: z.number().min(0).max(100), 
            reasoning: z.string(),
        })
    ).max(3),
})