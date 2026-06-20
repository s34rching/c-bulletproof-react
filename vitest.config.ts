/// <reference types="vitest" />

import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: './',
  plugins: [react(), viteTsconfigPaths()],
  test: {
    fileParallelism: false,
    globals: true,
    environment: 'jsdom',
    setupFiles: './testing/shared/setup-tests.ts',
    exclude: ['**/node_modules/**', '**/testing/e2e/**'],
    coverage: {
      include: ['src/**'],
    },
  },
});
