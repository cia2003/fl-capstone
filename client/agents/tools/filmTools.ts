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
        description: "Ask the user about their movie preferences when more information is needed before making a recommendations.",
        inputSchema: preferenceQuestionSchema,
    })
})