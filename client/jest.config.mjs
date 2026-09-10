import nextJest from "next/jest.js"

const createJestConfig = nextJest({
  dir: "./",
})

const customJestConfig = {
  testEnvironment: "jsdom",
  testMatch: ["<rootDir>/tests/**/*.test.{ts,tsx}"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^react-markdown$": "<rootDir>/tests/mocks/react-markdown.tsx",
    "^\.\.\/Tools\/ToolPart$": "<rootDir>/tests/mocks/tool-part.tsx",
  },
  clearMocks: true,
}

export default createJestConfig(customJestConfig)
