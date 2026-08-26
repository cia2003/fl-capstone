import z from "zod"

export const recommendationSchema = z.object({
    message: z.string().describe("opening message must be natural, relevant, and under 50 words. Do not repeat film titles, scores, or descriptions."),
    recommendations: z.array(
        z.object({
            filmId: z.string(), 
            score: z.number().min(0).max(100), 
            reasoning: z.string(),
        })
    ).max(3),
})

export const filmInformationSchema = z.object({
    title: z.string().trim().min(1)
})

export const preferenceQuestionSchema = z.object({
    question: z.string(),
    options: z.array(z.string()).max(4)
})