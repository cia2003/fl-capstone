import { Film } from "@/types";
import MovieRecommendations from "./MovieRecommendations";
import FilmInformation from "./FilmInformation";
import MoviePreferences from "./MoviePreferences";

type ToolPartProps = {
  part: any;
  addToolOutput: any;
  films: Film[];
};

export default function ToolPart({
  part,
  addToolOutput,
  films,
}: ToolPartProps) {
  switch (part.type) {
    case "tool-recommendMovies":
      return (
        <MovieRecommendations
          part={part}
          films={films}
        />
      );

    case "tool-getFilmInformation":
      return (
        <FilmInformation part={part} />
      );

    case "tool-askMoviePreferences":
      return (
        <MoviePreferences
          part={part}
          addToolOutput={addToolOutput}
        />
      );

    default:
      return null;
  }
}