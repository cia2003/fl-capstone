import { FilmUIMessage } from "@/types/chat";

type ToolPartProps = {
    part: any, 
    addToolOutput: any
}

export default function ToolPart({
    part, addToolOutput
}: ToolPartProps) {
    switch (part.type) {
        case 'tool-getMoviesRecommendations':
            return (
                <div></div>
            )
        
        case 'tool-getFilmInformation':
            return (
                <div></div>
            )
        
        case 'tool-askMoviePreferences':
            return (
                <div></div>
            )
    }
}