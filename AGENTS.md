# AGENTS.md

## Commands
Build: npm run build (tsc + esbuild, outputs to dist/)
Dev: npm run dev
Test: npm test --forceExit
Lint: npm run lint (fix before commit)

## Tech Stack
- Node.js
- esbuild
- React
- Tailwind CSS

## Conventions
- Use Conventional Commits:
  feat:, fix:, docs:, style:, refactor:, perf:, test:, etc
- Put `BREAKING CHANGE:` in the commit footer (or use `!` after the commit type according to the Conventional Commits specification).
- Never use `--legacy-peer-deps`; update packages instead.

## Project Rules
- Reuse the existing project structure whenever possible. Place reusable UI elements inside the components/ directory instead of creating page-specific implementations. If a component is expected to be used by multiple pages or features, extract it into a standalone component with reusable props rather than duplicating code.

- Before considering a feature complete, run the project's testing suite using the installed testing dependencies. New functionality should include or update tests when appropriate, and generated code should be verified by executing the tests instead of assuming they pass.

- Every component must pass ESLint and all automated tests before it is considered complete. Resolve linting issues and failing tests before committing changes or opening a pull request.