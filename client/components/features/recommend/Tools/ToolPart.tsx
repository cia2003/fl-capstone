import { Film } from "@/types";
import MovieRecommendations from "./MovieRecommendations";
import FilmInformation from "./FilmInformation";
import MoviePreferences from "./MoviePreferences";
import { FilmToolPart } from "@/types/chat";

type ToolPartProps = {
  part: FilmToolPart;
  addToolOutput: any;
};

export default function ToolPart({
  part,
  addToolOutput,
}: ToolPartProps) {
  switch (part.type) {
    case "tool-recommendMovies":
      return (
        <MovieRecommendations
          part={part}
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