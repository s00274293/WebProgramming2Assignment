import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: './src/tests/setup.ts',
    globals: true, 
    environment: 'node',
    clearMocks: true,
    restoreMocks: true,
  },
});