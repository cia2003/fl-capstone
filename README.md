# Ghibli Compass

An AI-assisted fan project for exploring and discovering Studio Ghibli films.

[Ghibli Compass Demo Project](https://fl-capstone.vercel.app/)

## What It Does

Ghibli Compass is a frontend project for exploring Studio Ghibli films.

Users can:
- Browse and explore films by category.
- View film details.
- Save films to a watchlist.
- Use AI to find film recommendations through preference questions.
- Ask the AI for information or story summaries about a film.

## Screenshots

### Desktop

<table> 
    <tr>
        <td>Landing Page</td>
        <td>Find-My-Film Page</td>
    </tr>
    <tr> 
        <td> 
            <img src="/client/public/images/readme/desktop-landing-page.png" width="400"><br> 
            <sub>Landing Page</sub> 
        </td> 
        <td> 
            <img src="/client/public/images/readme/desktop-find-my-film-page.png" width="400"><br> 
            <sub>AI Chat</sub> 
        </td> 
    </tr> 
</table>


### Mobile

<table>
    <tr>
        <td>Landing Page</td>
        <td>Find-My-Film Page</td>
    </tr> 
    <tr> 
        <td> 
            <img src="/client/public/images/readme/mobile-landing-page.png" width="200"><br> 
            <sub>Landing</sub> 
        </td> 
        <td> 
            <img src="/client/public/images/readme/mobile-find-my-film-page.png" width="200"><br> 
            <sub>AI Chat</sub> 
        </td> 
    </tr> 
</table>


## Run Instructions

Clone the repository:

```bash
git clone https://github.com/cia2003/fl-capstone.git
```

Go to the `client` directory and install dependencies:

```bash
cd client
npm install
npm run dev
```

The app runs at http://localhost:3000.

To run tests:

```bash
npm run test
```

To build:

```bash
npm run build
```

## Environment Variables

| Variable                       | Description                        |
| ------------------------------ | ----------------------------------- |
| `NEXT_PUBLIC_API_BASE_URL`     | Base URL for the Studio Ghibli API |
| `GOOGLE_GENERATIVE_AI_API_KEY` | API key for Google Gemini          |

Example:

```
NEXT_PUBLIC_API_BASE_URL=https://ghibliapi.dev
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

## Architecture Overview

```
client/
├── agents/
│   ├── prompts/
│   └── tools/
├── app/
│   ├── about/
│   ├── api/
│   ├── explore/
│   ├── films/
│   ├── find-my-film/
│   ├── health/
│   └── watchlist/
├── components/
├── hooks/
├── lib/
├── public/
├── schema/
├── tests/
├── types/
├── next.config.ts
├── playwright.config.ts
├── vitest.config.ts
└── package.json
```

### AI Recommendation Flow

```
User
 ↓
Next.js Chat UI
 ↓
AI API Route
 ↓
Fetch Ghibli films
 ↓
streamText + Google Gemini
 ↓
AI Tools
 ├── askMoviePreferences
 ├── recommendMovies
 └── getFilmInformation
 ↓
Stream response to User
```

Film data comes from the Studio Ghibli API and is provided to the AI before generating a response.


## Key Decisions

- Ghibli API as the film source — keeps AI responses tied to the available film data instead of relying entirely on model knowledge.
- AI tools — recommendations, preference questions, and film information are handled through structured tools rather than plain text responses.
- Streaming — responses are displayed as they are generated instead of making the user wait for the complete response.
- Cookies for watchlist — keeps watchlist persistence simple without introducing a database, since the project focuses primarily on the frontend.
- Vitest — used mainly to test chat message behavior and edge cases.

## How AI Tools Built This

- AI was used as a development assistant throughout the project.
- It helped with the initial project structure, UI ideas, code generation, refactoring, prompts, and test cases. Most feature implementations were initially generated with AI.
- The generated output was still reviewed and revised. I changed parts of the folder structure, refined the visual design, fixed generated code that caused errors, and made the final implementation decisions.
- AI was also used to help write this README, with the project details and decisions coming from the actual implementation.