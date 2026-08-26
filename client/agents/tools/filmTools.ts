import { filmInformationSchema, preferenceQuestionSchema, recommendationSchema } from "@/schema/recommendation";
import { Film } from "@/types";
import { tool } from "ai";


export const filmTools = (films: Film[]) => ({
    getMoviesRecommendations: tool({
        description: "Find up to 3 Studio Ghibli films that best match the user's request as a recommendation", 
        inputSchema: recommendationSchema, 
        execute: async ({  message, recommendations }) => {
            return {
                message,
                recommendations
            }
        },
    }),
    getFilmInformation: tool({
        description: "Get information about a Studio Ghibli film when the user asks about its story, plot, or general information.",
        inputSchema: filmInformationSchema,
        execute: async ({ title }) => {
            const film = films.find(
                (film) => film.title.toLowerCase() === title.toLowerCase()
            )

            if (!film) {
                throw new Error(`Film "${title}" was not found.`)
            }

            return {
            message: `This movie was released in ${film.release_date} and was directed by ${film.director} and produced by ${film.producer}. 
            It runs for ${film.running_time} minutes and has a Rotten Tomatoes score of ${film.rt_score}.\n\n 
            
            ${film.description}`
        }
        }
    }), 
    askMoviePreferences: tool({
        description: "Ask the user about their movie preferences when more information is needed before making a recommendations.",
        inputSchema: preferenceQuestionSchema,
    })
})