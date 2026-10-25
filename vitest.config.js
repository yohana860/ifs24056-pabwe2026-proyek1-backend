import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    env: { DB_STORAGE: ":memory:", JWT_SECRET: "test-secret" },
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      include: ["src/**/*.js"],
      exclude: ["src/server.js", "src/db/cli.js", "src/config/defaults.js", "**/*.test.js"],
      thresholds: { lines: 100, functions: 100, branches: 100, statements: 100 },
    },
  },
});
