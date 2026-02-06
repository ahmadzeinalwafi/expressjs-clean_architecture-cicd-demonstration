import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ['./tests/setup.js', 'dotenv/config'],
    fileParallelism: false,
    maxConcurrency: 1,
    sequence: {
      shuffle: false,
    },
  },
});