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

Record the following in a desktop and mobile browser before release:

1. In DevTools Network, reload the home page and note the transferred size of the JavaScript/WebGPU chunk and the nine poster requests.
2. In DevTools Performance, record 5–10 seconds while dragging and note the average FPS and any long frames.
3. Repeat on a throttled mobile profile and with `prefers-reduced-motion: reduce`; confirm the static fallback appears and remains clickable.

With more time, the next improvements would be poster thumbnail variants, explicit texture disposal when leaving the route, and automated mobile performance screenshots.


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
