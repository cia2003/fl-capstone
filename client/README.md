# Ghibli Compass

Next.js frontend for browsing Studio Ghibli films, saving a local watchlist, and finding recommendations from a free-text prompt.

## Structure

- app/ for routes and route handlers
- components/ for reusable UI and feature modules
- lib/ for API helpers and validation schemas
- hooks/ for client-side state hooks
- agents/ for AI prompt and client wrappers
- __tests__/ for component and flow tests


## AI Tool Contracts

Ghibli Compass uses AI tools with Zod-validated inputs and structured outputs rendered as UI components.

### `recommendMovies`

**Input:**

```ts
{
  recommendations: {
    filmId: string;
    score: number;      // 0–100
    reasoning: string;
  }[];
}
```

**Return:**

```ts
{
  message: string;
  recommendations: {
    filmId: string;
    score: number;
    reasoning: string;
  }[];
}
```

**UI:** `RankedResultList`

### `getFilmInformation`

**Input:**

```ts
{
  title: string;
  explanation: string;
}
```

**Return:**

```ts
{
  message: string;
  film: Film;
}
```

**UI:** `FilmCard`

### `askMoviePreferences`

**Input:**

```ts
{
  question: string;
  options: string[];
}
```

**Output:** User-selected preference returned through `addToolOutput()`.

**UI:** Interactive preference buttons.

### Tool Lifecycle

All tools render four states: `input-streaming`, `input-available`, `output-available`, and `output-error`.
