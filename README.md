# Ghibli Compass

Next.js frontend for browsing Studio Ghibli films, saving a local watchlist, and finding recommendations from a free-text prompt.

## Structure

- app/ for routes and route handlers
- components/ for reusable UI and feature modules
- lib/ for API helpers and validation schemas
- hooks/ for client-side state hooks
- agents/ for AI prompt and client wrappers
- __tests__/ for component and flow tests

## 3D Movie Carousel

The home page includes a lazy-loaded React Three Fiber carousel with a Three.js WebGPU renderer and poster textures from the nine highest-rated films. It supports horizontal drag/swipe, horizontal wheel input, snapping, previous/next controls, and clicking a poster to open its film detail page.

For reduced-motion preferences, missing WebGPU, or devices with limited CPU/memory hints, the page uses a clickable static poster grid instead of loading the 3D chunk. The carousel keeps the film count at nine and loads only those poster textures. No GLB models or additional large runtime libraries are used.

### FE-10 Performance Check

The 3D carousel was tested using Chrome DevTools:

- **Poster textures:** 9 posters
- **Total transferred size:** approximately 1.43 MB
- **Frame rate:** approximately 141–144 FPS during carousel interaction, measured using Rendering → Frame rendering stats
- **Mobile:** carousel drag/swipe, scrolling, and film selection remained usable
- **Reduced motion:** the 3D carousel is replaced by a clickable static poster grid

With more time, I would add subtle poster animations to make the carousel feel more alive and enable automatic rotation after a few seconds of user inactivity.


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
