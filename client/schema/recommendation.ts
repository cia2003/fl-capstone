import z from "zod"

// export const filmKeywordSchema = z.object({
//     keyword: z.string().trim().min(1)
// })

export const recommendationSchema = z.object({
    recommendations: z.array(
        z.object({
            filmId: z.string(), 
            score: z.number().min(0).max(100).describe("Match score as a percentage from 0 to 100. For example, 90 means 90% match, not 0.90."), 
            reasoning: z.string(),
        })
    ).max(3),
})

export const filmInformationSchema = z.object({
    title: z.string().trim().min(3, "Please at lease return three alphabets"), 
    explanation: z.string().describe("This is an summary explanation of a film: who is the main character, when its created, and what this story about")
})

export const preferenceQuestionSchema = z.object({
    question: z.string(),
    options: z.array(z.string()).max(4)
})