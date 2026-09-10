import { defineConfig } from "vitest/config"
import { fileURLToPath, URL } from "node:url"

const projectRoot = fileURLToPath(new URL("./", import.meta.url))

export default defineConfig({
  resolve: {
    alias: [
      { find: "@", replacement: projectRoot },
      {
        find: /^\.\.\/Tools\/ToolPart$/,
        replacement: fileURLToPath(new URL("./tests/mocks/tool-part.tsx", import.meta.url)),
      },
    ],
  },
  test: {
    environment: "jsdom",
    include: ["tests/components.test.tsx"],
    exclude: ["tests/chat.test.ts", "tests/**/*.spec.ts", "tests/**/*.spec.tsx"],
  },
})
