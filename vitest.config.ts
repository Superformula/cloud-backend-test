/// <reference types="vitest" />

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    setupFiles: './setupTests.ts',
    testTimeout: 30000,
    environment: 'node',
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
});

