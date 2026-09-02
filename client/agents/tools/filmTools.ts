import { filmInformationSchema, preferenceQuestionSchema, recommendationSchema } from "@/schema/recommendation";
import { Film } from "@/types";
import { tool } from "ai";


export const filmTools = (films: Film[]) => ({
    recommendMovies: tool({
        description: "Recommend up to 3 Studio Ghibli films that best match the user's request.", 
        inputSchema: recommendationSchema, 
        execute: async ({ recommendations }) => {
        const validRecommendations = recommendations.filter((recommendation) =>
            films.some((film) => film.id === recommendation.filmId)
        );

        return {
            message:
            "I found a few Studio Ghibli films that match what you're looking for.",
            recommendations: validRecommendations,
        };
        },
    }),
    getFilmInformation: tool({
        description: "Get information about a Studio Ghibli film when the user asks about its story, plot, or general information.",
        inputSchema: filmInformationSchema,
        execute: async ({ title, explanation }) => {
            const film = films.find(
                (film) => film.title.toLowerCase() === title.toLowerCase()
            )

            if (!film) {
                throw new Error(`Film "${title}" was not found.`)
            }

            return {
                message: explanation,
                film: film
        }
        }
    }), 
    askMoviePreferences: tool({
        description:
            "Ask the user about their movie preferences when more information is needed before making recommendations. Use this tool when the user has not provided enough preferences or when their requested movie has no matching result. Ask about preferences such as genre, mood, themes, or story type. Do not use this tool when the user is asking for information about a specific film. After the user returns the tool output, use that preference as the input for recommendMovies.",
        inputSchema: preferenceQuestionSchema,
    })
})