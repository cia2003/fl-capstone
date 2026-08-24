import { recommendationSchema } from "@/schema/recommendation";
import { tool } from "ai";


export const filmTools = {
    recommendFilms: tool({
        description: "Return film recommendations when the user clearly wants film recommendations.", 
        inputSchema: recommendationSchema, 
        execute: async ({  recommendations }) => {
            return recommendations
        },
    }),
}