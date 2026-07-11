# AGENTS.md

## Commands
Build: npm run build (tsc + esbuild, outputs to dist/)
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